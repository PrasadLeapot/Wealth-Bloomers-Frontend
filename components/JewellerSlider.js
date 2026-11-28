"use client";

import React, { useState, useRef } from "react";

const SWIPE_THRESHOLD = 60;
const CLICK_TOLERANCE = 8;
const SLOTS = [-3, -2, -1, 0, 1, 2, 3];

const mod = (n, m) => ((n % m) + m) % m;

export default function JewellerSlider({ title, jewellers = [] }) {
  // Unbounded position: never wraps, so cards never jump across the track
  const [position, setPosition] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const startX = useRef(null);
  const movedDistance = useRef(0);

  const total = jewellers.length;
  if (!total) return null;

  const prevSlide = () => setPosition((p) => p - 1);
  const nextSlide = () => setPosition((p) => p + 1);

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
    setTimeout(() => (movedDistance.current = 0), 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") prevSlide();
    if (e.key === "ArrowRight") nextSlide();
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

        {SLOTS.map((offset) => {
          const absolute = position + offset;       // stable key per card
          const item = jewellers[mod(absolute, total)];
          const isCenter = offset === 0;

          return (
            <article
              key={absolute}
              aria-hidden={!isCenter}
              onClick={() => {
                if (movedDistance.current > CLICK_TOLERANCE) return;
                if (offset < 0) prevSlide();
                if (offset > 0) nextSlide();
              }}
              className={`curved-card ${isCenter ? "is-active" : ""}`}
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