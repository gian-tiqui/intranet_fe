import React, { useEffect, useState } from "react";
import { decodeUserData } from "../functions/functions";
import { Button } from "primereact/button";
import { TutorialContent } from "../types/types";
import { Department } from "../utils/enums/enum";

const userPages: TutorialContent[] = [
  {
    title: "test",
    instruction:
      "akdmdaksm kmdakmsdkmdsakmldsa dsakmsdkmklmasdlkmasd dsakmlkmlasdkmlasdkmlads asdkmkmasldkmlasdkmlasdkmlasd",
    image: "",
  },
  {
    title: "test2",
    instruction:
      "2akdmdaksm kmdakmsdkmdsakmldsa dsakmsdkmklmasdlkmasd dsakmlkmlasdkmlasdkmlads asdkmkmasldkmlasdkmlasdkmlasd",
    image: "",
  },
  {
    title: "test3",
    instruction:
      "3akdmdaksm kmdakmsdkmdsakmldsa dsakmsdkmklmasdlkmasd dsakmlkmlasdkmlasdkmlads asdkmkmasldkmlasdkmlasdkmlasd",
    image: "",
  },
];

const hRQmPages: TutorialContent[] = [
  {
    title: "testhr",
    instruction:
      "akdmdaksm kmdakmsdkmdsakmldsa dsakmsdkmklmasdlkmasd dsakmlkmlasdkmlasdkmlads asdkmkmasldkmlasdkmlasdkmlasd",
    image: "",
  },
  {
    title: "test2hr",
    instruction:
      "2akdmdaksm kmdakmsdkmdsakmldsa dsakmsdkmklmasdlkmasd dsakmlkmlasdkmlasdkmlads asdkmkmasldkmlasdkmlasdkmlasd",
    image: "",
  },
  {
    title: "test3hr",
    instruction:
      "3akdmdaksm kmdakmsdkmdsakmldsa dsakmsdkmklmasdlkmasd dsakmlkmlasdkmlasdkmlads asdkmkmasldkmlasdkmlasdkmlasd",
    image: "",
  },
];

const Tutorial = () => {
  const [isFirstLogin, setIsFirstLogin] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [pagesBasedOnDepartment, setPagesBasedOnDepartment] = useState<
    TutorialContent[]
  >([]);

  useEffect(() => {
    const decoded = decodeUserData();

    if (
      [
        Department.CUSTOMER_EXPERIENCE,
        Department.HUMAN_RESOURCE,
        Department.QUALITY_MANAGEMENT,
      ].includes(decoded?.deptId ?? 0)
    ) {
      setPagesBasedOnDepartment(hRQmPages);
    }

    if (decoded) {
      setIsFirstLogin(decoded.isFirstLogin);
    }
  }, []);

  if (!isFirstLogin) return null;

  const header = <header>{pagesBasedOnDepartment[pageNumber].title}</header>;

  const imageSection = <section>hi</section>;

  const instruction = (
    <div>{pagesBasedOnDepartment[pageNumber].instruction}</div>
  );

  const footer = (
    <footer>
      <Button
        onClick={() => {
          if (pageNumber > 0) setPageNumber((prev) => prev - 1);
        }}
      >
        prev
      </Button>
      <Button
        onClick={() => {
          if (pageNumber < userPages.length - 1)
            setPageNumber((prev) => prev + 1);
        }}
      >
        next
      </Button>
      {pageNumber === userPages.length - 1 && <Button>Finish</Button>}
    </footer>
  );

  return (
    <div className="absolute z-50 h-screen w-full bg-[#EEE]/5 backdrop-blur grid place-content-center">
      <div className="h-[85vh] w-[900px] bg-[#eee] rounded-3xl shadow flex flex-col justify-between p-6">
        {header}
        {imageSection}
        {instruction}
        {footer}
      </div>
    </div>
  );
};

export default Tutorial;
