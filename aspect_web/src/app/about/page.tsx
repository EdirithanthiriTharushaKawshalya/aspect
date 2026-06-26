import React from 'react';
import Link from 'next/link';
import { ArrowRight, CornerDownRight } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Editorial Banner */}
      <section className="bg-neutral-50 py-20 sm:py-28 border-b border-neutral-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-[10px] font-bold tracking-[0.3em] text-neutral-400 uppercase block mb-4">
              01. Introduction
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light tracking-tight uppercase leading-[1.15] text-neutral-900">
              The Architecture of Contemporary Dress
            </h1>
            <p className="mt-6 text-sm sm:text-base text-neutral-500 font-light leading-relaxed max-w-2xl tracking-wide">
              Established with a focus on functional longevity, ASPECT operates at the intersection of structural tailoring and casual drapery. We create clothing designed for a permanent wardrobe.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy Quote */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <span className="text-[10px] font-bold tracking-[0.3em] text-neutral-400 uppercase block">
            02. Core Belief
          </span>
          <p className="text-xl sm:text-3xl font-serif italic text-neutral-800 leading-normal font-light max-w-4xl mx-auto">
            &ldquo;We believe that garments should be engineered, not just styled. By rejecting seasonal speed, we focus on double-stitched durability, heavyweight organic fabrics, and a neutral, monochrome palette that moves fluidly across years.&rdquo;
          </p>
          <div className="flex justify-center">
            <div className="h-10 w-[1px] bg-neutral-300"></div>
          </div>
        </div>
      </section>

      {/* Image & Text Grid Section */}
      <section className="pb-24 sm:pb-32 border-b border-neutral-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Editorial Content */}
            <div className="space-y-10">
              <div>
                <span className="text-[10px] font-bold tracking-[0.3em] text-neutral-400 uppercase block mb-3">
                  03. The Conception
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif uppercase tracking-wider font-light text-neutral-900 mb-6">
                  Structural Permanence
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 font-light leading-relaxed tracking-wide mb-4">
                  ASPECT was born as a counter-movement to fast-fashion obsolescence. We noticed that modern clothing frequently lacked the structural density and stitching integrity required for regular wear.
                </p>
                <p className="text-xs sm:text-sm text-neutral-500 font-light leading-relaxed tracking-wide">
                  Our collections do not attempt to chase transient runway trends. Instead, we dissect classic shapes—the trench, the structured tee, the linen trouser—and rebuild them with reinforced seams, clean lines, and heavy-ribbed cuffs.
                </p>
              </div>

              {/* Bullet Details */}
              <div className="space-y-4 pt-4 border-t border-neutral-100">
                <div className="flex items-start gap-3">
                  <CornerDownRight className="h-4 w-4 text-neutral-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900">Premium Organic Textiles</h4>
                    <p className="text-[11px] text-neutral-500 font-light mt-1">We source 240GSM organic cotton, long-staple linen, and soft merino wools from certified carbon-neutral mills.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CornerDownRight className="h-4 w-4 text-neutral-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900">Engineered Construction</h4>
                    <p className="text-[11px] text-neutral-500 font-light mt-1">Each pattern draft is tested through months of physical wearing cycles before joining the permanent catalog.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Unsplash Artwork */}
            <div className="relative h-[300px] sm:h-[480px] w-full bg-neutral-100 overflow-hidden shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80"
                alt="ASPECT Studio Rack"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-neutral-900/5 mix-blend-multiply" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-2xl sm:text-3xl font-serif uppercase tracking-wider font-light text-neutral-950">
            Discover the Collection
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 font-light max-w-md mx-auto leading-relaxed">
            Browse our core garments, crafted to form the modern, structural uniform.
          </p>
          <div className="pt-4">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-10 py-4 border border-black bg-black text-white font-semibold text-xs tracking-[0.2em] uppercase hover:bg-transparent hover:text-black transition-all duration-300 group"
            >
              Shop Collection
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
