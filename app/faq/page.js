
import { fetchStrapiAPI } from "@/lib/strapi";
import FAQAccordion from "@/components/FAQAcc";

export const dynamic = "force-dynamic";

export default async function FAQPage() {
  let faqPage;

  try {
    faqPage = await fetchStrapiAPI("faq-page");
  } catch (error) {
    console.error(error);

    return <p className="error-message">
      Unable to load FAQ page.
    </p>;
  }

  return (
    <>
      <section className="page-hero">
        <h1>{faqPage.pageTitle}</h1>
        <p>{faqPage.subtitle}</p>
      </section>

      <section className="section faq-section">
        <FAQAccordion faqs={faqPage.faqs} />
      </section>
    </>
  );
}
