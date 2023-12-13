export function resolveGitHubPath(path: string): string {
  return `https://raw.githubusercontent.com/litentry/vc-jsonschema/main/dist/schemas/${path}`;
}
