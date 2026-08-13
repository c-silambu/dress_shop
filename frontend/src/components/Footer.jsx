import React,{useState}from"react";
import{Link}from"react-router-dom";
import{ArrowRight,Mail,MapPin,Phone}from"lucide-react";
import{FaInstagram as Instagram}from"react-icons/fa";
import api from"../api/api";
import{useToast}from"../context/ToastContext";
const shop=[["New Arrivals","/dress"],["Dresses","/dress"],["Jewellery","/jewellery"],["Wishlist","/favourites"]],care=[["My Account","/profile"],["My Orders","/orders"],["Shopping Bag","/cart"],["About Us","/about"]];
export default function Footer(){const[email,setEmail]=useState(""),[busy,setBusy]=useState(false);const toast=useToast();const subscribe=async e=>{e.preventDefault();setBusy(true);try{const{data}=await api.post("/store/subscribe",{email});toast.success(data.message||"Thanks for subscribing!");setEmail("")}catch(err){toast.error(err.response?.data?.message||"Please try again")}finally{setBusy(false)}};return <footer className="new-footer">
 <div className="footer-newsletter"><div><p>Private invitations & style notes</p><h2>Join the Women’s Styles circle.</h2></div><form onSubmit={subscribe}><label><Mail/><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Your email address"/></label><button disabled={busy}>{busy?"Joining...":<>Join Us <ArrowRight/></>}</button></form></div>
 <div className="footer-main"><div className="footer-brand"><Link to="/">WOMEN'S <small>STYLES</small></Link><p>Thoughtfully curated dresses and jewellery for everyday elegance and beautiful occasions.</p><a href="https://instagram.com/womensstyles" target="_blank" rel="noreferrer"><Instagram/> Follow on Instagram</a></div><div className="footer-links"><h3>Shop</h3>{shop.map(([l,to])=><Link key={l} to={to}>{l}</Link>)}</div><div className="footer-links"><h3>Customer Care</h3>{care.map(([l,to])=><Link key={l} to={to}>{l}</Link>)}</div><div className="footer-contact"><h3>Visit & Contact</h3><p><MapPin/><span>Aruppukottai Main Road,<br/>Bus Stand, Kariyapatti – 626 106</span></p><a href="tel:+919150648548"><Phone/> +91 91506 48548</a><a href="tel:+918098954035"><Phone/> +91 80989 54035</a></div></div>
 <div className="footer-bottom"><p>© {new Date().getFullYear()} Women’s Styles. All rights reserved.</p><div><Link to="/about">Privacy</Link><Link to="/about">Terms</Link><span>India · INR ₹</span></div></div>
 </footer>}
