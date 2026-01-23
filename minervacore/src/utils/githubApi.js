// Arquivo que usa a API do GitHub para criar Pull Requests em edições

const GITHUB_API = 'https://api.github.com';
const REPO = 'MinervaBots/MinervaCore'; 

// Fetch
export async function githubFetch(endpoint, token, options = {}) {
  const res = await fetch(`${GITHUB_API}/repos/${REPO}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `token ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Erro GitHub ${res.status}`);
  }
  return res.json();
}

// Pull Request
export async function createPullRequest({ token, filePath, newContent, prTitle, prBody }) {
  // Pega o SHA da main
  const mainRef = await githubFetch('/git/ref/heads/main', token); 
  const mainSha = mainRef.object.sha;

  // Cria Branch Nova
  const branchName = `update-content-${Date.now()}`;
  await githubFetch('/git/refs', token, {
    method: 'POST',
    body: JSON.stringify({ ref: `refs/heads/${branchName}`, sha: mainSha }),
  });

  // Tenta pegar SHA do arquivo atual
  let fileSha = null;
  try {
      const currentFile = await githubFetch(`/contents/${filePath}`, token);
      fileSha = currentFile.sha;
  } catch (e) {
      // Arquivo não existe (é um arquivo novo/upload), seguimos sem SHA
  }

  // Commit
  const contentEncoded = btoa(unescape(encodeURIComponent(newContent)));
  
  await githubFetch(`/contents/${filePath}`, token, {
    method: 'PUT',
    body: JSON.stringify({
      message: prTitle,
      content: contentEncoded,
      sha: fileSha, // Se for null, o GitHub entende que é criação
      branch: branchName,
    }),
  });

  // Pull Request
  const pr = await githubFetch('/pulls', token, {
    method: 'POST',
    body: JSON.stringify({
      title: prTitle,
      body: prBody,
      head: branchName,
      base: 'main',
    }),
  });

  return pr.html_url;
}

// Listar arquivos de uma pasta
export async function getFolderContents(path, token) {
    return await githubFetch(`/contents/${path}`, token);
}

// Listar pastas de um diretório
export async function getFolders(path, token) {
    const contents = await githubFetch(`/contents/${path}`, token);
    return contents.filter(item => item.type === 'dir'); // Retorna apenas o que é diretório (type: dir)
}

// Ler arquivo
export async function getFileContent(path, token) {
    const res = await githubFetch(`/contents/${path}`, token);
    return {
        content: decodeURIComponent(escape(atob(res.content))),
        sha: res.sha
    };
}

// Listar arquivos de uma pasta (apenas .md e ignorando index.mdx/index.md)
export async function getFiles(path, token) {
    const contents = await githubFetch(`/contents/${path}`, token);
    return contents.filter(item => 
        item.type === 'file' && 
        item.name.endsWith('.md') && 
        !item.name.startsWith('index.')
    );
}

// Função para Upload de Imagem (cria um PR específico para a imagem)
export async function uploadImage({ token, file, contentBase64 }) {
    const timestamp = Date.now();
    const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '-').toLowerCase();
    const path = `minervacore/static/img/uploads/${timestamp}-${cleanName}`;
    
    // Usa a função existente para criar o PR
    const prLink = await createPullRequest({
        token,
        filePath: path,
        newContent: contentBase64, // Já enviamos em base64 puro
        prTitle: `Upload: ${cleanName}`,
        prBody: `Upload automático de imagem via Editor.`
    });

    // Retorna o caminho público que será usado no Markdown
    return {
        path: `/img/uploads/${timestamp}-${cleanName}`,
        pr: prLink
    };
}

// =============================================================================
// FUNÇÕES ATÔMICAS PARA BATCH UPLOAD (Teste)
// =============================================================================

// Criar uma Branch
export async function createBranch(token, branchName) {
    // Pega o SHA da main
    const mainRef = await githubFetch('/git/ref/heads/main', token);
    const mainSha = mainRef.object.sha;

    // Cria a nova branch
    await githubFetch('/git/refs', token, {
        method: 'POST',
        body: JSON.stringify({ ref: `refs/heads/${branchName}`, sha: mainSha }),
    });
}

// Commitar um arquivo direto numa branch específica
export async function commitFile({ token, branch, path, contentBase64, message }) {
    // Tenta pegar o SHA se o arquivo já existir (para update)
    let fileSha = null;
    try {
        const currentFile = await githubFetch(`/contents/${path}?ref=${branch}`, token);
        fileSha = currentFile.sha;
    } catch (e) {
        // Arquivo novo
    }

    await githubFetch(`/contents/${path}`, token, {
        method: 'PUT',
        body: JSON.stringify({
            message: message,
            content: contentBase64,
            sha: fileSha,
            branch: branch, // alvo é a branch criada
        }),
    });
}

// Abrir PR de uma branch para a main
export async function openPullRequest({ token, title, body, branch }) {
    const pr = await githubFetch('/pulls', token, {
        method: 'POST',
        body: JSON.stringify({
            title: title,
            body: body,
            head: branch,
            base: 'main',
        }),
    });
    return pr.html_url;
}