import { IncidentReport } from "@/app/types/types";
import { getIncidentReports } from "@/app/utils/service/incidentReportService";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Badge } from "primereact/badge";
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

  const [filters, setFilters] = useState<DataTableFilterMeta>({
    title: { value: null, matchMode: "contains" },
    reporterName: { value: null, matchMode: "contains" },
    reportingDepartment: { value: null, matchMode: "contains" },
    reportedDepartment: { value: null, matchMode: "contains" },
    createdAtFormatted: { value: null, matchMode: "contains" },
  });

  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const globalFilterFields = [
    "title",
    "reporterName",
    "reportingDepartment",
    "reportedDepartment",
    "createdAtFormatted",
  ];

  const transformData = (incidentReports: IncidentReport[]) =>
    incidentReports?.map((report) => ({
      ...report,
      reporterName: `${report.reporter?.firstName} ${report.reporter?.lastName}`,
      reportingDepartment: report.reportingDepartment?.departmentName,
      reportedDepartment: report.reportedDepartment?.departmentName,
      createdAtFormatted: formatDate(report.createdAt),
    }));

  const reports = transformData(data?.data.incidentReports ?? []);

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGlobalFilterValue(value);
  };

  const titleBodyTemplate = (rowData: IncidentReport) => (
    <div className="flex flex-col gap-1">
      <span className="font-medium text-slate-900 text-sm">
        {rowData.title}
      </span>
      <span className="text-xs text-slate-500 truncate max-w-[200px]">
        {rowData.reportDescription}
      </span>
    </div>
  );

  const reporterBodyTemplate = (rowData: IncidentReport) => (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
        <span className="text-white text-xs font-medium">
          {rowData.reporter.firstName?.charAt(0)}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="font-medium text-slate-900 text-sm">
          {rowData.reporter.firstName}
        </span>
        <span className="text-xs text-slate-500">Reporter</span>
      </div>
    </div>
  );

  const departmentBodyTemplate = (department: string) => (
    <Badge
      value={department}
      className="!bg-slate-100 !text-slate-700 !border-slate-200 !px-3 !py-1 !text-xs !font-medium !rounded-full"
    />
  );

  const dateBodyTemplate = (rowData: IncidentReport) => (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-slate-900">{rowData.createdAt}</span>
      <span className="text-xs text-slate-500">
        {new Date(rowData.createdAt).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </div>
  );

  const statusBodyTemplate = (rowData: IncidentReport) => (
    <Badge
      value={getStatusLabel(rowData.statusId)}
      className={`!px-3 !py-1 !text-xs !font-medium !rounded-full !border ${getStatusColor(
        rowData.statusId
      )}`}
    />
  );

  const actionBodyTemplate = (rowData: IncidentReport) => (
    <div className="flex items-center gap-2">
      <Button
        icon="pi pi-eye"
        className="!w-8 !h-8 !p-0 !bg-blue-50 hover:!bg-blue-100 !border-blue-200 !text-blue-600 !rounded-lg !transition-all !duration-200"
        onClick={() => router.push(`/incident-report/${rowData.id}`)}
        tooltip="View Details"
        tooltipOptions={{ position: "top" }}
      />
    </div>
  );

  const loadingTemplate = () => <div className="p-6">Loading table</div>;

  const emptyTemplate = () => (
    <div className="text-center py-16">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <i className="pi pi-inbox text-2xl text-slate-400"></i>
      </div>
      <h3 className="text-lg font-medium text-slate-900 mb-2">
        No Reports Found
      </h3>
      <p className="text-slate-500 text-sm">
        There are no incident reports matching your current filters.
      </p>
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
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-1">
              Incident Reports
            </h2>
            <p className="text-sm text-slate-600">
              {reports.length} reports • Status: {getStatusLabel(statusId)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <i className="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm"></i>
              <InputText
                value={globalFilterValue}
                onChange={onGlobalFilterChange}
                placeholder="Search reports..."
                className="!pl-10 !pr-4 !py-2 !text-sm !border-slate-300 !rounded-lg !bg-white focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-500/20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        value={reports}
        loading={isLoading}
        loadingIcon={loadingTemplate}
        emptyMessage={emptyTemplate}
        paginator
        rows={10}
        rowsPerPageOptions={[10, 25, 50]}
        filters={filters}
        globalFilter={globalFilterValue}
        onFilter={(e) => setFilters(e.filters as DataTableFilterMeta)}
        globalFilterFields={globalFilterFields}
        className="modern-datatable"
        paginatorClassName="!border-t !border-slate-200 !bg-slate-50"
        scrollable
        scrollHeight="600px"
      >
        <Column
          header="Title"
          field="title"
          body={titleBodyTemplate}
          filter
          filterPlaceholder="Search titles..."
          showFilterMenu={false}
          filterMatchMode="contains"
          className="min-w-[250px]"
        />
        <Column
          header="Reporter"
          field="reporterName"
          body={reporterBodyTemplate}
          filter
          filterPlaceholder="Search reporters..."
          showFilterMenu={false}
          filterMatchMode="contains"
          className="min-w-[200px]"
        />
        <Column
          header="Reporting Dept"
          field="reportingDepartment"
          body={(rowData) =>
            departmentBodyTemplate(rowData.reportingDepartment)
          }
          filter
          filterPlaceholder="Search departments..."
          showFilterMenu={false}
          filterMatchMode="contains"
          className="min-w-[150px]"
        />
        <Column
          header="Reported Dept"
          field="reportedDepartment"
          body={(rowData) => departmentBodyTemplate(rowData.reportedDepartment)}
          filter
          filterPlaceholder="Search departments..."
          showFilterMenu={false}
          filterMatchMode="contains"
          className="min-w-[150px]"
        />
        <Column
          header="Status"
          field="statusId"
          body={statusBodyTemplate}
          className="min-w-[120px]"
        />
        <Column
          header="Created"
          field="createdAtFormatted"
          body={dateBodyTemplate}
          sortable
          className="min-w-[130px]"
        />
        <Column
          header="Actions"
          body={actionBodyTemplate}
          className="min-w-[120px]"
        />
      </DataTable>

      <style jsx global>{`
        .modern-datatable .p-datatable-thead > tr > th {
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          border-top: none;
          border-left: none;
          border-right: none;
          padding: 16px 12px;
          font-weight: 600;
          font-size: 14px;
          color: #334155;
        }

        .modern-datatable .p-datatable-tbody > tr > td {
          padding: 16px 12px;
          border-bottom: 1px solid #f1f5f9;
          border-left: none;
          border-right: none;
          font-size: 14px;
        }

        .modern-datatable .p-datatable-tbody > tr:last-child > td {
          border-bottom: none;
        }

        .modern-datatable .p-column-filter-row .p-column-filter-element {
          margin: 0;
        }

        .modern-datatable .p-column-filter-row .p-column-filter-element input {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 13px;
          transition: all 0.2s ease;
        }

        .modern-datatable
          .p-column-filter-row
          .p-column-filter-element
          input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
          outline: none;
        }

        .modern-datatable .p-paginator {
          padding: 16px 12px;
          border-top: 1px solid #e2e8f0;
        }

        .modern-datatable .p-paginator .p-paginator-pages .p-paginator-page {
          border-radius: 8px;
          margin: 0 2px;
        }

        .modern-datatable
          .p-paginator
          .p-paginator-pages
          .p-paginator-page.p-highlight {
          background: #3b82f6;
          border-color: #3b82f6;
        }
      `}</style>
    </div>
  );
};

export default IncidentReportTable;
