import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, Tag, Truck, ShieldCheck, Sparkles } from "lucide-react";

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coupon, setCoupon] = useState("");
  const shippingCost = 5.00;

  const loadCart = async () => {
    setLoading(true);
    try {
      const res = await API.get("/user/cart");
      setCart(res.data.cart || []);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id) => {
    try {
      await API.delete(`/user/cart/remove/${id}`);
      loadCart();
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(id);
      return;
    }
    try {
      await API.put(`/user/cart/update/${id}`, { quantity: newQuantity });
      loadCart();
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const totalAmount = cart.reduce((sum, item) => {
    if (!item.product) return sum;
    return sum + item.product.price * item.quantity;
  }, 0);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFCFE] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="animate-pulse space-y-8">
            <div className="h-10 bg-slate-200 rounded-xl w-48"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-40 bg-white rounded-3xl border border-slate-100"></div>
                ))}
              </div>
              <div className="h-96 bg-white rounded-3xl border border-slate-100"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFCFE] pb-24">
      {/* SAME HEADER BACKGROUND AS WISHLIST */}
      <div className="h-64 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500 via-purple-500 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FBFCFE] to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-10">
        {/* Header Section */}
        <div className="mb-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-indigo-300 hover:text-white mb-8 transition-all font-medium group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Return to Gallery
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tight">Your Selection</h1>
              <p className="text-slate-400 mt-2 font-medium">Review and refine your curated pieces</p>
            </div>
            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
              <div className="p-3 bg-indigo-500 rounded-xl shadow-lg shadow-indigo-500/20">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-white">Subtotal</p>
                <p className="text-xl font-bold text-slate-500 leading-none">₹{totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-50 p-20 text-center max-w-3xl mx-auto">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-100">
              <ShoppingBag className="w-10 h-10 text-slate-300" strokeWidth={1.5} />
            </div>
            <h3 className="text-3xl font-serif text-slate-900 mb-4">Your bag is weightless</h3>
            <p className="text-slate-500 mb-10 max-w-sm mx-auto leading-relaxed font-medium">
              It seems you haven't added any pieces to your collection yet.
            </p>
            <button
              onClick={() => navigate("/products")}
              className="bg-slate-900 text-white font-bold py-4 px-10 rounded-2xl transition-all hover:bg-indigo-600 hover:scale-105 shadow-xl shadow-slate-200"
            >
              Discover Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-6 border-b border-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  <div className="col-span-6">Design Details</div>
                  <div className="col-span-3 text-center">Quantity</div>
                  <div className="col-span-3 text-right">Investment</div>
                </div>

                <div className="divide-y divide-slate-50">
                  {cart.map((item) => {
                    if (!item.product) return null;
                    return (
                      <div key={item.product._id} className="p-8 group hover:bg-slate-50/50 transition-colors">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                          {/* Product Info */}
                          <div className="md:col-span-6">
                            <div className="flex items-center gap-6">
                              <div className="relative w-24 h-32 flex-shrink-0 overflow-hidden rounded-2xl border border-slate-100">
                                 <img
                  src={item.product.image ? (item.product.image.startsWith('http') ? item.product.image : `https://playora-toys-backend.onrender.com${item.product.image}`) : "https://via.placeholder.com/400x500"}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  alt={item.product.name}
                />
                    
                              </div>
                              <div className="flex-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-1">{item.product.category || "Atelier"}</p>
                                <h3 className="text-lg font-bold text-slate-900 leading-tight mb-2">
                                  {item.product.name}
                                </h3>
                                <button 
                                  onClick={() => removeItem(item.product._id)}
                                  className="flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-600 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Remove Piece
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="md:col-span-3">
                            <div className="flex items-center justify-center bg-white border border-slate-200 rounded-2xl p-1 w-fit mx-auto shadow-sm">
                              <button
                                onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="text-sm font-bold w-10 text-center text-slate-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="md:col-span-3 text-right">
                            <p className="text-xl font-black text-slate-900">
                              ₹{(item.product.price * item.quantity).toLocaleString()}
                            </p>
                            {item.quantity > 1 && (
                              <p className="text-xs font-medium text-slate-400 mt-1">
                                ₹{item.product.price.toLocaleString()} / unit
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-50 p-8 sticky top-10">
                <div className="flex items-center gap-2 mb-8">
                  <Sparkles className="w-5 h-5 text-indigo-500" />
                  <h2 className="text-xl font-bold text-slate-900">Summary</h2>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-400">Selected Items ({totalItems})</span>
                    <span className="text-slate-900 font-bold">₹{totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Truck className="w-4 h-4" />
                      <span>Shipping</span>
                    </div>
                    <span className="text-slate-900 font-bold">₹{shippingCost.toFixed(2)}</span>
                  </div>
                  
                  {/* Coupon Area */}
                  <div className="pt-4 mt-4 border-t border-slate-50">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">
                      Promotional Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="CODE"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-bold placeholder:text-slate-300"
                      />
                      <button className="px-5 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-200 transition-all">
                        Apply
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 mb-8">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-1">Total Investment</p>
                      <p className="text-3xl font-black text-slate-900 tracking-tighter">
                        ₹{(totalAmount + shippingCost).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold mb-1">Inc. GST</p>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-slate-900 text-white font-bold py-5 rounded-[1.5rem] transition-all hover:bg-indigo-600 shadow-xl shadow-slate-200 flex items-center justify-center gap-3 group"
                >
                  Confirm Checkout
                  <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
                  <div className="flex items-center gap-3 text-slate-400">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    <span className="text-[11px] font-bold uppercase tracking-wider">Secure Encrypted Payment</span>
                  </div>
                  <div className="flex justify-between items-center px-2">
                    <div className="h-4 w-8 bg-slate-100 rounded"></div>
                    <div className="h-4 w-8 bg-slate-100 rounded"></div>
                    <div className="h-4 w-8 bg-slate-100 rounded"></div>
                    <div className="h-4 w-8 bg-slate-100 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}