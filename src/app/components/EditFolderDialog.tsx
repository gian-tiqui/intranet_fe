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
import MotionP from "./animation/MotionP";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  refetch: (options?: RefetchOptions) => Promise<object>;
  folderId: number | undefined;
  setFolderId: Dispatch<SetStateAction<number | undefined>>;
}

interface FormFields {
  name: string;
  textColor: string;
  folderColor: string;
}

const EditFolderDialog: React.FC<Props> = ({
  visible,
  setVisible,
  refetch,
  folderId,
  setFolderId,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormFields>();
  const toastRef = useRef<Toast>(null);

  const { data } = useQuery({
    queryKey: [`folder-${folderId}`],
    queryFn: () => getFolderById(folderId),
    enabled: !!folderId,
  });

  useEffect(() => {
    if (data) {
      setValue("name", data.name);
      if (data.folderColor) setValue("folderColor", data.folderColor);
      if (data.textColor) setValue("textColor", data.textColor);
    }
  }, [data, setValue]);

  const handleFormSubmit = (data: FormFields) => {
    updateFolder({
      name: data.name,
      folderId,
      textColor: data.textColor,
      folderColor: data.folderColor,
    })
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
        header="Change Folder Name"
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
            Update Folder
          </Button>
        </form>
      </Dialog>
    </>
  );
};

export default EditFolderDialog;
