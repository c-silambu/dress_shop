import React, { useEffect, useMemo, useState } from "react";
import { ImagePlus, Pencil, Search, SlidersHorizontal, Trash2, X, Sparkles, Package } from "lucide-react";
import api, { imgUrl } from "../../api/api";

const initialForm = { mainCategory: "", subCategory: "", sizes: "", colors: "", materialType: "", fabric: "", pattern: "", status: "Active", countryOfOrigin: "India", lowStockThreshold: 5, newArrival: true };
const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
const jewellerySizeOptions = ["4", "5", "6", "7", "8", "9", "10", "11", "12", "Free Size"];

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

function GlassInput({ as: Tag = "input", label, style: extraStyle = {}, ...props }) {
  return (
    <label className="block text-[10px] font-bold uppercase tracking-widest text-blue-300">
      {label}{props.required && <span className="text-red-300"> *</span>}
      <Tag
        style={{ ...inputStyle, ...extraStyle, marginTop: ".4rem" }}
        onFocus={(e) => { e.target.style.border = "1px solid rgba(139,92,246,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.12)"; }}
        onBlur={(e) => { e.target.style.border = "1px solid rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
        {...props}
      />
    </label>
  );
}

export default function AdminProducts() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState([null, null, null]);
  const [imageUrls, setImageUrls] = useState(["", "", ""]);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [filterSub, setFilterSub] = useState("");
  const [preview, setPreview] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");

  const loadProducts = () => api.get("/products").then((r) => setItems(r.data)).catch(() => setItems([]));
  const loadCategories = () => api.get("/store/admin/catalog").then((r) => setCategories(r.data.categories || [])).catch(() => setCategories([]));
  useEffect(() => { loadProducts(); loadCategories(); }, []);
  useEffect(() => { setFilterSub(""); }, [filterCat]);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleFile = (index, file) => {
    if (!file) return;
    setMessage("");
    setFiles((current) => current.map((item, itemIndex) => itemIndex === index ? file : item));
    setPreview((current) => {
      const next = [...current];
      next[index] = URL.createObjectURL(file);
      return next;
    });
  };

  const toggleSize = (size) => {
    const selected = String(form.sizes || "").split(",").map((value) => value.trim()).filter(Boolean);
    const next = selected.includes(size) ? selected.filter((value) => value !== size) : [...selected, size];
    setForm((current) => ({ ...current, sizes: next.join(",") }));
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    const jewelleryProduct = /jewell?ery/i.test(form.mainCategory || "");
    const selectedSizes = String(form.sizes || "").split(",").map((value) => value.trim()).filter(Boolean);
    if (!selectedSizes.length) return setMessage(jewelleryProduct ? "Select a jewellery size or Free Size" : "Select at least one dress size");
    if (jewelleryProduct && !String(form.materialType || "").trim()) return setMessage("Material type is required for jewellery");
    if (!jewelleryProduct && !String(form.colors || "").trim()) return setMessage("At least one colour is required for dresses");
    if (!jewelleryProduct && (!String(form.fabric || "").trim() || !String(form.pattern || "").trim())) return setMessage("Fabric and pattern are required for dresses");
    if (!form._id && files.some((file, index) => !file && !imageUrls[index].trim())) return setMessage("Add a file or URL for Image 1, Image 2 and Image 3");
    setMessage("");
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    imageUrls.filter((url, index) => url.trim() && !files[index]).forEach((url) => fd.append("images", url.trim()));
    files.filter(Boolean).forEach((file) => fd.append("images", file));
    try {
      if (form._id) await api.put(`/products/${form._id}`, fd);
      else await api.post("/products", fd);
      setForm(initialForm); setFiles([null, null, null]); setImageUrls(["", "", ""]); setPreview([]); setShowForm(false);
      loadProducts();
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to save product");
    }
  };

  const editProduct = (p) => {
    setForm({ ...p, sizes: p.sizes?.join(", "), colors: p.colors?.join(", ") });
    setFiles([null, null, null]);
    setImageUrls(["", "", ""]);
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

  const mainCategories = useMemo(() => categories.filter((category) => !category.parent && category.active !== false), [categories]);
  const formSubCategories = useMemo(() => categories.filter((category) => category.parent === form.mainCategory && category.active !== false), [categories, form.mainCategory]);
  const isJewellery = /jewell?ery/i.test(form.mainCategory || "");

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
          onClick={() => { setForm(initialForm); setFiles([null, null, null]); setImageUrls(["", "", ""]); setPreview([]); setMessage(""); setShowForm((v) => !v); }}
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
            {message && <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm font-bold text-red-300">{message}</p>}
            {!mainCategories.length && <p className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm font-bold text-amber-200">Add a main category and its subcategories in Catalogue &amp; Offers before adding a product.</p>}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <GlassInput label="Product name" name="name" value={form.name || ""} onChange={handleChange} placeholder="Enter product name" required />
              <GlassInput label="Brand" name="brand" value={form.brand || ""} onChange={handleChange} placeholder="Enter brand name" required />
              <GlassInput label="Main category" as="select" name="mainCategory" value={form.mainCategory} onChange={(e) => setForm((current) => ({ ...current, mainCategory: e.target.value, subCategory: "", sizes: "", colors: "", fabric: "", pattern: "", materialType: "" }))} required>
                <option style={{ background: "#1a1040" }} value="">Select category</option>
                {mainCategories.map((category) => <option key={category._id} style={{ background: "#1a1040" }} value={category.name}>{category.name}</option>)}
              </GlassInput>
              <GlassInput label="Subcategory" as="select" name="subCategory" value={form.subCategory} onChange={handleChange} required disabled={!form.mainCategory}>
                <option style={{ background: "#1a1040" }} value="">Select subcategory</option>
                {formSubCategories.map((category) => <option key={category._id} style={{ background: "#1a1040" }} value={category.name}>{category.name}</option>)}
              </GlassInput>
              <GlassInput label="Actual price (₹)" name="price" type="number" min="0" step="0.01" value={form.price || ""} onChange={handleChange} placeholder="Enter actual price" required />
              <GlassInput label="Discount price (₹)" name="discountPrice" type="number" min="0" step="0.01" value={form.discountPrice || ""} onChange={handleChange} placeholder="Optional discounted price" />
              {!isJewellery && <GlassInput label="Available colours" name="colors" value={form.colors || ""} onChange={handleChange} placeholder="Red, Blue, Black" required />}
              {isJewellery && <GlassInput label="Material type" name="materialType" value={form.materialType || ""} onChange={handleChange} placeholder="Gold, Silver, Brass..." required />}
              {[["stock","Stock"],["lowStockThreshold","Low-stock alert"],...(!isJewellery ? [["fabric","Fabric"],["pattern","Pattern"]] : []),["countryOfOrigin","Country of origin"]].map(([field, label]) => (
                <GlassInput label={label} key={field} name={field} value={form[field] || ""} onChange={handleChange} placeholder={`Enter ${label.toLowerCase()}`} type={["stock","lowStockThreshold"].includes(field) ? "number" : "text"} required={["fabric","pattern"].includes(field)} />
              ))}
              <GlassInput label="Product status" as="select" name="status" value={form.status} onChange={handleChange}>
                <option style={{ background: "#1a1040" }} value="Active">Active</option>
                <option style={{ background: "#1a1040" }} value="Inactive">Inactive</option>
                <option style={{ background: "#1a1040" }} value="Draft">Draft</option>
              </GlassInput>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[0, 1, 2].map((index) => <div key={index}>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-blue-300">Image {index + 1}</label>
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => handleFile(index, e.target.files?.[0])} className="w-full text-xs text-white/50 file:mr-2 file:rounded-xl file:border-0 file:px-3 file:py-2 file:text-xs file:font-bold file:text-white" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "0.875rem", padding: "0.5rem" }} />
                <p className="my-2 text-[10px] font-black uppercase text-blue-300">Image {index + 1} URL (or upload file above)</p>
                <input type="url" value={imageUrls[index]} disabled={!!files[index]} onChange={(e) => { const next=[...imageUrls]; next[index]=e.target.value; setImageUrls(next); const previews=[...preview]; previews[index]=e.target.value; setPreview(previews); }} placeholder={`Image ${index + 1} URL`} className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2.5 text-xs text-white outline-none disabled:opacity-40" />
              </div>)}
            </div>
            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-blue-300">{isJewellery ? "Jewellery size / number" : "Available dress sizes"} <span className="text-red-300">*</span></label>
              <div className="flex flex-wrap gap-2">{(isJewellery ? jewellerySizeOptions : sizeOptions).map((size) => {
                const selected = String(form.sizes || "").split(",").includes(size);
                return <button key={size} type="button" onClick={() => toggleSize(size)} className={`rounded-xl border px-4 py-2 text-xs font-black ${selected ? "border-blue-400 bg-blue-500 text-white" : "border-white/10 bg-white/5 text-white/60"}`}>{size}</button>;
              })}</div>
            </div>
            <GlassInput label="About product" as="textarea" name="about" value={form.about || ""} onChange={handleChange} placeholder="Enter short product highlights" style={{ ...inputStyle, resize: "none" }} rows={3} required />
            <GlassInput label="Detailed description" as="textarea" name="description" value={form.description || ""} onChange={handleChange} placeholder="Enter complete product description" style={{ ...inputStyle, resize: "none" }} rows={4} required />
            {!isJewellery && <GlassInput label="Wash-care instructions" as="textarea" name="washCare" value={form.washCare || ""} onChange={handleChange} placeholder="Enter wash and care instructions" style={{ ...inputStyle, resize: "none" }} rows={2} />}
            <div className="flex flex-wrap gap-5">
              {[["featured","Featured"],["bestseller","Bestseller"],["newArrival","New arrival"]].map(([key,label]) => <label key={key} className="flex items-center gap-2 text-sm font-bold text-white/70"><input type="checkbox" checked={!!form[key]} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.checked }))} />{label}</label>)}
            </div>

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
            <label className="relative flex-1 pt-5 text-[10px] font-bold uppercase tracking-widest text-blue-300 sm:w-56">Search products
              <Search className="absolute bottom-3 left-3 h-4 w-4 text-white/30" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products…"
                className="w-full rounded-xl py-2.5 pl-9 pr-3 text-sm font-bold text-white outline-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
              />
            </label>
            <label className="relative pt-5 text-[10px] font-bold uppercase tracking-widest text-blue-300">Filter category
              <SlidersHorizontal className="absolute bottom-3 left-3 h-4 w-4 text-white/30" />
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
            </label>
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
