import type { Metadata } from "next";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { PrimeReactProvider } from "primereact/api";
import localFont from "next/font/local";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
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
  title: "Employee Portal | WMC",
  description: "WMC | Employee Portal",
  icons: ["westlake_logo_horizontal.jpg.png"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PrimeReactProvider value={{ unstyled: false, pt: {}, ripple: true }}>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} overflow-hidden antialiased bg-[#CBD5E1] overflow-x-hidden`}
        >
          <ToastContainer />
          <WelcomeSidebar />
          <Divider>{children}</Divider>
        </body>
      </html>
    </PrimeReactProvider>
  );
}
