import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/impulse_item.dart';
import '../services/hive_service.dart';

final impulseProvider = NotifierProvider<ImpulseNotifier, List<ImpulseItem>>(() {
  return ImpulseNotifier();
});

class ImpulseNotifier extends Notifier<List<ImpulseItem>> {
  @override
  List<ImpulseItem> build() {
    return HiveService.getAllImpulseItems();
  }

  Future<void> addImpulse(ImpulseItem item) async {
    await HiveService.addImpulseItem(item);
    state = HiveService.getAllImpulseItems();
  }

  Future<void> removeImpulse(String id) async {
    await HiveService.deleteImpulseItem(id);
    state = HiveService.getAllImpulseItems();
  }

  double getTotalSkipped() {
    return state.fold(0.0, (sum, item) => sum + item.amount);
  }
}
