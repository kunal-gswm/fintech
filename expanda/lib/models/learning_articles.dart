class LearningArticle {
  final String title;
  final String description;
  final String category;
  final String readTime;
  final String content;

  const LearningArticle({
    required this.title,
    required this.description,
    required this.category,
    required this.readTime,
    required this.content,
  });
}

class LearningArticlesData {
  static const List<LearningArticle> articles = [
    // Investing
    LearningArticle(
      title: 'Introduction to Investing',
      description: 'Learn the basics of investing, stocks, bonds, and mutual funds.',
      category: 'Investing',
      readTime: '5 min',
      content: 'Investing is how you take charge of your financial security. It allows you to grow your wealth and generate an additional income stream ahead of retirement. This article covers stocks, bonds, and mutual funds.',
    ),
    LearningArticle(
      title: 'Understanding Index Funds',
      description: 'Why index funds are often the best choice for beginners.',
      category: 'Investing',
      readTime: '4 min',
      content: 'Index funds track a market index, like the S&P 500. They offer broad market exposure, low operating expenses, and low portfolio turnover.',
    ),
    LearningArticle(
      title: 'The Power of Compound Interest',
      description: 'How starting early can drastically impact your wealth.',
      category: 'Investing',
      readTime: '6 min',
      content: 'Compound interest is the addition of interest to the principal sum of a loan or deposit. It is the result of reinvesting interest, rather than paying it out.',
    ),
    LearningArticle(
      title: 'Diversification Basics',
      description: 'Don\'t put all your eggs in one basket.',
      category: 'Investing',
      readTime: '3 min',
      content: 'Diversification is a risk management strategy that mixes a wide variety of investments within a portfolio.',
    ),
    LearningArticle(
      title: 'Dividends Explained',
      description: 'How to earn passive income from stocks.',
      category: 'Investing',
      readTime: '4 min',
      content: 'A dividend is a distribution of a portion of a company\'s earnings, decided by the board of directors, paid to a class of its shareholders.',
    ),

    // Budgeting
    LearningArticle(
      title: 'The 50/30/20 Rule',
      description: 'A simple and effective budgeting strategy.',
      category: 'Budgeting',
      readTime: '4 min',
      content: 'The 50/30/20 rule is a simple budgeting method that can help you manage your money effectively. It divides your after-tax income into three categories: 50% for needs, 30% for wants, and 20% for savings or paying off debt.',
    ),
    LearningArticle(
      title: 'Zero-Based Budgeting',
      description: 'Give every dollar a job before the month begins.',
      category: 'Budgeting',
      readTime: '5 min',
      content: 'Zero-based budgeting is a method of budgeting in which all expenses must be justified for each new period.',
    ),
    LearningArticle(
      title: 'How to Build an Emergency Fund',
      description: 'Protect yourself from unexpected financial shocks.',
      category: 'Budgeting',
      readTime: '5 min',
      content: 'An emergency fund is a bank account with money set aside to pay for large, unexpected expenses.',
    ),
    LearningArticle(
      title: 'Cutting Monthly Expenses',
      description: 'Simple tips to reduce your monthly bills.',
      category: 'Budgeting',
      readTime: '4 min',
      content: 'Review your subscriptions, negotiate your bills, and find cheaper alternatives to lower your monthly outflow.',
    ),
    LearningArticle(
      title: 'Envelope System for Cash',
      description: 'A physical way to track your spending.',
      category: 'Budgeting',
      readTime: '3 min',
      content: 'The envelope method is a way to track exactly how much money you have in each budget category for the month by keeping your cash tucked away in envelopes.',
    ),

    // Debt
    LearningArticle(
      title: 'Debt Snowball vs Avalanche',
      description: 'Two popular methods for paying down debt.',
      category: 'Debt',
      readTime: '6 min',
      content: 'The debt snowball method involves paying off the smallest debts first to get psychological wins. The debt avalanche method involves paying off the debt with the highest interest rate first to save money.',
    ),
    LearningArticle(
      title: 'Understanding Credit Scores',
      description: 'How your credit score is calculated and why it matters.',
      category: 'Debt',
      readTime: '5 min',
      content: 'Your credit score is a three-digit number that relates to how likely you are to repay debt. Banks and lenders use it to decide whether they\'ll approve you for a credit card or loan.',
    ),
    LearningArticle(
      title: 'Good Debt vs Bad Debt',
      description: 'Not all debt is created equal.',
      category: 'Debt',
      readTime: '4 min',
      content: 'Good debt helps generate income and increases your net worth. Bad debt is borrowing money to purchase a depreciating asset.',
    ),
    LearningArticle(
      title: 'Consolidating Your Loans',
      description: 'Is a personal loan right for debt consolidation?',
      category: 'Debt',
      readTime: '5 min',
      content: 'Debt consolidation means taking out a new loan to pay off a number of liabilities and consumer debts, generally unsecured ones.',
    ),
    LearningArticle(
      title: 'Negotiating with Creditors',
      description: 'How to ask for lower rates or payment plans.',
      category: 'Debt',
      readTime: '4 min',
      content: 'Call your creditors and explain your situation. Often they are willing to work with you to lower your interest rate or set up a payment plan.',
    ),

    // Personal Finance
    LearningArticle(
      title: 'Financial Independence, Retire Early (FIRE)',
      description: 'An introduction to the FIRE movement.',
      category: 'Personal Finance',
      readTime: '7 min',
      content: 'FIRE is a movement of people devoted to a program of extreme savings and investment that allows them to retire far earlier than traditional budgets and retirement plans would permit.',
    ),
    LearningArticle(
      title: 'Taxes 101',
      description: 'Understanding brackets, deductions, and credits.',
      category: 'Personal Finance',
      readTime: '6 min',
      content: 'A tax bracket is a range of incomes taxed at a given rate. Deductions lower your taxable income, while credits directly lower your tax bill.',
    ),
    LearningArticle(
      title: 'Choosing a Bank Account',
      description: 'What to look for in checking and savings accounts.',
      category: 'Personal Finance',
      readTime: '4 min',
      content: 'Look for accounts with no monthly fees, a high interest rate for savings, and a good network of ATMs.',
    ),
    LearningArticle(
      title: 'Protecting Yourself from Fraud',
      description: 'Keep your financial information secure.',
      category: 'Personal Finance',
      readTime: '5 min',
      content: 'Use strong passwords, enable two-factor authentication, and monitor your credit reports regularly to spot any unauthorized activity.',
    ),
    LearningArticle(
      title: 'Estate Planning Basics',
      description: 'Wills, trusts, and why you need them.',
      category: 'Personal Finance',
      readTime: '6 min',
      content: 'Estate planning is the preparation of tasks that serve to manage an individual\'s asset base in the event of their incapacitation or death.',
    ),
  ];
}
