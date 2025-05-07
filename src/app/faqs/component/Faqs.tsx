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

      <div className="w-64 border shadow h-9 mb-5 rounded-full grid place-content-center bg-[#EEEEEE] mx-52 mt-14">
        <h4 className="text-sm font-semibold">Frequently Asked Questions</h4>
      </div>

      <h1 className="text-5xl font-medium mb-2 mx-52">
        Your questions answered
      </h1>
      <p className="text-sm font-medium mb-10 mx-52 w-[600px]">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </p>

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
                <div className="flex gap-5 items-center">
                  <div className="w-16 h-10 rounded-full shadow-lg bg-[#EEEEEE] text-black font-bold text-center text-lg flex items-center justify-center">
                    {key + 1 < 10 ? `0${key + 1}` : `${key + 1}`}
                  </div>
                  <span>{content.question}</span>
                </div>
                <i
                  className={`pi ${
                    isActive(key) ? PrimeIcons.MINUS : PrimeIcons.PLUS
                  }`}
                ></i>
              </div>
            }
            pt={{
              content: { className: "bg-inherit ms-12" },
              headerAction: {
                className: "bg-inherit gap-5 text-2xl font-semibold",
              },
            }}
          >
            <p className="m-0">{content.answer}</p>
          </AccordionTab>
        ))}
      </Accordion>
    </div>
  );
};

export default Faqs;
