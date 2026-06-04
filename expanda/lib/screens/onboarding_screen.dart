import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/settings_provider.dart';
import '../models/constants.dart';

class OnboardingScreen extends ConsumerStatefulWidget {
  const OnboardingScreen({super.key});

  @override
  ConsumerState<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends ConsumerState<OnboardingScreen> {
  final _pageController = PageController();
  int _currentPage = 0;

  // Form values
  String _currency = 'INR';
  final _incomeController = TextEditingController();
  final _budgetController = TextEditingController(text: '50000');
  bool _biometricEnabled = false;

  @override
  void dispose() {
    _pageController.dispose();
    _incomeController.dispose();
    _budgetController.dispose();
    super.dispose();
  }

  void _next() {
    if (_currentPage < 3) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 350),
        curve: Curves.easeInOut,
      );
    } else {
      _finish();
    }
  }

  Future<void> _finish() async {
    HapticFeedback.mediumImpact();
    final income = double.tryParse(_incomeController.text) ?? 0;
    final budget = double.tryParse(_budgetController.text) ?? 50000;

    await ref.read(settingsProvider.notifier).completeOnboarding(
          currency: _currency,
          monthlyIncome: income,
          monthlyBudgetLimit: budget,
          biometricEnabled: _biometricEnabled,
        );

    if (mounted) {
      context.go('/home');
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            // Page indicator
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              child: Row(
                children: List.generate(4, (i) {
                  return Expanded(
                    child: Container(
                      height: 4,
                      margin: const EdgeInsets.symmetric(horizontal: 3),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(2),
                        color: i <= _currentPage
                            ? theme.colorScheme.primary
                            : theme.colorScheme.outline,
                      ),
                    ),
                  );
                }),
              ),
            ),

            // Pages
            Expanded(
              child: PageView(
                controller: _pageController,
                onPageChanged: (i) => setState(() => _currentPage = i),
                children: [
                  _buildWelcomePage(theme),
                  _buildCurrencyPage(theme),
                  _buildBudgetPage(theme),
                  _buildBiometricPage(theme),
                ],
              ),
            ),

            // Bottom button
            Padding(
              padding: const EdgeInsets.fromLTRB(24, 8, 24, 24),
              child: SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _next,
                  child: Text(_currentPage == 3 ? 'Get Started' : 'Next'),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildWelcomePage(ThemeData theme) {
    return Padding(
      padding: const EdgeInsets.all(32),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(30),
            child: Image.asset(
              'assets/logo.jpg',
              width: 120,
              height: 120,
              fit: BoxFit.cover,
            ),
          ),
          const SizedBox(height: 40),
          Text(
            'Welcome to\nEXPANDA',
            textAlign: TextAlign.center,
            style: theme.textTheme.headlineLarge,
          ),
          const SizedBox(height: 16),
          Text(
            'Your intelligent financial companion.\nTrack, plan, and grow your wealth.',
            textAlign: TextAlign.center,
            style: theme.textTheme.bodyLarge,
          ),
        ],
      ),
    );
  }

  Widget _buildCurrencyPage(ThemeData theme) {
    return Padding(
      padding: const EdgeInsets.all(32),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.currency_exchange_rounded,
              size: 56, color: theme.colorScheme.primary),
          const SizedBox(height: 24),
          Text('Set your currency', style: theme.textTheme.headlineMedium),
          const SizedBox(height: 8),
          Text('Choose your preferred currency and enter your monthly income.',
              textAlign: TextAlign.center, style: theme.textTheme.bodyMedium),
          const SizedBox(height: 32),
          Wrap(
            spacing: 10,
            children: AppConstants.currencies.map((c) {
              final selected = c == _currency;
              return ChoiceChip(
                label: Text(
                    '${AppConstants.currencySymbols[c]} $c'),
                selected: selected,
                onSelected: (_) => setState(() => _currency = c),
                selectedColor:
                    theme.colorScheme.primary.withValues(alpha: 0.2),
                labelStyle: TextStyle(
                  color: selected
                      ? theme.colorScheme.primary
                      : theme.colorScheme.onSurface,
                  fontWeight: selected ? FontWeight.w600 : FontWeight.normal,
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 24),
          TextField(
            controller: _incomeController,
            keyboardType: TextInputType.number,
            decoration: InputDecoration(
              labelText: 'Monthly Income',
              prefixText:
                  '${AppConstants.currencySymbols[_currency]} ',
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBudgetPage(ThemeData theme) {
    return Padding(
      padding: const EdgeInsets.all(32),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.savings_rounded,
              size: 56, color: theme.colorScheme.primary),
          const SizedBox(height: 24),
          Text('Set your budget', style: theme.textTheme.headlineMedium),
          const SizedBox(height: 8),
          Text(
            'Define a monthly spending limit to stay on track.',
            textAlign: TextAlign.center,
            style: theme.textTheme.bodyMedium,
          ),
          const SizedBox(height: 32),
          TextField(
            controller: _budgetController,
            keyboardType: TextInputType.number,
            decoration: InputDecoration(
              labelText: 'Monthly Budget Limit',
              prefixText:
                  '${AppConstants.currencySymbols[_currency]} ',
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBiometricPage(ThemeData theme) {
    return Padding(
      padding: const EdgeInsets.all(32),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.fingerprint_rounded,
              size: 56, color: theme.colorScheme.primary),
          const SizedBox(height: 24),
          Text('Secure your app', style: theme.textTheme.headlineMedium),
          const SizedBox(height: 8),
          Text(
            'Enable biometric lock to protect your financial data.',
            textAlign: TextAlign.center,
            style: theme.textTheme.bodyMedium,
          ),
          const SizedBox(height: 32),
          SwitchListTile(
            title: const Text('Enable Biometric Lock'),
            subtitle: const Text('Fingerprint or Face ID'),
            value: _biometricEnabled,
            onChanged: (v) => setState(() => _biometricEnabled = v),
            activeColor: theme.colorScheme.primary,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(14),
              side: BorderSide(color: theme.colorScheme.outline),
            ),
          ),
        ],
      ),
    );
  }
}
