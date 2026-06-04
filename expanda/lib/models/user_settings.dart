import 'package:hive/hive.dart';


@HiveType(typeId: 4)
class UserSettings extends HiveObject {
  @HiveField(0)
  String currency; // 'INR', 'USD', 'EUR', 'GBP'

  @HiveField(1)
  double monthlyIncome;

  @HiveField(2)
  double monthlyBudgetLimit;

  @HiveField(3)
  double savingsGoalPercent;

  @HiveField(4)
  int emergencyFundMonths;

  @HiveField(5)
  bool biometricEnabled;

  @HiveField(6)
  bool autoCategorize;

  @HiveField(7)
  bool weeklyDigest;

  @HiveField(8)
  String firstName;

  @HiveField(9)
  String lastName;

  @HiveField(10)
  String email;

  @HiveField(11)
  String phone;

  @HiveField(12)
  String? avatarPath;

  @HiveField(13)
  bool onboardingComplete;

  @HiveField(14)
  bool pinEnabled;

  @HiveField(15)
  bool privacyModeEnabled;

  UserSettings({
    this.currency = 'INR',
    this.monthlyIncome = 0,
    this.monthlyBudgetLimit = 50000,
    this.savingsGoalPercent = 30,
    this.emergencyFundMonths = 6,
    this.biometricEnabled = false,
    this.autoCategorize = true,
    this.weeklyDigest = true,
    this.firstName = '',
    this.lastName = '',
    this.email = '',
    this.phone = '',
    this.avatarPath,
    this.onboardingComplete = false,
    this.pinEnabled = false,
    this.privacyModeEnabled = false,
  });

  String get currencySymbol {
    switch (currency) {
      case 'USD':
        return '\$';
      case 'EUR':
        return '€';
      case 'GBP':
        return '£';
      case 'INR':
      default:
        return '₹';
    }
  }

  String get fullName =>
      '${firstName.trim()} ${lastName.trim()}'.trim().isEmpty
          ? 'User'
          : '${firstName.trim()} ${lastName.trim()}'.trim();

  String get initials {
    final f = firstName.trim().isEmpty ? '' : firstName.trim()[0].toUpperCase();
    final l = lastName.trim().isEmpty ? '' : lastName.trim()[0].toUpperCase();
    return '$f$l'.isEmpty ? 'U' : '$f$l';
  }

  UserSettings copyWith({
    String? currency,
    double? monthlyIncome,
    double? monthlyBudgetLimit,
    double? savingsGoalPercent,
    int? emergencyFundMonths,
    bool? biometricEnabled,
    bool? autoCategorize,
    bool? weeklyDigest,
    String? firstName,
    String? lastName,
    String? email,
    String? phone,
    String? avatarPath,
    bool? onboardingComplete,
    bool? pinEnabled,
    bool? privacyModeEnabled,
  }) {
    return UserSettings(
      currency: currency ?? this.currency,
      monthlyIncome: monthlyIncome ?? this.monthlyIncome,
      monthlyBudgetLimit: monthlyBudgetLimit ?? this.monthlyBudgetLimit,
      savingsGoalPercent: savingsGoalPercent ?? this.savingsGoalPercent,
      emergencyFundMonths: emergencyFundMonths ?? this.emergencyFundMonths,
      biometricEnabled: biometricEnabled ?? this.biometricEnabled,
      autoCategorize: autoCategorize ?? this.autoCategorize,
      weeklyDigest: weeklyDigest ?? this.weeklyDigest,
      firstName: firstName ?? this.firstName,
      lastName: lastName ?? this.lastName,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      avatarPath: avatarPath ?? this.avatarPath,
      onboardingComplete: onboardingComplete ?? this.onboardingComplete,
      pinEnabled: pinEnabled ?? this.pinEnabled,
      privacyModeEnabled: privacyModeEnabled ?? this.privacyModeEnabled,
    );
  }

  Map<String, dynamic> toJson() => {
        'currency': currency,
        'monthlyIncome': monthlyIncome,
        'monthlyBudgetLimit': monthlyBudgetLimit,
        'savingsGoalPercent': savingsGoalPercent,
        'emergencyFundMonths': emergencyFundMonths,
        'biometricEnabled': biometricEnabled,
        'autoCategorize': autoCategorize,
        'weeklyDigest': weeklyDigest,
        'firstName': firstName,
        'lastName': lastName,
        'email': email,
        'phone': phone,
        'avatarPath': avatarPath,
        'onboardingComplete': onboardingComplete,
        'pinEnabled': pinEnabled,
        'privacyModeEnabled': privacyModeEnabled,
      };

  factory UserSettings.fromJson(Map<String, dynamic> json) => UserSettings(
        currency: json['currency'] as String? ?? 'INR',
        monthlyIncome: (json['monthlyIncome'] as num?)?.toDouble() ?? 0,
        monthlyBudgetLimit:
            (json['monthlyBudgetLimit'] as num?)?.toDouble() ?? 50000,
        savingsGoalPercent:
            (json['savingsGoalPercent'] as num?)?.toDouble() ?? 30,
        emergencyFundMonths: json['emergencyFundMonths'] as int? ?? 6,
        biometricEnabled: json['biometricEnabled'] as bool? ?? false,
        autoCategorize: json['autoCategorize'] as bool? ?? true,
        weeklyDigest: json['weeklyDigest'] as bool? ?? true,
        firstName: json['firstName'] as String? ?? '',
        lastName: json['lastName'] as String? ?? '',
        email: json['email'] as String? ?? '',
        phone: json['phone'] as String? ?? '',
        avatarPath: json['avatarPath'] as String?,
        onboardingComplete: json['onboardingComplete'] as bool? ?? false,
        pinEnabled: json['pinEnabled'] as bool? ?? false,
        privacyModeEnabled: json['privacyModeEnabled'] as bool? ?? false,
      );
}
