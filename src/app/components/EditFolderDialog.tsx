import { RefetchOptions, useQuery } from "@tanstack/react-query";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { updateFolder } from "../utils/service/folderService";
import CustomToast from "./CustomToast";
import { getFolderById } from "../functions/functions";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  refetch: (options?: RefetchOptions) => Promise<object>;
  folderId: number;
  setFolderId: Dispatch<SetStateAction<number>>;
}

interface FormFields {
  name: string;
}

const EditFolderDialog: React.FC<Props> = ({
  visible,
  setVisible,
  refetch,
  folderId,
  setFolderId,
}) => {
  const { register, handleSubmit, reset, setValue } = useForm<FormFields>();
  const toastRef = useRef<Toast>(null);

  const { data } = useQuery({
    queryKey: [`folder-${folderId}`],
    queryFn: () => getFolderById(folderId),
    enabled: !!folderId,
  });

  useEffect(() => {
    if (data) setValue("name", data.name);
  }, [data, setValue]);

  const handleFormSubmit = (data: FormFields) => {
    updateFolder({ name: data.name, folderId })
      .then((response) => {
        if (response.status === 200) {
          toastRef.current?.show({
            severity: "info",
            summary: "Success",
            detail: "Folder updated successfully.",
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
            setFolderId(-1);
            setVisible(false);
          }
        }}
        header="Edit folder"
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

export default EditFolderDialog;
