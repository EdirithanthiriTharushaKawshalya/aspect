import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Shirt, ShieldCheck, Flame } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

// Fallback products if database query fails or is empty
const MOCK_FEATURED_PRODUCTS = [
  {
    id: '11111111-1111-4111-a111-111111111111',
    name: 'Aspect Minimalist Trench',
    price: 189.00,
    category: 'Outerwear',
    image_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=60',
  },
  {
    id: '22222222-2222-4222-a222-222222222222',
    name: 'Aspect Oversized Heavyweight Tee',
    price: 45.00,
    category: 'Essentials',
    image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=60',
  },
  {
    id: '33333333-3333-4333-a333-333333333333',
    name: 'Aspect Tailored Linen Trouser',
    price: 95.00,
    category: 'Pants',
    image_url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=60',
  },
];

async function getFeaturedProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(3);

    if (error || !data || data.length === 0) {
      console.warn('Supabase products fetch failed or database unseeded. Using fallback products.');
      return MOCK_FEATURED_PRODUCTS;
    }
    return data;
  } catch (e) {
    console.error('Failed to connect to Supabase:', e);
    return MOCK_FEATURED_PRODUCTS;
  }
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden bg-neutral-900">
        <div className="absolute inset-0 z-0">
          {/* Hero background image */}
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=80"
            alt="Aspect Collection Banner"
            className="w-full h-full object-cover object-center opacity-65 scale-105 animate-[subtle-zoom_20s_infinite_alternate]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-neutral-950/50" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-6 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-white uppercase">
            <Sparkles className="h-3 w-3 text-neutral-300" />
            Autumn/Winter Collection
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-light tracking-[0.1em] text-white uppercase leading-[1.1] mb-6">
            Structural <br className="sm:hidden" />
            Minimalism
          </h1>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-neutral-300 font-light leading-relaxed mb-10 tracking-wide">
            Designed for functional longevity. Each garment details structural precision, curated organic textile blends, and modern cuts.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-white bg-white text-black font-semibold text-xs tracking-[0.2em] uppercase hover:bg-transparent hover:text-white transition-all duration-300 group"
            >
              Shop Collection
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Philosophy Statement */}
      <section className="py-24 bg-neutral-50 border-y border-neutral-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-neutral-400">The Aspect Ethos</h2>
            <p className="text-xl sm:text-2xl font-serif italic text-neutral-800 leading-relaxed font-light">
              &ldquo;We design for the contemporary client. We reject fast-fashion obsolescence, engineering garments that embody structural integrity, natural drapery, and a neutral, harmonious color palette.&rdquo;
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-white border border-neutral-100 flex flex-col items-center text-center space-y-4 shadow-sm rounded-sm">
              <div className="p-3 bg-neutral-50 rounded-full text-neutral-800">
                <Shirt className="h-6 w-6 stroke-[1.5]" />
              </div>
              <h3 className="text-sm font-semibold tracking-widest uppercase">Premium Sourcing</h3>
              <p className="text-xs text-neutral-500 font-light leading-relaxed">
                Made using long-staple organic cotton, luxury linen fibers, and ethically sourced wools.
              </p>
            </div>
            <div className="p-8 bg-white border border-neutral-100 flex flex-col items-center text-center space-y-4 shadow-sm rounded-sm">
              <div className="p-3 bg-neutral-50 rounded-full text-neutral-800">
                <ShieldCheck className="h-6 w-6 stroke-[1.5]" />
              </div>
              <h3 className="text-sm font-semibold tracking-widest uppercase">Structural Integrity</h3>
              <p className="text-xs text-neutral-500 font-light leading-relaxed">
                Double-stitched seams, heavy ribbing, and custom structural patterns built to withstand time.
              </p>
            </div>
            <div className="p-8 bg-white border border-neutral-100 flex flex-col items-center text-center space-y-4 shadow-sm rounded-sm">
              <div className="p-3 bg-neutral-50 rounded-full text-neutral-800">
                <Flame className="h-6 w-6 stroke-[1.5]" />
              </div>
              <h3 className="text-sm font-semibold tracking-widest uppercase">Timeless Aesthetic</h3>
              <p className="text-xs text-neutral-500 font-light leading-relaxed">
                Sophisticated monochromatic palettes and relaxed cuts suited for any environment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-baseline justify-between mb-12">
            <div>
              <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-neutral-400 mb-2">Explore Styles</h2>
              <p className="text-3xl font-serif text-neutral-900 uppercase tracking-wider font-light">Curated Categories</p>
            </div>
            <Link href="/shop" className="group mt-4 sm:mt-0 text-xs font-semibold tracking-widest uppercase text-neutral-700 hover:text-black transition-colors flex items-center gap-1.5">
              View all products
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Category Card 1 */}
            <Link href="/shop?category=Outerwear" className="group relative h-96 overflow-hidden bg-neutral-100">
              <img
                src="https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&auto=format&fit=crop&q=80"
                alt="Outerwear"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-colors duration-300" />
              <div className="absolute bottom-8 left-8">
                <p className="text-white text-xs tracking-[0.2em] font-medium uppercase mb-1">Collection</p>
                <h3 className="text-white text-2xl font-serif uppercase tracking-widest">Outerwear</h3>
              </div>
            </Link>

            {/* Category Card 2 */}
            <Link href="/shop?category=Essentials" className="group relative h-96 overflow-hidden bg-neutral-100">
              <img
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80"
                alt="Essentials"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-colors duration-300" />
              <div className="absolute bottom-8 left-8">
                <p className="text-white text-xs tracking-[0.2em] font-medium uppercase mb-1">Collection</p>
                <h3 className="text-white text-2xl font-serif uppercase tracking-widest">Essentials</h3>
              </div>
            </Link>

            {/* Category Card 3 */}
            <Link href="/shop?category=Pants" className="group relative h-96 overflow-hidden bg-neutral-100">
              <img
                src="https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=600&auto=format&fit=crop&q=80"
                alt="Pants"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-colors duration-300" />
              <div className="absolute bottom-8 left-8">
                <p className="text-white text-xs tracking-[0.2em] font-medium uppercase mb-1">Collection</p>
                <h3 className="text-white text-2xl font-serif uppercase tracking-widest">Pants</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-neutral-50 border-t border-neutral-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-neutral-400 mb-2">New Season</h2>
            <p className="text-3xl font-serif text-neutral-900 uppercase tracking-wider font-light">Featured Artifacts</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group flex flex-col bg-white border border-neutral-100 shadow-sm overflow-hidden">
                <Link href={`/product/${product.id}`} className="relative h-96 overflow-hidden bg-neutral-100">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
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
                      Explore
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
