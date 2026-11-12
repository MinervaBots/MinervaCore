// Lê a saída do build do Docusaurus e escreve um resumo legível no PR.
//
// Dois modos:
//
//   node check-build-log.mjs --erro <log-do-pr>
//     O build falhou. Extrai o erro, traduz a causa provável e escreve no
//     resumo da execução. Sempre termina com erro.
//
//   node check-build-log.mjs <log-da-main> <log-do-pr>
//     O build passou. Compara os links quebrados do PR com os da main e
//     falha só se o PR criar links quebrados NOVOS. Os que já existiam
//     aparecem no resumo, mas não bloqueiam ninguém.

import { readFileSync, appendFileSync, existsSync } from 'node:fs';

const SUMMARY = process.env.GITHUB_STEP_SUMMARY;

function writeSummary(markdown) {
    if (SUMMARY) appendFileSync(SUMMARY, `${markdown}\n`);
    console.log(markdown);
}

function readLog(path) {
    if (!path || !existsSync(path)) return null;
    // Remove as cores do terminal (o Docusaurus colore a saída mesmo no CI)
    return readFileSync(path, 'utf8').replace(/\x1b\[[0-9;]*m/g, '');
}

// ============================================================================
// Links quebrados
// ============================================================================

function brokenLinks(log) {
    const found = new Map(); // chave -> { kind, source, target }
    let current = null;

    for (const line of log.split(/\r?\n/)) {
        const header = /Broken (link|anchor) on source page path = (.+?):\s*$/.exec(line);
        if (header) {
            current = { kind: header[1] === 'link' ? 'Link' : 'Âncora', source: header[2] };
            continue;
        }

        const target = /^\s*-> linking to (.+?)\s*$/.exec(line);
        if (target && current) {
            const entry = { ...current, target: target[1] };
            found.set(`${entry.kind}|${entry.source}|${entry.target}`, entry);
            continue;
        }

        const markdown = /Markdown link with URL `(.+?)` in source file "(.+?)"/.exec(line);
        if (markdown) {
            const entry = { kind: 'Link .md', source: markdown[2], target: markdown[1] };
            found.set(`${entry.kind}|${entry.source}|${entry.target}`, entry);
        }

        // Qualquer outra linha encerra a lista de destinos da página atual
        current = null;
    }

    return found;
}

function table(entries) {
    const rows = entries.map((e) => `| ${e.kind} | \`${e.source}\` | \`${e.target}\` |`);
    return ['| Tipo | Página | Aponta para |', '|---|---|---|', ...rows].join('\n');
}

function compareLinks(baseLogPath, prLogPath) {
    const prLog = readLog(prLogPath);
    if (!prLog) {
        writeSummary('⚠️ Não encontrei o log do build do PR para comparar os links.');
        process.exit(1);
    }

    const baseLog = readLog(baseLogPath);
    const baseBuilt = baseLog && /Generated static files/.test(baseLog);

    if (!baseBuilt) {
        writeSummary([
            '## ⚠️ Links não comparados',
            '',
            'O build da `main` não terminou, então não há com o que comparar.',
            'O build do PR passou; a verificação de links fica para a próxima execução.',
        ].join('\n'));
        return;
    }

    const before = brokenLinks(baseLog);
    const after = brokenLinks(prLog);

    const added = [...after.entries()].filter(([key]) => !before.has(key)).map(([, e]) => e);
    const fixed = [...before.entries()].filter(([key]) => !after.has(key)).map(([, e]) => e);
    const remaining = after.size - added.length;

    const lines = [];

    if (added.length) {
        lines.push(
            `## ❌ Este PR cria ${added.length} link(s) quebrado(s)`,
            '',
            'Esses links apontam para páginas que não existem. Confira se o endereço está certo,',
            'lembrando que **maiúsculas e minúsculas fazem diferença** no site publicado.',
            '',
            table(added),
            '',
        );
    } else {
        lines.push('## ✅ Build ok, nenhum link quebrado novo', '');
    }

    if (fixed.length) {
        lines.push(`🎉 Este PR **corrige ${fixed.length}** link(s) que estavam quebrados na \`main\`.`, '');
    }

    if (remaining > 0) {
        lines.push(
            '<details>',
            `<summary>${remaining} link(s) quebrado(s) que já existiam na main (não bloqueiam este PR)</summary>`,
            '',
            table([...after.entries()].filter(([key]) => before.has(key)).map(([, e]) => e)),
            '',
            '</details>',
        );
    }

    writeSummary(lines.join('\n'));

    if (added.length) {
        for (const e of added) {
            console.log(`::error title=Link quebrado novo::${e.source} aponta para ${e.target}`);
        }
        process.exit(1);
    }
}

// ============================================================================
// Erro de build
// ============================================================================

const CAUSES = [
    [/found broken links/i, 'Algum **link aponta para uma página que não existe** (lista abaixo). Lembre que maiúsculas e minúsculas fazem diferença. Para conteúdo ainda não escrito, deixe o link do card vazio: ele aparece como "Em breve".'],
    [/front ?matter|frontMatter/i, 'O **cabeçalho** (frontmatter) de alguma página está inválido. Causas comuns: título com `:` sem aspas, `sidebar_position` vazio ou com texto.'],
    [/MDX compilation failed|Could not parse expression|Unexpected character|Expected a closing tag|end-tag-mismatch/i, 'Erro de **sintaxe MDX** em alguma página. Causas comuns: `<` grudado em número (`x<5`), `#include <...>` fora de bloco de código, chaves `{ }` no texto, `<br>` sem barra.'],
    [/Markdown image .* couldn't be resolved/i, 'Uma **imagem** referenciada não existe. Confira o nome e a pasta do arquivo, inclusive maiúsculas e minúsculas.'],
    [/Expected component `?(\w+)`? to be defined|is not defined/i, 'Uma página usa um **componente ou variável que não existe**. Se era para ser texto, coloque entre crases.'],
    [/Module not found|Can't resolve/i, 'Um **import** aponta para um arquivo que não existe.'],
];

function explainBuildError(prLogPath) {
    const log = readLog(prLogPath) || '';
    const lines = log.split(/\r?\n/);

    const first = lines.findIndex((l) => /\[ERROR\]|Error:/.test(l));
    const excerpt = (first === -1 ? lines.slice(-40) : lines.slice(first, first + 30)).join('\n').trim();
    const causes = CAUSES.filter(([pattern]) => pattern.test(log)).map(([, text]) => `- ${text}`);
    const links = [...brokenLinks(log).values()];

    writeSummary([
        '## ❌ O site não compila com este PR',
        '',
        'Se este PR for aprovado assim, o deploy falha e o site fica preso na versão anterior.',
        '',
        ...(causes.length ? ['**Causa provável:**', '', ...causes, ''] : []),
        ...(links.length ? [table(links), ''] : []),
        '<details open>',
        '<summary>Trecho do erro</summary>',
        '',
        '```',
        excerpt.slice(0, 6000),
        '```',
        '',
        '</details>',
    ].join('\n'));

    process.exit(1);
}

// ============================================================================

const args = process.argv.slice(2);

if (args[0] === '--erro') {
    explainBuildError(args[1]);
} else if (args.length === 2) {
    compareLinks(args[0], args[1]);
} else {
    console.error('Uso: check-build-log.mjs <log-main> <log-pr>  |  check-build-log.mjs --erro <log-pr>');
    process.exit(2);
}
