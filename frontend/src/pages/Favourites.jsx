import React, { useEffect, useState } from "react";
import api from "../api/api";
import ProductCard from "../components/ProductCard";

export default function Favourites() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/favourites").then((response) => setItems(response.data));
  }, []);

  return (
    <section className="mx-auto max-w-7xl p-4 py-10">
      <h1 className="mb-6 text-4xl font-black text-blue-900">Favourites</h1>
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => item.product && <ProductCard key={item._id} p={item.product} />)}
      </div>
    </section>
  );
}
