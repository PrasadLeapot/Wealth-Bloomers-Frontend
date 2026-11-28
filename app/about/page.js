import { fetchStrapiAPI } from "@/lib/strapi";
import BlocksContent from "@/components/BlocksContent";
import TeamSlider from "@/components/TeamSlider";

// revalidation fetch cache 5 min
export const revalidate = 300;

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

  if (!about) {
    return (
      <p className="error-message">
        About Us content is currently unavailable.
      </p>
    );
  }

  return (
    <>
      <section className="page-hero about-hero">
        <div className="about-hero__inner">
          <span className="eyebrow">Our Team</span>
          <h1>{about.pageTitle}</h1>
          <span className="about-hero__bar" aria-hidden="true" />
        </div>
      </section>

      <section className="section team-section">
        <div className="team-section__header">
          {/* <h2>{about.teamTitle}</h2> */}
          <BlocksContent content={about.teamDescription} />
        </div>

        <TeamSlider people={about.people} />
      </section>
    </>
  );
}
