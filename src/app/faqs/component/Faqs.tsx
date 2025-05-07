"use client";
import { useRouter } from "next/navigation";
import { Accordion, AccordionTab } from "primereact/accordion";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import React from "react";

const Faqs = () => {
  const router = useRouter();
  const accordionContent: { question: string; answer: string }[] = [
    {
      answer: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.`,
      question: "What",
    },
    {
      answer: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.`,
      question: "Do",
    },
    {
      answer: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.`,
      question: "I",
    },
    {
      answer: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.`,
      question: "Put",
    },
    {
      answer: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.`,
      question: "Here",
    },
    {
      answer: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.`,
      question: "?",
    },
  ];

  return (
    <div className="h-screen w-screen overflow-auto flex items-center py-14 flex-col">
      <Button
        onClick={() => router.back()}
        className="mb-6 text-white bg-blue-500 w-32 font-medium justify-center py-5 gap-2"
        icon={`${PrimeIcons.HOME}`}
      >
        Home
      </Button>

      <h1 className="text-4xl text-center font-bold mb-12">
        <span className="text-blue-600">F</span>requently{" "}
        <span className="text-blue-600">A</span>sked{" "}
        <span className="text-blue-600">Q</span>uestion
        <span className="text-blue-600">s</span>
      </h1>
      <Accordion className="w-[35%]">
        {accordionContent.map((content, key) => (
          <AccordionTab
            key={key}
            header={content.question}
            pt={{
              content: { className: "bg-[#EEEEEE]" },
              headerAction: { className: "bg-[#EEEEEE] text-blue-600" },
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
