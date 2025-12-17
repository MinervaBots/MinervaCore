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
  const branchName = `update-home-${Date.now()}`;
  await githubFetch('/git/refs', token, {
    method: 'POST',
    body: JSON.stringify({ ref: `refs/heads/${branchName}`, sha: mainSha }),
  });

  // Pega o SHA do arquivo atual
  const currentFile = await githubFetch(`/contents/${filePath}`, token);

  // Commit na nova Branch
  const contentEncoded = btoa(unescape(encodeURIComponent(newContent)));
  
  await githubFetch(`/contents/${filePath}`, token, {
    method: 'PUT',
    body: JSON.stringify({
      message: 'chore: update home data via Editor',
      content: contentEncoded,
      sha: currentFile.sha,
      branch: branchName,
    }),
  });

  // Abre o PR
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