import React from "react";

interface Props {
  message: string;
}

const Notification: React.FC<Props> = ({ message }) => {
  return (
    <div className="border w-full p-2 bg-white dark:border-black rounded-lg text-sm dark:bg-neutral-900">
      {message}
    </div>
  );
};

export default Notification;
