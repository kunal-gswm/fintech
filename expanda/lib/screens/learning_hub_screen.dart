import 'package:flutter/material.dart';

class Article {
  final String title;
  final String description;
  final String content;
  final String category;
  final int readTime;
  final IconData icon;
  final Color color;

  const Article({
    required this.title,
    required this.description,
    required this.content,
    required this.category,
    required this.readTime,
    required this.icon,
    required this.color,
  });
}

class LearningHubScreen extends StatefulWidget {
  const LearningHubScreen({super.key});

  @override
  State<LearningHubScreen> createState() => _LearningHubScreenState();
}

class _LearningHubScreenState extends State<LearningHubScreen> {
  String _selectedCategory = 'All';
  String _searchQuery = '';

  static const _categories = ['All', 'Budgeting', 'Savings', 'Investing', 'Debt'];

  static const _articles = [
    Article(
      title: 'Mastering the 50/30/20 Rule',
      description: 'Learn the most popular and simple budgeting method to manage your income.',
      category: 'Budgeting',
      readTime: 4,
      icon: Icons.pie_chart_rounded,
      color: Color(0xFF3B82F6),
      content: '''### What is the 50/30/20 Rule?
The 50/30/20 rule is an intuitive and simple framework for managing your after-tax income. It allocates your money into three basic buckets:

1. **50% Needs**: Essential expenses that you must pay to live.
2. **30% Wants**: Discretionary expenses that enhance your lifestyle.
3. **20% Savings**: Money dedicated to building your future and paying off debt.

---

### 1. The Needs (50%)
Needs are expenses that are absolutely essential for survival and maintaining your basic livelihood. If you stopped paying these, your life would be significantly disrupted.
*   **Housing**: Rent, mortgage, property taxes.
*   **Utilities**: Electricity, water, internet, trash collection.
*   **Groceries**: Essential food and home supplies.
*   **Transportation**: Car payments, insurance, fuel, public transport passes.
*   **Healthcare**: Health insurance premiums, essential medications.

---

### 2. The Wants (30%)
Wants are non-essential expenses that you choose to spend money on for enjoyment and convenience. You can live without these if you have to.
*   **Dining Out**: Restaurants, takeout, cafes.
*   **Entertainment**: Movie tickets, streaming subscriptions, concerts.
*   **Shopping**: Fashion, gadgets, home decor.
*   **Hobbies & Travel**: Gym memberships, vacation flights, hobby supplies.

---

### 3. The Savings & Debt (20%)
This bucket is for securing your financial future. It includes putting money away for goals or paying down high-interest liabilities.
*   **Emergency Fund**: Building a 3-to-6 month living expense cushion.
*   **Retirement**: Contributions to pension schemes or mutual funds.
*   **Debt Repayment**: Extra payments towards credit cards or loans (above the minimum required).
*   **Long-term Goals**: Down payments for homes, education funds.

---

### How to Implement It
1. **Calculate Net Income**: Use your actual take-home pay after taxes.
2. **Categorize Past Spending**: Look at your transaction logs in EXPANDA and categorize them.
3. **Adjust Your Budget**: If your needs exceed 50%, look for ways to cut back (like downsizing housing or switching utilities). If wants are too high, trim subscriptions or dining out.''',
    ),
    Article(
      title: 'The Magic of Compound Interest',
      description: 'Discover how starting early gives your money exponential wealth building capabilities.',
      category: 'Investing',
      readTime: 5,
      icon: Icons.trending_up_rounded,
      color: Color(0xFF8B5CF6),
      content: '''### Understanding Compound Interest
Albert Einstein reportedly called compound interest "the eighth wonder of the world. He who understands it, earns it... he who doesn't... pays it."

At its core, **compound interest** is the concept of earning interest on your interest. Over time, this compounding effect causes your wealth to grow exponentially.

---

### Simple vs. Compound Interest
*   **Simple Interest**: You earn interest only on your initial principal. For example, if you deposit \$1,000 at 10% annual interest, you earn \$100 every single year. After 10 years, you have \$2,000.
*   **Compound Interest**: You earn interest on your principal *plus* the interest accumulated. In year 1, you earn \$100. In year 2, you earn 10% on \$1,100 (\$110). In year 10, you earn 10% on \$2,357 (\$235.7). After 10 years, you have \$2,593.7.

---

### The Three Drivers of Compound Growth
1. **Time**: The longer your money compounds, the faster it grows. The final years of compounding produce the largest dollar gains.
2. **Rate of Return**: A higher rate of interest or investment return speeds up compounding.
3. **Frequency**: The more frequently interest is calculated (daily, monthly, quarterly, annually), the more interest compounds.

---

### The Cost of Waiting (Example)
Let's compare two investors, Sarah and Alex:
*   **Sarah** starts investing **\$200/month** at age **25**. She stops at age **35** (investing for 10 years, total \$24,000). She lets it compound at 8% annually until age 65.
    *   *Sarah's final balance*: **\$241,000**
*   **Alex** waits. He starts investing **\$200/month** at age **35** and continues all the way until age **65** (investing for 30 years, total \$72,000) at the same 8% return.
    *   *Alex's final balance*: **\$205,000**

Even though Sarah invested *three times less money*, she ended up with *more wealth* than Alex simply because she gave her money an extra 10 years to compound!

---

### Actionable Takeaway
Start as early as possible, even with a tiny amount. A \$50 monthly contribution started in your twenties is worth far more than a \$150 contribution started in your forties.''',
    ),
    Article(
      title: 'Emergency Fund: Your Financial Shield',
      description: 'Why an emergency fund is your number one priority to survive life\'s surprises.',
      category: 'Savings',
      readTime: 3,
      icon: Icons.savings_rounded,
      color: Color(0xFF10B981),
      content: '''### Why You Need an Emergency Fund
Life is unpredictable. Medical emergencies, car repairs, sudden job loss, or home leaks can strike without warning. 

Without an **emergency fund**, you are forced to rely on credit cards, personal loans, or family help. This creates high-interest debt that derails your financial progress. An emergency fund is your financial seatbelt.

---

### How Much Do You Need?
Most experts recommend saving **3 to 6 months of living expenses**.
*   **3 Months**: If you have a highly stable job, dual-income household, or low monthly liabilities.
*   **6 Months**: If you are self-employed, a single income earner, or work in a volatile industry.

*Note: This is 3 to 6 months of essential **needs** (rent, food, bills), not your full monthly income.*

---

### Step-by-Step Guide to Build It
1. **Calculate Your Target**: Look at your "Needs" inside EXPANDA. Multiply that monthly sum by 3 or 6.
2. **Start Small**: Don't be discouraged by the total sum. Aim for a mini-goal first (e.g., \$1,000 or ₹50,000).
3. **Automate It**: Set up an automatic transfer on payday to move a portion of your income into your emergency savings before you can spend it.
4. **Choose the Right Account**: Keep this money in a separate, highly liquid account like a High-Yield Savings Account. It should be easy to access but far enough from your primary checking account that you aren't tempted to spend it.

---

### What is a Real Emergency?
Only use this fund for situations that are:
1. **Unexpected**: Not regular yearly costs like car insurance or holiday gifts.
2. **Urgent**: Needs immediate attention (e.g. broken tooth vs. upgrading a phone).
3. **Necessary**: Essential for your health, safety, or ability to work.''',
    ),
    Article(
      title: 'Debt Avalanche vs. Debt Snowball',
      description: 'Which strategy is the best to pay off your credit cards and loans fast?',
      category: 'Debt',
      readTime: 4,
      icon: Icons.credit_card_off_rounded,
      color: Color(0xFFEF4444),
      content: '''### Strategies for Becoming Debt-Free
If you have multiple loans or credit card balances, paying them off can feel overwhelming. The two most effective, structured approaches to tackling debt are the **Debt Snowball** and the **Debt Avalanche**.

Both methods require you to pay the **minimum payments** on all your debts except one, which you attack with every extra penny you have.

---

### Method 1: The Debt Snowball (Quick Wins)
The Debt Snowball prioritizes your debts based on **balance size**, from smallest to largest.
1. List your debts in order of the smallest balance first.
2. Pay the minimums on all other debts.
3. Put all extra cash towards the smallest debt until it is gone.
4. Add the paid debt's minimum payment to the extra cash and attack the next smallest balance.

*   **Pros**: Highly motivating. Seeing balances disappear quickly builds momentum and builds psychological wins.
*   **Cons**: More expensive in interest payments over time.

---

### Method 2: The Debt Avalanche (Mathematical Efficiency)
The Debt Avalanche prioritizes your debts based on **interest rate**, from highest to lowest.
1. List your debts in order of the highest interest rate first.
2. Pay the minimums on all other debts.
3. Put all extra cash towards the highest interest debt until it is gone.
4. Move to the debt with the next highest interest rate.

*   **Pros**: Saves the most money in interest charges. You get out of debt faster mathematically.
*   **Cons**: Can take months to pay off the first debt if it has a large balance, leading to potential loss of motivation.

---

### Which One Should You Choose?
*   Choose **Debt Snowball** if you struggle with motivation and need immediate, encouraging victories to stay on track.
*   Choose **Debt Avalanche** if you are highly disciplined, mathematically minded, and want to pay the absolute least amount of interest.

The best strategy is the one you will actually stick to until you are completely debt-free!''',
    ),
    Article(
      title: 'Understanding Inflation & Purchasing Power',
      description: 'Learn how inflation silently erodes your cash and how to shield your wealth from it.',
      category: 'Savings',
      readTime: 4,
      icon: Icons.trending_down_rounded,
      color: Color(0xFFE5B80B),
      content: '''### What is Inflation?
Inflation is the general increase in prices and fall in the purchasing value of money over time. It means that a rupee or dollar today will buy you less tomorrow.

---

### The Silent Wealth Destroyer
If you leave all your money in a standard bank savings account earning 2% interest while inflation is at 6%, you are mathematically losing 4% of your purchasing power every year. 
*   **Purchasing Power**: The quantity of goods or services that can be bought with a unit of currency.
*   **Real Return**: Your investment return minus the rate of inflation.

---

### How to Protect Your Money
To beat inflation, you must invest in assets that grow faster than the inflation rate:
1.  **Equities (Stocks)**: Historically, the stock market has returned 8–10% annually, outstripping inflation over long horizons.
2.  **Real Estate**: Property values and rental income tend to rise along with general inflation.
3.  **Inflation-Indexed Bonds**: Government securities designed to adjust their principal value based on inflation indices.
4.  **Gold & Commodities**: Hard assets often act as a hedge during periods of high inflation.

---

### Actionable Advice
Do not keep large amounts of long-term savings in cash. Keep only your emergency fund (3–6 months) in a liquid high-yield savings account, and put the rest of your long-term wealth into diversified growth assets.''',
    ),
    Article(
      title: 'Intro to Tax-Saving Strategies',
      description: 'Maximize your take-home income by optimizing your investments for tax efficiency.',
      category: 'Investing',
      readTime: 5,
      icon: Icons.account_balance_wallet_rounded,
      color: Color(0xFF06B6D4),
      content: '''### Why Tax Planning Matters
Tax planning is the analysis of a financial situation or plan to ensure that all elements work together to allow you to pay the lowest taxes possible.

---

### Key Tax-Saving Pillars
Taxes are one of the largest lifetime expenses. Minimizing them legal and efficiently can boost your net wealth significantly.

1.  **Tax-Advantaged Accounts**: Utilize government-sponsored savings schemes (like EPF/PPF in India, or 401k/IRA in the US). Contributions to these accounts are often tax-deductible.
2.  **Long-Term Investing**: Hold assets for more than a year to qualify for lower long-term capital gains tax rates compared to short-term rates.
3.  **Tax-Loss Harvesting**: Offset capital gains from winning investments by selling losing investments at a loss to minimize net tax liability.
4.  **Insurance & Deductions**: Take advantage of tax deductions on premium payments for health insurance, life insurance, and home loan interest.

---

### Building Your Strategy
*   **Invest Early in the Fiscal Year**: Don't wait until the last month to make tax-saving investments. Invest incrementally to gain compounding advantages.
*   **Document and Track**: Keep clean records of all tax-exempt contributions, donation receipts, and business expenses to simplify filing.''',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    final filtered = _articles.where((a) {
      final matchesCategory = _selectedCategory == 'All' || a.category == _selectedCategory;
      final matchesSearch = a.title.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          a.description.toLowerCase().contains(_searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Learning Hub'),
      ),
      body: Column(
        children: [
          // Search & Filter header
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: TextField(
              onChanged: (v) => setState(() => _searchQuery = v),
              decoration: InputDecoration(
                hintText: 'Search financial guides...',
                prefixIcon: const Icon(Icons.search_rounded),
                contentPadding: const EdgeInsets.symmetric(vertical: 0),
                filled: true,
                fillColor: theme.cardTheme.color,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
          ),

          // Categories horizontal list
          SizedBox(
            height: 50,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              itemCount: _categories.length,
              itemBuilder: (ctx, i) {
                final cat = _categories[i];
                final isSelected = cat == _selectedCategory;
                return Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 4),
                  child: ChoiceChip(
                    label: Text(cat),
                    selected: isSelected,
                    showCheckmark: false,
                    onSelected: (_) => setState(() => _selectedCategory = cat),
                    selectedColor: theme.colorScheme.primary.withOpacity(0.15),
                    labelStyle: TextStyle(
                      color: isSelected ? theme.colorScheme.primary : theme.colorScheme.onSurfaceVariant,
                      fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                    ),
                  ),
                );
              },
            ),
          ),

          // Article list
          Expanded(
            child: filtered.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.search_off_rounded, size: 48, color: theme.colorScheme.outline),
                        const SizedBox(height: 12),
                        Text('No articles found', style: theme.textTheme.titleMedium),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: filtered.length,
                    itemBuilder: (ctx, i) {
                      final art = filtered[i];
                      return Card(
                        margin: const EdgeInsets.only(bottom: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(18),
                          side: BorderSide(color: theme.colorScheme.outline.withOpacity(0.2)),
                        ),
                        child: InkWell(
                          onTap: () => _openArticle(art),
                          borderRadius: BorderRadius.circular(18),
                          child: Padding(
                            padding: const EdgeInsets.all(16),
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: art.color.withOpacity(0.12),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Icon(art.icon, color: art.color, size: 28),
                                ),
                                const SizedBox(width: 16),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                            decoration: BoxDecoration(
                                              color: theme.colorScheme.surface,
                                              borderRadius: BorderRadius.circular(6),
                                              border: Border.all(color: theme.colorScheme.outline.withOpacity(0.3)),
                                            ),
                                            child: Text(
                                              art.category.toUpperCase(),
                                              style: TextStyle(
                                                fontSize: 9,
                                                fontWeight: FontWeight.bold,
                                                color: art.color,
                                              ),
                                            ),
                                          ),
                                          Text(
                                            '${art.readTime} min read',
                                            style: theme.textTheme.bodySmall?.copyWith(fontSize: 10),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 8),
                                      Text(art.title, style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
                                      const SizedBox(height: 6),
                                      Text(art.description, style: theme.textTheme.bodyMedium?.copyWith(color: theme.colorScheme.onSurfaceVariant), maxLines: 2, overflow: TextOverflow.ellipsis),
                                    ],
                                  ),
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

  void _openArticle(Article art) {
    final theme = Theme.of(context);
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: theme.scaffoldBackgroundColor,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (ctx) {
        return Container(
          padding: const EdgeInsets.fromLTRB(24, 20, 24, 24),
          height: MediaQuery.of(ctx).size.height * 0.85,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Pull Bar
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: theme.colorScheme.outline.withOpacity(0.5),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: art.color.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(art.icon, color: art.color, size: 24),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          art.category.toUpperCase(),
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: art.color,
                          ),
                        ),
                        Text(
                          art.title,
                          style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              const Divider(),
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: _parseContentToWidgets(art.content, theme),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  List<Widget> _parseContentToWidgets(String text, ThemeData theme) {
    final widgets = <Widget>[];
    final lines = text.split('\n');

    for (final line in lines) {
      final trimmed = line.trim();
      if (trimmed.isEmpty) {
        widgets.add(const SizedBox(height: 12));
        continue;
      }

      if (trimmed.startsWith('### ')) {
        widgets.add(Padding(
          padding: const EdgeInsets.only(top: 12, bottom: 8),
          child: Text(
            trimmed.substring(4),
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.bold,
              color: theme.colorScheme.primary,
            ),
          ),
        ));
      } else if (trimmed.startsWith('---')) {
        widgets.add(const Padding(
          padding: EdgeInsets.symmetric(vertical: 12),
          child: Divider(),
        ));
      } else if (trimmed.startsWith('*  ')) {
        widgets.add(Padding(
          padding: const EdgeInsets.only(left: 16, bottom: 6),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('• ', style: TextStyle(color: theme.colorScheme.primary, fontSize: 16)),
              Expanded(
                child: RichText(
                  text: _parseInlineFormatting(trimmed.substring(3), theme),
                ),
              ),
            ],
          ),
        ));
      } else if (trimmed.startsWith('1. ') || trimmed.startsWith('2. ') || trimmed.startsWith('3. ') || trimmed.startsWith('4. ')) {
        widgets.add(Padding(
          padding: const EdgeInsets.only(left: 12, bottom: 6),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(trimmed.substring(0, 3), style: TextStyle(color: theme.colorScheme.primary, fontWeight: FontWeight.bold)),
              Expanded(
                child: RichText(
                  text: _parseInlineFormatting(trimmed.substring(3), theme),
                ),
              ),
            ],
          ),
        ));
      } else {
        widgets.add(Padding(
          padding: const EdgeInsets.only(bottom: 8),
          child: RichText(
            text: _parseInlineFormatting(trimmed, theme),
          ),
        ));
      }
    }

    return widgets;
  }

  TextSpan _parseInlineFormatting(String text, ThemeData theme) {
    final spans = <TextSpan>[];
    final regExp = RegExp(r'\*\*(.*?)\*\*');
    int start = 0;

    for (final match in regExp.allMatches(text)) {
      if (match.start > start) {
        spans.add(TextSpan(
          text: text.substring(start, match.start),
          style: theme.textTheme.bodyLarge?.copyWith(fontSize: 14),
        ));
      }
      spans.add(TextSpan(
        text: match.group(1),
        style: theme.textTheme.bodyLarge?.copyWith(
          fontWeight: FontWeight.bold,
          color: theme.colorScheme.onSurface,
          fontSize: 14,
        ),
      ));
      start = match.end;
    }

    if (start < text.length) {
      spans.add(TextSpan(
        text: text.substring(start),
        style: theme.textTheme.bodyLarge?.copyWith(fontSize: 14),
      ));
    }

    return TextSpan(children: spans);
  }
}
