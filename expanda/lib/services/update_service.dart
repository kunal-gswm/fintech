import 'dart:convert';
import 'dart:math';
import 'package:http/http.dart' as http;
import 'package:package_info_plus/package_info_plus.dart';
import 'package:url_launcher/url_launcher.dart';

class UpdateInfo {
  final bool hasUpdate;
  final String latestVersion;
  final String downloadUrl;
  final String releaseNotes;

  const UpdateInfo({
    this.hasUpdate = false,
    this.latestVersion = '',
    this.downloadUrl = '',
    this.releaseNotes = '',
  });
}

class UpdateService {
  static const String _releasesUrl =
      'https://api.github.com/repos/kunal-gswm/fintech/releases/latest';

  /// Check if a newer version of the app is available on GitHub
  static Future<UpdateInfo> checkForUpdate() async {
    try {
      final response = await http.get(Uri.parse(_releasesUrl)).timeout(
        const Duration(seconds: 8),
      );

      if (response.statusCode != 200) {
        return const UpdateInfo();
      }

      final data = json.decode(response.body) as Map<String, dynamic>;
      final rawTag = data['tag_name'] as String? ?? '';
      final htmlUrl =
          data['html_url'] as String? ?? 'https://github.com/kunal-gswm/fintech/releases';
      final body = data['body'] as String? ?? '';

      // Extract apk asset download link if available
      String downloadUrl = htmlUrl;
      final assets = data['assets'] as List?;
      if (assets != null && assets.isNotEmpty) {
        for (final asset in assets) {
          final name = asset['name'] as String? ?? '';
          if (name.endsWith('.apk')) {
            downloadUrl = asset['browser_download_url'] as String? ?? htmlUrl;
            break;
          }
        }
      }

      if (rawTag.isEmpty) return const UpdateInfo();

      // Clean version tags (e.g. "v2.0.0" -> "2.0.0")
      final latestClean = rawTag.startsWith('v') ? rawTag.substring(1) : rawTag;

      final packageInfo = await PackageInfo.fromPlatform();
      final currentVersion = packageInfo.version;

      final hasUpdate = _isVersionNewer(latestClean, currentVersion);

      return UpdateInfo(
        hasUpdate: hasUpdate,
        latestVersion: rawTag,
        downloadUrl: downloadUrl,
        releaseNotes: body,
      );
    } catch (_) {
      // Fail silently to avoid interrupting the user experience
      return const UpdateInfo();
    }
  }

  /// Launch the URL in the browser to download the update
  static Future<void> launchUpdateUrl(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  /// Helper to compare semantic versions (e.g., "1.2.3" vs "1.2.0")
  static bool _isVersionNewer(String latest, String current) {
    try {
      final latestParts = latest.split('.').map(int.parse).toList();
      final currentParts = current.split('.').map(int.parse).toList();

      for (int i = 0; i < min(latestParts.length, currentParts.length); i++) {
        if (latestParts[i] > currentParts[i]) return true;
        if (latestParts[i] < currentParts[i]) return false;
      }
      return latestParts.length > currentParts.length;
    } catch (_) {
      // Fallback: simple string comparison if parsing fails
      return latest != current;
    }
  }
}
