"use client";

import { useState } from "react";
import Image from "next/image";
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

  const activeStep = steps[activeIndex] || steps[0];
  const activeScreenUrl = resolveMediaUrl(activeStep?.screenImage);

  return (
    <section
      style={{
        background: "#bcc4d9",
        padding: "88px 24px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: "0.03em",
          color: "#0b1f5e",
          fontSize: "clamp(28px, 3.5vw, 38px)",
          fontWeight: 700,
          lineHeight: 1.2,
          marginBottom: "48px",
        }}
      >
        {home?.howItWorksTitle || "How Does It Work?"}
      </h2>

      {steps.length > 0 && (
        <div
          className="how-it-works-layout"
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: "44px",
            maxWidth: "1140px",
            margin: "0 auto",
          }}
        >
          {/* Left (desktop) / Top (mobile): Numbered Step Timeline */}
          <div
            role="tablist"
            aria-label="How it works steps"
            className="step-timeline"
          >
            <span aria-hidden="true" className="step-timeline__line" />
            {steps.map((step, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={step.id ?? index}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveIndex(index)}
                  className={`step-timeline__btn ${
                    isActive ? "step-timeline__btn--active" : ""
                  }`}
                >
                  {step.number ?? index + 1}
                </button>
              );
            })}
          </div>

          {/* Center: Mobile Frame & Active Step Description */}
          <div
            className="how-it-works-center"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              maxWidth: "320px",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "240px",
                height: "480px",
                background: "linear-gradient(145deg, #1d2128, #0e1014)",
                borderRadius: "40px",
                padding: "10px",
                boxShadow:
                  "0 24px 48px rgba(11, 31, 94, 0.22), 0 0 0 2px #3c424d, inset 0 0 0 1px rgba(255,255,255,0.08)",
              }}
            >
              {/* Top Speaker / Camera Notch */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: "16px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "76px",
                  height: "18px",
                  background: "#0d0f12",
                  borderRadius: "999px",
                  zIndex: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  paddingRight: "8px",
                }}
              >
                <span
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: "#25314d",
                    boxShadow: "inset 0 0 2px rgba(120,170,255,0.5)",
                  }}
                />
              </div>

              {/* Screen Viewport */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  background: "#ffffff",
                  borderRadius: "30px",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {activeScreenUrl ? (
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
                      animation: "screenFadeIn 0.25s ease",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      padding: "16px",
                      textAlign: "center",
                      color: "#0b1f5e",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        marginBottom: "48px",
                      }}
                    >
                      Welcome to Wealth Bloomers App
                    </p>
                    <Image
                      src="/logo.png"
                      alt="Wealth Bloomers Logo"
                      width={180}
                      height={72}
                      className="logo-img"
                      priority
                    />
                    <div
                      style={{
                        marginTop: "36px",
                        fontSize: "20px",
                        fontWeight: 700,
                      }}
                    >
                      Step {activeStep?.number ?? activeIndex + 1}
                    </div>
                    <div style={{ marginTop: "8px", fontWeight: 600 }}>
                      {activeStep?.title}
                    </div>
                  </div>
                )}
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
                  textAlign: "center",
                  color: "#1e293b",
                  fontSize: "14px",
                  lineHeight: 1.5,
                }}
              >
                <BlocksContent content={activeStep.description} />
              </div>
            )}
          </div>

          {/* Right: Pill Step Buttons */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              width: "100%",
              maxWidth: "430px",
            }}
          >
            {steps.map((step, index) => {
              const isActive = index === activeIndex;
              const iconUrl = resolveMediaUrl(step.icon);

              return (
                <button
                  key={step.id ?? index}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "18px",
                    width: "100%",
                    minHeight: "76px",
                    padding: "8px 24px 8px 10px",
                    borderRadius: "999px",
                    border: "none",
                    background: isActive ? "#0b1f5e" : "#8c9096",
                    color: "#ffffff",
                    textAlign: "left",
                    cursor: "pointer",
                    boxShadow: isActive
                      ? "0 10px 24px rgba(11, 31, 94, 0.25)"
                      : "0 4px 10px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.2s ease",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      flex: "0 0 58px",
                      width: "58px",
                      height: "58px",
                      borderRadius: "50%",
                      background: "#ffffff",
                      border: `3px solid ${isActive ? "#0b1f5e" : "#8c9096"}`,
                      display: "grid",
                      placeItems: "center",
                      overflow: "hidden",
                    }}
                  >
                    {iconUrl ? (
                      <img
                        src={iconUrl}
                        alt=""
                        style={{
                          width: "32px",
                          height: "32px",
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <span
                        style={{
                          color: "#0b1f5e",
                          fontWeight: 700,
                          fontSize: "18px",
                        }}
                      >
                        {step.number ?? index + 1}
                      </span>
                    )}
                  </span>

                  <span
                    style={{
                      fontSize: "20px",
                      fontWeight: 500,
                      lineHeight: 1.25,
                      color: "#ffffff",
                    }}
                  >
                    {step.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes screenFadeIn {
          from {
            opacity: 0.35;
            transform: scale(1.015);
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