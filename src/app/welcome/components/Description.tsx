import React from "react";

const Description = () => {
  return (
    <div className="bg-gradient-to-t from-neutral-50 via-neutral-200 to-neutral-300 dark:from-neutral-950 dark:via-neutral-800 dark:to-neutral-700 p-10 flex justify-center">
      <div className="w-[50%]">
        <p className="mb-6 font-semibold">
          The intranet platform is an all-in-one communication and self-service
          hub designed to streamline employee access to essential information
          and resources. Featuring a self-service kiosk, it empowers employees
          to manage their profiles, access company resources, and utilize key
          services independently.
        </p>
        <p className="font-semibold">
          With a robust posting system, the platform allows for the sharing of
          memos, circulars, and announcements, visible to employees by
          department or shared publicly for broader reach. Posts can be tailored
          based on employee levels, ensuring that users view content relevant to
          their role or lower levels, maintaining information hierarchy and
          relevance. This intranet fosters efficient communication, enhances
          departmental engagement, and supports a well-organized flow of
          information across all levels of the organization.
        </p>
      </div>
    </div>
  );
};

export default Description;
