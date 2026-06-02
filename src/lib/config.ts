export const APP_CONFIG = {
  // Current app version. Dynamically injected during CI build, or falls back to local tag.
  APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || 'v1.2.0',
  
  // The GitHub repository path (owner/repo)
  GITHUB_REPO: 'kunal-gswm/fintech'
};
