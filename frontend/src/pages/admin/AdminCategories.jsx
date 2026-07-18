import React, { useEffect, useMemo, useState } from "react";
import { Layers3, Plus, Trash2 } from "lucide-react";
import api from "../../api/api";

const emptyForm = { name: "", type: "main", parent: "" };

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => api.get("/store/admin/catalog").then(({ data }) => setCategories(data.categories || []));
  useEffect(() => { load().catch((error) => setMessage(error.response?.data?.message || "Unable to load categories")); }, []);

  const mainCategories = useMemo(() => categories.filter((category) => !category.parent), [categories]);

  const submit = async (event) => {
    event.preventDefault();
    if (form.type === "sub" && !form.parent) return setMessage("Select a parent category");
    setSaving(true);
    setMessage("");
    try {
      await api.post("/store/admin/categories", { name: form.name, parent: form.type === "main" ? "" : form.parent });
      setForm(emptyForm);
      setMessage("Category added successfully");
      await load();
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to add category");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this category?")) return;
    try { await api.delete(`/store/admin/categories/${id}`); await load(); }
    catch (error) { setMessage(error.response?.data?.message || "Unable to delete category"); }
  };

  const field = "w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-bold text-white outline-none";

  return <div className="space-y-6 pb-20">
    <div><p className="text-xs font-black uppercase tracking-[.2em] text-[#d6b36a]">Product setup</p><h1 className="mt-2 text-3xl font-black">Categories</h1><p className="mt-2 text-sm text-white/45">Create the main category first, then add its subcategories.</p></div>
    <form onSubmit={submit} className="grid gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-5 md:grid-cols-2">
      <label className="text-xs font-black uppercase tracking-wider text-white/55">Category type<select className={`${field} mt-2`} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value, parent: "" })}><option className="bg-[#15120f]" value="main">Main category</option><option className="bg-[#15120f]" value="sub">Subcategory</option></select></label>
      <label className="text-xs font-black uppercase tracking-wider text-white/55">Category name<input className={`${field} mt-2`} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={form.type === "main" ? "e.g. Women's Dress" : "e.g. Shift Dress"} required /></label>
      {form.type === "sub" && <label className="text-xs font-black uppercase tracking-wider text-white/55 md:col-span-2">Parent category<select className={`${field} mt-2`} value={form.parent} onChange={(e) => setForm({ ...form, parent: e.target.value })} required><option className="bg-[#15120f]" value="">Select parent category</option>{mainCategories.map((category) => <option className="bg-[#15120f]" key={category._id} value={category.name}>{category.name}</option>)}</select></label>}
      {message && <p className="text-sm font-bold text-[#f2d58e] md:col-span-2">{message}</p>}
      <button disabled={saving} className="btn-primary w-fit disabled:opacity-50"><Plus size={17}/>{saving ? "Adding..." : "Add category"}</button>
    </form>
    <div className="space-y-4">{mainCategories.map((main) => <section key={main._id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><div className="flex items-center justify-between"><h2 className="flex items-center gap-2 text-lg font-black"><Layers3 size={18} className="text-[#d6b36a]"/>{main.name}</h2><button onClick={() => remove(main._id)} className="text-red-300"><Trash2 size={16}/></button></div><div className="mt-4 flex flex-wrap gap-2">{categories.filter((item) => item.parent === main.name).map((sub) => <span key={sub._id} className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs font-bold">{sub.name}<button onClick={() => remove(sub._id)} className="text-red-300"><Trash2 size={13}/></button></span>)}{!categories.some((item) => item.parent === main.name) && <span className="text-xs text-white/35">No subcategories yet</span>}</div></section>)}</div>
  </div>;
}
