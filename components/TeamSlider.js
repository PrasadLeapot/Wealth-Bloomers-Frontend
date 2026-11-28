"use client";

import { useRef, useState } from "react";
import PersonCard from "./PersonCard";

const SWIPE_THRESHOLD = 60;
const CLICK_TOLERANCE = 8;

export default function TeamSlider({ people = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const startX = useRef(null);
  const pointerId = useRef(null);
  const captured = useRef(false);
  const movedDistance = useRef(0);

  const total = people.length;
  if (!total) return null;

  const last = total - 1;
  const goTo = (i) => setActiveIndex(Math.min(last, Math.max(0, i)));
  const prevSlide = () => goTo(activeIndex - 1);
  const nextSlide = () => goTo(activeIndex + 1);

  const formatIndex = (num) => String(num).padStart(2, "0");

  const handlePointerDown = (e) => {
    if (total <= 1) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;

    startX.current = e.clientX;
    pointerId.current = e.pointerId;
    captured.current = false;
    movedDistance.current = 0;
    setIsDragging(true);
  };

  const handlePointerMove = (e) => {
    if (!isDragging || startX.current === null) return;
    if (e.pointerId !== pointerId.current) return;

    const delta = e.clientX - startX.current;
    movedDistance.current = Math.abs(delta);

    if (!captured.current && movedDistance.current > CLICK_TOLERANCE) {
      e.currentTarget.setPointerCapture?.(e.pointerId);
      captured.current = true;
    }

    const atStart = activeIndex === 0 && delta > 0;
    const atEnd = activeIndex === last && delta < 0;
    setDragX(atStart || atEnd ? delta * 0.25 : delta);
  };

  const endDrag = (e) => {
    if (!isDragging) return;
    if (e?.pointerId !== undefined && e.pointerId !== pointerId.current) return;

    if (captured.current) {
      e?.currentTarget?.releasePointerCapture?.(pointerId.current);
    }

    if (dragX < -SWIPE_THRESHOLD) nextSlide();
    else if (dragX > SWIPE_THRESHOLD) prevSlide();

    startX.current = null;
    pointerId.current = null;
    captured.current = false;
    setDragX(0);
    setIsDragging(false);
    setTimeout(() => (movedDistance.current = 0), 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") prevSlide();
    if (e.key === "ArrowRight") nextSlide();
  };

  return (
    <div
      className="team-curved"
      aria-roledescription="carousel"
      aria-label="Team members"
    >
      <div
        className={`team-curved-viewport ${isDragging ? "is-dragging" : ""}`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div
          className="team-curved-track"
          style={{ "--index": activeIndex, "--drag": `${dragX}px` }}
        >
          {people.map((person, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={person.id ?? person.name ?? index}
                className={`team-curved-slide ${isActive ? "is-active" : ""}`}
                aria-hidden={!isActive}
                onClick={() => {
                  if (movedDistance.current > CLICK_TOLERANCE) return;
                  if (!isActive) goTo(index);
                }}
              >
                <PersonCard person={person} />
              </div>
            );
          })}
        </div>
      </div>

      {total > 1 && (
        <div className="curved-slider-controls">
          <button
            type="button"
            className="curved-nav-btn"
            onClick={prevSlide}
            disabled={activeIndex === 0}
            aria-label="Previous team member"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>

          <div className="team-slider-status">
            <span className="team-slider-counter" aria-hidden="true">
              <strong>{formatIndex(activeIndex + 1)}</strong>
              <span className="counter-sep">/</span>
              <span>{formatIndex(total)}</span>
            </span>

            <div
              className="team-curved-dots"
              role="tablist"
              aria-label="Select team member"
            >
              {people.map((person, index) => (
                <button
                  key={person.id ?? person.name ?? index}
                  type="button"
                  role="tab"
                  aria-selected={index === activeIndex}
                  aria-label={`Go to ${person.name || `member ${index + 1}`}`}
                  className={`team-curved-dot ${
                    index === activeIndex ? "is-active" : ""
                  }`}
                  onClick={() => goTo(index)}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            className="curved-nav-btn"
            onClick={nextSlide}
            disabled={activeIndex === last}
            aria-label="Next team member"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
