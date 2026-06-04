import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/notification_provider.dart';
import '../models/app_notification.dart';

class NotificationsScreen extends ConsumerWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final notifications = ref.watch(notificationProvider);
    final theme = Theme.of(context);

    // Group by date
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final weekAgo = today.subtract(const Duration(days: 7));

    final todayList = notifications
        .where((n) => n.timestamp.isAfter(today))
        .toList();
    final thisWeekList = notifications
        .where((n) =>
            n.timestamp.isAfter(weekAgo) && n.timestamp.isBefore(today))
        .toList();
    final earlierList = notifications
        .where((n) => n.timestamp.isBefore(weekAgo))
        .toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded),
          onPressed: () => context.pop(),
        ),
        actions: [
          TextButton(
            onPressed: () =>
                ref.read(notificationProvider.notifier).markAllAsRead(),
            child: const Text('Mark all read'),
          ),
        ],
      ),
      body: notifications.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.notifications_none_rounded,
                      size: 64,
                      color: theme.colorScheme.onSurface.withValues(alpha: 0.3)),
                  const SizedBox(height: 16),
                  Text('No notifications',
                      style: theme.textTheme.titleMedium),
                  const SizedBox(height: 4),
                  Text('You\'re all caught up!',
                      style: theme.textTheme.bodyMedium),
                ],
              ),
            )
          : ListView(
              padding: const EdgeInsets.all(16),
              children: [
                if (todayList.isNotEmpty) ...[
                  _sectionHeader(theme, 'Today'),
                  ...todayList.map((n) => _buildNotificationTile(
                      context, ref, theme, n)),
                ],
                if (thisWeekList.isNotEmpty) ...[
                  _sectionHeader(theme, 'This Week'),
                  ...thisWeekList.map((n) => _buildNotificationTile(
                      context, ref, theme, n)),
                ],
                if (earlierList.isNotEmpty) ...[
                  _sectionHeader(theme, 'Earlier'),
                  ...earlierList.map((n) => _buildNotificationTile(
                      context, ref, theme, n)),
                ],
              ],
            ),
    );
  }

  Widget _sectionHeader(ThemeData theme, String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8, top: 12),
      child: Text(title, style: theme.textTheme.bodySmall?.copyWith(
        fontWeight: FontWeight.w600,
        letterSpacing: 0.5,
      )),
    );
  }

  Widget _buildNotificationTile(
      BuildContext context, WidgetRef ref, ThemeData theme, AppNotification n) {
    final typeStyle = _typeStyle(n.type);

    return Dismissible(
      key: Key(n.id),
      direction: DismissDirection.endToStart,
      onDismissed: (_) =>
          ref.read(notificationProvider.notifier).dismiss(n.id),
      background: Container(
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: 20),
        margin: const EdgeInsets.only(bottom: 8),
        decoration: BoxDecoration(
          color: theme.colorScheme.error.withValues(alpha: 0.15),
          borderRadius: BorderRadius.circular(14),
        ),
        child: Icon(Icons.delete_outline_rounded,
            color: theme.colorScheme.error),
      ),
      child: GestureDetector(
        onTap: () {
          ref.read(notificationProvider.notifier).markAsRead(n.id);
          if (n.route != null) context.push(n.route!);
        },
        child: Container(
          margin: const EdgeInsets.only(bottom: 8),
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: n.isRead
                ? theme.cardTheme.color
                : theme.colorScheme.primary.withValues(alpha: 0.05),
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: theme.colorScheme.outline, width: 0.5),
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: typeStyle.color.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(typeStyle.icon, color: typeStyle.color, size: 20),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(n.title,
                              style: theme.textTheme.labelLarge),
                        ),
                        if (!n.isRead)
                          Container(
                            width: 8,
                            height: 8,
                            decoration: BoxDecoration(
                              color: theme.colorScheme.primary,
                              shape: BoxShape.circle,
                            ),
                          ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(n.body,
                        style: theme.textTheme.bodySmall, maxLines: 2),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  _NotifTypeStyle _typeStyle(String type) {
    switch (type) {
      case 'budget_exceeded':
        return _NotifTypeStyle(
            Icons.warning_rounded, const Color(0xFFEF4444));
      case 'goal_due':
        return _NotifTypeStyle(
            Icons.flag_rounded, const Color(0xFFF59E0B));
      case 'weekly_digest':
        return _NotifTypeStyle(
            Icons.summarize_rounded, const Color(0xFF3B82F6));
      case 'achievement':
        return _NotifTypeStyle(
            Icons.emoji_events_rounded, const Color(0xFF10B981));
      default:
        return _NotifTypeStyle(
            Icons.info_outline_rounded, const Color(0xFF64748B));
    }
  }
}

class _NotifTypeStyle {
  final IconData icon;
  final Color color;
  const _NotifTypeStyle(this.icon, this.color);
}
