'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { supabase } from '../../lib/supabaseClient';
import { ShoppingBag, CreditCard, Truck, Trash2, ArrowLeft, Loader2 } from 'lucide-react';

export default function Checkout() {
  const { cart, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: 'cod', // cod or online
  });

  const shippingCost = cartTotal > 150 ? 0 : 10;
  const totalCost = cartTotal + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateOrderCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `ASP-${code}`;
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    try {
      setLoading(true);
      const code = generateOrderCode();

      // 1. Insert order into public.orders
      const orderPayload = {
        order_code: code,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        customer_address: formData.address,
        payment_method: formData.paymentMethod,
        payment_status: formData.paymentMethod === 'online' ? 'paid' : 'pending',
        order_status: 'pending',
        total_amount: totalCost,
      };

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert(orderPayload)
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Insert items into public.order_items
      const itemsPayload = cart.map((item) => ({
        order_id: orderData.id,
        product_id: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.id)
          ? item.id
          : null,
        quantity: item.quantity,
        size: item.size,
        price_at_purchase: item.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(itemsPayload);

      if (itemsError) throw itemsError;

      // 3. Success, clear cart and redirect
      clearCart();
      router.push(`/order-success?code=${code}&method=${formData.paymentMethod}&name=${encodeURIComponent(formData.name)}`);
    } catch (err) {
      console.error('Checkout creation failed:', err);
      alert('There was a problem processing your checkout. Please verify details and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="w-full bg-white border-t border-neutral-100 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="p-4 bg-neutral-50 rounded-full text-neutral-400">
              <ShoppingBag className="h-12 w-12 stroke-[1.2]" />
            </div>
            <h2 className="text-2xl font-serif text-neutral-900 uppercase tracking-widest font-light">Your bag is empty</h2>
            <p className="text-neutral-500 font-light max-w-sm mx-auto leading-relaxed">
              Choose garments from our collection to add them to your styling list.
            </p>
            <Link
              href="/shop"
              className="px-8 py-3 border border-black bg-white text-neutral-900 text-xs font-semibold tracking-[0.2em] hover:bg-black hover:text-white transition-all uppercase"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-16 border-t border-neutral-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif uppercase tracking-widest text-neutral-900 mb-12">Checkout Portal</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Form Side */}
          <div className="lg:col-span-7 space-y-10">
            <form onSubmit={handleCheckoutSubmit} className="space-y-8">
              
              {/* Delivery Details */}
              <div className="space-y-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-3">
                  01. Delivery Coordinates
                </h3>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-white text-neutral-900 border border-neutral-200 px-4 py-3 text-xs uppercase tracking-wider focus:outline-none focus:border-black transition-colors"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-white text-neutral-900 border border-neutral-200 px-4 py-3 text-xs uppercase tracking-wider focus:outline-none focus:border-black transition-colors"
                        placeholder="Enter email address"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2">
                        WhatsApp / Contact Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-white text-neutral-900 border border-neutral-200 px-4 py-3 text-xs uppercase tracking-wider focus:outline-none focus:border-black transition-colors"
                        placeholder="+00 000 0000"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2">
                      Shipping Address
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      required
                      rows={3}
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full bg-white text-neutral-900 border border-neutral-200 px-4 py-3 text-xs uppercase tracking-wider focus:outline-none focus:border-black transition-colors"
                      placeholder="Street name, City, Zipcode, Country"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Selection */}
              <div className="space-y-6 pt-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-3">
                  02. Settling Mechanism
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* COD */}
                  <label
                    className={`flex items-start p-4 border cursor-pointer hover:border-black transition-all ${
                      formData.paymentMethod === 'cod' ? 'border-black bg-neutral-50' : 'border-neutral-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 text-black border-neutral-300 focus:ring-black accent-black"
                    />
                    <span className="ml-3 block">
                      <span className="block text-xs font-semibold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                        <Truck className="h-4 w-4 stroke-[1.5]" />
                        Cash on Delivery
                      </span>
                      <span className="block text-[10px] font-light text-neutral-500 mt-1 leading-normal">
                        Submit order and send proof of payment directly to our representative on WhatsApp.
                      </span>
                    </span>
                  </label>

                  {/* Online */}
                  <label
                    className={`flex items-start p-4 border cursor-pointer hover:border-black transition-all ${
                      formData.paymentMethod === 'online' ? 'border-black bg-neutral-50' : 'border-neutral-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={formData.paymentMethod === 'online'}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 text-black border-neutral-300 focus:ring-black accent-black"
                    />
                    <span className="ml-3 block">
                      <span className="block text-xs font-semibold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                        <CreditCard className="h-4 w-4 stroke-[1.5]" />
                        Online Checkout
                      </span>
                      <span className="block text-[10px] font-light text-neutral-500 mt-1 leading-normal">
                        Simulate instantaneous credit card confirmation (no gateways required).
                      </span>
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-neutral-950 text-white text-xs font-semibold tracking-[0.2em] uppercase hover:bg-neutral-800 transition-all flex items-center justify-center"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Finalizing Purchase...
                  </span>
                ) : (
                  'Complete Order'
                )}
              </button>
            </form>
          </div>

          {/* Cart Summary Side */}
          <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-neutral-100 pt-12 lg:pt-0 lg:pl-12">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-950 mb-6">
              Shopping Bag
            </h3>

            {/* List of items */}
            <div className="divide-y divide-neutral-100 max-h-96 overflow-y-auto mb-8 pr-2">
              {cart.map((item) => (
                <div key={`${item.id}-${item.size}`} className="py-4 flex gap-4">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="h-20 w-16 object-cover bg-neutral-50 border border-neutral-100 flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-medium text-neutral-900 uppercase tracking-wide">{item.name}</h4>
                      <p className="text-[10px] text-neutral-400 font-bold uppercase mt-0.5">Size: {item.size}</p>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      {/* Quantity adjuster */}
                      <div className="flex items-center border border-neutral-200 h-8">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                          className="px-2.5 h-full text-neutral-500 hover:text-black font-light transition-colors"
                        >
                          -
                        </button>
                        <span className="px-2 text-[10px] font-semibold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                          className="px-2.5 h-full text-neutral-500 hover:text-black font-light transition-colors"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                      >
                        <Trash2 className="h-4 w-4 stroke-[1.5]" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-neutral-900">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Panel */}
            <div className="bg-neutral-50 p-6 space-y-4 rounded-sm">
              <div className="flex justify-between text-xs text-neutral-500 tracking-wider uppercase font-light">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-neutral-500 tracking-wider uppercase font-light border-b border-neutral-200 pb-4">
                <span>Courier Service</span>
                <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold uppercase tracking-wider text-neutral-900 pt-2">
                <span>Total Amount</span>
                <span>${totalCost.toFixed(2)}</span>
              </div>
            </div>

            {/* Link to return */}
            <div className="mt-8 text-center">
              <Link href="/shop" className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-neutral-400 hover:text-black transition-colors">
                <ArrowLeft className="h-3 w-3 mr-1.5" /> Continue browsing styles
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
