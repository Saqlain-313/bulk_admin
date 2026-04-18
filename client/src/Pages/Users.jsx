import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  updateCredits,
} from "../redux/slices/userSlice";

const Users = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((s) => s.users);

  const [creditInputs, setCreditInputs] = useState({});

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleChange = (userId, value) => {
    setCreditInputs({
      ...creditInputs,
      [userId]: value,
    });
  };

  const handleUpdate = (userId, action) => {
    const amount = creditInputs[userId];

    if (!amount) return alert("Enter amount");

    dispatch(
      updateCredits({
        userId,
        amount,
        action,
      })
    ).then(() => {
      dispatch(fetchUsers()); // 🔄 refresh list
      setCreditInputs({ ...creditInputs, [userId]: "" });
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Users</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">Name</th>
                <th>Email</th>
                <th>Credits</th>
                <th>Update Credits</th>
              </tr>
            </thead>

            <tbody>
              {users?.map((u) => (
                <tr key={u._id} className="text-center border-t">
                  <td className="p-2">{u.name}</td>
                  <td>{u.email}</td>
                  <td className="font-semibold">{u.credits}</td>

                  <td className="p-2">
                    <div className="flex gap-2 justify-center">
                      <input
                        type="number"
                        placeholder="Amount"
                        value={creditInputs[u._id] || ""}
                        onChange={(e) =>
                          handleChange(u._id, e.target.value)
                        }
                        className="border px-2 py-1 w-24 rounded"
                      />

                      <button
                        onClick={() =>
                          handleUpdate(u._id, "add")
                        }
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        +
                      </button>

                      <button
                        onClick={() =>
                          handleUpdate(u._id, "deduct")
                        }
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        -
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Users;