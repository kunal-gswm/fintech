import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/app_notification.dart';
import '../services/hive_service.dart';
import 'package:uuid/uuid.dart';

const _uuid = Uuid();

final notificationProvider =
    NotifierProvider<NotificationNotifier, List<AppNotification>>(() {
  return NotificationNotifier();
});

final unreadCountProvider = Provider<int>((ref) {
  final notifications = ref.watch(notificationProvider);
  return notifications.where((n) => !n.isRead).length;
});

class NotificationNotifier extends Notifier<List<AppNotification>> {
  @override
  List<AppNotification> build() {
    return HiveService.getAllNotifications();
  }

  Future<void> refresh() async {
    state = HiveService.getAllNotifications();
  }

  Future<void> add({
    required String title,
    required String body,
    required String type,
    String? route,
  }) async {
    final notification = AppNotification(
      id: _uuid.v4(),
      title: title,
      body: body,
      type: type,
      route: route,
    );
    await HiveService.addNotification(notification);
    state = HiveService.getAllNotifications();
  }

  Future<void> markAsRead(String id) async {
    await HiveService.markAsRead(id);
    state = HiveService.getAllNotifications();
  }

  Future<void> markAllAsRead() async {
    await HiveService.markAllAsRead();
    state = HiveService.getAllNotifications();
  }

  Future<void> dismiss(String id) async {
    await HiveService.deleteNotification(id);
    state = HiveService.getAllNotifications();
  }
}
