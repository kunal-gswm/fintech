import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/expense_provider.dart';
import '../providers/settings_provider.dart';
import '../models/expense.dart';
import '../models/constants.dart';

class ExpensesScreen extends ConsumerStatefulWidget {
  const ExpensesScreen({super.key});

  @override
  ConsumerState<ExpensesScreen> createState() => _ExpensesScreenState();
}

class _ExpensesScreenState extends ConsumerState<ExpensesScreen> {
  String _search = '';
  String _categoryFilter = 'All';

  @override
  Widget build(BuildContext context) {
    final expenses = ref.watch(expenseListProvider);
    final selection = ref.watch(expenseSelectionProvider);
    final settings = ref.watch(settingsProvider);
    final theme = Theme.of(context);
    final sym = settings.currencySymbol;
    final isSelecting = selection.isNotEmpty;

    final filtered = expenses.where((e) {
      final matchesSearch = e.title.toLowerCase().contains(_search.toLowerCase()) ||
          (e.notes?.toLowerCase().contains(_search.toLowerCase()) ?? false);
      final matchesCat = _categoryFilter == 'All' || e.category == _categoryFilter;
      return matchesSearch && matchesCat;
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: isSelecting
            ? Text('${selection.length} selected')
            : const Text('Expenses'),
        leading: isSelecting
            ? IconButton(
                icon: const Icon(Icons.close),
                onPressed: () =>
                    ref.read(expenseSelectionProvider.notifier).clear(),
              )
            : null,
        actions: [
          if (isSelecting)
            IconButton(
              icon: const Icon(Icons.delete_outline_rounded),
              onPressed: () async {
                HapticFeedback.mediumImpact();
                final confirm = await showDialog<bool>(
                  context: context,
                  builder: (ctx) => AlertDialog(
                    title: const Text('Delete expenses'),
                    content: Text(
                        'Delete ${selection.length} selected expenses?'),
                    actions: [
                      TextButton(
                          onPressed: () => Navigator.pop(ctx, false),
                          child: const Text('Cancel')),
                      TextButton(
                          onPressed: () => Navigator.pop(ctx, true),
                          child: const Text('Delete',
                              style: TextStyle(color: Colors.red))),
                    ],
                  ),
                );
                if (confirm == true) {
                  await ref
                      .read(expenseListProvider.notifier)
                      .deleteMultiple(selection);
                  ref.read(expenseSelectionProvider.notifier).clear();
                }
              },
            )
          else
            IconButton(
              icon: const Icon(Icons.add_rounded),
              onPressed: () => _showAddEditSheet(context, ref, theme, sym),
            ),
        ],
      ),
      body: Column(
        children: [
          // Search bar
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 4),
            child: TextField(
              onChanged: (v) => setState(() => _search = v),
              decoration: const InputDecoration(
                hintText: 'Search expenses...',
                prefixIcon: Icon(Icons.search_rounded, size: 20),
              ),
            ),
          ),

          // Category filter chips
          SizedBox(
            height: 44,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              children: [
                Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: FilterChip(
                    label: const Text('All'),
                    selected: _categoryFilter == 'All',
                    showCheckmark: false,
                    onSelected: (_) =>
                        setState(() => _categoryFilter = 'All'),
                  ),
                ),
                ...AppConstants.expenseCategories.map((cat) => Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: FilterChip(
                        label: Text(cat),
                        selected: _categoryFilter == cat,
                        showCheckmark: false,
                        onSelected: (_) =>
                            setState(() => _categoryFilter = cat),
                      ),
                    )),
              ],
            ),
          ),
          const SizedBox(height: 8),

          // List
          Expanded(
            child: filtered.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.receipt_long_rounded,
                            size: 56,
                            color: theme.colorScheme.onSurface
                                .withValues(alpha: 0.2)),
                        const SizedBox(height: 12),
                        Text('No expenses found',
                            style: theme.textTheme.bodyMedium),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: filtered.length,
                    itemBuilder: (_, i) {
                      final expense = filtered[i];
                      final selected = selection.contains(expense.id);
                      final catColor =
                          AppConstants.categoryColors[expense.category] ??
                              Colors.grey;

                      return Dismissible(
                        key: Key(expense.id),
                        direction: isSelecting
                            ? DismissDirection.none
                            : DismissDirection.endToStart,
                        confirmDismiss: (_) async {
                          HapticFeedback.mediumImpact();
                          return await showDialog<bool>(
                            context: context,
                            builder: (ctx) => AlertDialog(
                              title: const Text('Delete expense'),
                              content: Text(
                                  'Delete "${expense.title}"?'),
                              actions: [
                                TextButton(
                                    onPressed: () =>
                                        Navigator.pop(ctx, false),
                                    child: const Text('Cancel')),
                                TextButton(
                                    onPressed: () =>
                                        Navigator.pop(ctx, true),
                                    child: const Text('Delete',
                                        style: TextStyle(
                                            color: Colors.red))),
                              ],
                            ),
                          );
                        },
                        onDismissed: (_) => ref
                            .read(expenseListProvider.notifier)
                            .delete(expense.id),
                        background: Container(
                          alignment: Alignment.centerRight,
                          padding: const EdgeInsets.only(right: 20),
                          margin: const EdgeInsets.only(bottom: 8),
                          decoration: BoxDecoration(
                            color: theme.colorScheme.error
                                .withValues(alpha: 0.12),
                            borderRadius: BorderRadius.circular(14),
                          ),
                          child: Icon(Icons.delete_outline_rounded,
                              color: theme.colorScheme.error),
                        ),
                        child: GestureDetector(
                          onLongPress: () {
                            HapticFeedback.mediumImpact();
                            ref
                                .read(expenseSelectionProvider.notifier)
                                .toggle(expense.id);
                          },
                          onTap: () {
                            if (isSelecting) {
                              ref
                                  .read(expenseSelectionProvider.notifier)
                                  .toggle(expense.id);
                            } else {
                              _showAddEditSheet(
                                  context, ref, theme, sym,
                                  existing: expense);
                            }
                          },
                          child: Container(
                            margin: const EdgeInsets.only(bottom: 8),
                            padding: const EdgeInsets.all(14),
                            decoration: BoxDecoration(
                              color: selected
                                  ? theme.colorScheme.primary
                                      .withValues(alpha: 0.1)
                                  : theme.cardTheme.color,
                              borderRadius: BorderRadius.circular(14),
                              border: Border.all(
                                color: selected
                                    ? theme.colorScheme.primary
                                    : theme.colorScheme.outline,
                                width: selected ? 1.5 : 0.5,
                              ),
                            ),
                            child: Row(
                              children: [
                                if (isSelecting)
                                  Padding(
                                    padding:
                                        const EdgeInsets.only(right: 12),
                                    child: Icon(
                                      selected
                                          ? Icons.check_circle_rounded
                                          : Icons.circle_outlined,
                                      color: selected
                                          ? theme.colorScheme.primary
                                          : theme.colorScheme.outline,
                                      size: 22,
                                    ),
                                  ),
                                Container(
                                  width: 40,
                                  height: 40,
                                  decoration: BoxDecoration(
                                    color: catColor.withValues(alpha: 0.12),
                                    borderRadius:
                                        BorderRadius.circular(10),
                                  ),
                                  child: Icon(
                                    AppConstants.categoryIcons[
                                            expense.category] ??
                                        Icons.more_horiz_rounded,
                                    color: catColor,
                                    size: 20,
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(expense.title,
                                          style:
                                              theme.textTheme.labelLarge,
                                          maxLines: 1,
                                          overflow:
                                              TextOverflow.ellipsis),
                                      Row(
                                        children: [
                                          Text(expense.category,
                                              style: theme
                                                  .textTheme.bodySmall),
                                          if (expense.isRecurring) ...[
                                            const SizedBox(width: 6),
                                            Icon(Icons.repeat_rounded,
                                                size: 12,
                                                color: theme.colorScheme
                                                    .primary),
                                          ],
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                                Column(
                                  crossAxisAlignment:
                                      CrossAxisAlignment.end,
                                  children: [
                                    Text(
                                      '$sym${expense.amount.toStringAsFixed(0)}',
                                      style: theme.textTheme.labelLarge
                                          ?.copyWith(
                                              color: const Color(
                                                  0xFFE5B80B)),
                                    ),
                                    Text(
                                      '${expense.date.day}/${expense.date.month}',
                                      style: theme.textTheme.bodySmall,
                                    ),
                                  ],
                                ),
                              ],
                            ),
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

  void _showAddEditSheet(
    BuildContext context,
    WidgetRef ref,
    ThemeData theme,
    String sym, {
    Expense? existing,
  }) {
    final titleC = TextEditingController(text: existing?.title ?? '');
    final amountC = TextEditingController(
        text: existing?.amount.toStringAsFixed(0) ?? '');
    final notesC = TextEditingController(text: existing?.notes ?? '');
    String category = existing?.category ?? AppConstants.expenseCategories.first;
    DateTime date = existing?.date ?? DateTime.now();
    bool isRecurring = existing?.isRecurring ?? false;
    String recurrenceRule = existing?.recurrenceRule ?? 'monthly';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (ctx, setBS) {
            return Padding(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(ctx).viewInsets.bottom,
              ),
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
                      Text(
                        existing != null ? 'Edit Expense' : 'Add Expense',
                        style: theme.textTheme.titleLarge,
                      ),
                      const SizedBox(height: 20),
                      TextField(
                        controller: titleC,
                        decoration:
                            const InputDecoration(labelText: 'Title'),
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: amountC,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                            labelText: 'Amount', prefixText: '$sym '),
                      ),
                      const SizedBox(height: 12),
                      DropdownButtonFormField<String>(
                        value: category,
                        decoration: const InputDecoration(
                            labelText: 'Category'),
                        items: AppConstants.expenseCategories
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
                            initialDate: date,
                            firstDate: DateTime(2020),
                            lastDate: DateTime.now(),
                          );
                          if (picked != null) setBS(() => date = picked);
                        },
                        child: InputDecorator(
                          decoration:
                              const InputDecoration(labelText: 'Date'),
                          child: Text(
                            '${date.day}/${date.month}/${date.year}',
                            style: theme.textTheme.bodyLarge,
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: notesC,
                        decoration: const InputDecoration(
                            labelText: 'Notes (optional)'),
                        maxLines: 2,
                      ),
                      const SizedBox(height: 12),
                      SwitchListTile(
                        title: const Text('Recurring'),
                        value: isRecurring,
                        onChanged: (v) => setBS(() => isRecurring = v),
                        contentPadding: EdgeInsets.zero,
                      ),
                      if (isRecurring)
                        DropdownButtonFormField<String>(
                          value: recurrenceRule,
                          decoration: const InputDecoration(
                              labelText: 'Frequency'),
                          items: ['daily', 'weekly', 'monthly']
                              .map((r) => DropdownMenuItem(
                                  value: r,
                                  child: Text(r[0].toUpperCase() +
                                      r.substring(1))))
                              .toList(),
                          onChanged: (v) =>
                              setBS(() => recurrenceRule = v!),
                        ),
                      const SizedBox(height: 24),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: () {
                            HapticFeedback.mediumImpact();
                            final amount =
                                double.tryParse(amountC.text) ?? 0;
                            if (titleC.text.isEmpty || amount <= 0) return;

                            if (existing != null) {
                              ref
                                  .read(expenseListProvider.notifier)
                                  .update(existing.copyWith(
                                    title: titleC.text,
                                    amount: amount,
                                    category: category,
                                    date: date,
                                    notes: notesC.text.isEmpty
                                        ? null
                                        : notesC.text,
                                    isRecurring: isRecurring,
                                    recurrenceRule:
                                        isRecurring ? recurrenceRule : null,
                                  ));
                            } else {
                              ref.read(expenseListProvider.notifier).add(
                                    title: titleC.text,
                                    amount: amount,
                                    category: category,
                                    date: date,
                                    notes: notesC.text.isEmpty
                                        ? null
                                        : notesC.text,
                                    isRecurring: isRecurring,
                                    recurrenceRule:
                                        isRecurring ? recurrenceRule : null,
                                  );
                            }
                            Navigator.pop(ctx);
                          },
                          child: Text(existing != null
                              ? 'Save Changes'
                              : 'Add Expense'),
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
}
