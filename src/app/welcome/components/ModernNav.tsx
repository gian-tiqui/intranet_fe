import React from "react";
import { motion } from "motion/react";
import { Image } from "primereact/image";
import { useRouter } from "next/navigation";
import wmcLogo from "../../assets/westlake_logo_horizontal.jpg.png";
import { ArrowRight } from "lucide-react";

interface RouteTypes {
  name: string;
  path: string;
}

const ModernNav = () => {
  const router = useRouter();

  const routes: RouteTypes[] = [
    { name: "Home", path: "/welcome" },
    { name: "FAQS", path: "/faqs" },
  ];

  return (
    <motion.nav
      className="relative z-40 px-6 py-4"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.div
          className="flex items-center space-x-4"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-12 h-12 flex items-center justify-center shadow-lg">
            <Image
              src={wmcLogo.src}
              alt="westlakelogo"
              className="h-full w-full"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Westlake Medical Center
            </h1>
            <p className="text-sm text-gray-600">Employee Portal</p>
          </div>
        </motion.div>

        <div className="hidden md:flex items-center space-x-8">
          {routes.map((item, index) => (
            <motion.a
              key={item.name}
              onClick={() => router.push(item.path)}
              className="text-gray-700 hover:text-blue-600 font-medium cursor-pointer"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              {item.name}
            </motion.a>
          ))}

          <motion.button
            onClick={() => router.push("/login")}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span>Login</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};

export default ModernNav;
