import 'package:hive/hive.dart';


@HiveType(typeId: 1)
class Goal extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  String title;

  @HiveField(2)
  double targetAmount;

  @HiveField(3)
  double savedAmount;

  @HiveField(4)
  String category;

  @HiveField(5)
  DateTime deadline;

  @HiveField(6)
  String iconName;

  @HiveField(7)
  bool isArchived;

  @HiveField(8)
  DateTime createdAt;

  Goal({
    required this.id,
    required this.title,
    required this.targetAmount,
    this.savedAmount = 0,
    required this.category,
    required this.deadline,
    this.iconName = 'savings',
    this.isArchived = false,
    DateTime? createdAt,
  }) : createdAt = createdAt ?? DateTime.now();

  double get progress =>
      targetAmount > 0 ? (savedAmount / targetAmount).clamp(0.0, 1.0) : 0;

  double get remaining => (targetAmount - savedAmount).clamp(0, targetAmount);

  int get monthsLeft {
    final now = DateTime.now();
    final diff = (deadline.year - now.year) * 12 + (deadline.month - now.month);
    return diff.clamp(1, 999);
  }

  double get monthlyTarget => remaining / monthsLeft;

  bool get isCompleted => savedAmount >= targetAmount;

  Goal copyWith({
    String? id,
    String? title,
    double? targetAmount,
    double? savedAmount,
    String? category,
    DateTime? deadline,
    String? iconName,
    bool? isArchived,
    DateTime? createdAt,
  }) {
    return Goal(
      id: id ?? this.id,
      title: title ?? this.title,
      targetAmount: targetAmount ?? this.targetAmount,
      savedAmount: savedAmount ?? this.savedAmount,
      category: category ?? this.category,
      deadline: deadline ?? this.deadline,
      iconName: iconName ?? this.iconName,
      isArchived: isArchived ?? this.isArchived,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'targetAmount': targetAmount,
        'savedAmount': savedAmount,
        'category': category,
        'deadline': deadline.toIso8601String(),
        'iconName': iconName,
        'isArchived': isArchived,
        'createdAt': createdAt.toIso8601String(),
      };

  factory Goal.fromJson(Map<String, dynamic> json) => Goal(
        id: json['id'] as String,
        title: json['title'] as String,
        targetAmount: (json['targetAmount'] as num).toDouble(),
        savedAmount: (json['savedAmount'] as num?)?.toDouble() ?? 0,
        category: json['category'] as String,
        deadline: DateTime.parse(json['deadline'] as String),
        iconName: json['iconName'] as String? ?? 'savings',
        isArchived: json['isArchived'] as bool? ?? false,
        createdAt: json['createdAt'] != null
            ? DateTime.parse(json['createdAt'] as String)
            : DateTime.now(),
      );
}
