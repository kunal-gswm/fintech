import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/expense_provider.dart';
import '../providers/settings_provider.dart';
import '../providers/notification_provider.dart';
import '../providers/goal_provider.dart';
import '../providers/update_provider.dart';
import '../services/update_service.dart';

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final expenses = ref.watch(expenseListProvider);
    final settings = ref.watch(settingsProvider);
    final unread = ref.watch(unreadCountProvider);
    final updateState = ref.watch(updateStateProvider);
    final theme = Theme.of(context);
    final sym = settings.currencySymbol;

    // KPI calculations
    final now = DateTime.now();
    final monthStart = DateTime(now.year, now.month, 1);
    final monthExpenses = expenses
        .where((e) => e.date.isAfter(monthStart.subtract(const Duration(days: 1))))
        .toList();
    final totalExpenses =
        monthExpenses.fold(0.0, (sum, e) => sum + e.amount);
    final income = settings.monthlyIncome;
    final savings = income - totalExpenses;
    final savingsRate = income > 0 ? (savings / income * 100) : 0.0;

    return Scaffold(
      appBar: AppBar(
        title: Text('Hello, ${settings.firstName.isEmpty ? 'User' : settings.firstName}'),
        actions: [
          IconButton(
            onPressed: () => ref
                .read(settingsProvider.notifier)
                .togglePrivacyMode(!settings.privacyModeEnabled),
            icon: Icon(settings.privacyModeEnabled
                ? Icons.visibility_off_outlined
                : Icons.visibility_outlined),
            tooltip: settings.privacyModeEnabled ? 'Show balances' : 'Hide balances',
          ),
          IconButton(
            onPressed: () => context.push('/notifications'),
            icon: Badge(
              isLabelVisible: unread > 0,
              label: Text('$unread', style: const TextStyle(fontSize: 10)),
              child: const Icon(Icons.notifications_outlined),
            ),
          ),
          IconButton(
            onPressed: () => context.push('/settings'),
            icon: const Icon(Icons.settings_outlined),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          ref.read(expenseListProvider.notifier).refresh();
          ref.read(goalListProvider.notifier).refresh();
        },
        child: expenses.isEmpty
            ? _buildEmptyState(context, theme)
            : ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  // Auto Update Banner (if available)
                  updateState.when(
                    data: (info) => info.hasUpdate
                        ? _buildUpdateBanner(theme, info)
                        : const SizedBox.shrink(),
                    loading: () => const SizedBox.shrink(),
                    error: (_, __) => const SizedBox.shrink(),
                  ),
                  if (updateState.value?.hasUpdate == true) const SizedBox(height: 16),

                  // AI Monthly Review card
                  _buildAiReviewCard(theme, totalExpenses, income, savingsRate, sym),
                  const SizedBox(height: 20),

                  // KPI Cards
                  Text('Overview', style: theme.textTheme.titleMedium),
                  const SizedBox(height: 12),
                  _buildKpiGrid(theme, sym, income, totalExpenses, savings,
                      savingsRate, settings.privacyModeEnabled),
                  const SizedBox(height: 20),

                  // Recent Activity
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Recent Activity',
                          style: theme.textTheme.titleMedium),
                      TextButton(
                        onPressed: () => context.go('/expenses'),
                        child: const Text('View All'),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  ...expenses.take(10).map(
                        (e) => _buildActivityItem(theme, e, sym, settings.privacyModeEnabled),
                      ),
                ],
              ),
      ),
    );
  }

  Widget _buildEmptyState(BuildContext context, ThemeData theme) {
    return Center(
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        child: Padding(
          padding: const EdgeInsets.all(40),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.receipt_long_rounded,
                  size: 80, color: theme.colorScheme.primary.withValues(alpha: 0.4)),
              const SizedBox(height: 24),
              Text('No transactions yet',
                  style: theme.textTheme.titleLarge),
              const SizedBox(height: 8),
              Text(
                'Start tracking your expenses to see insights here.',
                textAlign: TextAlign.center,
                style: theme.textTheme.bodyMedium,
              ),
              const SizedBox(height: 24),
              ElevatedButton.icon(
                onPressed: () => context.go('/expenses'),
                icon: const Icon(Icons.add),
                label: const Text('Add your first expense'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAiReviewCard(ThemeData theme, double expenses, double income,
      double rate, String sym) {
    String review;
    if (income == 0) {
      review =
          'Set your monthly income in Settings to get personalized insights.';
    } else if (rate >= 50) {
      review =
          'Outstanding! You\'re saving ${rate.toStringAsFixed(0)}% of your income this month. Keep up the discipline!';
    } else if (rate >= 20) {
      review =
          'Good progress — you\'re saving ${rate.toStringAsFixed(0)}% this month. Try reducing discretionary spending to hit 30%.';
    } else {
      review =
          'Heads up — your savings rate is only ${rate.toStringAsFixed(0)}% this month. Review your expenses below to find areas to cut.';
    }

    return Card(
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          gradient: LinearGradient(
            colors: [
              theme.colorScheme.primary.withValues(alpha: 0.1),
              Colors.transparent,
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        padding: const EdgeInsets.all(20),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: theme.colorScheme.primary.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(Icons.auto_awesome_rounded,
                  color: theme.colorScheme.primary, size: 22),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Monthly Review',
                      style: theme.textTheme.labelLarge),
                  const SizedBox(height: 6),
                  Text(review, style: theme.textTheme.bodyMedium),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildKpiGrid(ThemeData theme, String sym, double income,
      double expenses, double savings, double rate, bool privacyModeEnabled) {
    final items = [
      _KpiData('Income', privacyModeEnabled ? '••••' : '$sym${_fmt(income)}', Icons.wallet_rounded,
          const Color(0xFF3B82F6)),
      _KpiData('Expenses', privacyModeEnabled ? '••••' : '$sym${_fmt(expenses)}',
          Icons.credit_card_rounded, const Color(0xFFF59E0B)),
      _KpiData('Savings', privacyModeEnabled ? '••••' : '$sym${_fmt(savings)}',
          Icons.savings_rounded, const Color(0xFF10B981)),
      _KpiData('Rate', privacyModeEnabled ? '••••' : '${rate.toStringAsFixed(1)}%',
          Icons.trending_up_rounded, const Color(0xFF8B5CF6)),
    ];

    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisSpacing: 12,
      mainAxisSpacing: 12,
      childAspectRatio: 1.6,
      children: items.map((item) {
        return Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: item.color.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(item.icon, color: item.color, size: 20),
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(item.label, style: theme.textTheme.bodySmall),
                    const SizedBox(height: 2),
                    Text(
                      item.value,
                      style: theme.textTheme.titleMedium
                          ?.copyWith(fontWeight: FontWeight.w700),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildActivityItem(ThemeData theme, dynamic expense, String sym, bool privacyModeEnabled) {
    final catColor =
        _categoryColor(expense.category);
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: theme.cardTheme.color,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: theme.colorScheme.outline, width: 0.5),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: catColor.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(
                expense.iconName != null
                    ? _getIconData(expense.iconName!)
                    : _categoryIcon(expense.category),
                color: catColor, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(expense.title,
                    style: theme.textTheme.labelLarge,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis),
                Text(expense.category, style: theme.textTheme.bodySmall),
              ],
            ),
          ),
          Text(
            privacyModeEnabled ? '••••' : '$sym${_fmt(expense.amount)}',
            style: theme.textTheme.labelLarge
                ?.copyWith(color: const Color(0xFFE5B80B)),
          ),
        ],
      ),
    );
  }

  String _fmt(double v) {
    if (v >= 100000) return '${(v / 100000).toStringAsFixed(1)}L';
    if (v >= 1000) return '${(v / 1000).toStringAsFixed(1)}K';
    return v.toStringAsFixed(0);
  }

  Color _categoryColor(String cat) {
    const colors = {
      'Food & Dining': Color(0xFFEF4444),
      'Transportation': Color(0xFF3B82F6),
      'Shopping': Color(0xFFF59E0B),
      'Entertainment': Color(0xFF8B5CF6),
      'Bills & Utilities': Color(0xFF10B981),
      'Healthcare': Color(0xFFEC4899),
      'Education': Color(0xFF06B6D4),
      'Travel': Color(0xFFF97316),
      'Groceries': Color(0xFF84CC16),
      'Subscriptions': Color(0xFF6366F1),
    };
    return colors[cat] ?? const Color(0xFF64748B);
  }

  IconData _categoryIcon(String cat) {
    const icons = {
      'Food & Dining': Icons.restaurant_rounded,
      'Transportation': Icons.directions_car_rounded,
      'Shopping': Icons.shopping_bag_rounded,
      'Entertainment': Icons.movie_rounded,
      'Bills & Utilities': Icons.receipt_long_rounded,
      'Healthcare': Icons.local_hospital_rounded,
      'Education': Icons.school_rounded,
      'Travel': Icons.flight_rounded,
      'Groceries': Icons.local_grocery_store_rounded,
      'Subscriptions': Icons.subscriptions_rounded,
    };
    return icons[cat] ?? Icons.more_horiz_rounded;
  }

  Widget _buildUpdateBanner(ThemeData theme, UpdateInfo updateInfo) {
    return Card(
      color: theme.colorScheme.primaryContainer,
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: theme.colorScheme.primary.withValues(alpha: 0.3)),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: theme.colorScheme.primary.withValues(alpha: 0.15),
                shape: BoxShape.circle,
              ),
              child: Icon(
                Icons.system_update_alt_rounded,
                color: theme.colorScheme.primary,
                size: 24,
              ),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Update Available (${updateInfo.latestVersion})',
                    style: theme.textTheme.labelLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: theme.colorScheme.onPrimaryContainer,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    updateInfo.releaseNotes.isNotEmpty
                        ? updateInfo.releaseNotes
                        : 'A new version of EXPANDA is available. Update now to get the latest features.',
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: theme.colorScheme.onPrimaryContainer.withValues(alpha: 0.8),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      ElevatedButton.icon(
                        onPressed: () {
                          UpdateService.launchUpdateUrl(updateInfo.downloadUrl);
                        },
                        icon: const Icon(Icons.download_rounded, size: 16),
                        label: const Text('Update Now'),
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          minimumSize: Size.zero,
                          textStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  IconData _getIconData(String name) {
    switch (name) {
      case 'food':
        return Icons.restaurant_rounded;
      case 'game':
        return Icons.sports_esports_rounded;
      case 'clothes':
        return Icons.checkroom_rounded;
      case 'travel':
        return Icons.flight_rounded;
      case 'shopping':
        return Icons.shopping_bag_rounded;
      case 'bills':
        return Icons.receipt_long_rounded;
      case 'education':
        return Icons.school_rounded;
      case 'healthcare':
        return Icons.local_hospital_rounded;
      case 'entertainment':
        return Icons.movie_rounded;
      case 'subscriptions':
        return Icons.subscriptions_rounded;
      default:
        return Icons.more_horiz_rounded;
    }
  }
}

class _KpiData {
  final String label;
  final String value;
  final IconData icon;
  final Color color;
  const _KpiData(this.label, this.value, this.icon, this.color);
}
