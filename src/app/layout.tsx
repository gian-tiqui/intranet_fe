import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/Divider";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import PageLoader from "./posts/components/PageLoader";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Intranet | WMC",
  description: "WMC | Intranet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-200 dark:bg-neutral-800`}
      >
        <ToastContainer />
        <PageLoader />
        <Navbar>{children}</Navbar>
      </body>
    </html>
  );
}
