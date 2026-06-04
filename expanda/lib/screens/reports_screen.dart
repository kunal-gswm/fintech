import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:excel/excel.dart';
import 'package:path_provider/path_provider.dart';
import 'package:share_plus/share_plus.dart';
import '../providers/expense_provider.dart';
import '../providers/settings_provider.dart';

class ReportsScreen extends ConsumerStatefulWidget {
  const ReportsScreen({super.key});

  @override
  ConsumerState<ReportsScreen> createState() => _ReportsScreenState();
}

class _ReportsScreenState extends ConsumerState<ReportsScreen> {
  String _selectedMonth = '';

  @override
  Widget build(BuildContext context) {
    final expenses = ref.watch(expenseListProvider);
    final settings = ref.watch(settingsProvider);
    final theme = Theme.of(context);
    final sym = settings.currencySymbol;
    final income = settings.monthlyIncome;

    // Get available months
    final monthsSet = <String>{};
    for (final e in expenses) {
      monthsSet.add(
          '${e.date.year}-${e.date.month.toString().padLeft(2, '0')}');
    }
    final months = monthsSet.toList()..sort((a, b) => b.compareTo(a));
    if (_selectedMonth.isEmpty && months.isNotEmpty) {
      _selectedMonth = months.first;
    }

    // Filter for selected month
    final monthExpenses = expenses.where((e) {
      final key =
          '${e.date.year}-${e.date.month.toString().padLeft(2, '0')}';
      return key == _selectedMonth;
    }).toList();

    final totalExpenses =
        monthExpenses.fold(0.0, (sum, e) => sum + e.amount);
    final savings = income - totalExpenses;
    final savingsRate = income > 0 ? (savings / income * 100) : 0.0;

    // Year-to-date
    final now = DateTime.now();
    final ytdExpenses = expenses
        .where((e) => e.date.year == now.year)
        .fold(0.0, (sum, e) => sum + e.amount);
    final ytdIncome = income * now.month;
    final ytdSavings = ytdIncome - ytdExpenses;

    // Chart data: last 6 months
    final chartData = <Map<String, dynamic>>[];
    for (int i = 5; i >= 0; i--) {
      final m = DateTime(now.year, now.month - i, 1);
      final key =
          '${m.year}-${m.month.toString().padLeft(2, '0')}';
      final total = expenses
          .where((e) =>
              '${e.date.year}-${e.date.month.toString().padLeft(2, '0')}' ==
              key)
          .fold(0.0, (sum, e) => sum + e.amount);
      chartData.add({'month': key, 'expenses': total, 'income': income});
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Reports'),
        actions: [
          IconButton(
            icon: const Icon(Icons.share_rounded),
            tooltip: 'Export Excel',
            onPressed: () => _exportExcel(context, ref, sym),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // YTD Summary
          Card(
            child: Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(16),
                gradient: LinearGradient(
                  colors: [
                    theme.colorScheme.primary.withValues(alpha: 0.08),
                    Colors.transparent,
                  ],
                ),
              ),
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Year-to-Date (${now.year})',
                      style: theme.textTheme.titleMedium),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      _ytdItem(theme, 'Income', '$sym${_fmt(ytdIncome)}',
                          const Color(0xFF3B82F6)),
                      _ytdItem(theme, 'Expenses', '$sym${_fmt(ytdExpenses)}',
                          const Color(0xFFF59E0B)),
                      _ytdItem(theme, 'Savings', '$sym${_fmt(ytdSavings)}',
                          const Color(0xFF10B981)),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Month selector
          if (months.isNotEmpty)
            SizedBox(
              height: 40,
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: months.map((m) {
                  final selected = m == _selectedMonth;
                  final parts = m.split('-');
                  const mNames = [
                    '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                  ];
                  final label =
                      '${mNames[int.parse(parts[1])]} ${parts[0]}';
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: FilterChip(
                      label: Text(label),
                      selected: selected,
                      showCheckmark: false,
                      onSelected: (_) =>
                          setState(() => _selectedMonth = m),
                    ),
                  );
                }).toList(),
              ),
            ),
          const SizedBox(height: 16),

          // KPI cards for selected month
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            childAspectRatio: 1.8,
            children: [
              _kpiCard(theme, 'Income', '$sym${_fmt(income)}',
                  Icons.wallet_rounded, const Color(0xFF3B82F6)),
              _kpiCard(theme, 'Expenses', '$sym${_fmt(totalExpenses)}',
                  Icons.credit_card_rounded, const Color(0xFFF59E0B)),
              _kpiCard(theme, 'Savings', '$sym${_fmt(savings)}',
                  Icons.savings_rounded, const Color(0xFF10B981)),
              _kpiCard(
                  theme,
                  'Rate',
                  '${savingsRate.toStringAsFixed(1)}%',
                  Icons.trending_up_rounded,
                  const Color(0xFF8B5CF6)),
            ],
          ),
          const SizedBox(height: 16),

          // 6-month bar chart
          Card(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('6-Month Overview',
                      style: theme.textTheme.titleMedium),
                  const SizedBox(height: 16),
                  SizedBox(
                    height: 220,
                    child: BarChart(
                      BarChartData(
                        alignment: BarChartAlignment.spaceAround,
                        barGroups:
                            chartData.asMap().entries.map((entry) {
                          return BarChartGroupData(
                            x: entry.key,
                            barRods: [
                              BarChartRodData(
                                toY: entry.value['income'] as double,
                                color: const Color(0xFF3B82F6),
                                width: 14,
                                borderRadius: const BorderRadius.vertical(
                                    top: Radius.circular(4)),
                              ),
                              BarChartRodData(
                                toY: entry.value['expenses'] as double,
                                color: const Color(0xFFF59E0B),
                                width: 14,
                                borderRadius: const BorderRadius.vertical(
                                    top: Radius.circular(4)),
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
                              getTitlesWidget: (v, _) {
                                final idx = v.toInt();
                                if (idx >= chartData.length) {
                                  return const SizedBox.shrink();
                                }
                                final m = chartData[idx]['month'] as String;
                                final parts = m.split('-');
                                const mNames = [
                                  '', 'J', 'F', 'M', 'A', 'M', 'J',
                                  'J', 'A', 'S', 'O', 'N', 'D'
                                ];
                                return Padding(
                                  padding: const EdgeInsets.only(top: 8),
                                  child: Text(
                                      mNames[int.parse(parts[1])],
                                      style: const TextStyle(fontSize: 11)),
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
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      _legendDot(const Color(0xFF3B82F6), 'Income'),
                      const SizedBox(width: 20),
                      _legendDot(const Color(0xFFF59E0B), 'Expenses'),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // AI Insights
          Card(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(Icons.lightbulb_rounded,
                          size: 20, color: const Color(0xFFF59E0B)),
                      const SizedBox(width: 8),
                      Text('Key Insights',
                          style: theme.textTheme.titleMedium),
                    ],
                  ),
                  const SizedBox(height: 12),
                  ..._generateInsights(
                          totalExpenses, income, savingsRate, monthExpenses)
                      .asMap()
                      .entries
                      .map((entry) => Padding(
                            padding: const EdgeInsets.only(bottom: 8),
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Container(
                                  margin: const EdgeInsets.only(top: 4),
                                  width: 22,
                                  height: 22,
                                  decoration: BoxDecoration(
                                    color: theme.colorScheme.primary
                                        .withValues(alpha: 0.1),
                                    shape: BoxShape.circle,
                                  ),
                                  child: Center(
                                    child: Text('${entry.key + 1}',
                                        style: TextStyle(
                                            fontSize: 11,
                                            fontWeight: FontWeight.w700,
                                            color:
                                                theme.colorScheme.primary)),
                                  ),
                                ),
                                const SizedBox(width: 10),
                                Expanded(
                                  child: Text(entry.value,
                                      style: theme.textTheme.bodyMedium),
                                ),
                              ],
                            ),
                          )),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _ytdItem(ThemeData theme, String label, String value, Color color) {
    return Expanded(
      child: Column(
        children: [
          Text(label, style: theme.textTheme.bodySmall),
          const SizedBox(height: 4),
          Text(value,
              style: theme.textTheme.labelLarge
                  ?.copyWith(color: color, fontWeight: FontWeight.w700)),
        ],
      ),
    );
  }

  Widget _kpiCard(ThemeData theme, String label, String value,
      IconData icon, Color color) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Icon(icon, size: 20, color: color),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: theme.textTheme.bodySmall),
                Text(value,
                    style: theme.textTheme.titleMedium
                        ?.copyWith(fontWeight: FontWeight.w700)),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _legendDot(Color color, String label) {
    return Row(
      children: [
        Container(
          width: 10,
          height: 10,
          decoration: BoxDecoration(
              color: color, borderRadius: BorderRadius.circular(3)),
        ),
        const SizedBox(width: 6),
        Text(label, style: const TextStyle(fontSize: 12)),
      ],
    );
  }

  List<String> _generateInsights(double expenses, double income,
      double rate, List<dynamic> items) {
    final insights = <String>[];
    if (income > 0) {
      insights.add(
          'You spent ${(expenses / income * 100).toStringAsFixed(0)}% of your income this month.');
    }
    if (rate >= 30) {
      insights.add(
          'Excellent savings rate of ${rate.toStringAsFixed(0)}%. You\'re on track for financial independence.');
    } else if (rate >= 0) {
      insights.add(
          'Savings rate is ${rate.toStringAsFixed(0)}%. Aim for at least 20–30% for long-term stability.');
    }
    insights.add('You made ${items.length} transactions this month.');
    return insights;
  }

  String _fmt(double v) {
    if (v >= 100000) return '${(v / 100000).toStringAsFixed(1)}L';
    if (v >= 1000) return '${(v / 1000).toStringAsFixed(1)}K';
    return v.toStringAsFixed(0);
  }

  Future<void> _exportExcel(
      BuildContext context, WidgetRef ref, String sym) async {
    HapticFeedback.mediumImpact();
    final expenses = ref.read(expenseListProvider);
    final filtered = expenses.where((e) {
      final key =
          '${e.date.year}-${e.date.month.toString().padLeft(2, '0')}';
      return key == _selectedMonth;
    }).toList();

    final excel = Excel.createExcel();
    final sheet = excel['Sheet1'];

    // Headers
    sheet.appendRow([
      TextCellValue('Title'),
      TextCellValue('Amount ($sym)'),
      TextCellValue('Category'),
      TextCellValue('Date'),
      TextCellValue('Notes'),
      TextCellValue('Payment Method'),
    ]);

    // Rows
    for (final e in filtered) {
      sheet.appendRow([
        TextCellValue(e.title),
        DoubleCellValue(e.amount),
        TextCellValue(e.category),
        TextCellValue(e.date.toIso8601String().substring(0, 10)),
        TextCellValue(e.notes ?? ''),
        TextCellValue(e.paymentMethod ?? 'N/A'),
      ]);
    }

    final fileBytes = excel.save();
    if (fileBytes == null) return;

    final dir = await getTemporaryDirectory();
    final file = File('${dir.path}/expanda_report_$_selectedMonth.xlsx');
    await file.writeAsBytes(fileBytes);

    await Share.shareXFiles([XFile(file.path)],
        text: 'EXPANDA Excel Report — $_selectedMonth');
  }
}
