import React, { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import api from "../api/api";
import ProductCard from "../components/ProductCard";

export default function ProductList({ category }) {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(category || "");
  const [subCategory, setSubCategory] = useState("");
  const [subOptions, setSubOptions] = useState([]);

  const normalize = (value) => value?.toString().trim().toLowerCase() || "";

  useEffect(() => {
    setSelectedCategory(category || "");
    setSubCategory("");
  }, [category]);

  useEffect(() => {
    if (!selectedCategory) {
      setSubOptions([]);
      return;
    }

    api
      .get("/products", {
        params: {
          category: selectedCategory,
          status: "Active",
        },
      })
      .then((r) => {
        const options = [
          ...new Set(
            r.data
              .map((p) => p.subCategory)
              .filter(Boolean)
              .map((s) => s.toString().trim())
          ),
        ];

        setSubOptions(options);
      })
      .catch(() => setSubOptions([]));
  }, [selectedCategory]);

  useEffect(() => {
    api
      .get("/products", {
        params: {
          category: selectedCategory || undefined,
          status: "Active",
        },
      })
      .then((r) => setItems(r.data))
      .catch(() => setItems([]));
  }, [selectedCategory]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        !search ||
        item.name?.toLowerCase().includes(search.toLowerCase().trim());

      const matchSubCategory =
        !subCategory ||
        normalize(item.subCategory) === normalize(subCategory);

      return matchSearch && matchSubCategory;
    });
  }, [items, search, subCategory]);

  return (
    <section className="min-h-screen bg-[#f8f7ff] pb-24">
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 px-4 py-6 md:py-10">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-10 left-10 h-40 w-40 rounded-full bg-white/5" />

        <div className="relative mx-auto max-w-7xl">
          <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/80">
            Women's Styles
          </span>

          <h1 className="mt-2 text-3xl font-black text-white md:text-5xl">
            {category || "All Products"}
          </h1>

          <p className="mt-1 text-sm text-white/60">
            {filteredItems.length} products found
          </p>

          <div className="relative mt-4 max-w-xs">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              className="w-full rounded-2xl border-0 bg-white py-3 pl-11 pr-10 text-sm text-slate-700 shadow-lg outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-violet-400"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4">
        {subOptions.length > 0 && (
          <div className="sticky top-[57px] z-20 -mx-4 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:top-[61px]">
            <div className="flex gap-2 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setSubCategory("")}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-black tracking-wide transition-all duration-200 ${
                  subCategory === ""
                    ? "bg-violet-600 text-white shadow-md shadow-violet-300"
                    : "bg-slate-100 text-slate-500 hover:bg-violet-50 hover:text-violet-600"
                }`}
              >
                All
              </button>

              {subOptions.map((opt) => {
                const normalizedOpt = normalize(opt);

                return (
                  <button
                    key={opt}
                    onClick={() => setSubCategory(normalizedOpt)}
                    className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-black tracking-wide transition-all duration-200 ${
                      normalize(subCategory) === normalizedOpt
                        ? "bg-violet-600 text-white shadow-md shadow-violet-300"
                        : "bg-slate-100 text-slate-500 hover:bg-violet-50 hover:text-violet-600"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-5 grid grid-cols-2 gap-3 md:mt-6 md:gap-5 lg:grid-cols-4">
          {filteredItems.map((product) => (
            <ProductCard key={product._id} p={product} />
          ))}
        </div>

        {!filteredItems.length && (
          <div className="mt-20 flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-400">
              <Search className="h-7 w-7" />
            </div>

            <p className="mt-4 text-lg font-black text-slate-700">
              No products found
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Try a different search or category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}