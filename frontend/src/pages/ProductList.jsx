import React, { useEffect, useMemo, useState } from "react";
import { Search, Sparkles, X } from "lucide-react";
import api from "../api/api";
import ProductCard from "../components/ProductCard";
import ProductLoader from "../Productlode/ProductLoader";

export default function ProductList({ category }) {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(category || "");
  const [subCategory, setSubCategory] = useState("");
  const [subOptions, setSubOptions] = useState([]);
  const [loading, setLoading] = useState(true);

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
    setLoading(true);

    const timer = setTimeout(() => {
      api
        .get("/products", {
          params: {
            category: selectedCategory || undefined,
            status: "Active",
          },
        })
        .then((r) => setItems(r.data))
        .catch(() => setItems([]))
        .finally(() => setLoading(false));
    }, 2000);

    return () => clearTimeout(timer);
  }, [selectedCategory]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        !search ||
        item.name?.toLowerCase().includes(search.toLowerCase().trim());

      const matchSubCategory =
        !subCategory || normalize(item.subCategory) === normalize(subCategory);

      return matchSearch && matchSubCategory;
    });
  }, [items, search, subCategory]);

  if (loading) {
    return <ProductLoader />;
  }

  return (
    <section className="page-shell mb-20">
      <div className="relative overflow-hidden border-b border-[#e9e0d7] bg-[#fffaf3]">
        <div className="absolute inset-0 opacity-80">
          <div className="absolute left-[-8rem] top-[-8rem] h-72 w-72 rounded-full bg-[#a91d4b]/10 blur-3xl" />
          <div className="absolute bottom-[-10rem] right-[-6rem] h-80 w-80 rounded-full bg-[#324414]/12 blur-3xl" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#b68a35]/40 to-transparent" />
        </div>

        <div className="section-wrap relative py-7 md:py-10">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 border border-[#e9e0d7] bg-white/80 px-3.5 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-[#324414] shadow-sm backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-[#b68a35]" />
              Women's Styles
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight text-[#15120f] md:text-5xl">
              {category || "All Products"}
            </h1>

            <p className="mx-auto mt-2 max-w-2xl text-sm font-medium leading-6 text-[#756f66]">
              Find fresh picks, occasion-ready outfits, and favourite styles.
            </p>
          </div>

          <div className="mx-auto mt-6 max-w-2xl">
            <div className="flex flex-col gap-2 rounded-[1.75rem] border border-[#e6d9cf] bg-white/95 p-2 shadow-[0_16px_42px_rgba(21,18,15,0.10)] backdrop-blur md:flex-row md:items-center">
              <div className="relative flex-1">
                <span className="pointer-events-none absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#f7eee8] text-[#a91d4b]">
                  <Search className="h-4 w-4" />
                </span>

                <input
                  className="h-12 w-full rounded-[1.25rem] border-0 bg-transparent py-0 pl-14 pr-10 text-sm font-semibold leading-[3rem] text-[#15120f] outline-none placeholder:text-[#948b82]"
                  placeholder="Search dresses, jewellery, kurtis..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#756f66] transition hover:bg-[#f7f0e8] hover:text-[#a91d4b]"
                    title="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex h-11 items-center justify-center gap-2 rounded-[1.1rem] bg-[#15120f] px-4 text-white md:min-w-32">
                <span className="text-lg font-black leading-none">
                  {filteredItems.length}
                </span>
                <span className="text-[9px] font-black uppercase leading-none tracking-[0.16em] text-white/75">
                  Styles Found
                </span>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.16em] text-[#756f66]">
              {["Best Deals", "Quick Delivery", "Curated Picks"].map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#eadfd5] bg-white/70 px-3 py-1.5"
                >
                  <Sparkles className="h-3 w-3 text-[#b68a35]" />
                  {label}
                </span>
              ))}
            </div>
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
