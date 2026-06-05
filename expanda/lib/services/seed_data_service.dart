import 'package:uuid/uuid.dart';
import '../models/expense.dart';
import '../models/goal.dart';
import '../services/hive_service.dart';
import '../data/excel_seed_data.dart';

class SeedDataService {
  static Future<void> seedDatabase() async {
    final expensesBox = HiveService.expensesBox;
    final goalsBox = HiveService.goalsBox;

    // Clear existing expenses to insert fresh Excel data
    await expensesBox.clear();

    final uuid = const Uuid();
    final now = DateTime.now();

    // Add a goal (e.g. Bike)
    if (goalsBox.isEmpty) {
      final bikeGoal = Goal(
        id: uuid.v4(),
        title: 'New Bike',
        targetAmount: 150000,
        savedAmount: 45000,
        category: 'Vehicle',
        deadline: DateTime(now.year + 1, now.month, now.day),
        iconName: 'directions_car_rounded',
        createdAt: now.subtract(const Duration(days: 365)),
      );
      await goalsBox.put(bikeGoal.id, bikeGoal);
    }

    final Map<String, Expense> newExpenses = {};

    for (final row in excelSeedData) {
      final type = row['type'] as String;
      if (type.toLowerCase() == 'income') continue; // We only want expenses

      final dateStr = row['date'] as String;
      DateTime parsedDate;
      try {
        parsedDate = DateTime.parse(dateStr);
      } catch (e) {
        // Fallback for messy dates
        parsedDate = DateTime.now();
      }

      final category = row['category'] as String;
      final desc = row['description'] as String;
      final amt = (row['amount'] as num).toDouble();

      String icon = 'more_horiz_rounded';
      if (category.toLowerCase().contains('food')) icon = 'restaurant_rounded';
      else if (category.toLowerCase().contains('rent')) icon = 'apartment_rounded';
      else if (category.toLowerCase().contains('travel')) icon = 'directions_car_rounded';
      else if (category.toLowerCase().contains('electricity')) icon = 'receipt_long_rounded';
      else if (category.toLowerCase().contains('entertainment')) icon = 'local_movies_rounded';

      final e = Expense(
        id: uuid.v4(),
        title: desc,
        amount: amt,
        category: category,
        date: parsedDate,
        paymentMethod: 'Card',
        iconName: icon,
      );
      newExpenses[e.id] = e;
    }

    if (newExpenses.isNotEmpty) {
      await expensesBox.putAll(newExpenses);
    }

    // Set monthly income to 20k
    final settings = HiveService.getSettings();
    final updatedSettings = settings.copyWith(monthlyIncome: 20000);
    await HiveService.saveSettings(updatedSettings);
  }
}
