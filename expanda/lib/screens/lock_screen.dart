import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import '../services/auth_service.dart';

class LockScreen extends StatefulWidget {
  const LockScreen({super.key});

  @override
  State<LockScreen> createState() => _LockScreenState();
}

class _LockScreenState extends State<LockScreen> {
  String _pin = '';
  int _failedAttempts = 0;
  bool _coolingDown = false;
  int _cooldownSeconds = 30;
  String? _error;

  @override
  void initState() {
    super.initState();
    _tryBiometric();
  }

  Future<void> _tryBiometric() async {
    final available = await AuthService.isBiometricAvailable();
    if (available) {
      final success = await AuthService.authenticateWithBiometrics();
      if (success && mounted) {
        context.go('/home');
      }
    }
  }

  Future<void> _onPinComplete() async {
    if (_coolingDown) return;

    final correct = await AuthService.verifyPin(_pin);
    if (correct) {
      HapticFeedback.mediumImpact();
      if (mounted) context.go('/home');
    } else {
      HapticFeedback.heavyImpact();
      _failedAttempts++;
      if (_failedAttempts >= 5) {
        _startCooldown();
      }
      setState(() {
        _pin = '';
        _error = _coolingDown
            ? 'Too many attempts. Wait $_cooldownSeconds seconds.'
            : 'Incorrect PIN. ${5 - _failedAttempts} attempts remaining.';
      });
    }
  }

  void _startCooldown() {
    setState(() {
      _coolingDown = true;
      _cooldownSeconds = 30;
    });
    Future.doWhile(() async {
      await Future.delayed(const Duration(seconds: 1));
      if (!mounted) return false;
      setState(() => _cooldownSeconds--);
      if (_cooldownSeconds <= 0) {
        setState(() {
          _coolingDown = false;
          _failedAttempts = 0;
          _error = null;
        });
        return false;
      }
      return true;
    });
  }

  void _onDigit(String digit) {
    if (_coolingDown || _pin.length >= 6) return;
    HapticFeedback.lightImpact();
    setState(() {
      _pin += digit;
      _error = null;
    });
    if (_pin.length == 6) {
      _onPinComplete();
    }
  }

  void _onBackspace() {
    if (_pin.isEmpty) return;
    HapticFeedback.lightImpact();
    setState(() {
      _pin = _pin.substring(0, _pin.length - 1);
      _error = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 40),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Logo
                ClipRRect(
                  borderRadius: BorderRadius.circular(22),
                  child: Image.asset(
                    'assets/logo.jpg',
                    width: 80,
                    height: 80,
                    fit: BoxFit.cover,
                  ),
                ),
                const SizedBox(height: 32),
                Text('Enter PIN', style: theme.textTheme.titleLarge),
                const SizedBox(height: 8),
                Text('Enter your 6-digit PIN to unlock',
                    style: theme.textTheme.bodyMedium),
                const SizedBox(height: 32),

                // PIN dots
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: List.generate(6, (i) {
                    final filled = i < _pin.length;
                    return AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      margin: const EdgeInsets.symmetric(horizontal: 8),
                      width: 16,
                      height: 16,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: filled
                            ? theme.colorScheme.primary
                            : Colors.transparent,
                        border: Border.all(
                          color: _error != null
                              ? theme.colorScheme.error
                              : theme.colorScheme.outline,
                          width: 2,
                        ),
                      ),
                    );
                  }),
                ),

                // Error
                if (_error != null) ...[
                  const SizedBox(height: 16),
                  Text(
                    _error!,
                    style: theme.textTheme.bodySmall
                        ?.copyWith(color: theme.colorScheme.error),
                    textAlign: TextAlign.center,
                  ),
                ],

                const SizedBox(height: 40),

                // Keypad
                _buildKeypad(theme),

                const SizedBox(height: 24),

                // Biometric button
                TextButton.icon(
                  onPressed: _tryBiometric,
                  icon: const Icon(Icons.fingerprint_rounded, size: 28),
                  label: const Text('Use Biometrics'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildKeypad(ThemeData theme) {
    const digits = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['', '0', '⌫'],
    ];

    return Column(
      children: digits.map((row) {
        return Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: row.map((d) {
            if (d.isEmpty) {
              return const SizedBox(width: 80, height: 64);
            }
            if (d == '⌫') {
              return SizedBox(
                width: 80,
                height: 64,
                child: IconButton(
                  onPressed: _onBackspace,
                  icon: const Icon(Icons.backspace_outlined, size: 22),
                ),
              );
            }
            return SizedBox(
              width: 80,
              height: 64,
              child: TextButton(
                onPressed: _coolingDown ? null : () => _onDigit(d),
                style: TextButton.styleFrom(
                  shape: const CircleBorder(),
                ),
                child: Text(
                  d,
                  style: const TextStyle(
                      fontSize: 24, fontWeight: FontWeight.w500),
                ),
              ),
            );
          }).toList(),
        );
      }).toList(),
    );
  }
}
