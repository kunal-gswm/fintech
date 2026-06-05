class NewsItem {
  final String title;
  final String link;
  final String description;
  final String pubDate;

  NewsItem({
    required this.title,
    required this.link,
    required this.description,
    required this.pubDate,
  });

  factory NewsItem.fromXml(Map<String, String> xmlData) {
    return NewsItem(
      title: xmlData['title'] ?? 'No Title',
      link: xmlData['link'] ?? '',
      description: xmlData['description'] ?? '',
      pubDate: xmlData['pubDate'] ?? '',
    );
  }
}
