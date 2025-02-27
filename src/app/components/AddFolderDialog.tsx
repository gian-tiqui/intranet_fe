import { Dialog } from "primereact/dialog";
import React, { Dispatch, SetStateAction, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import { useForm } from "react-hook-form";
import { addMainFolder } from "../utils/service/folderService";
import { Toast } from "primereact/toast";
import { RefetchOptions } from "@tanstack/react-query";
import CustomToast from "./CustomToast";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  refetch: (options?: RefetchOptions) => Promise<object>;
}

interface FormFields {
  name: string;
}

const AddFolderDialog: React.FC<Props> = ({ visible, setVisible, refetch }) => {
  const { register, handleSubmit, reset } = useForm<FormFields>();
  const toastRef = useRef<Toast>(null);

  const handleFormSubmit = (data: FormFields) => {
    addMainFolder(data.name)
      .then((response) => {
        if (response.status === 201) {
          toastRef.current?.show({
            severity: "info",
            summary: "Success",
            detail: "Folder created successfully.",
          });
          refetch();
          reset();
          setVisible(false);
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <>
      <CustomToast ref={toastRef} />
      <Dialog
        visible={visible}
        onHide={() => {
          if (visible) {
            reset();
            setVisible(false);
          }
        }}
        header="Create new folder"
        className="w-96"
        pt={{
          header: { className: "dark:bg-neutral-950 dark:text-white" },
          content: { className: "dark:bg-neutral-950" },
        }}
      >
        <form className="pt-5" onSubmit={handleSubmit(handleFormSubmit)}>
          <InputText
            {...register("name", { required: true })}
            className="w-full h-10 px-2 bg-neutral-200 mb-5 dark:bg-neutral-700 dark:text-white"
            placeholder="Enter folder name"
          />
          <Button
            icon={`${PrimeIcons.PLUS} me-2`}
            className="justify-center w-full bg-neutral-900 h-10 text-white dark:bg-white dark:text-black"
          >
            Create folder
          </Button>
        </form>
      </Dialog>
    </>
  );
};

export default AddFolderDialog;
