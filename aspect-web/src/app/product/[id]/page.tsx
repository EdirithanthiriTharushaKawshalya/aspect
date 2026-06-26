'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useCart } from '../../../context/CartContext';
import { supabase } from '../../../lib/supabaseClient';
import { ShoppingBag, ArrowLeft, Loader2, Sparkles, Check } from 'lucide-react';

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
    description: 'A classic double-breasted trench coat crafted from a premium water-resistant cotton blend. Features a relaxed silhouette, adjustable belted cuffs, and a storm flap. Perfect for transitional styling.',
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
    description: 'Made from 240GSM organic cotton, this tee offers a structured drape and boxy fit. Features a thick ribbed collar and dropped shoulders for a modern street style silhouette.',
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
    description: 'Lightweight and breathable trousers crafted from pure Belgian flax linen. Features a mid-rise waist, pleated front details, and a straight-leg cut for effortless warm-weather elegance.',
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
    description: 'Woven from a luxurious merino wool and cashmere blend. Designed with a clean crewneck collar, ribbed hem, and subtle textured stitching that brings warmth and sophisticated texture to any outfit.',
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
    description: 'A feminine, fitted cardigan in a soft ribbed knit structure. Features front button closures and a delicate V-neck. An essential layering piece designed for high-waisted styling.',
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
    description: 'Crafted from butter-soft vegan leather, featuring a clean collar, front zip closure, and large utility cargo pockets. Designed with an elastic waistband for comfort and structure.',
    price: 145.00,
    image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=60',
    category: 'Outerwear',
    sizes: ['M', 'L', 'XL'],
    stock_quantity: 10,
    in_stock: true,
  },
];

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const productId = unwrappedParams.id;

  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function getProduct() {
      try {
        setLoading(true);
        // Check fallback first for fast mockup preview
        const fallbackItem = FALLBACK_PRODUCTS.find((p) => p.id === productId);
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();

        if (error || !data) {
          if (fallbackItem) {
            setProduct(fallbackItem);
            if (fallbackItem.sizes.length > 0) {
              setSelectedSize(fallbackItem.sizes[0]);
            }
          }
        } else {
          setProduct(data);
          if (data.sizes && data.sizes.length > 0) {
            setSelectedSize(data.sizes[0]);
          }
        }
      } catch (err) {
        console.error(err);
        const fallbackItem = FALLBACK_PRODUCTS.find((p) => p.id === productId);
        if (fallbackItem) {
          setProduct(fallbackItem);
          setSelectedSize(fallbackItem.sizes[0]);
        }
      } finally {
        setLoading(false);
      }
    }

    getProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product || !selectedSize) return;

    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
      },
      selectedSize,
      quantity
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-white space-y-4">
        <Loader2 className="h-8 w-8 text-neutral-900 animate-spin" />
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 font-light">Loading Details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8 bg-white">
        <h2 className="text-2xl font-serif text-neutral-800 mb-4">Garment Not Found</h2>
        <p className="text-neutral-500 font-light mb-8">The requested garment could not be found in our collection.</p>
        <Link href="/shop" className="px-6 py-3 border border-black text-xs font-semibold tracking-wider hover:bg-black hover:text-white transition-all uppercase">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/shop"
          className="inline-flex items-center text-xs font-semibold tracking-widest text-neutral-500 hover:text-black transition-colors uppercase mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Collection
        </Link>

        {/* Product Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Image */}
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-50 border border-neutral-100 shadow-sm rounded-sm">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Product Information */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-[10px] font-bold uppercase tracking-widest text-neutral-600">
                <Sparkles className="h-3 w-3" />
                {product.category}
              </span>
              <h1 className="text-3xl lg:text-4xl font-serif uppercase tracking-wide text-neutral-900 leading-tight">
                {product.name}
              </h1>
              <p className="text-2xl font-light text-neutral-900">
                ${Number(product.price).toFixed(2)}
              </p>
            </div>

            <div className="border-t border-b border-neutral-100 py-6">
              <p className="text-sm font-light leading-relaxed text-neutral-600">
                {product.description}
              </p>
            </div>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold uppercase tracking-wider text-neutral-500">Select Size</span>
                  <a href="#" className="text-neutral-400 underline hover:text-black font-light transition-colors">Size Guide</a>
                </div>
                <div className="flex gap-2.5">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`h-11 w-14 text-xs font-semibold tracking-wider uppercase border flex items-center justify-center transition-all ${
                        selectedSize === sz
                          ? 'border-black bg-black text-white'
                          : 'border-neutral-200 text-neutral-700 hover:border-black'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Add button */}
            <div className="flex gap-3 pt-4">
              <div className="flex items-center border border-neutral-200 h-14 w-28 sm:w-32 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-full text-neutral-500 hover:text-black font-light text-lg transition-colors flex items-center justify-center"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full text-center text-xs font-semibold focus:outline-none bg-transparent text-neutral-900"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-full text-neutral-500 hover:text-black font-light text-lg transition-colors flex items-center justify-center"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.in_stock}
                className={`flex-1 h-14 flex items-center justify-center text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300 ${
                  product.in_stock
                    ? 'bg-neutral-950 text-white hover:bg-neutral-800'
                    : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                }`}
              >
                {added ? (
                  <span className="flex items-center gap-2">
                    <Check className="h-4 w-4" /> Added to bag
                  </span>
                ) : product.in_stock ? (
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4" /> Add to bag
                  </span>
                ) : (
                  'Out of Stock'
                )}
              </button>
            </div>

            {/* Extra product meta info */}
            <div className="pt-6 border-t border-neutral-100 text-xs text-neutral-400 font-light space-y-1 leading-relaxed">
              <p>SKU: ASP-{product.id.slice(0, 8).toUpperCase()}</p>
              <p>Stock Status: {product.stock_quantity > 0 ? `${product.stock_quantity} pieces available` : 'Sold out'}</p>
              <p>Free carbon-neutral courier shipping on orders over $150.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
