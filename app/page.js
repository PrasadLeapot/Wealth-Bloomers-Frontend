import { fetchStrapiAPI, getStrapiMedia } from "@/lib/strapi";
import BlocksContent from "@/components/BlocksContent";
import HowItWorksSection from "@/components/HowItWorks";
import JewellerSlider from "@/components/JewellerSlider";

export default async function HomePage() {
  let home;

  try {
    home = await fetchStrapiAPI("home");
  } catch (error) {
    console.error(error);
    return (
      <p className="error-message">
        Unable to load Home page content.
      </p>
    );
  }

  const image = getStrapiMedia(home.heroImage?.[0]?.url);

  // Resolve media URLs on the server before passing to the Client Component
  const jewellersList =
    home.jewellers?.map((jeweller) => ({
      name: jeweller.name,
      location: jeweller.location || "",
      logoUrl: jeweller.logo?.url ? getStrapiMedia(jeweller.logo.url) : null,
    })) || [];

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">WELCOME TO</p>

          <h1>{home.pageTitle}</h1>

          <p>{home.heroSubtitle}</p>

          {(home.playStoreUrl || home.appStoreUrl || home.appButtonUrl) && (
            <div className="store-buttons">
              {home.playStoreUrl && (
                <a
                  href={home.playStoreUrl}
                  className="store-btn store-btn--play"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Get Wealth Bloomers on Google Play"
                >
                  <svg
                    className="store-icon"
                    viewBox="0 0 24 24"
                    width="22"
                    height="22"
                    aria-hidden="true"
                  >
                    <path
                      fill="#4285F4"
                      d="M3.61 1.814L13.793 12 3.61 22.186a1.98 1.98 0 0 1-.61-1.436V3.25c0-.544.22-1.063.61-1.436z"
                    />
                    <path
                      fill="#34A853"
                      d="M17.202 8.59L5.864 2.658a1.96 1.96 0 0 0-2.254.212L13.793 12l3.409-3.41z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M17.202 15.41L13.793 12 3.61 22.13c.62.58 1.52.71 2.254.212l11.338-6.932z"
                    />
                    <path
                      fill="#EA4335"
                      d="M20.506 10.701l-3.304-2.111L13.793 12l3.409 3.41 3.304-2.111a1.5 1.5 0 0 0 0-2.598z"
                    />
                  </svg>
                  <span>
                    <small>Get it on</small>
                    <strong>Google Play</strong>
                  </span>
                </a>
              )}

              {(home.appStoreUrl || home.appButtonUrl) && (
                <a
                  href={home.appStoreUrl || home.appButtonUrl}
                  className="store-btn store-btn--ios"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Download Wealth Bloomers on the App Store for iOS"
                >
                  <svg
                    className="store-icon"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.33c.64-.78 1.08-1.86.96-2.94-.93.04-2.05.62-2.71 1.4-.58.68-1.1 1.79-.96 2.84 1.04.08 2.07-.52 2.71-1.3z" />
                  </svg>
                  <span>
                    <small>Download on the</small>
                    <strong>App Store</strong>
                  </span>
                </a>
              )}
            </div>
          )}
        </div>

        {image && (
          <img
            src={image}
            alt="Wealth Bloomers"
            className="hero-image"
          />
        )}
      </section>

      <section className="section">
        <h2>{home.introductionTitle}</h2>
        <BlocksContent content={home.introduction} />
      </section>

      <HowItWorksSection home={home} />

      <JewellerSlider
        title={home.jewellersTitle}
        jewellers={jewellersList}
      />
    </>
  );
}
