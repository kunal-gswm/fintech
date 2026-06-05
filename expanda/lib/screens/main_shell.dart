import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';

/// Main shell with a custom, premium bottom navigation bar.
/// Tabs: Home, Expenses, Logo Menu (Central), Analytics, Settings.
class MainShell extends StatefulWidget {
  final Widget child;
  const MainShell({super.key, required this.child});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> with SingleTickerProviderStateMixin {
  late AnimationController _menuController;
  late Animation<double> _fadeAnimation;
  late Animation<double> _scaleAnimation;
  late Animation<double> _rotateAnimation;

  bool _isMenuOpen = false;

  static const _tabs = [
    '/home',
    '/expenses',
    'logo',
    '/analytics',
    '/settings',
  ];

  @override
  void initState() {
    super.initState();
    _menuController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
    );

    _fadeAnimation = CurvedAnimation(
      parent: _menuController,
      curve: Curves.easeOut,
    );

    _scaleAnimation = Tween<double>(begin: 0.85, end: 1.0).animate(
      CurvedAnimation(
        parent: _menuController,
        curve: Curves.easeOutBack,
      ),
    );

    _rotateAnimation = Tween<double>(begin: 0.0, end: 0.5).animate(
      CurvedAnimation(
        parent: _menuController,
        curve: Curves.easeInOut,
      ),
    );
  }

  @override
  void dispose() {
    _menuController.dispose();
    super.dispose();
  }

  void _toggleMenu() {
    setState(() {
      _isMenuOpen = !_isMenuOpen;
      if (_isMenuOpen) {
        HapticFeedback.mediumImpact();
        _menuController.forward();
      } else {
        HapticFeedback.lightImpact();
        _menuController.reverse();
      }
    });
  }

  int _currentIndex(BuildContext context) {
    final location = GoRouterState.of(context).uri.path;
    if (location == '/home') return 0;
    if (location == '/expenses') return 1;
    if (location == '/analytics') return 3;
    if (location == '/settings') return 4;
    return 0;
  }

  void _onTabTap(int index) {
    if (index == 2) {
      _toggleMenu();
      return;
    }
    // Always close the menu when navigating to a tab
    if (_isMenuOpen) {
      setState(() {
        _isMenuOpen = false;
        _menuController.reverse();
      });
    }
    context.go(_tabs[index]);
  }

  @override
  Widget build(BuildContext context) {
    final activeIndex = _currentIndex(context);
    final theme = Theme.of(context);

    return Scaffold(
      body: Stack(
        children: [
          // Main tab content
          widget.child,

          // Animated quick action menu overlay
          if (_isMenuOpen || !_menuController.isDismissed)
            Positioned.fill(
              child: AnimatedBuilder(
                animation: _menuController,
                builder: (context, child) {
                  return IgnorePointer(
                    ignoring: !_isMenuOpen,
                    child: FadeTransition(
                      opacity: _fadeAnimation,
                      child: Stack(
                        children: [
                        // Tap-to-dismiss blury glass overlay
                        GestureDetector(
                          onTap: _toggleMenu,
                          child: BackdropFilter(
                            filter: ImageFilter.blur(sigmaX: 5.0, sigmaY: 5.0),
                            child: Container(
                              color: Colors.black.withOpacity(0.65),
                            ),
                          ),
                        ),

                        // Glassmorphic Menu Container
                        Center(
                          child: ScaleTransition(
                            scale: _scaleAnimation,
                            child: Container(
                              margin: const EdgeInsets.symmetric(horizontal: 32),
                              padding: const EdgeInsets.all(24),
                              decoration: BoxDecoration(
                                color: theme.cardTheme.color ?? const Color(0xFF1E1E1E),
                                borderRadius: BorderRadius.circular(28),
                                border: Border.all(
                                  color: theme.colorScheme.outline.withOpacity(0.2),
                                  width: 1,
                                ),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.4),
                                    blurRadius: 24,
                                    offset: const Offset(0, 8),
                                  ),
                                ],
                              ),
                              child: Column(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  _buildMenuItem(
                                    theme: theme,
                                    icon: Icons.auto_awesome_rounded,
                                    label: 'AI Chat',
                                    color: const Color(0xFFD4AF37), // Gold
                                    onTap: () {
                                      _toggleMenu();
                                      context.push('/ai-chat');
                                    },
                                  ),
                                  const Divider(height: 16),
                                  _buildMenuItem(
                                    theme: theme,
                                    icon: Icons.favorite_rounded,
                                    label: 'Health Score',
                                    color: const Color(0xFF10B981), // Green
                                    onTap: () {
                                      _toggleMenu();
                                      context.push('/health');
                                    },
                                  ),
                                  const Divider(height: 16),
                                  _buildMenuItem(
                                    theme: theme,
                                    icon: Icons.assessment_rounded,
                                    label: 'Reports',
                                    color: const Color(0xFF3B82F6), // Blue
                                    onTap: () {
                                      _toggleMenu();
                                      context.push('/reports');
                                    },
                                  ),
                                  const Divider(height: 16),
                                  _buildMenuItem(
                                    theme: theme,
                                    icon: Icons.school_rounded,
                                    label: 'Learning Hub',
                                    color: const Color(0xFF06B6D4), // Cyan
                                    onTap: () {
                                      _toggleMenu();
                                      context.push('/learn');
                                    },
                                  ),
                                  const Divider(height: 16),
                                  _buildMenuItem(
                                    theme: theme,
                                    icon: Icons.flag_rounded,
                                    label: 'Goals',
                                    color: const Color(0xFF8B5CF6), // Purple
                                    onTap: () {
                                      _toggleMenu();
                                      context.push('/goals');
                                    },
                                  ),
                                  const Divider(height: 16),
                                  _buildMenuItem(
                                    theme: theme,
                                    icon: Icons.newspaper_rounded,
                                    label: 'Market News',
                                    color: const Color(0xFFF59E0B), // Amber
                                    onTap: () {
                                      _toggleMenu();
                                      context.push('/news');
                                    },
                                  ),
                                  const Divider(height: 16),
                                  _buildMenuItem(
                                    theme: theme,
                                    icon: Icons.money_off_rounded,
                                    label: 'Impulse Graveyard',
                                    color: const Color(0xFFEF4444), // Red
                                    onTap: () {
                                      _toggleMenu();
                                      context.push('/impulse-graveyard');
                                    },
                                  ),
                                  const Divider(height: 16),
                                  _buildMenuItem(
                                    theme: theme,
                                    icon: Icons.account_balance_wallet_rounded,
                                    label: 'Debt Escape',
                                    color: const Color(0xFF8B5CF6), // Purple
                                    onTap: () {
                                      _toggleMenu();
                                      context.push('/debt-visualizer');
                                    },
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                );
                },
              ),
            ),
        ],
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: theme.colorScheme.surface.withOpacity(0.98),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.15),
              blurRadius: 20,
              offset: const Offset(0, -4),
            ),
          ],
          border: Border(
            top: BorderSide(
              color: theme.colorScheme.outline.withOpacity(0.2),
              width: 0.5,
            ),
          ),
        ),
        child: SafeArea(
          child: Container(
            height: 64,
            padding: const EdgeInsets.symmetric(horizontal: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildTabItem(context, 0, Icons.home_rounded, 'Home', activeIndex == 0),
                _buildTabItem(context, 1, Icons.receipt_long_rounded, 'Expenses', activeIndex == 1),
                
                // Central Animated Branded Logo
                GestureDetector(
                  onTap: _toggleMenu,
                  child: Container(
                    width: 52,
                    height: 52,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: theme.colorScheme.primary.withOpacity(0.08),
                      border: Border.all(
                        color: _isMenuOpen ? theme.colorScheme.primary : theme.colorScheme.outline.withOpacity(0.3),
                        width: 2,
                      ),
                    ),
                    child: Center(
                      child: AnimatedSwitcher(
                        duration: const Duration(milliseconds: 250),
                        transitionBuilder: (child, animation) {
                          return ScaleTransition(
                            scale: animation,
                            child: child,
                          );
                        },
                        child: _isMenuOpen
                            ? Container(
                                key: const ValueKey('rupee'),
                                width: 44,
                                height: 44,
                                decoration: const BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: Color(0xFFD4AF37), // Gold
                                ),
                                child: const Center(
                                  child: Text(
                                    '₹',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 24,
                                      fontWeight: FontWeight.bold,
                                      fontFamily: 'Roboto',
                                    ),
                                  ),
                                ),
                              )
                            : ClipRRect(
                                key: const ValueKey('panda'),
                                borderRadius: BorderRadius.circular(22),
                                child: Image.asset(
                                  'assets/logo.jpg',
                                  width: 44,
                                  height: 44,
                                  fit: BoxFit.cover,
                                ),
                              ),
                      ),
                    ),
                  ),
                ),

                _buildTabItem(context, 3, Icons.analytics_rounded, 'Analytics', activeIndex == 3),
                _buildTabItem(context, 4, Icons.settings_rounded, 'Settings', activeIndex == 4),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTabItem(BuildContext context, int index, IconData icon, String label, bool isActive) {
    final theme = Theme.of(context);
    final activeColor = theme.colorScheme.primary;
    final inactiveColor = theme.colorScheme.outline;

    return Expanded(
      child: InkWell(
        onTap: () => _onTabTap(index),
        borderRadius: BorderRadius.circular(16),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              color: isActive ? activeColor : inactiveColor,
              size: 24,
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: theme.textTheme.bodySmall?.copyWith(
                color: isActive ? activeColor : inactiveColor,
                fontSize: 10,
                fontWeight: isActive ? FontWeight.w600 : FontWeight.normal,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMenuItem({
    required ThemeData theme,
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: color.withOpacity(0.12),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, color: color, size: 20),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Text(
                label,
                style: const TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
            Icon(Icons.chevron_right_rounded, color: theme.colorScheme.outline, size: 20),
          ],
        ),
      ),
    );
  }
}
