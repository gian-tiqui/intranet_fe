import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import WelcomeSidebar from "./welcome/components/WelcomeSidebar";
import Divider from "./components/Divider";

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
  icons: ["westlake_logo_horizontal.jpg.png"],
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
        <WelcomeSidebar />
        <Divider>{children}</Divider>
      </body>
    </html>
  );
}
