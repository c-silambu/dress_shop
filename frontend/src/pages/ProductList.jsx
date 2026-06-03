import React, { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import api from "../api/api";
import ProductCard from "../components/ProductCard";

export default function ProductList({ category }) {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(category || "");

  useEffect(() => {
    setSelectedCategory(category || "");
  }, [category]);

  useEffect(() => {
    api
      .get("/products", {
        params: {
          category: selectedCategory,
          search,
          status: "Active",
        },
      })
      .then((response) => setItems(response.data))
      .catch(() => setItems([]));
  }, [selectedCategory, search]);

  const filteredItems = useMemo(() => items, [items]);

  return (
    <section className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/75 p-8 shadow-2xl shadow-blue-950/10 backdrop-blur md:p-10">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-pink-400/20 blur-3xl" />
          <div className="absolute -bottom-20 left-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="relative">
            <p className="text-xs font-black uppercase tracking-[0.35em] text-blue-600">Women’s Styles</p>
            <h1 className="mt-3 text-4xl font-black text-slate-950 md:text-6xl">{category}</h1>
            <p className="mt-3 max-w-2xl text-slate-500">
              Search by product name and category. Admin uploaded images will show automatically.
            </p>
          </div>
        </div>

        <div className="sticky top-20 z-20 mt-8 grid gap-3 rounded-[2rem] border border-blue-100 bg-white/90 p-4 shadow-xl shadow-blue-950/5 backdrop-blur md:grid-cols-[1fr_260px]">
          <label className="relative block">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-500" />
            <input
              className="input pl-12"
              placeholder="Search product name"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <label className="relative block">
            <SlidersHorizontal className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-500" />
            <select className="input pl-12" value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
              <option value="">All Categories</option>
              <option value="Women’s Dress">Women’s Dress</option>
              <option value="Jewellery">Jewellery</option>
            </select>
          </label>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredItems.map((product) => (
            <ProductCard key={product._id} p={product} />
          ))}
        </div>

        {!filteredItems.length && (
          <div className="mx-auto mt-14 max-w-xl rounded-[2rem] border border-blue-100 bg-white p-10 text-center shadow-xl shadow-blue-950/5">
            <p className="text-2xl font-black text-slate-900">No products found</p>
            <p className="mt-3 text-slate-500">Admin panel-la products add pannunga machi.</p>
          </div>
        )}
      </div>
    </section>
  );
}
