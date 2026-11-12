// Leitura e escrita do index.mdx de um tópico (a página com os cards)
//
// Formato:
//   ---frontmatter---
//   introdução em markdown
//   ### Título da seção        (opcional)
//   <TopicGrid>
//       <TopicCard title="..." description="..." link="..." icon="..." />
//   </TopicGrid>
//   ...mais seções...
//   conteúdo extra em markdown

import { splitFrontmatter, toSidebarPosition, jsxAttribute, findSelfClosingTag, parseJsxAttributes } from './markdownFormat.js';

const SECTION_REGEX = /(?:###[ \t]+(.*)\n\s*)?<TopicGrid>([\s\S]*?)<\/TopicGrid>/g;

function parseCards(gridContent) {
    const cards = [];
    const text = (value) => (typeof value === 'string' ? value : '');
    let from = 0;
    let tag;

    while ((tag = findSelfClosingTag(gridContent, 'TopicCard', from))) {
        const attributes = parseJsxAttributes(tag.attributes);
        cards.push({
            title: text(attributes.title),
            description: text(attributes.description),
            link: text(attributes.link),
            icon: text(attributes.icon),
        });
        from = tag.end;
    }
    return cards;
}

export function parseTopicIndex(content) {
    const { data, body, error } = splitFrontmatter(content);
    if (error) throw new Error(`O cabeçalho do index.mdx é inválido: ${error}`);

    const sections = [];
    let match;
    let lastIndex = 0;
    let firstMatchIndex = -1;

    SECTION_REGEX.lastIndex = 0;
    while ((match = SECTION_REGEX.exec(body)) !== null) {
        if (firstMatchIndex === -1) {
            firstMatchIndex = match.index;
        } else {
            // Texto solto entre duas seções. Antes era descartado sem aviso;
            // agora fica guardado e volta para o mesmo lugar ao salvar.
            const between = body.slice(lastIndex, match.index).trim();
            if (between) sections[sections.length - 1].after = between;
        }

        sections.push({ title: (match[1] || '').trim(), cards: parseCards(match[2]), after: '' });
        lastIndex = match.index + match[0].length;
    }

    return {
        metadata: {
            title: data.title === undefined ? '' : String(data.title),
            description: data.description === undefined ? '' : String(data.description),
            pos: data.sidebar_position === undefined ? '' : String(data.sidebar_position),
        },
        extraFrontmatter: data, // demais campos do cabeçalho, preservados como estão
        introContent: firstMatchIndex > 0 ? body.slice(0, firstMatchIndex).trim() : '',
        sections,
        footerContent: lastIndex < body.length ? body.slice(lastIndex).trim() : '',
    };
}

export function topicFrontmatter(model) {
    const extra = model.extraFrontmatter || {};
    return {
        ...extra,
        sidebar_position: toSidebarPosition(model.metadata.pos),
        title: model.metadata.title,
        description: model.metadata.description,
        hide_table_of_contents: extra.hide_table_of_contents ?? true,
    };
}

// Monta o corpo e um mapa de linhas → campo do editor, para a validação
// conseguir dizer "erro no card X" em vez de só "linha 37".
export function buildTopicBody(model) {
    const lines = [];
    const regions = [];

    const push = (text, label) => {
        const start = lines.length + 1;
        lines.push(...text.split('\n'));
        if (label) regions.push({ start, end: lines.length, label });
    };

    if (model.introContent) {
        push(model.introContent, 'Introdução');
        push('');
    }

    model.sections.forEach((section, sectionIndex) => {
        const sectionLabel = `Seção "${section.title || sectionIndex + 1}"`;

        if (section.title && section.title.trim() !== '') {
            push(`### ${section.title}`, sectionLabel);
            push('');
        }

        push('<TopicGrid>');
        push('');

        section.cards.forEach((card, cardIndex) => {
            const attributes = [jsxAttribute('title', card.title), jsxAttribute('description', card.description)];
            // Link vazio = card "Em breve"
            if (card.link && card.link.trim() !== '') attributes.push(jsxAttribute('link', card.link.trim()));
            attributes.push(jsxAttribute('icon', card.icon));

            push(`    <TopicCard \n    ${attributes.join(' \n    ')}\n    />`, `Card "${card.title || cardIndex + 1}" · ${sectionLabel}`);
            push('');
        });

        push('</TopicGrid>');
        push('');

        if (section.after) {
            push(section.after, `Texto depois da ${sectionLabel}`);
            push('');
        }
    });

    if (model.footerContent) push(model.footerContent, 'Conteúdo extra');

    return {
        body: lines.join('\n').trim(),
        locate: (line) => regions.find((r) => line >= r.start && line <= r.end)?.label,
    };
}
