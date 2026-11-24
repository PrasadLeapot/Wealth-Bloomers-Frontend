//hand slider
"use client";

import { useRef, useState } from "react";
import PersonCard from "./PersonCard";

const DRAG_THRESHOLD = 10;

export default function TeamSlider({ people = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const viewportRef = useRef(null);
  const startXRef = useRef(null);
  const pointerIdRef = useRef(null);

  if (!people.length) {
    return null;
  }

  const handlePointerDown = (e) => {
    if (people.length <= 1) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;

    startXRef.current = e.clientX;
    pointerIdRef.current = e.pointerId;
    setIsDragging(true);
    setDragOffset(0);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging || startXRef.current === null) return;
    if (pointerIdRef.current !== null && e.pointerId !== pointerIdRef.current) {
      return;
    }

    const deltaX = e.clientX - startXRef.current;

    // Gentle resistance at the very first or last slide
    const atStart = activeIndex === 0 && deltaX > 0;
    const atEnd = activeIndex === people.length - 1 && deltaX < 0;
    const adjustedDelta = atStart || atEnd ? deltaX * 0.25 : deltaX;

    setDragOffset(adjustedDelta);
  };

  const finishDrag = (e) => {
    if (!isDragging || startXRef.current === null) return;
    if (pointerIdRef.current !== null && e?.pointerId !== undefined && e.pointerId !== pointerIdRef.current) {
      return;
    }

    if (pointerIdRef.current !== null) {
      e?.currentTarget?.releasePointerCapture?.(pointerIdRef.current);
    }

    const deltaX = dragOffset;
    const width = viewportRef.current?.clientWidth || 300;
    const threshold = Math.min(DRAG_THRESHOLD, width * 0.2);

    if (deltaX < -threshold && activeIndex < people.length - 1) {
      setActiveIndex((prev) => prev + 1);
    } else if (deltaX > threshold && activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }

    startXRef.current = null;
    pointerIdRef.current = null;
    setDragOffset(0);
    setIsDragging(false);
  };

  const handleKeyDown = (e) => {
    if (people.length <= 1) return;
    if (e.key === "ArrowLeft") {
      setActiveIndex((prev) => Math.max(0, prev - 1));
    } else if (e.key === "ArrowRight") {
      setActiveIndex((prev) => Math.min(people.length - 1, prev + 1));
    }
  };

  return (
    <div
      className="team-slider"
      aria-roledescription="carousel"
      aria-label="Team members"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div
        ref={viewportRef}
        className={`team-slider-viewport ${isDragging ? "is-dragging" : ""}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
      >
        <div
          className="team-slider-track"
          style={{
            transform: `translateX(calc(-${activeIndex * 100}% + ${dragOffset}px))`,
            transition: isDragging
              ? "none"
              : "transform 0.35s cubic-bezier(0.25, 0.8, 0.25, 1)",
          }}
        >
          {people.map((person, index) => (
            <div className="team-slide" key={person.id ?? person.name ?? index}>
              <PersonCard person={person} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


//button slider
// "use client";

// import { useState } from "react";
// import PersonCard from "./PersonCard";

// export default function TeamSlider({ people = [] }) {
//   const [activeIndex, setActiveIndex] = useState(0);

//   if (!people.length) {
//     return null;
//   }

//   const handlePrev = () => {
//     setActiveIndex((prev) => (prev === 0 ? people.length - 1 : prev - 1));
//   };

//   const handleNext = () => {
//     setActiveIndex((prev) => (prev === people.length - 1 ? 0 : prev + 1));
//   };

//   return (
//     <div className="team-slider" aria-roledescription="carousel" aria-label="Team members">
//       <div className="team-slider-viewport">
//         <div
//           className="team-slider-track"
//           style={{ transform: `translateX(-${activeIndex * 100}%)` }}
//         >
//           {people.map((person, index) => (
//             <div className="team-slide" key={person.id ?? person.name ?? index}>
//               <PersonCard person={person} />
//             </div>
//           ))}
//         </div>
//       </div>

//       {people.length > 1 && (
//         <div className="team-slider-controls">
//           <button
//             type="button"
//             className="slider-btn"
//             onClick={handlePrev}
//             aria-label="Previous team member"
//           >
//             ←
//           </button>

//           <div className="slider-dots" role="tablist" aria-label="Select team member">
//             {people.map((person, index) => (
//               <button
//                 key={person.id ?? person.name ?? index}
//                 type="button"
//                 role="tab"
//                 aria-selected={activeIndex === index}
//                 aria-label={`Go to ${person.name || `slide ${index + 1}`}`}
//                 className={`slider-dot ${activeIndex === index ? "slider-dot--active" : ""}`}
//                 onClick={() => setActiveIndex(index)}
//               />
//             ))}
//           </div>

//           <button
//             type="button"
//             className="slider-btn"
//             onClick={handleNext}
//             aria-label="Next team member"
//           >
//             →
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

