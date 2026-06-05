import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

final insight503020Provider = StateNotifierProvider<Insight503020Notifier, bool>((ref) {
  return Insight503020Notifier();
});

class Insight503020Notifier extends StateNotifier<bool> {
  Insight503020Notifier() : super(false) {
    _load();
  }

  Future<void> _load() async {
    final prefs = await SharedPreferences.getInstance();
    state = prefs.getBool('enable503020Insight') ?? false;
  }

  Future<void> toggle(bool enabled) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('enable503020Insight', enabled);
    state = enabled;
  }
}
