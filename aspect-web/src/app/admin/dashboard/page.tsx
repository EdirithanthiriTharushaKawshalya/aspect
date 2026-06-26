'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import { 
  Plus, Trash2, Edit2, ShieldAlert, Check, RefreshCw, 
  TrendingUp, ShoppingBag, Package, AlertCircle, FileText, Send 
} from 'lucide-react';

interface Order {
  id: string;
  order_code: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  payment_method: string;
  payment_status: string;
  order_status: string;
  total_amount: number;
  created_at: string;
  order_items?: OrderItem[];
}

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  size: string;
  price_at_purchase: number;
  products?: {
    name: string;
  };
}

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

export default function AdminDashboard() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory'>('orders');
  const [loading, setLoading] = useState(true);

  // States for orders and products
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  // Form states for creating products
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category: 'Outerwear',
    sizes: ['S', 'M', 'L', 'XL'],
    stock_quantity: '10',
  });

  // Verify Admin Session on mount
  useEffect(() => {
    const session = localStorage.getItem('aspect_admin_session');
    if (session !== 'active') {
      router.push('/admin/login');
    } else {
      setAuthorized(true);
      fetchDashboardData();
    }
  }, []);

  async function fetchDashboardData() {
    try {
      setLoading(true);

      // Fetch products
      const { data: productData, error: productErr } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!productErr && productData) {
        setProducts(productData);
      }

      // Fetch orders and their line items
      const { data: orderData, error: orderErr } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_id,
            quantity,
            size,
            price_at_purchase,
            products ( name )
          )
        `)
        .order('created_at', { ascending: false });

      if (!orderErr && orderData) {
        setOrders(orderData);
      }

    } catch (e) {
      console.error('Failed to load dashboard parameters:', e);
    } finally {
      setLoading(false);
    }
  }

  // Handle Log out
  const handleLogout = () => {
    localStorage.removeItem('aspect_admin_session');
    router.push('/admin/login');
  };

  // Update order details (sync with Supabase)
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ order_status: status })
        .eq('id', orderId);

      if (error) throw error;
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, order_status: status } : o));
    } catch (e) {
      alert('Failed to update status.');
    }
  };

  const handleUpdatePaymentStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: status })
        .eq('id', orderId);

      if (error) throw error;
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, payment_status: status } : o));
    } catch (e) {
      alert('Failed to update payment status.');
    }
  };

  // Add Product to database
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        image_url: newProduct.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600',
        category: newProduct.category,
        sizes: newProduct.sizes,
        stock_quantity: parseInt(newProduct.stock_quantity),
        in_stock: parseInt(newProduct.stock_quantity) > 0,
      };

      const { data, error } = await supabase
        .from('products')
        .insert(payload)
        .select()
        .single();

      if (error) throw error;

      setProducts(prev => [data, ...prev]);
      setShowAddForm(false);
      setNewProduct({
        name: '',
        description: '',
        price: '',
        image_url: '',
        category: 'Outerwear',
        sizes: ['S', 'M', 'L', 'XL'],
        stock_quantity: '10',
      });
    } catch (e) {
      alert('Failed to register product.');
    }
  };

  // Delete product
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this garment from the active catalog?')) return;
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (e) {
      alert('Failed to delete garment.');
    }
  };

  // Send whatsapp confirmation message
  const launchWhatsAppMessage = (order: Order) => {
    const messageText = `Hi ${order.customer_name}, this is Aspect Support. We've verified your order ${order.order_code} details. Your package is marked as confirmed and is entering shipping!`;
    const whatsappUrl = `https://wa.me/${order.customer_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(messageText)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Calculate metrics
  const totalRevenue = orders
    .filter(o => o.payment_status === 'paid')
    .reduce((sum, o) => sum + Number(o.total_amount), 0);

  const pendingCodOrders = orders.filter(
    o => o.payment_method === 'cod' && o.payment_status === 'pending'
  ).length;

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Admin Nav */}
      <nav className="border-b border-neutral-100 bg-neutral-900 text-white px-8 py-5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-lg font-serif font-semibold tracking-[0.2em]">ASPECT PANEL</span>
          <span className="bg-neutral-800 text-[10px] text-neutral-300 px-2 py-0.5 tracking-wider uppercase font-semibold">Console</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs uppercase tracking-wider font-semibold border border-neutral-700 px-4 py-2 hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          Disconnect
        </button>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        
        {/* KPI metrics cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Card 1 */}
          <div className="border border-neutral-100 bg-neutral-50 p-6 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Total Confirmed Revenue</p>
              <h2 className="text-xl font-bold text-neutral-900">${totalRevenue.toFixed(2)}</h2>
            </div>
            <div className="p-3 bg-white border border-neutral-100 rounded-full text-green-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          {/* Card 2 */}
          <div className="border border-neutral-100 bg-neutral-50 p-6 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Pending COD validation</p>
              <h2 className="text-xl font-bold text-red-600">{pendingCodOrders} Orders</h2>
            </div>
            <div className="p-3 bg-white border border-neutral-100 rounded-full text-red-500">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
          {/* Card 3 */}
          <div className="border border-neutral-100 bg-neutral-50 p-6 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Total Orders logged</p>
              <h2 className="text-xl font-bold text-neutral-900">{orders.length} Records</h2>
            </div>
            <div className="p-3 bg-white border border-neutral-100 rounded-full text-neutral-800">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </div>
          {/* Card 4 */}
          <div className="border border-neutral-100 bg-neutral-50 p-6 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Inventory Items</p>
              <h2 className="text-xl font-bold text-neutral-900">{products.length} Products</h2>
            </div>
            <div className="p-3 bg-white border border-neutral-100 rounded-full text-neutral-800">
              <Package className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-4 border-b border-neutral-100 pb-4 mb-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`text-sm font-semibold uppercase tracking-wider pb-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'orders' ? 'border-black text-black' : 'border-transparent text-neutral-400 hover:text-neutral-600'
            }`}
          >
            Order Handling ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`text-sm font-semibold uppercase tracking-wider pb-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'inventory' ? 'border-black text-black' : 'border-transparent text-neutral-400 hover:text-neutral-600'
            }`}
          >
            Product Catalog ({products.length})
          </button>
        </div>

        {/* Loading overlay */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <RefreshCw className="h-8 w-8 text-neutral-900 animate-spin" />
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">Loading parameters...</p>
          </div>
        ) : activeTab === 'orders' ? (
          
          /* Tab 1: Orders Log */
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-serif uppercase tracking-widest text-neutral-950">Customer Orders Ledger</h3>
              <button
                onClick={fetchDashboardData}
                className="text-xs flex items-center gap-1 bg-neutral-50 px-3 py-2 border border-neutral-200 uppercase tracking-wider font-semibold hover:bg-neutral-100 cursor-pointer"
              >
                <RefreshCw className="h-3 w-3" /> Refresh
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-neutral-100 text-neutral-400 text-sm">
                No orders registered in the system yet.
              </div>
            ) : (
              <div className="overflow-x-auto border border-neutral-100 rounded-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-100 text-neutral-400 uppercase font-bold tracking-wider">
                      <th className="p-4">Code</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Delivery Coordinate</th>
                      <th className="p-4">Method</th>
                      <th className="p-4">Paid status</th>
                      <th className="p-4">Shipping status</th>
                      <th className="p-4">Total</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-neutral-50/50">
                        <td className="p-4 font-mono font-bold uppercase">{order.order_code}</td>
                        <td className="p-4">
                          <p className="font-semibold text-neutral-800">{order.customer_name}</p>
                          <p className="text-[10px] text-neutral-400 font-light mt-0.5">{order.customer_email}</p>
                          <p className="text-[10px] text-neutral-400 font-semibold mt-0.5">{order.customer_phone}</p>
                        </td>
                        <td className="p-4 max-w-xs truncate text-[11px] font-light text-neutral-500">
                          {order.customer_address}
                        </td>
                        <td className="p-4 uppercase font-semibold text-[10px] tracking-wide text-neutral-700">
                          {order.payment_method}
                        </td>
                        <td className="p-4">
                          <select
                            value={order.payment_status}
                            onChange={(e) => handleUpdatePaymentStatus(order.id, e.target.value)}
                            className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold border ${
                              order.payment_status === 'paid' 
                                ? 'bg-green-50 border-green-200 text-green-700' 
                                : 'bg-red-50 border-red-200 text-red-700'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="failed">Failed</option>
                          </select>
                        </td>
                        <td className="p-4">
                          <select
                            value={order.order_status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold border border-neutral-200 bg-white`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="p-4 font-semibold text-neutral-900">
                          ${Number(order.total_amount).toFixed(2)}
                        </td>
                        <td className="p-4 text-right flex justify-end gap-2">
                          {/* Items view */}
                          <div className="relative group/tooltip">
                            <button
                              className="p-1.5 border border-neutral-200 hover:bg-neutral-800 hover:text-white transition-colors"
                              title="Show Items"
                            >
                              <FileText className="h-4.5 w-4.5" />
                            </button>
                            <div className="absolute right-0 bottom-full mb-2 bg-neutral-900 text-white p-4 rounded-sm shadow-lg w-64 hidden group-hover/tooltip:block z-50 text-[10px] text-left leading-relaxed">
                              <p className="font-bold border-b border-neutral-700 pb-1.5 uppercase tracking-widest text-[9px] mb-2 text-neutral-400">Garment Items</p>
                              {order.order_items?.map((item) => (
                                <div key={item.id} className="flex justify-between py-1 font-light border-b border-neutral-800/40">
                                  <span>{item.products?.name} ({item.size}) x{item.quantity}</span>
                                  <span className="font-semibold">${Number(item.price_at_purchase).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* WhatsApp dispatch */}
                          <button
                            onClick={() => launchWhatsAppMessage(order)}
                            className="p-1.5 border border-neutral-200 hover:bg-green-600 hover:text-white transition-colors cursor-pointer text-green-600"
                            title="Message on WhatsApp"
                          >
                            <Send className="h-4.5 w-4.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        ) : (

          /* Tab 2: Inventory Admin */
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-serif uppercase tracking-widest text-neutral-950">Active Catalog Inventory</h3>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="text-xs flex items-center gap-1.5 bg-neutral-950 text-white px-4 py-2 uppercase tracking-wider font-semibold hover:bg-neutral-800 cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Add Product
              </button>
            </div>

            {/* Slide out add product form */}
            {showAddForm && (
              <form onSubmit={handleAddProduct} className="border border-neutral-200 bg-neutral-50 p-8 space-y-6">
                <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-2">
                  Create Catalog Entry
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2">Garment Name</label>
                    <input
                      type="text"
                      required
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="w-full border border-neutral-200 px-3 py-2 text-xs uppercase tracking-wider focus:outline-none focus:border-black bg-white"
                      placeholder="e.g. Aspect Linen Blazer"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2">Category</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full border border-neutral-200 px-3 py-2 text-xs uppercase tracking-wider focus:outline-none focus:border-black bg-white"
                    >
                      <option value="Outerwear">Outerwear</option>
                      <option value="Essentials">Essentials</option>
                      <option value="Pants">Pants</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2">Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        className="w-full border border-neutral-200 px-3 py-2 text-xs uppercase tracking-wider focus:outline-none focus:border-black bg-white"
                        placeholder="95.00"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2">Stock Units</label>
                      <input
                        type="number"
                        required
                        value={newProduct.stock_quantity}
                        onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: e.target.value })}
                        className="w-full border border-neutral-200 px-3 py-2 text-xs uppercase tracking-wider focus:outline-none focus:border-black bg-white"
                        placeholder="10"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2">Image URL</label>
                    <input
                      type="url"
                      value={newProduct.image_url}
                      onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                      className="w-full border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-black bg-white"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2">Detailed Description</label>
                    <input
                      type="text"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      className="w-full border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-black bg-white"
                      placeholder="Describe styling details, fabric contents, drape..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="text-xs uppercase tracking-wider font-semibold border border-neutral-200 px-4 py-2.5 bg-white hover:bg-neutral-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="text-xs uppercase tracking-wider font-semibold bg-neutral-950 text-white px-6 py-2.5 hover:bg-neutral-800 cursor-pointer"
                  >
                    Submit Entry
                  </button>
                </div>
              </form>
            )}

            {/* Inventory table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((p) => (
                <div key={p.id} className="group border border-neutral-100 bg-neutral-50/50 p-6 flex flex-col justify-between shadow-sm space-y-4">
                  <div className="flex gap-4">
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="h-20 w-16 object-cover bg-white border border-neutral-100"
                    />
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">{p.category}</p>
                      <h4 className="text-xs font-semibold text-neutral-800 uppercase tracking-wide leading-tight">{p.name}</h4>
                      <p className="text-xs font-bold text-neutral-900">${Number(p.price).toFixed(2)}</p>
                      <p className="text-[10px] font-semibold text-neutral-500 mt-1">Stock: {p.stock_quantity} pcs</p>
                    </div>
                  </div>

                  <div className="border-t border-neutral-150/60 pt-3 flex justify-between items-center text-[10px] text-neutral-400">
                    <div className="flex gap-1">
                      {p.sizes.map(sz => (
                        <span key={sz} className="border border-neutral-200 px-1 bg-white text-neutral-600 font-bold uppercase">{sz}</span>
                      ))}
                    </div>
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className="text-neutral-400 hover:text-red-600 p-1 border border-neutral-200 hover:border-red-100 bg-white transition-colors cursor-pointer"
                      title="Remove product"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
