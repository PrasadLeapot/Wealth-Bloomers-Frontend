"use client";

import React, { useState, useRef } from "react";

const SWIPE_THRESHOLD = 60;
const CLICK_TOLERANCE = 8;

export default function JewellerSlider({ title, jewellers = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const startX = useRef(null);
  const movedDistance = useRef(0);

  const total = jewellers.length;
  if (!total) return null;

  const prevSlide = () => setActiveIndex((p) => (p - 1 + total) % total);
  const nextSlide = () => setActiveIndex((p) => (p + 1) % total);

  const handlePointerDown = (e) => {
    if (e.target.closest("button")) return;
    startX.current = e.clientX;
    movedDistance.current = 0;
    setIsDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging || startX.current === null) return;
    const delta = e.clientX - startX.current;
    movedDistance.current = Math.abs(delta);
    setDragX(delta);
  };

  const endDrag = () => {
    if (!isDragging) return;
    if (dragX < -SWIPE_THRESHOLD) nextSlide();
    else if (dragX > SWIPE_THRESHOLD) prevSlide();

    startX.current = null;
    setDragX(0);
    setIsDragging(false);
    // keep the distance until the click event has fired
    setTimeout(() => (movedDistance.current = 0), 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") prevSlide();
    if (e.key === "ArrowRight") nextSlide();
  };

  // Shortest circular distance from the active slide
  const getOffset = (index) => {
    const half = Math.floor(total / 2);
    return ((index - activeIndex + total + half) % total) - half;
  };

  return (
    <section
      className="section jewellers-curved-section"
      aria-roledescription="carousel"
      aria-label={title}
    >
      <h2 className="jewellers-curved-title">{title}</h2>

      <div
        className={`curved-slider-viewport ${isDragging ? "is-dragging" : ""}`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div className="curved-mask curved-mask--top" aria-hidden="true" />
        <div className="curved-mask curved-mask--bottom" aria-hidden="true" />

        {jewellers.map((item, index) => {
          const offset = getOffset(index);
          if (Math.abs(offset) > 3) return null;

          const isCenter = offset === 0;
          const isHidden = Math.abs(offset) === 3;

          return (
            <article
              key={item.id ?? index}
              aria-hidden={!isCenter}
              onClick={() => {
                if (movedDistance.current > CLICK_TOLERANCE) return;
                if (offset < 0) prevSlide();
                if (offset > 0) nextSlide();
              }}
              className={`curved-card ${isCenter ? "is-active" : ""} ${
                isHidden ? "is-hidden" : ""
              }`}
              style={{ "--offset": offset, "--drag": `${dragX}px` }}
            >
              <div className="jeweller-card__media">
                {item.logoUrl ? (
                  <img src={item.logoUrl} alt={item.name} draggable="false" />
                ) : (
                  <div className="jeweller-card__placeholder">
                    {item.name?.charAt(0)}
                  </div>
                )}
              </div>

              <div className="jeweller-card__content">
                <h3>{item.name}</h3>
                {item.location && (
                  <span className="jeweller-card__tag">{item.location}</span>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <div className="curved-slider-controls">
        <button
          type="button"
          className="curved-nav-btn"
          onClick={prevSlide}
          aria-label="Previous jeweller"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>

        <button
          type="button"
          className="curved-nav-btn"
          onClick={nextSlide}
          aria-label="Next jeweller"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </section>
  );
}