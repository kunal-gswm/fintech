import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:expanda/main.dart';
import 'package:expanda/providers/settings_provider.dart';
import 'package:expanda/models/user_settings.dart';

class MockSettingsNotifier extends SettingsNotifier {
  @override
  UserSettings build() {
    return UserSettings(onboardingComplete: false);
  }
}

void main() {
  testWidgets('App loads smoke test', (WidgetTester tester) async {
    // Build our app and trigger a frame with settingsProvider overridden to avoid Hive errors.
    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          settingsProvider.overrideWith(() => MockSettingsNotifier()),
        ],
        child: const ExpandaApp(),
      ),
    );

    await tester.pumpAndSettle();

    // Verify that our app name is present on the onboarding welcome page.
    expect(find.textContaining('EXPANDA'), findsAtLeast(1));
  });
}
