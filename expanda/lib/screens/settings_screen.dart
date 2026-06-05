import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:path_provider/path_provider.dart';
import 'package:share_plus/share_plus.dart';
import '../providers/settings_provider.dart';
import '../services/auth_service.dart';
import '../services/hive_service.dart';
import '../models/constants.dart';

class SettingsScreen extends ConsumerStatefulWidget {
  const SettingsScreen({super.key});

  @override
  ConsumerState<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends ConsumerState<SettingsScreen> {
  String? _activeSection;

  @override
  Widget build(BuildContext context) {
    final settings = ref.watch(settingsProvider);
    final theme = Theme.of(context);

    if (_activeSection != null) {
      return _buildSubScreen(theme, settings);
    }

    return Scaffold(
      appBar: AppBar(title: const Text('Settings')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Profile card
          Card(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Row(
                children: [
                  GestureDetector(
                    onTap: () => _pickAvatar(),
                    child: CircleAvatar(
                      radius: 32,
                      backgroundColor:
                          theme.colorScheme.primary.withValues(alpha: 0.12),
                      backgroundImage: settings.avatarPath != null
                          ? FileImage(File(settings.avatarPath!))
                          : null,
                      child: settings.avatarPath == null
                          ? Text(settings.initials,
                              style: TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.w700,
                                  color: theme.colorScheme.primary))
                          : null,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(settings.firstName.isEmpty ? 'User' : settings.firstName,
                            style: theme.textTheme.titleMedium),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Menu sections
          _menuGroup(theme, [
            _menuItem(theme, 'Profile', Icons.person_rounded,
                const Color(0xFF3B82F6), () => setState(() => _activeSection = 'profile')),
            _menuItem(theme, 'Preferences', Icons.tune_rounded,
                const Color(0xFF8B5CF6), () => setState(() => _activeSection = 'preferences')),
            _menuItem(theme, 'Security', Icons.shield_rounded,
                const Color(0xFF10B981), () => setState(() => _activeSection = 'security')),
          ]),
          const SizedBox(height: 16),
          _menuGroup(theme, [
            _menuItem(theme, 'Reports', Icons.assessment_rounded,
                const Color(0xFFF59E0B), () => context.push('/reports')),
            _menuItem(theme, 'Learning Hub', Icons.school_rounded,
                const Color(0xFF06B6D4), () => context.push('/learn')),
          ]),
          const SizedBox(height: 16),
          _menuGroup(theme, [
            _menuItem(theme, 'Export Data', Icons.upload_file_rounded,
                const Color(0xFF64748B), _exportData),
            _menuItem(theme, 'Import Data', Icons.download_rounded,
                const Color(0xFF64748B), _importData),
          ]),
          const SizedBox(height: 24),

          Center(
            child: Text('EXPANDA v1.0.0', style: theme.textTheme.bodySmall),
          ),
        ],
      ),
    );
  }

  Widget _buildSubScreen(ThemeData theme, dynamic settings) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_activeSection![0].toUpperCase() + _activeSection!.substring(1)),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded),
          onPressed: () => setState(() => _activeSection = null),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          if (_activeSection == 'profile') ..._buildProfile(theme, settings),
          if (_activeSection == 'preferences')
            ..._buildPreferences(theme, settings),
          if (_activeSection == 'security')
            ..._buildSecurity(theme, settings),
        ],
      ),
    );
  }

  List<Widget> _buildProfile(ThemeData theme, dynamic settings) {
    final usernameC = TextEditingController(text: settings.firstName);

    return [
      Center(
        child: GestureDetector(
          onTap: _pickAvatar,
          child: Stack(
            children: [
              CircleAvatar(
                radius: 48,
                backgroundColor:
                    theme.colorScheme.primary.withValues(alpha: 0.12),
                backgroundImage: settings.avatarPath != null
                    ? FileImage(File(settings.avatarPath!))
                    : null,
                child: settings.avatarPath == null
                    ? Text(settings.initials,
                        style: TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.w700,
                            color: theme.colorScheme.primary))
                    : null,
              ),
              Positioned(
                bottom: 0,
                right: 0,
                child: Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: theme.colorScheme.primary,
                    shape: BoxShape.circle,
                  ),
                  child:
                      const Icon(Icons.camera_alt_rounded, size: 16, color: Colors.white),
                ),
              ),
            ],
          ),
        ),
      ),
      const SizedBox(height: 24),
      TextField(
          controller: usernameC,
          decoration: const InputDecoration(labelText: 'Username')),
      const SizedBox(height: 24),
      ElevatedButton(
        onPressed: () {
          HapticFeedback.mediumImpact();
          ref.read(settingsProvider.notifier).updateProfile(
                firstName: usernameC.text,
                lastName: '',
                email: '',
                phone: '',
              );
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Profile updated successfully.')),
          );
          setState(() => _activeSection = null);
        },
        child: const Text('Save Profile'),
      ),
    ];
  }

  List<Widget> _buildPreferences(ThemeData theme, dynamic settings) {
    String currency = settings.currency;
    final budgetC =
        TextEditingController(text: settings.monthlyBudgetLimit.toStringAsFixed(0));
    final incomeC =
        TextEditingController(text: settings.monthlyIncome.toStringAsFixed(0));
    final savingsC =
        TextEditingController(text: settings.savingsGoalPercent.toStringAsFixed(0));
    final emergencyC =
        TextEditingController(text: settings.emergencyFundMonths.toString());
    bool autoCat = settings.autoCategorize;
    bool weekly = settings.weeklyDigest;

    return [
      DropdownButtonFormField<String>(
        value: currency,
        decoration: const InputDecoration(labelText: 'Currency'),
        items: AppConstants.currencies
            .map((c) => DropdownMenuItem(
                value: c,
                child: Text(
                    '${AppConstants.currencySymbols[c]} $c')))
            .toList(),
        onChanged: (v) => currency = v!,
      ),
      const SizedBox(height: 12),
      TextField(
          controller: incomeC,
          keyboardType: TextInputType.number,
          decoration: const InputDecoration(labelText: 'Monthly Income')),
      const SizedBox(height: 12),
      TextField(
          controller: budgetC,
          keyboardType: TextInputType.number,
          decoration:
              const InputDecoration(labelText: 'Monthly Budget Limit')),
      const SizedBox(height: 12),
      TextField(
          controller: savingsC,
          keyboardType: TextInputType.number,
          decoration:
              const InputDecoration(labelText: 'Savings Goal (%)')),
      const SizedBox(height: 12),
      TextField(
          controller: emergencyC,
          keyboardType: TextInputType.number,
          decoration: const InputDecoration(
              labelText: 'Emergency Fund Target (months)')),
      const SizedBox(height: 16),
      StatefulBuilder(
        builder: (_, setSB) => Column(
          children: [
            SwitchListTile(
              title: const Text('Auto-categorize'),
              subtitle: const Text('Use AI to sort expenses'),
              value: autoCat,
              onChanged: (v) => setSB(() => autoCat = v),
              contentPadding: EdgeInsets.zero,
            ),
            SwitchListTile(
              title: const Text('Weekly digest'),
              subtitle: const Text('Receive a weekly summary'),
              value: weekly,
              onChanged: (v) => setSB(() => weekly = v),
              contentPadding: EdgeInsets.zero,
            ),
          ],
        ),
      ),
      const SizedBox(height: 24),
      ElevatedButton(
        onPressed: () {
          HapticFeedback.mediumImpact();
          ref.read(settingsProvider.notifier).update(
                settings.copyWith(
                  currency: currency,
                  monthlyIncome:
                      double.tryParse(incomeC.text) ?? settings.monthlyIncome,
                  monthlyBudgetLimit: double.tryParse(budgetC.text) ??
                      settings.monthlyBudgetLimit,
                  savingsGoalPercent: double.tryParse(savingsC.text) ??
                      settings.savingsGoalPercent,
                  emergencyFundMonths: int.tryParse(emergencyC.text) ??
                      settings.emergencyFundMonths,
                  autoCategorize: autoCat,
                  weeklyDigest: weekly,
                ),
              );
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Preferences updated successfully.')),
          );
          setState(() => _activeSection = null);
        },
        child: const Text('Save Preferences'),
      ),
    ];
  }

  List<Widget> _buildSecurity(ThemeData theme, dynamic settings) {
    return [
      Card(
        child: Column(
          children: [
            SwitchListTile(
              title: const Text('Biometric Lock'),
              subtitle: const Text('Require fingerprint / Face ID on launch'),
              value: settings.biometricEnabled,
              onChanged: (v) async {
                if (v) {
                  if (!settings.pinEnabled) {
                    if (mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                            content:
                                Text('Please enable and set a PIN lock first before enabling biometric lock.')),
                      );
                    }
                    return;
                  }
                  final available = await AuthService.isBiometricAvailable();
                  if (!available) {
                    if (mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                            content:
                                Text('Biometrics not available on this device')),
                      );
                    }
                    return;
                  }
                  final authed =
                      await AuthService.authenticateWithBiometrics();
                  if (authed) {
                    await ref.read(settingsProvider.notifier).toggleBiometric(true);
                    if (mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Biometric lock enabled.')),
                      );
                    }
                  }
                } else {
                  await ref.read(settingsProvider.notifier).toggleBiometric(false);
                  if (mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Biometric lock disabled.')),
                    );
                  }
                }
              },
            ),
            const Divider(indent: 16, endIndent: 16),
            SwitchListTile(
              title: const Text('PIN Lock'),
              subtitle: const Text('Set a 6-digit PIN for app access'),
              value: settings.pinEnabled,
              onChanged: (v) async {
                if (v) {
                  _showPinSetup();
                } else {
                  await AuthService.removePin();
                  await ref.read(settingsProvider.notifier).togglePin(false);
                  await ref.read(settingsProvider.notifier).toggleBiometric(false);
                  if (mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Security locks disabled.')),
                    );
                  }
                }
              },
            ),
          ],
        ),
      ),
      const SizedBox(height: 16),
      Card(
        child: ListTile(
          title: const Text('Change PIN'),
          subtitle: const Text('Update your 6-digit PIN'),
          trailing: const Icon(Icons.chevron_right_rounded),
          onTap: settings.pinEnabled ? _showPinSetup : null,
          enabled: settings.pinEnabled,
        ),
      ),
    ];
  }

  void _showPinSetup() {
    final pinC = TextEditingController();
    final confirmC = TextEditingController();
    String? error;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (ctx) {
        return StatefulBuilder(builder: (ctx, setSB) {
          return Padding(
            padding: EdgeInsets.only(
                bottom: MediaQuery.of(ctx).viewInsets.bottom),
            child: Container(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Set PIN', style: Theme.of(ctx).textTheme.titleLarge),
                  const SizedBox(height: 16),
                  TextField(
                    controller: pinC,
                    keyboardType: TextInputType.number,
                    maxLength: 6,
                    obscureText: true,
                    decoration:
                        const InputDecoration(labelText: 'Enter 6-digit PIN'),
                  ),
                  const SizedBox(height: 8),
                  TextField(
                    controller: confirmC,
                    keyboardType: TextInputType.number,
                    maxLength: 6,
                    obscureText: true,
                    decoration:
                        const InputDecoration(labelText: 'Confirm PIN'),
                  ),
                  if (error != null) ...[
                    const SizedBox(height: 8),
                    Text(error!,
                        style: TextStyle(
                            color: Theme.of(ctx).colorScheme.error,
                            fontSize: 12)),
                  ],
                  const SizedBox(height: 20),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () async {
                        if (pinC.text.length != 6) {
                          setSB(() => error = 'PIN must be 6 digits');
                          return;
                        }
                        if (pinC.text != confirmC.text) {
                          setSB(() => error = 'PINs do not match');
                          return;
                        }
                        HapticFeedback.mediumImpact();
                        await AuthService.setPin(pinC.text);
                        await ref
                            .read(settingsProvider.notifier)
                            .togglePin(true);
                        if (mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('PIN lock enabled successfully.')),
                          );
                          Navigator.pop(ctx);
                        }
                      },
                      child: const Text('Set PIN'),
                    ),
                  ),
                ],
              ),
            ),
          );
        });
      },
    );
  }

  Future<void> _pickAvatar() async {
    final picker = ImagePicker();
    final picked = await picker.pickImage(source: ImageSource.gallery);
    if (picked != null) {
      final dir = await getApplicationDocumentsDirectory();
      final path = '${dir.path}/avatar.jpg';
      await File(picked.path).copy(path);
      ref.read(settingsProvider.notifier).updateProfile(avatarPath: path);
    }
  }

  Future<void> _exportData() async {
    HapticFeedback.mediumImpact();
    final data = HiveService.exportAllData();
    final json = jsonEncode(data);
    final dir = await getTemporaryDirectory();
    final file = File('${dir.path}/expanda_backup.json');
    await file.writeAsString(json);
    await Share.shareXFiles([XFile(file.path)],
        text: 'EXPANDA Data Backup');
  }

  Future<void> _importData() async {
    // Simplified: in production, use file_picker to select JSON file
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
          content: Text(
              'Import: Use a file picker to select your backup JSON file.')),
    );
  }

  Widget _menuGroup(ThemeData theme, List<Widget> items) {
    return Card(
      child: Column(
        children: items.asMap().entries.map((entry) {
          return Column(
            children: [
              entry.value,
              if (entry.key < items.length - 1)
                Divider(
                    indent: 56,
                    endIndent: 16,
                    height: 1,
                    color: theme.colorScheme.outline.withValues(alpha: 0.5)),
            ],
          );
        }).toList(),
      ),
    );
  }

  Widget _menuItem(ThemeData theme, String label, IconData icon, Color color,
      VoidCallback onTap) {
    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.12),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Icon(icon, color: color, size: 20),
      ),
      title: Text(label, style: theme.textTheme.labelLarge),
      trailing:
          Icon(Icons.chevron_right_rounded, color: theme.colorScheme.outline),
      onTap: () {
        HapticFeedback.lightImpact();
        onTap();
      },
    );
  }
}
