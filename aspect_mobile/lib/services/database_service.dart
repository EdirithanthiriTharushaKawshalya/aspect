import 'package:supabase_flutter/supabase_flutter.dart';

class DatabaseService {
  final _client = Supabase.instance.client;

  // Products
  Future<List<Map<String, dynamic>>> getProducts() async {
    try {
      final response = await _client
          .from('products')
          .select()
          .order('created_at', ascending: false);
      return List<Map<String, dynamic>>.from(response);
    } catch (e) {
      print('Error getting products: $e');
      return [];
    }
  }

  Future<Map<String, dynamic>?> createProduct(Map<String, dynamic> product) async {
    try {
      final response = await _client
          .from('products')
          .insert(product)
          .select()
          .single();
      return response;
    } catch (e) {
      print('Error creating product: $e');
      return null;
    }
  }

  Future<bool> deleteProduct(String productId) async {
    try {
      await _client.from('products').delete().eq('id', productId);
      return true;
    } catch (e) {
      print('Error deleting product: $e');
      return false;
    }
  }

  Future<bool> updateProductStock(String productId, int newStock) async {
    try {
      await _client
          .from('products')
          .update({'stock_quantity': newStock, 'in_stock': newStock > 0})
          .eq('id', productId);
      return true;
    } catch (e) {
      print('Error updating product stock: $e');
      return false;
    }
  }

  // Orders
  Future<List<Map<String, dynamic>>> getOrders() async {
    try {
      final response = await _client
          .from('orders')
          .select('''
            *,
            order_items (
              id,
              product_id,
              quantity,
              size,
              price_at_purchase,
              products ( name )
            )
          ''')
          .order('created_at', ascending: false);
      return List<Map<String, dynamic>>.from(response);
    } catch (e) {
      print('Error getting orders: $e');
      return [];
    }
  }

  Future<bool> updateOrderStatus(String orderId, String status) async {
    try {
      await _client
          .from('orders')
          .update({'order_status': status})
          .eq('id', orderId);
      return true;
    } catch (e) {
      print('Error updating order status: $e');
      return false;
    }
  }

  Future<bool> updatePaymentStatus(String orderId, String status) async {
    try {
      await _client
          .from('orders')
          .update({'payment_status': status})
          .eq('id', orderId);
      return true;
    } catch (e) {
      print('Error updating payment status: $e');
      return false;
    }
  }
}
