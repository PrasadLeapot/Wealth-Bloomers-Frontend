import qs from "qs";

// Strapi backend URL
const STRAPI_URL = (
  process.env.STRAPI_URL ||
  "https://strapi-wealth-bloomers.onrender.com"
).replace(/\/$/, "");

export function getStrapiMedia(url) {
  if (!url) return "";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `${STRAPI_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

// Fetch data from Strapi
export async function fetchStrapiAPI(endpoint, customPopulate = null) {
  let populate = customPopulate;

  if (!populate) {
    if (endpoint === "home") {
      populate = {
        heroImage: true,
        steps: {
          populate: {
            screenImage: true,
          },
        },
        jewellers: {
          populate: {
            logo: true,
          },
        },
      };
    } else if (endpoint === "about-page") {
      populate = {
        people: {
          populate: {
            photo: true,
          },
        },
      };
    } else if (endpoint === "faq-page") {
      populate = {
        faqs: true,
      };
    } else {
      populate = {};
    }
  }

  const query = qs.stringify(
    { populate },
    { encodeValuesOnly: true }
  );

  const url = `${STRAPI_URL}/api/${endpoint}${query ? `?${query}` : ""}`;

  console.log("Strapi API URL:", url);

  // Shorter revalidation window for frequently edited pages; 1 hour for others
  const revalidateSeconds = endpoint === "about-page" ? 300 : 3600;

  try {
    const response = await fetch(url, {
      next: {
        revalidate: revalidateSeconds,
        tags: ["strapi", `strapi-${endpoint}`],
      },
    });

    if (!response.ok) {
      const errorText = await response.text();

      console.error("Strapi API Error:", response.status, errorText);

      throw new Error(`Strapi API error: ${response.status}`);
    }

    const result = await response.json();

    if (!result?.data) {
      console.error("No data returned from Strapi:", result);
      return null;
    }

    // Strapi v4 and v5 compatibility
    return result.data.attributes ?? result.data;
  } catch (error) {
    console.error("Failed to fetch Strapi content:", error);
    throw error;
  }
}