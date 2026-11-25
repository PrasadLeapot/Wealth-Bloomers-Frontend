import BlocksContent from "./BlocksContent";

const STRAPI_URL = "https://strapi-wealth-bloomers.onrender.com";

export default function PersonCard({ person }) {
  const imageUrl = person?.photo?.url
    ? person.photo.url.startsWith("http")
      ? person.photo.url
      : `${STRAPI_URL}${person.photo.url}`
    : null;

  console.log("Person:", person.name);
  console.log("Photo object:", person.photo);
  console.log("Image URL:", imageUrl);

  return (
    <article className="person-card">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={person.name || "Team member"}
          className="person-photo"
          onError={(e) => {
            console.error("Image failed:", e.currentTarget.src);
          }}
        />
      )}

      <div>
        <h3>{person.name}</h3>

        <p className="designation">
          {person.designation}
        </p>

        <BlocksContent content={person.biography} />
      </div>
    </article>
  );
}