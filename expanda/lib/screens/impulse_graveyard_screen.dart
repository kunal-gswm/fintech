import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:uuid/uuid.dart';
import 'dart:math';
import '../providers/impulse_provider.dart';
import '../providers/settings_provider.dart';
import '../models/impulse_item.dart';

class ImpulseGraveyardScreen extends ConsumerStatefulWidget {
  const ImpulseGraveyardScreen({super.key});

  @override
  ConsumerState<ImpulseGraveyardScreen> createState() => _ImpulseGraveyardScreenState();
}

class _ImpulseGraveyardScreenState extends ConsumerState<ImpulseGraveyardScreen> {
  final _titleController = TextEditingController();
  final _amountController = TextEditingController();
  double _customRate = 0.08; // 8% default

  @override
  void dispose() {
    _titleController.dispose();
    _amountController.dispose();
    super.dispose();
  }

  void _showAddItemDialog(BuildContext context, ThemeData theme, String sym) {
    _titleController.clear();
    _amountController.clear();
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (ctx) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(ctx).viewInsets.bottom,
          left: 20,
          right: 20,
          top: 20,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Bury an Impulse Buy', style: theme.textTheme.titleLarge),
            const SizedBox(height: 16),
            TextField(
              controller: _titleController,
              decoration: const InputDecoration(labelText: 'What did you skip buying?'),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _amountController,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              decoration: InputDecoration(
                labelText: 'Cost ($sym)',
                prefixText: sym,
              ),
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: FilledButton(
                onPressed: () {
                  final title = _titleController.text.trim();
                  final amountStr = _amountController.text.trim();
                  if (title.isNotEmpty && amountStr.isNotEmpty) {
                    final amount = double.tryParse(amountStr);
                    if (amount != null && amount > 0) {
                      final item = ImpulseItem(
                        id: const Uuid().v4(),
                        title: title,
                        amount: amount,
                        dateSkipped: DateTime.now(),
                      );
                      ref.read(impulseProvider.notifier).addImpulse(item);
                      Navigator.pop(ctx);
                    }
                  }
                },
                child: const Text('Send to Graveyard'),
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final items = ref.watch(impulseProvider);
    final settings = ref.watch(settingsProvider);
    final sym = settings.currencySymbol;
    final totalSkipped = ref.read(impulseProvider.notifier).getTotalSkipped();

    // A = P(1+r)^t
    final value10Yrs = totalSkipped * pow(1 + _customRate, 10);
    final value20Yrs = totalSkipped * pow(1 + _customRate, 20);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Impulse Graveyard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings_suggest_rounded),
            tooltip: 'Change Interest Rate',
            onPressed: () => _showRateDialog(context, theme),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showAddItemDialog(context, theme, sym),
        icon: const Icon(Icons.add),
        label: const Text('Bury Item'),
      ),
      body: Column(
        children: [
          // Header Card
          Container(
            width: double.infinity,
            margin: const EdgeInsets.all(16),
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [theme.colorScheme.primaryContainer, theme.colorScheme.secondaryContainer],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Column(
              children: [
                const Icon(Icons.auto_graph_rounded, size: 40),
                const SizedBox(height: 12),
                Text(
                  'Money Saved: $sym${totalSkipped.toStringAsFixed(0)}',
                  style: theme.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 16),
                const Text('Potential Future Value', style: TextStyle(fontWeight: FontWeight.w500)),
                Text('(@ ${(_customRate * 100).toInt()}% annual return)', style: theme.textTheme.bodySmall),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    Column(
                      children: [
                        Text('In 10 Years', style: theme.textTheme.bodyMedium),
                        Text('$sym${value10Yrs.toStringAsFixed(0)}', style: theme.textTheme.titleMedium?.copyWith(color: theme.colorScheme.primary)),
                      ],
                    ),
                    Column(
                      children: [
                        Text('In 20 Years', style: theme.textTheme.bodyMedium),
                        Text('$sym${value20Yrs.toStringAsFixed(0)}', style: theme.textTheme.titleMedium?.copyWith(color: theme.colorScheme.primary)),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ),

          // List
          Expanded(
            child: items.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.money_off_rounded, size: 48, color: theme.colorScheme.outline),
                        const SizedBox(height: 16),
                        Text('Graveyard is empty.', style: theme.textTheme.titleMedium),
                        const Text('Bury your urges and watch your wealth grow.'),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    itemCount: items.length,
                    itemBuilder: (ctx, i) {
                      final item = items[i];
                      return Dismissible(
                        key: Key(item.id),
                        background: Container(
                          color: Colors.red.shade400,
                          alignment: Alignment.centerRight,
                          padding: const EdgeInsets.only(right: 20),
                          child: const Icon(Icons.delete, color: Colors.white),
                        ),
                        direction: DismissDirection.endToStart,
                        onDismissed: (_) {
                          ref.read(impulseProvider.notifier).removeImpulse(item.id);
                        },
                        child: Card(
                          margin: const EdgeInsets.only(bottom: 12),
                          child: ListTile(
                            leading: Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: theme.colorScheme.surfaceContainerHighest,
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(Icons.close_rounded, size: 20),
                            ),
                            title: Text(item.title, style: const TextStyle(fontWeight: FontWeight.bold)),
                            subtitle: Text('${item.dateSkipped.day}/${item.dateSkipped.month}/${item.dateSkipped.year}'),
                            trailing: Text('$sym${item.amount.toStringAsFixed(0)}', style: theme.textTheme.titleMedium),
                          ),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }

  void _showRateDialog(BuildContext context, ThemeData theme) {
    final controller = TextEditingController(text: (_customRate * 100).toInt().toString());
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Investment Return Rate'),
        content: TextField(
          controller: controller,
          keyboardType: TextInputType.number,
          decoration: const InputDecoration(suffixText: '%'),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          FilledButton(
            onPressed: () {
              final r = double.tryParse(controller.text);
              if (r != null && r > 0) {
                setState(() => _customRate = r / 100);
                Navigator.pop(ctx);
              }
            },
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }
}
