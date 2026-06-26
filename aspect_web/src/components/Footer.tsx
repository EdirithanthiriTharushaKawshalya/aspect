'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-neutral-100 bg-neutral-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <span className="text-xl font-semibold tracking-[0.2em] font-serif">ASPECT</span>
            <p className="text-sm text-neutral-400 max-w-xs font-light leading-relaxed">
              Curated contemporary garments. Designed with precise structural details, premium organic fabrics, and a timeless monochrome aesthetic.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-200 mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-neutral-400 font-light">
              <li><Link href="/shop?category=Outerwear" className="hover:text-white transition-colors">Outerwear</Link></li>
              <li><Link href="/shop?category=Essentials" className="hover:text-white transition-colors">Essentials</Link></li>
              <li><Link href="/shop?category=Pants" className="hover:text-white transition-colors">Pants</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-200 mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-neutral-400 font-light">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-200 mb-4">Stay Connected</h4>
            <p className="text-sm text-neutral-400 mb-3 font-light leading-relaxed">
              Subscribe to receive collection releases and private sale notices.
            </p>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                className="w-full bg-neutral-900 border border-neutral-800 px-4 py-2 text-xs uppercase tracking-wider focus:outline-none focus:border-white transition-colors"
                required
              />
              <button
                type="submit"
                className="bg-white text-black px-4 py-2 text-xs font-semibold tracking-wider hover:bg-neutral-200 transition-colors uppercase"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 border-t border-neutral-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-500 font-light">
          <p>&copy; {new Date().getFullYear()} ASPECT Studio. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
