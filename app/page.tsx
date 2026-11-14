import { AuthorityForm } from '@/components/AuthorityForm/AuthorityForm';
import { CtaBanner } from '@/components/CtaBanner/CtaBanner';
import { Features } from '@/components/Features/Features';
import { SiteFooter } from '@/components/SiteFooter/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader/SiteHeader';
import { getContent } from '@/lib/content';

export default async function Home() {
  const { features, authorityForm, cta } = await getContent();

  return (
    <>
      <SiteHeader />
      <main>
        <Features features={features} />
        <AuthorityForm form={authorityForm} />
      </main>
      <SiteFooter />
      {/* Last in the page so sticky keeps it pinned through the footer, then it ends below it. */}
      <CtaBanner cta={cta} />
    </>
  );
}
