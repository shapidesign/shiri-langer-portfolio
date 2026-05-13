/** Folder name under public/assets/images/ for Git-backed uploads. */
export function slugifyMediaFolder(title: string): string {
  const s = title
    .toLowerCase()
    .trim()
    .replace(/[']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return s || 'project';
}

/** Safe subfolder for repo paths (no `..` or odd characters). */
export function safeMediaFolderSlug(mediaFolder: string | undefined, title: string): string {
  const base = (mediaFolder || '').trim() || slugifyMediaFolder(title);
  return (
    base
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/^-+|-+$/g, '') || 'project'
  );
}
