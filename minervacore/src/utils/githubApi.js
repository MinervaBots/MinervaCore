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

export async function getFolderContents(path, token) {
    return await githubFetch(`/contents/${path}`, token);
}