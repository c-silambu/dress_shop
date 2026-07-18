import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, Heart, Home, Menu, Search, ShoppingBag, User, X } from "lucide-react";

const menuItems = [
  { name: "Home", path: "/" }, { name: "New", path: "/dress" },
  { name: "Shop", path: "/dress" }, { name: "Jewellery", path: "/jewellery" },
  { name: "About Us", path: "/about" },
];

function BrandMark() {
  return <div className="brand-wordmark"><span>W</span><i>O</i><span>MEN'S</span><small>STYLES</small></div>;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  return <>
    <div className="offer-strip"><ChevronLeft/><p>Buy 2, Save ₹200 <b>|</b> Buy 3, Save ₹500</p><ChevronRight/></div>
    <header className="site-header">
      <div className="nav-shell">
        <Link to="/" onClick={() => setOpen(false)}><BrandMark/></Link>
        <nav className="desktop-menu">{menuItems.map(item => <NavLink key={item.name} to={item.path} className={({isActive}) => isActive ? "active" : ""}>{item.name}</NavLink>)}</nav>
        <div className="nav-actions">
          <Link to="/dress" aria-label="Search"><Search/></Link><Link to="/profile" aria-label="Account"><User/></Link><Link to="/favourites" aria-label="Wishlist" className="desktop-heart"><Heart/></Link><Link to="/cart" aria-label="Cart"><ShoppingBag/></Link>
          <button onClick={() => setOpen(v=>!v)} className="mobile-menu-button">{open?<X/>:<Menu/>}</button>
        </div>
      </div>
      {open && <nav className="mobile-menu">{menuItems.map(item=><NavLink key={item.name} to={item.path} onClick={()=>setOpen(false)}>{item.name}</NavLink>)}</nav>}
    </header>
    <nav className="mobile-bottom">{[[Home,"/","Home"],[Heart,"/favourites","Wishlist"],[ShoppingBag,"/cart","Cart"],[User,"/profile","Profile"]].map(([Icon,path,label])=><Link key={path} to={path} className={location.pathname===path?"active":""}><Icon/><span>{label}</span></Link>)}</nav>
  </>;
}
