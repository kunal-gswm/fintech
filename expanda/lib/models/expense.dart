import 'package:hive/hive.dart';


@HiveType(typeId: 0)
class Expense extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  String title;

  @HiveField(2)
  double amount;

  @HiveField(3)
  String category;

  @HiveField(4)
  DateTime date;

  @HiveField(5)
  String? notes;

  @HiveField(6)
  bool isRecurring;

  @HiveField(7)
  String? recurrenceRule; // 'daily', 'weekly', 'monthly'

  @HiveField(8)
  String? receiptImagePath;

  Expense({
    required this.id,
    required this.title,
    required this.amount,
    required this.category,
    required this.date,
    this.notes,
    this.isRecurring = false,
    this.recurrenceRule,
    this.receiptImagePath,
  });

  Expense copyWith({
    String? id,
    String? title,
    double? amount,
    String? category,
    DateTime? date,
    String? notes,
    bool? isRecurring,
    String? recurrenceRule,
    String? receiptImagePath,
  }) {
    return Expense(
      id: id ?? this.id,
      title: title ?? this.title,
      amount: amount ?? this.amount,
      category: category ?? this.category,
      date: date ?? this.date,
      notes: notes ?? this.notes,
      isRecurring: isRecurring ?? this.isRecurring,
      recurrenceRule: recurrenceRule ?? this.recurrenceRule,
      receiptImagePath: receiptImagePath ?? this.receiptImagePath,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'amount': amount,
        'category': category,
        'date': date.toIso8601String(),
        'notes': notes,
        'isRecurring': isRecurring,
        'recurrenceRule': recurrenceRule,
        'receiptImagePath': receiptImagePath,
      };

  factory Expense.fromJson(Map<String, dynamic> json) => Expense(
        id: json['id'] as String,
        title: json['title'] as String,
        amount: (json['amount'] as num).toDouble(),
        category: json['category'] as String,
        date: DateTime.parse(json['date'] as String),
        notes: json['notes'] as String?,
        isRecurring: json['isRecurring'] as bool? ?? false,
        recurrenceRule: json['recurrenceRule'] as String?,
        receiptImagePath: json['receiptImagePath'] as String?,
      );
}
