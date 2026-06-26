'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { cartCount, cartTotal } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="group flex items-center gap-2">
              <span className="text-2xl font-semibold tracking-[0.2em] text-neutral-900 transition-colors group-hover:text-neutral-500 font-serif">
                ASPECT
              </span>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex space-x-10">
            <Link
              href="/"
              className="text-sm font-medium tracking-wider text-neutral-600 hover:text-neutral-900 transition-colors uppercase"
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="text-sm font-medium tracking-wider text-neutral-600 hover:text-neutral-900 transition-colors uppercase"
            >
              Shop Collection
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium tracking-wider text-neutral-600 hover:text-neutral-900 transition-colors uppercase"
            >
              About Us
            </Link>
          </nav>

          {/* Cart Icon & Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <Link
              href="/checkout"
              className="group relative flex items-center p-2 text-neutral-700 hover:text-neutral-950 transition-colors"
              aria-label="View Cart"
            >
              <ShoppingBag className="h-6 w-6 stroke-[1.5] transition-transform group-hover:scale-105" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-950 text-[10px] font-bold text-white ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              type="button"
              className="flex items-center justify-center p-2 rounded-md text-neutral-600 hover:text-neutral-900 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-100 bg-white px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
          >
            Shop Collection
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
          >
            About Us
          </Link>
          <div className="border-t border-neutral-100 pt-3 px-3 flex justify-between items-center text-sm">
            <span className="text-neutral-500 font-medium">Cart total:</span>
            <span className="text-neutral-900 font-bold">${cartTotal.toFixed(2)}</span>
          </div>
        </div>
      )}
    </header>
  );
}
