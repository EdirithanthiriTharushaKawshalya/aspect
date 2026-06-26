'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, MessageSquare, ShoppingBag, ArrowRight } from 'lucide-react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderCode = searchParams.get('code') || 'ASP-XXXXXX';
  const method = searchParams.get('method') || 'cod';
  const name = searchParams.get('name') || 'Customer';

  // Customize WhatsApp contact number
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+1234567890';
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
  
  // Custom message bodies
  const codMessage = `Hi Aspect Studio! I just placed a Cash on Delivery order. Here are my details for confirmation:\n\nOrder Code: ${orderCode}\nCustomer Name: ${name}`;
  const onlineMessage = `Hi Aspect Studio! I just completed my online payment for order ${orderCode}. Here is my payment receipt for confirmation.`;

  const codWhatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(codMessage)}`;
  const onlineWhatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(onlineMessage)}`;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-20">
      <div className="mx-auto max-w-xl px-4 text-center sm:px-6 lg:px-8 space-y-10">
        
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="p-3 bg-neutral-50 rounded-full border border-neutral-100 animate-bounce">
            <CheckCircle2 className="h-16 w-16 text-neutral-900 stroke-[1.2]" />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-neutral-400">Order Confirmed</p>
          <h1 className="text-3xl font-serif uppercase tracking-widest text-neutral-900 leading-tight">
            Thank you for your purchase
          </h1>
          <p className="text-neutral-500 font-light text-sm max-w-md mx-auto leading-relaxed">
            Your design coordinates have been registered. The details are summarized below:
          </p>
        </div>

        {/* Order Card details */}
        <div className="bg-neutral-50 border border-neutral-100 p-8 rounded-sm space-y-4 text-left">
          <div className="flex justify-between items-center text-xs border-b border-neutral-200/60 pb-3">
            <span className="font-semibold uppercase tracking-wider text-neutral-500">Order Code</span>
            <span className="font-bold tracking-widest text-neutral-900 uppercase bg-white border border-neutral-200 px-3 py-1 font-mono">
              {orderCode}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold uppercase tracking-wider text-neutral-500">Payment Selection</span>
            <span className="font-semibold uppercase tracking-wider text-neutral-900">
              {method === 'cod' ? 'Cash on Delivery (COD)' : 'Online Payment'}
            </span>
          </div>
        </div>

        {/* Action Panel based on payment method */}
        {method === 'cod' ? (
          <div className="bg-neutral-50 border border-neutral-100 p-8 rounded-sm space-y-6 text-center border-l-4 border-l-black">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 flex justify-center items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Required Action: Confirm Order
              </h3>
              <p className="text-xs text-neutral-500 font-light leading-relaxed max-w-sm mx-auto">
                To activate and confirm your Cash on Delivery order, please click below to send your **Order Code** and **Name** to our WhatsApp support line.
              </p>
            </div>

            <a
              href={codWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center h-14 bg-neutral-950 text-white font-semibold text-xs tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors"
            >
              Confirm via WhatsApp
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        ) : (
          <div className="bg-neutral-50 border border-neutral-100 p-8 rounded-sm space-y-6 text-center border-l-4 border-l-black">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 flex justify-center items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Required Action: Send Payment Receipt
              </h3>
              <p className="text-xs text-neutral-500 font-light leading-relaxed max-w-sm mx-auto">
                Please click below to open WhatsApp and send us a screenshot of your **payment receipt** for confirmation. Your package will be processed once verified.
              </p>
            </div>

            <a
              href={onlineWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center h-14 bg-neutral-950 text-white font-semibold text-xs tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors"
            >
              Send Receipt via WhatsApp
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        )}

        {/* Footer actions */}
        <div className="pt-6">
          <Link
            href="/shop"
            className="inline-flex items-center text-xs font-semibold tracking-widest text-neutral-800 hover:text-black transition-colors uppercase border-b border-black pb-0.5"
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Return to Collection
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function OrderSuccess() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-white">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 font-light">Loading Confirmation...</p>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
