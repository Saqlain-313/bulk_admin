import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchImportAnalysis,
  updateImportStatus,
  bulkUpdateImportStatus,
} from "../redux/slices/importUserSlice";

const ImportUsers = () => {
  const dispatch = useDispatch();
  const { all, unique, duplicates, loading } = useSelector(
    (s) => s.importUsers
  );

  const [selected, setSelected] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [uploadedByFilter, setUploadedByFilter] = useState("all");

  const uploadedByList = [
    "all",
    ...new Set((all || []).map((u) => u.uploadedByName).filter(Boolean)),
  ];

  useEffect(() => {
    dispatch(fetchImportAnalysis());
  }, [dispatch]);

  const baseData =
    filter === "unique"
      ? unique
      : filter === "duplicates"
        ? duplicates
        : all;

  const data = (baseData || []).filter((u) => {
    const matchesSearch =
      // u.name?.toLowerCase().includes(search.toLowerCase()) ||
      // u.mobile?.toLowerCase().includes(search.toLowerCase()) ||
      u.uploadedByName?.toLowerCase().includes(search.toLowerCase());

    const matchesUser =
      uploadedByFilter === "all" ||
      u.uploadedByName === uploadedByFilter;

    return matchesSearch && matchesUser;
  });

  const isAllSelected = data.length > 0 && selected.length === data.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelected([]);
    } else {
      setSelected(data.map((u) => u._id));
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  const handleBulk = (status) => {
    if (!selected.length) return alert("Select users first");

    dispatch(bulkUpdateImportStatus({ ids: selected, status })).then(() => {
      dispatch(fetchImportAnalysis());
      setSelected([]);
    });
  };

  const handleSingle = (id, status) => {
    dispatch(updateImportStatus({ id, status })).then(() =>
      dispatch(fetchImportAnalysis())
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* 🔥 Header */}
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Import Users Analysis
      </h1>

      {/* 📊 Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-100 text-green-700 p-4 rounded-xl shadow text-center font-semibold">
          Unique <div className="text-xl">{unique?.length}</div>
        </div>
        <div className="bg-red-100 text-red-700 p-4 rounded-xl shadow text-center font-semibold">
          Duplicates <div className="text-xl">{duplicates?.length}</div>
        </div>
        <div className="bg-blue-100 text-blue-700 p-4 rounded-xl shadow text-center font-semibold">
          Total <div className="text-xl">{all?.length}</div>
        </div>
      </div>

      {/* 🔥 Controls Row (ALL IN ONE LINE) */}
      <div className="flex flex-wrap items-center gap-3 mb-5">

        {/* Filter Buttons */}
        <div className="flex gap-2">
          {["all", "unique", "duplicates"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === f
                ? "bg-blue-600 text-white shadow"
                : "bg-white border hover:bg-gray-100"
                }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Uploaded By Filter */}
        <select
          value={uploadedByFilter}
          onChange={(e) => setUploadedByFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          {uploadedByList.map((name, i) => (
            <option key={i} value={name}>
              {name === "all" ? "All Users" : name}
            </option>
          ))}
        </select>

        {/* Bulk Buttons */}
        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => handleBulk("sent")}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow"
          >
            Mark Sent
          </button>
          <button
            onClick={() => handleBulk("failed")}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow"
          >
            Mark Failed
          </button>
        </div>
      </div>

      {/* 📋 Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <p className="p-4">Loading...</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                </th>                <th>Name</th>
                <th>Mobile</th>
                <th>Uploaded By</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {data?.map((u) => (
                <tr
                  key={u._id}
                  className={`text-center border-t hover:bg-gray-50 ${filter === "duplicates" ? "bg-red-50" : ""
                    }`}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.includes(u._id)}
                      onChange={() => toggleSelect(u._id)}
                    />
                  </td>

                  <td className="font-medium">{u.name}</td>

                  <td
                    className={`font-semibold ${!u.mobile || u.mobile === "undefined"
                      ? "text-red-500"
                      : ""
                      }`}
                  >
                    {u.mobile && u.mobile !== "undefined"
                      ? u.mobile
                      : "Missing"}
                  </td>

                  <td className="text-blue-600 font-medium">
                    {u.uploadedByName || "Unknown"}
                  </td>

                  <td>
                    <span
                      className={`px-3 py-1 text-xs rounded-full text-white ${u.status === "sent"
                        ? "bg-green-500"
                        : u.status === "failed"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                        }`}
                    >
                      {u.status}
                    </span>
                  </td>

                  <td className="space-x-2">
                    <button
                      onClick={() => handleSingle(u._id, "sent")}
                      className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                    >
                      Sent
                    </button>
                    <button
                      onClick={() => handleSingle(u._id, "failed")}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Failed
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ImportUsers;