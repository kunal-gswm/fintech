import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../screens/main_shell.dart';
import '../screens/onboarding_screen.dart';
import '../screens/lock_screen.dart';
import '../screens/dashboard_screen.dart';
import '../screens/analytics_screen.dart';
import '../screens/expenses_screen.dart';
import '../screens/goals_screen.dart';
import '../screens/health_screen.dart';
import '../screens/ai_chat_screen.dart';
import '../screens/reports_screen.dart';
import '../screens/settings_screen.dart';
import '../screens/notifications_screen.dart';
import '../screens/learning_placeholder_screen.dart';
import '../providers/settings_provider.dart';

final _rootNavigatorKey = GlobalKey<NavigatorState>();
final _shellNavigatorKey = GlobalKey<NavigatorState>();

final routerProvider = Provider<GoRouter>((ref) {
  final settings = ref.watch(settingsProvider);

  String initialLocation;
  if (!settings.onboardingComplete) {
    initialLocation = '/onboarding';
  } else if (settings.biometricEnabled || settings.pinEnabled) {
    initialLocation = '/lock';
  } else {
    initialLocation = '/home';
  }

  return GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: initialLocation,
    routes: [
      // ── Full-screen routes (no bottom nav) ──
      GoRoute(
        path: '/onboarding',
        name: 'onboarding',
        builder: (context, state) => const OnboardingScreen(),
      ),
      GoRoute(
        path: '/lock',
        name: 'lock',
        builder: (context, state) => const LockScreen(),
      ),
      GoRoute(
        path: '/ai-chat',
        name: 'ai-chat',
        builder: (context, state) => const AiChatScreen(),
      ),
      GoRoute(
        path: '/reports',
        name: 'reports',
        builder: (context, state) => const ReportsScreen(),
      ),
      GoRoute(
        path: '/settings',
        name: 'settings',
        builder: (context, state) => const SettingsScreen(),
      ),
      GoRoute(
        path: '/notifications',
        name: 'notifications',
        builder: (context, state) => const NotificationsScreen(),
      ),
      GoRoute(
        path: '/learn',
        name: 'learn',
        builder: (context, state) => const LearningPlaceholderScreen(),
      ),

      // ── Shell route with bottom nav bar ──
      ShellRoute(
        navigatorKey: _shellNavigatorKey,
        builder: (context, state, child) => MainShell(child: child),
        routes: [
          GoRoute(
            path: '/home',
            name: 'home',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: DashboardScreen(),
            ),
          ),
          GoRoute(
            path: '/analytics',
            name: 'analytics',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: AnalyticsScreen(),
            ),
          ),
          GoRoute(
            path: '/expenses',
            name: 'expenses',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: ExpensesScreen(),
            ),
          ),
          GoRoute(
            path: '/goals',
            name: 'goals',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: GoalsScreen(),
            ),
          ),
          GoRoute(
            path: '/health',
            name: 'health',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: HealthScreen(),
            ),
          ),
        ],
      ),
    ],
  );
});
