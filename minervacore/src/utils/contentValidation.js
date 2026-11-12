// Validação de conteúdo antes de abrir o Pull Request
//
// Reproduz no navegador as verificações que o build do Docusaurus faz, para
// pegar o problema enquanto a pessoa ainda está no editor — e não depois do
// merge, com o deploy quebrado. Usa o mesmo compilador (@mdx-js/mdx 3), os
// mesmos plugins de sintaxe e o mesmo pré-processamento do Docusaurus 3.9.
//
// Níveis:
//   error       quebra o build ou deixa algo visivelmente quebrado. Bloqueia o PR.
//   warning     provavelmente errado, mas pode ser intencional. Pede confirmação.
//   preexisting problema que já existia antes desta edição. Só informa.

import yaml from 'js-yaml';
import { stringifyFrontmatter } from './markdownFormat.js';
import { SITE_ROOT, docRouteOf, normalizeRoute } from './siteIndex.js';

// Componentes que funcionam em qualquer página sem import: os registrados em
// src/theme/MDXComponents.js e os que o tema do Docusaurus já fornece.
export const GLOBAL_COMPONENTS = new Set(['Video', 'TopicCard', 'TopicGrid', 'Head', 'Details']);

// Nomes que podem aparecer em expressões {…} sem serem declarados
const EXPRESSION_GLOBALS = new Set([
    'Math', 'JSON', 'Date', 'Number', 'String', 'Boolean', 'Array', 'Object',
    'parseInt', 'parseFloat', 'isNaN', 'undefined', 'NaN', 'Infinity', 'console',
    'props', 'toc', 'frontMatter', 'contentTitle', 'metadata', 'assets',
]);

const VOID_TAGS = new Set(['br', 'img', 'hr', 'input', 'meta', 'link', 'source', 'track', 'wbr', 'area', 'col', 'embed']);

const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;
const LARGE_IMAGE_BYTES = 2 * 1024 * 1024;

// ============================================================================
// Pré-processamento (cópia fiel de @docusaurus/utils/lib/markdownUtils.js)
// ============================================================================

const ADMONITION_KEYWORDS = ['secondary', 'info', 'success', 'danger', 'note', 'tip', 'warning', 'important', 'caution'];

function unwrapMdxCodeBlocks(content) {
    const regexp3 = /(?<begin>^|\r?\n)(?<indentStart>\x20*)```(?<spaces>\x20*)mdx-code-block\r?\n(?<children>.*?)\r?\n(?<indentEnd>\x20*)```(?<end>\r?\n|$)/gs;
    const regexp4 = /(?<begin>^|\r?\n)(?<indentStart>\x20*)````(?<spaces>\x20*)mdx-code-block\r?\n(?<children>.*?)\r?\n(?<indentEnd>\x20*)````(?<end>\r?\n|$)/gs;
    const replacer = (substring, ...args) => {
        const groups = args.at(-1);
        return `${groups.begin}${groups.children}${groups.end}`;
    };
    return content.replaceAll(regexp3, replacer).replaceAll(regexp4, replacer);
}

function escapeMarkdownHeadingIds(content) {
    const markdownHeadingRegexp = /(?:^|\n)#{1,6}(?!#).*/g;
    return content.replaceAll(markdownHeadingRegexp, (substring) =>
        substring.replace('{#', '\\{#').replace('\\\\{#', '\\{#'));
}

function admonitionTitleToDirectiveLabel(content) {
    const directiveNameGroup = `(${ADMONITION_KEYWORDS.join('|')})`;
    const regexp = new RegExp(`^(?<quote>(> ?)*)(?<indentation>( +|\t+))?(?<directive>:{3,}${directiveNameGroup}) +(?<title>.*)$`, 'gm');
    return content.replaceAll(regexp, (substring, ...args) => {
        const groups = args.at(-1);
        return `${groups.quote ?? ''}${groups.indentation ?? ''}${groups.directive}[${groups.title}]`;
    });
}

export function preprocessLikeDocusaurus(content) {
    return admonitionTitleToDirectiveLabel(escapeMarkdownHeadingIds(unwrapMdxCodeBlocks(content)));
}

// ============================================================================
// Compilador MDX (carregado sob demanda: só baixa quando alguém valida)
// ============================================================================

let toolsPromise = null;

function loadMdxTools() {
    if (!toolsPromise) {
        toolsPromise = Promise.all([
            import('@mdx-js/mdx'),
            import('remark-gfm'),
            import('remark-directive'),
            import('@slorber/remark-comment'),
        ])
            .then(([mdx, gfm, directive, comment]) => ({
                createProcessor: mdx.createProcessor,
                remarkPlugins: [directive.default, gfm.default, comment.default],
            }))
            .catch((error) => {
                toolsPromise = null; // permite tentar de novo se a rede falhou
                throw error;
            });
    }
    return toolsPromise;
}

async function parseMdx(source) {
    const { createProcessor, remarkPlugins } = await loadMdxTools();
    const text = preprocessLikeDocusaurus(source);

    try {
        const tree = createProcessor({ remarkPlugins }).parse(text);

        // Roda o pipeline completo numa cópia: alguns erros só aparecem depois do parse
        const runner = createProcessor({ remarkPlugins });
        await runner.run(runner.parse(text));

        return { tree, error: null };
    } catch (error) {
        return { tree: null, error };
    }
}

// ============================================================================
// Mensagens amigáveis para erros de sintaxe
// ============================================================================

function syntaxHint(error) {
    const reason = error.reason || error.message || '';
    const rule = error.ruleId || '';
    const tag = /`<([^>`\s]+)[^>`]*>`/.exec(reason)?.[1];

    if (rule === 'unexpected-character' && /before name/.test(reason)) {
        return 'Um "<" grudado em número ou símbolo (como x<5, <=, <-, <3) é lido como início de uma tag. Coloque um espaço depois do "<", escreva &lt; ou coloque o trecho entre crases.';
    }
    if (rule === 'end-tag-mismatch' && tag && tag.includes('.')) {
        return `Isso parece um #include <${tag}> fora de bloco de código. Coloque o trecho entre crases para virar código.`;
    }
    if (rule === 'end-tag-mismatch' && tag && VOID_TAGS.has(tag.toLowerCase())) {
        return `No MDX, <${tag}> precisa terminar com barra: <${tag} />.`;
    }
    if (rule === 'end-tag-mismatch' && /Unexpected closing tag/.test(reason)) {
        return 'As tags foram fechadas fora de ordem: a última aberta deve ser a primeira a fechar.';
    }
    if (rule === 'end-tag-mismatch') {
        return 'Uma tag foi aberta e não foi fechada.';
    }
    if (rule === 'unexpected-eof' || rule === 'acorn' || /expression/i.test(reason)) {
        return 'No MDX, chaves { } são lidas como código JavaScript. Para mostrar chaves no texto, escreva \\{ e \\} ou coloque o trecho entre crases.';
    }
    return null;
}

function lineText(source, line) {
    if (!line) return undefined;
    return source.split('\n')[line - 1]?.trim();
}

// ============================================================================
// Leitura da árvore MDX
// ============================================================================

function visit(node, callback) {
    callback(node);
    if (node.children) node.children.forEach((child) => visit(child, callback));
}

function literalString(estree) {
    const body = estree?.body;
    if (!body || body.length !== 1 || body[0].type !== 'ExpressionStatement') return undefined;

    const expression = body[0].expression;
    if (expression.type === 'Literal' && typeof expression.value === 'string') return expression.value;
    if (expression.type === 'TemplateLiteral' && expression.expressions.length === 0) {
        return expression.quasis[0].value.cooked;
    }
    return undefined;
}

function readAttributes(node) {
    const attributes = {};
    for (const attribute of node.attributes || []) {
        if (attribute.type !== 'mdxJsxAttribute') continue;

        const { name, value } = attribute;
        if (value === null || value === undefined) {
            attributes[name] = true;
        } else if (typeof value === 'string') {
            attributes[name] = value;
        } else {
            const literal = literalString(value.data?.estree);
            attributes[name] = literal !== undefined ? literal : { estree: value.data?.estree, source: value.value };
        }
    }
    return attributes;
}

function declaredNames(declaration) {
    if (!declaration) return [];
    if (declaration.id?.name) return [declaration.id.name];
    if (declaration.declarations) {
        return declaration.declarations.map((d) => d.id?.name).filter(Boolean);
    }
    return [];
}

// Identificadores usados numa expressão que precisariam estar definidos
function freeIdentifiers(estree) {
    const names = new Set();
    let hasFunction = false;

    const walk = (node, parent, key) => {
        if (!node || typeof node.type !== 'string') return;
        if (/Function/.test(node.type)) hasFunction = true;

        if (node.type === 'Identifier') {
            const isPropertyName =
                (parent?.type === 'MemberExpression' && key === 'property' && !parent.computed) ||
                (parent?.type === 'Property' && key === 'key' && !parent.computed);
            if (!isPropertyName) names.add(node.name);
        }

        for (const [childKey, child] of Object.entries(node)) {
            if (childKey === 'loc' || childKey === 'range' || childKey === 'position') continue;
            if (Array.isArray(child)) child.forEach((c) => walk(c, node, childKey));
            else if (child && typeof child.type === 'string') walk(child, node, childKey);
        }
    };

    walk(estree, null, null);
    return { names, hasFunction };
}

function collectReferences(tree) {
    const refs = { images: [], links: [], elements: [], expressions: [], imports: [], declared: new Set() };
    const definitions = new Map();

    visit(tree, (node) => {
        if (node.type === 'definition') definitions.set(node.identifier.toLowerCase(), node.url);
    });

    visit(tree, (node) => {
        const line = node.position?.start?.line;

        switch (node.type) {
            case 'image':
                refs.images.push({ url: node.url, line });
                break;
            case 'imageReference': {
                const url = definitions.get(node.identifier.toLowerCase());
                if (url !== undefined) refs.images.push({ url, line });
                break;
            }
            case 'link':
                refs.links.push({ url: node.url, line });
                break;
            case 'linkReference': {
                const url = definitions.get(node.identifier.toLowerCase());
                if (url !== undefined) refs.links.push({ url, line });
                break;
            }
            case 'mdxJsxFlowElement':
            case 'mdxJsxTextElement':
                if (node.name) refs.elements.push({ name: node.name, attributes: readAttributes(node), line });
                break;
            case 'mdxFlowExpression':
            case 'mdxTextExpression':
                refs.expressions.push({ estree: node.data?.estree, text: node.value, line });
                break;
            case 'mdxjsEsm':
                for (const statement of node.data?.estree?.body || []) {
                    if (statement.type === 'ImportDeclaration') {
                        refs.imports.push({ source: statement.source.value, line });
                        statement.specifiers.forEach((s) => refs.declared.add(s.local.name));
                    } else if (statement.declaration) {
                        declaredNames(statement.declaration).forEach((n) => refs.declared.add(n));
                    } else {
                        declaredNames(statement).forEach((n) => refs.declared.add(n));
                    }
                }
                break;
            default:
                break;
        }
    });

    return refs;
}

// ============================================================================
// Resolução de caminhos
// ============================================================================

const EXTERNAL = /^([a-z][a-z\d+.-]*:|\/\/)/i;

function dirname(path) {
    return path.includes('/') ? path.slice(0, path.lastIndexOf('/')) : '';
}

function joinPath(base, relative) {
    const parts = base ? base.split('/') : [];
    for (const segment of relative.split('/')) {
        if (segment === '..') parts.pop();
        else if (segment !== '.' && segment !== '') parts.push(segment);
    }
    return parts.join('/');
}

function safeDecode(text) {
    try { return decodeURIComponent(text); } catch (e) { return text; }
}

function stripHashAndQuery(url) {
    return url.split('#')[0].split('?')[0];
}

// Imagem do Markdown: mesma lógica do plugin transformImage do Docusaurus
function imageExists(url, filePath, index) {
    if (url.startsWith('pathname://') || EXTERNAL.test(url)) return true;

    const path = safeDecode(stripHashAndQuery(url));
    if (path.startsWith('@site/')) return index.hasFile(SITE_ROOT + path.slice('@site/'.length));
    if (path.startsWith('/')) return index.hasStatic(path);
    return index.hasFile(joinPath(dirname(filePath || ''), path));
}

// Link: devolve null se está ok, ou { target, suggestion } se está quebrado
function brokenLink(url, filePath, index) {
    const link = String(url).trim();
    if (link.startsWith('pathname://') || EXTERNAL.test(link) || link.startsWith('#')) return null;

    const path = stripHashAndQuery(link);
    if (!path) return null;

    // Link para arquivo .md/.mdx: o Docusaurus resolve pelo caminho do arquivo
    if (/\.mdx?$/i.test(path)) {
        const decoded = safeDecode(path);
        const candidates = decoded.startsWith('/')
            ? [`${SITE_ROOT}${decoded.slice(1)}`, `${SITE_ROOT}docs${decoded}`]
            : [joinPath(dirname(filePath || ''), decoded)];
        return candidates.some((c) => index.hasFile(c)) ? null : { target: decoded, suggestion: null };
    }

    // Link de URL: relativo é resolvido a partir da URL da página atual
    const pageRoute = (filePath && docRouteOf(filePath)) || '/';
    const resolved = path.startsWith('/') ? path : new URL(path, `https://site${pageRoute}`).pathname;
    const target = normalizeRoute(resolved);

    if (index.hasRoute(target) || index.hasStatic(target)) return null;
    return { target, suggestion: index.suggestRoute(target) };
}

// ============================================================================
// Verificação do corpo MDX
// ============================================================================

function brokenLinkIssue(url, line, filePath, index, label) {
    if (url === undefined || url === null || typeof url === 'object') return null;

    if (String(url).trim() === '') {
        return { level: 'error', message: `${label} está vazio.`, line };
    }

    const broken = brokenLink(url, filePath, index);
    if (!broken) return null;

    const placeholder = ['url', '/docs/...', '/docs', '/docs/'].includes(String(url).trim());
    let hint = null;
    if (placeholder) hint = 'Isso parece o texto de exemplo, não um link de verdade.';
    else if (broken.suggestion) hint = `Você quis dizer ${broken.suggestion}?`;

    return {
        level: 'error',
        message: `${label} aponta para uma página que não existe: ${url}`,
        hint,
        line,
        key: `link:${broken.target}`,
    };
}

async function checkMdxBody({ body, filePath, index }) {
    const issues = [];
    const { tree, error } = await parseMdx(body);

    if (error) {
        issues.push({
            level: 'error',
            message: `Erro de sintaxe: ${error.reason || error.message}`,
            hint: syntaxHint(error),
            line: error.line,
            snippet: lineText(body, error.line),
        });
        return issues; // sem árvore não dá para checar o resto
    }

    const refs = collectReferences(tree);
    const isDefined = (name) => GLOBAL_COMPONENTS.has(name) || refs.declared.has(name);

    // Imports para arquivos que não existem quebram o build
    for (const { source, line } of refs.imports) {
        let candidates = null;
        if (source.startsWith('@site/')) candidates = [`${SITE_ROOT}${source.slice('@site/'.length)}`];
        else if (source.startsWith('.')) candidates = [joinPath(dirname(filePath || ''), source)];
        if (!candidates) continue; // pacotes e @theme/: não dá para verificar daqui

        const withExtensions = candidates.flatMap((c) =>
            ['', '.js', '.jsx', '.ts', '.tsx', '.md', '.mdx', '.json', '/index.js', '/index.jsx'].map((ext) => c + ext));
        if (!withExtensions.some((c) => index.hasFile(c))) {
            issues.push({ level: 'error', message: `O import aponta para um arquivo que não existe: ${source}`, line });
        }
    }

    // Componentes com maiúscula precisam existir, senão a página quebra ao renderizar
    for (const { name, line } of refs.elements) {
        const base = name.split('.')[0];
        if (/^[a-z]/.test(base) || isDefined(base)) continue;
        issues.push({
            level: 'error',
            message: `O componente <${name}> não existe.`,
            hint: `Componentes disponíveis: ${[...GLOBAL_COMPONENTS].map((c) => `<${c}>`).join(', ')}. Se era para ser texto, coloque entre crases.`,
            line,
            snippet: lineText(body, line),
        });
    }

    // Expressões {…}: variável não definida quebra o build; o resto vira código sem querer
    for (const { estree, text, line } of refs.expressions) {
        if (!estree || estree.body.length === 0) continue; // é só um comentário {/* */}

        const { names, hasFunction } = freeIdentifiers(estree);
        const undefinedNames = [...names].filter((n) => !EXPRESSION_GLOBALS.has(n) && !refs.declared.has(n));

        if (!hasFunction && undefinedNames.length > 0) {
            issues.push({
                level: 'error',
                message: `{${text.trim()}} é lido como código, e "${undefinedNames[0]}" não está definido. A página quebra ao ser gerada.`,
                hint: 'Para mostrar chaves no texto, escreva \\{ e \\} ou coloque o trecho entre crases.',
                line,
                snippet: lineText(body, line),
            });
        } else if (!hasFunction) {
            issues.push({
                level: 'warning',
                message: `{${text.trim()}} vai ser executado como código JavaScript, não aparece como texto.`,
                hint: 'Se era para mostrar as chaves, escreva \\{ e \\} ou coloque o trecho entre crases.',
                line,
                key: `expr:${text.trim()}`,
            });
        }
    }

    // Imagens do Markdown: imagem inexistente quebra o build (onBrokenMarkdownImages: 'throw')
    for (const { url, line } of refs.images) {
        if (!url || !url.trim()) {
            issues.push({ level: 'error', message: 'Imagem sem endereço.', line, snippet: lineText(body, line) });
        } else if (!imageExists(url, filePath, index)) {
            const suggestion = index.suggestStatic?.(stripHashAndQuery(url));
            issues.push({
                level: 'error',
                message: `Imagem não encontrada: ${url}`,
                hint: suggestion ? `Você quis dizer ${suggestion}? (maiúsculas e minúsculas fazem diferença)` : 'Confira o nome e a pasta do arquivo. Imagens coladas no editor são enviadas junto com o PR.',
                line,
                snippet: lineText(body, line),
            });
        }
    }

    // Links do Markdown
    for (const { url, line } of refs.links) {
        const issue = brokenLinkIssue(url, line, filePath, index, 'O link');
        if (issue) issues.push({ ...issue, snippet: lineText(body, line) });
    }

    // Elementos JSX com links, imagens e vídeos
    for (const { name, attributes, line } of refs.elements) {
        // Atributos com variáveis não definidas também quebram o build
        for (const value of Object.values(attributes)) {
            if (!value || typeof value !== 'object' || !value.estree) continue;
            const { names, hasFunction } = freeIdentifiers(value.estree);
            const missing = [...names].filter((n) => !EXPRESSION_GLOBALS.has(n) && !refs.declared.has(n));
            if (!hasFunction && missing.length) {
                issues.push({ level: 'error', message: `<${name}> usa "${missing[0]}", que não está definido.`, line });
            }
        }

        if (name === 'img' && typeof attributes.src === 'string') {
            const src = attributes.src.trim();
            if (src && !EXTERNAL.test(src) && !src.startsWith('/')) {
                issues.push({ level: 'warning', message: `<img> com caminho relativo não funciona no site: ${src}`, hint: 'Use um caminho começando com /img/...', line, key: `img:${src}` });
            } else if (src.startsWith('/') && !imageExists(src, filePath, index)) {
                issues.push({ level: 'error', message: `Imagem não encontrada: ${src}`, line, key: `img:${normalizeRoute(src)}` });
            }
        }

        if (name === 'a' || name === 'Link') {
            const url = name === 'a' ? attributes.href : attributes.to;
            const issue = brokenLinkIssue(url, line, filePath, index, `O link <${name}>`);
            if (issue) issues.push(issue);
        }

        if (name === 'TopicCard') {
            const title = typeof attributes.title === 'string' ? attributes.title : 'sem título';
            const link = attributes.link;

            // Card sem link é um card "Em breve" — permitido
            if (typeof link === 'string' && link.trim() !== '') {
                const issue = brokenLinkIssue(link, line, filePath, index, `O card "${title}"`);
                if (issue) {
                    if (['/docs', '/docs/', '/docs/...'].includes(link.trim())) {
                        issue.hint = 'Para um card "Em breve", deixe o link vazio.';
                    }
                    issues.push(issue);
                }
            }

            const icon = attributes.icon;
            if (typeof icon === 'string' && icon.startsWith('/') && !index.hasStatic(icon)) {
                issues.push({
                    level: 'warning',
                    message: `O ícone do card "${title}" não existe: ${icon}`,
                    hint: 'Se você acabou de enviar esse ícone, ele só passa a existir quando o PR do ícone for aprovado.',
                    line,
                    key: `icon:${icon}`,
                });
            }
        }

        if (name === 'Video') {
            const id = attributes.id;
            if (typeof id === 'string' && !YOUTUBE_ID.test(id)) {
                const fromUrl = /(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{11})/.exec(id)?.[1];
                issues.push({
                    level: 'error',
                    message: id === 'ID' ? 'O ID do vídeo não foi preenchido.' : `ID de vídeo do YouTube inválido: ${id}`,
                    hint: fromUrl ? `Use só o ID: id="${fromUrl}"` : 'O ID tem 11 caracteres, é o que vem depois de "watch?v=" no link do YouTube.',
                    line,
                    snippet: lineText(body, line),
                    key: `video:${id}`,
                });
            }
        }
    }

    return issues;
}

// ============================================================================
// Frontmatter
// ============================================================================

const FIELD_TYPES = {
    title: 'string',
    description: 'string',
    sidebar_label: 'string',
    slug: 'string',
    id: 'string',
    sidebar_position: 'number',
    hide_table_of_contents: 'boolean',
};

function sameValue(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}

export function checkFrontmatter(data) {
    const issues = [];

    if (typeof data.title !== 'string' || data.title.trim() === '') {
        issues.push({ level: 'error', message: 'O título é obrigatório.', where: 'Título' });
    }

    for (const [key, type] of Object.entries(FIELD_TYPES)) {
        const value = data[key];
        if (value === undefined) continue;
        if (typeof value !== type || (type === 'number' && !Number.isFinite(value))) {
            issues.push({ level: 'error', message: `O campo "${key}" precisa ser ${type === 'number' ? 'um número' : type === 'boolean' ? 'verdadeiro/falso' : 'um texto'}.` });
        }
    }

    // O que vai ser escrito precisa ser lido de volta exatamente igual
    try {
        const written = stringifyFrontmatter(data);
        const readBack = yaml.load(written.replace(/^---\n/, '').replace(/---\n$/, '')) || {};
        const expected = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined && v !== null));
        if (!sameValue(readBack, expected)) {
            issues.push({ level: 'error', message: 'O cabeçalho da página não seria salvo corretamente.' });
        }
    } catch (e) {
        issues.push({ level: 'error', message: `Cabeçalho inválido: ${e.reason || e.message}` });
    }

    return issues;
}

// ============================================================================
// API pública
// ============================================================================

function partition(issues, previousKeys) {
    const result = { errors: [], warnings: [], preexisting: [] };
    for (const issue of issues) {
        if (issue.key && previousKeys.has(issue.key)) result.preexisting.push(issue);
        else if (issue.level === 'error') result.errors.push(issue);
        else result.warnings.push(issue);
    }
    return result;
}

async function keysOf(body, filePath, index) {
    if (!body) return new Set();
    const issues = await checkMdxBody({ body, filePath, index });
    return new Set(issues.map((i) => i.key).filter(Boolean));
}

// Página de documentação (PageEditor) ou index.mdx de tópico (TopicEditor).
// `locate(line)` opcional devolve o nome do campo onde fica aquela linha.
export async function validateDocument({ filePath, frontmatter, body, originalBody = '', index, pendingImages = [], locate }) {
    const issues = [
        ...checkFrontmatter(frontmatter),
        ...(await checkMdxBody({ body, filePath, index })),
    ];

    for (const image of pendingImages) {
        if (image.file?.size > LARGE_IMAGE_BYTES) {
            issues.push({
                level: 'warning',
                message: `A imagem ${image.file.name} tem ${(image.file.size / 1024 / 1024).toFixed(1)} MB.`,
                hint: 'Imagens grandes deixam o site lento. Considere reduzir antes de enviar.',
            });
        }
    }

    if (locate) {
        for (const issue of issues) {
            if (issue.line && !issue.where) issue.where = locate(issue.line);
        }
    }

    return partition(issues, await keysOf(originalBody, filePath, index));
}

// Botões da página inicial (HomeEditor)
const TAB_LABELS = { programacao: 'Programação', arquitetura: 'Arq. Hardware', eletronica: 'Eletrônica' };

function homeIssues(data, index) {
    const issues = [];

    for (const [tab, groups] of Object.entries(data || {})) {
        (groups || []).forEach((group) => {
            (group.items || []).forEach((item) => {
                const where = `${TAB_LABELS[tab] || tab} › ${group.title || 'Grupo'} › ${item.title || 'sem título'}`;

                if (!item.title || !item.title.trim()) {
                    issues.push({ level: 'error', message: 'Botão sem título.', where });
                }

                const linkIssue = brokenLinkIssue(item.link, undefined, null, index, 'O botão');
                if (linkIssue) issues.push({ ...linkIssue, where });

                if (item.iconSrc && item.iconSrc.startsWith('/') && !index.hasStatic(item.iconSrc)) {
                    issues.push({
                        level: 'warning',
                        message: `Ícone não encontrado: ${item.iconSrc}`,
                        hint: 'Se você acabou de enviar esse ícone, ele só passa a existir quando o PR do ícone for aprovado.',
                        where,
                        key: `icon:${item.iconSrc}`,
                    });
                }
            });
        });
    }

    return issues;
}

export function validateHomeData({ data, originalData, index }) {
    const previousKeys = new Set(homeIssues(originalData, index).map((i) => i.key).filter(Boolean));
    return partition(homeIssues(data, index), previousKeys);
}
