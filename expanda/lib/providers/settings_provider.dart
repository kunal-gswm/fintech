import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/user_settings.dart';
import '../services/hive_service.dart';

final settingsProvider =
    NotifierProvider<SettingsNotifier, UserSettings>(() {
  return SettingsNotifier();
});

class SettingsNotifier extends Notifier<UserSettings> {
  @override
  UserSettings build() {
    return HiveService.getSettings();
  }

  Future<void> update(UserSettings settings) async {
    await HiveService.saveSettings(settings);
    state = settings;
  }

  Future<void> completeOnboarding({
    required String currency,
    required double monthlyIncome,
    required double monthlyBudgetLimit,
    required bool biometricEnabled,
  }) async {
    final updated = state.copyWith(
      currency: currency,
      monthlyIncome: monthlyIncome,
      monthlyBudgetLimit: monthlyBudgetLimit,
      biometricEnabled: biometricEnabled,
      onboardingComplete: true,
    );
    await HiveService.saveSettings(updated);
    state = updated;
  }

  Future<void> updateProfile({
    String? firstName,
    String? lastName,
    String? email,
    String? phone,
    String? avatarPath,
  }) async {
    final updated = state.copyWith(
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      avatarPath: avatarPath,
    );
    await HiveService.saveSettings(updated);
    state = updated;
  }

  Future<void> toggleBiometric(bool enabled) async {
    final updated = state.copyWith(biometricEnabled: enabled);
    await HiveService.saveSettings(updated);
    state = updated;
  }

  Future<void> togglePin(bool enabled) async {
    final updated = state.copyWith(pinEnabled: enabled);
    await HiveService.saveSettings(updated);
    state = updated;
  }
}
