import { motion } from "framer-motion";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { useForm, Controller } from "react-hook-form";
import searchTermStore from "../store/search";
import useShowSearchStore from "../store/showSearch";
import { Department, PostType } from "../types/types";
import { MultiSelect } from "primereact/multiselect";

interface FormFields {
  searchTerm: string;
  deptId?: number;
  postTypeId?: number;
  folderDeptId?: number;
  searchTypes?: string[]; // ['post', 'folder', 'user']
}

interface SearchV2Props {
  departments: Department[];
  postTypes: PostType[];
}

const SearchV2: React.FC<SearchV2Props> = ({ departments, postTypes }) => {
  const { handleSubmit, control, register, reset, watch } =
    useForm<FormFields>();
  const { setSearchParams } = searchTermStore();
  const { setShowSearch } = useShowSearchStore();

  const handleSearch = (data: FormFields) => {
    if (!data.searchTerm) return;

    setSearchParams({
      searchTerm: data.searchTerm,
      deptId: data.deptId ? Number(data.deptId) : undefined,
      postTypeId: data.postTypeId ? Number(data.postTypeId) : undefined,
      folderDeptId: data.folderDeptId ? Number(data.folderDeptId) : undefined,
      searchTypes: data.searchTypes ?? ["post", "folder", "user"],
    });

    setShowSearch(true);
    reset();
  };

  return (
    <motion.form
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, duration: 1 }}
      onSubmit={handleSubmit(handleSearch)}
    >
      {/* Search Bar */}
      <motion.div
        className={`bg-[#EEEEEE] w-96 md:w-full h-18 mt-4 rounded-full justify-between border-2 p-1 ${
          (watch("searchTerm") || "").length > 0
            ? "border-blue-600"
            : "border-black"
        } mb-6 flex items-center ps-7 cursor-text`}
      >
        <input
          type="text"
          {...register("searchTerm")}
          className="border-none bg-inherit outline-none w-96"
          placeholder="Looking for something?"
        />
        <Button
          className="bg-white rounded-full shadow-xl h-14 w-40 border justify-center gap-2 hover:bg-blue-600 hover:shadow-2xl hover:text-white"
          icon={PrimeIcons.SEARCH}
        >
          Search
        </Button>
      </motion.div>

      {/* Filters */}
      <div className="flex justify-center">
        <div className="w-96 bg-[#EEE] p-4 rounded-xl shadow flex flex-col gap-3">
          <Controller
            control={control}
            name="deptId"
            render={({ field }) => (
              <Dropdown
                {...field}
                value={field.value ?? null}
                options={departments.map((d) => ({
                  label: d.departmentName,
                  value: d.deptId,
                }))}
                placeholder="Filter by Department"
                className="w-full"
              />
            )}
          />

          <Controller
            control={control}
            name="postTypeId"
            render={({ field }) => (
              <Dropdown
                {...field}
                value={field.value ?? null}
                options={postTypes.map((p) => ({
                  label: p.name,
                  value: p.id,
                }))}
                placeholder="Filter by Post Type"
                className="w-full"
              />
            )}
          />

          <Controller
            control={control}
            name="folderDeptId"
            render={({ field }) => (
              <Dropdown
                {...field}
                value={field.value ?? null}
                options={departments.map((d) => ({
                  label: d.departmentName,
                  value: d.deptId,
                }))}
                placeholder="Filter by Folder Department"
                className="w-full"
              />
            )}
          />

          <Controller
            control={control}
            name="searchTypes"
            render={({ field }) => (
              <MultiSelect
                {...field}
                value={field.value ?? []}
                options={[
                  { label: "Posts", value: "post" },
                  { label: "Folders", value: "folder" },
                  { label: "Users", value: "user" },
                ]}
                placeholder="Filter by Type"
                className="w-full"
                display="chip"
              />
            )}
          />
        </div>
      </div>
    </motion.form>
  );
};

export default SearchV2;
