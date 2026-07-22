import React, { useEffect, useRef, useState } from "react";

const SCRIPT_ID = "google-identity-services";

export default function GoogleSignIn({ onCredential, disabled = false }) {
  const buttonRef = useRef(null);
  const [error, setError] = useState("");
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId || disabled) return undefined;
    let cancelled = false;

    const render = () => {
      if (cancelled || !window.google || !buttonRef.current) return;
      buttonRef.current.innerHTML = "";
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: ({ credential }) => credential && onCredential(credential),
      });
      window.google.accounts.id.renderButton(buttonRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        width: Math.min(buttonRef.current.clientWidth || 380, 400),
      });
    };

    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      if (window.google) render();
      else existing.addEventListener("load", render, { once: true });
    } else {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = render;
      script.onerror = () => setError("Google sign-in could not be loaded");
      document.head.appendChild(script);
    }
    return () => { cancelled = true; };
  }, [clientId, disabled, onCredential]);

  if (!clientId) return null;
  return (
    <div>
      <div ref={buttonRef} className={disabled ? "pointer-events-none opacity-60" : ""} />
      {error && <p className="mt-2 text-center text-xs font-bold text-[#a91d4b]">{error}</p>}
    </div>
  );
}
