"use client";
import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  User,
  Building2,
  FileText,
  MessageSquare,
  Eye,
  EyeOff,
  Clock,
  ArrowLeft,
  Edit,
  Trash2,
  Plus,
  Camera,
  Mail,
  Phone,
  AlertCircle,
  CheckCircle,
  XCircle,
  Minus,
} from "lucide-react";
import { getIncidentReportById } from "@/app/utils/service/incidentReportService";
import { useQuery } from "@tanstack/react-query";

interface Props {
  incidentReportId: number;
}

const ModernIncidentReportPage: React.FC<Props> = ({ incidentReportId }) => {
  const { data } = useQuery({
    queryKey: ["incident-report-single", incidentReportId],
    queryFn: () => getIncidentReportById(incidentReportId),
    enabled: !!incidentReportId && incidentReportId !== undefined,
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [animationTime, setAnimationTime] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    setAnimationTime(Date.now());

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const animationInterval = setInterval(() => {
      setAnimationTime(Date.now());
    }, 50);

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(animationInterval);
    };
  }, []);

  const getAnimationStyle = (index: number = 0): React.CSSProperties => {
    if (!isLoaded) return {};

    return {
      transform: `translate(${
        mousePosition.x * (index === 0 ? 0.01 : -0.01)
      }px, ${mousePosition.y * (index === 0 ? 0.01 : -0.01)}px) scale(${
        1 + Math.sin(animationTime / (4000 + index * 1000)) * 0.05
      })`,
      transition: "transform 0.1s ease-out",
    };
  };

  const getStatusColor = (statusId: number | undefined) => {
    switch (statusId) {
      case 1:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case 2:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 3:
        return "bg-green-100 text-green-800 border-green-200";
      case 4:
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (statusId: number | undefined) => {
    switch (statusId) {
      case 1:
        return <AlertCircle className="w-4 h-4" />;
      case 2:
        return <Clock className="w-4 h-4" />;
      case 3:
        return <CheckCircle className="w-4 h-4" />;
      case 4:
        return <XCircle className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: FileText },
    { id: "details", label: "Details", icon: FileText },
    { id: "evidence", label: "Evidence", icon: Camera },
    { id: "comments", label: "Comments", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Background animation */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl"
          style={getAnimationStyle(0)}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"
          style={getAnimationStyle(1)}
        />
      </div>

      {/* Header */}
      <div className="relative z-0 bg-white/60 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-xl bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-600 hover:from-blue-200 hover:to-cyan-200 transition-all duration-200">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Incident Report #{data?.data.incidentReport.id}
                </h1>
                <p className="text-sm text-gray-600">
                  Created {formatDate(data?.data.incidentReport.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div
                className={`px-4 py-2 rounded-full border flex items-center space-x-2 ${getStatusColor(
                  data?.data.incidentReport.statusId
                )}`}
              >
                {getStatusIcon(data?.data.incidentReport.statusId)}
                <span className="text-sm font-semibold">
                  {data?.data.incidentReport.statusId}
                </span>
              </div>
              <button className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 transition-all duration-200">
                <Edit className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/60 backdrop-blur-md rounded-2xl p-1 border border-white/20">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === "overview" && (
              <div
                className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-xl"
                style={{
                  opacity: isLoaded ? 1 : 0,
                  transform: `translateY(${isLoaded ? 0 : 30}px)`,
                  transition: "all 0.8s ease-out",
                }}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-orange-100 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {data?.data.incidentReport.title}
                    </h2>
                    <p className="text-gray-600">Incident Report Overview</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Description
                    </h3>
                    <p className="text-gray-700 bg-gray-50 rounded-xl p-4">
                      {data?.data.incidentReport.reportDescription}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Building2 className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">
                            Reporting Department
                          </p>
                          <p className="font-semibold text-gray-900">
                            {
                              data?.data.incidentReport.reportingDepartment
                                .departmentName
                            }
                          </p>
                          <p className="text-sm text-gray-500">
                            {
                              data?.data.incidentReport.reportingDepartment
                                .departmentCode
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Building2 className="w-5 h-5 text-red-600" />
                        <div>
                          <p className="text-sm text-gray-600">
                            Reported Department
                          </p>
                          <p className="font-semibold text-gray-900">
                            {
                              data?.data.incidentReport.reportedDepartment
                                .departmentName
                            }
                          </p>
                          <p className="text-sm text-gray-500">
                            {
                              data?.data.incidentReport.reportedDepartment
                                .departmentCode
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "details" && (
              <div
                className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-xl"
                style={{
                  opacity: isLoaded ? 1 : 0,
                  transform: `translateY(${isLoaded ? 0 : 30}px)`,
                  transition: "all 0.8s ease-out",
                }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Incident Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">Report ID</p>
                      <p className="font-semibold text-gray-900">
                        #{data?.data.incidentReport.id}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">Created Date</p>
                      <p className="font-semibold text-gray-900">
                        {formatDate(data?.data.incidentReport.createdAt)}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">Last Updated</p>
                      <p className="font-semibold text-gray-900">
                        {formatDate(data?.data.incidentReport.updatedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">Visibility</p>
                      <p className="font-semibold text-gray-900">
                        {data?.data.incidentReport.public
                          ? "Public"
                          : "Private"}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">
                        Department Explanation
                      </p>
                      <p className="font-semibold text-gray-900">
                        {data?.data.incidentReport
                          .reportedDepartmentExplanation ||
                          "No explanation provided"}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">Sanction</p>
                      <p className="font-semibold text-gray-900">
                        {data?.data.incidentReport.sanction ||
                          "No sanction applied"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "evidence" && (
              <div
                className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-xl"
                style={{
                  opacity: isLoaded ? 1 : 0,
                  transform: `translateY(${isLoaded ? 0 : 30}px)`,
                  transition: "all 0.8s ease-out",
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Evidence</h2>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-200">
                    <Plus className="w-5 h-5" />
                    <span>Add Evidence</span>
                  </button>
                </div>

                {data?.data.incidentReport.evidences.length === 0 ? (
                  <div className="text-center py-12">
                    <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">
                      No evidence uploaded
                    </p>
                    <p className="text-gray-500 text-sm">
                      Upload photos, documents, or other evidence to support
                      this report
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data?.data.incidentReport.evidences.map(
                      (evidence, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200"
                        >
                          <div className="flex items-center space-x-3">
                            <Camera className="w-8 h-8 text-blue-600" />
                            <div>
                              <p className="font-semibold text-gray-900">
                                Evidence {index + 1}
                              </p>
                              <p className="text-sm text-gray-500">
                                Uploaded evidence
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === "comments" && (
              <div
                className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-xl"
                style={{
                  opacity: isLoaded ? 1 : 0,
                  transform: `translateY(${isLoaded ? 0 : 30}px)`,
                  transition: "all 0.8s ease-out",
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Comments</h2>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-200">
                    <MessageSquare className="w-5 h-5" />
                    <span>Add Comment</span>
                  </button>
                </div>

                {data?.data.incidentReport.comments.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">No comments yet</p>
                    <p className="text-gray-500 text-sm">
                      Start the conversation by adding a comment
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {data?.data.incidentReport.comments.map(
                      (comment, index: number) => (
                        <div
                          key={index}
                          className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                Comment {index + 1}
                              </p>
                              <p className="text-sm text-gray-500">
                                Comment content
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Reporter Information */}
            <div
              className="bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-xl"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: `translateX(${isLoaded ? 0 : 30}px)`,
                transition: "all 0.8s ease-out 0.2s",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Reporter</h3>
                <button
                  onClick={() => setShowSensitiveInfo(!showSensitiveInfo)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showSensitiveInfo ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {data?.data.incidentReport.reporter.firstName}{" "}
                    {data?.data.incidentReport.reporter.lastName}
                  </p>
                </div>
              </div>

              {showSensitiveInfo && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">
                      {data?.data.incidentReport.reporter.email}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">
                      {data?.data.incidentReport.reporter.phone ||
                        "Not provided"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">
                      Department ID: {data?.data.incidentReport.reporter.deptId}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div
              className="bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-xl"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: `translateX(${isLoaded ? 0 : 30}px)`,
                transition: "all 0.8s ease-out 0.4s",
              }}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 rounded-xl text-left transition-all duration-200">
                  <Edit className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">Edit Report</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 rounded-xl text-left transition-all duration-200">
                  <Trash2 className="w-5 h-5 text-red-600" />
                  <span className="text-gray-700">Delete Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernIncidentReportPage;
