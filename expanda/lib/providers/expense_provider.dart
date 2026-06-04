import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/expense.dart';
import '../services/hive_service.dart';
import 'package:uuid/uuid.dart';

const _uuid = Uuid();

/// Provides the full list of expenses, sorted by date descending.
final expenseListProvider =
    NotifierProvider<ExpenseNotifier, List<Expense>>(() {
  return ExpenseNotifier();
});

/// Multi-select mode state for expense list.
final expenseSelectionProvider =
    NotifierProvider<SelectionNotifier, Set<String>>(() {
  return SelectionNotifier();
});

class ExpenseNotifier extends Notifier<List<Expense>> {
  @override
  List<Expense> build() {
    return HiveService.getAllExpenses();
  }

  Future<void> refresh() async {
    state = HiveService.getAllExpenses();
  }

  Future<void> add({
    required String title,
    required double amount,
    required String category,
    required DateTime date,
    String? notes,
    bool isRecurring = false,
    String? recurrenceRule,
    String? receiptImagePath,
  }) async {
    final expense = Expense(
      id: _uuid.v4(),
      title: title,
      amount: amount,
      category: category,
      date: date,
      notes: notes,
      isRecurring: isRecurring,
      recurrenceRule: recurrenceRule,
      receiptImagePath: receiptImagePath,
    );
    await HiveService.addExpense(expense);
    state = HiveService.getAllExpenses();
  }

  Future<void> update(Expense expense) async {
    await HiveService.updateExpense(expense);
    state = HiveService.getAllExpenses();
  }

  Future<void> delete(String id) async {
    await HiveService.deleteExpense(id);
    state = HiveService.getAllExpenses();
  }

  Future<void> deleteMultiple(Set<String> ids) async {
    await HiveService.deleteExpenses(ids.toList());
    state = HiveService.getAllExpenses();
  }

  /// Get expenses for a date range.
  List<Expense> getForRange(DateTime start, DateTime end) {
    return state.where((e) =>
        e.date.isAfter(start.subtract(const Duration(days: 1))) &&
        e.date.isBefore(end.add(const Duration(days: 1)))).toList();
  }

  /// Get total amount for the last N days.
  double totalForLastDays(int days) {
    final cutoff = DateTime.now().subtract(Duration(days: days));
    return state
        .where((e) => e.date.isAfter(cutoff))
        .fold(0.0, (sum, e) => sum + e.amount);
  }

  /// Get expenses grouped by category for a date range.
  Map<String, double> categoryBreakdown({DateTime? start, DateTime? end}) {
    var filtered = state;
    if (start != null && end != null) {
      filtered = getForRange(start, end);
    }
    final map = <String, double>{};
    for (final e in filtered) {
      map[e.category] = (map[e.category] ?? 0) + e.amount;
    }
    return map;
  }
}

class SelectionNotifier extends Notifier<Set<String>> {
  @override
  Set<String> build() => {};

  void toggle(String id) {
    if (state.contains(id)) {
      state = {...state}..remove(id);
    } else {
      state = {...state, id};
    }
  }

  void clear() {
    state = {};
  }

  bool get isActive => state.isNotEmpty;
}
