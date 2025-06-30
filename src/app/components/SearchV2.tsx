import { motion } from "framer-motion";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { useForm, Controller } from "react-hook-form";
import searchTermStore from "../store/search";
import useShowSearchStore from "../store/showSearch";
import { Department, PostType } from "../types/types";
import { MultiSelect } from "primereact/multiselect";
import { useState } from "react";

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
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const watchedValues = watch();
  const searchTerm = watchedValues.searchTerm || "";

  // Count active filters
  const activeFiltersCount = Object.entries(watchedValues).filter(
    ([key, value]) => {
      if (key === "searchTerm") return false;
      return Array.isArray(value)
        ? value.length > 0
        : value !== undefined && value !== null;
    }
  ).length;

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

  const clearAllFilters = () => {
    reset({
      searchTerm: watchedValues.searchTerm,
      deptId: undefined,
      postTypeId: undefined,
      folderDeptId: undefined,
      searchTypes: undefined,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        onSubmit={handleSubmit(handleSearch)}
        className="space-y-6"
      >
        {/* Modern Search Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative"
        >
          <div
            className={`relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
              searchTerm.length > 0
                ? "border-blue-500/50 shadow-blue-100/50"
                : "border-gray-200/50 hover:border-gray-300/50"
            }`}
          >
            <div className="flex items-center p-2">
              <div className="flex-1 px-4">
                <input
                  type="text"
                  {...register("searchTerm")}
                  className="w-full py-4 text-lg bg-transparent border-none outline-none placeholder-gray-400 text-gray-700"
                  placeholder="What are you looking for today?"
                />
              </div>
              <Button
                className="bg-gradient-to-r gap-2 me-2 from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 border-0"
                icon={PrimeIcons.SEARCH}
                iconPos="left"
                type="submit"
              >
                Search
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Filter Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex justify-center"
        >
          <button
            type="button"
            onClick={() => setFiltersExpanded(!filtersExpanded)}
            className="group flex items-center gap-3 px-6 py-3 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/50 hover:bg-white/90 hover:border-blue-300/50 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-2 text-gray-700 group-hover:text-blue-600 transition-colors">
              <i className="pi pi-filter text-sm" />
              <span className="font-medium">Advanced Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                  {activeFiltersCount}
                </span>
              )}
            </div>
            <i
              className={`pi pi-chevron-down text-sm text-gray-400 transition-transform duration-200 ${
                filtersExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </motion.div>

        {/* Filters Panel */}
        <motion.div
          initial={false}
          animate={{
            height: filtersExpanded ? "auto" : 0,
            opacity: filtersExpanded ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={control}
                name="deptId"
                render={({ field }) => (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">
                      Department
                    </label>
                    <Dropdown
                      {...field}
                      value={field.value ?? null}
                      options={departments.map((d) => ({
                        label: d.departmentName,
                        value: d.deptId,
                      }))}
                      placeholder="Select Department"
                      className="w-full modern-dropdown"
                      showClear={field.value !== null}
                    />
                  </div>
                )}
              />

              <Controller
                control={control}
                name="postTypeId"
                render={({ field }) => (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">
                      Post Type
                    </label>
                    <Dropdown
                      {...field}
                      value={field.value ?? null}
                      options={
                        postTypes.map((p) => ({
                          label: p.name,
                          value: p.id,
                        })) || []
                      }
                      placeholder="Select Post Type"
                      className="w-full modern-dropdown"
                      showClear={field.value !== null}
                    />
                  </div>
                )}
              />

              <Controller
                control={control}
                name="folderDeptId"
                render={({ field }) => (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">
                      Folder Department
                    </label>
                    <Dropdown
                      {...field}
                      value={field.value ?? null}
                      options={departments.map((d) => ({
                        label: d.departmentName,
                        value: d.deptId,
                      }))}
                      placeholder="Select Folder Department"
                      className="w-full modern-dropdown"
                      showClear={field.value !== null}
                    />
                  </div>
                )}
              />

              <Controller
                control={control}
                name="searchTypes"
                render={({ field }) => (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">
                      Search Types
                    </label>
                    <MultiSelect
                      {...field}
                      value={field.value ?? []}
                      options={[
                        { label: "Posts", value: "post" },
                        { label: "Folders", value: "folder" },
                        { label: "Users", value: "user" },
                      ]}
                      placeholder="Select Types"
                      className="w-full modern-multiselect"
                      display="chip"
                      showClear={field.value && field.value.length > 0}
                    />
                  </div>
                )}
              />
            </div>

            {/* Clear All Filters */}
            {activeFiltersCount > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200/50">
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-sm text-gray-600 hover:text-red-600 font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  <i className="pi pi-times text-xs" />
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Active Filters Summary */}
        {activeFiltersCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50/50 backdrop-blur-sm rounded-xl p-4 border border-blue-200/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <i className="pi pi-info-circle text-blue-600 text-sm" />
                <span className="text-sm font-medium text-blue-800">
                  {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""}{" "}
                  active
                </span>
              </div>
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Clear All
              </button>
            </div>
          </motion.div>
        )}
      </motion.form>
    </div>
  );
};

export default SearchV2;
