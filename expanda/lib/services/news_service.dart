import 'package:http/http.dart' as http;
import 'package:xml/xml.dart';
import 'package:html_unescape/html_unescape.dart';
import '../models/news_item.dart';

class NewsService {
  static const List<String> _rssFeeds = [
    'https://www.moneycontrol.com/rss/economy.xml',
    'https://www.moneycontrol.com/rss/business.xml',
    'https://www.moneycontrol.com/rss/internationalmarkets.xml',
  ];
  static final _unescape = HtmlUnescape();

  static Future<List<NewsItem>> fetchNews() async {
    try {
      final newsList = <NewsItem>[];
      
      for (final feed in _rssFeeds) {
        try {
          final response = await http.get(Uri.parse(feed)).timeout(const Duration(seconds: 10));
          if (response.statusCode == 200) {
            final document = XmlDocument.parse(response.body);
            final items = document.findAllElements('item');

            for (final item in items) {
              final title = item.findElements('title').isNotEmpty ? item.findElements('title').first.innerText : '';
              final link = item.findElements('link').isNotEmpty ? item.findElements('link').first.innerText : '';
              final description = item.findElements('description').isNotEmpty ? item.findElements('description').first.innerText : '';
              final pubDate = item.findElements('pubDate').isNotEmpty ? item.findElements('pubDate').first.innerText : '';

              final cleanTitle = _cleanText(title);
              final cleanDesc = _cleanText(description);

              // Basic filter to ensure we get relevant news if any slips through
              final combinedText = '\${cleanTitle.toLowerCase()} \${cleanDesc.toLowerCase()}';
              final isRelevant = combinedText.contains('finance') || 
                                 combinedText.contains('bank') ||
                                 combinedText.contains('market') ||
                                 combinedText.contains('economy') ||
                                 combinedText.contains('trade') ||
                                 combinedText.contains('tax') ||
                                 combinedText.contains('stock') ||
                                 combinedText.contains('geopolitics') ||
                                 combinedText.contains('global') ||
                                 combinedText.contains('war') ||
                                 combinedText.contains('policy');

              // Avoid duplicates
              if (isRelevant && !newsList.any((n) => n.title == cleanTitle)) {
                newsList.add(NewsItem(
                  title: cleanTitle,
                  link: link,
                  description: cleanDesc,
                  pubDate: pubDate,
                ));
              }
            }
          }
        } catch (e) {
          // Ignore individual feed errors and continue
        }
      }
      
      // Sort by somewhat recent (naive sort by string, assuming similar formats or just keep feed order)
      return newsList;
    } catch (e) {
      return [];
    }
  }

  static String _cleanText(String text) {
    // Unescape HTML entities
    var cleaned = _unescape.convert(text);
    // Remove CDATA wrappers if any
    cleaned = cleaned.replaceAll('<![CDATA[', '').replaceAll(']]>', '');
    // Strip simple HTML tags
    cleaned = cleaned.replaceAll(RegExp(r'<[^>]*>|&[^;]+;'), '');
    return cleaned.trim();
  }
}
