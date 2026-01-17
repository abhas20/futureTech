import { useState } from "react";


export function CollapsibleVideo({ videoUrl }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-gray-100 transition">
        <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Previously Uploaded Video
        </span>

        {/* Arrow */}
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Content */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          open ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}>
        <div className="p-5">
          <video
            src={videoUrl}
            controls
            className="w-full rounded-lg shadow-md"
          />
        </div>
      </div>
    </div>
  );
}
