import { Dialog } from "primereact/dialog";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import { useForm } from "react-hook-form";
import { addSubfolder } from "../utils/service/folderService";
import { Toast } from "primereact/toast";
import { RefetchOptions } from "@tanstack/react-query";
import CustomToast from "./CustomToast";
import MotionP from "./animation/MotionP";
import { Checkbox } from "primereact/checkbox";
import CreateFolderDropdown from "./CreateFolderDropdown";
import useDepartments from "../custom-hooks/departments";
import { decodeUserData } from "../functions/functions";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  refetch: (options?: RefetchOptions) => Promise<object>;
  parentId?: number;
  refetchFolders: (options?: RefetchOptions) => Promise<object>;
}

interface FormFields {
  name: string;
  isPublished: number;
  deptIds: string;
}

const AddSubfolderDialog: React.FC<Props> = ({
  visible,
  setVisible,
  refetch,
  parentId,
  refetchFolders,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<FormFields>();
  const toastRef = useRef<Toast>(null);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const departments = useDepartments();
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  const handleFormSubmit = (data: FormFields) => {
    const userId = decodeUserData()?.sub;

    if (!parentId) return;
    if (!userId) return;

    addSubfolder({
      name: data.name,
      isPublished: data.isPublished,
      parentId,
      deptIds: data.deptIds,
      userId,
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
          setIsChecked(false);
          setVisible(false);
          setSelectedDepartments([]);
          refetchFolders();
        }
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    if (!selectedDepartments) return;
    const joinedDepartmentIds = selectedDepartments.join(",");

    setValue("deptIds", joinedDepartmentIds);
  }, [selectedDepartments, setValue]);

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
            setVisible(false);
          }
        }}
        header="Create new folder"
        className="w-96"
        pt={{
          header: { className: "bg-[#EEEEEE] rounded-t-2xl" },
          content: { className: "bg-[#EEEEEE] rounded-b-2xl" },
          mask: { className: "backdrop-blur" },
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

          <div className="h-24">
            <label htmlFor="folderNameInput" className="text-sm font-semibold">
              Departments
            </label>
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
            className="justify-center w-full bg-blue-600 h-10 text-white dark:bg-white dark:text-black"
          >
            Create folder
          </Button>
        </form>
      </Dialog>
    </>
  );
};

export default AddSubfolderDialog;
