import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

final insight503020Provider = NotifierProvider<Insight503020Notifier, bool>(() {
  return Insight503020Notifier();
});

class Insight503020Notifier extends Notifier<bool> {
  @override
  bool build() {
    _load();
    return false; // Default synchronous state
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
