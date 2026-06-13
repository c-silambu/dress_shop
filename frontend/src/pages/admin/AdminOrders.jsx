import React, { useEffect, useState } from "react";
import api from "../../api/api";

const statuses = ["Order Placed", "Accepted", "Packed", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const loadOrders = () => api.get("/admin/orders").then((response) => setOrders(response.data));

  useEffect(() => {
    loadOrders();
    const timer = setInterval(loadOrders, 10000);
    return () => clearInterval(timer);
  }, []);

  const updateStatus = async (id, orderStatus) => {
    await api.put(`/admin/orders/${id}/status`, { orderStatus });
    loadOrders();
  };

  return (
    <>
      <h1 className="mb-6 text-4xl font-black text-blue-900">Orders</h1>
      <div className="grid gap-4">
        {orders.map((order) => (
          <div key={order._id} className="rounded-3xl bg-white p-5 shadow">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-bold text-blue-950">{order.user?.name || "User"}</h3>
                <p className="text-slate-600">₹{order.amount} • {order.paymentMethod}</p>
              </div>
              <select value={order.orderStatus} onChange={(event) => updateStatus(order._id, event.target.value)} className="input w-full sm:max-w-xs">
                {statuses.map((status) => <option key={status}>{status}</option>)}
              </select>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
