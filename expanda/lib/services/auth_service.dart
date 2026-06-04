import 'package:flutter/services.dart';
import 'package:local_auth/local_auth.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'dart:convert';
import 'dart:math';

/// Service for handling biometric authentication and PIN management.
class AuthService {
  static final LocalAuthentication _localAuth = LocalAuthentication();
  static const FlutterSecureStorage _secureStorage = FlutterSecureStorage();

  static const String _pinKey = 'user_pin_hash';
  static const String _pinSaltKey = 'user_pin_salt';

  // ── Biometric ─────────────────────────────────────────────────────────

  /// Check if biometric authentication is available on this device.
  static Future<bool> isBiometricAvailable() async {
    try {
      final isAvailable = await _localAuth.canCheckBiometrics;
      final isDeviceSupported = await _localAuth.isDeviceSupported();
      return isAvailable && isDeviceSupported;
    } on PlatformException {
      return false;
    }
  }

  /// Authenticate using biometrics (fingerprint / Face ID).
  static Future<bool> authenticateWithBiometrics() async {
    try {
      return await _localAuth.authenticate(
        localizedReason: 'Unlock EXPANDA',
        options: const AuthenticationOptions(
          stickyAuth: true,
          biometricOnly: true,
        ),
      );
    } on PlatformException {
      return false;
    }
  }

  // ── PIN ────────────────────────────────────────────────────────────────

  /// Check if a PIN has been set.
  static Future<bool> isPinSet() async {
    final hash = await _secureStorage.read(key: _pinKey);
    return hash != null && hash.isNotEmpty;
  }

  /// Set or change the PIN.
  static Future<void> setPin(String pin) async {
    final salt = _generateSalt();
    final hash = _hashPin(pin, salt);
    await _secureStorage.write(key: _pinSaltKey, value: salt);
    await _secureStorage.write(key: _pinKey, value: hash);
  }

  /// Verify the entered PIN against the stored hash.
  static Future<bool> verifyPin(String pin) async {
    final storedHash = await _secureStorage.read(key: _pinKey);
    final storedSalt = await _secureStorage.read(key: _pinSaltKey);
    if (storedHash == null || storedSalt == null) return false;
    final hash = _hashPin(pin, storedSalt);
    return hash == storedHash;
  }

  /// Remove the PIN.
  static Future<void> removePin() async {
    await _secureStorage.delete(key: _pinKey);
    await _secureStorage.delete(key: _pinSaltKey);
  }

  // ── Private helpers ───────────────────────────────────────────────────

  static String _generateSalt() {
    final random = Random.secure();
    final bytes = List<int>.generate(16, (_) => random.nextInt(256));
    return base64Url.encode(bytes);
  }

  /// Simple hash: base64(salt + pin). In production, use a proper KDF.
  static String _hashPin(String pin, String salt) {
    final combined = '$salt:$pin';
    final bytes = utf8.encode(combined);
    // Use a simple hash for now — upgrade to crypto package for SHA-256 if needed.
    int hash = 0;
    for (final byte in bytes) {
      hash = ((hash << 5) - hash + byte) & 0xFFFFFFFF;
    }
    return base64Url.encode(utf8.encode('$salt:$hash'));
  }
}
