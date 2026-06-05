import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/debt_item.dart';
import '../services/hive_service.dart';

final debtProvider = NotifierProvider<DebtNotifier, List<DebtItem>>(() {
  return DebtNotifier();
});

class DebtNotifier extends Notifier<List<DebtItem>> {
  @override
  List<DebtItem> build() {
    return HiveService.getAllDebtItems();
  }

  Future<void> addDebt(DebtItem item) async {
    await HiveService.addDebtItem(item);
    state = HiveService.getAllDebtItems();
  }

  Future<void> removeDebt(String id) async {
    await HiveService.deleteDebtItem(id);
    state = HiveService.getAllDebtItems();
  }
}
