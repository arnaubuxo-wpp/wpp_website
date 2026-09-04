// Original resolved logical asset paths (e.g. "assets/logo.png") to blob URLs at runtime
// via a manifest (window.__R). Real files now live under /public at the same logical
// paths, so this just becomes a leading-slash prefix, with one legacy remap.
const REMAP: Record<string, string> = {
  'directions/assets/peak-band.jpg': '/assets/peak-band.jpg',
};

export function __R(path: string): string {
  if (REMAP[path]) return REMAP[path];
  return '/' + path.replace(/^\/+/, '');
}
