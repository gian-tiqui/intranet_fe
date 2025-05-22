"use client";
import WelcomeNavbar from "@/app/welcome/components/WelcomeNavbar";
import { Accordion, AccordionTab } from "primereact/accordion";
import { PrimeIcons } from "primereact/api";
import React, { useState } from "react";

const Faqs = () => {
  const [activeIndex, setActiveIndex] = useState<number | number[]>([]);

  const accordionContent: { question: string; answer: string }[] = [
    { question: "What", answer: "Lorem ipsum..." },
    { question: "Do", answer: "Lorem ipsum..." },
    { question: "I", answer: "Lorem ipsum..." },
    { question: "Put", answer: "Lorem ipsum..." },
    { question: "Here", answer: "Lorem ipsum..." },
    { question: "?", answer: "Lorem ipsum..." },
  ];

  const isActive = (index: number) => {
    if (Array.isArray(activeIndex)) return activeIndex.includes(index);
    return activeIndex === index;
  };

  return (
    <div className="h-screen w-screen overflow-auto">
      <WelcomeNavbar disableAnimation />

      <div className="w-48 border shadow h-8 mb-5 rounded-full grid place-content-center bg-[#EEEEEE] mx-52 mt-14">
        <h4 className="text-xs font-medium text-blue-600">
          Frequently Asked Questions
        </h4>
      </div>

      <h1 className="text-2xl font-bold mb-2 mx-52 text-blue-600">
        Your questions answered
      </h1>
      <p className="text-xs font-medium mb-10 mx-52 w-[600px] text-blue-950"></p>

      <Accordion
        className="w-full px-36"
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
      >
        {accordionContent.map((content, key) => (
          <AccordionTab
            key={key}
            header={
              <div className="flex items-center justify-between w-full">
                <div className="flex gap-3 items-center">
                  <div className="w-11 h-7 rounded-full shadow-lg bg-[#EEEEEE] text-blue-600 font-bold text-center text-sm flex items-center justify-center">
                    {key + 1 < 10 ? `0${key + 1}` : `${key + 1}`}
                  </div>
                  <span className="text-lg">{content.question}</span>
                </div>
                <i
                  className={`pi ${
                    isActive(key) ? PrimeIcons.MINUS : PrimeIcons.PLUS
                  }`}
                ></i>
              </div>
            }
            pt={{
              content: { className: "bg-inherit ms-12 text-blue-950" },
              headerAction: {
                className:
                  "bg-inherit gap-5 text-sm font-semibold text-blue-600",
              },
            }}
          >
            <p className="m-0 text-sm">{content.answer}</p>
          </AccordionTab>
        ))}
      </Accordion>
    </div>
  );
};

export default Faqs;
