import 'package:flutter/material.dart';

class AnalyticsScreen extends StatelessWidget {
  final List<Map<String, dynamic>> orders;

  const AnalyticsScreen({super.key, required this.orders});

  @override
  Widget build(BuildContext context) {
    // 1. Calculate stats
    double totalRevenue = 0.0;
    int paidOrdersCount = 0;
    int pendingOrdersCount = 0;
    
    int codCount = 0;
    int onlineCount = 0;

    Map<String, int> categorySales = {};

    for (var order in orders) {
      final total = double.tryParse(order['total_amount'].toString()) ?? 0.0;
      final payStatus = order['payment_status'] ?? 'pending';
      final method = order['payment_method'] ?? 'cod';

      if (payStatus == 'paid') {
        totalRevenue += total;
        paidOrdersCount++;
      } else {
        pendingOrdersCount++;
      }

      if (method == 'cod') {
        codCount++;
      } else {
        onlineCount++;
      }

      // Aggregate category counts from order items
      final items = order['order_items'] as List<dynamic>? ?? [];
      for (var item in items) {
        final qty = item['quantity'] as int? ?? 0;
        final prodId = item['product_id']?.toString() ?? 'unknown';
        // Mock category categorization by item naming for dashboard analytics representation
        final prodName = (item['products']?['name'] ?? '').toString();
        
        String cat = 'Essentials';
        if (prodName.toLowerCase().contains('trench') || prodName.toLowerCase().contains('jacket') || prodName.toLowerCase().contains('cardigan')) {
          cat = 'Outerwear';
        } else if (prodName.toLowerCase().contains('trouser') || prodName.toLowerCase().contains('pants')) {
          cat = 'Pants';
        }

        categorySales[cat] = (categorySales[cat] ?? 0) + qty;
      }
    }

    final totalMethodsCount = codCount + onlineCount;
    final codPercentage = totalMethodsCount > 0 ? (codCount / totalMethodsCount) : 0.0;
    final onlinePercentage = totalMethodsCount > 0 ? (onlineCount / totalMethodsCount) : 0.0;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Sales Analytics',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: Color(0xFF171717),
            ),
          ),
          const SizedBox(height: 4),
          const Text(
            'Operational revenue and transaction trends',
            style: TextStyle(fontSize: 12, color: Colors.grey),
          ),
          const SizedBox(height: 24),

          // Total Earnings Summary Card
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(24),
            decoration: const BoxDecoration(
              color: Color(0xFF171717),
              borderRadius: BorderRadius.zero,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'CONFIRMED VALUATED SALES',
                  style: TextStyle(
                      fontSize: 9,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.5,
                      color: Colors.white60),
                ),
                const SizedBox(height: 12),
                Text(
                  '\$${totalRevenue.toStringAsFixed(2)}',
                  style: const TextStyle(
                      fontSize: 32,
                      fontFamily: 'Serif',
                      fontWeight: FontWeight.bold,
                      color: Colors.white),
                ),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    _buildRevenueSubStat('PAID ORDERS', '$paidOrdersCount', Colors.green),
                    _buildRevenueSubStat('PENDING ACTIONS', '$pendingOrdersCount', Colors.orange),
                  ],
                )
              ],
            ),
          ),
          const SizedBox(height: 32),

          // Payment Methods bar charts
          const Text(
            'Payment Methods Ratio',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: Color(0xFF171717),
            ),
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              border: Border.all(color: const Color(0xFFEEEEEE)),
            ),
            child: Column(
              children: [
                Row(
                  children: [
                    Expanded(
                      flex: (codPercentage * 100).toInt(),
                      child: Container(
                        height: 24,
                        color: const Color(0xFF2C3E50),
                      ),
                    ),
                    Expanded(
                      flex: (onlinePercentage * 100).toInt(),
                      child: Container(
                        height: 24,
                        color: const Color(0xFF18BC9C),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Container(width: 12, height: 12, color: const Color(0xFF2C3E50)),
                        const SizedBox(width: 8),
                        Text('Cash on Delivery ($codCount)', style: const TextStyle(fontSize: 12)),
                      ],
                    ),
                    Row(
                      children: [
                        Container(width: 12, height: 12, color: const Color(0xFF18BC9C)),
                        const SizedBox(width: 8),
                        Text('Online Payment ($onlineCount)', style: const TextStyle(fontSize: 12)),
                      ],
                    ),
                  ],
                )
              ],
            ),
          ),
          const SizedBox(height: 32),

          // Categories Breakdown Chart
          const Text(
            'Quantity Sold by Style Category',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: Color(0xFF171717),
            ),
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              border: Border.all(color: const Color(0xFFEEEEEE)),
            ),
            child: categorySales.isEmpty
                ? const Center(
                    child: Padding(
                      padding: EdgeInsets.symmetric(vertical: 16.0),
                      child: Text('No product items purchased to calculate categorizations.', style: TextStyle(fontSize: 12, color: Colors.grey)),
                    ),
                  )
                : Column(
                    children: categorySales.entries.map((entry) {
                      final name = entry.key;
                      final val = entry.value;

                      return Padding(
                        padding: const EdgeInsets.only(bottom: 12.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(name.toUpperCase(), style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 0.5)),
                                Text('$val items', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                              ],
                            ),
                            const SizedBox(height: 6),
                            LinearProgressIndicator(
                              value: val / 20.0, // Assuming 20 items is the benchmark limit representation
                              backgroundColor: const Color(0xFFEEEEEE),
                              color: const Color(0xFF171717),
                              minHeight: 6,
                            )
                          ],
                        ),
                      );
                    }).toList(),
                  ),
          ),
          const SizedBox(height: 20),
        ],
      ),
    );
  }

  Widget _buildRevenueSubStat(String title, String val, Color badgeColor) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(fontSize: 8, color: Colors.white60, letterSpacing: 1.0, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 4),
        Row(
          children: [
            Container(
              width: 6,
              height: 6,
              decoration: BoxDecoration(
                color: badgeColor,
                shape: BoxShape.circle,
              ),
            ),
            const SizedBox(width: 6),
            Text(
              val,
              style: const TextStyle(fontSize: 13, color: Colors.white, fontWeight: FontWeight.bold),
            ),
          ],
        )
      ],
    );
  }
}
