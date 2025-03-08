import useSignalStore from "@/app/store/signalStore";
import { AddDepartmentFormField, Division, Query } from "@/app/types/types";
import {
  fetchDepartmentById,
  updateDepartmentById,
} from "@/app/utils/service/departmentService";
import { getDivisions } from "@/app/utils/service/divisionService";
import { useQuery } from "@tanstack/react-query";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  deptId: number | undefined;
}

const EditDepartmentDialog: React.FC<Props> = ({
  visible,
  setVisible,
  deptId,
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm<AddDepartmentFormField>();
  const toastRef = useRef<Toast>(null);
  const [query] = useState<Query>({ search: "", skip: 0, take: 20 });
  const [selectedDivision, setSelectedDivision] = useState<
    Division | undefined
  >(undefined);
  const { setSignal } = useSignalStore();

  const { data: departmentData } = useQuery({
    queryKey: [`department-${deptId}`],
    queryFn: () => fetchDepartmentById(deptId),
    enabled: !!deptId && deptId != undefined,
  });

  const { data } = useQuery({
    queryKey: [`divisions-${JSON.stringify(query)}`],
    queryFn: () => getDivisions(query),
  });

  useEffect(() => {
    const setDeptData = () => {
      if (departmentData?.data) {
        console.log(departmentData.data);
        setValue("departmentName", departmentData.data.departmentName);
        setValue("departmentCode", departmentData.data.departmentCode);
        setValue("divisionId", departmentData.data.divisionId);
        const deptDivision = data?.data.divisions.find(
          (division: Division) => division.id === departmentData.data.divisionId
        );

        setSelectedDivision(deptDivision);
      }
    };

    setDeptData();
  }, [departmentData, setValue, data]);

  const onFormSubmit = (data: AddDepartmentFormField) => {
    updateDepartmentById(deptId, data)
      .then((response) => {
        if (response.status === 200) {
          setSignal(true);
          toastRef.current?.show({
            summary: "Department added successfully",
            severity: "info",
          });
          setVisible(false);
          reset();
        }
      })
      .catch((error) => {
        console.error(error);
        setSignal(true);
        toastRef.current?.show({
          summary: "There was a problem in adding the department",
          severity: "error",
        });
      });
  };

  return (
    <>
      <Toast ref={toastRef} />
      <Dialog
        className="w-96"
        pt={{
          header: {
            className: "bg-neutral-50 dark:bg-neutral-950 dark:text-white",
          },
          content: { className: "bg-neutral-200 dark:bg-neutral-950" },
        }}
        visible={visible}
        onHide={() => {
          if (visible) setVisible(false);
        }}
        header="Edit Department Data"
      >
        <form
          className="flex flex-col gap-2 pt-2"
          onSubmit={handleSubmit(onFormSubmit)}
        >
          <div className="h-20">
            <label htmlFor="inputDeptName" className="text-sm dark:text-white">
              Department name
            </label>
            <InputText
              id="inputDeptName"
              {...register("departmentName", { required: true })}
              placeholder="Human Resource"
              className="bg-neutral-100 px-3 dark:bg-neutral-800 h-9 w-full mb-1 dark:text-white"
            />
            {errors.departmentName && (
              <span className="text-xs text-red-500 flex gap-1 items-center">
                <i
                  className={`${PrimeIcons.EXCLAMATION_TRIANGLE} text-red-500 text-sm`}
                ></i>
                Department name required
              </span>
            )}
          </div>

          <div className="h-24">
            <label htmlFor="inputDeptName" className="text-sm dark:text-white">
              Department code
            </label>
            <InputText
              id="inputDeptName"
              {...register("departmentCode", { required: true })}
              placeholder="HR"
              className="bg-neutral-100 px-3 dark:bg-neutral-800 h-9 w-full mb-1 dark:text-white"
            />
            {errors.departmentCode && (
              <span className="text-xs text-red-500 flex gap-1 items-center">
                <i
                  className={`${PrimeIcons.EXCLAMATION_TRIANGLE} text-red-500 text-sm`}
                ></i>
                Department code required
              </span>
            )}
          </div>

          <div className="h-24 flex flex-col">
            <label htmlFor="inputDivisions" className="text-sm dark:text-white">
              Division
            </label>
            <Dropdown
              options={data?.data.divisions}
              id="inputDivisions"
              optionLabel="divisionName"
              value={selectedDivision}
              className="h-10 text-sm"
              pt={{
                root: {
                  className: "dark:bg-neutral-800 dark:border-neutral-700",
                },

                panel: {
                  className: "dark:bg-neutral-800 dark:border-neutral-700",
                },
                header: { className: "dark:bg-neutral-950" },
                filterInput: {
                  className: "dark:bg-neutral-800 dark:text-white",
                },
              }}
              placeholder="Select a division"
              onChange={(e) => {
                setSelectedDivision(e.value);
                setValue("divisionId", e.value.id);
              }}
            />
            {errors.divisionId && (
              <span className="text-xs text-red-500 flex gap-1 items-center">
                <i
                  className={`${PrimeIcons.EXCLAMATION_TRIANGLE} text-red-500 text-sm`}
                ></i>
                Division required
              </span>
            )}
          </div>

          <Button
            type="submit"
            icon={`${PrimeIcons.SAVE}`}
            className="w-full text-white dark:text-black justify-center gap-2 bg-neutral-900 dark:bg-neutral-100 h-9"
          >
            Update department
          </Button>
        </form>
      </Dialog>
    </>
  );
};

export default EditDepartmentDialog;
