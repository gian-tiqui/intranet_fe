"use client";
import Image from "next/image";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import wmcFacade from "../../assets/Hospital Facade Edited 2 2.png";
import mgLogo from "../../assets/mountgracelogo.png";
import msMarieAnaAlvarez from "../../assets/ms_marie.png";
import msArleneFernandez from "../../assets/maam-len-removebg-preview.png";
import phone from "../../assets/phone_diagonal.png";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { TabContent } from "@/app/types/types";

const Hero = () => {
  const [tabContent, setTabContent] = useState<TabContent>({
    title: "HR Department",
    message: "Know more about us",
    image: msMarieAnaAlvarez,
  });

  useEffect(() => {
    const hrContent: TabContent = {
      title: "HR Department",
      message: "Know more about us",
      image: msMarieAnaAlvarez,
    };
    const qrContent: TabContent = {
      title: "QM Department",
      message: "Know more about us",
      image: msArleneFernandez,
    };

    const interval = setInterval(() => {
      setTabContent((prev) =>
        prev.title === hrContent.title ? qrContent : hrContent
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 70 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 1.5 }}
        className="absolute bottom-0 right-48"
      >
        <Image src={mgLogo} alt="Mount Grace Logo" className="h-16 w-16" />
      </motion.div>

      <div className="w-full grid grid-cols-5 gap-6 px-6 md:h-[75%] mb-6 relative">
        <div className="rounded-3xl col-span-3 relative bg-black">
          <Image src={wmcFacade} alt="WMC Facade" fill />
          <div className="absolute top-0 left-0 text-blue-600 font-semibold text-5xl">
            <div className="bg-[#CBD5E1] pe-8 rounded-br-3xl pb-6">
              <motion.p
                initial={{ opacity: 0, x: -70 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 1.5 }}
              >
                Employee
              </motion.p>
            </div>
            <div className="bg-[#CBD5E1] w-40 rounded-br-3xl pb-6">
              <motion.p
                initial={{ opacity: 0, x: -70 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 1.5 }}
              >
                Portal
              </motion.p>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="absolute bottom-0 w-full flex items-center justify-between p-7"
          >
            <Button
              icon={`${PrimeIcons.ARROW_UP_RIGHT}`}
              iconPos="right"
              className="bg-blue-600/60 backdrop-blur text-white justify-center px-10 gap-2 h-12 rounded-full shadow"
            >
              Westlake Medical Center
            </Button>
            <Button
              icon={`${PrimeIcons.ARROW_UP_RIGHT}`}
              iconPos="right"
              className="bg-blue-600/60 backdrop-blur text-white justify-center px-10 h-12 rounded-full gap-2 shadow"
            >
              Get Started
            </Button>
          </motion.div>
        </div>
        {/**
         * Second Column
         */}
        <div className="col-span-2 gap-6 grid">
          <AnimatePresence>
            <div className="rounded-3xl bg-gray-50 relative flex flex-col justify-between p-6">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 1 }}
                className="absolute bottom-0 right-10"
              >
                <Image
                  src={tabContent.image}
                  alt="Ms. Marie Ana Alvarez"
                  className="h-48 w-48 "
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 1 }}
                className="h-10 text-white flex items-center rounded-full justify-center w-48 bg-blue-600 font-medium text-lg"
              >
                {tabContent.title}
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="text-blue-600 text-lg font-medium"
              >
                {tabContent.message}
              </motion.p>
            </div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 1 }}
            className="rounded-3xl bg-gradient-to-tl from-blue-800 via-blue-600 to-blue-400 p-6 relative flex flex-col justify-between"
          >
            <Image
              src={phone}
              alt="Ms. Marie Ana Alvarez"
              className="h-48 w-48 absolute bottom-0 right-10 "
            />
            <div className="h-10 text-blue-600 flex items-center rounded-full justify-center w-48 bg-[#EEEEEE] font-medium text-lg">
              Posting
            </div>
            <div className="text-center text-white w-44">
              <p className="">Know more about us</p>
              <p className="text-lg font-medium">2.1k</p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Hero;
