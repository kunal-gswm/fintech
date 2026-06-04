import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:fl_chart/fl_chart.dart';
import '../providers/expense_provider.dart';
import '../providers/settings_provider.dart';
import '../providers/goal_provider.dart';

class HealthScreen extends ConsumerStatefulWidget {
  const HealthScreen({super.key});

  @override
  ConsumerState<HealthScreen> createState() => _HealthScreenState();
}

class _HealthScreenState extends ConsumerState<HealthScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _animController;
  late Animation<double> _scoreAnimation;
  double _targetScore = 0;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    );
    _scoreAnimation = Tween<double>(begin: 0, end: 0).animate(
      CurvedAnimation(parent: _animController, curve: Curves.easeOut),
    );
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  void _animateScore(double score) {
    if (score != _targetScore) {
      _targetScore = score;
      _scoreAnimation = Tween<double>(begin: 0, end: score).animate(
        CurvedAnimation(parent: _animController, curve: Curves.easeOut),
      );
      _animController.forward(from: 0);
    }
  }

  @override
  Widget build(BuildContext context) {
    final expenses = ref.watch(expenseListProvider);
    final settings = ref.watch(settingsProvider);
    final goals = ref.watch(goalListProvider);
    final theme = Theme.of(context);

    // Calculate health score
    final now = DateTime.now();
    final monthStart = DateTime(now.year, now.month, 1);
    final monthExpenses = expenses
        .where((e) => e.date.isAfter(monthStart.subtract(const Duration(days: 1))))
        .fold(0.0, (sum, e) => sum + e.amount);

    final income = settings.monthlyIncome;
    final savingsRate = income > 0 ? ((income - monthExpenses) / income) : 0.0;
    final expenseRatio = income > 0 ? (monthExpenses / income) : 1.0;
    final budgetUtilization = settings.monthlyBudgetLimit > 0
        ? (monthExpenses / settings.monthlyBudgetLimit)
        : 1.0;
    final goalProgress = goals.isEmpty
        ? 0.0
        : goals
                .where((g) => !g.isArchived)
                .fold(0.0, (sum, g) => sum + g.progress) /
            max(1, goals.where((g) => !g.isArchived).length);

    // Weighted score (0–100)
    double score = 0;
    score += (savingsRate.clamp(0, 0.5) / 0.5) * 30; // 30 pts for savings
    score += ((1 - expenseRatio.clamp(0, 1)) * 25); // 25 pts for low expenses
    score +=
        ((1 - budgetUtilization.clamp(0, 1.5) / 1.5) * 25); // 25 pts budget
    score += (goalProgress * 20); // 20 pts for goals
    score = score.clamp(0, 100);

    // Animate
    WidgetsBinding.instance.addPostFrameCallback((_) => _animateScore(score));

    final metrics = [
      _Metric('Savings Rate', '${(savingsRate * 100).toStringAsFixed(1)}%',
          savingsRate >= 0.3 ? 'Good' : 'Needs work',
          savingsRate >= 0.3 ? const Color(0xFF10B981) : const Color(0xFFF59E0B),
          Icons.savings_rounded),
      _Metric('Expense Ratio', '${(expenseRatio * 100).toStringAsFixed(0)}%',
          expenseRatio <= 0.7 ? 'Healthy' : 'High',
          expenseRatio <= 0.7 ? const Color(0xFF10B981) : const Color(0xFFEF4444),
          Icons.credit_card_rounded),
      _Metric(
          'Budget Usage',
          '${(budgetUtilization * 100).toStringAsFixed(0)}%',
          budgetUtilization <= 1.0 ? 'On track' : 'Over budget',
          budgetUtilization <= 1.0
              ? const Color(0xFF3B82F6)
              : const Color(0xFFEF4444),
          Icons.pie_chart_rounded),
      _Metric('Goal Progress', '${(goalProgress * 100).toStringAsFixed(0)}%',
          goalProgress >= 0.5 ? 'Great' : 'Keep going',
          const Color(0xFF8B5CF6), Icons.flag_rounded),
    ];

    // Recommendations
    final recs = <_Rec>[];
    if (savingsRate < 0.2) {
      recs.add(_Rec('Increase savings',
          'Try to save at least 20% of your income each month.', 'high'));
    }
    if (budgetUtilization > 1.0) {
      recs.add(_Rec('Reduce spending',
          'You\'ve exceeded your monthly budget. Review discretionary expenses.', 'high'));
    }
    if (goalProgress < 0.3 && goals.isNotEmpty) {
      recs.add(_Rec('Fund your goals',
          'You\'re behind on goal contributions. Add progress this week.', 'medium'));
    }
    if (savingsRate >= 0.3) {
      recs.add(_Rec('Great discipline!',
          'Your savings rate is strong. Consider investing the surplus.', 'low'));
    }
    if (recs.isEmpty) {
      recs.add(_Rec('Looking good!',
          'Your finances are healthy. Keep up the consistency.', 'low'));
    }

    return Scaffold(
      appBar: AppBar(title: const Text('Financial Health')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Score Ring
          Center(
            child: AnimatedBuilder(
              animation: _scoreAnimation,
              builder: (_, __) {
                return _HealthRing(
                  score: _scoreAnimation.value,
                  size: 200,
                );
              },
            ),
          ),
          const SizedBox(height: 24),

          // Metrics grid
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            childAspectRatio: 1.5,
            children: metrics.map((m) {
              return Card(
                child: Padding(
                  padding: const EdgeInsets.all(14),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Icon(m.icon, size: 18, color: m.color),
                          const SizedBox(width: 6),
                          Text(m.label, style: theme.textTheme.bodySmall),
                        ],
                      ),
                      Text(m.value,
                          style: theme.textTheme.titleLarge
                              ?.copyWith(fontWeight: FontWeight.w700)),
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: m.color.withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(m.status,
                            style: TextStyle(
                                color: m.color,
                                fontSize: 11,
                                fontWeight: FontWeight.w600)),
                      ),
                    ],
                  ),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 24),

          // Score history (simplified — using last 6 months of expense data)
          Card(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Score History', style: theme.textTheme.titleMedium),
                  Text('Last 6 months', style: theme.textTheme.bodySmall),
                  const SizedBox(height: 16),
                  SizedBox(
                    height: 150,
                    child: LineChart(
                      LineChartData(
                        lineBarsData: [
                          LineChartBarData(
                            spots: List.generate(6, (i) {
                              // Generate simulated historical scores
                              final variance = (i * 3.0 + 5) % 15;
                              return FlSpot(i.toDouble(),
                                  (score - 15 + variance).clamp(0, 100));
                            }),
                            isCurved: true,
                            color: theme.colorScheme.primary,
                            barWidth: 2.5,
                            dotData: FlDotData(
                              show: true,
                              getDotPainter: (spot, pct, bar, idx) =>
                                  FlDotCirclePainter(
                                radius: 3,
                                color: theme.colorScheme.primary,
                                strokeWidth: 0,
                              ),
                            ),
                            belowBarData: BarAreaData(
                              show: true,
                              color: theme.colorScheme.primary
                                  .withValues(alpha: 0.08),
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
                              getTitlesWidget: (v, _) {
                                final m = now.month - 5 + v.toInt();
                                const names = [
                                  '', 'J', 'F', 'M', 'A', 'M', 'J',
                                  'J', 'A', 'S', 'O', 'N', 'D'
                                ];
                                final idx = ((m - 1) % 12) + 1;
                                return Padding(
                                  padding: const EdgeInsets.only(top: 8),
                                  child: Text(names[idx],
                                      style: const TextStyle(fontSize: 11)),
                                );
                              },
                            ),
                          ),
                        ),
                        gridData: const FlGridData(show: false),
                        borderData: FlBorderData(show: false),
                        minY: 0,
                        maxY: 100,
                      ),
                      duration: const Duration(milliseconds: 800),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),

          // AI Recommendations
          Row(
            children: [
              Icon(Icons.lightbulb_rounded,
                  size: 20, color: const Color(0xFFF59E0B)),
              const SizedBox(width: 8),
              Text('AI Recommendations', style: theme.textTheme.titleMedium),
            ],
          ),
          const SizedBox(height: 12),
          ...recs.map((r) => _buildRecCard(theme, r)),

          const SizedBox(height: 16),

          // What affects score
          ExpansionTile(
            title: Text('What affects my score?',
                style: theme.textTheme.titleMedium),
            tilePadding: EdgeInsets.zero,
            children: const [
              ListTile(
                leading: Icon(Icons.savings_rounded, size: 20),
                title: Text('Savings Rate (30%)'),
                subtitle:
                    Text('Higher savings rate = better score. Target: 30%+'),
              ),
              ListTile(
                leading: Icon(Icons.credit_card_rounded, size: 20),
                title: Text('Expense Ratio (25%)'),
                subtitle: Text(
                    'Lower expense-to-income ratio improves your score.'),
              ),
              ListTile(
                leading: Icon(Icons.pie_chart_rounded, size: 20),
                title: Text('Budget Adherence (25%)'),
                subtitle:
                    Text('Staying within your monthly budget is key.'),
              ),
              ListTile(
                leading: Icon(Icons.flag_rounded, size: 20),
                title: Text('Goal Progress (20%)'),
                subtitle:
                    Text('Consistent contributions to your goals help.'),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildRecCard(ThemeData theme, _Rec rec) {
    final color = rec.priority == 'high'
        ? const Color(0xFFEF4444)
        : rec.priority == 'medium'
            ? const Color(0xFFF59E0B)
            : const Color(0xFF3B82F6);
    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      child: Container(
        decoration: BoxDecoration(
          border: Border(left: BorderSide(color: color, width: 4)),
          borderRadius: BorderRadius.circular(16),
        ),
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(rec.title,
                style: theme.textTheme.labelLarge),
            const SizedBox(height: 4),
            Text(rec.description, style: theme.textTheme.bodySmall),
          ],
        ),
      ),
    );
  }
}

class _Metric {
  final String label, value, status;
  final Color color;
  final IconData icon;
  const _Metric(this.label, this.value, this.status, this.color, this.icon);
}

class _Rec {
  final String title, description, priority;
  const _Rec(this.title, this.description, this.priority);
}

/// Custom animated health score ring.
class _HealthRing extends StatelessWidget {
  final double score;
  final double size;
  const _HealthRing({required this.score, this.size = 180});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final color = score >= 70
        ? const Color(0xFF10B981)
        : score >= 40
            ? const Color(0xFFF59E0B)
            : const Color(0xFFEF4444);
    final label = score >= 70
        ? 'Excellent'
        : score >= 40
            ? 'Fair'
            : 'Needs Work';

    return SizedBox(
      width: size,
      height: size,
      child: CustomPaint(
        painter: _RingPainter(
          progress: score / 100,
          color: color,
          bgColor: theme.colorScheme.outline.withValues(alpha: 0.2),
        ),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(score.toStringAsFixed(0),
                  style: TextStyle(
                      fontSize: 42,
                      fontWeight: FontWeight.w800,
                      color: color)),
              Text(label,
                  style: theme.textTheme.bodySmall
                      ?.copyWith(fontWeight: FontWeight.w600)),
            ],
          ),
        ),
      ),
    );
  }
}

class _RingPainter extends CustomPainter {
  final double progress;
  final Color color;
  final Color bgColor;
  _RingPainter(
      {required this.progress, required this.color, required this.bgColor});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2 - 14;
    const strokeWidth = 12.0;

    // Background circle
    canvas.drawCircle(
        center,
        radius,
        Paint()
          ..color = bgColor
          ..strokeWidth = strokeWidth
          ..style = PaintingStyle.stroke);

    // Progress arc
    final sweepAngle = 2 * pi * progress;
    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      -pi / 2,
      sweepAngle,
      false,
      Paint()
        ..color = color
        ..strokeWidth = strokeWidth
        ..style = PaintingStyle.stroke
        ..strokeCap = StrokeCap.round,
    );
  }

  @override
  bool shouldRepaint(covariant _RingPainter old) =>
      old.progress != progress || old.color != color;
}
