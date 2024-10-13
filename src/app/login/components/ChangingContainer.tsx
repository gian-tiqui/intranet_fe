"use client";
import MotionTemplate from "@/app/components/animation/MotionTemplate";
import React, { ReactNode, useEffect, useState } from "react";
import EaseString from "./EaseString";

const First = () => {
  return (
    <MotionTemplate>
      <div className="text-black h-96 w-96 rounded border grid place-content-center">
        <EaseString word="hehe" size="" />
      </div>
    </MotionTemplate>
  );
};

const Second = () => {
  return (
    <MotionTemplate>
      <div className="h-96 w-96 rounded border grid place-content-center text-black">
        <EaseString word="hehe" size="" />
      </div>
    </MotionTemplate>
  );
};

const Third = () => {
  return (
    <MotionTemplate>
      <div className="h-96 w-96 rounded border grid place-content-center text-black">
        <EaseString word="hehe" size="" />
      </div>
    </MotionTemplate>
  );
};

const ChangingContainer = () => {
  const [index, setIndex] = useState<number>(0);
  const [selectedComp, setSelectedComp] = useState<ReactNode>(<First />);

  useEffect(() => {
    const changeComp = () => {
      const comps: ReactNode[] = [
        <First key={0} />,
        <Second key={1} />,
        <Third key={2} />,
      ];

      const newIndex = (index + 1) % comps.length;
      setIndex(newIndex);
      setSelectedComp(comps[newIndex]);
    };

    const timer = setTimeout(changeComp, 5000);

    return () => clearTimeout(timer);
  }, [index]);

  return <div className="w-full h-full">{selectedComp}</div>;
};

export default ChangingContainer;
