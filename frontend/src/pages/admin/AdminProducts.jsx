import React, { useEffect, useState } from "react";
import { ImagePlus, Pencil, Search, Trash2 } from "lucide-react";
import api, { imgUrl } from "../../api/api";

const initialForm = {
  mainCategory: "Women’s Dress",
  status: "Active",
};

export default function AdminProducts() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState("");
  const [preview, setPreview] = useState([]);

  const loadProducts = () => api.get("/products").then((response) => setItems(response.data)).catch(() => setItems([]));

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleFiles = (event) => {
    const nextFiles = event.target.files;
    setFiles(nextFiles);
    setPreview(Array.from(nextFiles).map((file) => URL.createObjectURL(file)));
  };

  const saveProduct = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    Array.from(files).forEach((file) => formData.append("images", file));

    if (form._id) {
      await api.put(`/products/${form._id}`, formData);
    } else {
      await api.post("/products", formData);
    }

    setForm(initialForm);
    setFiles([]);
    setPreview([]);
    loadProducts();
  };

  const editProduct = (product) => {
    setForm({ ...product, sizes: product.sizes?.join(", "), colors: product.colors?.join(", ") });
    setPreview(product.images || []);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProduct = async (id) => {
    if (confirm("Delete this product?")) {
      await api.delete(`/products/${id}`);
      loadProducts();
    }
  };

  const filtered = items.filter((product) => product.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <section>
      <div className="mb-8 rounded-[2rem] bg-gradient-to-br from-blue-700 to-blue-950 p-8 text-white shadow-2xl shadow-blue-950/20">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-blue-200">Inventory</p>
        <h1 className="mt-3 text-4xl font-black md:text-6xl">Product Manager</h1>
        <p className="mt-3 text-blue-100">Add, edit and manage women’s dress and jewellery products.</p>
      </div>

      <form onSubmit={saveProduct} className="mb-8 rounded-[2rem] border border-blue-100 bg-white p-6 shadow-xl shadow-blue-950/5">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl bg-blue-50 p-4 text-blue-700"><ImagePlus /></div>
          <div>
            <h2 className="text-2xl font-black text-slate-950">{form._id ? "Update Product" : "Add New Product"}</h2>
            <p className="text-slate-500">Image preview, category, stock and price details.</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["name", "Product name"],
            ["subCategory", "Sub category"],
            ["price", "Price"],
            ["discountPrice", "Discount price"],
            ["sizes", "Sizes comma separated"],
            ["colors", "Colors comma separated"],
            ["stock", "Stock"],
          ].map(([field, label]) => (
            <input key={field} name={field} value={form[field] || ""} onChange={handleChange} placeholder={label} className="input" required={["name", "price"].includes(field)} />
          ))}
          <select name="mainCategory" value={form.mainCategory} onChange={handleChange} className="input">
            <option value="Women’s Dress">Women’s Dress</option>
            <option value="Jewellery">Jewellery</option>
          </select>
          <select name="status" value={form.status} onChange={handleChange} className="input">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <input type="file" multiple onChange={handleFiles} className="input" />
        </div>

        <textarea name="about" value={form.about || ""} onChange={handleChange} placeholder="About product" className="input mt-4" />
        <textarea name="description" value={form.description || ""} onChange={handleChange} placeholder="Description" className="input mt-4" />

        {!!preview.length && (
          <div className="mt-5 flex flex-wrap gap-3">
            {preview.map((src) => (
              <img key={src} src={src.startsWith("blob:") || src.startsWith("http") ? src : imgUrl(src)} alt="Preview" className="h-24 w-24 rounded-2xl object-cover ring-2 ring-blue-100" />
            ))}
          </div>
        )}

        <button className="btn-primary mt-5">{form._id ? "Update Product" : "Add Product"}</button>
      </form>

      <div className="mb-6 flex flex-col gap-3 rounded-[2rem] border border-blue-100 bg-white p-4 shadow-xl shadow-blue-950/5 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-black text-blue-950">All Products</h2>
        <label className="relative block md:w-80">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-500" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" className="input pl-12" />
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((product) => (
          <div key={product._id} className="overflow-hidden rounded-[2rem] border border-blue-100 bg-white shadow-xl shadow-blue-950/5">
            <img src={imgUrl(product.images?.[0])} alt={product.name} className="h-56 w-full object-cover" />
            <div className="p-5">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-600">{product.mainCategory}</p>
              <h3 className="mt-2 text-2xl font-black text-blue-950">{product.name}</h3>
              <p className="mt-1 font-bold text-slate-500">{product.subCategory}</p>
              <p className="mt-3 text-2xl font-black text-blue-700">₹{product.discountPrice || product.price}</p>
              <div className="mt-4 flex gap-2">
                <button onClick={() => editProduct(product)} className="btn-soft flex items-center gap-2"><Pencil className="h-4 w-4" /> Edit</button>
                <button onClick={() => deleteProduct(product._id)} className="rounded-full bg-red-50 px-5 py-3 font-black text-red-600 transition hover:bg-red-100"><Trash2 className="inline h-4 w-4" /> Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
