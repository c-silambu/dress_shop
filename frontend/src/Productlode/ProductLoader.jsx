import { useEffect, useState } from "react";

export default function ProductLoader() {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHide(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-all duration-500 ${
        hide ? "opacity-0 backdrop-blur-0" : "opacity-100 backdrop-blur-sm"
      }`}
    >
      <div
        className={`relative flex h-28 w-28 items-center justify-center transition-all duration-500 ${
          hide ? "scale-90 opacity-0 blur-sm" : "scale-100 opacity-100 blur-0"
        }`}
      >
        <div className="absolute h-24 w-24 animate-spin rounded-full border-[3px] border-transparent border-r-[#7b8b4d] border-t-[#7b8b4d]"></div>

        <div className="absolute h-16 w-16 animate-[spin_1.5s_linear_reverse_infinite] rounded-full border-[3px] border-transparent border-b-[#7b8b4d] border-l-[#7b8b4d]"></div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-[#7b8b4d]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v3m0 12v3M8 7h8l-2 5 2 5H8l2-5-2-5z"
          />
        </svg>
      </div>
    </div>
  );
}