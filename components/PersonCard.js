import { getStrapiMedia } from "@/lib/strapi";
import BlocksContent from "./BlocksContent";

export default function PersonCard({ person }) {
  const photo = getStrapiMedia(person.photo?.url);

  return (
    <article className="person-card">
      {photo && (
        <img
          src={photo}
          alt={person.name}
          className="person-photo"
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