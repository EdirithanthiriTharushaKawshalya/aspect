import 'dart:async';
import 'package:flutter/material.dart';
import 'login_screen.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();

    // Fade-in animation for the logo
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    );
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeIn),
    );

    _animationController.forward();

    // Navigate to LoginScreen after 2.5 seconds
    Timer(const Duration(milliseconds: 2500), () {
      if (mounted) {
        Navigator.pushReplacement(
          context,
          PageRouteBuilder(
            pageBuilder: (context, animation, secondaryAnimation) => const LoginScreen(),
            transitionsBuilder: (context, animation, secondaryAnimation, child) {
              return FadeTransition(opacity: animation, child: child);
            },
            transitionDuration: const Duration(milliseconds: 600),
          ),
        );
      }
    });
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        children: [
          // Centered ASPECT Logo
          Center(
            child: FadeTransition(
              opacity: _fadeAnimation,
              child: const Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    'ASPECT',
                    style: TextStyle(
                      fontFamily: 'Serif',
                      fontSize: 42,
                      fontWeight: FontWeight.w300,
                      letterSpacing: 10.0,
                      color: Color(0xFF171717),
                    ),
                  ),
                  SizedBox(height: 4),
                  Text(
                    'STAFF CONSOLE',
                    style: TextStyle(
                      fontSize: 9,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 2.5,
                      color: Colors.grey,
                    ),
                  ),
                ],
              ),
            ),
          ),
          // Minimalist bottom loader
          Positioned(
            bottom: 80,
            left: 0,
            right: 0,
            child: Center(
              child: SizedBox(
                width: 48,
                height: 1.5,
                child: LinearProgressIndicator(
                  color: const Color(0xFF171717),
                  backgroundColor: Colors.grey.shade100,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
