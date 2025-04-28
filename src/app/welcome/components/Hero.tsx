import Image from "next/image";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import wmcFacade from "../../assets/Hospital Facade Edited 2 2.png";
import mgLogo from "../../assets/mountgracelogo.png";
import msMarieAnaAlvarez from "../../assets/ms_marie.png";
import phone from "../../assets/phone_diagonal.png";
import React from "react";

const Hero = () => {
  return (
    <>
      <Image
        src={mgLogo}
        alt="Mount Grace Logo"
        className="absolute bottom-0 right-48 h-16 w-16"
      />
      <div className="w-full grid grid-cols-5 gap-6 px-6 md:h-[75%] mb-6 relative">
        {/**
         * First Column
         */}

        <div className="rounded-3xl col-span-3 relative bg-black">
          <Image src={wmcFacade} alt="WMC Facade" layout="fill" />
          <div className="absolute top-0 left-0 text-blue-600 font-semibold text-3xl">
            <div className="bg-slate-200 pe-4 rounded-br-3xl pb-4">
              <p>Westlake Medical Center</p>
            </div>
            <div className="bg-slate-200 w-60 rounded-br-3xl pb-4">
              <p>Employee Portal</p>
            </div>
          </div>
          <div className="absolute bottom-0 w-full flex items-center justify-between p-7">
            <Button
              icon={`${PrimeIcons.ARROW_UP_RIGHT}`}
              iconPos="right"
              className="bg-blue-600/60 backdrop-blur text-white justify-center px-10 h-12 rounded-full shadow"
            >
              Westlake Medical Center
            </Button>
            <Button
              icon={`${PrimeIcons.ARROW_UP_RIGHT}`}
              iconPos="right"
              className="bg-blue-600/60 backdrop-blur text-white justify-center px-10 h-12 rounded-full shadow"
            >
              Get Started
            </Button>
          </div>
        </div>
        {/**
         * Second Column
         */}
        <div className="col-span-2 gap-6 grid">
          <div className="rounded-3xl bg-amber-100 relative flex flex-col justify-between p-6">
            <Image
              src={msMarieAnaAlvarez}
              alt="Ms. Marie Ana Alvarez"
              className="h-48 w-48 absolute bottom-0 right-10"
            />
            <div className="h-10 text-white flex items-center rounded-full justify-center w-48 bg-blue-600 font-medium text-lg">
              HR Department
            </div>
            <p className="text-blue-600 text-lg font-medium">
              Know more about us
            </p>
          </div>
          <div className="rounded-3xl bg-blue-600 p-6 relative flex flex-col justify-between">
            <Image
              src={phone}
              alt="Ms. Marie Ana Alvarez"
              className="h-48 w-48 absolute bottom-0 right-10 "
            />
            <div className="h-10 text-blue-600 flex items-center rounded-full justify-center w-48 bg-amber-100 font-medium text-lg">
              Posting
            </div>
            <div className="text-center text-white w-44">
              <p className="">Know more about us</p>
              <p className="text-lg font-medium">2.1k</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
