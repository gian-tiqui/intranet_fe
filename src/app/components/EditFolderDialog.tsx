import { RefetchOptions, useQuery } from "@tanstack/react-query";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
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
import { updateFolder } from "../utils/service/folderService";
import CustomToast from "./CustomToast";
import { getFolderById } from "../functions/functions";
import { ColorPicker, ColorPickerChangeEvent } from "primereact/colorpicker";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  refetch: (options?: RefetchOptions) => Promise<object>;
  folderId: number;
  setFolderId: Dispatch<SetStateAction<number>>;
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
  const { register, handleSubmit, reset, setValue } = useForm<FormFields>();
  const toastRef = useRef<Toast>(null);
  const [textColor, setTextColor] = useState<string>("");
  const [folderColor, setFolderCOlor] = useState<string>("");

  const [addColors, setAddColors] = useState<boolean>(false);

  useEffect(() => {
    if (!addColors) {
      setTextColor("");
      setFolderCOlor("");
    }
  }, [addColors]);

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
            type="button"
            icon={`${PrimeIcons.COG}`}
            onClick={() => setAddColors((prev) => !prev)}
            className="text-sm gap-2 bg-neutral-900 dark:bg-white text-white h-10 w-full justify-center mb-4 dark:text-black"
          >
            {addColors ? "Cancel Modifying Color" : "Modify Folder Color"}
          </Button>

          {addColors && (
            <div className="flex gap-5 mb-5 justify-center">
              <div className="flex flex-col w-full items-center font-medium gap-1">
                <span>
                  <span className="font-bold">Aa</span> Text Color
                </span>

                <ColorPicker
                  value={textColor}
                  onChange={(e: ColorPickerChangeEvent) =>
                    setTextColor(String(e.value))
                  }
                />
                <span>{textColor}</span>
              </div>
              <div className="flex flex-col w-full items-center font-medium gap-1">
                <span>
                  <i className={`${PrimeIcons.FOLDER} me-2 text-xl`}></i>Folder
                  Color
                </span>

                <ColorPicker
                  value={folderColor}
                  onChange={(e: ColorPickerChangeEvent) =>
                    setFolderCOlor(String(e.value))
                  }
                />
                <span>{folderColor}</span>
              </div>
            </div>
          )}
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
