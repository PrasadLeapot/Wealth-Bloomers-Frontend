"use client";

import { useMemo, useState } from "react";
import BlocksContent from "./BlocksContent";

const CATEGORIES = [
  { label: "General", value: "general" },
  { label: "Leaderboard", value: "leaderboard" },
  { label: "Predictions", value: "predictions" },
];

export default function FAQAccordion({ faqs = [] }) {
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [activeKey, setActiveKey] = useState(null);

  const filteredFaqs = useMemo(() => {
    if (selectedCategory === "all") return faqs;
    return faqs.filter(
      (faq) => (faq.category || "").toLowerCase() === selectedCategory
    );
  }, [faqs, selectedCategory]);

  const handleCategoryChange = (categoryValue) => {
    setSelectedCategory(categoryValue);
    setActiveKey(null);
  };

  return (
    <div className="faq-wrapper">
      <div className="faq-tabs" role="tablist" aria-label="FAQ Categories">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            type="button"
            role="tab"
            aria-selected={selectedCategory === cat.value}
            className={`faq-tab ${
              selectedCategory === cat.value ? "faq-tab--active" : ""
            }`}
            onClick={() => handleCategoryChange(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="faq-list">
        {filteredFaqs.length === 0 ? (
          <p className="faq-empty">No questions in this category yet.</p>
        ) : (
          filteredFaqs.map((faq, index) => {
            const itemKey = faq.id ?? `${faq.category || "item"}-${index}`;
            const isOpen = activeKey === itemKey;

            return (
              <article className="faq-item" key={itemKey}>
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => setActiveKey(isOpen ? null : itemKey)}
                  aria-expanded={isOpen}
                >
                  <span className="faq-question-text">{faq.question}</span>
                  <span className="faq-icon" aria-hidden="true">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div className="faq-answer">
                    <BlocksContent content={faq.answer} />
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
