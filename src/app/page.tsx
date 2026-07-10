import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Hero } from "@/components/landing/Hero";
import { TrustMarquee } from "@/components/landing/TrustMarquee";
import { ValueProps } from "@/components/landing/ValueProps";
import { SectionsShowcase } from "@/components/landing/SectionsShowcase";
import { FeaturedProjects } from "@/components/landing/FeaturedProjects";
import { BorderBeamCTA } from "@/components/landing/BorderBeamCTA";
import { Reveal } from "@/components/Reveal";

export default function HomePage() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <TrustMarquee />
        <ValueProps />
        <SectionsShowcase />
        <FeaturedProjects />
        <section className="mx-auto max-w-7xl px-4 pb-28 sm:px-6">
          <Reveal>
            <BorderBeamCTA />
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
