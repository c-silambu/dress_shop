import React, { useEffect, useMemo, useState } from "react";
import { ImagePlus, Pencil, Search, SlidersHorizontal, Trash2, X } from "lucide-react";
import api, { imgUrl } from "../../api/api";

const initialForm = { mainCategory: "Women's Dress", status: "Active" };

export default function AdminProducts() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [filterSub, setFilterSub] = useState("");
  const [preview, setPreview] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const loadProducts = () =>
    api.get("/products").then((r) => setItems(r.data)).catch(() => setItems([]));

  useEffect(() => { loadProducts(); }, []);

  // Reset subCategory when category changes
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

  // Dynamic subCategory options based on selected category
  const subOptions = useMemo(() => {
    if (!filterCat) return [];
    return [...new Set(
      items
        .filter((p) => filterCat === "Jewellery" ? p.mainCategory?.toLowerCase().includes("jewellery") : p.mainCategory?.toLowerCase().includes("dress"))
        .map((p) => p.subCategory)
        .filter(Boolean)
    )];
  }, [filterCat, items]);

  const filtered = useMemo(() => items.filter((p) => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat
      ? filterCat === "Jewellery"
        ? p.mainCategory?.toLowerCase().includes("jewellery")
        : p.mainCategory?.toLowerCase().includes("dress")
      : true;
    const matchSub = filterSub ? p.subCategory?.toLowerCase() === filterSub.toLowerCase() : true;
    return matchSearch && matchCat && matchSub;
  }), [items, search, filterCat, filterSub]);

  return (
    <section>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between rounded-[2rem] bg-gradient-to-br from-blue-700 to-blue-950 p-6 text-white shadow-2xl shadow-blue-950/20">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.35em] text-blue-200">Inventory</p>
          <h1 className="mt-1 text-3xl font-black md:text-5xl">Product Manager</h1>
        </div>
        <button
          onClick={() => { setForm(initialForm); setPreview([]); setShowForm((v) => !v); }}
          className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-black text-blue-700 shadow-lg transition hover:-translate-y-0.5"
        >
          <ImagePlus className="h-4 w-4" /> {showForm ? "Close" : "Add Product"}
        </button>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <form onSubmit={saveProduct} className="mb-6 rounded-[2rem] border border-blue-100 bg-white p-6 shadow-xl shadow-blue-950/5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900">{form._id ? "Update Product" : "Add New Product"}</h2>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {[["name","Product name"],["subCategory","Sub category"],["price","Price"],["discountPrice","Discount price"],["sizes","Sizes (comma separated)"],["colors","Colors (comma separated)"],["stock","Stock"]].map(([field, label]) => (
              <input key={field} name={field} value={form[field] || ""} onChange={handleChange}
                placeholder={label} className="input" required={["name","price"].includes(field)} />
            ))}
            <select name="mainCategory" value={form.mainCategory} onChange={handleChange} className="input">
              <option value="Women's Dress">Women's Dress</option>
              <option value="Jewellery">Jewellery</option>
            </select>
            <select name="status" value={form.status} onChange={handleChange} className="input">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <input type="file" multiple onChange={handleFiles} className="input" />
          </div>
          <textarea name="about" value={form.about || ""} onChange={handleChange} placeholder="About product" className="input mt-3" />
          <textarea name="description" value={form.description || ""} onChange={handleChange} placeholder="Description" className="input mt-3" />
          {!!preview.length && (
            <div className="mt-4 flex flex-wrap gap-2">
              {preview.map((src) => (
                <img key={src} src={src.startsWith("blob:") || src.startsWith("http") ? src : imgUrl(src)}
                  alt="preview" className="h-20 w-20 rounded-2xl object-cover ring-2 ring-blue-100" />
              ))}
            </div>
          )}
          <button className="btn-primary mt-4">{form._id ? "Update Product" : "Add Product"}</button>
        </form>
      )}

      {/* Search + Filter */}
      <div className="mb-4 rounded-[2rem] border border-blue-100 bg-white p-4 shadow-xl shadow-blue-950/5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-blue-950">All Products</h2>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-black text-blue-600">{filtered.length}</span>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..." className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-400 focus:bg-white" />
            </div>
            <div className="relative">
              <SlidersHorizontal className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-400 focus:bg-white">
                <option value="">All</option>
                <option value="Women's Dress">Dress</option>
                <option value="Jewellery">Jewellery</option>
              </select>
            </div>
          </div>
        </div>

        {/* SubCategory chips */}
        {subOptions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => setFilterSub("")}
              className={`rounded-full px-3 py-1 text-xs font-black transition ${filterSub === "" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600"}`}
            >All</button>
            {subOptions.map((opt) => (
              <button key={opt} onClick={() => setFilterSub(opt)}
                className={`rounded-full px-3 py-1 text-xs font-black transition ${filterSub === opt ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600"}`}
              >{opt}</button>
            ))}
          </div>
        )}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        {filtered.map((product) => (
          <div key={product._id} className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-md transition hover:shadow-lg">
            <div className="relative">
              <img src={imgUrl(product.images?.[0])} alt={product.name} className="h-40 w-full object-cover" />
              <span className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-black ${product.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                {product.status}
              </span>
            </div>
            <div className="p-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">{product.subCategory || product.mainCategory}</p>
              <h3 className="mt-0.5 truncate text-sm font-black text-slate-900">{product.name}</h3>
              <p className="mt-1 text-base font-black text-blue-700">₹{product.discountPrice || product.price}</p>
              {product.discountPrice && <p className="text-xs text-slate-400 line-through">₹{product.price}</p>}
              <div className="mt-2 flex gap-1.5">
                <button onClick={() => editProduct(product)} className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-blue-50 py-1.5 text-xs font-black text-blue-700 hover:bg-blue-100">
                  <Pencil className="h-3 w-3" /> Edit
                </button>
                <button onClick={() => deleteProduct(product._id)} className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-red-50 py-1.5 text-xs font-black text-red-600 hover:bg-red-100">
                  <Trash2 className="h-3 w-3" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!filtered.length && (
        <div className="mt-16 text-center text-slate-400">
          <Search className="mx-auto h-10 w-10" />
          <p className="mt-3 font-black">No products found</p>
        </div>
      )}
    </section>
  );
}
