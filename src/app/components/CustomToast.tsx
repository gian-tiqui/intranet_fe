import { Toast } from "primereact/toast";
import React, { RefObject } from "react";

interface Props {
  ref: RefObject<Toast>;
}

const CustomToast: React.FC<Props> = ({ ref }) => {
  return <Toast ref={ref}></Toast>;
};

export default CustomToast;
