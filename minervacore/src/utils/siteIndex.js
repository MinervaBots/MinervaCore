// Índice do que existe no site: rotas de páginas, arquivos estáticos e
// arquivos do repositório. Usado pela validação para saber se um link ou uma
// imagem aponta para algo real antes de abrir o Pull Request.
//
// As rotas são calculadas a partir dos caminhos dos arquivos com as mesmas
// regras do Docusaurus (index/README viram a rota da pasta, arquivos com "_"
// são ignorados, prefixos numéricos somem). O que ele NÃO enxerga: `slug` e
// `id` definidos no frontmatter — o repositório não usa nenhum dos dois hoje.

import { githubFetch } from './githubApi.js';

export const SITE_ROOT = 'minervacore/';

const DOCS_DIR = `${SITE_ROOT}docs/`;
const PAGES_DIR = `${SITE_ROOT}src/pages/`;
const STATIC_DIR = `${SITE_ROOT}static/`;

const DOC_EXTENSION = /\.mdx?$/i;
const PAGE_EXTENSION = /\.(jsx?|tsx?|mdx?)$/i;

// Rotas criadas por plugins, não por arquivos
const PLUGIN_ROUTES = ['/search'];

// ============================================================================
// Regras de rota (espelham o plugin de docs do Docusaurus)
// ============================================================================

function stripNumberPrefix(segment) {
    const match = /^\d+\s*[-_.]+\s*(?=[^-_.\s])/.exec(segment);
    return match ? segment.slice(match[0].length) : segment;
}

function isIgnored(segments) {
    return segments.some((s) => s.startsWith('_') || s === '__tests__' || /\.test\./.test(s));
}

function routeFromSegments(prefix, segments, extension) {
    const parts = segments.map(stripNumberPrefix);
    const file = parts.pop().replace(extension, '');
    const parent = parts[parts.length - 1];

    const isCategoryIndex =
        ['index', 'readme'].includes(file.toLowerCase()) ||
        (parent !== undefined && file.toLowerCase() === parent.toLowerCase());

    if (!isCategoryIndex) parts.push(file);

    const route = `${prefix}/${parts.join('/')}`.replace(/\/+$/, '');
    return route || '/';
}

export function docRouteOf(filePath) {
    if (!filePath.startsWith(DOCS_DIR) || !DOC_EXTENSION.test(filePath)) return null;
    const segments = filePath.slice(DOCS_DIR.length).split('/');
    if (isIgnored(segments)) return null;
    return routeFromSegments('/docs', segments, DOC_EXTENSION);
}

function pageRouteOf(filePath) {
    if (!filePath.startsWith(PAGES_DIR) || !PAGE_EXTENSION.test(filePath)) return null;
    const segments = filePath.slice(PAGES_DIR.length).split('/');
    if (isIgnored(segments)) return null;
    return routeFromSegments('', segments, PAGE_EXTENSION);
}

// ============================================================================
// Normalização de links
// ============================================================================

export function normalizeRoute(link) {
    let path = String(link).split('#')[0].split('?')[0];
    try {
        path = decodeURIComponent(path);
    } catch (e) {
        // "%" solto no link: compara como está
    }
    if (!path.startsWith('/')) path = `/${path}`;
    path = path.replace(/\/{2,}/g, '/');
    if (path.length > 1) path = path.replace(/\/+$/, '');
    return path;
}

// Distância de edição, para sugerir "você quis dizer...?"
function editDistance(a, b) {
    if (Math.abs(a.length - b.length) > 6) return Infinity;
    const row = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
        let previous = row[0];
        row[0] = i;
        for (let j = 1; j <= b.length; j++) {
            const current = row[j];
            row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
            previous = current;
        }
    }
    return row[b.length];
}

// ============================================================================
// Índice
// ============================================================================

// `repoPaths`: caminhos de todos os arquivos do repo (ex: minervacore/docs/a.md)
// `extraFiles`: arquivos que ainda não existem na main mas vão no mesmo PR
// (a página sendo criada, imagens na fila de upload)
export function createSiteIndex(repoPaths, { extraFiles = [] } = {}) {
    const files = new Set([...repoPaths, ...extraFiles]);
    const routes = new Set(PLUGIN_ROUTES);
    const staticFiles = new Set();

    for (const path of files) {
        const route = docRouteOf(path) || pageRouteOf(path);
        if (route) routes.add(route);
        if (path.startsWith(STATIC_DIR)) staticFiles.add(`/${path.slice(STATIC_DIR.length)}`);
    }

    const routeList = [...routes];
    const staticList = [...staticFiles];

    return {
        hasFile: (path) => files.has(path),
        hasStatic: (urlPath) => staticFiles.has(normalizeRoute(urlPath)),
        hasRoute: (link) => routes.has(normalizeRoute(link)),

        // Mesmo arquivo com maiúsculas diferentes (o erro mais comum com imagens)
        suggestStatic(urlPath) {
            const target = normalizeRoute(urlPath).toLowerCase();
            return staticList.find((p) => p.toLowerCase() === target) || null;
        },

        suggestRoute(link) {
            const target = normalizeRoute(link);

            // Mesma rota com maiúsculas diferentes: funciona no Windows, 404 no GitHub Pages
            const sameIgnoringCase = routeList.find((r) => r.toLowerCase() === target.toLowerCase());
            if (sameIgnoringCase) return sameIgnoringCase;

            let best = null;
            let bestDistance = Math.max(2, Math.floor(target.length * 0.15));
            for (const route of routeList) {
                const distance = editDistance(target, route);
                if (distance <= bestDistance) {
                    best = route;
                    bestDistance = distance;
                }
            }
            return best;
        },
    };
}

// ============================================================================
// Leitura do repositório
// ============================================================================

const CACHE_MS = 5 * 60 * 1000;
let cache = null;

// Lista todos os arquivos da main numa chamada só (API de árvores do Git).
// Fica em cache por 5 minutos para não repetir a cada verificação.
export async function loadRepoPaths(token, { force = false } = {}) {
    if (!force && cache && Date.now() - cache.at < CACHE_MS) return cache.paths;

    const tree = await githubFetch('/git/trees/main?recursive=1', token);
    const paths = tree.tree.filter((entry) => entry.type === 'blob').map((entry) => entry.path);

    cache = { at: Date.now(), paths, truncated: Boolean(tree.truncated) };
    return paths;
}
