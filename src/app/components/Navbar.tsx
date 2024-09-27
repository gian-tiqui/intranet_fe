"use client";
import React, { ReactNode } from "react";
import { Icon } from "@iconify/react";
import HoverBox from "./HoverBox";
import Link from "next/link";

interface Props {
  children?: ReactNode;
}

const Navbar: React.FC<Props> = ({ children }) => {
  // this is causing the error
  // const genRandomNum = () => {
  //   return Math.floor(Math.random() * 11) + 1;
  // };

  return (
    <div className="flex h-screen">
      <nav className="flex flex-col w-96 bg-white shadow h-full">
        <div
          id="buttons"
          className="flex justify-between w-full px-3 pt-2 mb-2"
        >
          <HoverBox className="hover:bg-neutral-200 p-2 cursor-pointer rounded">
            <Icon icon="iconoir:sidebar-collapse" className="h-5 w-5" />
          </HoverBox>

          <HoverBox className="hover:bg-neutral-200 p-2 cursor-pointer rounded">
            <Icon icon="lucide:edit" className="h-5 w-5" />
          </HoverBox>
        </div>

        {/* THIS CONTAINS YOUR POSTS/MEMOS */}
        <div className="overflow-auto flex-grow mb-3">
          <div id="menu-buttons" className="px-3 mt-2 mb-6">
            <HoverBox className="hover:bg-neutral-200 p-2 cursor-pointer rounded">
              <div className="flex items-center gap-2">
                <Icon icon="ph:hospital-fill" className="h-5 w-5" />
                <p className="w-full">Intranet</p>
              </div>
            </HoverBox>
            <HoverBox className="hover:bg-neutral-200 p-2 cursor-pointer rounded">
              <div className="flex items-center gap-2">
                <Icon
                  icon="fluent:grid-circles-24-regular"
                  className="h-5 w-5"
                />
                <p className="w-full">Explore Intranet</p>
              </div>
            </HoverBox>
          </div>
          <div className="flex flex-col-reverse">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="px-3 mb-8">
                <p className="text-sm font-semibold ms-2 mb-1">Day {i + 1}</p>
                <div className="flex flex-col-reverse">
                  {Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <Link href={`/post/${index}`} key={index}>
                        <HoverBox className="hover:bg-neutral-200 py-1 px-2 cursor-pointer rounded">
                          Post {index + 1}
                        </HoverBox>
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="px-3 mb-3">
          <HoverBox className="hover:bg-neutral-200 p-2 cursor-pointer rounded">
            <p>hi</p>
          </HoverBox>
        </div>
      </nav>
      <div className="max-h-screen overflow-auto relative w-full pb-2 px-6">
        <div
          className=" sticky w-full flex justify-between pt-3 pb-3 top-0 bg-neutral-200"
          id="hi"
        >
          <p className="text-2xl font-extrabold cursor-pointer">Memo Title</p>
          <div className="flex items-center gap-3">
            <div className="cursor-pointer rounded-full border border-neutral-800 h-9 flex hover:bg-neutral-300 items-center justify-center gap-1 px-4">
              <Icon icon="ri:share-2-fill" className="h-5 w-5" />
              <p>Share</p>
            </div>
            <button className="rounded-full h-9 w-9 bg-white"></button>
          </div>
        </div>

        <div className="lg:px-64">{children}</div>
      </div>
    </div>
  );
};

export default Navbar;
