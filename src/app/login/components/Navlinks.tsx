"use client";
import { NavLinksType } from "@/app/types/types";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const Navlinks = () => {
  const links: NavLinksType[] = [
    {
      name: "Westlake Medical Center",
      link: "https://dribbble.com/shots/23311322-Ocamba-website-UI-UX",
    },
    {
      name: "Mt. Grace Hospitals",
      link: "https://dribbble.com/shots/23311322-Ocamba-website-UI-UX",
    },
  ];
  return (
    <div className="hidden md:flex items-center w-full justify-center gap-3">
      {links.map((link, index) => (
        <motion.div
          key={index}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 50,
            damping: 20,
            delay: index * 0.1,
          }}
          className="flex items-center gap-3"
        >
          <Link href={link.link} className="hover:underline">
            {link.name}
          </Link>
          {index != links.length - 1 && (
            <motion.div className="h-1 w-1 rounded-full bg-black dark:bg-white"></motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default Navlinks;
