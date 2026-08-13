import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import OfferBanner from "./OfferBanner";
import { useLocation } from "react-router-dom";

export default function Layout({ children }) {
  const { pathname } = useLocation();
  const isCheckout = pathname === "/checkout";
  return (
    <>
      {!isCheckout && <OfferBanner />}
      {!isCheckout && <Navbar />}
      <main>{children}</main>
      {!isCheckout && <Footer />}
    </>
  );
  // bottom-nav padding handled per page with pb-24 md:pb-0
}
