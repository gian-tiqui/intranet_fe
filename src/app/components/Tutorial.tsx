import { motion } from "motion/react";
import { Button } from "primereact/button";
import React, { useState } from "react";

const Tutorial = () => {
  const [startButton, setStartButton] = useState<boolean>(true);
  return (
    <motion.div className="w-full h-screen absolute z-50 bg-[#EEE]/10 backdrop-blur">
      {startButton && (
        <Button onClick={() => setStartButton(false)}>Start</Button>
      )}
    </motion.div>
  );
};

export default Tutorial;
