// GENERATED CODE - hand-written Hive adapter for ImpulseItem
// Replaces build_runner generation for simplicity

part of 'impulse_item.dart';
class ImpulseItemAdapter extends TypeAdapter<ImpulseItem> {
  @override
  final int typeId = 5;

  @override
  ImpulseItem read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return ImpulseItem(
      id: fields[0] as String,
      title: fields[1] as String,
      amount: fields[2] as double,
      dateSkipped: fields[3] as DateTime,
      category: fields[4] as String?,
    );
  }

  @override
  void write(BinaryWriter writer, ImpulseItem obj) {
    writer
      ..writeByte(5)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.title)
      ..writeByte(2)
      ..write(obj.amount)
      ..writeByte(3)
      ..write(obj.dateSkipped)
      ..writeByte(4)
      ..write(obj.category);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is ImpulseItemAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
