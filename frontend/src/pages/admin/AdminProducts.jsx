import React, { useEffect, useMemo, useState } from "react";
import { ImagePlus, Pencil, Search, SlidersHorizontal, Trash2, X, Sparkles, Package } from "lucide-react";
import api, { imgUrl } from "../../api/api";

const initialForm = { mainCategory: "Women's Dress", status: "Active" };

const inputStyle = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "0.875rem",
  padding: "0.75rem 1rem",
  color: "#fff",
  width: "100%",
  outline: "none",
  fontSize: "0.875rem",
  fontWeight: "600",
};

function GlassInput({ as: Tag = "input", style: extraStyle = {}, ...props }) {
  return (
    <Tag
      style={{ ...inputStyle, ...extraStyle }}
      onFocus={(e) => { e.target.style.border = "1px solid rgba(139,92,246,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.12)"; }}
      onBlur={(e) => { e.target.style.border = "1px solid rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
      {...props}
    />
  );
}

export default function AdminProducts() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [filterSub, setFilterSub] = useState("");
  const [preview, setPreview] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const loadProducts = () => api.get("/products").then((r) => setItems(r.data)).catch(() => setItems([]));
  useEffect(() => { loadProducts(); }, []);
  useEffect(() => { setFilterSub(""); }, [filterCat]);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleFiles = (e) => {
    setFiles(e.target.files);
    setPreview(Array.from(e.target.files).map((f) => URL.createObjectURL(f)));
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    Array.from(files).forEach((f) => fd.append("images", f));
    if (form._id) await api.put(`/products/${form._id}`, fd);
    else await api.post("/products", fd);
    setForm(initialForm); setFiles([]); setPreview([]); setShowForm(false);
    loadProducts();
  };

  const editProduct = (p) => {
    setForm({ ...p, sizes: p.sizes?.join(", "), colors: p.colors?.join(", ") });
    setPreview(p.images || []);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProduct = async (id) => {
    if (confirm("Delete this product?")) { await api.delete(`/products/${id}`); loadProducts(); }
  };

  const subOptions = useMemo(() => {
    if (!filterCat) return [];
    return [...new Set(items.filter((p) => filterCat === "Jewellery" ? p.mainCategory?.toLowerCase().includes("jewellery") : p.mainCategory?.toLowerCase().includes("dress")).map((p) => p.subCategory).filter(Boolean))];
  }, [filterCat, items]);

  const filtered = useMemo(() => items.filter((p) => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat ? (filterCat === "Jewellery" ? p.mainCategory?.toLowerCase().includes("jewellery") : p.mainCategory?.toLowerCase().includes("dress")) : true;
    const matchSub = filterSub ? p.subCategory?.toLowerCase() === filterSub.toLowerCase() : true;
    return matchSearch && matchCat && matchSub;
  }), [items, search, filterCat, filterSub]);

  const glassCard = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" };
  const glassSection = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "1.5rem", backdropFilter: "blur(20px)" };

  return (
    <div className="space-y-5 pb-24 lg:pb-8">

      {/* Header */}
      <div className="flex flex-col gap-4 rounded-3xl p-5 sm:flex-row sm:items-center sm:justify-between" style={{ background: "linear-gradient(135deg,rgba(59,130,246,0.2),rgba(6,182,212,0.1))", border: "1px solid rgba(59,130,246,0.25)" }}>
        <div>
          <div className="mb-1 inline-flex items-center gap-2 rounded-full px-3 py-1" style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.25)" }}>
            <Sparkles className="h-3 w-3 text-blue-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Inventory</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight sm:text-3xl">Product Manager</h1>
          <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>{items.length} products in store</p>
        </div>
        <button
          onClick={() => { setForm(initialForm); setPreview([]); setShowForm((v) => !v); }}
          className="flex items-center gap-2 self-start rounded-2xl px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 sm:self-auto"
          style={{ background: showForm ? "rgba(239,68,68,0.2)" : "linear-gradient(135deg,#3b82f6,#06b6d4)", border: showForm ? "1px solid rgba(239,68,68,0.3)" : "none", boxShadow: showForm ? "none" : "0 8px 20px rgba(59,130,246,0.3)" }}
        >
          {showForm ? <><X className="h-4 w-4" /> Close Form</> : <><ImagePlus className="h-4 w-4" /> Add Product</>}
        </button>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="rounded-3xl p-6" style={glassSection}>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-black text-white">{form._id ? "Update Product" : "Add New Product"}</h2>
            <button type="button" onClick={() => setShowForm(false)} className="flex h-8 w-8 items-center justify-center rounded-xl text-white/50 transition hover:text-white" style={{ background: "rgba(255,255,255,0.08)" }}>
              <X className="h-4 w-4" />
            </button>
          </div>
          <form onSubmit={saveProduct} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[["name","Product name"],["subCategory","Sub category"],["price","Price"],["discountPrice","Discount price"],["sizes","Sizes (comma separated)"],["colors","Colors (comma separated)"],["stock","Stock"]].map(([field, label]) => (
                <GlassInput key={field} name={field} value={form[field] || ""} onChange={handleChange} placeholder={label} required={["name","price"].includes(field)} />
              ))}
              <GlassInput as="select" name="mainCategory" value={form.mainCategory} onChange={handleChange}>
                <option style={{ background: "#1a1040" }} value="Women's Dress">Women's Dress</option>
                <option style={{ background: "#1a1040" }} value="Jewellery">Jewellery</option>
              </GlassInput>
              <GlassInput as="select" name="status" value={form.status} onChange={handleChange}>
                <option style={{ background: "#1a1040" }} value="Active">Active</option>
                <option style={{ background: "#1a1040" }} value="Inactive">Inactive</option>
              </GlassInput>
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-blue-300">Images</label>
                <input type="file" multiple onChange={handleFiles} className="w-full text-xs text-white/50 file:mr-3 file:rounded-xl file:border-0 file:px-3 file:py-2 file:text-xs file:font-bold file:text-white" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "0.875rem", padding: "0.5rem" }} />
              </div>
            </div>
            <GlassInput as="textarea" name="about" value={form.about || ""} onChange={handleChange} placeholder="About product" style={{ ...inputStyle, resize: "none" }} rows={2} />
            <GlassInput as="textarea" name="description" value={form.description || ""} onChange={handleChange} placeholder="Description" style={{ ...inputStyle, resize: "none" }} rows={2} />

            {!!preview.length && (
              <div className="flex flex-wrap gap-2">
                {preview.map((src) => (
                  <img key={src} src={src.startsWith("blob:") || src.startsWith("http") ? src : imgUrl(src)} alt="preview" className="h-20 w-20 rounded-2xl object-cover" style={{ border: "1px solid rgba(255,255,255,0.1)" }} />
                ))}
              </div>
            )}

            <button type="submit" className="rounded-2xl px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5" style={{ background: "linear-gradient(135deg,#3b82f6,#06b6d4)", boxShadow: "0 8px 20px rgba(59,130,246,0.3)" }}>
              {form._id ? "Update Product" : "Add Product"}
            </button>
          </form>
        </div>
      )}

      {/* Search + Filter */}
      <div className="rounded-3xl p-4" style={glassSection}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-white">All Products</h2>
            <span className="rounded-full px-2.5 py-0.5 text-xs font-black text-blue-300" style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.2)" }}>{filtered.length}</span>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1 sm:w-56">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products…"
                className="w-full rounded-xl py-2.5 pl-9 pr-3 text-sm font-bold text-white outline-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
              />
            </div>
            <div className="relative">
              <SlidersHorizontal className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <select
                value={filterCat}
                onChange={(e) => setFilterCat(e.target.value)}
                className="rounded-xl py-2.5 pl-9 pr-3 text-sm font-bold text-white outline-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <option style={{ background: "#1a1040" }} value="">All</option>
                <option style={{ background: "#1a1040" }} value="Women's Dress">Dress</option>
                <option style={{ background: "#1a1040" }} value="Jewellery">Jewellery</option>
              </select>
            </div>
          </div>
        </div>

        {subOptions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={() => setFilterSub("")} className="rounded-full px-3 py-1 text-xs font-black transition" style={filterSub === "" ? { background: "linear-gradient(135deg,#3b82f6,#06b6d4)", color: "#fff" } : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}>All</button>
            {subOptions.map((opt) => (
              <button key={opt} onClick={() => setFilterSub(opt)} className="rounded-full px-3 py-1 text-xs font-black transition" style={filterSub === opt ? { background: "linear-gradient(135deg,#3b82f6,#06b6d4)", color: "#fff" } : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}>{opt}</button>
            ))}
          </div>
        )}
      </div>

      {/* Product Grid */}
      {filtered.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <div key={product._id} className="group overflow-hidden rounded-2xl transition-all duration-200 hover:-translate-y-1" style={glassCard}>
              <div className="relative overflow-hidden">
                {product.images?.[0] ? (
                  <img src={imgUrl(product.images[0])} alt={product.name} className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                ) : (
                  <div className="flex h-44 w-full items-center justify-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <Package className="h-10 w-10 text-white/20" />
                  </div>
                )}
                <span className="absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-black" style={product.status === "Active" ? { background: "rgba(16,185,129,0.25)", color: "#34d399", border: "1px solid rgba(16,185,129,0.3)" } : { background: "rgba(239,68,68,0.25)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)" }}>
                  {product.status}
                </span>
              </div>
              <div className="p-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">{product.subCategory || product.mainCategory}</p>
                <h3 className="mt-0.5 truncate text-sm font-black text-white">{product.name}</h3>
                <p className="mt-1 text-base font-black text-violet-300">₹{product.discountPrice || product.price}</p>
                {product.discountPrice && <p className="text-xs line-through" style={{ color: "rgba(255,255,255,0.25)" }}>₹{product.price}</p>}
                <div className="mt-3 flex gap-1.5">
                  <button onClick={() => editProduct(product)} className="flex flex-1 items-center justify-center gap-1 rounded-xl py-2 text-xs font-black transition hover:opacity-80" style={{ background: "rgba(59,130,246,0.2)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.25)" }}>
                    <Pencil className="h-3 w-3" /> Edit
                  </button>
                  <button onClick={() => deleteProduct(product._id)} className="flex flex-1 items-center justify-center gap-1 rounded-xl py-2 text-xs font-black transition hover:opacity-80" style={{ background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <Search className="mx-auto h-10 w-10 text-white/10" />
          <p className="mt-3 font-black" style={{ color: "rgba(255,255,255,0.2)" }}>No products found</p>
        </div>
      )}
    </div>
  );
}
