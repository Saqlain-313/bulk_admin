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
  const [filter, setFilter] = useState("all"); // 🔥 new

  useEffect(() => {
    dispatch(fetchImportAnalysis());
  }, [dispatch]);

  // 🔁 choose data based on filter
  const data =
    filter === "unique"
      ? unique
      : filter === "duplicates"
      ? duplicates
      : all;

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  const handleBulk = (status) => {
    if (!selected.length) return alert("Select users first");

    dispatch(bulkUpdateImportStatus({ ids: selected, status }))
      .then(() => {
        dispatch(fetchImportAnalysis());
        setSelected([]);
      });
  };

  const handleSingle = (id, status) => {
    dispatch(updateImportStatus({ id, status }))
      .then(() => dispatch(fetchImportAnalysis()));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Import Users Analysis
      </h1>

      {/* 📊 Stats */}
      <div className="flex gap-4 mb-6">
        <div className="bg-green-100 p-3 rounded">
          Unique: {unique?.length}
        </div>
        <div className="bg-red-100 p-3 rounded">
          Duplicates: {duplicates?.length}
        </div>
        <div className="bg-blue-100 p-3 rounded">
          Total: {all?.length}
        </div>
      </div>

      {/* 🔥 FILTER BUTTONS */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          All
        </button>

        <button
          onClick={() => setFilter("unique")}
          className={`px-4 py-2 rounded ${
            filter === "unique"
              ? "bg-green-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Unique
        </button>

        <button
          onClick={() => setFilter("duplicates")}
          className={`px-4 py-2 rounded ${
            filter === "duplicates"
              ? "bg-red-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Duplicates
        </button>
      </div>

      {/* ⚡ Bulk Actions */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => handleBulk("sent")}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Mark Sent
        </button>

        <button
          onClick={() => handleBulk("failed")}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Mark Failed
        </button>
      </div>

      {/* 📋 Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th>Select</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {data?.map((u) => (
              <tr
                key={u._id}
                className={`text-center border-t ${
                  filter === "duplicates"
                    ? "bg-red-50"
                    : ""
                }`}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(u._id)}
                    onChange={() => toggleSelect(u._id)}
                  />
                </td>

                <td>{u.name}</td>
                <td className="font-semibold">{u.mobile}</td>

                <td>
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      u.status === "sent"
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
                    onClick={() =>
                      handleSingle(u._id, "sent")
                    }
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    Sent
                  </button>

                  <button
                    onClick={() =>
                      handleSingle(u._id, "failed")
                    }
                    className="bg-red-500 text-white px-2 py-1 rounded"
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
  );
};

export default ImportUsers;