// Leitura e escrita de arquivos de conteúdo (frontmatter YAML + corpo MDX)
//
// Tudo aqui existe para que o editor nunca gere um arquivo que quebre o build.
// Antes, o frontmatter era montado concatenando texto, e um título como
// "C++: Ponteiros" virava YAML inválido. Agora quem escreve é o js-yaml, que
// coloca aspas sempre que precisa, e os atributos JSX são escapados.

import yaml from 'js-yaml';

const FRONTMATTER_REGEX = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/;

// ============================================================================
// Frontmatter
// ============================================================================

// Separa frontmatter e corpo. Nunca lança: se o YAML for inválido, devolve o
// erro em `error` para o editor avisar em vez de perder dados em silêncio.
export function splitFrontmatter(content) {
    const text = (content || '').replace(/\r\n/g, '\n');
    const match = text.match(FRONTMATTER_REGEX);

    if (!match) {
        return { data: {}, body: text.trim(), error: null };
    }

    const body = text.slice(match[0].length).trim();

    try {
        const loaded = yaml.load(match[1]);
        const data = loaded && typeof loaded === 'object' && !Array.isArray(loaded) ? loaded : {};
        return { data, body, error: null };
    } catch (e) {
        return { data: {}, body, error: e.reason || e.message };
    }
}

// Remove chaves vazias que o Docusaurus rejeitaria (ex: `sidebar_position:`
// vazio vira null, e null não passa na validação de número).
function cleanFrontmatter(data) {
    const clean = {};
    for (const [key, value] of Object.entries(data)) {
        if (value === undefined || value === null) continue;
        clean[key] = value;
    }
    return clean;
}

export function stringifyFrontmatter(data) {
    const dumped = yaml.dump(cleanFrontmatter(data), {
        lineWidth: -1,  // não quebra títulos longos em várias linhas
        noRefs: true,
        sortKeys: false, // mantém a ordem original das chaves
    });
    return `---\n${dumped}---\n`;
}

export function buildDocument(data, body) {
    return `${stringifyFrontmatter(data)}\n${(body || '').trim()}\n`;
}

// Converte o valor digitado no campo "Posição" para o que o Docusaurus aceita:
// número, ou ausente. Texto vazio vira undefined (a chave some do arquivo).
export function toSidebarPosition(value) {
    if (value === undefined || value === null) return undefined;
    const text = String(value).trim();
    if (text === '') return undefined;
    const number = Number(text);
    return Number.isFinite(number) ? number : undefined;
}

// ============================================================================
// Atributos JSX (usados nos <TopicCard ... />)
// ============================================================================

// String JSX entre aspas não tem escape: uma aspa no texto fecha o atributo e
// quebra o MDX. Nesses casos o valor vira uma expressão JS: title={"..."}.
// Entidades HTML (&copy;, &#169;) também, porque o JSX as decodificaria.
// Um "&" comum, como em "Memória & Armazenamento", fica como está.
const NEEDS_EXPRESSION = /["\n\r]|&(#\d+|#x[\da-f]+|[a-z][a-z\d]*);/i;

export function jsxAttribute(name, value) {
    const text = value === undefined || value === null ? '' : String(value);
    if (NEEDS_EXPRESSION.test(text)) {
        return `${name}={${JSON.stringify(text)}}`;
    }
    return `${name}="${text}"`;
}

// Lê um bloco de expressão a partir de `{`, respeitando strings JS e chaves
// aninhadas. Devolve o índice logo depois do `}` que fecha.
function scanExpression(source, start) {
    let depth = 0;
    let quote = null;

    for (let i = start; i < source.length; i++) {
        const ch = source[i];

        if (quote) {
            if (ch === '\\') { i++; continue; }
            if (ch === quote) quote = null;
            continue;
        }

        if (ch === '"' || ch === "'" || ch === '`') { quote = ch; continue; }
        if (ch === '{') depth++;
        if (ch === '}') {
            depth--;
            if (depth === 0) return i + 1;
        }
    }
    return -1;
}

// Converte o conteúdo de `{...}` num valor, se for uma string literal simples.
function evaluateStringExpression(expression) {
    const trimmed = expression.trim();

    if (/^"(?:[^"\\]|\\.)*"$/.test(trimmed)) {
        return JSON.parse(trimmed);
    }
    if (/^'(?:[^'\\]|\\.)*'$/.test(trimmed)) {
        // Troca aspas simples por duplas sem quebrar escapes internos
        const inner = trimmed.slice(1, -1).replace(/\\'/g, "'").replace(/"/g, '\\"');
        return JSON.parse(`"${inner}"`);
    }
    if (/^`[^`$\\]*`$/.test(trimmed)) {
        return trimmed.slice(1, -1);
    }
    return null;
}

// Procura a próxima tag <Nome ... /> a partir de `from`. Diferente de uma
// regex, respeita aspas e chaves, então um "/>" dentro de um título não corta
// a tag no meio.
export function findSelfClosingTag(source, tagName, from = 0) {
    const opener = `<${tagName}`;
    let start = source.indexOf(opener, from);

    while (start !== -1) {
        const after = source[start + opener.length];
        if (after && /\s|\//.test(after)) break;
        start = source.indexOf(opener, start + 1);
    }
    if (start === -1) return null;

    let quote = null;
    for (let i = start + opener.length; i < source.length; i++) {
        const ch = source[i];

        if (quote) {
            if (ch === quote) quote = null;
            continue;
        }
        if (ch === '"' || ch === "'") { quote = ch; continue; }
        if (ch === '{') {
            const end = scanExpression(source, i);
            if (end === -1) return null;
            i = end - 1;
            continue;
        }
        if (ch === '/' && source[i + 1] === '>') {
            return {
                start,
                end: i + 2,
                attributes: source.slice(start + opener.length, i),
            };
        }
    }
    return null;
}

// Lê os atributos de uma tag JSX. Valores que não são texto simples (ex:
// link={algumaVariavel}) voltam como { expression } para não serem perdidos.
export function parseJsxAttributes(source) {
    const attributes = {};
    let i = 0;

    while (i < source.length) {
        while (i < source.length && /\s/.test(source[i])) i++;
        if (i >= source.length) break;

        const nameMatch = /^[A-Za-z_:][\w:.-]*/.exec(source.slice(i));
        if (!nameMatch) { i++; continue; }

        const name = nameMatch[0];
        i += name.length;

        while (i < source.length && /\s/.test(source[i])) i++;

        if (source[i] !== '=') {
            attributes[name] = true;
            continue;
        }
        i++;
        while (i < source.length && /\s/.test(source[i])) i++;

        const ch = source[i];
        if (ch === '"' || ch === "'") {
            const end = source.indexOf(ch, i + 1);
            if (end === -1) break;
            attributes[name] = source.slice(i + 1, end);
            i = end + 1;
        } else if (ch === '{') {
            const end = scanExpression(source, i);
            if (end === -1) break;
            const expression = source.slice(i + 1, end - 1);
            const value = evaluateStringExpression(expression);
            attributes[name] = value === null ? { expression } : value;
            i = end;
        } else {
            i++;
        }
    }

    return attributes;
}
