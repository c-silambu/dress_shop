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
      api.get("/cart").then((response) => setCartItems(response.data)).catch(() => setCartItems([]));
    }
  }, [state?.buyNow, user]);

  const checkoutItems = useMemo(() => {
    if (state?.buyNow) {
      return [{ product: state.buyNow, quantity: buyNowQuantity }];
    }

    return cartItems;
  }, [buyNowQuantity, cartItems, state?.buyNow]);

  const amount = checkoutItems.reduce((sum, item) => {
    const product = item.product;
    const price = Number(product?.discountPrice || product?.price || 0);
    return sum + price * Number(item.quantity || 1);
  }, 0);

  if (!user) {
    return <Auth />;
  }

  const handleChange = (event) => {
    setAddress((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const updateCartQuantity = async (item, quantity) => {
    const nextQuantity = Math.max(1, quantity);

    if (state?.buyNow) {
      setBuyNowQuantity(nextQuantity);
      return;
    }

    await api.put(`/cart/${item._id}`, { quantity: nextQuantity });
    setCartItems((current) => current.map((cartItem) => (cartItem._id === item._id ? { ...cartItem, quantity: nextQuantity } : cartItem)));
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const openRazorpay = async () => {
    const loaded = await loadRazorpayScript();

    if (!loaded) {
      alert("Razorpay SDK failed to load");
      return false;
    }

    const { data: order } = await api.post("/payment/create-order", { amount });

    return new Promise((resolve) => {
      const razorpay = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_demo_key",
        amount: order.amount,
        currency: order.currency || "INR",
        name: "Women’s Styles",
        description: "Fashion order payment",
        order_id: order.id,
        handler: async (response) => {
          try {
            await api.post("/payment/verify", response);
            resolve(true);
          } catch {
            resolve(false);
          }
        },
        prefill: {
          name: address.fullName || user?.name || "Customer",
          contact: address.phone || user?.phone || "",
          email: user?.email || "",
        },
        theme: {
          color: "#2563eb",
        },
        modal: {
          ondismiss: () => resolve(false),
        },
      });

      razorpay.open();
    });
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    if (!checkoutItems.length) {
      alert("No items in checkout");
      return;
    }

    let paymentStatus = "Pending";

    if (paymentMethod === "Razorpay") {
      const paid = await openRazorpay();

      if (!paid) {
        alert("Payment not completed");
        return;
      }

      paymentStatus = "Paid";
    }

    const items = checkoutItems.map((item) => {
      const product = item.product;
      return {
        product: product._id,
        name: product.name,
        price: product.discountPrice || product.price,
        quantity: item.quantity || 1,
        size: item.size,
        color: item.color,
        image: product.images?.[0],
      };
    });

    await api.post("/orders", {
      items,
      address,
      amount,
      paymentMethod,
      paymentStatus,
    });

    alert("Order placed successfully");
    navigate("/orders");
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-blue-600">Secure Checkout</p>
        <h1 className="text-4xl font-black text-blue-950 md:text-5xl">Place Your Order</h1>
      </div>

      <form onSubmit={placeOrder} className="grid gap-8 lg:grid-cols-[1fr_390px]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-blue-100 bg-white p-5 shadow-xl shadow-blue-950/5">
            <h2 className="mb-4 text-2xl font-black text-slate-950">Products</h2>
            <div className="grid gap-4">
              {checkoutItems.map((item) => {
                const product = item.product;
                const itemPrice = Number(product?.discountPrice || product?.price || 0);

                return (
                  <div key={product?._id || item._id} className="grid gap-4 rounded-[1.6rem] bg-blue-50/60 p-4 md:grid-cols-[110px_1fr_auto] md:items-center">
                    <img src={imgUrl(product?.images?.[0])} alt={product?.name} className="h-28 w-full rounded-2xl object-cover md:w-28" />
                    <div>
                      <h3 className="text-xl font-black text-slate-950">{product?.name}</h3>
                      <p className="mt-1 font-bold text-blue-700">₹{itemPrice}</p>
                      <p className="text-sm text-slate-500">{product?.subCategory || product?.mainCategory}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button type="button" className="rounded-full bg-white p-3 text-blue-700" onClick={() => updateCartQuantity(item, Number(item.quantity || 1) - 1)}><Minus className="h-4 w-4" /></button>
                      <span className="min-w-8 text-center text-xl font-black">{item.quantity || 1}</span>
                      <button type="button" className="rounded-full bg-white p-3 text-blue-700" onClick={() => updateCartQuantity(item, Number(item.quantity || 1) + 1)}><Plus className="h-4 w-4" /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2rem] border border-blue-100 bg-white p-5 shadow-xl shadow-blue-950/5">
            <h2 className="mb-4 text-2xl font-black text-slate-950">Delivery Address</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {addressFields.map((field) => (
                <input key={field} name={field} onChange={handleChange} placeholder={field} className="input" required={field !== "alternatePhone"} />
              ))}
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-[2rem] border border-blue-100 bg-white p-6 shadow-2xl shadow-blue-950/10 lg:sticky lg:top-24">
          <h2 className="text-2xl font-black text-slate-950">Order Summary</h2>
          <div className="mt-5 rounded-3xl bg-blue-50 p-4">
            <div className="flex items-center gap-2 font-black text-blue-700"><TicketPercent className="h-5 w-5" /> Coupon</div>
            <p className="mt-1 text-sm text-slate-500">Coupon UI added. Backend coupon logic can be added later.</p>
          </div>

          <div className="mt-5 space-y-3 text-slate-600">
            <div className="flex justify-between"><span>Checkout Items</span><b>{checkoutItems.length}</b></div>
            <div className="flex justify-between"><span>Subtotal</span><b>₹{amount}</b></div>
            <div className="flex justify-between"><span>Delivery</span><b className="text-green-600">Free</b></div>
          </div>

          <div className="mt-5 border-t pt-5">
            <div className="flex justify-between text-3xl font-black text-blue-950"><span>Total</span><span>₹{amount}</span></div>
          </div>

          <div className="mt-6 grid gap-3">
            {['Cash on Delivery', 'Razorpay'].map((method) => (
              <label key={method} className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 font-black transition ${paymentMethod === method ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-blue-100 text-slate-600'}`}>
                <span>{method}</span>
                <input type="radio" name="payment" value={method} checked={paymentMethod === method} onChange={(event) => setPaymentMethod(event.target.value)} />
              </label>
            ))}
          </div>

          <button className="btn-primary mt-6 w-full">Place Order</button>
          <p className="mt-4 flex items-center justify-center gap-2 text-sm font-bold text-slate-500"><ShieldCheck className="h-4 w-4" /> Secure payment & order</p>
        </aside>
      </form>
    </section>
  );
}
