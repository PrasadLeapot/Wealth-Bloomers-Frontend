"use client";

import { useState, useEffect } from "react";
import BlocksContent from "@/components/BlocksContent";
import { getStrapiMedia } from "@/lib/strapi";

function resolveMediaUrl(media) {
  if (!media) return null;
  const raw =
    typeof media === "string"
      ? media
      : media?.url ||
        media?.data?.attributes?.url ||
        media?.attributes?.url ||
        null;
  return raw ? getStrapiMedia(raw) : null;
}

export default function HowItWorksSection({ home }) {
  const steps = home?.steps || [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance steps every 4s until user interacts
  useEffect(() => {
    if (steps.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [steps.length, isPaused]);

  const activeStep = steps[activeIndex] || steps[0];
  const activeScreenUrl = resolveMediaUrl(activeStep?.screenImage);

  const handleSelectStep = (index) => {
    setActiveIndex(index);
    setIsPaused(true);
  };

  return (
    <section
      style={{
        background: "linear-gradient(180deg, #c6cee2 0%, #b5bfd6 100%)",
        padding: "72px 20px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1060px", margin: "0 auto" }}>
        <h2
          style={{
            textAlign: "center",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            color: "#0b1f5e",
            fontSize: "clamp(24px, 3.2vw, 36px)",
            fontWeight: 800,
            lineHeight: 1.2,
            marginBottom: "40px",
          }}
        >
          {home?.howItWorksTitle || "How Does It Work?"}
        </h2>

        {steps.length > 0 && (
          <div
            className="how-it-works-layout"
            onMouseEnter={() => setIsPaused(true)}
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              gap: "44px",
            }}
          >
            {/* Mobile-First Top Horizontal Timeline (Hidden on Desktop where Pills sit right beside Phone) */}
            <div
              role="tablist"
              aria-label="How it works steps"
              className="step-timeline"
            >
              <span aria-hidden="true" className="step-timeline__line" />
              {steps.map((step, index) => {
                const isActive = index === activeIndex;
                const formattedNumber = String(
                  step.number ?? index + 1
                ).padStart(2, "0");

                return (
                  <button
                    key={step.id ?? index}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => handleSelectStep(index)}
                    className={`step-timeline__btn ${
                      isActive ? "step-timeline__btn--active" : ""
                    }`}
                  >
                    {formattedNumber}
                  </button>
                );
              })}
            </div>

            {/* Center: Realistic Mobile Mockup & Active Description */}
            <div
              className="how-it-works-center"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                maxWidth: "280px",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "240px",
                  height: "480px",
                  background: "linear-gradient(145deg, #232730, #0d0f13)",
                  borderRadius: "42px",
                  padding: "10px",
                  boxShadow:
                    "0 28px 56px -12px rgba(11, 31, 94, 0.32), 0 0 0 2px #424854, inset 0 0 0 1.5px rgba(255,255,255,0.12)",
                }}
              >
                {/* Left Hardware Volume Buttons */}
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: "-4px",
                    top: "92px",
                    width: "3px",
                    height: "28px",
                    background: "#3c424d",
                    borderRadius: "3px 0 0 3px",
                  }}
                />
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: "-4px",
                    top: "130px",
                    width: "3px",
                    height: "46px",
                    background: "#3c424d",
                    borderRadius: "3px 0 0 3px",
                  }}
                />

                {/* Right Hardware Power Button */}
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    right: "-4px",
                    top: "112px",
                    width: "3px",
                    height: "54px",
                    background: "#3c424d",
                    borderRadius: "0 3px 3px 0",
                  }}
                />

                {/* Dynamic Island / Camera Notch */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: "17px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "74px",
                    height: "18px",
                    background: "#090a0d",
                    borderRadius: "999px",
                    zIndex: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingRight: "7px",
                  }}
                >
                  <span
                    style={{
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      background: "#1e2c4a",
                      boxShadow: "inset 0 0 2px rgba(120,170,255,0.6)",
                    }}
                  />
                </div>

                {/* Screen Viewport */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    background: "#121526",
                    borderRadius: "32px",
                    overflow: "hidden",
                  }}
                >
                  {activeScreenUrl && (
                    <img
                      key={activeScreenUrl}
                      src={activeScreenUrl}
                      alt={
                        activeStep?.screenImage?.alternativeText ||
                        activeStep?.title ||
                        `Step ${activeIndex + 1} screen`
                      }
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "top center",
                        display: "block",
                        animation: "screenFadeIn 0.3s ease",
                      }}
                    />
                  )}

                  {/* Subtle Top Screen Glass Reflection */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(125deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0) 42%)",
                      pointerEvents: "none",
                      zIndex: 2,
                    }}
                  />
                </div>

                {/* Bottom Home Indicator */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    bottom: "15px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "84px",
                    height: "4px",
                    borderRadius: "999px",
                    background: "rgba(255, 255, 255, 0.55)",
                    zIndex: 3,
                    pointerEvents: "none",
                  }}
                />
              </div>

              {activeStep?.description && (
                <div
                  className="step-active-description"
                  style={{
                    marginTop: "18px",
                    minHeight: "44px",
                    textAlign: "center",
                    color: "#0f172a",
                    fontSize: "14px",
                    fontWeight: 500,
                    lineHeight: 1.5,
                  }}
                >
                  <BlocksContent content={activeStep.description} />
                </div>
              )}
            </div>

            {/* Right: Interactive Step Pills */}
            <div
              className="step-buttons"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                width: "100%",
                maxWidth: "360px",
              }}
            >
              {steps.map((step, index) => {
                const isActive = index === activeIndex;
                const iconUrl = resolveMediaUrl(step.icon);
                const formattedNumber = String(
                  step.number ?? index + 1
                ).padStart(2, "0");

                return (
                  <button
                    key={step.id ?? index}
                    type="button"
                    onClick={() => handleSelectStep(index)}
                    className={`step-pill ${isActive ? "step-pill--active" : ""}`}
                  >
                    <span aria-hidden="true" className="step-pill__badge">
                      {iconUrl ? (
                        <img
                          src={iconUrl}
                          alt=""
                          style={{
                            width: "20px",
                            height: "20px",
                            objectFit: "contain",
                          }}
                        />
                      ) : (
                        formattedNumber
                      )}
                    </span>

                    <span className="step-pill__title">{step.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        /* Mobile Step Timeline (Visible on Mobile & Tablet) */
        .step-timeline {
          position: relative;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          max-width: 280px;
          margin: 0 auto;
        }

        .step-timeline__line {
          position: absolute;
          left: 20px;
          right: 20px;
          top: 50%;
          height: 2px;
          background: rgba(11, 31, 94, 0.25);
          transform: translateY(-50%);
          z-index: 0;
        }

        .step-timeline__btn {
          position: relative;
          z-index: 1;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.7);
          background: rgba(255, 255, 255, 0.85);
          color: #0b1f5e;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          display: grid;
          place-items: center;
          box-shadow: 0 4px 10px rgba(11, 31, 94, 0.1);
          transition: all 0.2s ease;
        }

        .step-timeline__btn--active {
          background: #0b1f5e;
          border-color: #0b1f5e;
          color: #ffffff;
          transform: scale(1.12);
          box-shadow: 0 6px 16px rgba(11, 31, 94, 0.28);
        }

        /* Hide duplicate timeline on desktop where side-by-side pills are visible */
        @media (min-width: 769px) {
          .step-timeline {
            display: none;
          }
        }

        /* Mobile adjustments for layout spacing */
        @media (max-width: 768px) {
          .how-it-works-layout {
            flex-direction: column;
            gap: 28px !important;
          }

          .step-pill--active {
            transform: none;
          }
        }

        /* Pill Buttons */
        .step-pill {
          display: flex;
          align-items: center;
          gap: 14px;
          width: 100%;
          min-height: 58px;
          padding: 8px 20px 8px 9px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.65);
          background: rgba(255, 255, 255, 0.72);
          backdrop-filter: blur(8px);
          color: #0b1f5e;
          text-align: left;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(11, 31, 94, 0.06);
          transition: transform 0.2s ease, background 0.2s ease,
            box-shadow 0.2s ease, border-color 0.2s ease;
        }

        .step-pill:hover:not(.step-pill--active) {
          background: rgba(255, 255, 255, 0.94);
          transform: translateX(4px);
          box-shadow: 0 8px 18px rgba(11, 31, 94, 0.1);
        }

        .step-pill--active {
          background: linear-gradient(135deg, #0b1f5e 0%, #15348f 100%);
          border-color: #0b1f5e;
          color: #ffffff;
          transform: translateX(6px);
          box-shadow: 0 12px 24px rgba(11, 31, 94, 0.26);
        }

        .step-pill__badge {
          flex: 0 0 40px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #0b1f5e;
          color: #ffffff;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.02em;
          display: grid;
          place-items: center;
          overflow: hidden;
          transition: background 0.2s ease, color 0.2s ease;
        }

        .step-pill--active .step-pill__badge {
          background: #ffffff;
          color: #0b1f5e;
        }

        .step-pill__title {
          font-size: 15px;
          font-weight: 600;
          line-height: 1.35;
        }

        @keyframes screenFadeIn {
          from {
            opacity: 0.3;
            transform: scale(1.02);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </section>
  );
}