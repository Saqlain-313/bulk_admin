import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchImportAnalysis } from "../redux/slices/importUserSlice";
import { fetchUsers } from "../redux/slices/userSlice";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const Dashboard = () => {
  const dispatch = useDispatch();

  const {
    all = [],
    unique = [],
    duplicates = [],
    loading: importLoading,
  } = useSelector((s) => s.importUsers);

  const { users = [], loading: userLoading } = useSelector(
    (s) => s.users
  );

  useEffect(() => {
    dispatch(fetchImportAnalysis());
    dispatch(fetchUsers());
  }, [dispatch]);

  // 🔹 Cards Data
  const cards = [
    { title: "Total Imported", value: all.length },
    { title: "Unique Users", value: unique.length },
    { title: "Duplicate Users", value: duplicates.length },
    { title: "Total Users", value: users.length },
  ];

  // 🔹 Graph Data (Multi Line)
  const graphData = [
    {
      name: "Data",
      Imported: all.length,
      Unique: unique.length,
      Duplicate: duplicates.length,
      Users: users.length,
    },
  ];

  if (importLoading || userLoading) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="p-6 space-y-8">
      
      {/* 🔹 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl shadow-lg text-white bg-indigo-500 hover:scale-105 transition"
          >
            <h3 className="text-lg font-semibold">{card.title}</h3>
            <p className="text-3xl font-bold mt-2">{card.value}</p>
          </div>
        ))}
      </div>

      {/* 🔹 Line Graph */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-4">
          User Analytics (Line Graph)
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={graphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />

            {/* Multi Lines */}
            <Line type="monotone" dataKey="Imported" stroke="#6366f1" strokeWidth={3} />
            <Line type="monotone" dataKey="Unique" stroke="#22c55e" strokeWidth={3} />
            <Line type="monotone" dataKey="Duplicate" stroke="#ef4444" strokeWidth={3} />
            <Line type="monotone" dataKey="Users" stroke="#f59e0b" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;