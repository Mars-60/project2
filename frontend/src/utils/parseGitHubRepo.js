export function parseGitHubRepo(url) {
  try {
    const parsed = new URL(url);

    // must be github.com
    if (parsed.hostname !== "github.com") {
      return { valid: false, error: "❌ Not a GitHub URL" };
    }

    const parts = parsed.pathname.split("/").filter(Boolean);

    // must be github.com/owner/repo
    if (parts.length < 2) {
      return { valid: false, error: "❌ Invalid GitHub repository link" };
    }

    const owner = parts[0];
    const repo = parts[1].replace(".git", "");

    return { valid: true, owner, repo };
  } catch {
    return { valid: false, error: "❌ Invalid URL" };
  }
}
