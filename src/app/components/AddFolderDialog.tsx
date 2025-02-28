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
import { addMainFolder } from "../utils/service/folderService";
import { Toast } from "primereact/toast";
import { RefetchOptions } from "@tanstack/react-query";
import CustomToast from "./CustomToast";
import { ColorPicker, ColorPickerChangeEvent } from "primereact/colorpicker";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  refetch: (options?: RefetchOptions) => Promise<object>;
}

interface FormFields {
  name: string;
  textColor: string;
  folderColor: string;
}

const AddFolderDialog: React.FC<Props> = ({ visible, setVisible, refetch }) => {
  const [textColor, setTextColor] = useState<string>("");
  const [folderColor, setFolderCOlor] = useState<string>("");
  const { register, handleSubmit, reset, setValue } = useForm<FormFields>();
  const toastRef = useRef<Toast>(null);
  const [addColors, setAddColors] = useState<boolean>(false);

  useEffect(() => {
    if (!addColors) {
      setTextColor("");
      setFolderCOlor("");
    }
  }, [addColors]);

  const handleFormSubmit = (data: FormFields) => {
    addMainFolder({
      name: data.name,
      textColor: data.textColor,
      folderColor: data.folderColor,
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
          setTextColor("");
          setFolderCOlor("");
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
            setFolderCOlor("");
            setTextColor("");
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
            icon={`${PrimeIcons.COG}`}
            type="button"
            onClick={() => setAddColors((prev) => !prev)}
            className="text-sm gap-2 bg-neutral-900 dark:bg-white text-white h-10 w-full justify-center mb-4 dark:text-black"
          >
            {addColors ? "Cancel Modifying Color" : "Modify Folder Color"}
          </Button>
          {addColors && (
            <div className="flex gap-5 mb-5 justify-center">
              <div className="flex flex-col items-center font-medium gap-1">
                <span>
                  <span className="font-bold">Aa</span> Text Color
                </span>

                <ColorPicker
                  value={textColor}
                  onChange={(e: ColorPickerChangeEvent) =>
                    setTextColor(String(e.value))
                  }
                  className="mb-2"
                />
                <label htmlFor="textColorId">Hex code</label>

                <InputText
                  id="textColorId"
                  value={textColor}
                  className="w-32 text-center bg-neutral-200 h-10"
                  placeholder="B00000"
                  onChange={(e) => setTextColor(e.target.value)}
                />
              </div>
              <div className="flex flex-col items-center font-medium gap-1">
                <span>
                  <i className={`${PrimeIcons.FOLDER} me-2 text-xl`}></i>Folder
                  Color
                </span>

                <ColorPicker
                  value={folderColor}
                  onChange={(e: ColorPickerChangeEvent) =>
                    setFolderCOlor(String(e.value))
                  }
                  className="mb-2"
                />
                <label htmlFor="folderColorId">Hex code</label>
                <InputText
                  id="folderColorId"
                  value={folderColor}
                  className="w-32 text-center bg-neutral-200 h-10"
                  placeholder="FFFFFF"
                  onChange={(e) => setFolderCOlor(e.target.value)}
                />
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

export default AddFolderDialog;
