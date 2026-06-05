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
import '../screens/learning_hub_screen.dart';
import '../screens/splash_screen.dart';
import '../screens/news_screen.dart';
import '../screens/impulse_graveyard_screen.dart';
import '../screens/debt_visualizer_screen.dart';
import '../providers/settings_provider.dart';

final _rootNavigatorKey = GlobalKey<NavigatorState>();
final _shellNavigatorKey = GlobalKey<NavigatorState>();

final routerProvider = Provider<GoRouter>((ref) {
  // Use read instead of watch to prevent router recreation (and redirecting to splash) when settings are updated.
  final _ = ref.read(settingsProvider);

  return GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: '/splash',
    routes: [
      // ── Full-screen routes (no bottom nav) ──
      GoRoute(
        path: '/splash',
        name: 'splash',
        builder: (context, state) => const SplashScreen(),
      ),
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
        path: '/goals',
        name: 'goals',
        builder: (context, state) => const GoalsScreen(),
      ),
      GoRoute(
        path: '/notifications',
        name: 'notifications',
        builder: (context, state) => const NotificationsScreen(),
      ),
      GoRoute(
        path: '/learn',
        name: 'learn',
        builder: (context, state) => const LearningHubScreen(),
      ),
      GoRoute(
        path: '/news',
        name: 'news',
        builder: (context, state) => const NewsScreen(),
      ),
      GoRoute(
        path: '/impulse-graveyard',
        name: 'impulse-graveyard',
        builder: (context, state) => const ImpulseGraveyardScreen(),
      ),
      GoRoute(
        path: '/debt-visualizer',
        name: 'debt-visualizer',
        builder: (context, state) => const DebtVisualizerScreen(),
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
            path: '/settings',
            name: 'settings',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: SettingsScreen(),
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
