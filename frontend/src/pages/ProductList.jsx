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
    <section className="page-shell">
      <div className="border-b border-[#e9e0d7] bg-white">
        <div className="section-wrap py-10 text-center md:py-16">
          <p className="editorial-kicker">Women's Styles</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-[#15120f] md:text-6xl">
            {category || "All Products"}
          </h1>
          <p className="mt-3 text-sm font-medium text-[#756f66]">
            Showing {filteredItems.length} product{filteredItems.length !== 1 ? "s" : ""}
          </p>

          <div className="relative mx-auto mt-7 max-w-lg">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#756f66]" />
            <input
              className="input pl-11 pr-10 text-sm"
              placeholder="Search dresses or jewellery..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#756f66] hover:text-[#a91d4b]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="section-wrap">
        {subOptions.length > 0 && (
          <div className="sticky top-[74px] z-20 -mx-4 border-b border-[#e9e0d7] bg-[#fffdf9]/95 px-4 py-3 backdrop-blur">
            <div className="flex gap-2 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setSubCategory("")}
                className={`shrink-0 border px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] transition ${
                  subCategory === ""
                    ? "border-[#15120f] bg-[#15120f] text-white"
                    : "border-[#e9e0d7] bg-white text-[#756f66] hover:border-[#a91d4b] hover:text-[#a91d4b]"
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
                    className={`shrink-0 border px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] transition ${
                      normalize(subCategory) === normalizedOpt
                        ? "border-[#15120f] bg-[#15120f] text-white"
                        : "border-[#e9e0d7] bg-white text-[#756f66] hover:border-[#a91d4b] hover:text-[#a91d4b]"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:mt-12 md:gap-x-8 md:gap-y-14 lg:grid-cols-4">
          {filteredItems.map((product) => (
            <ProductCard key={product._id} p={product} />
          ))}
        </div>

        {!filteredItems.length && (
          <div className="mt-20 flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center border border-[#e9e0d7] bg-white text-[#a91d4b]">
              <Search className="h-7 w-7" />
            </div>

            <p className="mt-4 text-lg font-black text-[#15120f]">
              No products found
            </p>

            <p className="mt-1 text-sm text-[#756f66]">
              Try a different search or category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
