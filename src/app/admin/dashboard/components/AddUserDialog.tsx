import useSignalStore from "@/app/store/signalStore";
import { Department, Division, Level, Query, User } from "@/app/types/types";
import { fetchDepartments } from "@/app/utils/service/departmentService";
import { getDivisions } from "@/app/utils/service/divisionService";
import fetchLevels from "@/app/utils/service/levels";
import { addUser } from "@/app/utils/service/userService";
import { useQuery } from "@tanstack/react-query";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

const AddUserDialog: React.FC<Props> = ({ visible, setVisible }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm<User>();
  const toastRef = useRef<Toast>(null);
  const [query] = useState<Query>({ search: "", skip: 0, take: 20 });
  const [selectedDepartment, setSelectedDepartment] = useState<
    Department | undefined
  >(undefined);
  const [selectedLevel, setSelectedLevel] = useState<Level | undefined>(
    undefined
  );
  const [selectedDivision, setSelectedDivision] = useState<
    Division | undefined
  >(undefined);
  const { setSignal } = useSignalStore();

  const { data } = useQuery({
    queryKey: [`divisions-${JSON.stringify(query)}`],
    queryFn: () => getDivisions(query),
  });

  const { data: departmentsData } = useQuery({
    queryKey: [`department-${JSON.stringify(query)}`],
    queryFn: () => fetchDepartments(query),
  });

  const { data: levelsData } = useQuery({
    queryKey: [`level-${JSON.stringify(query)}`],
    queryFn: () => fetchLevels(),
    select: (data) => {
      return data.map((level: Level) => {
        if (level.level === "All Employees") {
          return { ...level, level: "Staff" };
        }
        return level;
      });
    },
  });

  const onFormSubmit = (data: User) => {
    data.password = "abcd_123";

    addUser(data)
      .then((response) => {
        if (response.status === 201) {
          setSignal(true);
          toastRef.current?.show({
            summary: "User added successfully",
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
          summary: "There was a problem in adding the user",
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
            className: "bg-white dark:bg-neutral-950 dark:text-white",
          },
          content: { className: "bg-neutral-200 dark:bg-neutral-950" },
          mask: { className: "backdrop-blur" },
        }}
        visible={visible}
        onHide={() => {
          if (visible) {
            setVisible(false);
            reset();
          }
        }}
        header="Add User"
      >
        <form
          className="flex flex-col gap-2 pt-5"
          onSubmit={handleSubmit(onFormSubmit)}
        >
          <div className="h-20">
            <label htmlFor="firstNameInput" className="text-sm dark:text-white">
              First name
            </label>
            <InputText
              id="firstNameInput"
              {...register("firstName", { required: true })}
              placeholder="Juan"
              className="bg-white px-3 dark:bg-neutral-800 h-9 w-full mb-1 dark:text-white"
            />
            {errors.firstName && (
              <span className="text-xs text-red-500 flex gap-1 items-center">
                <i
                  className={`${PrimeIcons.EXCLAMATION_TRIANGLE} text-red-500 text-sm`}
                ></i>
                First name required
              </span>
            )}
          </div>

          <div className="h-24">
            <label
              htmlFor="inputMiddleName"
              className="text-sm dark:text-white"
            >
              Middle name
            </label>
            <InputText
              id="inputMiddleName"
              {...register("middleName", { required: false })}
              placeholder="Reyes"
              className="bg-white px-3 dark:bg-neutral-800 h-9 w-full mb-1 dark:text-white"
            />
            {errors.middleName && (
              <span className="text-xs text-red-500 flex gap-1 items-center">
                <i
                  className={`${PrimeIcons.EXCLAMATION_TRIANGLE} text-red-500 text-sm`}
                ></i>
                Middle name required
              </span>
            )}
          </div>

          <div className="h-24">
            <label htmlFor="inputLastName" className="text-sm dark:text-white">
              Last name
            </label>
            <InputText
              id="inputLastName"
              {...register("lastName", { required: true })}
              placeholder="Dela Cruz"
              className="bg-white px-3 dark:bg-neutral-800 h-9 w-full mb-1 dark:text-white"
            />
            {errors.lastName && (
              <span className="text-xs text-red-500 flex gap-1 items-center">
                <i
                  className={`${PrimeIcons.EXCLAMATION_TRIANGLE} text-red-500 text-sm`}
                ></i>
                Last name required
              </span>
            )}
          </div>

          <div className="h-20">
            <label
              htmlFor="employeeIdInput"
              className="text-sm dark:text-white"
            >
              Employee ID
            </label>
            <InputText
              id="employeeIdInput"
              {...register("employeeId", { required: true })}
              placeholder="00002616"
              className="bg-white px-3 dark:bg-neutral-800 h-9 w-full mb-1 dark:text-white"
            />
            {errors.employeeId && (
              <span className="text-xs text-red-500 flex gap-1 items-center">
                <i
                  className={`${PrimeIcons.EXCLAMATION_TRIANGLE} text-red-500 text-sm`}
                ></i>
                Employee ID is required
              </span>
            )}
          </div>

          <div className="h-24 flex flex-col">
            <label htmlFor="inputLevel" className="text-sm dark:text-white">
              Employee Level
            </label>
            <Dropdown
              options={levelsData}
              id="inputLevel"
              optionLabel="level"
              value={selectedLevel}
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
              placeholder="Select level"
              onChange={(e) => {
                setSelectedLevel(e.value);
                console.log(e.value);
                setValue("lid", e.value.lid);
              }}
            />
            {errors.divisionId && (
              <span className="text-xs text-red-500 flex gap-1 items-center">
                <i
                  className={`${PrimeIcons.EXCLAMATION_TRIANGLE} text-red-500 text-sm`}
                ></i>
                Employee level required
              </span>
            )}
          </div>

          <div className="h-24 flex flex-col">
            <label htmlFor="inputDeptId" className="text-sm dark:text-white">
              Department
            </label>
            <Dropdown
              options={departmentsData?.data.departments}
              id="inputDeptId"
              optionLabel="departmentName"
              value={selectedDepartment}
              className="h-10 text-sm"
              filter
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
              placeholder="Select a department"
              onChange={(e) => {
                setSelectedDepartment(e.value);
                console.log(e.value);
                setValue("deptId", e.value.deptId);
              }}
            />
            {errors.divisionId && (
              <span className="text-xs text-red-500 flex gap-1 items-center">
                <i
                  className={`${PrimeIcons.EXCLAMATION_TRIANGLE} text-red-500 text-sm`}
                ></i>
                Department required
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
                console.log(e.value);
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

          <div className="h-24 flex flex-col">
            <label htmlFor="dobInput" className="text-sm dark:text-white">
              Date of birth
            </label>
            <Calendar
              id="dobInput"
              {...register("dob", { required: true })}
              className="h-10"
              pt={{ panel: { className: "px-2" } }}
              placeholder="Enter date of birth"
            />

            {errors.dob && (
              <span className="text-xs text-red-500 flex gap-1 items-center">
                <i
                  className={`${PrimeIcons.EXCLAMATION_TRIANGLE} text-red-500 text-sm`}
                ></i>
                Date of birth required
              </span>
            )}
          </div>

          <Button
            type="submit"
            icon={`${PrimeIcons.PLUS}`}
            className="w-full justify-center gap-2 bg-neutral-900 dark:bg-white h-9"
          >
            Create user
          </Button>
        </form>
      </Dialog>
    </>
  );
};

export default AddUserDialog;
