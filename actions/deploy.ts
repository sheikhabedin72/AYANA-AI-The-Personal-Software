import { Octokit } from "octokit";

/**
 * Utility to encode a string to base64 in a browser-compatible way.
 */
function toBase64(str: string): string {
  try {
    // Fix: Removed Node.js Buffer reference as it's not available in browser environments
    // and was causing TypeScript compilation errors.
    // Using Browser-compatible base64 encoding (handles UTF-8).
    return btoa(unescape(encodeURIComponent(str)));
  } catch (e) {
    console.error("Base64 encoding failed", e);
    return "";
  }
}

export async function deployToGithub(appName: string, code: string) {
  // Use process.env.GITHUB_TOKEN or a manually provided token
  const token = process.env.GITHUB_TOKEN || (window as any).process?.env?.GITHUB_TOKEN;
  
  if (!token || token === 'your_github_token_here') {
    return { success: false, error: "GitHub Token not found. Please set GITHUB_TOKEN in your environment." };
  }

  const octokit = new Octokit({ auth: token });
  
  // We'll use the authenticated user's login as owner
  let owner = "";
  try {
    const { data: user } = await octokit.request('GET /user');
    owner = user.login;
  } catch (e) {
    return { success: false, error: "Failed to authenticate with GitHub. Check your token." };
  }

  const repo = appName.toLowerCase().replace(/\s+/g, '-');

  try {
    // 1. Create the Repository
    await octokit.request('POST /user/repos', {
      name: repo,
      private: false,
      auto_init: true, // Initialize with a README to ensure the main branch exists
    });

    // Wait a brief moment for GitHub to initialize the repo
    await new Promise(r => setTimeout(r, 1000));

    // 2. Push the App.tsx code
    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner,
      repo,
      path: 'App.tsx',
      message: 'Initial build by AYANA AI Software Factory',
      content: toBase64(code),
    });

    return { success: true, url: `https://github.com/${owner}/${repo}` };
  } catch (error: any) {
    console.error("GitHub Deployment Error:", error);
    // If repo already exists, try to just push the file
    if (error.status === 422) {
      try {
        await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
          owner,
          repo,
          path: 'App.tsx',
          message: 'Update by AYANA AI Software Factory',
          content: toBase64(code),
        });
        return { success: true, url: `https://github.com/${owner}/${repo}` };
      } catch (innerError) {
        return { success: false, error: "Repository exists and update failed." };
      }
    }
    return { success: false, error: error.message || "Failed to deploy to GitHub." };
  }
}