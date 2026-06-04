import 'package:uuid/uuid.dart';
import '../models/expense.dart';
import '../models/goal.dart';
import '../services/hive_service.dart';

class SeedDataService {
  static Future<void> seedDatabase() async {
    final expensesBox = HiveService.expensesBox;
    final goalsBox = HiveService.goalsBox;

    // Only seed if empty
    if (expensesBox.isNotEmpty || goalsBox.isNotEmpty) {
      return;
    }

    final uuid = const Uuid();
    final now = DateTime.now();

    // Add a goal (e.g. Bike)
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

    // Seed 12 months of expenses
    for (int i = 0; i < 12; i++) {
      final monthDate = DateTime(now.year, now.month - i, 15);

      // Rent: 9k
      final rent = Expense(
        id: uuid.v4(),
        title: 'Flat Rent',
        amount: 9000,
        category: 'Rent',
        date: monthDate,
        paymentMethod: 'UPI',
        iconName: 'apartment_rounded',
      );

      // Food: 2k
      final food = Expense(
        id: uuid.v4(),
        title: 'Groceries & Dining',
        amount: 2000,
        category: 'Food & Dining',
        date: monthDate.add(const Duration(days: 2)),
        paymentMethod: 'UPI',
        iconName: 'restaurant_rounded',
      );

      // Electricity: 1k
      final elec = Expense(
        id: uuid.v4(),
        title: 'Electricity Bill',
        amount: 1000,
        category: 'Bills & Utilities',
        date: monthDate.add(const Duration(days: 5)),
        paymentMethod: 'Card',
        iconName: 'receipt_long_rounded',
      );

      // Travel: 2k
      final travel = Expense(
        id: uuid.v4(),
        title: 'Commute',
        amount: 2000,
        category: 'Transportation',
        date: monthDate.add(const Duration(days: 8)),
        paymentMethod: 'Cash',
        iconName: 'directions_car_rounded',
      );

      // Misc: 1.5k
      final misc = Expense(
        id: uuid.v4(),
        title: 'Miscellaneous',
        amount: 1500,
        category: 'Other',
        date: monthDate.add(const Duration(days: 10)),
        paymentMethod: 'UPI',
        iconName: 'more_horiz_rounded',
      );

      await expensesBox.putAll({
        rent.id: rent,
        food.id: food,
        elec.id: elec,
        travel.id: travel,
        misc.id: misc,
      });
    }

    // Set monthly income to 20k
    final settings = HiveService.getSettings();
    final updatedSettings = settings.copyWith(monthlyIncome: 20000);
    await HiveService.saveSettings(updatedSettings);
  }
}
