// GENERATED CODE - hand-written Hive adapter for UserSettings

import 'package:hive/hive.dart';
import 'user_settings.dart';

class UserSettingsAdapter extends TypeAdapter<UserSettings> {
  @override
  final int typeId = 4;

  @override
  UserSettings read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return UserSettings(
      currency: fields[0] as String? ?? 'INR',
      monthlyIncome: fields[1] as double? ?? 0,
      monthlyBudgetLimit: fields[2] as double? ?? 50000,
      savingsGoalPercent: fields[3] as double? ?? 30,
      emergencyFundMonths: fields[4] as int? ?? 6,
      biometricEnabled: fields[5] as bool? ?? false,
      autoCategorize: fields[6] as bool? ?? true,
      weeklyDigest: fields[7] as bool? ?? true,
      firstName: fields[8] as String? ?? '',
      lastName: fields[9] as String? ?? '',
      email: fields[10] as String? ?? '',
      phone: fields[11] as String? ?? '',
      avatarPath: fields[12] as String?,
      onboardingComplete: fields[13] as bool? ?? false,
      pinEnabled: fields[14] as bool? ?? false,
    );
  }

  @override
  void write(BinaryWriter writer, UserSettings obj) {
    writer
      ..writeByte(15)
      ..writeByte(0)
      ..write(obj.currency)
      ..writeByte(1)
      ..write(obj.monthlyIncome)
      ..writeByte(2)
      ..write(obj.monthlyBudgetLimit)
      ..writeByte(3)
      ..write(obj.savingsGoalPercent)
      ..writeByte(4)
      ..write(obj.emergencyFundMonths)
      ..writeByte(5)
      ..write(obj.biometricEnabled)
      ..writeByte(6)
      ..write(obj.autoCategorize)
      ..writeByte(7)
      ..write(obj.weeklyDigest)
      ..writeByte(8)
      ..write(obj.firstName)
      ..writeByte(9)
      ..write(obj.lastName)
      ..writeByte(10)
      ..write(obj.email)
      ..writeByte(11)
      ..write(obj.phone)
      ..writeByte(12)
      ..write(obj.avatarPath)
      ..writeByte(13)
      ..write(obj.onboardingComplete)
      ..writeByte(14)
      ..write(obj.pinEnabled);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is UserSettingsAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
