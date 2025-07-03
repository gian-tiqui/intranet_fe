import { IncidentReport } from "@/app/types/types";
import { getIncidentReports } from "@/app/utils/service/incidentReportService";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Column } from "primereact/column";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { FilterMatchMode } from "primereact/api";
import React, { useEffect, useState } from "react";
import useReportSignalStore from "@/app/store/refetchReportSignal";

interface Props {
  statusId: number;
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

const getStatusColor = (statusId: number) => {
  const statusColors = {
    1: "bg-amber-100 text-amber-800 border-amber-200",
    2: "bg-blue-100 text-blue-800 border-blue-200",
    3: "bg-green-100 text-green-800 border-green-200",
    4: "bg-red-100 text-red-800 border-red-200",
  };
  return (
    statusColors[statusId as keyof typeof statusColors] ||
    "bg-gray-100 text-gray-800 border-gray-200"
  );
};

const getStatusLabel = (statusId: number) => {
  const statusLabels = {
    1: "Pending",
    2: "In Progress",
    3: "Resolved",
    4: "Rejected",
  };
  return statusLabels[statusId as keyof typeof statusLabels] || "Unknown";
};

const IncidentReportTable: React.FC<Props> = ({ statusId }) => {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [`incident-report`, statusId],
    queryFn: () => getIncidentReports({ statusId }),
    enabled: !!statusId,
  });

  const { signal, setSignal } = useReportSignalStore();

  useEffect(() => {
    if (signal) {
      refetch();
    }

    return () => {
      setSignal(false);
    };
  }, [signal, refetch, setSignal]);

  const [filters, setFilters] = useState<DataTableFilterMeta>({});
  const [, setGlobalFilterValue] = useState("");

  useEffect(() => {
    initFilters();
  }, []);

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      title: { value: null, matchMode: FilterMatchMode.CONTAINS },
      reporterName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      reportingDepartment: { value: null, matchMode: FilterMatchMode.CONTAINS },
      reportedDepartment: { value: null, matchMode: FilterMatchMode.CONTAINS },
      createdAtFormatted: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    setGlobalFilterValue("");
  };

  const transformData = (incidentReports: IncidentReport[]) =>
    incidentReports?.map((report) => ({
      ...report,
      reporterName: `${report.reporter?.firstName} ${report.reporter?.lastName}`,
      reportingDepartment: report.reportingDepartment?.departmentName,
      reportedDepartment: report.reportedDepartment?.departmentName,
      createdAtFormatted: formatDate(report.createdAt),
    }));

  const reports = transformData(data?.data.incidentReports ?? []);

  const titleBodyTemplate = (rowData: IncidentReport) => (
    <div className="flex flex-col gap-1">
      <span className="font-medium text-gray-900 text-sm">{rowData.title}</span>
      <span className="text-xs text-gray-500 truncate max-w-[200px]">
        {rowData.reportDescription}
      </span>
    </div>
  );

  const reporterBodyTemplate = (rowData: IncidentReport) => (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
        {rowData.reporter?.firstName?.charAt(0)?.toUpperCase()}
      </div>
      <div className="flex flex-col">
        <span className="font-medium text-gray-900 text-sm">
          {rowData.reporter?.firstName} {rowData.reporter?.lastName}
        </span>
        <span className="text-xs text-gray-500">Reporter</span>
      </div>
    </div>
  );

  const departmentBodyTemplate = (department: string) => (
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      <span className="text-gray-700 text-sm">
        {department || (
          <span className="italic text-gray-400">No department</span>
        )}
      </span>
    </div>
  );

  const dateBodyTemplate = (rowData: IncidentReport) => (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-gray-900">
        {formatDate(rowData.createdAt)}
      </span>
      <span className="text-xs text-gray-500">
        {new Date(rowData.createdAt).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </div>
  );

  const statusBodyTemplate = (rowData: IncidentReport) => (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
        rowData.statusId
      )}`}
    >
      {getStatusLabel(rowData.statusId)}
    </span>
  );

  const actionBodyTemplate = (rowData: IncidentReport) => (
    <div className="flex items-center gap-2">
      <button
        onClick={() => router.push(`/incident-report/${rowData.id}`)}
        className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-all duration-200 group"
        title="View report details"
      >
        <i className="pi pi-eye text-sm group-hover:scale-110 transition-transform"></i>
      </button>
    </div>
  );

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="pi pi-exclamation-triangle text-red-600 text-xl"></i>
        </div>
        <h3 className="text-lg font-medium text-red-900 mb-2">
          Error Loading Reports
        </h3>
        <p className="text-red-600 text-sm">
          Failed to load incident reports. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Table Header with Stats */}
        <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-1">Incident Reports</h2>
              <p className="text-blue-100 text-sm">
                Manage and view incident reports • Status:{" "}
                {getStatusLabel(statusId)}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{reports?.length || 0}</div>
                <div className="text-xs text-blue-100">Total Reports</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced DataTable */}
        <div className="p-6">
          <DataTable
            value={reports}
            loading={isLoading}
            className="modern-datatable"
            paginator
            rows={10}
            rowsPerPageOptions={[10, 25, 50, 100]}
            filters={filters}
            filterDisplay="row"
            globalFilterFields={[
              "title",
              "reporterName",
              "reportingDepartment",
              "reportedDepartment",
              "createdAtFormatted",
            ]}
            rowClassName={() =>
              "hover:bg-blue-50 transition-colors border-b border-gray-100"
            }
            emptyMessage={
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <i className="pi pi-inbox text-2xl text-gray-400"></i>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No reports found
                </h3>
                <p className="text-gray-500 mb-4">
                  There are no incident reports matching your current filters.
                </p>
              </div>
            }
            pt={{
              table: { className: "border-separate border-spacing-0 w-full" },
              thead: { className: "bg-gray-50" },
              headerRow: {
                className:
                  "bg-gray-50 border-b border-gray-200 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider",
              },
              bodyRow: {
                className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900",
              },
            }}
          >
            <Column
              field="title"
              header="Title"
              filter
              filterPlaceholder="Search titles..."
              style={{ minWidth: "16rem" }}
              body={titleBodyTemplate}
            />

            <Column
              field="reporterName"
              header="Reporter"
              filter
              filterPlaceholder="Search reporters..."
              style={{ minWidth: "14rem" }}
              body={reporterBodyTemplate}
            />

            <Column
              field="reportingDepartment"
              header="Reporting Dept"
              filter
              filterPlaceholder="Search departments..."
              style={{ minWidth: "12rem" }}
              body={(rowData) =>
                departmentBodyTemplate(rowData.reportingDepartment)
              }
            />

            <Column
              field="reportedDepartment"
              header="Reported Dept"
              filter
              filterPlaceholder="Search departments..."
              style={{ minWidth: "12rem" }}
              body={(rowData) =>
                departmentBodyTemplate(rowData.reportedDepartment)
              }
            />

            <Column
              field="statusId"
              header="Status"
              style={{ minWidth: "8rem" }}
              body={statusBodyTemplate}
            />

            <Column
              field="createdAtFormatted"
              header="Created"
              filter
              filterPlaceholder="Search dates..."
              style={{ minWidth: "10rem" }}
              body={dateBodyTemplate}
            />

            <Column
              header="Actions"
              style={{ minWidth: "8rem" }}
              body={actionBodyTemplate}
            />
          </DataTable>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="pi pi-file-text text-blue-600"></i>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Reports</p>
              <p className="text-lg font-semibold text-gray-900">
                {reports?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <i className="pi pi-clock text-amber-600"></i>
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-lg font-semibold text-gray-900">
                {reports?.filter((r) => r.statusId === 1).length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="pi pi-check text-green-600"></i>
            </div>
            <div>
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-lg font-semibold text-gray-900">
                {reports?.filter((r) => r.statusId === 3).length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="pi pi-building text-purple-600"></i>
            </div>
            <div>
              <p className="text-sm text-gray-600">Departments</p>
              <p className="text-lg font-semibold text-gray-900">
                {[
                  ...new Set(
                    reports?.map((r) => r.reportingDepartment).filter(Boolean)
                  ),
                ].length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentReportTable;
