import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {  AnimatePresence } from "framer-motion";
import { adminAPI } from "../../api/axios";
import {
  Upload, X, Loader2, Check, AlertCircle, ArrowLeft,
  Package, DollarSign, Tag, Box, Image as ImageIcon,
  Sparkles, Info, RefreshCcw
} from "lucide-react";

export default function AdminEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState(null);
  const [imageChanged, setImageChanged] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: null
  });

  const categories = ["Educational Toy", "Outdoor", "Action", "Vehicle"];

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await adminAPI.get(`/admin/products/${id}`);
      if (response.data.success) {
        const product = response.data.product;
        setFormData({
          name: product.name || "",
          description: product.description || "",
          price: product.price?.toString() || "",
          category: product.category || "",
          stock: product.stock?.toString() || "0",
          image: null
        });
        
        if (product.image) {
          const imageUrl = product.image.startsWith('http') 
            ? product.image 
            : `http://localhost:5000${product.image}`;
          setPreview(imageUrl);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setImageChanged(true);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setPreview(null);
    setImageChanged(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'image') {
        if (imageChanged && formData.image) formDataToSend.append("image", formData.image);
      } else {
        formDataToSend.append(key, formData[key] || (key === 'stock' ? 0 : ''));
      }
    });

    setSaving(true);
    try {
      const response = await adminAPI.put(`/admin/products/${id}`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => navigate("/admin/products"), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0B0F1A]">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mb-4" />
        <p className="text-slate-500 font-serif italic">Retrieving artifact details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-slate-200 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <button 
            onClick={() => navigate("/admin/products")}
            className="flex items-center text-indigo-400 text-xs font-black uppercase tracking-widest mb-4 hover:text-indigo-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Return to Inventory
          </button>
          <h1 className="text-3xl font-serif font-bold text-white tracking-tight">Refine Masterpiece</h1>
          <p className="text-slate-500 mt-1">Editing: <span className="text-indigo-400 font-medium">{formData.name}</span></p>
        </motion.div>

        <AnimatePresence>
          {success && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-6 py-3 rounded-2xl flex items-center gap-3"
            >
              <Check className="w-5 h-5" />
              <span className="text-sm font-bold uppercase tracking-wider">Product Records Updated</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[#151B2C] border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl flex items-center gap-3 text-sm font-medium">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
                </div>
              )}

              {/* Name */}
              <div className="space-y-3">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Product Designation</label>
                <div className="relative group">
                  <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="text" name="name" value={formData.name} onChange={handleChange}
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">The Narrative</label>
                <textarea
                  name="description" value={formData.description} onChange={handleChange} rows={4}
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all resize-none"
                />
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Valuation (USD)</label>
                  <div className="relative group">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      type="number" name="price" value={formData.price} onChange={handleChange} step="0.01"
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Available Reserve</label>
                  <div className="relative group">
                    <Box className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-amber-500 transition-colors" />
                    <input
                      type="number" name="stock" value={formData.stock} onChange={handleChange}
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/5 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="space-y-4">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Categorization</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat} type="button"
                      onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
                      className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${
                        formData.category === cat
                          ? "bg-indigo-500/10 border-indigo-500 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.1)]"
                          : "bg-slate-900/50 border-slate-800 text-slate-500 hover:border-slate-700"
                      }`}
                    >
                      <Tag className="w-5 h-5" />
                      <span className="text-[10px] font-bold uppercase tracking-tighter">{cat}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4 border-t border-slate-800/50">
                <button
                  type="submit" disabled={saving}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
                  {saving ? "Updating Records..." : "Save Changes"}
                </button>
                <button
                  type="button" onClick={() => navigate("/admin/products")}
                  className="px-8 py-4 border border-slate-800 rounded-2xl text-slate-400 font-bold uppercase tracking-widest text-xs hover:bg-slate-800 transition-all"
                >
                  Discard
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="bg-[#151B2C] border border-slate-800 rounded-[2.5rem] p-6 sticky top-8"
          >
            <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-indigo-400" /> Visual Identity
            </h3>

            {preview ? (
              <div className="relative group rounded-3xl overflow-hidden border border-slate-700">
                <img src={preview} alt="Preview" className="w-full aspect-square object-cover" />
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={removeImage} className="p-3 bg-rose-500 text-white rounded-full hover:scale-110 transition-transform shadow-xl">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {!imageChanged && (
                  <div className="absolute bottom-4 left-4 px-3 py-1 bg-indigo-600 text-[10px] font-black uppercase tracking-widest text-white rounded-full shadow-lg">
                    Current Master
                  </div>
                )}
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-slate-800 rounded-3xl hover:border-indigo-500/50 hover:bg-indigo-500/5 cursor-pointer transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-slate-600 group-hover:text-indigo-500 transition-colors" />
                </div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Update Image</p>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}

            {/* Summary Card */}
            <div className="mt-8 p-5 bg-slate-900/50 rounded-2xl border border-slate-800/50">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Live Statistics</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-slate-500 uppercase font-bold tracking-tight">Status</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${Number(formData.stock) > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                    {Number(formData.stock) > 0 ? 'In Stock' : 'Depleted'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-slate-500 uppercase font-bold tracking-tight">Valuation</span>
                  <span className="text-white font-serif italic">${Number(formData.price || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-slate-500 uppercase font-bold tracking-tight">Category</span>
                  <span className="text-indigo-400 text-[11px] font-bold">{formData.category || "—"}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-start gap-3 p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
              <Info className="w-4 h-4 text-indigo-400 mt-0.5" />
              <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                Ensure all product attributes are meticulously reviewed before saving. Changes will be visible to patrons immediately.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}