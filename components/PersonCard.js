"use client";

import { useState } from "react";
import BlocksContent from "./BlocksContent";

const STRAPI_URL = "https://strapi-wealth-bloomers.onrender.com";

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

export default function PersonCard({ person }) {
  const [imgError, setImgError] = useState(false);

  const imageUrl = person?.photo?.url
    ? person.photo.url.startsWith("http")
      ? person.photo.url
      : `${STRAPI_URL}${person.photo.url}`
    : null;

  const showImage = Boolean(imageUrl) && !imgError;

  return (
    <article className="person-card">
      <div className="person-media-wrap">
        <div className="person-media-backdrop" aria-hidden="true" />
        <div className={`person-media-box ${!showImage ? "is-initials" : ""}`}>
          {showImage ? (
            <img
              src={imageUrl}
              alt={person.name || "Team member"}
              className="person-photo"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="person-initials" aria-hidden="true">
              {getInitials(person.name) || "TM"}
            </span>
          )}
        </div>
      </div>

      <div className="person-info">
        <h3>{person.name}</h3>

        {person.designation && (
          <span className="designation">{person.designation}</span>
        )}

        <div className="person-bio">
          <BlocksContent content={person.biography} />
        </div>
      </div>
    </article>
  );
}
