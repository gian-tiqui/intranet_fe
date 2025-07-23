"use client";
import React, { useState, useMemo } from "react";
import { Search, Building, Phone, Users } from "lucide-react";

const PhoneDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("all");

  const phoneDirectoryData = useMemo(
    () => [
      {
        floor: "Basement Floor",
        room: [
          {
            number: "124",
            name: "B-INSPECTION ENTRANCE/EXIT",
            extension: "124",
          },
          { number: "134", name: "B-ENGINEERING/PROPERTY", extension: "134" },
          { number: "500", name: "B-SECURITY OFFICE", extension: "500" },
          { number: "560", name: "B-SMS/HOUSEKEEPING", extension: "560" },
        ],
      },
      {
        floor: "Ground Floor",
        room: [
          { number: "100", name: "Operator", extension: "100" },
          { number: "101", name: "GF-H.M.O", extension: "101" },
          { number: "102", name: "GF-PHARMACY", extension: "102" },
          { number: "103", name: "GF-LAB", extension: "103" },
          { number: "104", name: "GF-PHILHEALTH", extension: "104" },
          { number: "107", name: "GF-H.M.O", extension: "107" },
          { number: "110", name: "GF-LABORATORY", extension: "110" },
          { number: "111", name: "GF-RADIOLOGY RECEPTION", extension: "111" },
          { number: "112", name: "GF-RADIOLOGY OFFICE", extension: "112" },
          { number: "113", name: "GF-CANTEEN", extension: "113" },
          { number: "114", name: "GF-DIETARY", extension: "114" },
          { number: "115", name: "GF-MEDICAL RECORDS", extension: "115" },
          { number: "116", name: "GF-CASHIER", extension: "116" },
          { number: "118", name: "GF-ADMITTING", extension: "118" },
          { number: "120", name: "GF-CODE BLUE + EMERGENCY", extension: "120" },
          { number: "121", name: "GF-INFORMATION 2", extension: "121" },
          { number: "122", name: "GF-INFORMATION", extension: "122" },
          { number: "123", name: "GF-FRONT ENTRANCE GUARD", extension: "123" },
          { number: "124", name: "GF-HEAD MEDICINE", extension: "124" },
          { number: "125", name: "GF-HMO 1", extension: "125" },
          { number: "126", name: "GF-HMO 2", extension: "126" },
          { number: "127", name: "GF-HMO 3", extension: "127" },
        ],
      },
      {
        floor: "Mezzanine Floor",
        room: [
          { number: "123", name: "MF-TRAINING OFFICER", extension: "123" },
          { number: "205", name: "MF-LABORATORY HEAD", extension: "205" },
          { number: "207", name: "MF-NSD OFFICE", extension: "207" },
          { number: "323", name: "MF-Infection Control", extension: "323" },
          { number: "570", name: "MF-Chief Nurse", extension: "570" },
          { number: "707", name: "MF-SERVER ROOM", extension: "707" },
        ],
      },
      {
        floor: "2nd Floor",
        room: [
          { number: "117", name: "2F-BILLING", extension: "117" },
          { number: "210", name: "2F-DENTAL", extension: "210" },
          { number: "212", name: "2F-OPD", extension: "212" },
          { number: "213", name: "2F-OPERATING ROOM", extension: "213" },
          {
            number: "214",
            name: "2F-OPERATING ROOM RECEPTION",
            extension: "214",
          },
          { number: "215", name: "2F-N.I.C.U", extension: "215" },
          { number: "216", name: "2F-PHARMACY-OPD", extension: "216" },
          { number: "217", name: "2F-PHARMACY-IPO", extension: "217" },
          { number: "218", name: "2F-C.S. Manager", extension: "218" },
          { number: "219", name: "2F-C.S.R./Linen", extension: "219" },
          { number: "220", name: "2F-Housekeeping", extension: "220" },
          { number: "221", name: "2F-Warehouse Staff", extension: "221" },
          { number: "473", name: "2F-CSR", extension: "473" },
        ],
      },
      {
        floor: "3rd Floor",
        room: [
          { number: "302", name: "3F-PRIMARY CARE", extension: "302" },
          { number: "311", name: "3F-OPD/SURGEONS", extension: "311" },
          { number: "312", name: "3F-DIALYSIS", extension: "312" },
          { number: "313", name: "3F-IPO", extension: "313" },
          { number: "314", name: "3F-OUT-PATIENT CLINIC", extension: "314" },
          { number: "315", name: "3F-IPO", extension: "315" },
          { number: "316", name: "3F-DIALYSIS", extension: "316" },
          { number: "318", name: "3F-ULTRA CLINIC", extension: "318" },
          { number: "319", name: "3F-DLAB-Ultrasound", extension: "319" },
          { number: "320", name: "3F-CARDIO/Pulmonary", extension: "320" },
          { number: "455", name: "3F-Marketing", extension: "455" },
        ],
      },
      {
        floor: "4th Floor",
        room: [
          { number: "1164", name: "4F-Data PC", extension: "1164" },
          { number: "421", name: "4F-GNU Ward A", extension: "421" },
          { number: "422", name: "4F-GNU Ward B", extension: "422" },
          { number: "423", name: "4F-GNU Ward C", extension: "423" },
          { number: "424", name: "4F-GNU Ward D", extension: "424" },
          { number: "425", name: "4F-GNU Ward E", extension: "425" },
          { number: "431", name: "4F-Medical Director", extension: "431" },
          { number: "453", name: "4F-Accreditation", extension: "453" },
          { number: "454", name: "4F-Med. Records 1", extension: "454" },
          { number: "455", name: "4F-Accreditation 2", extension: "455" },
          { number: "456", name: "4F-Quality Assurance", extension: "456" },
          {
            number: "457",
            name: "4F-Facility & Collection 1",
            extension: "457",
          },
          {
            number: "458",
            name: "4F-Facility & Collection 2",
            extension: "458",
          },
          { number: "459", name: "4F-Nursing Office", extension: "459" },
        ],
      },
      {
        floor: "5th Floor",
        room: [{ number: "105", name: "5F-SDU ICU", extension: "105" }],
      },
      {
        floor: "6th Floor",
        room: [
          { number: "611", name: "6F-Manager", extension: "611" },
          { number: "632", name: "6F-Conference", extension: "632" },
          { number: "633", name: "6F-Senior", extension: "633" },
          { number: "634", name: "6F-Clinical", extension: "634" },
          { number: "635", name: "6F-Nurse SI LW", extension: "635" },
        ],
      },
      {
        floor: "7th Floor",
        room: [{ number: "325", name: "7F-ICT", extension: "325" }],
      },
    ],
    []
  );

  const filteredData = useMemo(() => {
    return phoneDirectoryData
      .map((floor) => ({
        ...floor,
        room: floor.room.filter(
          (room) =>
            room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            room.number.includes(searchTerm)
        ),
      }))
      .filter(
        (floor) =>
          (selectedFloor === "all" || floor.floor === selectedFloor) &&
          floor.room.length > 0
      );
  }, [searchTerm, selectedFloor, phoneDirectoryData]);

  // const floorOptions = ["all", ...phoneDirectoryData.map((f) => f.floor)];
  const totalRooms = phoneDirectoryData.reduce(
    (sum, floor) => sum + floor.room.length,
    0
  );

  const getFloorIcon = (floorName: string) => {
    const floorNum = floorName.match(/\d+/)?.[0];
    return (
      floorNum ||
      floorName.split(" ")[0].toUpperCase().charAt(0) +
        floorName.split(" ")[1]?.charAt(0)
    );
  };

  const getDepartmentIcon = (name: string) => {
    if (
      name.toLowerCase().includes("conference") ||
      name.toLowerCase().includes("training")
    )
      return "🏛️";
    if (name.toLowerCase().includes("hr")) return "👥";
    if (name.toLowerCase().includes("it")) return "💻";
    if (name.toLowerCase().includes("finance")) return "💰";
    if (name.toLowerCase().includes("marketing")) return "📈";
    if (name.toLowerCase().includes("sales")) return "🤝";
    if (name.toLowerCase().includes("executive")) return "👔";
    if (name.toLowerCase().includes("legal")) return "⚖️";
    if (name.toLowerCase().includes("support")) return "🎧";
    if (
      name.toLowerCase().includes("research") ||
      name.toLowerCase().includes("development")
    )
      return "🔬";
    if (name.toLowerCase().includes("operations")) return "⚙️";
    if (name.toLowerCase().includes("quality")) return "✅";
    if (name.toLowerCase().includes("facilities")) return "🏢";
    return "📋";
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Building className="h-12 w-12 text-blue-600 mr-3" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Company Directory
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              Find departments and contact information across all floors
            </p>
            <div className="flex items-center justify-center mt-4 space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Building className="h-4 w-4 mr-1" />
                <span>7 Floors</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>{totalRooms} Departments</span>
              </div>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search departments or room numbers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
              />
            </div>
            <select
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm min-w-[150px]"
            >
              <option value="all">All Floors</option>
              {phoneDirectoryData.map((floor) => (
                <option key={floor.floor} value={floor.floor}>
                  {floor.floor}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Directory Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredData.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No results found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search terms or filter
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredData.map((floorData) => (
              <div
                key={floorData.floor}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Floor Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                  <div className="flex items-center">
                    <div className="bg-white bg-opacity-20 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                      <span className="text-xl font-bold text-white">
                        {getFloorIcon(floorData.floor)}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {floorData.floor}
                      </h2>
                      <p className="text-blue-100">
                        {floorData.room.length} department
                        {floorData.room.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Rooms Grid */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {floorData.room.map((room) => (
                      <div
                        key={room.number}
                        className="group bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="text-2xl group-hover:scale-110 transition-transform duration-200">
                            {getDepartmentIcon(room.name)}
                          </div>
                          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                            {room.number}
                          </div>
                        </div>

                        <h3 className="font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200">
                          {room.name}
                        </h3>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-gray-600">
                            <Phone className="h-4 w-4 mr-2 text-blue-500" />

                            <span>Local {room.extension}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneDirectory;
