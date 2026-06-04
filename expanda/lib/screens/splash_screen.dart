import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/settings_provider.dart';

class SplashScreen extends ConsumerStatefulWidget {
  const SplashScreen({super.key});

  @override
  ConsumerState<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends ConsumerState<SplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _coinPosition;
  late Animation<double> _coinScale;
  late Animation<double> _pandaOpacity;
  late Animation<double> _coinFinalScale;
  late Animation<double> _coinFinalOpacity;

  @override
  void initState() {
    super.initState();
    SystemChrome.setEnabledSystemUIMode(SystemUiMode.immersive);

    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2500),
    );

    // 1. Coin pops out from ear position to head center (bouncy curve)
    _coinPosition = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.0, 0.45, curve: Curves.easeOutBack),
      ),
    );

    // Coin scales up slightly during pop out
    _coinScale = Tween<double>(begin: 1.0, end: 1.8).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.0, 0.45, curve: Curves.easeOut),
      ),
    );

    // 2. Rest of the panda face fades out (completely invisible when coin reaches center)
    _pandaOpacity = Tween<double>(begin: 1.0, end: 0.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.0, 0.40, curve: Curves.easeOut),
      ),
    );

    // 3. Coin final zoom scaling to transition into app
    _coinFinalScale = Tween<double>(begin: 1.0, end: 6.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.75, 1.0, curve: Curves.easeInOutExpo),
      ),
    );

    // Coin final fade out
    _coinFinalOpacity = Tween<double>(begin: 1.0, end: 0.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.85, 1.0, curve: Curves.easeOut),
      ),
    );

    _controller.addStatusListener((status) {
      if (status == AnimationStatus.completed) {
        _navigateToNext();
      }
    });

    _controller.forward();
  }

  @override
  void dispose() {
    SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge);
    _controller.dispose();
    super.dispose();
  }

  void _navigateToNext() {
    if (!mounted) return;
    final settings = ref.read(settingsProvider);
    if (!settings.onboardingComplete) {
      context.go('/onboarding');
    } else if (settings.biometricEnabled || settings.pinEnabled) {
      context.go('/lock');
    } else {
      context.go('/home');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black, // Sleek dark mode background
      body: AnimatedBuilder(
        animation: _controller,
        builder: (context, _) {
          // Compute compound values
          final progress = _coinPosition.value;
          
          // Before final phase, scale is _coinScale. During final phase, it is multiplied by _coinFinalScale.
          final scale = _coinScale.value * _coinFinalScale.value;
          
          final pandaOpa = _controller.value >= 0.40 ? 0.0 : _pandaOpacity.value;
          
          // Before final phase, opacity is 1. During final phase, it fades out.
          final coinOpa = _coinFinalOpacity.value;

          return CustomPaint(
            painter: SplashPainter(
              coinProgress: progress,
              coinScale: scale,
              pandaOpacity: pandaOpa,
              coinOpacity: coinOpa,
            ),
            child: const SizedBox.expand(),
          );
        },
      ),
    );
  }
}

class SplashPainter extends CustomPainter {
  final double coinProgress;
  final double coinScale;
  final double pandaOpacity;
  final double coinOpacity;

  SplashPainter({
    required this.coinProgress,
    required this.coinScale,
    required this.pandaOpacity,
    required this.coinOpacity,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final centerX = size.width / 2;
    final centerY = size.height / 2;
    final headRadius = min(size.width, size.height) * 0.24;

    // Head center
    final headCenter = Offset(centerX, centerY + headRadius * 0.15);

    // Ear centers (relative to head center)
    final leftEarCenter =
        Offset(headCenter.dx - headRadius * 0.8, headCenter.dy - headRadius * 0.8);
    final rightEarInitialCenter =
        Offset(headCenter.dx + headRadius * 0.8, headCenter.dy - headRadius * 0.8);

    // Interpolated Coin position
    final coinCenter = Offset.lerp(rightEarInitialCenter, headCenter, coinProgress)!;

    final paintPanda = Paint()
      ..color = Colors.white.withOpacity(pandaOpacity)
      ..style = PaintingStyle.fill;

    final paintPandaOutline = Paint()
      ..color = const Color(0xFFD4AF37).withOpacity(pandaOpacity) // Gold
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3.5;

    // 1. Draw Left Ear (Gold Circle Outline)
    if (pandaOpacity > 0) {
      canvas.drawCircle(leftEarCenter, headRadius * 0.35, paintPandaOutline);
    }

    // 2. Draw Panda Head
    if (pandaOpacity > 0) {
      canvas.drawCircle(headCenter, headRadius, paintPanda);
      
      // Head shadow or stroke
      final headOutlinePaint = Paint()
        ..color = Colors.black.withOpacity(pandaOpacity * 0.1)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2;
      canvas.drawCircle(headCenter, headRadius, headOutlinePaint);

      // 3. Draw Eyes (black patches, gold pupils)
      final eyeWidth = headRadius * 0.36;
      final eyeHeight = headRadius * 0.28;

      final leftEyePatchCenter =
          Offset(headCenter.dx - headRadius * 0.35, headCenter.dy - headRadius * 0.05);
      final rightEyePatchCenter =
          Offset(headCenter.dx + headRadius * 0.35, headCenter.dy - headRadius * 0.05);

      final patchPaint = Paint()
        ..color = Colors.black.withOpacity(pandaOpacity)
        ..style = PaintingStyle.fill;

      // Draw rotated left eye patch
      canvas.save();
      canvas.translate(leftEyePatchCenter.dx, leftEyePatchCenter.dy);
      canvas.rotate(0.2);
      canvas.drawOval(
          Rect.fromCenter(center: Offset.zero, width: eyeWidth, height: eyeHeight),
          patchPaint);
      canvas.restore();

      // Draw rotated right eye patch
      canvas.save();
      canvas.translate(rightEyePatchCenter.dx, rightEyePatchCenter.dy);
      canvas.rotate(-0.2);
      canvas.drawOval(
          Rect.fromCenter(center: Offset.zero, width: eyeWidth, height: eyeHeight),
          patchPaint);
      canvas.restore();

      // Draw pupils
      final pupilPaint = Paint()
        ..color = const Color(0xFFD4AF37).withOpacity(pandaOpacity)
        ..style = PaintingStyle.fill;

      canvas.drawCircle(
          leftEyePatchCenter + Offset(headRadius * 0.05, -headRadius * 0.02),
          headRadius * 0.06,
          pupilPaint);
      canvas.drawCircle(
          rightEyePatchCenter + Offset(-headRadius * 0.05, -headRadius * 0.02),
          headRadius * 0.06,
          pupilPaint);

      // 4. Draw Nose
      final noseCenter = Offset(headCenter.dx, headCenter.dy + headRadius * 0.2);
      final nosePaint = Paint()
        ..color = Colors.black.withOpacity(pandaOpacity)
        ..style = PaintingStyle.fill;
      canvas.drawRRect(
          RRect.fromRectAndRadius(
              Rect.fromCenter(
                  center: noseCenter, width: headRadius * 0.22, height: headRadius * 0.12),
              Radius.circular(headRadius * 0.06)),
          nosePaint);

      // 5. Draw Mouth (w-shape curve)
      final mouthPaint = Paint()
        ..color = Colors.black.withOpacity(pandaOpacity)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2.5
        ..strokeCap = StrokeCap.round;

      final mouthPath = Path();
      final leftMouthCenter = noseCenter + Offset(-headRadius * 0.08, headRadius * 0.15);
      final rightMouthCenter = noseCenter + Offset(headRadius * 0.08, headRadius * 0.15);

      mouthPath.moveTo(noseCenter.dx, noseCenter.dy + headRadius * 0.08);
      mouthPath.quadraticBezierTo(
          noseCenter.dx - headRadius * 0.05,
          noseCenter.dy + headRadius * 0.16,
          leftMouthCenter.dx,
          leftMouthCenter.dy);

      mouthPath.moveTo(noseCenter.dx, noseCenter.dy + headRadius * 0.08);
      mouthPath.quadraticBezierTo(
          noseCenter.dx + headRadius * 0.05,
          noseCenter.dy + headRadius * 0.16,
          rightMouthCenter.dx,
          rightMouthCenter.dy);

      canvas.drawPath(mouthPath, mouthPaint);
    }

    // 6. Draw Right Ear / Rupee Coin
    if (coinOpacity > 0) {
      final coinRadius = headRadius * 0.35 * coinScale;

      // Gold solid circle background
      final coinBgPaint = Paint()
        ..color = const Color(0xFFD4AF37).withOpacity(coinOpacity)
        ..style = PaintingStyle.fill;

      canvas.drawCircle(coinCenter, coinRadius, coinBgPaint);

      // Inner border
      final coinBorderPaint = Paint()
        ..color = Colors.white.withOpacity(coinOpacity * 0.6)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 1.8 * (coinScale > 1 ? sqrt(coinScale) : coinScale);
      canvas.drawCircle(coinCenter, coinRadius - 3.0 * (coinScale > 1 ? sqrt(coinScale) : coinScale), coinBorderPaint);

      // Rupee text symbol
      final textPainter = TextPainter(
        text: TextSpan(
          text: '₹',
          style: TextStyle(
            color: Colors.white.withOpacity(coinOpacity),
            fontSize: coinRadius * 1.1,
            fontWeight: FontWeight.bold,
            fontFamily: 'Roboto',
          ),
        ),
        textDirection: TextDirection.ltr,
      );
      textPainter.layout();
      textPainter.paint(
        canvas,
        Offset(
          coinCenter.dx - textPainter.width / 2,
          coinCenter.dy - textPainter.height / 2,
        ),
      );
    }
  }

  @override
  bool shouldRepaint(covariant SplashPainter oldDelegate) => true;
}
