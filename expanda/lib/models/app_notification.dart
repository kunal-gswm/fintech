import 'package:hive/hive.dart';

@HiveType(typeId: 3)
class AppNotification extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String title;

  @HiveField(2)
  final String body;

  @HiveField(3)
  final String type; // 'budget_exceeded', 'goal_due', 'weekly_digest', 'achievement'

  @HiveField(4)
  final DateTime timestamp;

  @HiveField(5)
  bool isRead;

  @HiveField(6)
  final String? route; // Route to navigate when tapped

  AppNotification({
    required this.id,
    required this.title,
    required this.body,
    required this.type,
    DateTime? timestamp,
    this.isRead = false,
    this.route,
  }) : timestamp = timestamp ?? DateTime.now();

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'body': body,
        'type': type,
        'timestamp': timestamp.toIso8601String(),
        'isRead': isRead,
        'route': route,
      };

  factory AppNotification.fromJson(Map<String, dynamic> json) =>
      AppNotification(
        id: json['id'] as String,
        title: json['title'] as String,
        body: json['body'] as String,
        type: json['type'] as String,
        timestamp: json['timestamp'] != null
            ? DateTime.parse(json['timestamp'] as String)
            : DateTime.now(),
        isRead: json['isRead'] as bool? ?? false,
        route: json['route'] as String?,
      );
}
