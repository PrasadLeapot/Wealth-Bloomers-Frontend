import { fetchStrapiAPI } from "@/lib/strapi";
import BlocksContent from "@/components/BlocksContent";
import TeamSlider from "@/components/TeamSlider";
export const dynamic = "force-dynamic";

export default async function AboutPage() {
  let about;

  try {
    about = await fetchStrapiAPI("about-page");
  } catch (error) {
    console.error(error);
    return (
      <p className="error-message">
        Unable to load About Us page.
      </p>
    );
  }

  return (
    <>
      <section className="page-hero">
        <h1>{about.pageTitle}</h1>
      </section>

      <section className="section">
        <BlocksContent content={about.introduction} />
      </section>

      <section className="section team-section">
        <h2>{about.teamTitle}</h2>

        <BlocksContent content={about.teamDescription} />

        <TeamSlider people={about.people} />
      </section>
    </>
  );
}
