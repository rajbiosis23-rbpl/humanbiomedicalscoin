import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const ProductCard = React.memo(function ProductCard({
  product,
  district,
  isHighlighted = false,
}) {
  const productUrl = district
    ? `/${district}/items/${product.slug}`
    : `/items/${product.slug}`;

  const hasBrand = product.brand && product.brand !== "N/A" && product.brand.trim() !== "";
  const hasModel = product.model && product.model !== "N/A" && product.model.trim() !== "";
  const hasInstrument = product.instrument && product.instrument !== "N/A" && product.instrument.trim() !== "";
  const hasCapacity = product.capacity && product.capacity !== "N/A" && product.capacity.trim() !== "";
  const hasThroughput = product.throughput && product.throughput !== "N/A" && product.throughput.trim() !== "";
  const hasAutomation = product.automation && product.automation !== "N/A" && product.automation.trim() !== "";

  return (
    <div
      id={product.slug}
      className={`scroll-mt-32 bg-white rounded-[24px] border transition-all duration-300 p-6 md:p-8 ${
        isHighlighted
          ? "border-[#b03333] ring-4 ring-[#b03333]/25 shadow-2xl bg-red-50/20 scale-[1.01]"
          : "border-slate-200/90 shadow-sm hover:shadow-xl hover:border-slate-300"
      }`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_210px] gap-6 md:gap-8 items-center">
        {/* Product Image */}
        <Link
          href={productUrl}
          className="relative block h-[190px] sm:h-[210px] rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all group flex items-center justify-center"
        >
          <img
            src={product.images?.[0] || product.image || "/placeholder.jpg"}
            alt={product.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.jpg";
            }}
          />
        </Link>

        {/* Content */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Verified • In Stock
            </span>

            {product.category && (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                {product.category}
              </span>
            )}

            {product.subCategory && product.subCategory !== product.category && (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200/70">
                {product.subCategory}
              </span>
            )}
          </div>

          <Link href={productUrl}>
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 hover:text-[#b03333] transition-colors leading-snug cursor-pointer line-clamp-2">
              {product.title}
            </h3>
          </Link>

          <p className="mt-2.5 text-sm md:text-base text-slate-600 leading-relaxed line-clamp-2">
            {product.description ||
              product.desc ||
              "Premium biomedical equipment designed for clinical diagnostic laboratories, hospitals, and healthcare institutions."}
          </p>

          {/* Smart Spec Chips (Only real specs shown, no empty N/A boxes) */}
          <div className="flex flex-wrap gap-2.5 mt-4">
            {hasBrand && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 text-xs">
                <span className="text-slate-400 uppercase tracking-wider block text-[10px] font-semibold">Brand</span>
                <span className="font-semibold text-slate-800 text-xs mt-0.5 block">{product.brand}</span>
              </div>
            )}

            {hasModel && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 text-xs">
                <span className="text-slate-400 uppercase tracking-wider block text-[10px] font-semibold">Model</span>
                <span className="font-semibold text-slate-800 text-xs mt-0.5 block">{product.model}</span>
              </div>
            )}

            {hasInstrument && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 text-xs">
                <span className="text-slate-400 uppercase tracking-wider block text-[10px] font-semibold">Instrument</span>
                <span className="font-semibold text-slate-800 text-xs mt-0.5 block">{product.instrument}</span>
              </div>
            )}

            {hasAutomation && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 text-xs">
                <span className="text-slate-400 uppercase tracking-wider block text-[10px] font-semibold">Automation</span>
                <span className="font-semibold text-slate-800 text-xs mt-0.5 block">{product.automation}</span>
              </div>
            )}

            {hasCapacity && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 text-xs">
                <span className="text-slate-400 uppercase tracking-wider block text-[10px] font-semibold">Capacity</span>
                <span className="font-semibold text-slate-800 text-xs mt-0.5 block">{product.capacity}</span>
              </div>
            )}

            {hasThroughput && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 text-xs">
                <span className="text-slate-400 uppercase tracking-wider block text-[10px] font-semibold">Throughput</span>
                <span className="font-semibold text-slate-800 text-xs mt-0.5 block">{product.throughput}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 justify-center items-stretch lg:items-end w-full">
          <Link
            href={productUrl}
            className="w-full lg:w-[190px] h-[48px] flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#9b111e] to-[#c81212] hover:from-[#800d17] hover:to-[#a10e0e] !text-white text-sm font-semibold shadow-md shadow-red-900/15 transition-all duration-200 active:scale-[0.98]"
          >
            <span>Get Quote</span>
            <ArrowRight size={16} />
          </Link>

          <Link
            href={productUrl}
            className="w-full lg:w-[190px] h-[42px] flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
          >
            View Specifications
          </Link>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;