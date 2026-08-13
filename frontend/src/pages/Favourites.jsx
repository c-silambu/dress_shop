import React, { useEffect, useState } from "react";
import api from "../api/api";
import ProductCard from "../components/ProductCard";
import { useToast } from "../context/ToastContext";

export default function Favourites() {
  const [items, setItems] = useState([]);
  const toast = useToast();

  useEffect(() => {
    api.get("/favourites")
      .then((response) => setItems(response.data))
      .catch((error) => {
        if (error.response?.status !== 401) {
          toast.error(error.response?.data?.message || "Unable to load favourites");
        }
      });
  }, [toast]);

  return (
    <section className="page-shell">
      <div className="border-b border-[#e9e0d7] bg-white">
        <div className="section-wrap py-10 md:py-14">
          <p className="editorial-kicker">Wishlist</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-[#15120f] md:text-5xl">Favourites</h1>
          <p className="mt-2 text-sm text-[#756f66]">{items.length} saved item{items.length !== 1 ? "s" : ""}</p>
        </div>
      </div>
      <div className="section-wrap grid grid-cols-2 gap-x-4 gap-y-10 py-8 md:grid-cols-3 md:gap-x-8 lg:grid-cols-4">
        {items.map((item) => item.product && <ProductCard key={item._id} p={item.product} />)}
      </div>
    </section>
  );
}
