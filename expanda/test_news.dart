import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:xml/xml.dart';
import 'package:html_unescape/html_unescape.dart';

void main() async {
  final feeds = [
    'https://www.moneycontrol.com/rss/economy.xml',
    'https://www.moneycontrol.com/rss/business.xml',
    'https://www.moneycontrol.com/rss/internationalmarkets.xml',
  ];

  for (final feed in feeds) {
    try {
      print('Fetching \$feed...');
      final response = await http.get(Uri.parse(feed));
      print('Status: \${response.statusCode}');
      if (response.statusCode == 200) {
        final document = XmlDocument.parse(response.body);
        final items = document.findAllElements('item');
        print('Found \${items.length} items');
        if (items.isNotEmpty) {
          final first = items.first;
          final title = first.findElements('title').first.innerText;
          print('First item title: \$title');
        }
      } else {
        print('Failed to fetch');
      }
    } catch (e) {
      print('Error: \$e');
    }
  }
}
