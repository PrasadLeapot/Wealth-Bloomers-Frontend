import qs from "qs";

// Strapi backend URL
const STRAPI_URL = (
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  "http://localhost:1337"
).replace(/\/$/, "");

// Convert Strapi media path into a complete URL
export function getStrapiMedia(url) {
  if (!url) return "";

  // If Strapi already returns a complete URL
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // If Strapi returns a relative path like /uploads/image.png
  return `${STRAPI_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

// Fetch data from Strapi
export async function fetchStrapiAPI(endpoint, customPopulate = null) {
  let populate = customPopulate;

  if (!populate) {
    if (endpoint === "home") {
      populate = {
        heroImage: true,
        steps: true,
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

  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    let details = "";
    try {
      const errBody = await response.json();
      details = errBody?.error?.message ? ` - ${errBody.error.message}` : "";
    } catch {
      // ignore non-JSON error responses
    }
    throw new Error(`Strapi API error: ${response.status}${details}`);
  }

  const result = await response.json();

  // Handles Strapi v4 (result.data.attributes) and v5 (result.data)
  if (!result?.data) return null;
  return result.data.attributes ?? result.data;
}
