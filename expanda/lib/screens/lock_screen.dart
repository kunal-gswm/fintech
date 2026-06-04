import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../services/auth_service.dart';
import '../providers/settings_provider.dart';

class LockScreen extends ConsumerStatefulWidget {
  const LockScreen({super.key});

  @override
  ConsumerState<LockScreen> createState() => _LockScreenState();
}

class _LockScreenState extends ConsumerState<LockScreen> {
  String _pin = '';
  int _failedAttempts = 0;
  bool _coolingDown = false;
  int _cooldownSeconds = 30;
  String? _error;

  @override
  void initState() {
    super.initState();
    _checkPinAndBiometric();
  }

  Future<void> _checkPinAndBiometric() async {
    final pinSet = await AuthService.isPinSet();
    if (!pinSet) {
      // Auto-disable lock options in settings to prevent user lockout
      await ref.read(settingsProvider.notifier).toggleBiometric(false);
      await ref.read(settingsProvider.notifier).togglePin(false);
      if (mounted) {
        context.go('/home');
      }
      return;
    }
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
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Card(
              elevation: 8,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(28),
                side: BorderSide(
                  color: theme.colorScheme.outline.withValues(alpha: 0.1),
                  width: 1,
                ),
              ),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 32),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
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
                    const SizedBox(height: 24),
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
                          margin: const EdgeInsets.symmetric(horizontal: 10),
                          width: 22,
                          height: 22,
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

                    const SizedBox(height: 32),

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
              return const SizedBox(width: 90, height: 76);
            }
            if (d == '⌫') {
              return SizedBox(
                width: 90,
                height: 76,
                child: IconButton(
                  onPressed: _onBackspace,
                  icon: const Icon(Icons.backspace_outlined, size: 26),
                ),
              );
            }
            return SizedBox(
              width: 90,
              height: 76,
              child: TextButton(
                onPressed: _coolingDown ? null : () => _onDigit(d),
                style: TextButton.styleFrom(
                  shape: const CircleBorder(),
                ),
                child: Text(
                  d,
                  style: const TextStyle(
                      fontSize: 28, fontWeight: FontWeight.w600),
                ),
              ),
            );
          }).toList(),
        );
      }).toList(),
    );
  }
}
