import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import '../providers/chat_provider.dart';
import '../providers/expense_provider.dart';
import '../providers/settings_provider.dart';
import '../providers/goal_provider.dart';
import '../services/ai_service.dart';

class AiChatScreen extends ConsumerStatefulWidget {
  const AiChatScreen({super.key});

  @override
  ConsumerState<AiChatScreen> createState() => _AiChatScreenState();
}

class _AiChatScreenState extends ConsumerState<AiChatScreen> {
  final _inputController = TextEditingController();
  final _scrollController = ScrollController();

  static const _predefinedPrompts = [
    'Analyze my recent expenses and give tips',
    'How can I improve my health score?',
    'Suggest a 50/30/20 budget for my income',
    'What is an emergency fund?',
  ];

  @override
  void dispose() {
    _inputController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  Map<String, String> _buildContext() {
    final expenses = ref.read(expenseListProvider);
    final settings = ref.read(settingsProvider);
    final goals = ref.read(goalListProvider);

    final totalExpenses30d = ref
        .read(expenseListProvider.notifier)
        .totalForLastDays(30);

    final now = DateTime.now();
    final monthStart = DateTime(now.year, now.month, 1);
    final monthExpenses = expenses
        .where((e) => e.date.isAfter(monthStart.subtract(const Duration(days: 1))))
        .fold(0.0, (sum, e) => sum + e.amount);
    final savingsRate = settings.monthlyIncome > 0
        ? ((settings.monthlyIncome - monthExpenses) / settings.monthlyIncome * 100)
        : 0.0;

    return AiService.buildSystemContext(
      totalExpenses30d: totalExpenses30d,
      totalIncome: settings.monthlyIncome,
      healthScore: savingsRate.round().clamp(0, 100),
      activeGoals:
          goals.where((g) => !g.isArchived).map((g) => g.title).toList(),
      currency: settings.currency,
    );
  }

  void _send([String? text]) {
    final message = text ?? _inputController.text.trim();
    if (message.isEmpty) return;
    HapticFeedback.mediumImpact();
    _inputController.clear();
    ref.read(chatProvider.notifier).sendMessage(
          message,
          systemContext: _buildContext(),
        );
    _scrollToBottom();
  }

  @override
  Widget build(BuildContext context) {
    final chatState = ref.watch(chatProvider);
    final theme = Theme.of(context);

    // Auto-scroll on new messages
    ref.listen(chatProvider, (prev, next) {
      if (prev?.messages.length != next.messages.length ||
          prev?.streamingContent != next.streamingContent) {
        _scrollToBottom();
      }
    });

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    theme.colorScheme.primary,
                    theme.colorScheme.secondary,
                  ],
                ),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.auto_awesome_rounded,
                  size: 18, color: Colors.white),
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('AI Advisor'),
                Text(
                  AiService.isConfigured ? 'Online' : 'Offline',
                  style: TextStyle(
                    fontSize: 11,
                    color: AiService.isConfigured
                        ? const Color(0xFF10B981)
                        : const Color(0xFF64748B),
                  ),
                ),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.delete_outline_rounded),
            onPressed: () async {
              final confirm = await showDialog<bool>(
                context: context,
                builder: (ctx) => AlertDialog(
                  title: const Text('Clear conversation'),
                  content: const Text(
                      'Delete all messages? This cannot be undone.'),
                  actions: [
                    TextButton(
                        onPressed: () => Navigator.pop(ctx, false),
                        child: const Text('Cancel')),
                    TextButton(
                        onPressed: () => Navigator.pop(ctx, true),
                        child: const Text('Clear',
                            style: TextStyle(color: Colors.red))),
                  ],
                ),
              );
              if (confirm == true) {
                ref.read(chatProvider.notifier).clearHistory();
              }
            },
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              itemCount: chatState.messages.length +
                  (chatState.streamingContent.isNotEmpty ? 1 : 0) +
                  (chatState.error != null ? 1 : 0),
              itemBuilder: (_, i) {
                // Error message
                if (chatState.error != null &&
                    i ==
                        chatState.messages.length +
                            (chatState.streamingContent.isNotEmpty ? 1 : 0)) {
                  return _buildErrorBubble(theme, chatState.error!);
                }

                // Streaming content
                if (chatState.streamingContent.isNotEmpty &&
                    i == chatState.messages.length) {
                  return _buildBubble(
                    theme,
                    chatState.streamingContent,
                    false,
                    isStreaming: true,
                  );
                }

                // Regular message
                if (i < chatState.messages.length) {
                  final msg = chatState.messages[i];
                  return _buildBubble(theme, msg.content, msg.isUser);
                }

                return const SizedBox.shrink();
              },
            ),
          ),

          // Loading indicator
          if (chatState.isLoading && chatState.streamingContent.isEmpty)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: theme.colorScheme.primary,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text('Thinking...', style: theme.textTheme.bodySmall),
                ],
              ),
            ),

          // Predefined prompts (when chat is empty)
          if (chatState.messages.isEmpty)
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 8),
              child: Wrap(
                spacing: 8,
                runSpacing: 8,
                children: _predefinedPrompts.map((p) {
                  return ActionChip(
                    label: Text(p, style: const TextStyle(fontSize: 12)),
                    onPressed: () => _send(p),
                    backgroundColor:
                        theme.colorScheme.primary.withValues(alpha: 0.1),
                    side: BorderSide.none,
                  );
                }).toList(),
              ),
            ),

          // Input bar
          Container(
            padding: const EdgeInsets.fromLTRB(16, 8, 8, 16),
            decoration: BoxDecoration(
              border: Border(
                top: BorderSide(color: theme.colorScheme.outline, width: 0.5),
              ),
            ),
            child: SafeArea(
              top: false,
              child: Column(
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _inputController,
                          onSubmitted: (_) => _send(),
                          decoration: const InputDecoration(
                            hintText: 'Ask about budgeting, investments...',
                            border: InputBorder.none,
                            contentPadding: EdgeInsets.symmetric(
                                horizontal: 16, vertical: 12),
                          ),
                          maxLines: null,
                        ),
                      ),
                      IconButton(
                        onPressed:
                            chatState.isLoading ? null : () => _send(),
                        icon: Icon(
                          Icons.send_rounded,
                          color: chatState.isLoading
                              ? theme.colorScheme.outline
                              : theme.colorScheme.primary,
                        ),
                      ),
                    ],
                  ),
                  Text(
                    'AI can make mistakes. Verify important financial decisions.',
                    style: theme.textTheme.bodySmall
                        ?.copyWith(fontSize: 10),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBubble(ThemeData theme, String content, bool isUser,
      {bool isStreaming = false}) {
    return Align(
      alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        constraints:
            BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.8),
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: isUser
              ? theme.colorScheme.primary
              : theme.colorScheme.surface,
          borderRadius: BorderRadius.circular(16).copyWith(
            bottomRight: isUser ? const Radius.circular(4) : null,
            bottomLeft: !isUser ? const Radius.circular(4) : null,
          ),
        ),
        child: isUser
            ? Text(content,
                style: const TextStyle(color: Colors.white, fontSize: 14))
            : MarkdownBody(
                data: isStreaming ? '$content▍' : content,
                styleSheet: MarkdownStyleSheet(
                  p: theme.textTheme.bodyMedium
                      ?.copyWith(color: theme.colorScheme.onSurface),
                  code: TextStyle(
                    backgroundColor: theme.colorScheme.outline.withValues(alpha: 0.2),
                    color: theme.colorScheme.primary,
                    fontSize: 13,
                  ),
                  h3: theme.textTheme.titleMedium,
                ),
              ),
      ),
    );
  }

  Widget _buildErrorBubble(ThemeData theme, String error) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: theme.colorScheme.error.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
            color: theme.colorScheme.error.withValues(alpha: 0.3)),
      ),
      child: Row(
        children: [
          Icon(Icons.error_outline_rounded,
              color: theme.colorScheme.error, size: 20),
          const SizedBox(width: 10),
          Expanded(
            child: Text(error,
                style: theme.textTheme.bodySmall
                    ?.copyWith(color: theme.colorScheme.error)),
          ),
        ],
      ),
    );
  }
}
