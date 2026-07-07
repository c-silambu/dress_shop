import React, { useEffect, useMemo, useState } from "react";
import { Minus, Plus, ShieldCheck, TicketPercent } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import api, { imgUrl } from "../api/api";
import { useAuth } from "../context/AuthContext";
import Auth from "./Auth";

const addressFields = ["fullName", "phone", "alternatePhone", "address", "city", "district", "state", "pincode"];

export default function Checkout() {
  const { user } = useAuth();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [address, setAddress] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [cartItems, setCartItems] = useState([]);
  const [buyNowQuantity, setBuyNowQuantity] = useState(state?.quantity || 1);

  useEffect(() => {
    if (!state?.buyNow && user) {
      api.get("/cart").then((r) => setCartItems(r.data)).catch(() => setCartItems([]));
    }
  }, [state?.buyNow, user]);

  const checkoutItems = useMemo(() => {
    if (state?.buyNow) return [{ product: state.buyNow, quantity: buyNowQuantity }];
    return cartItems;
  }, [buyNowQuantity, cartItems, state?.buyNow]);

  const amount = checkoutItems.reduce((sum, item) => {
    const price = Number(item.product?.discountPrice || item.product?.price || 0);
    return sum + price * Number(item.quantity || 1);
  }, 0);

  if (!user) return <Auth />;

  const handleChange = (e) => setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const updateCartQuantity = async (item, qty) => {
    const next = Math.max(1, qty);
    if (state?.buyNow) { setBuyNowQuantity(next); return; }
    await api.put(`/cart/${item._id}`, { quantity: next });
    setCartItems((cur) => cur.map((ci) => ci._id === item._id ? { ...ci, quantity: next } : ci));
  };

  const loadRazorpayScript = () => new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

  const openRazorpay = async () => {
    const loaded = await loadRazorpayScript();
    if (!loaded) { alert("Razorpay SDK failed to load"); return false; }
    const { data: order } = await api.post("/payment/create-order", { amount });
    return new Promise((resolve) => {
      const rp = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_demo_key",
        amount: order.amount,
        currency: order.currency || "INR",
        name: "Women's Styles",
        description: "Fashion order payment",
        order_id: order.id,
        handler: async (res) => { try { await api.post("/payment/verify", res); resolve(true); } catch { resolve(false); } },
        prefill: { name: address.fullName || user?.name, contact: address.phone || user?.phone, email: user?.email },
        theme: { color: "#a91d4b" },
        modal: { ondismiss: () => resolve(false) },
      });
      rp.open();
    });
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    if (!checkoutItems.length) { alert("No items in checkout"); return; }
    let paymentStatus = "Pending";
    if (paymentMethod === "Razorpay") {
      const paid = await openRazorpay();
      if (!paid) { alert("Payment not completed"); return; }
      paymentStatus = "Paid";
    }
    const items = checkoutItems.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.discountPrice || item.product.price,
      quantity: item.quantity || 1,
      size: item.size,
      color: item.color,
      image: item.product.images?.[0],
    }));
    await api.post("/orders", { items, address, amount, paymentMethod, paymentStatus });
    alert("Order placed successfully");
    navigate("/orders");
  };

  return (
    <section className="page-shell">
      <div className="border-b border-[#e9e0d7] bg-white">
        <div className="section-wrap py-8 md:py-10">
          <p className="editorial-kicker">Secure Checkout</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-[#15120f] md:text-5xl">Place your order</h1>
        </div>
      </div>

      <form onSubmit={placeOrder} className="section-wrap grid gap-8 py-6 md:py-10 lg:grid-cols-[1fr_430px]">
        <div className="space-y-5">
          <div className="fashion-panel p-5 md:p-6">
            <h2 className="text-2xl font-black text-[#15120f]">Products</h2>
            <div className="mt-5 grid gap-3">
              {checkoutItems.map((item) => {
                const product = item.product;
                const itemPrice = Number(product?.discountPrice || product?.price || 0);
                return (
                  <div key={product?._id || item._id} className="grid grid-cols-[86px_1fr] gap-4 border border-[#e9e0d7] bg-[#fbfaf7] p-3 md:grid-cols-[112px_1fr]">
                    <img src={imgUrl(product?.images?.[0])} alt={product?.name} className="h-24 w-full object-cover product-image-bg md:h-28" />
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-black text-[#15120f] md:text-lg">{product?.name}</h3>
                      <p className="mt-1 text-sm font-black text-[#a91d4b]">Rs. {itemPrice.toLocaleString("en-IN")}</p>
                      <p className="text-xs text-[#756f66]">{product?.subCategory || product?.mainCategory}</p>
                      <div className="mt-3 inline-flex items-center border border-[#e9e0d7] bg-white">
                        <button type="button" className="p-2 text-[#15120f]" onClick={() => updateCartQuantity(item, Number(item.quantity || 1) - 1)}><Minus className="h-3 w-3" /></button>
                        <span className="min-w-8 text-center text-sm font-black">{item.quantity || 1}</span>
                        <button type="button" className="p-2 text-[#15120f]" onClick={() => updateCartQuantity(item, Number(item.quantity || 1) + 1)}><Plus className="h-3 w-3" /></button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="fashion-panel p-5 md:p-6">
            <h2 className="text-2xl font-black text-[#15120f]">Delivery address</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {addressFields.map((field) => (
                <input
                  key={field}
                  name={field}
                  onChange={handleChange}
                  placeholder={field}
                  className={`input text-sm ${field === "address" ? "sm:col-span-2" : ""}`}
                  required={field !== "alternatePhone"}
                />
              ))}
            </div>
          </div>
        </div>

        <aside className="h-fit border border-[#e9e0d7] bg-white p-6 lg:sticky lg:top-24">
          <h2 className="text-2xl font-black text-[#15120f]">Order summary</h2>
          <div className="mt-5 border border-[#e9e0d7] bg-[#fbfaf7] p-4">
            <div className="flex items-center gap-2 text-sm font-black text-[#324414]"><TicketPercent className="h-4 w-4" /> Coupon</div>
            <p className="mt-1 text-xs text-[#756f66]">Coupon display ready. Backend discount logic can be added later.</p>
          </div>
          <div className="mt-6 space-y-4 text-sm text-[#756f66]">
            <div className="flex justify-between"><span>Items</span><b className="text-[#15120f]">{checkoutItems.length}</b></div>
            <div className="flex justify-between"><span>Subtotal</span><b className="text-[#15120f]">Rs. {amount.toLocaleString("en-IN")}</b></div>
            <div className="flex justify-between"><span>Delivery</span><b className="text-[#324414]">Free</b></div>
          </div>
          <div className="my-6 border-t border-dashed border-[#d8cbc0]" />
          <div className="flex justify-between text-2xl font-black text-[#15120f]">
            <span>Total</span>
            <span>Rs. {amount.toLocaleString("en-IN")}</span>
          </div>
          <div className="mt-6 grid gap-3">
            {["Cash on Delivery", "Razorpay"].map((method) => (
              <label key={method} className={`flex cursor-pointer items-center justify-between border p-4 text-sm font-black transition ${paymentMethod === method ? "border-[#15120f] bg-[#15120f] text-white" : "border-[#e9e0d7] text-[#15120f]"}`}>
                <span>{method}</span>
                <input type="radio" name="payment" value={method} checked={paymentMethod === method} onChange={(e) => setPaymentMethod(e.target.value)} />
              </label>
            ))}
          </div>
          <button className="btn-primary mt-6 w-full">Place Order</button>
          <p className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-[#756f66]"><ShieldCheck className="h-4 w-4" /> Secure payment and order</p>
        </aside>
      </form>
    </section>
  );
}
