import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:confetti/confetti.dart';
import '../providers/goal_provider.dart';
import '../providers/settings_provider.dart';
import '../models/goal.dart';
import '../models/constants.dart';
import 'dart:math';

class GoalsScreen extends ConsumerStatefulWidget {
  const GoalsScreen({super.key});

  @override
  ConsumerState<GoalsScreen> createState() => _GoalsScreenState();
}

class _GoalsScreenState extends ConsumerState<GoalsScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  late ConfettiController _confettiController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _confettiController =
        ConfettiController(duration: const Duration(seconds: 3));
  }

  @override
  void dispose() {
    _tabController.dispose();
    _confettiController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final goals = ref.watch(goalListProvider);
    final settings = ref.watch(settingsProvider);
    final theme = Theme.of(context);
    final sym = settings.currencySymbol;

    final active = goals.where((g) => !g.isArchived).toList();
    final archived = goals.where((g) => g.isArchived).toList();

    return Stack(
      children: [
        Scaffold(
          appBar: AppBar(
            title: const Text('Goals'),
            actions: [
              IconButton(
                icon: const Icon(Icons.add_rounded),
                onPressed: () => _showCreateGoalSheet(context, ref, theme, sym),
              ),
            ],
            bottom: TabBar(
              controller: _tabController,
              tabs: [
                Tab(text: 'Active (${active.length})'),
                Tab(text: 'Achieved (${archived.length})'),
              ],
            ),
          ),
          body: TabBarView(
            controller: _tabController,
            children: [
              // Active goals
              active.isEmpty
                  ? _emptyState(theme, 'No active goals',
                      'Create a goal to start tracking your savings.')
                  : ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: active.length,
                      itemBuilder: (_, i) =>
                          _buildGoalCard(context, ref, theme, sym, active[i]),
                    ),
              // Archived goals
              archived.isEmpty
                  ? _emptyState(theme, 'No achieved goals',
                      'Completed goals will appear here.')
                  : ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: archived.length,
                      itemBuilder: (_, i) => _buildGoalCard(
                          context, ref, theme, sym, archived[i],
                          isArchived: true),
                    ),
            ],
          ),
        ),

        // Confetti overlay
        Align(
          alignment: Alignment.topCenter,
          child: ConfettiWidget(
            confettiController: _confettiController,
            blastDirection: pi / 2,
            maxBlastForce: 20,
            minBlastForce: 8,
            emissionFrequency: 0.05,
            numberOfParticles: 25,
            gravity: 0.2,
            colors: const [
              Color(0xFF6C63FF),
              Color(0xFF10B981),
              Color(0xFFF59E0B),
              Color(0xFFEC4899),
              Color(0xFF3B82F6),
            ],
          ),
        ),
      ],
    );
  }

  Widget _emptyState(ThemeData theme, String title, String subtitle) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.flag_rounded,
              size: 56,
              color: theme.colorScheme.onSurface.withValues(alpha: 0.2)),
          const SizedBox(height: 16),
          Text(title, style: theme.textTheme.titleMedium),
          const SizedBox(height: 4),
          Text(subtitle, style: theme.textTheme.bodyMedium),
        ],
      ),
    );
  }

  Widget _buildGoalCard(BuildContext context, WidgetRef ref, ThemeData theme,
      String sym, Goal goal,
      {bool isArchived = false}) {
    final icon = AppConstants.goalIcons[goal.category] ?? Icons.flag_rounded;
    final color =
        AppConstants.goalColors[goal.category] ?? theme.colorScheme.primary;
    final pct = (goal.progress * 100);

    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Column(
        children: [
          // Top color bar
          Container(
            height: 4,
            decoration: BoxDecoration(
              color: color,
              borderRadius:
                  const BorderRadius.vertical(top: Radius.circular(16)),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: color.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(icon, color: color, size: 22),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(goal.title,
                              style: theme.textTheme.titleMedium),
                          Text(goal.category,
                              style: theme.textTheme.bodySmall),
                        ],
                      ),
                    ),
                    if (isArchived)
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFF10B981).withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Text('✓ Done',
                            style: TextStyle(
                                color: Color(0xFF10B981),
                                fontSize: 12,
                                fontWeight: FontWeight.w600)),
                      ),
                  ],
                ),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('$sym${goal.savedAmount.toStringAsFixed(0)}',
                        style: theme.textTheme.labelLarge
                            ?.copyWith(fontWeight: FontWeight.w700)),
                    Text('$sym${goal.targetAmount.toStringAsFixed(0)}',
                        style: theme.textTheme.bodySmall),
                  ],
                ),
                const SizedBox(height: 8),
                ClipRRect(
                  borderRadius: BorderRadius.circular(4),
                  child: LinearProgressIndicator(
                    value: goal.progress,
                    minHeight: 8,
                    backgroundColor: color.withValues(alpha: 0.1),
                    valueColor: AlwaysStoppedAnimation(color),
                  ),
                ),
                const SizedBox(height: 6),
                Text('${pct.toStringAsFixed(1)}% complete',
                    style: theme.textTheme.bodySmall),
                const SizedBox(height: 12),
                // Stats row
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: theme.colorScheme.surface,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: Column(
                          children: [
                            Text('Remaining',
                                style: theme.textTheme.bodySmall),
                            Text('$sym${goal.remaining.toStringAsFixed(0)}',
                                style: theme.textTheme.labelLarge),
                          ],
                        ),
                      ),
                      Container(
                          width: 1,
                          height: 30,
                          color: theme.colorScheme.outline),
                      Expanded(
                        child: Column(
                          children: [
                            Text('Deadline',
                                style: theme.textTheme.bodySmall),
                            Text(
                                '${_monthName(goal.deadline.month)} ${goal.deadline.year}',
                                style: theme.textTheme.labelLarge),
                          ],
                        ),
                      ),
                      Container(
                          width: 1,
                          height: 30,
                          color: theme.colorScheme.outline),
                      Expanded(
                        child: Column(
                          children: [
                            Text('Monthly',
                                style: theme.textTheme.bodySmall),
                            Text('$sym${goal.monthlyTarget.toStringAsFixed(0)}',
                                style: theme.textTheme.labelLarge),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                if (!isArchived) ...[
                  const SizedBox(height: 12),
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton(
                      onPressed: () =>
                          _showAddProgressSheet(context, ref, theme, sym, goal),
                      child: const Text('Add Progress'),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _showAddProgressSheet(BuildContext context, WidgetRef ref,
      ThemeData theme, String sym, Goal goal) {
    final amountC = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (ctx) {
        return DraggableScrollableSheet(
          initialChildSize: 0.4,
          maxChildSize: 0.6,
          minChildSize: 0.3,
          expand: false,
          builder: (_, scrollController) {
            return Padding(
              padding: EdgeInsets.only(
                  bottom: MediaQuery.of(ctx).viewInsets.bottom),
              child: Container(
                padding: const EdgeInsets.all(24),
                child: SingleChildScrollView(
                  controller: scrollController,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Center(
                        child: Container(
                          width: 40,
                          height: 4,
                          decoration: BoxDecoration(
                            color: theme.colorScheme.outline,
                            borderRadius: BorderRadius.circular(2),
                          ),
                        ),
                      ),
                      const SizedBox(height: 20),
                      Text('Add Progress', style: theme.textTheme.titleLarge),
                      const SizedBox(height: 4),
                      Text('How much did you save towards "${goal.title}"?',
                          style: theme.textTheme.bodyMedium),
                      const SizedBox(height: 20),
                      TextField(
                        controller: amountC,
                        keyboardType: TextInputType.number,
                        autofocus: true,
                        decoration: InputDecoration(
                          labelText: 'Amount',
                          prefixText: '$sym ',
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Remaining: $sym${goal.remaining.toStringAsFixed(0)}',
                        style: theme.textTheme.bodySmall,
                      ),
                      const SizedBox(height: 24),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: () async {
                            HapticFeedback.mediumImpact();
                            final amount =
                                double.tryParse(amountC.text) ?? 0;
                            if (amount <= 0) return;
                            final justCompleted = await ref
                                .read(goalListProvider.notifier)
                                .addProgress(goal.id, amount);
                            if (mounted) Navigator.pop(ctx);
                            if (justCompleted) {
                              _confettiController.play();
                              // Auto-archive after a moment
                              Future.delayed(
                                  const Duration(seconds: 3), () {
                                ref
                                    .read(goalListProvider.notifier)
                                    .archive(goal.id);
                              });
                            }
                          },
                          child: const Text('Save Progress'),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        );
      },
    );
  }

  void _showCreateGoalSheet(
      BuildContext context, WidgetRef ref, ThemeData theme, String sym) {
    final titleC = TextEditingController();
    final amountC = TextEditingController();
    String category = 'Emergency Fund';
    DateTime deadline =
        DateTime.now().add(const Duration(days: 365));

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (ctx, setBS) {
            return Padding(
              padding: EdgeInsets.only(
                  bottom: MediaQuery.of(ctx).viewInsets.bottom),
              child: Container(
                padding: const EdgeInsets.all(24),
                child: SingleChildScrollView(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Center(
                        child: Container(
                          width: 40,
                          height: 4,
                          decoration: BoxDecoration(
                            color: theme.colorScheme.outline,
                            borderRadius: BorderRadius.circular(2),
                          ),
                        ),
                      ),
                      const SizedBox(height: 20),
                      Text('Create New Goal',
                          style: theme.textTheme.titleLarge),
                      const SizedBox(height: 20),
                      TextField(
                        controller: titleC,
                        decoration:
                            const InputDecoration(labelText: 'Goal Title'),
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: amountC,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          labelText: 'Target Amount',
                          prefixText: '$sym ',
                        ),
                      ),
                      const SizedBox(height: 12),
                      DropdownButtonFormField<String>(
                        value: category,
                        decoration:
                            const InputDecoration(labelText: 'Category'),
                        items: AppConstants.goalIcons.keys
                            .map((c) => DropdownMenuItem(
                                value: c, child: Text(c)))
                            .toList(),
                        onChanged: (v) => setBS(() => category = v!),
                      ),
                      const SizedBox(height: 12),
                      InkWell(
                        onTap: () async {
                          final picked = await showDatePicker(
                            context: ctx,
                            initialDate: deadline,
                            firstDate: DateTime.now(),
                            lastDate: DateTime(2040),
                          );
                          if (picked != null) {
                            setBS(() => deadline = picked);
                          }
                        },
                        child: InputDecorator(
                          decoration:
                              const InputDecoration(labelText: 'Deadline'),
                          child: Text(
                            '${deadline.day}/${deadline.month}/${deadline.year}',
                            style: theme.textTheme.bodyLarge,
                          ),
                        ),
                      ),
                      const SizedBox(height: 24),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: () {
                            HapticFeedback.mediumImpact();
                            final target =
                                double.tryParse(amountC.text) ?? 0;
                            if (titleC.text.isEmpty || target <= 0) return;
                            ref.read(goalListProvider.notifier).add(
                                  title: titleC.text,
                                  targetAmount: target,
                                  category: category,
                                  deadline: deadline,
                                );
                            Navigator.pop(ctx);
                          },
                          child: const Text('Create Goal'),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        );
      },
    );
  }

  String _monthName(int m) {
    const months = [
      '',
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];
    return months[m];
  }
}
