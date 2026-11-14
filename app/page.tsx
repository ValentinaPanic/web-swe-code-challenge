import { Fragment } from 'react';
import { AuthorityForm } from '@/components/AuthorityForm/AuthorityForm';
import { CtaBanner } from '@/components/CtaBanner/CtaBanner';
import { Features } from '@/components/Features/Features';
import { Hero } from '@/components/Hero/Hero';
import { SiteFooter } from '@/components/SiteFooter/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader/SiteHeader';
import { Spotlight } from '@/components/Spotlight/Spotlight';
import { getContent } from '@/lib/content';
import styles from './page.module.css';

export default async function Home() {
  const { hero, features, spotlights, authorityForm, cta } = await getContent();

  return (
    <>
      <SiteHeader />
      <main>
        <Hero hero={hero} />
        {/* One divider rule at every width: between every pair of sections (PLAN C8). */}
        <hr className={styles.divider} />
        <Features features={features} />
        {spotlights.map((spotlight, index) => (
          <Fragment key={spotlight.title}>
            <hr className={styles.divider} />
            <Spotlight spotlight={spotlight} index={index} />
          </Fragment>
        ))}
        <hr className={styles.divider} />
        <AuthorityForm form={authorityForm} />
      </main>
      <SiteFooter />
      {/* Last in the page so sticky keeps it pinned through the footer, then it ends below it. */}
      <CtaBanner cta={cta} />
    </>
  );
}
