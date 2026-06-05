import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:uuid/uuid.dart';
import '../providers/debt_provider.dart';
import '../providers/settings_provider.dart';
import '../models/debt_item.dart';

class DebtVisualizerScreen extends ConsumerStatefulWidget {
  const DebtVisualizerScreen({super.key});

  @override
  ConsumerState<DebtVisualizerScreen> createState() => _DebtVisualizerScreenState();
}

class _DebtVisualizerScreenState extends ConsumerState<DebtVisualizerScreen> {
  double _extraPayment = 0.0;
  final _nameCtrl = TextEditingController();
  final _principalCtrl = TextEditingController();
  final _rateCtrl = TextEditingController();
  final _minPaymentCtrl = TextEditingController();

  @override
  void dispose() {
    _nameCtrl.dispose();
    _principalCtrl.dispose();
    _rateCtrl.dispose();
    _minPaymentCtrl.dispose();
    super.dispose();
  }

  void _showAddDebtDialog(BuildContext context, ThemeData theme, String sym) {
    _nameCtrl.clear();
    _principalCtrl.clear();
    _rateCtrl.clear();
    _minPaymentCtrl.clear();

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
            Text('Add Debt', style: theme.textTheme.titleLarge),
            const SizedBox(height: 16),
            TextField(controller: _nameCtrl, decoration: const InputDecoration(labelText: 'Debt Name (e.g., Credit Card)')),
            const SizedBox(height: 12),
            TextField(controller: _principalCtrl, keyboardType: const TextInputType.numberWithOptions(decimal: true), decoration: InputDecoration(labelText: 'Current Balance ($sym)', prefixText: sym)),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(child: TextField(controller: _rateCtrl, keyboardType: const TextInputType.numberWithOptions(decimal: true), decoration: const InputDecoration(labelText: 'Interest Rate (%)', suffixText: '%'))),
                const SizedBox(width: 16),
                Expanded(child: TextField(controller: _minPaymentCtrl, keyboardType: const TextInputType.numberWithOptions(decimal: true), decoration: InputDecoration(labelText: 'Min Payment ($sym)', prefixText: sym))),
              ],
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: FilledButton(
                onPressed: () {
                  final name = _nameCtrl.text.trim();
                  final p = double.tryParse(_principalCtrl.text) ?? 0;
                  final r = double.tryParse(_rateCtrl.text) ?? 0;
                  final m = double.tryParse(_minPaymentCtrl.text) ?? 0;
                  
                  if (name.isNotEmpty && p > 0 && r > 0 && m > 0) {
                    ref.read(debtProvider.notifier).addDebt(DebtItem(
                      id: const Uuid().v4(),
                      name: name,
                      principal: p,
                      interestRate: r,
                      minimumPayment: m,
                    ));
                    Navigator.pop(ctx);
                  }
                },
                child: const Text('Save Debt'),
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  // Calculate months to payoff using Avalanche method
  int _calculateMonthsToPayoff(List<DebtItem> debts, double extraPayment) {
    if (debts.isEmpty) return 0;
    
    // Clone balances
    final balances = debts.map((d) => d.principal).toList();
    int months = 0;
    bool hasBalance = true;

    while (hasBalance && months < 600) { // Max 50 years to prevent infinite loop
      hasBalance = false;
      months++;
      double remainingExtra = extraPayment;

      // First pay minimums
      for (int i = 0; i < debts.length; i++) {
        if (balances[i] <= 0) continue;
        
        hasBalance = true;
        
        // Add monthly interest (rate is annual)
        final interest = balances[i] * (debts[i].interestRate / 100 / 12);
        balances[i] += interest;
        
        // Pay minimum
        if (balances[i] > debts[i].minimumPayment) {
          balances[i] -= debts[i].minimumPayment;
        } else {
          remainingExtra += (debts[i].minimumPayment - balances[i]); // If minimum covers more than balance
          balances[i] = 0;
        }
      }

      // Then apply extra payment (Avalanche: highest interest first)
      for (int i = 0; i < debts.length; i++) {
        if (balances[i] <= 0 || remainingExtra <= 0) continue;
        
        if (balances[i] > remainingExtra) {
          balances[i] -= remainingExtra;
          remainingExtra = 0;
        } else {
          remainingExtra -= balances[i];
          balances[i] = 0;
        }
      }
    }
    
    return months;
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final settings = ref.watch(settingsProvider);
    final debts = ref.watch(debtProvider);
    final sym = settings.currencySymbol;

    final totalDebt = debts.fold(0.0, (s, d) => s + d.principal);
    final totalMin = debts.fold(0.0, (s, d) => s + d.minimumPayment);

    final monthsWithoutExtra = _calculateMonthsToPayoff(debts, 0);
    final monthsWithExtra = _calculateMonthsToPayoff(debts, _extraPayment);
    final monthsSaved = monthsWithoutExtra - monthsWithExtra;

    return Scaffold(
      appBar: AppBar(title: const Text('Debt Escape Visualizer')),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showAddDebtDialog(context, theme, sym),
        icon: const Icon(Icons.add),
        label: const Text('Add Debt'),
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
                colors: [theme.colorScheme.errorContainer, theme.colorScheme.onErrorContainer],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Column(
              children: [
                const Icon(Icons.account_balance_rounded, size: 40, color: Colors.white),
                const SizedBox(height: 12),
                Text(
                  'Total Debt: $sym${totalDebt.toStringAsFixed(0)}',
                  style: theme.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold, color: Colors.white),
                ),
                Text('Minimum Monthly: $sym${totalMin.toStringAsFixed(0)}', style: const TextStyle(color: Colors.white70)),
                const SizedBox(height: 16),
                
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      Column(
                        children: [
                          const Text('Debt-Free In', style: TextStyle(color: Colors.white70)),
                          Text(monthsWithExtra >= 600 ? '50+ Yrs' : '${(monthsWithExtra / 12).floor()}y ${monthsWithExtra % 12}m', 
                            style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                        ],
                      ),
                      if (_extraPayment > 0)
                        Column(
                          children: [
                            const Text('Time Saved', style: TextStyle(color: Colors.white70)),
                            Text('${(monthsSaved / 12).floor()}y ${monthsSaved % 12}m', 
                              style: const TextStyle(color: Colors.greenAccent, fontSize: 20, fontWeight: FontWeight.bold)),
                          ],
                        ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          if (debts.isNotEmpty)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Extra Monthly Payment', style: theme.textTheme.titleMedium),
                      Text('+$sym${_extraPayment.toStringAsFixed(0)}', style: theme.textTheme.titleMedium?.copyWith(color: theme.colorScheme.primary)),
                    ],
                  ),
                  Slider(
                    value: _extraPayment,
                    min: 0,
                    max: (totalDebt / 5).clamp(100, double.infinity), // Max slider is 20% of debt or 100
                    divisions: 100,
                    label: '+$sym${_extraPayment.toStringAsFixed(0)}',
                    onChanged: (v) => setState(() => _extraPayment = v),
                  ),
                  const SizedBox(height: 8),
                  Text('Slide to see how extra payments accelerate your debt-free date using the Avalanche Method.', 
                    style: theme.textTheme.bodySmall?.copyWith(fontStyle: FontStyle.italic)),
                ],
              ),
            ),
            
          const Divider(height: 32),

          // Debt List
          Expanded(
            child: debts.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.celebration_rounded, size: 48, color: theme.colorScheme.outline),
                        const SizedBox(height: 16),
                        Text('No debts found.', style: theme.textTheme.titleMedium),
                        const Text('You are totally debt-free!'),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    itemCount: debts.length,
                    itemBuilder: (ctx, i) {
                      final d = debts[i];
                      return Dismissible(
                        key: Key(d.id),
                        background: Container(
                          color: Colors.red.shade400,
                          alignment: Alignment.centerRight,
                          padding: const EdgeInsets.only(right: 20),
                          child: const Icon(Icons.delete, color: Colors.white),
                        ),
                        direction: DismissDirection.endToStart,
                        onDismissed: (_) {
                          ref.read(debtProvider.notifier).removeDebt(d.id);
                        },
                        child: Card(
                          margin: const EdgeInsets.only(bottom: 12),
                          child: ListTile(
                            title: Text(d.name, style: const TextStyle(fontWeight: FontWeight.bold)),
                            subtitle: Text('Rate: ${d.interestRate}%  •  Min: $sym${d.minimumPayment.toStringAsFixed(0)}'),
                            trailing: Text('$sym${d.principal.toStringAsFixed(0)}', style: theme.textTheme.titleMedium?.copyWith(color: theme.colorScheme.error)),
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
}
