import React, { useEffect, useState } from "react";
import api from "../../api/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/admin/users").then((response) => setUsers(response.data));
  }, []);

  return (
    <>
      <h1 className="mb-6 text-4xl font-black text-blue-900">Users</h1>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-3xl bg-white shadow md:block">
        <table className="w-full">
          <thead className="bg-blue-100 text-left text-blue-900">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t border-blue-50">
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">{user.phone}</td>
                <td className="p-4">{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="grid gap-4 md:hidden">
        {users.map((user) => (
          <div key={user._id} className="rounded-3xl border border-blue-100 bg-white p-4 shadow">
            <p className="text-lg font-black text-blue-950">{user.name}</p>
            <p className="mt-1 text-sm text-slate-600">{user.email}</p>
            <p className="mt-1 text-sm text-slate-600">{user.phone}</p>
            <p className="mt-1 text-xs text-slate-400">{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </>
  );
}
