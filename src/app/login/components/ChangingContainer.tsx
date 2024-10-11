"use client";
import MotionTemplate from "@/app/components/animation/MotionTemplate";
import React, { ReactNode, useEffect, useState } from "react";

const First = () => {
  return (
    <MotionTemplate>
      <div className="text-black bg-neutral-200 h-96 w-96 rounded border grid place-content-center">
        hi 1
      </div>
    </MotionTemplate>
  );
};

const Second = () => {
  return (
    <MotionTemplate>
      <div className="bg-neutral-300 h-96 w-96 rounded border grid place-content-center text-black">
        hi 2
      </div>
    </MotionTemplate>
  );
};

const Third = () => {
  return (
    <MotionTemplate>
      <div className="bg-neutral-400 h-96 w-96 rounded border grid place-content-center text-black">
        hi 3
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

    const timer = setTimeout(changeComp, 3000);

    return () => clearTimeout(timer);
  }, [index]);

  return <div className=" h-96 w-96">{selectedComp}</div>;
};

export default ChangingContainer;
