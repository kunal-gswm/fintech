import 'package:hive/hive.dart';

part 'impulse_item.g.dart';

@HiveType(typeId: 5)
class ImpulseItem extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String title;

  @HiveField(2)
  final double amount;

  @HiveField(3)
  final DateTime dateSkipped;

  @HiveField(4)
  final String? category;

  ImpulseItem({
    required this.id,
    required this.title,
    required this.amount,
    required this.dateSkipped,
    this.category,
  });
}
