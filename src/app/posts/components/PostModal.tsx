"use client";
import { API_BASE, INTRANET } from "@/app/bindings/binding";
import useDepartments from "@/app/custom-hooks/departments";
import {
  decodeUserData,
  fetchAllLevels,
  getFolderById,
} from "@/app/functions/functions";
import apiClient from "@/app/http-common/apiUrl";
import useToggleStore from "@/app/store/navbarCollapsedStore";
import useShowPostStore from "@/app/store/showPostStore";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { pdfjs } from "react-pdf";
import { Folder, Level, Query } from "@/app/types/types";
import { useQuery } from "@tanstack/react-query";
import { createWorker } from "tesseract.js";
import DepartmentsList from "./DepartmentsList";
import { jwtDecode } from "jwt-decode";
import useSignalStore from "@/app/store/signalStore";
import { Checkbox } from "primereact/checkbox";
import { Dropdown, DropdownProps } from "primereact/dropdown";
import { getFolders } from "@/app/utils/service/folderService";
import { MultiStateCheckbox } from "primereact/multistatecheckbox";
import { TreeSelect, TreeSelectChangeEvent } from "primereact/treeselect";
import { PrimeIcons } from "primereact/api";
import { Toast } from "primereact/toast";
import useToastRefStore from "@/app/store/toastRef";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import ImagePaginator from "@/app/components/ImagePaginator";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

interface FormFields {
  userId: number;
  deptIds: string;
  message?: string;
  memo?: FileList;
  title?: string;
  public: string;
  lid: number;
  extractedText: string;
  postId?: number;
  downloadable: string;
  isPublished: number;
}

const DepartmentsListMemo = React.memo(DepartmentsList);
const MAX_DEPTH = 10;

interface Props {
  isMobile: boolean;
}

const PostModal: React.FC<Props> = ({ isMobile }) => {
  const [publish, setPublish] = useState<boolean>(false);
  const [notify, setNotify] = useState<boolean>(false);
  const [downloadable, setDownloadable] = useState<boolean>(false);
  const { setVisible } = useShowPostStore();
  const { setToastRef } = useToastRefStore();
  const { setIsCollapsed } = useToggleStore();
  const departments = useDepartments();
  const { register, handleSubmit, setValue } = useForm<FormFields>();
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [convertedFiles, setConvertedFiles] = useState<File[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [posting, setPosting] = useState<boolean>(false);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<Level | undefined>(
    undefined
  );
  const [selectedFolder, setSelectedFolder] = useState<Folder | undefined>(
    undefined
  );
  const toastRef = useRef<Toast>(null);
  const [foldersQuery] = useState<Query>({
    includeSubfolders: 0,
    search: "",
    skip: 0,
    take: 500,
    depth: MAX_DEPTH,
    isPublished: 1,
  });

  useEffect(() => {
    if (publish) setValue("isPublished", 1);
    else setValue("isPublished", 0);
  }, [publish, setValue]);

  useEffect(() => {
    setToastRef(toastRef);
  }, [toastRef, setToastRef]);

  const [postVisibility, setPostVisibility] = useState<string>("public");
  const { setSignal } = useSignalStore();
  const { data, isError, error } = useQuery({
    queryKey: ["level"],
    queryFn: fetchAllLevels,
  });
  const options: { value: string; icon: string }[] = [
    {
      value: "public",
      icon: "pi pi-globe",
    },
    { value: "private", icon: "pi pi-lock" },
  ];
  const { data: foldersData } = useQuery({
    queryKey: [`folders-${JSON.stringify(foldersQuery)}`],
    queryFn: () => getFolders(foldersQuery),
  });

  useEffect(() => {
    if (postVisibility) setValue("public", postVisibility);
  }, [postVisibility, setValue]);

  useEffect(() => {
    setValue("deptIds", selectedDepartments.join(","));
  }, [selectedDepartments, setValue]);

  useEffect(() => {
    if (selectedLevel) setValue("lid", selectedLevel?.lid);
  }, [selectedLevel, setValue]);

  const scanImage = async (imageUrl: string): Promise<string> => {
    const worker = await createWorker("eng");
    try {
      const {
        data: { text },
      } = await worker.recognize(imageUrl);
      return text.toLowerCase();
    } catch (error) {
      console.error("Error scanning image:", error);
      return "";
    } finally {
      await worker.terminate();
    }
  };

  useEffect(() => {
    if (data) setLevels(data);
  }, [data]);

  if (isError) console.error(error);

  const convertPdfToImage = async (pdfFile: File) => {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    const pageCount = pdf._pdfInfo.numPages;
    const convertedFiles = [];

    for (let pageNumber = 1; pageNumber <= pageCount; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 2.0 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Could not get canvas context");
      }

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob(
          (blob) => {
            resolve(blob!);
          },
          "image/jpeg",
          0.95
        );
      });

      convertedFiles.push(
        new File(
          [blob],
          pdfFile.name.replace(".pdf", `-page${pageNumber}.jpg`),
          {
            type: "image/jpeg",
          }
        )
      );
    }

    return convertedFiles;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const fileNames: string[] = [];
      const previews: string[] = [];
      let extractedTexts = "";
      const convertedFiles: File[] = [];

      setIsConverting(true);
      try {
        for (const file of files) {
          if (file.type === "application/pdf") {
            toastRef.current?.show({
              detail: `Converting PDF: ${file.name}`,
              severity: "info",
            });

            const convertedImages = await convertPdfToImage(file);

            const texts = await Promise.all(
              convertedImages.map(async (convertedImage) => {
                const text = await scanImage(
                  URL.createObjectURL(convertedImage)
                );
                previews.push(URL.createObjectURL(convertedImage));
                convertedFiles.push(convertedImage);
                return text;
              })
            );

            extractedTexts += texts.join(" ") + " ";
          } else if (file.type.startsWith("image/")) {
            const text = await scanImage(URL.createObjectURL(file));
            extractedTexts += text + " ";
            convertedFiles.push(file);
            previews.push(URL.createObjectURL(file));
          } else {
            toastRef.current?.show({
              content: `Unsupported file format: ${file.name}`,
              severity: "info",
            });
          }

          fileNames.push(file.name);
        }

        setFileNames(fileNames);
        setConvertedFiles(convertedFiles);
        setFilePreviews(previews);
        setValue("extractedText", extractedTexts.trim());

        toastRef.current?.show({
          summary: "Files processed successfully!",
          severity: "info",
        });
      } catch (error) {
        console.error("Error processing files:", error);

        toastRef.current?.show({
          summary: "An error occurred while processing files.",
          severity: "info",
        });
      } finally {
        setIsConverting(false);
      }
    }
  };

  const handlePost = async (data: FormFields) => {
    if (!postVisibility || postVisibility == "") {
      toastRef.current?.show({
        summary: "Select post visibility.",
        severity: "info",
      });
      return;
    }

    if (!data.lid) {
      toastRef.current?.show({
        summary: "Select an employee level.",
        severity: "info",
      });
      return;
    }

    if (selectedDepartments.length == 0) {
      toastRef.current?.show({
        summary: "Select at least one department.",
        severity: "info",
      });
      return;
    }

    if (!data.title && !data.message && convertedFiles.length == 0) {
      toastRef.current?.show({
        summary: "Upload a document or write a title or description.",
        severity: "info",
      });
      return;
    }

    if (convertedFiles.length >= 25) {
      toastRef.current?.show({
        summary: "You have exceeded the file limit.",
        severity: "info",
      });
      return;
    }
    if (isConverting) {
      toastRef.current?.show({
        summary: "Processing. Please wait.",
        severity: "info",
      });
      return;
    }

    const at = localStorage.getItem(INTRANET);

    if (at) {
      setPosting(true);
      const decode: { sub: number } = jwtDecode(at);
      data.userId = decode.sub;

      const formData = new FormData();
      formData.append("userId", String(data.userId));
      formData.append("deptIds", String(data.deptIds));
      formData.append("public", data.public);
      formData.append("lid", String(data.lid));
      formData.append("extractedText", data.extractedText);
      formData.append("downloadable", data.downloadable);
      formData.append("isPublished", data.isPublished.toString());

      if (selectedFolder)
        formData.append("folderId", String(selectedFolder.id));
      if (data.title) formData.append("title", data.title);
      if (data.message) formData.append("message", data.message);

      convertedFiles.sort((a, b) => {
        const getPage = (name: string) => {
          const match = name.match(/-page(\d+)\.jpg/);
          return match ? parseInt(match[1], 10) : 0;
        };

        return getPage(a.name) - getPage(b.name);
      });

      const extractBatchAndPage = (fileName: string) => {
        const match = fileName.match(/^(.*)-page(\d+)\.jpg$/);
        if (match) {
          return { batch: match[1], page: parseInt(match[2], 10) };
        }
        return { batch: fileName, page: 0 };
      };

      const groups: { key: string; files: File[] }[] = [];
      const batchMap = new Map<string, File[]>();

      convertedFiles.forEach((file) => {
        const { batch } = extractBatchAndPage(file.name);
        if (!batchMap.has(batch)) {
          batchMap.set(batch, []);
          groups.push({ key: batch, files: batchMap.get(batch)! });
        }
        batchMap.get(batch)!.push(file);
      });

      groups.forEach((group) => {
        group.files.sort((a, b) => {
          const { page: pageA } = extractBatchAndPage(a.name);
          const { page: pageB } = extractBatchAndPage(b.name);
          return pageA - pageB;
        });
      });

      const sortedConvertedFiles = groups.flatMap((group) => group.files);

      sortedConvertedFiles.forEach((file) => {
        formData.append("memo", file);
      });

      try {
        const response = await apiClient.post(`${API_BASE}/post`, formData);

        if (response.status === 201) {
          setVisible(false);

          if (notify) {
            const notifications = data.deptIds.split(",").map((deptId) =>
              apiClient
                .post(`${API_BASE}/notification/new-post`, null, {
                  params: {
                    deptId: deptId,
                    postId: response.data.post.pid,
                    lid: data.lid,
                  },
                })
                .catch((error) => {
                  console.error("Failed to send notification:", error);
                })
            );

            Promise.all(notifications)
              .then(async () => {
                toastRef.current?.show({
                  summary: "Notified the departments.",
                  severity: "info",
                });

                const userLid = decodeUserData()?.lid;

                if (
                  userLid &&
                  response.data.post.lid <= userLid &&
                  data.deptIds.split(",").includes(String(userLid))
                ) {
                  await apiClient.post(`${API_BASE}/post-reader`, {
                    userId: decodeUserData()?.sub,
                    postId: response.data.post.pid,
                  });
                }
              })
              .then(() => setSignal(true))
              .catch(() => {
                console.error("Some notifications failed.");
              })
              .finally(() => {
                setPosting(false);
                setSignal(false);
              });
          } else {
            setSignal(true);
          }
        }
      } catch (error) {
        console.error(error);
        toastRef.current?.show({
          summary: "Error creating post.",
          severity: "info",
        });
      } finally {
        setPosting(false);
      }
    }
  };

  useEffect(() => {
    setValue("downloadable", downloadable ? "1" : "0");
  }, [setValue, downloadable]);

  const handleFormClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  }, [setIsCollapsed, isMobile]);

  const selectedOptionTemplate = (
    option: { level: string } | null,
    props: DropdownProps
  ) => {
    if (option) {
      return (
        <div className="flex align-items-center">
          <div>{option.level}</div>
        </div>
      );
    }

    return <span>{props.placeholder || "Select a level"}</span>;
  };

  const buildTree = (folders: Folder[]): object[] => {
    return folders.map((folder) => ({
      key: folder.id.toString(),
      label: folder.name,
      icon: PrimeIcons.FOLDER,
      value: folder.id.toString(),
      children: folder.subfolders ? buildTree(folder.subfolders) : undefined,
    }));
  };

  const levelOptionTemplate = (option: { level: string }) => {
    return (
      <div className="flex align-items-center">
        <div>{option.level}</div>
      </div>
    );
  };

  return (
    <form
      onSubmit={handleSubmit(handlePost)}
      onClick={handleFormClick}
      className="h-screen w-screen bg-[#CBD5E1] z-50 absolute"
    >
      <div className="flex">
        <div className="w-[70%] flex justify-center h-[100vh]  overflow-y-auto relative">
          {filePreviews.length > 0 && (
            <div className="fixed bottom-5 bg-[#EEEEEE] rounded-lg shadow h-12 px-2 items-center w-40 z-50 right-[438px] flex justify-between">
              <Button
                type="button"
                className="h-7 w-7 bg-blue-600 justify-center text-white"
                onClick={() => {
                  if (currentPage > 0) setCurrentPage((prev) => prev - 1);
                }}
                icon={`${PrimeIcons.ARROW_LEFT}`}
              ></Button>
              <p className="text-sm font-medium">Page {currentPage + 1}</p>
              <Button
                type="button"
                className="h-7 w-7 bg-blue-600 justify-center text-white"
                onClick={() => {
                  if (currentPage < filePreviews.length - 1)
                    setCurrentPage((prev) => prev + 1);
                }}
                icon={`${PrimeIcons.ARROW_RIGHT}`}
              ></Button>
            </div>
          )}
          <div className="w-[70%] bg-[#CBD5E1] pt-14">
            <div className="flex items-start gap-3 mb-2 mx-4">
              <Avatar
                className="bg-blue-600 h-12 w-12 font-bold text-white"
                shape="circle"
                label={
                  String(decodeUserData()?.firstName[0]).toUpperCase() +
                  String(decodeUserData()?.lastName[0]).toUpperCase()
                }
              />
              <div>
                <div className="flex justify-between">
                  <p className="font-bold">
                    {decodeUserData()?.firstName} {decodeUserData()?.lastName}
                  </p>
                </div>

                <div className="bg-inherit text-sm items-center flex gap-1">
                  <MultiStateCheckbox
                    value={postVisibility}
                    options={options}
                    onChange={(e) => setPostVisibility(e.value)}
                    optionValue="value"
                  />
                  <span>{postVisibility || "nothing selected"}</span>
                </div>
              </div>
            </div>

            <div className="relative mx-4">
              <div>
                <input
                  className="w-full outline-none p-2 bg-inherit placeholder-neutral-600"
                  placeholder="Write the title here"
                  {...register("title")}
                />
                <p className="mb-3 text-sm font-medium ms-2">
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <hr className="w-full border-b border border-gray-400" />
                <textarea
                  className="w-full outline-none p-2 bg-inherit placeholder-neutral-600 resize-none overflow-hidden"
                  placeholder="Is there something you want to write for the memo?"
                  {...register("message")}
                  onInput={(e) => {
                    e.currentTarget.style.height = "auto";
                    e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                  }}
                />

                <div className="w-full p-4 mb-4 dark:bg-neutral-900 rounded-md">
                  <div className="relative w-full border border-dashed border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 rounded-md p-4 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-all duration-200">
                    <input
                      type="file"
                      multiple={true}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      {...register("memo")}
                      onChange={handleFileChange}
                    />
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      {isConverting ? (
                        <div className="flex flex-col items-center">
                          <Icon
                            icon="eos-icons:loading"
                            className="h-10 w-10 animate-spin"
                          />
                          <span className="mt-2 text-sm">
                            Converting PDF...
                          </span>
                        </div>
                      ) : fileNames.length > 0 ? (
                        <ImagePaginator
                          filePreviews={filePreviews}
                          currentPage={currentPage}
                        />
                      ) : (
                        <div className="flex flex-col items-center">
                          <Icon
                            icon={"material-symbols:upload"}
                            className="h-10 w-10"
                          />
                          <span className="mt-2 text-sm">
                            Click to upload memo (PDF or Image)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[30%] h-[100vh] shadow-lg bg-[#EEEEEE] pt-4">
          <div className="w-full flex items-center justify-between px-5 mb-10">
            <p className="text-lg font-medium">Post Settings</p>
            <Button
              className="h-6 w-6"
              icon={`${PrimeIcons.TIMES}`}
              onClick={() => setVisible(false)}
            ></Button>
          </div>

          <div className="rounded-2xl mt-2 relative pb-2">
            <div className="flex items-center flex-col px-5">
              <Dropdown
                className={`w-full mb-6 h-12 border border-black items-center bg-inherit`}
                filter
                placeholder="Select a employee level"
                value={selectedLevel}
                onChange={(e) => {
                  const lid = e.target.value.lid;

                  if (lid === 1) {
                    setSelectedDepartments([
                      ...departments.map((dept) => String(dept.deptId)),
                    ]);
                  } else {
                    setSelectedDepartments([]);
                  }

                  setSelectedLevel(e.target.value);
                }}
                options={levels}
                pt={{
                  root: {
                    className: "dark:bg-neutral-950 dark:border-neutral-700",
                  },

                  panel: {
                    className: "bg-[#EEEEEE]",
                  },
                  header: { className: "bg-[#EEEEEE]" },
                  filterInput: {
                    className: "bg-white border border-black h-10 px-3 text-sm",
                  },
                }}
                valueTemplate={selectedOptionTemplate}
                itemTemplate={levelOptionTemplate}
                optionLabel="level"
              />
              <DepartmentsListMemo
                setSelectedDepartments={setSelectedDepartments}
                departments={departments}
                selectedDepartments={selectedDepartments}
              />
              <TreeSelect
                filter
                pt={{
                  root: {
                    className:
                      "dark:bg-neutral-950 dark:border-neutral-700 dark:text-neutral-100",
                  },
                  tree: {
                    root: { className: "bg-[#eeeeee]" },
                    content: {
                      className: "bg-[#EEEEEE]",
                    },
                  },
                  wrapper: { className: "bg-[#EEEEEE]" },
                  header: {
                    className: "dark:bg-neutral-950 dark:text-neutral-100",
                  },
                  filter: {
                    className:
                      "dark:bg-neutral-700 dark:border-neutral-700 dark:text-neutral-100 dark:placeholder-neutral-400",
                  },
                }}
                className="w-full mb-6 h-12 border border-black items-center bg-inherit"
                options={buildTree(foldersData?.data.folders || [])}
                onChange={async (e: TreeSelectChangeEvent) => {
                  if (!e.value) return;
                  const selected = await getFolderById(+e.value);
                  if (selected) setSelectedFolder(selected);
                }}
                value={selectedFolder?.id.toString()}
                placeholder="Select a folder"
              />

              <div
                className={`h-12 border flex items-center gap-2 px-3 w-full ${
                  notify && "bg-blue-500 text-white"
                } border-black mb-6 rounded-lg`}
                onClick={() => setNotify((prev) => !prev)}
              >
                <Checkbox
                  id="notifyCheckbox"
                  className=""
                  value={notify}
                  checked={notify}
                />
                <label
                  htmlFor="notifyCheckbox"
                  className="hover:cursor-pointer text-sm"
                >
                  Notify recipients?
                </label>
              </div>
              <div
                className={`h-12 border flex items-center gap-2 px-3 w-full ${
                  downloadable && "bg-blue-500 text-white"
                } border-black mb-6 rounded-lg`}
                onClick={() => setDownloadable((prev) => !prev)}
              >
                <Checkbox
                  id="downloadable"
                  className=""
                  value={downloadable}
                  checked={downloadable}
                />
                <label
                  htmlFor="downloadable"
                  className="hover:cursor-pointer text-sm"
                >
                  Downloadable
                </label>
              </div>
              <div
                className={`h-12 border flex items-center gap-2 px-3 w-full ${
                  publish && "bg-blue-500 text-white"
                } border-black mb-6 rounded-lg`}
                onClick={() => setPublish((prev) => !prev)}
              >
                <Checkbox
                  id="publish"
                  className=""
                  value={publish}
                  checked={publish}
                />
                <label
                  htmlFor="publish"
                  className="hover:cursor-pointer text-sm"
                >
                  Publish
                </label>
              </div>
              <Button
                type="submit"
                icon={`${PrimeIcons.SAVE}`}
                className={`${
                  posting && "opacity-80"
                }  bg-blue-600 text-white font-medium w-full gap-2 h-12 justify-center`}
                disabled={isConverting || posting}
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PostModal;
