import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'screens/splash_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Supabase configuration parameters
  await Supabase.initialize(
    url: 'https://vvfcizdfhknfjwstkzja.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2ZmNpemRmaGtuZmp3c3RremphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0NzI3MzgsImV4cCI6MjA5ODA0ODczOH0.cY0mZSLfOM9v5Mg3xsYeN6iQaN_SO3YzmqwCT0Z18BY',
  );

  runApp(const AspectAdminApp());
}

class AspectAdminApp extends StatelessWidget {
  const AspectAdminApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ASPECT Console',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        primaryColor: const Color(0xFF171717),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF171717),
          primary: const Color(0xFF171717),
          secondary: const Color(0xFF737373),
          background: Colors.white,
        ),
        // Premium minimalist input decoration themes
        inputDecorationTheme: InputDecorationTheme(
          labelStyle: const TextStyle(fontSize: 11, color: Colors.grey, letterSpacing: 0.5),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(4),
            borderSide: const BorderSide(color: Color(0xFFE5E5E5)),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(4),
            borderSide: const BorderSide(color: Color(0xFF171717)),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(4),
            borderSide: const BorderSide(color: Color(0xFFE5E5E5)),
          ),
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        ),
        // Set default font styling
        fontFamily: 'Roboto',
      ),
      home: const SplashScreen(),
    );
  }
}
