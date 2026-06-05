import 'package:hive_flutter/hive_flutter.dart';
import '../models/expense.dart';
import '../models/expense.g.dart';
import '../models/goal.dart';
import '../models/goal.g.dart';
import '../models/chat_message.dart';
import '../models/chat_message.g.dart';
import '../models/app_notification.dart';
import '../models/app_notification.g.dart';
import '../models/user_settings.dart';
import '../models/user_settings.g.dart';
import '../models/impulse_item.dart';
import '../models/debt_item.dart';
import '../models/constants.dart';

/// Initializes Hive and registers all type adapters.
/// Must be called before runApp().
class HiveService {
  static Future<void> init() async {
    await Hive.initFlutter();

    // Register adapters
    Hive.registerAdapter(ExpenseAdapter());
    Hive.registerAdapter(GoalAdapter());
    Hive.registerAdapter(ChatMessageAdapter());
    Hive.registerAdapter(AppNotificationAdapter());
    Hive.registerAdapter(UserSettingsAdapter());
    Hive.registerAdapter(ImpulseItemAdapter());
    Hive.registerAdapter(DebtItemAdapter());

    // Open boxes
    await Hive.openBox<Expense>(AppConstants.expensesBox);
    await Hive.openBox<Goal>(AppConstants.goalsBox);
    await Hive.openBox<ChatMessage>(AppConstants.chatBox);
    await Hive.openBox<AppNotification>(AppConstants.notificationsBox);
    await Hive.openBox<UserSettings>(AppConstants.settingsBox);
    await Hive.openBox<ImpulseItem>(AppConstants.impulseBox);
    await Hive.openBox<DebtItem>(AppConstants.debtBox);
  }

  // ── Expenses ──────────────────────────────────────────────────────────

  static Box<Expense> get expensesBox =>
      Hive.box<Expense>(AppConstants.expensesBox);

  static List<Expense> getAllExpenses() {
    final list = expensesBox.values.toList();
    list.sort((a, b) => b.date.compareTo(a.date));
    return list;
  }

  static Future<void> addExpense(Expense expense) async {
    await expensesBox.put(expense.id, expense);
  }

  static Future<void> updateExpense(Expense expense) async {
    await expensesBox.put(expense.id, expense);
  }

  static Future<void> deleteExpense(String id) async {
    await expensesBox.delete(id);
  }

  static Future<void> deleteExpenses(List<String> ids) async {
    await expensesBox.deleteAll(ids);
  }

  // ── Goals ─────────────────────────────────────────────────────────────

  static Box<Goal> get goalsBox => Hive.box<Goal>(AppConstants.goalsBox);

  static List<Goal> getAllGoals() {
    final list = goalsBox.values.toList();
    list.sort((a, b) => a.deadline.compareTo(b.deadline));
    return list;
  }

  static Future<void> addGoal(Goal goal) async {
    await goalsBox.put(goal.id, goal);
  }

  static Future<void> updateGoal(Goal goal) async {
    await goalsBox.put(goal.id, goal);
  }

  static Future<void> deleteGoal(String id) async {
    await goalsBox.delete(id);
  }

  // ── Chat History ──────────────────────────────────────────────────────

  static Box<ChatMessage> get chatBox =>
      Hive.box<ChatMessage>(AppConstants.chatBox);

  static List<ChatMessage> getChatHistory() {
    final list = chatBox.values.toList();
    list.sort((a, b) => a.timestamp.compareTo(b.timestamp));
    return list;
  }

  static Future<void> addMessage(ChatMessage message) async {
    await chatBox.put(message.id, message);
  }

  static Future<void> clearChat() async {
    await chatBox.clear();
  }

  // ── Notifications ─────────────────────────────────────────────────────

  static Box<AppNotification> get notificationsBox =>
      Hive.box<AppNotification>(AppConstants.notificationsBox);

  static List<AppNotification> getAllNotifications() {
    final list = notificationsBox.values.toList();
    list.sort((a, b) => b.timestamp.compareTo(a.timestamp));
    return list;
  }

  static int get unreadCount =>
      notificationsBox.values.where((n) => !n.isRead).length;

  static Future<void> addNotification(AppNotification notification) async {
    await notificationsBox.put(notification.id, notification);
  }

  static Future<void> markAsRead(String id) async {
    final n = notificationsBox.get(id);
    if (n != null) {
      n.isRead = true;
      await n.save();
    }
  }

  static Future<void> markAllAsRead() async {
    for (final n in notificationsBox.values) {
      if (!n.isRead) {
        n.isRead = true;
        await n.save();
      }
    }
  }

  static Future<void> deleteNotification(String id) async {
    await notificationsBox.delete(id);
  }

  // ── Settings ──────────────────────────────────────────────────────────

  static Box<UserSettings> get settingsBox =>
      Hive.box<UserSettings>(AppConstants.settingsBox);

  static UserSettings getSettings() {
    return settingsBox.get('user_settings') ?? UserSettings();
  }

  static Future<void> saveSettings(UserSettings settings) async {
    await settingsBox.put('user_settings', settings);
  }

  // ── Impulse Graveyard ──────────────────────────────────────────────────

  static Box<ImpulseItem> get impulseBox =>
      Hive.box<ImpulseItem>(AppConstants.impulseBox);

  static List<ImpulseItem> getAllImpulseItems() {
    final list = impulseBox.values.toList();
    list.sort((a, b) => b.dateSkipped.compareTo(a.dateSkipped));
    return list;
  }

  static Future<void> addImpulseItem(ImpulseItem item) async {
    await impulseBox.put(item.id, item);
  }

  static Future<void> deleteImpulseItem(String id) async {
    await impulseBox.delete(id);
  }

  // ── Debt Items ─────────────────────────────────────────────────────────

  static Box<DebtItem> get debtBox =>
      Hive.box<DebtItem>(AppConstants.debtBox);

  static List<DebtItem> getAllDebtItems() {
    final list = debtBox.values.toList();
    list.sort((a, b) => b.interestRate.compareTo(a.interestRate)); // Avalanche method
    return list;
  }

  static Future<void> addDebtItem(DebtItem item) async {
    await debtBox.put(item.id, item);
  }

  static Future<void> deleteDebtItem(String id) async {
    await debtBox.delete(id);
  }

  // ── Export / Import ───────────────────────────────────────────────────

  static Map<String, dynamic> exportAllData() {
    return {
      'expenses': getAllExpenses().map((e) => e.toJson()).toList(),
      'goals': getAllGoals().map((g) => g.toJson()).toList(),
      'chat_history': getChatHistory().map((m) => m.toJson()).toList(),
      'notifications': getAllNotifications().map((n) => n.toJson()).toList(),
      'settings': getSettings().toJson(),
    };
  }

  static Future<void> importAllData(Map<String, dynamic> data) async {
    // Expenses
    if (data['expenses'] is List) {
      await expensesBox.clear();
      for (final e in data['expenses']) {
        final expense = Expense.fromJson(e as Map<String, dynamic>);
        await expensesBox.put(expense.id, expense);
      }
    }
    // Goals
    if (data['goals'] is List) {
      await goalsBox.clear();
      for (final g in data['goals']) {
        final goal = Goal.fromJson(g as Map<String, dynamic>);
        await goalsBox.put(goal.id, goal);
      }
    }
    // Chat
    if (data['chat_history'] is List) {
      await chatBox.clear();
      for (final m in data['chat_history']) {
        final msg = ChatMessage.fromJson(m as Map<String, dynamic>);
        await chatBox.put(msg.id, msg);
      }
    }
    // Notifications
    if (data['notifications'] is List) {
      await notificationsBox.clear();
      for (final n in data['notifications']) {
        final notif = AppNotification.fromJson(n as Map<String, dynamic>);
        await notificationsBox.put(notif.id, notif);
      }
    }
    // Settings
    if (data['settings'] is Map) {
      final settings =
          UserSettings.fromJson(data['settings'] as Map<String, dynamic>);
      await settingsBox.put('user_settings', settings);
    }
  }
}
