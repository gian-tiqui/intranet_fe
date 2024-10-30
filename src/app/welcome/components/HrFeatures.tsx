import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

const HrFeatures = () => {
  return (
    <div className="bg-gradient-to-b from-neutral-50 via-neutral-100 to-neutral-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 p-10 flex justify-center">
      <div className="md:w-[50%]">
        <p className="font-bold text-lg">Features that are only limited to</p>
        <p className="font-bold text-lg mb-12">
          the HR and Quality Management Departments
        </p>

        <div className="flex lg:justify-between flex-wrap lg:flex-nowrap gap-2">
          <div className="w-full pe-9 bg-white dark:bg-neutral-900 p-4 rounded-lg shadow">
            <div className="grid place-content-center h-10 bg-neutral-300 dark:bg-neutral-800 rounded-lg w-10 mb-6">
              <Icon icon={"mdi:announcement-outline"} className="h-7 w-7" />
            </div>
            <p className="font-semibold text-lg mb-3">Post announcements</p>

            <p className="text-sm">
              HR and Quality Management employees will be able to announce
              through the portal
            </p>
          </div>

          <div className="w-full pe-9 bg-white dark:bg-neutral-900 p-4 rounded-lg shadow">
            <div className="grid place-content-center h-10 bg-neutral-300 dark:bg-neutral-800 rounded-lg w-10 mb-6">
              <Icon icon={"pajamas:monitor-lines"} className="h-7 w-7" />
            </div>
            <p className="font-semibold text-lg mb-3">Monitor employee reads</p>

            <p className="text-sm">
              HR and Quality Management will be able to see the users who
              haven&apos;t read the posts on where they are tagged.
            </p>
          </div>

          <div className="w-full pe-9 bg-white dark:bg-neutral-900 p-4 rounded-lg shadow">
            <div className="grid place-content-center h-10 bg-neutral-300 dark:bg-neutral-800 rounded-lg w-10 mb-6">
              <Icon
                icon={"material-symbols:comment-outline"}
                className="h-7 w-7"
              />
            </div>
            <p className="font-semibold text-lg mb-3">Reply to the feedbacks</p>

            <p className="text-sm">
              HR and Quality Management employees will be able to reply to the
              feedbacks of the users.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HrFeatures;
