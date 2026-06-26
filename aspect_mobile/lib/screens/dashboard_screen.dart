import 'package:flutter/material.dart';
import 'login_screen.dart';
import 'orders_screen.dart';
import 'inventory_screen.dart';
import 'analytics_screen.dart';
import '../services/database_service.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _currentIndex = 0;
  final _dbService = DatabaseService();

  List<Map<String, dynamic>> _orders = [];
  List<Map<String, dynamic>> _products = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() {
      _isLoading = true;
    });

    final fetchedProducts = await _dbService.getProducts();
    final fetchedOrders = await _dbService.getOrders();

    setState(() {
      _products = fetchedProducts;
      _orders = fetchedOrders;
      _isLoading = false;
    });
  }

  // Calculate metrics
  double get _totalRevenue {
    return _orders
        .where((o) => o['payment_status'] == 'paid')
        .fold(0.0, (sum, o) => sum + (double.tryParse(o['total_amount'].toString()) ?? 0.0));
  }

  int get _pendingCodCount {
    return _orders
        .where((o) => o['payment_method'] == 'cod' && o['payment_status'] == 'pending')
        .length;
  }

  void _handleLogout() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => const LoginScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    // List of screens passing loaded data and refresh callback
    final List<Widget> screens = [
      _buildDashboardHome(),
      OrdersScreen(orders: _orders, onRefresh: _loadData),
      InventoryScreen(products: _products, onRefresh: _loadData),
      AnalyticsScreen(orders: _orders),
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFFBFBFB),
      appBar: AppBar(
        title: const Text(
          'ASPECT',
          style: TextStyle(
            fontFamily: 'Serif',
            fontSize: 20,
            fontWeight: FontWeight.w400,
            letterSpacing: 4.0,
            color: Color(0xFF171717),
          ),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: Colors.black),
            onPressed: _loadData,
          ),
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.black54),
            onPressed: _handleLogout,
          ),
        ],
      ),
      body: _isLoading
          ? const Center(
              child: CircularProgressIndicator(color: Color(0xFF171717)),
            )
          : screens[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        type: BottomNavigationBarType.fixed,
        backgroundColor: Colors.white,
        selectedItemColor: const Color(0xFF171717),
        unselectedItemColor: Colors.black38,
        selectedLabelStyle: const TextStyle(
            fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 0.5),
        unselectedLabelStyle: const TextStyle(fontSize: 10, letterSpacing: 0.5),
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard_outlined),
            activeIcon: Icon(Icons.dashboard),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.shopping_bag_outlined),
            activeIcon: Icon(Icons.shopping_bag),
            label: 'Orders',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.inventory_2_outlined),
            activeIcon: Icon(Icons.inventory_2),
            label: 'Inventory',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.analytics_outlined),
            activeIcon: Icon(Icons.analytics),
            label: 'Analytics',
          ),
        ],
      ),
    );
  }

  // Dashboard Home View Widget
  Widget _buildDashboardHome() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Operational Summary',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: Color(0xFF171717),
            ),
          ),
          const SizedBox(height: 4),
          const Text(
            'Aspect contemporary fashion control center',
            style: TextStyle(fontSize: 12, color: Colors.grey),
          ),
          const SizedBox(height: 24),

          // Metrics Grid
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisSpacing: 16,
            mainAxisSpacing: 16,
            childAspectRatio: 1.4,
            children: [
              _buildMetricCard(
                'REVENUE',
                '\$${_totalRevenue.toStringAsFixed(2)}',
                Icons.trending_up,
                Colors.green,
              ),
              _buildMetricCard(
                'PENDING COD',
                '$_pendingCodCount Orders',
                Icons.warning_amber_rounded,
                Colors.redAccent,
              ),
              _buildMetricCard(
                'TOTAL ORDERS',
                '${_orders.length}',
                Icons.receipt_long,
                Colors.blueGrey,
              ),
              _buildMetricCard(
                'PRODUCTS',
                '${_products.length}',
                Icons.checkroom,
                const Color(0xFF171717),
              ),
            ],
          ),
          const SizedBox(height: 32),

          // Recent Activity Panel
          const Text(
            'Recent Orders',
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.bold,
              color: Color(0xFF171717),
            ),
          ),
          const SizedBox(height: 16),
          if (_orders.isEmpty)
            const Center(
              child: Padding(
                padding: EdgeInsets.symmetric(vertical: 24.0),
                child: Text('No orders recorded yet.',
                    style: TextStyle(color: Colors.grey, fontSize: 13)),
              ),
            )
          else
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: _orders.length > 5 ? 5 : _orders.length,
              itemBuilder: (context, index) {
                final order = _orders[index];
                final code = order['order_code'] ?? 'ASP-XXXXXX';
                final client = order['customer_name'] ?? 'Guest';
                final total = double.tryParse(order['total_amount'].toString()) ?? 0.0;
                final status = order['order_status'] ?? 'pending';

                return Card(
                  elevation: 0,
                  margin: const EdgeInsets.only(bottom: 12),
                  color: Colors.white,
                  shape: RoundedRectangleBorder(
                    side: const BorderSide(color: Color(0xFFEEEEEE)),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: ListTile(
                    contentPadding: const EdgeInsets.symmetric(
                        horizontal: 16, vertical: 4),
                    title: Text(
                      code,
                      style: const TextStyle(
                          fontWeight: FontWeight.bold, fontSize: 13, fontFeatures: [FontFeature.tabularFigures()]),
                    ),
                    subtitle: Text(
                      '$client • \$${total.toStringAsFixed(2)}',
                      style: const TextStyle(fontSize: 11, color: Colors.grey),
                    ),
                    trailing: Chip(
                      label: Text(
                        status.toUpperCase(),
                        style: const TextStyle(
                            fontSize: 9,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 0.5),
                      ),
                      backgroundColor: status == 'pending'
                          ? Colors.orange.shade50
                          : status == 'confirmed'
                              ? Colors.green.shade50
                              : Colors.grey.shade100,
                      labelStyle: TextStyle(
                        color: status == 'pending'
                            ? Colors.orange.shade700
                            : status == 'confirmed'
                                ? Colors.green.shade700
                                : Colors.black54,
                      ),
                      padding: EdgeInsets.zero,
                      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    ),
                  ),
                );
              },
            ),
        ],
      ),
    );
  }

  Widget _buildMetricCard(
      String title, String val, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: const Color(0xFFEEEEEE)),
        borderRadius: BorderRadius.circular(4),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title,
                style: const TextStyle(
                    fontSize: 9,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1.0,
                    color: Colors.grey),
              ),
              Icon(icon, color: color, size: 20),
            ],
          ),
          Text(
            val,
            style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Color(0xFF171717)),
          ),
        ],
      ),
    );
  }
}
