import 'package:hive/hive.dart';

part 'debt_item.g.dart';

@HiveType(typeId: 6)
class DebtItem extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String name;

  @HiveField(2)
  double principal;

  @HiveField(3)
  double interestRate;

  @HiveField(4)
  double minimumPayment;

  DebtItem({
    required this.id,
    required this.name,
    required this.principal,
    required this.interestRate,
    required this.minimumPayment,
  });
}
