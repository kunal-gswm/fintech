import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:fl_chart/fl_chart.dart';
import '../providers/expense_provider.dart';
import '../providers/settings_provider.dart';
import '../providers/insight_provider.dart';
import '../models/constants.dart';

class AnalyticsScreen extends ConsumerStatefulWidget {
  const AnalyticsScreen({super.key});

  @override
  ConsumerState<AnalyticsScreen> createState() => _AnalyticsScreenState();
}

class _AnalyticsScreenState extends ConsumerState<AnalyticsScreen> {
  String _rangeFilter = 'Month';
  DateTimeRange? _customRange;
  int? _touchedPieIndex;

  static const _filters = ['Week', 'Month', 'Quarter', 'Year', 'All Time'];

  DateTimeRange _getRange() {
    if (_customRange != null) return _customRange!;
    final now = DateTime.now();
    switch (_rangeFilter) {
      case 'Week':
        return DateTimeRange(
          start: now.subtract(const Duration(days: 7)),
          end: now,
        );
      case 'Quarter':
        return DateTimeRange(
          start: DateTime(now.year, now.month - 3, now.day),
          end: now,
        );
      case 'Year':
        return DateTimeRange(
          start: DateTime(now.year, 1, 1),
          end: now,
        );
      case 'All Time':
        return DateTimeRange(
          start: DateTime(2020),
          end: now,
        );
      case 'Month':
      default:
        return DateTimeRange(
          start: DateTime(now.year, now.month, 1),
          end: now,
        );
    }
  }

  Future<void> _pickDateRange() async {
    final picked = await showDateRangePicker(
      context: context,
      firstDate: DateTime(2020),
      lastDate: DateTime.now(),
      initialDateRange: _customRange,
    );
    if (picked != null) {
      setState(() {
        _customRange = picked;
        _rangeFilter = 'Custom';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final expenses = ref.watch(expenseListProvider);
    final settings = ref.watch(settingsProvider);
    final theme = Theme.of(context);
    final sym = settings.currencySymbol;

    final range = _getRange();
    final filtered = expenses
        .where((e) =>
            e.date.isAfter(range.start.subtract(const Duration(days: 1))) &&
            e.date.isBefore(range.end.add(const Duration(days: 1))))
        .toList();

    // Category breakdown
    final catMap = <String, double>{};
    for (final e in filtered) {
      catMap[e.category] = (catMap[e.category] ?? 0) + e.amount;
    }
    final catEntries = catMap.entries.toList()
      ..sort((a, b) => b.value.compareTo(a.value));

    // Monthly trend
    final monthlyData = <String, Map<String, double>>{};
    for (final e in expenses) {
      final key = '${e.date.year}-${e.date.month.toString().padLeft(2, '0')}';
      monthlyData.putIfAbsent(key, () => {'expenses': 0});
      monthlyData[key]!['expenses'] =
          (monthlyData[key]!['expenses'] ?? 0) + e.amount;
    }
    final sortedMonths = monthlyData.keys.toList()..sort();
    final last6 = sortedMonths.length > 6
        ? sortedMonths.sublist(sortedMonths.length - 6)
        : sortedMonths;

    return Scaffold(
      appBar: AppBar(title: const Text('Analytics')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Filter chips
          SizedBox(
            height: 40,
            child: ListView(
              scrollDirection: Axis.horizontal,
              children: [
                ..._filters.map((f) {
                  final selected = f == _rangeFilter && _customRange == null;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: FilterChip(
                      label: Text(f),
                      selected: selected,
                      showCheckmark: false,
                      onSelected: (_) {
                        HapticFeedback.lightImpact();
                        setState(() {
                          _rangeFilter = f;
                          _customRange = null;
                        });
                      },
                    ),
                  );
                }),
                FilterChip(
                  label: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.date_range_rounded, size: 16),
                      SizedBox(width: 4),
                      Text('Custom'),
                    ],
                  ),
                  selected: _customRange != null,
                  showCheckmark: false,
                  onSelected: (_) => _pickDateRange(),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Pie chart
          if (catEntries.isNotEmpty) ...[
            Card(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Spending Breakdown',
                        style: theme.textTheme.titleMedium),
                    Text('Distribution by category',
                        style: theme.textTheme.bodySmall),
                    const SizedBox(height: 16),
                    SizedBox(
                      height: 220,
                      child: PieChart(
                        PieChartData(
                          pieTouchData: PieTouchData(
                            touchCallback: (event, response) {
                              if (response?.touchedSection != null) {
                                final idx = response!
                                    .touchedSection!.touchedSectionIndex;
                                setState(() => _touchedPieIndex = idx);
                                if (event is FlTapUpEvent && idx >= 0) {
                                  _showCategorySheet(
                                    context,
                                    catEntries[idx].key,
                                    filtered
                                        .where((e) =>
                                            e.category ==
                                            catEntries[idx].key)
                                        .toList(),
                                    sym,
                                  );
                                }
                              }
                            },
                          ),
                          sections: catEntries.asMap().entries.map((entry) {
                            final i = entry.key;
                            final e = entry.value;
                            final isTouched = i == _touchedPieIndex;
                            final color =
                                AppConstants.categoryColors[e.key] ??
                                    Colors.grey;
                            return PieChartSectionData(
                              color: color,
                              value: e.value,
                              title: '',
                              radius: isTouched ? 65 : 55,
                              borderSide: isTouched
                                  ? BorderSide(
                                      color: color.withValues(alpha: 0.8), width: 3)
                                  : BorderSide.none,
                            );
                          }).toList(),
                          centerSpaceRadius: 50,
                          sectionsSpace: 3,
                        ),
                        duration: const Duration(milliseconds: 600),
                      ),
                    ),
                    const SizedBox(height: 16),
                    ...catEntries.map((e) {
                      final color =
                          AppConstants.categoryColors[e.key] ?? Colors.grey;
                      final total = catEntries.fold(
                          0.0, (s, c) => s + c.value);
                      final pct = total > 0
                          ? (e.value / total * 100).toStringAsFixed(1)
                          : '0';
                      return Padding(
                        padding: const EdgeInsets.symmetric(vertical: 4),
                        child: Row(
                          children: [
                            Container(
                              width: 12,
                              height: 12,
                              decoration: BoxDecoration(
                                color: color,
                                borderRadius: BorderRadius.circular(3),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                                child: Text(e.key,
                                    style: theme.textTheme.bodySmall)),
                            Text('$pct%',
                                style: theme.textTheme.bodySmall
                                    ?.copyWith(fontWeight: FontWeight.w600)),
                          ],
                        ),
                      );
                    }),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Bar chart - Top Categories
            Card(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Top Categories',
                        style: theme.textTheme.titleMedium),
                    const SizedBox(height: 16),
                    SizedBox(
                      height: 200,
                      child: BarChart(
                        BarChartData(
                          alignment: BarChartAlignment.spaceAround,
                          maxY: catEntries.first.value * 1.2,
                          barGroups: catEntries
                              .take(5)
                              .toList()
                              .asMap()
                              .entries
                              .map((entry) {
                            final color =
                                AppConstants.categoryColors[
                                        entry.value.key] ??
                                    Colors.grey;
                            return BarChartGroupData(
                              x: entry.key,
                              barRods: [
                                BarChartRodData(
                                  toY: entry.value.value,
                                  color: color,
                                  width: 20,
                                  borderRadius: const BorderRadius.vertical(
                                      top: Radius.circular(6)),
                                ),
                              ],
                            );
                          }).toList(),
                          titlesData: FlTitlesData(
                            leftTitles: const AxisTitles(
                                sideTitles: SideTitles(showTitles: false)),
                            rightTitles: const AxisTitles(
                                sideTitles: SideTitles(showTitles: false)),
                            topTitles: const AxisTitles(
                                sideTitles: SideTitles(showTitles: false)),
                            bottomTitles: AxisTitles(
                              sideTitles: SideTitles(
                                showTitles: true,
                                getTitlesWidget: (value, meta) {
                                  final idx = value.toInt();
                                  if (idx >= catEntries.length) {
                                    return const SizedBox.shrink();
                                  }
                                  final name = catEntries[idx].key;
                                  return Padding(
                                    padding: const EdgeInsets.only(top: 8),
                                    child: Text(
                                      name.length > 6
                                          ? '${name.substring(0, 6)}…'
                                          : name,
                                      style: const TextStyle(fontSize: 10),
                                    ),
                                  );
                                },
                              ),
                            ),
                          ),
                          gridData: const FlGridData(show: false),
                          borderData: FlBorderData(show: false),
                        ),
                        duration: const Duration(milliseconds: 600),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
          ],

          // Monthly trend line chart
          if (last6.isNotEmpty)
            Card(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Monthly Trend',
                        style: theme.textTheme.titleMedium),
                    Text('Expenses over time',
                        style: theme.textTheme.bodySmall),
                    const SizedBox(height: 16),
                    SizedBox(
                      height: 200,
                      child: LineChart(
                        LineChartData(
                          lineBarsData: [
                            LineChartBarData(
                              spots: last6.asMap().entries.map((entry) {
                                return FlSpot(
                                  entry.key.toDouble(),
                                  monthlyData[entry.value]!['expenses'] ?? 0,
                                );
                              }).toList(),
                              isCurved: true,
                              color: theme.colorScheme.primary,
                              barWidth: 2.5,
                              dotData: const FlDotData(show: false),
                              belowBarData: BarAreaData(
                                show: true,
                                color:
                                    theme.colorScheme.primary.withValues(alpha: 0.08),
                              ),
                            ),
                          ],
                          titlesData: FlTitlesData(
                            leftTitles: const AxisTitles(
                                sideTitles: SideTitles(showTitles: false)),
                            rightTitles: const AxisTitles(
                                sideTitles: SideTitles(showTitles: false)),
                            topTitles: const AxisTitles(
                                sideTitles: SideTitles(showTitles: false)),
                            bottomTitles: AxisTitles(
                              sideTitles: SideTitles(
                                showTitles: true,
                                getTitlesWidget: (value, meta) {
                                  final idx = value.toInt();
                                  if (idx >= last6.length) {
                                    return const SizedBox.shrink();
                                  }
                                  final parts = last6[idx].split('-');
                                  const months = [
                                    '', 'Jan', 'Feb', 'Mar', 'Apr', 'May',
                                    'Jun', 'Jul', 'Aug', 'Sep', 'Oct',
                                    'Nov', 'Dec'
                                  ];
                                  return Padding(
                                    padding: const EdgeInsets.only(top: 8),
                                    child: Text(
                                      months[int.parse(parts[1])],
                                      style: const TextStyle(fontSize: 11),
                                    ),
                                  );
                                },
                              ),
                            ),
                          ),
                          gridData: const FlGridData(show: false),
                          borderData: FlBorderData(show: false),
                        ),
                        duration: const Duration(milliseconds: 800),
                      ),
                    ),
                  ],
                ),
              ),
            ),

          // AI Insights
          const SizedBox(height: 16),
          _buildInsights(theme, catEntries, filtered, sym),

          // Subscription Vampire Detection
          const SizedBox(height: 16),
          _buildVampireInsight(theme, filtered, sym),

          if (ref.watch(insight503020Provider)) ...[
            const SizedBox(height: 16),
            _build503020Insight(theme, filtered, settings, sym),
          ],
        ],
      ),
    );
  }

  Widget _buildVampireInsight(ThemeData theme, List<dynamic> filtered, String sym) {
    // Find subscriptions (category == 'Subscriptions' or 'Bills' with isRecurring == true)
    final subs = filtered.where((e) => 
      e.category == 'Subscriptions' || 
      (e.category == 'Bills' && e.isRecurring) || 
      e.title.toLowerCase().contains('subscription')
    ).toList();

    if (subs.isEmpty) {
      return const SizedBox.shrink();
    }

    final monthlyCost = subs.fold(0.0, (s, e) => s + e.amount);
    final annualCost = monthlyCost * 12;
    final decadeCost = annualCost * 10;

    return Card(
      color: theme.colorScheme.errorContainer.withOpacity(0.3),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.bloodtype_rounded, size: 20, color: theme.colorScheme.error),
                const SizedBox(width: 8),
                Text('Subscription Vampires', style: theme.textTheme.titleMedium?.copyWith(color: theme.colorScheme.error)),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              'You are paying $sym${monthlyCost.toStringAsFixed(0)} a month for subscriptions. Over 10 years, this will cost you $sym${decadeCost.toStringAsFixed(0)}.',
              style: theme.textTheme.bodyMedium,
            ),
            const SizedBox(height: 8),
            Text(
              'Do you really need all of them?',
              style: theme.textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
    );
  }

  Widget _build503020Insight(ThemeData theme, List<dynamic> filtered, dynamic settings, String sym) {
    if (settings.monthlyIncome == 0) {
      return Card(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('50/30/20 Budgeting Insight', style: theme.textTheme.titleMedium),
              const SizedBox(height: 8),
              Text('Set your monthly income in Preferences to see your 50/30/20 breakdown.', style: theme.textTheme.bodyMedium),
            ],
          ),
        ),
      );
    }

    final needsCats = ['Food', 'Bills', 'Education', 'Healthcare'];
    double needs = 0;
    double wants = 0;

    for (final e in filtered) {
      if (needsCats.contains(e.category)) {
        needs += e.amount;
      } else {
        wants += e.amount;
      }
    }

    final income = settings.monthlyIncome;
    final needsTarget = income * 0.5;
    final wantsTarget = income * 0.3;
    final savingsTarget = income * 0.2;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.pie_chart_outline_rounded, size: 20, color: theme.colorScheme.primary),
                const SizedBox(width: 8),
                Text('50/30/20 Budgeting Insight', style: theme.textTheme.titleMedium),
              ],
            ),
            const SizedBox(height: 16),
            _buildBudgetBar(theme, 'Needs (50%)', needs, needsTarget, sym),
            const SizedBox(height: 12),
            _buildBudgetBar(theme, 'Wants (30%)', wants, wantsTarget, sym),
            const SizedBox(height: 12),
            _buildBudgetBar(theme, 'Savings (20%)', income - needs - wants, savingsTarget, sym, isSavings: true),
          ],
        ),
      ),
    );
  }

  Widget _buildBudgetBar(ThemeData theme, String title, double actual, double target, String sym, {bool isSavings = false}) {
    final pct = target > 0 ? (actual / target).clamp(0.0, 1.0) : 0.0;
    final overBudget = actual > target && !isSavings;
    final color = isSavings 
        ? (actual >= target ? Colors.green : Colors.orange)
        : (overBudget ? Colors.red : theme.colorScheme.primary);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(title, style: theme.textTheme.bodyMedium),
            Text('$sym${actual.toStringAsFixed(0)} / $sym${target.toStringAsFixed(0)}', style: theme.textTheme.bodySmall),
          ],
        ),
        const SizedBox(height: 6),
        LinearProgressIndicator(
          value: pct,
          color: color,
          backgroundColor: theme.colorScheme.outline.withOpacity(0.2),
          minHeight: 8,
          borderRadius: BorderRadius.circular(4),
        ),
      ],
    );
  }

  Widget _buildInsights(ThemeData theme, List<MapEntry<String, double>> cats,
      List<dynamic> filtered, String sym) {
    if (cats.isEmpty) {
      return Card(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              Icon(Icons.auto_awesome_rounded,
                  size: 32, color: theme.colorScheme.primary),
              const SizedBox(height: 12),
              Text('No data for insights yet',
                  style: theme.textTheme.bodyMedium),
            ],
          ),
        ),
      );
    }

    final topCat = cats.first;
    final total = cats.fold(0.0, (s, c) => s + c.value);
    final topPct = (topCat.value / total * 100).toStringAsFixed(0);

    final insights = [
      'Your top spending category is **${topCat.key}** at $topPct% of total.',
      'You had **${filtered.length}** transactions in this period totaling **$sym${total.toStringAsFixed(0)}**.',
      if (cats.length > 2)
        'Consider reducing spending in ${cats[0].key} and ${cats[1].key} for better savings.',
    ];

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.auto_awesome_rounded,
                    size: 20, color: theme.colorScheme.primary),
                const SizedBox(width: 8),
                Text('AI Insights', style: theme.textTheme.titleMedium),
              ],
            ),
            const SizedBox(height: 12),
            ...insights.map((insight) => Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        margin: const EdgeInsets.only(top: 6),
                        width: 6,
                        height: 6,
                        decoration: BoxDecoration(
                          color: theme.colorScheme.primary,
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Text(insight,
                            style: theme.textTheme.bodyMedium),
                      ),
                    ],
                  ),
                )),
          ],
        ),
      ),
    );
  }

  void _showCategorySheet(
      BuildContext context, String category, List<dynamic> items, String sym) {
    final theme = Theme.of(context);
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) {
        return DraggableScrollableSheet(
          initialChildSize: 0.5,
          maxChildSize: 0.85,
          minChildSize: 0.3,
          expand: false,
          builder: (_, scrollController) {
            return Container(
              padding: const EdgeInsets.fromLTRB(20, 12, 20, 20),
              child: Column(
                children: [
                  Container(
                    width: 40,
                    height: 4,
                    decoration: BoxDecoration(
                      color: theme.colorScheme.outline,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text('$category Expenses',
                      style: theme.textTheme.titleMedium),
                  const SizedBox(height: 4),
                  Text('${items.length} transactions',
                      style: theme.textTheme.bodySmall),
                  const SizedBox(height: 16),
                  Expanded(
                    child: ListView.builder(
                      controller: scrollController,
                      itemCount: items.length,
                      itemBuilder: (_, i) {
                        final e = items[i];
                        return ListTile(
                          title: Text(e.title),
                          subtitle: Text(e.date.toString().substring(0, 10)),
                          trailing: Text('$sym${e.amount.toStringAsFixed(0)}',
                              style: theme.textTheme.labelLarge),
                        );
                      },
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }
}
