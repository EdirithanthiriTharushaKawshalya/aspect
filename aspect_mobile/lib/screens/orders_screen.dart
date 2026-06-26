import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../services/database_service.dart';

class OrdersScreen extends StatefulWidget {
  final List<Map<String, dynamic>> orders;
  final Future<void> Function() onRefresh;

  const OrdersScreen({super.key, required this.orders, required this.onRefresh});

  @override
  State<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends State<OrdersScreen> {
  final _dbService = DatabaseService();
  String _selectedFilter = 'ALL';

  // Available filters
  final List<String> _filters = ['ALL', 'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  List<Map<String, dynamic>> get _filteredOrders {
    if (_selectedFilter == 'ALL') return widget.orders;
    return widget.orders
        .where((o) => (o['order_status'] ?? '').toString().toUpperCase() == _selectedFilter)
        .toList();
  }

  // Open WhatsApp direct message link
  Future<void> _openWhatsApp(Map<String, dynamic> order) async {
    final phone = (order['customer_phone'] ?? '').toString().replaceAll(RegExp(r'[^0-9]'), '');
    final name = order['customer_name'] ?? 'Client';
    final code = order['order_code'] ?? 'ASP-XXXXXX';
    
    final message = "Hi $name! This is Aspect Support. Regarding your order $code, we are reaching out to help coordinate processing.";
    final url = "https://wa.me/$phone?text=${Uri.encodeComponent(message)}";
    
    final uri = Uri.parse(url);
    try {
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Could not open WhatsApp application.')),
          );
        }
      }
    } catch (e) {
      print('WhatsApp launch error: $e');
    }
  }

  // Show bottom details sheet for order details and action items
  void _showOrderDetailsSheet(Map<String, dynamic> order) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            final orderCode = order['order_code'] ?? 'ASP-XXXXXX';
            final clientName = order['customer_name'] ?? 'Client';
            final email = order['customer_email'] ?? '';
            final phone = order['customer_phone'] ?? '';
            final address = order['customer_address'] ?? '';
            final method = order['payment_method'] ?? 'cod';
            final payStatus = order['payment_status'] ?? 'pending';
            final ordStatus = order['order_status'] ?? 'pending';
            final total = double.tryParse(order['total_amount'].toString()) ?? 0.0;
            final items = order['order_items'] as List<dynamic>? ?? [];

            return Container(
              padding: const EdgeInsets.all(24.0),
              constraints: BoxConstraints(
                maxHeight: MediaQuery.of(context).size.height * 0.85,
              ),
              child: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Header
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          orderCode,
                          style: const TextStyle(
                              fontFamily: 'Serif',
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 1.0),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close),
                          onPressed: () => Navigator.pop(context),
                        )
                      ],
                    ),
                    const Divider(),
                    const SizedBox(height: 16),

                    // Customer info
                    const Text('CUSTOMER DETALLS',
                        style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1.0,
                            color: Colors.grey)),
                    const SizedBox(height: 8),
                    Text(clientName,
                        style: const TextStyle(
                            fontWeight: FontWeight.bold, fontSize: 14)),
                    Text(email, style: const TextStyle(fontSize: 12, color: Colors.black54)),
                    Text(phone, style: const TextStyle(fontSize: 12, color: Colors.black54)),
                    const SizedBox(height: 8),
                    Text(address, style: const TextStyle(fontSize: 12, fontStyle: FontStyle.italic)),
                    const SizedBox(height: 24),

                    // Order items list
                    const Text('GARMENT ITEMS',
                        style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1.0,
                            color: Colors.grey)),
                    const SizedBox(height: 8),
                    ...items.map((item) {
                      final prodName = item['products']?['name'] ?? 'Aspect Garment';
                      final size = item['size'] ?? 'M';
                      final qty = item['quantity'] ?? 1;
                      final price = double.tryParse(item['price_at_purchase'].toString()) ?? 0.0;

                      return Padding(
                        padding: const EdgeInsets.symmetric(vertical: 6.0),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text('$prodName ($size) x$qty',
                                style: const TextStyle(fontSize: 12)),
                            Text('\$${(price * qty).toStringAsFixed(2)}',
                                style: const TextStyle(
                                    fontWeight: FontWeight.bold, fontSize: 12)),
                          ],
                        ),
                      );
                    }).toList(),
                    const Divider(),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Total Amount',
                            style: TextStyle(fontWeight: FontWeight.bold)),
                        Text('\$${total.toStringAsFixed(2)}',
                            style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                                color: Colors.black)),
                      ],
                    ),
                    const SizedBox(height: 28),

                    // Controls panel
                    const Text('ADMINISTRATIVE CONTROLS',
                        style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1.0,
                            color: Colors.grey)),
                    const SizedBox(height: 12),

                    // Payment status toggle
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Payment Status:',
                            style: TextStyle(fontSize: 13)),
                        DropdownButton<String>(
                          value: payStatus,
                          underline: Container(),
                          onChanged: (value) async {
                            if (value == null) return;
                            final ok = await _dbService.updatePaymentStatus(
                                order['id'], value);
                            if (ok) {
                              setModalState(() {
                                order['payment_status'] = value;
                              });
                              widget.onRefresh();
                            }
                          },
                          items: const [
                            DropdownMenuItem(value: 'pending', child: Text('PENDING')),
                            DropdownMenuItem(value: 'paid', child: Text('PAID')),
                            DropdownMenuItem(value: 'failed', child: Text('FAILED')),
                          ],
                        ),
                      ],
                    ),

                    // Order status toggle
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Order Status:',
                            style: TextStyle(fontSize: 13)),
                        DropdownButton<String>(
                          value: ordStatus,
                          underline: Container(),
                          onChanged: (value) async {
                            if (value == null) return;
                            final ok = await _dbService.updateOrderStatus(
                                order['id'], value);
                            if (ok) {
                              setModalState(() {
                                order['order_status'] = value;
                              });
                              widget.onRefresh();
                            }
                          },
                          items: const [
                            DropdownMenuItem(value: 'pending', child: Text('PENDING')),
                            DropdownMenuItem(value: 'confirmed', child: Text('CONFIRMED')),
                            DropdownMenuItem(value: 'shipped', child: Text('SHIPPED')),
                            DropdownMenuItem(value: 'delivered', child: Text('DELIVERED')),
                            DropdownMenuItem(value: 'cancelled', child: Text('CANCELLED')),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),

                    // WhatsApp Action
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        onPressed: () => _openWhatsApp(order),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF25D366),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          elevation: 0,
                          shape: const RoundedRectangleBorder(borderRadius: BorderRadius.zero),
                        ),
                        icon: const Icon(Icons.send),
                        label: const Text(
                          'MESSAGE CUSTOMER ON WHATSAPP',
                          style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 1.0),
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Filter pills horizontal list
        Container(
          height: 52,
          decoration: const BoxDecoration(
            color: Colors.white,
            border: Border(bottom: BorderSide(color: Color(0xFFEEEEEE))),
          ),
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            itemCount: _filters.length,
            itemBuilder: (context, index) {
              final filter = _filters[index];
              final isSelected = _selectedFilter == filter;

              return Padding(
                padding: const EdgeInsets.only(right: 8.0),
                child: ChoiceChip(
                  label: Text(
                    filter,
                    style: TextStyle(
                        fontSize: 9,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 0.5,
                        color: isSelected ? Colors.white : Colors.black87),
                  ),
                  selected: isSelected,
                  onSelected: (selected) {
                    if (selected) {
                      setState(() {
                        _selectedFilter = filter;
                      });
                    }
                  },
                  backgroundColor: const Color(0xFFF5F5F5),
                  selectedColor: const Color(0xFF171717),
                  shape: const RoundedRectangleBorder(borderRadius: BorderRadius.zero),
                  elevation: 0,
                  pressElevation: 0,
                ),
              );
            },
          ),
        ),

        // List of Orders
        Expanded(
          child: RefreshIndicator(
            onRefresh: widget.onRefresh,
            color: const Color(0xFF171717),
            child: _filteredOrders.isEmpty
                ? const Center(
                    child: Text('No orders matching search filter.',
                        style: TextStyle(color: Colors.grey, fontSize: 13)),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(16.0),
                    itemCount: _filteredOrders.length,
                    itemBuilder: (context, index) {
                      final order = _filteredOrders[index];
                      final code = order['order_code'] ?? 'ASP-XXXXXX';
                      final name = order['customer_name'] ?? 'Client';
                      final total = double.tryParse(order['total_amount'].toString()) ?? 0.0;
                      final status = order['order_status'] ?? 'pending';
                      final method = order['payment_method'] ?? 'cod';
                      final payStatus = order['payment_status'] ?? 'pending';

                      return Card(
                        elevation: 0,
                        margin: const EdgeInsets.only(bottom: 12),
                        color: Colors.white,
                        shape: RoundedRectangleBorder(
                          side: const BorderSide(color: Color(0xFFEEEEEE)),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: InkWell(
                          onTap: () => _showOrderDetailsSheet(order),
                          child: Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text(
                                      code,
                                      style: const TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 13,
                                          fontFeatures: [FontFeature.tabularFigures()]),
                                    ),
                                    Text(
                                      status.toUpperCase(),
                                      style: TextStyle(
                                          fontSize: 10,
                                          fontWeight: FontWeight.bold,
                                          color: status == 'pending'
                                              ? Colors.orange.shade700
                                              : status == 'confirmed'
                                                  ? Colors.green.shade700
                                                  : Colors.black54),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  name,
                                  style: const TextStyle(
                                      fontSize: 12, fontWeight: FontWeight.w600),
                                ),
                                const SizedBox(height: 12),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text(
                                      '${method.toUpperCase()} • PAYMENT: ${payStatus.toUpperCase()}',
                                      style: const TextStyle(
                                          fontSize: 9, color: Colors.grey, fontWeight: FontWeight.bold),
                                    ),
                                    Text(
                                      '\$${total.toStringAsFixed(2)}',
                                      style: const TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 13),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    },
                  ),
          ),
        )
      ],
    );
  }
}
