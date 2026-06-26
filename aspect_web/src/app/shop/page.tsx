'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import { Search, SlidersHorizontal, Loader2, ArrowUpDown } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  sizes: string[];
  stock_quantity: number;
  in_stock: boolean;
}

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: '11111111-1111-4111-a111-111111111111',
    name: 'Aspect Minimalist Trench',
    description: 'A classic double-breasted trench coat crafted from a premium water-resistant cotton blend.',
    price: 189.00,
    image_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=60',
    category: 'Outerwear',
    sizes: ['S', 'M', 'L', 'XL'],
    stock_quantity: 12,
    in_stock: true,
  },
  {
    id: '22222222-2222-4222-a222-222222222222',
    name: 'Aspect Oversized Heavyweight Tee',
    description: 'Made from 240GSM organic cotton, this tee offers a structured drape and boxy fit.',
    price: 45.00,
    image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=60',
    category: 'Essentials',
    sizes: ['S', 'M', 'L'],
    stock_quantity: 25,
    in_stock: true,
  },
  {
    id: '33333333-3333-4333-a333-333333333333',
    name: 'Aspect Tailored Linen Trouser',
    description: 'Lightweight and breathable trousers crafted from pure Belgian flax linen.',
    price: 95.00,
    image_url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=60',
    category: 'Pants',
    sizes: ['M', 'L', 'XL'],
    stock_quantity: 8,
    in_stock: true,
  },
  {
    id: '44444444-4444-4444-a444-444444444444',
    name: 'Aspect Classic Knit Sweater',
    description: 'Woven from a luxurious merino wool and cashmere blend. Designed with a clean crewneck.',
    price: 120.00,
    image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=60',
    category: 'Essentials',
    sizes: ['S', 'M', 'L', 'XL'],
    stock_quantity: 15,
    in_stock: true,
  },
  {
    id: '55555555-5555-4555-a555-555555555555',
    name: 'Aspect Cropped Ribbed Cardigan',
    description: 'A feminine, fitted cardigan in a soft ribbed knit structure.',
    price: 75.00,
    image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=60',
    category: 'Outerwear',
    sizes: ['S', 'M'],
    stock_quantity: 6,
    in_stock: true,
  },
  {
    id: '66666666-6666-4666-a666-666666666666',
    name: 'Aspect Leather Utility Jacket',
    description: 'Crafted from butter-soft vegan leather, featuring a clean collar, front zip closure.',
    price: 145.00,
    image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=60',
    category: 'Outerwear',
    sizes: ['M', 'L', 'XL'],
    stock_quantity: 10,
    in_stock: true,
  },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSize, setSelectedSize] = useState('All');
  const [sortBy, setSortBy] = useState('default'); // default, price-asc, price-desc

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*');

        if (error || !data || data.length === 0) {
          console.warn('Supabase fetch returned empty. Using fallback catalog.');
          setProducts(FALLBACK_PRODUCTS);
        } else {
          setProducts(data);
        }
      } catch (err) {
        console.error('Failed to query products from Supabase:', err);
        setProducts(FALLBACK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Update selected category if search parameter changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  // Unique categories list
  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];
  const sizes = ['All', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];

  // Filter and sort items
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSize = selectedSize === 'All' || product.sizes.includes(selectedSize);

      return matchesSearch && matchesCategory && matchesSize;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0; // default order
    });

  return (
    <div className="min-h-screen bg-white">
      {/* Category banner / Header */}
      <div className="bg-neutral-50 py-12 border-b border-neutral-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-serif font-light tracking-[0.2em] uppercase text-neutral-900">
            {selectedCategory === 'All' ? 'Full Collection' : selectedCategory}
          </h1>
          <p className="mt-2 text-xs text-neutral-500 tracking-widest uppercase font-light">
            Aspect Studio — Garments engineered with contemporary lines
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Sidebar Filters - Desktop */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-8 hidden md:block">
            <div className="border-b border-neutral-100 pb-6">
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-neutral-900 mb-4 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Refine Selection
              </h3>
            </div>

            {/* Category Filter */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Categories</h4>
              <div className="flex flex-col space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-left text-sm font-light uppercase tracking-wider py-1 hover:text-black transition-colors ${
                      selectedCategory === cat ? 'text-black font-semibold border-l-2 border-black pl-3' : 'text-neutral-500 hover:pl-1'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div className="space-y-3 pt-6 border-t border-neutral-100">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Size</h4>
              <div className="flex flex-wrap gap-2">
                {sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-3 py-1.5 text-xs font-semibold tracking-wider uppercase border transition-colors ${
                      selectedSize === sz
                        ? 'border-black bg-black text-white'
                        : 'border-neutral-200 text-neutral-600 hover:border-black'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Catalog grid */}
          <main className="flex-1">
            {/* Search & Sort Panel */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center mb-8 border-b border-neutral-100 pb-6">
              {/* Search Bar */}
              <div className="relative w-full md:max-w-xs">
                <input
                  type="text"
                  placeholder="Search catalog..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs uppercase tracking-wider border border-neutral-200 focus:outline-none focus:border-black transition-colors bg-white text-neutral-900"
                />
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-neutral-400" />
              </div>

              {/* Filters & Sort Controls */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                {/* Mobile Filters selectors (only visible on mobile) */}
                <div className="flex md:hidden gap-2 flex-grow sm:flex-grow-0">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="flex-1 sm:flex-initial px-3 py-2.5 text-xs uppercase tracking-wider border border-neutral-200 bg-white text-neutral-900"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="flex-1 sm:flex-initial px-3 py-2.5 text-xs uppercase tracking-wider border border-neutral-200 bg-white text-neutral-900"
                  >
                    {sizes.map((sz) => (
                      <option key={sz} value={sz}>
                        Size: {sz}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort dropdown */}
                <div className="relative flex items-center gap-2 flex-grow sm:flex-grow-0">
                  <ArrowUpDown className="h-4 w-4 text-neutral-400 hidden sm:block" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full sm:w-auto px-3 py-2.5 text-xs uppercase tracking-wider border border-neutral-200 bg-white text-neutral-900 cursor-pointer focus:outline-none focus:border-black"
                  >
                    <option value="default">Sort: Recommended</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Loading Indicator */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <Loader2 className="h-8 w-8 text-neutral-900 animate-spin" />
                <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 font-light">Loading Collection...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-24 border border-dashed border-neutral-100">
                <p className="text-sm font-light text-neutral-500 mb-4">No matching garments found in our records.</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                    setSelectedSize('All');
                  }}
                  className="px-6 py-2.5 bg-neutral-950 text-white text-xs font-semibold tracking-wider hover:bg-neutral-800 transition-all uppercase rounded-sm"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              /* Products Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="group flex flex-col bg-white border border-neutral-100 shadow-sm overflow-hidden">
                    <Link href={`/product/${product.id}`} className="relative h-96 overflow-hidden bg-neutral-100">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      />
                      {!product.in_stock && (
                        <div className="absolute top-4 right-4 bg-neutral-900 text-white px-2 py-1 text-[10px] tracking-widest font-bold uppercase">
                          Sold Out
                        </div>
                      )}
                    </Link>
                    <div className="p-6 flex flex-col justify-between flex-grow">
                      <div className="space-y-1 mb-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">{product.category}</p>
                        <Link href={`/product/${product.id}`} className="text-sm font-medium text-neutral-800 hover:text-black transition-colors block">
                          {product.name}
                        </Link>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-neutral-50">
                        <span className="text-sm font-semibold text-neutral-900">${Number(product.price).toFixed(2)}</span>
                        <Link href={`/product/${product.id}`} className="text-xs font-semibold tracking-widest text-neutral-800 hover:text-black transition-colors uppercase border-b border-black pb-0.5">
                          Configure
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-white">
        <Loader2 className="h-8 w-8 text-neutral-900 animate-spin" />
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 font-light mt-4">Loading Catalog...</p>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
