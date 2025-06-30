import { RefetchOptions, useQuery } from "@tanstack/react-query";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { updateFolder } from "../utils/service/folderService";
import CustomToast from "./CustomToast";
import { decodeUserData, getFolderById } from "../functions/functions";
import MotionP from "./animation/MotionP";
import CreateFolderDropdown from "./CreateFolderDropdown";
import useDepartments from "../custom-hooks/departments";
import { Checkbox } from "primereact/checkbox";
import { FolderDepartment } from "../types/types";

interface Props {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  refetch?: (options?: RefetchOptions) => Promise<object>;
  folderId: number | undefined;
  setFolderId: (folderId: number) => void;
}

interface FormFields {
  name: string;
  isPublished: number;
  deptIds: string;
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
  const departments = useDepartments();
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const { data } = useQuery({
    queryKey: [`folder-${folderId}`],
    queryFn: () => getFolderById(folderId, decodeUserData()?.deptId),
    enabled: !!folderId,
  });

  const extractDeptIds = (folderDepartments: FolderDepartment[]) => {
    const extractedDeptIds = [
      ...folderDepartments.map((data) => data.deptId.toString()),
    ];

    setSelectedDepartments(extractedDeptIds);
  };

  useEffect(() => {
    if (data) {
      setValue("name", data.name);
      setValue("isPublished", data.isPublished ? 1 : 0);
      setIsChecked(data.isPublished);
      extractDeptIds(data.folderDepartments);
    }
  }, [data, setValue]);

  const handleFormSubmit = (data: FormFields) => {
    updateFolder({
      name: data.name,
      folderId,
      deptIds: data.deptIds,
      isPublished: data.isPublished,
    })
      .then((response) => {
        if (response.status === 200) {
          toastRef.current?.show({
            severity: "info",
            summary: "Success",
            detail: "Folder updated successfully.",
          });

          if (refetch) refetch();
          reset();

          setVisible(false);
        }
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    if (isChecked) setValue("isPublished", 1);
    else setValue("isPublished", 0);
  }, [isChecked, setValue]);

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
          mask: { className: "backdrop-blur" },
        }}
      >
        <form className="pt-5" onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="h-14 mb-12">
            <label htmlFor="folderNameInput" className="text-sm font-semibold">
              Update Folder
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

          <div className="h-20">
            <CreateFolderDropdown
              departments={departments}
              selectedDepartments={selectedDepartments}
              setSelectedDepartments={setSelectedDepartments}
            />
          </div>

          <div
            className="flex items-center gap-2 mb-6 hover:underline cursor-pointer w-[25%]"
            onClick={() => setIsChecked((prev) => !prev)}
          >
            <Checkbox checked={isChecked} />
            <p className="text-sm text-blue-600 font-medium">Publish</p>
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
