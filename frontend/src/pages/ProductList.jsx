import React, { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import api from "../api/api";
import ProductCard from "../components/ProductCard";

export default function ProductList({ category }) {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(category || "");

  useEffect(() => { setSelectedCategory(category || ""); }, [category]);

  useEffect(() => {
    api.get("/products", { params: { category: selectedCategory, search, status: "Active" } })
      .then((r) => setItems(r.data))
      .catch(() => setItems([]));
  }, [selectedCategory, search]);

  const filteredItems = useMemo(() => items, [items]);

  return (
    <section className="min-h-screen bg-slate-50 pb-24 md:pb-0">
      {/* Page header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-4 py-8 md:py-14">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.4em] text-blue-200">Women's Styles</p>
          <h1 className="mt-1 text-3xl font-black text-white md:text-6xl">{category || "All Products"}</h1>
          <p className="mt-2 text-sm text-blue-100">{filteredItems.length} products found</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4">
        {/* Compact filter bar */}
        <div className="sticky top-[57px] z-20 -mx-4 flex items-center gap-2 border-b border-slate-200 bg-white/98 px-4 py-2.5 backdrop-blur md:top-[61px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-8 pr-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="relative">
            <SlidersHorizontal className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <select
              className="rounded-xl border border-slate-200 bg-slate-50 py-2 pl-8 pr-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All</option>
              <option value="Women's Dress">Dress</option>
              <option value="Jewellery">Jewellery</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="mt-4 grid grid-cols-2 gap-3 md:mt-6 md:gap-5 lg:grid-cols-4">
          {filteredItems.map((product) => <ProductCard key={product._id} p={product} />)}
        </div>

        {!filteredItems.length && (
          <div className="mt-16 text-center">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-blue-50 p-4 text-blue-400">
              <Search className="h-full w-full" />
            </div>
            <p className="mt-4 text-lg font-black text-slate-700">No products found</p>
            <p className="mt-1 text-sm text-slate-400">Admin panel-la products add pannunga.</p>
          </div>
        )}
      </div>
    </section>
  );
}
