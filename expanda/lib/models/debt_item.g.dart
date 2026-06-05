// GENERATED CODE - hand-written Hive adapter for DebtItem
// Replaces build_runner generation for simplicity

import 'package:hive/hive.dart';
import 'debt_item.dart';

class DebtItemAdapter extends TypeAdapter<DebtItem> {
  @override
  final int typeId = 6;

  @override
  DebtItem read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return DebtItem(
      id: fields[0] as String,
      name: fields[1] as String,
      principal: fields[2] as double,
      interestRate: fields[3] as double,
      minimumPayment: fields[4] as double,
    );
  }

  @override
  void write(BinaryWriter writer, DebtItem obj) {
    writer
      ..writeByte(5)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.name)
      ..writeByte(2)
      ..write(obj.principal)
      ..writeByte(3)
      ..write(obj.interestRate)
      ..writeByte(4)
      ..write(obj.minimumPayment);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is DebtItemAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
