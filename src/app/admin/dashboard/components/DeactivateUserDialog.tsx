import { decodeUserData } from "@/app/functions/functions";
import { toastClass } from "@/app/tailwind-classes/tw_classes";
import { deactivateUser } from "@/app/utils/service/userService";
import { RefetchOptions } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  employeeId: string;
  refetch: (options?: RefetchOptions) => Promise<object>;
}

interface FormFields {
  deactivatorId: number;
  employeeId: string;
  password: string;
}

const DeactivateUserDialog: React.FC<Props> = ({
  visible,
  setVisible,
  employeeId,
  refetch,
}) => {
  const { reset, register, setValue, handleSubmit } = useForm<FormFields>();

  useEffect(() => {
    const setValues = async () => {
      const userData = await decodeUserData();

      if (!userData?.sub) return;

      setValue("deactivatorId", userData.sub);
      setValue("employeeId", employeeId);
    };

    setValues();
  }, [setValue, employeeId]);

  const handleDeactivate = (data: FormFields) => {
    deactivateUser(data)
      .then((response) => {
        if (response.status === 201) {
          toast("User deactivated", { className: toastClass, type: "success" });
          refetch();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Dialog
      visible={visible}
      className="w-96"
      pt={{
        header: { className: "bg-white dark:bg-neutral-950" },
        content: { className: "bg-neutral-100 dark:bg-neutral-900" },
      }}
      header="Deactivate account"
      onHide={() => {
        if (visible) {
          setVisible(false);
          reset();
        }
      }}
    >
      <form className="pt-4" onSubmit={handleSubmit(handleDeactivate)}>
        <p className="dark:text-white mb-2">Enter your password to confirm</p>
        <InputText
          type="password"
          className="w-full mb-4 h-10 px-4 bg-neutral-200 dark:bg-neutral-800"
          placeholder="Enter your password"
          {...register("password", { required: true })}
        />
        <Button
          type="submit"
          className="w-full text-white h-10 justify-center gap-2 font-bold bg-neutral-900 dark:text-black dark:bg-neutral-100"
        >
          Deactivate account
        </Button>
      </form>
    </Dialog>
  );
};

export default DeactivateUserDialog;
