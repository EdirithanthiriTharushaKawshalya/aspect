import 'package:flutter/material.dart';
import '../services/database_service.dart';

class InventoryScreen extends StatefulWidget {
  final List<Map<String, dynamic>> products;
  final Future<void> Function() onRefresh;

  const InventoryScreen({super.key, required this.products, required this.onRefresh});

  @override
  State<InventoryScreen> createState() => _InventoryScreenState();
}

class _InventoryScreenState extends State<InventoryScreen> {
  final _dbService = DatabaseService();
  final _formKey = GlobalKey<FormState>();

  // Add Product Form Controller States
  final _nameController = TextEditingController();
  final _descController = TextEditingController();
  final _priceController = TextEditingController();
  final _imageController = TextEditingController();
  final _stockController = TextEditingController();
  String _selectedCategory = 'Outerwear';
  final List<String> _selectedSizes = ['S', 'M', 'L', 'XL'];

  final List<String> _categories = ['Outerwear', 'Essentials', 'Pants'];
  final List<String> _allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  // Toggle size selection
  void _toggleSize(String size) {
    setState(() {
      if (_selectedSizes.contains(size)) {
        _selectedSizes.remove(size);
      } else {
        _selectedSizes.add(size);
      }
    });
  }

  // Update stock level dialog
  void _showUpdateStockDialog(Map<String, dynamic> product) {
    final stockController = TextEditingController(text: product['stock_quantity'].toString());
    
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text(product['name'] ?? 'Update Stock', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, fontFamily: 'Serif')),
          content: TextField(
            controller: stockController,
            keyboardType: TextInputType.number,
            decoration: const InputDecoration(
              labelText: 'Stock Units',
              focusedBorder: UnderlineInputBorder(borderSide: BorderSide(color: Colors.black)),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('CANCEL', style: TextStyle(color: Colors.grey, fontSize: 11, fontWeight: FontWeight.bold)),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF171717)),
              onPressed: () async {
                final qty = int.tryParse(stockController.text) ?? 0;
                final ok = await _dbService.updateProductStock(product['id'], qty);
                if (ok && mounted) {
                  Navigator.pop(context);
                  widget.onRefresh();
                }
              },
              child: const Text('UPDATE', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
            ),
          ],
        );
      },
    );
  }

  // Open Full Screen creation bottom panel
  void _showAddProductSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(16))),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setSheetState) {
            return Padding(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(context).viewInsets.bottom,
                left: 24,
                right: 24,
                top: 24,
              ),
              child: SingleChildScrollView(
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('CREATE CATALOG ENTRY',
                              style: TextStyle(
                                  fontFamily: 'Serif',
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                  letterSpacing: 1.0)),
                          IconButton(
                            icon: const Icon(Icons.close),
                            onPressed: () => Navigator.pop(context),
                          ),
                        ],
                      ),
                      const Divider(),
                      const SizedBox(height: 16),

                      TextFormField(
                        controller: _nameController,
                        decoration: const InputDecoration(labelText: 'Garment Name'),
                        validator: (v) => v == null || v.isEmpty ? 'Enter name' : null,
                      ),
                      const SizedBox(height: 16),

                      TextFormField(
                        controller: _descController,
                        decoration: const InputDecoration(labelText: 'Description'),
                      ),
                      const SizedBox(height: 16),

                      Row(
                        children: [
                          Expanded(
                            child: TextFormField(
                              controller: _priceController,
                              keyboardType: const TextInputType.numberWithOptions(decimal: true),
                              decoration: const InputDecoration(labelText: 'Price (\$)'),
                              validator: (v) => v == null || double.tryParse(v) == null ? 'Enter valid price' : null,
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: TextFormField(
                              controller: _stockController,
                              keyboardType: TextInputType.number,
                              decoration: const InputDecoration(labelText: 'Initial Stock Units'),
                              validator: (v) => v == null || int.tryParse(v) == null ? 'Enter valid stock' : null,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),

                      DropdownButtonFormField<String>(
                        value: _selectedCategory,
                        decoration: const InputDecoration(labelText: 'Category'),
                        items: _categories.map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(),
                        onChanged: (v) {
                          if (v != null) {
                            setSheetState(() {
                              _selectedCategory = v;
                            });
                          }
                        },
                      ),
                      const SizedBox(height: 20),

                      const Text('AVAILABLE SIZES', style: TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 8),
                      Wrap(
                        spacing: 8,
                        children: _allSizes.map((sz) {
                          final isSelected = _selectedSizes.contains(sz);
                          return FilterChip(
                            label: Text(sz, style: const TextStyle(fontSize: 10)),
                            selected: isSelected,
                            onSelected: (b) {
                              setSheetState(() {
                                if (b) {
                                  _selectedSizes.add(sz);
                                } else {
                                  _selectedSizes.remove(sz);
                                }
                              });
                            },
                            shape: const RoundedRectangleBorder(borderRadius: BorderRadius.zero),
                            selectedColor: Colors.black12,
                          );
                        }).toList(),
                      ),
                      const SizedBox(height: 20),

                      TextFormField(
                        controller: _imageController,
                        decoration: const InputDecoration(
                          labelText: 'Image Unsplash URL',
                          hintText: 'https://images.unsplash.com/...',
                        ),
                      ),
                      const SizedBox(height: 32),

                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF171717),
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 18),
                            shape: const RoundedRectangleBorder(borderRadius: BorderRadius.zero),
                          ),
                          onPressed: () async {
                            if (!_formKey.currentState!.validate()) return;

                            final payload = {
                              'name': _nameController.text,
                              'description': _descController.text,
                              'price': double.parse(_priceController.text),
                              'stock_quantity': int.parse(_stockController.text),
                              'in_stock': int.parse(_stockController.text) > 0,
                              'category': _selectedCategory,
                              'sizes': _selectedSizes,
                              'image_url': _imageController.text.trim().isEmpty 
                                  ? 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600'
                                  : _imageController.text.trim(),
                            };

                            final res = await _dbService.createProduct(payload);
                            if (res != null && mounted) {
                              Navigator.pop(context);
                              _nameController.clear();
                              _descController.clear();
                              _priceController.clear();
                              _stockController.clear();
                              _imageController.clear();
                              widget.onRefresh();
                            }
                          },
                          child: const Text('CREATE CATALOG ENTRY', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.0)),
                        ),
                      ),
                      const SizedBox(height: 24),
                    ],
                  ),
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
    return Scaffold(
      backgroundColor: const Color(0xFFFBFBFB),
      body: widget.products.isEmpty
          ? const Center(
              child: Text('No garments in active catalog.', style: TextStyle(color: Colors.grey, fontSize: 13)),
            )
          : GridView.builder(
              padding: const EdgeInsets.all(16.0),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                childAspectRatio: 0.72,
              ),
              itemCount: widget.products.length,
              itemBuilder: (context, index) {
                final product = widget.products[index];
                final name = product['name'] ?? 'Garment';
                final imgUrl = product['image_url'] ?? '';
                final price = double.tryParse(product['price'].toString()) ?? 0.0;
                final qty = product['stock_quantity'] ?? 0;
                final sizes = List<dynamic>.from(product['sizes'] ?? []);

                return Card(
                  elevation: 0,
                  color: Colors.white,
                  shape: RoundedRectangleBorder(
                    side: const BorderSide(color: Color(0xFFEEEEEE)),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Product image cover
                      Expanded(
                        child: Container(
                          width: double.infinity,
                          decoration: BoxDecoration(
                            color: const Color(0xFFF5F5F5),
                            image: imgUrl.isNotEmpty
                                ? DecorationImage(
                                    image: NetworkImage(imgUrl),
                                    fit: BoxFit.cover,
                                  )
                                : null,
                          ),
                        ),
                      ),

                      // Card body details
                      Padding(
                        padding: const EdgeInsets.all(10.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              name,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                  fontSize: 12, fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '\$${price.toStringAsFixed(2)}',
                              style: const TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w600,
                                  color: Colors.black87),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Stock: $qty pcs',
                              style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                  color: qty <= 5 ? Colors.redAccent : Colors.grey),
                            ),
                            const SizedBox(height: 8),

                            // Sizes & Actions
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                // Size lists
                                Expanded(
                                  child: Text(
                                    sizes.join(', '),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(
                                        fontSize: 9,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.grey),
                                  ),
                                ),

                                // Edit stock button
                                Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    IconButton(
                                      icon: const Icon(Icons.edit_note, size: 20),
                                      padding: EdgeInsets.zero,
                                      constraints: const BoxConstraints(),
                                      onPressed: () => _showUpdateStockDialog(product),
                                    ),
                                    const SizedBox(width: 8),
                                    IconButton(
                                      icon: const Icon(Icons.delete_outline, size: 18, color: Colors.black54),
                                      padding: EdgeInsets.zero,
                                      constraints: const BoxConstraints(),
                                      onPressed: () async {
                                        final confirm = await showDialog<bool>(
                                          context: context,
                                          builder: (context) => AlertDialog(
                                            title: const Text('Delete Entry', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, fontFamily: 'Serif')),
                                            content: const Text('Remove this product from active catalog?'),
                                            actions: [
                                              TextButton(
                                                onPressed: () => Navigator.pop(context, false),
                                                child: const Text('CANCEL', style: TextStyle(color: Colors.grey, fontSize: 11, fontWeight: FontWeight.bold)),
                                              ),
                                              ElevatedButton(
                                                style: ElevatedButton.styleFrom(backgroundColor: Colors.redAccent),
                                                onPressed: () => Navigator.pop(context, true),
                                                child: const Text('DELETE', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                                              ),
                                            ],
                                          ),
                                        );

                                        if (confirm == true) {
                                          final ok = await _dbService.deleteProduct(product['id']);
                                          if (ok) {
                                            widget.onRefresh();
                                          }
                                        }
                                      },
                                    ),
                                  ],
                                )
                              ],
                            ),
                          ],
                        ),
                      )
                    ],
                  ),
                );
              },
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: _showAddProductSheet,
        backgroundColor: const Color(0xFF171717),
        shape: const RoundedRectangleBorder(borderRadius: BorderRadius.zero),
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }
}

