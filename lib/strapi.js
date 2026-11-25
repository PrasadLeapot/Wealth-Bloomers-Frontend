import qs from "qs";

// Strapi backend URL
const STRAPI_URL = (
  process.env.STRAPI_URL ||
  "https://strapi-wealth-bloomers.onrender.com"
).replace(/\/$/, "");

export function getStrapiMedia(url) {
  if (!url) return "";

  // If Strapi already returns a complete URL
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Convert relative path into absolute URL
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

  const url = `${STRAPI_URL}/api/${endpoint}${
    query ? `?${query}` : ""
  }`;

  console.log("Strapi API URL:", url);

  try {
    // About page: always get fresh content from Strapi
    // Other pages: retain the existing 1-hour cache
    const response = await fetch(url, 
      endpoint === "about-page"
        ? { cache: "no-store" }
        : {
            next: {
              revalidate: 3600,
            },
          }
    );

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


// import qs from "qs";

// // Strapi backend URL
// const STRAPI_URL = (
//   process.env.STRAPI_URL || "http://localhost:1337"
// ).replace(/\/$/, "");

// export function getStrapiMedia(url) {
//   if (!url) return "";

//   // If Strapi already returns a complete URL
//   if (url.startsWith("http://") || url.startsWith("https://")) {
//     return url;
//   }

//   // Convert relative path into absolute URL
//   return `${STRAPI_URL}${url.startsWith("/") ? "" : "/"}${url}`;
// }

// // Fetch data from Strapi
// export async function fetchStrapiAPI(endpoint, customPopulate = null) {
//   let populate = customPopulate;

//   if (!populate) {
//     if (endpoint === "home") {
//       populate = {
//         heroImage: true,
//         steps: true,
//         jewellers: {
//           populate: {
//             logo: true,
//           },
//         },
//       };
//     } else if (endpoint === "about-page") {
//       populate = {
//         people: {
//           populate: {
//             photo: true,
//           },
//         },
//       };
//     } else if (endpoint === "faq-page") {
//       populate = {
//         faqs: true,
//       };
//     } else {
//       populate = {};
//     }
//   }

//   const query = qs.stringify(
//     { populate },
//     { encodeValuesOnly: true }
//   );

//   const url = `${STRAPI_URL}/api/${endpoint}${query ? `?${query}` : ""}`;

//   console.log("Strapi API URL:", url);

//   try {
//     const response = await fetch(url, {
//       next: {
//         revalidate: 3600,
//       },
//     });

//     if (!response.ok) {
//       const errorText = await response.text();

//       console.error("Strapi API Error:", response.status, errorText);

//       throw new Error(`Strapi API error: ${response.status}`);
//     }

//     const result = await response.json();

//     if (!result?.data) {
//       console.error("No data returned from Strapi:", result);
//       return null;
//     }

//     // Strapi v4 and v5 compatibility
//     return result.data.attributes ?? result.data;

//   } catch (error) {
//     console.error("Failed to fetch Strapi content:", error);
//     throw error;
//   }
// }
