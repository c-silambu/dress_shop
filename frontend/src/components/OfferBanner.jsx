import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
export default function OfferBanner(){const [offer,setOffer]=useState(null);useEffect(()=>{api.get('/store/offer').then(r=>setOffer(r.data)).catch(()=>{})},[]);if(!offer)return null;return <div className="bg-[#761131] px-4 py-2.5 text-center text-xs font-bold text-white"><span className="mr-2 text-[#f2d58e]">{offer.label}</span>{offer.message} {offer.couponCode&&<b className="mx-2 border border-white/30 px-2 py-1 tracking-widest">{offer.couponCode}</b>}<Link className="ml-2 underline underline-offset-4" to={offer.buttonUrl||'/dress'}>{offer.buttonText||'Shop Now'}</Link></div>}
