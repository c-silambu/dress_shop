import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, CircleAlert, Info, X } from "lucide-react";

const ToastContext = createContext(null);
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const remove = useCallback((id) => setToasts((items) => items.filter((item) => item.id !== id)), []);
  const show = useCallback((message, type = "success") => { const id = `${Date.now()}-${Math.random()}`; setToasts((items) => [...items, { id, message, type }]); window.setTimeout(() => remove(id), 4000); }, [remove]);
  const value = useMemo(() => ({ show, success: (m) => show(m, "success"), error: (m) => show(m, "error"), info: (m) => show(m, "info") }), [show]);
  return <ToastContext.Provider value={value}>{children}<div className="toast-stack" aria-live="polite">{toasts.map((toast) => { const Icon = toast.type === "success" ? CheckCircle2 : toast.type === "error" ? CircleAlert : Info; return <div key={toast.id} className={`app-toast app-toast-${toast.type}`} role="status"><Icon/><span>{toast.message}</span><button type="button" onClick={() => remove(toast.id)} aria-label="Close notification"><X/></button></div>; })}</div></ToastContext.Provider>;
}
export function useToast() { const value = useContext(ToastContext); if (!value) throw new Error("useToast must be used inside ToastProvider"); return value; }
