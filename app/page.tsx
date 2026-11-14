import { CtaBanner } from '@/components/CtaBanner/CtaBanner';
import { SiteFooter } from '@/components/SiteFooter/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader/SiteHeader';
import { getContent } from '@/lib/content';

export default async function Home() {
  const { cta } = await getContent();

  return (
    <>
      <SiteHeader />
      <main />
      <CtaBanner cta={cta} />
      <SiteFooter />
    </>
  );
}
