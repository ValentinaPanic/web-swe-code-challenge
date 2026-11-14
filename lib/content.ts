import raw from '@/data/content.json';
import type { Content } from '@/types/content';

/**
 * The single entry point for page copy. Reads the mock CMS response on the
 * server at build time; swapping in a real CMS means replacing the import with
 * a server-side `fetch(CMS_URL, { next: { revalidate } })`. Call sites don't change.
 */
export async function getContent(): Promise<Content> {
  // JSON imports widen string literals (e.g. `variant`) to `string`; the file is ours, so assert the narrow type.
  return raw as Content;
}
