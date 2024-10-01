import axios from "axios";
import { useEffect, useState } from "react";

const useFetchIP = () => {
  const [ip, setIp] = useState(null);
  useEffect(() => {
    const getIp = async () => {
      const ipData = await axios.get("https://api64.ipify.org?format=json");

      setIp(ipData.data);
    };

    getIp();
  }, []);
  return ip;
};

export default useFetchIP;
