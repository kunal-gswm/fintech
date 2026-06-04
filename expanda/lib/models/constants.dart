import 'package:flutter/material.dart';

/// Expense categories and their associated colors / icons
class AppConstants {
  AppConstants._();

  static const List<String> expenseCategories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Groceries',
    'Subscriptions',
    'Other',
  ];

  static const Map<String, Color> categoryColors = {
    'Food & Dining': Color(0xFFEF4444),
    'Transportation': Color(0xFF3B82F6),
    'Shopping': Color(0xFFF59E0B),
    'Entertainment': Color(0xFF8B5CF6),
    'Bills & Utilities': Color(0xFF10B981),
    'Healthcare': Color(0xFFEC4899),
    'Education': Color(0xFF06B6D4),
    'Travel': Color(0xFFF97316),
    'Groceries': Color(0xFF84CC16),
    'Subscriptions': Color(0xFF6366F1),
    'Other': Color(0xFF64748B),
  };

  static const Map<String, IconData> categoryIcons = {
    'Food & Dining': Icons.restaurant_rounded,
    'Transportation': Icons.directions_car_rounded,
    'Shopping': Icons.shopping_bag_rounded,
    'Entertainment': Icons.movie_rounded,
    'Bills & Utilities': Icons.receipt_long_rounded,
    'Healthcare': Icons.local_hospital_rounded,
    'Education': Icons.school_rounded,
    'Travel': Icons.flight_rounded,
    'Groceries': Icons.local_grocery_store_rounded,
    'Subscriptions': Icons.subscriptions_rounded,
    'Other': Icons.more_horiz_rounded,
  };

  static const Map<String, IconData> goalIcons = {
    'Emergency Fund': Icons.shield_rounded,
    'Travel': Icons.flight_rounded,
    'Education': Icons.school_rounded,
    'Vehicle': Icons.directions_car_rounded,
    'House': Icons.home_rounded,
    'Health': Icons.favorite_rounded,
    'Custom': Icons.flag_rounded,
  };

  static const Map<String, Color> goalColors = {
    'Emergency Fund': Color(0xFF10B981),
    'Travel': Color(0xFFF97316),
    'Education': Color(0xFF3B82F6),
    'Vehicle': Color(0xFF8B5CF6),
    'House': Color(0xFFEC4899),
    'Health': Color(0xFFEF4444),
    'Custom': Color(0xFF6366F1),
  };

  static const List<String> currencies = ['INR', 'USD', 'EUR', 'GBP'];

  static const Map<String, String> currencySymbols = {
    'INR': '₹',
    'USD': '\$',
    'EUR': '€',
    'GBP': '£',
  };

  // Hive box names
  static const String expensesBox = 'expenses';
  static const String goalsBox = 'goals';
  static const String chatBox = 'chat_history';
  static const String notificationsBox = 'notifications';
  static const String settingsBox = 'settings';
}
