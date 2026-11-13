import raw from '@/data/content.json';
import type { Content } from '@/types/content';
import { parseContent } from './contentGuards';

/**
 * The single entry point for page copy. Reads the mock CMS response on the
 * server at build time; swapping in a real CMS means replacing the import with
 * a server-side `fetch(CMS_URL, { next: { revalidate } })`. Call sites don't change.
 */
export async function getContent(): Promise<Content> {
  return parseContent(raw);
}
