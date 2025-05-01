import { Dialog } from "primereact/dialog";
import React, { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import { useForm } from "react-hook-form";
import { addMainFolder } from "../utils/service/folderService";
import { Toast } from "primereact/toast";
import { RefetchOptions } from "@tanstack/react-query";
import CustomToast from "./CustomToast";
import MotionP from "./animation/MotionP";

interface Props {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  refetch: (options?: RefetchOptions) => Promise<object>;
}

interface FormFields {
  name: string;
  textColor: string;
  folderColor: string;
}

const AddFolderDialog: React.FC<Props> = ({ visible, setVisible, refetch }) => {
  const [textColor, setTextColor] = useState<string>("");
  const [folderColor, setFolderCOlor] = useState<string>("");
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormFields>();
  const toastRef = useRef<Toast>(null);

  const handleFormSubmit = (data: FormFields) => {
    addMainFolder({
      name: data.name,
      textColor: data.textColor,
      folderColor: data.folderColor,
    })
      .then((response) => {
        if (response.status === 201) {
          toastRef.current?.show({
            severity: "info",
            summary: "Success",
            detail: "Folder created successfully.",
          });
          refetch();
          reset();
          setTextColor("");
          setFolderCOlor("");
          setVisible(false);
        }
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    setValue("textColor", `#${textColor}`);
  }, [textColor, setValue]);
  useEffect(() => {
    setValue("folderColor", `#${folderColor}`);
  }, [folderColor, setValue]);

  return (
    <>
      <CustomToast ref={toastRef} />
      <Dialog
        visible={visible}
        onHide={() => {
          if (visible) {
            reset();
            setFolderCOlor("");
            setTextColor("");
            setVisible(false);
          }
        }}
        header="Create new folder"
        className="w-96"
        pt={{
          header: { className: "bg-[#EEEEEE]" },
          content: { className: "bg-[#EEEEEE]" },
        }}
      >
        <form className="pt-5" onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="h-14 mb-12">
            <label htmlFor="folderNameInput" className="text-sm font-semibold">
              Folder name
            </label>
            <InputText
              id="folderNameInput"
              {...register("name", { required: true })}
              placeholder="Administrative..."
              type="text"
              className="h-12 w-full px-5 text-sm bg-white border border-black mb-1"
            />
            {errors.name && (
              <MotionP className="text-red-500 font-semibold text-xs">
                Folder name is required
              </MotionP>
            )}
          </div>

          <Button
            icon={`${PrimeIcons.PLUS} me-2`}
            className="justify-center w-full bg-blue-600 h-10 text-white"
          >
            Create folder
          </Button>
        </form>
      </Dialog>
    </>
  );
};

export default AddFolderDialog;
