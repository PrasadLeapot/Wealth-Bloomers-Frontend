"use client";

import { useState } from "react";
import BlocksContent from "@/components/BlocksContent";
import { getStrapiMedia } from "@/lib/strapi";
import Image from "next/image";

export default function HowItWorksSection({ home }) {
  const steps = home?.steps || [];
  // Always start on Step 1 (index 0)
  const [activeIndex, setActiveIndex] = useState(0);

  const activeStep = steps[activeIndex] || steps[0];
  const activeScreenUrl = getStrapiMedia(
    activeStep?.screenImage?.url || activeStep?.screenImage
  );

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
            gap: "40px",
            maxWidth: "1120px",
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
              maxWidth: "300px",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "200px",
                height: "400px",
                background: "#14161a",
                borderRadius: "36px",
                padding: "10px",
                boxShadow:
                  "0 18px 40px rgba(15, 23, 42, 0.18), inset 0 0 0 2px #3b4048",
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: "2px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "84px",
                  height: "18px",
                  background: "#14161a",
                  borderBottomLeftRadius: "12px",
                  borderBottomRightRadius: "12px",
                  zIndex: 2,
                }}
              />
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "#ffffff",
                  borderRadius: "26px",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {activeScreenUrl ? (
                  <img
                    src={activeScreenUrl}
                    alt={activeStep?.title || `Step ${activeIndex + 1} screen`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      padding: "10px",
                      textAlign: "center",
                      color: "#0b1f5e",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        marginBottom: "80px",
                      }}
                    >
                      Welcome to Wealth Boomers App
                    </p>
                    <Image
                              src="/logo.png"
                              alt="Wealth Bloomers Logo"
                              width={200}
                              height={80}
                              className="logo-img"
                              priority
                            />
                    <div style={{ fontSize: "20px", fontWeight: 700 }}>
                      Step &nbsp;
                      {activeStep?.number ?? activeIndex + 1}
                    </div>
                    <div style={{ marginTop: "8px", fontWeight: 600 }}>
                      {activeStep?.title}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {activeStep?.description && (
              <div
                className="step-active-description"
                style={{
                  marginTop: "16px",
                  textAlign: "center",
                  color: "#4b5563",
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
              const iconUrl = getStrapiMedia(step.icon?.url || step.icon);

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
    </section>
  );
}