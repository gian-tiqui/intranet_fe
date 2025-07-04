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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data, isLoading: isQueryLoading } = useQuery({
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

  useEffect(() => {
    if (!selectedDepartments.length) return;
    const joinedDepartmentIds = selectedDepartments.join(",");
    setValue("deptIds", joinedDepartmentIds);
  }, [selectedDepartments, setValue]);

  const handleFormSubmit = async (formData: FormFields) => {
    setIsLoading(true);

    try {
      const response = await updateFolder({
        name: formData.name,
        folderId,
        deptIds: formData.deptIds,
        isPublished: formData.isPublished,
      });

      if (response.status === 200) {
        toastRef.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Folder updated successfully.",
        });

        if (refetch) refetch();
        reset();
        setVisible(false);
      }
    } catch (error) {
      console.error(error);
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to update folder. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogHide = () => {
    if (visible && !isLoading) {
      reset();
      setSelectedDepartments([]);
      setIsChecked(false);
      setFolderId(-1);
      setVisible(false);
    }
  };

  useEffect(() => {
    setValue("isPublished", isChecked ? 1 : 0);
  }, [isChecked, setValue]);

  return (
    <>
      <CustomToast ref={toastRef} />
      <Dialog
        visible={visible}
        onHide={handleDialogHide}
        header={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <i className={`${PrimeIcons.PENCIL} text-white text-lg`}></i>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Edit Folder
              </h2>
              <p className="text-sm text-gray-500">
                Update folder details and permissions
              </p>
            </div>
          </div>
        }
        className="w-[28rem] max-w-[90vw]"
        pt={{
          root: {
            className: "shadow-2xl",
          },
          header: {
            className:
              "bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 rounded-t-2xl px-6 py-4",
          },
          content: {
            className: "bg-white rounded-b-2xl px-6 py-6",
          },
          mask: {
            className: "backdrop-blur-sm bg-black/20",
          },
          closeButton: {
            className:
              "w-8 h-8 rounded-full hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center",
          },
        }}
        closable={!isLoading}
      >
        {isQueryLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
              <p className="text-sm text-gray-500">Loading folder details...</p>
            </div>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
            {/* Folder Name Input */}
            <div className="space-y-2">
              <label
                htmlFor="folderNameInput"
                className="block text-sm font-semibold text-gray-700"
              >
                Folder Name
              </label>
              <div className="relative">
                <InputText
                  id="folderNameInput"
                  {...register("name", {
                    required: "Folder name is required",
                    minLength: {
                      value: 2,
                      message: "Folder name must be at least 2 characters",
                    },
                    maxLength: {
                      value: 50,
                      message: "Folder name cannot exceed 50 characters",
                    },
                  })}
                  placeholder="e.g., Administrative Documents"
                  type="text"
                  className="w-full h-12 px-4 text-sm bg-white border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 placeholder:text-gray-400"
                  disabled={isLoading}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <i
                    className={`${PrimeIcons.FOLDER} text-gray-400 text-sm`}
                  ></i>
                </div>
              </div>
              {errors.name && (
                <MotionP className="text-red-500 font-medium text-xs flex items-center gap-1">
                  <i
                    className={`${PrimeIcons.EXCLAMATION_TRIANGLE} text-xs`}
                  ></i>
                  {errors.name.message}
                </MotionP>
              )}
            </div>

            {/* Department Dropdown */}
            <div className="space-y-2">
              <CreateFolderDropdown
                departments={departments}
                selectedDepartments={selectedDepartments}
                setSelectedDepartments={setSelectedDepartments}
              />
            </div>

            {/* Publish Checkbox */}
            <div className="space-y-2">
              <div
                className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 cursor-pointer transition-colors duration-200 group"
                onClick={() => !isLoading && setIsChecked((prev) => !prev)}
              >
                <Checkbox
                  checked={isChecked}
                  disabled={isLoading}
                  pt={{
                    root: {
                      className: "w-5 h-5",
                    },
                    box: {
                      className:
                        "w-5 h-5 border-2 border-blue-300 rounded-md group-hover:border-blue-400 transition-colors duration-200",
                    },
                    icon: {
                      className: "w-3 h-3 text-blue-600",
                    },
                  }}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-800">
                    Make folder public
                  </p>
                  <p className="text-xs text-blue-600">
                    Allow all users to access this folder
                  </p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <i
                    className={`${PrimeIcons.GLOBE} text-blue-500 text-sm`}
                  ></i>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                onClick={handleDialogHide}
                disabled={isLoading}
                className="flex-1 h-12 bg-gray-100 justify-center text-gray-700 border border-gray-300 hover:bg-gray-200 transition-colors duration-200 rounded-xl font-medium"
                text
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 h-12 justify-center bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                loading={isLoading}
                loadingIcon={`${PrimeIcons.SPINNER} pi-spin`}
              >
                {isLoading ? (
                  "Updating..."
                ) : (
                  <>
                    <i className={`${PrimeIcons.CHECK} mr-2`}></i>
                    Update Folder
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </Dialog>
    </>
  );
};

export default EditFolderDialog;
