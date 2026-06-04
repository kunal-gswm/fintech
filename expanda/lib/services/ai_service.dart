import 'dart:convert';
import 'package:http/http.dart' as http;

/// Stub AI service that calls an external API (OpenAI-compatible).
/// Replace the baseUrl and apiKey with your actual values.
class AiService {
  // Store API key in flutter_secure_storage in production.
  // For now, this is a stub that can be configured later.
  static String? _apiKey;
  static const String _baseUrl = 'https://api.openai.com/v1/chat/completions';
  static const String _model = 'gpt-4o-mini';

  static void configure({required String apiKey}) {
    _apiKey = apiKey;
  }

  static bool get isConfigured => _apiKey != null && _apiKey!.isNotEmpty;

  /// Sends a message to the AI API and returns the full response.
  /// [messages] is the full conversation history in OpenAI format:
  /// [{"role": "system", "content": "..."}, {"role": "user", "content": "..."}]
  static Future<String> sendMessage(
      List<Map<String, String>> messages) async {
    if (!isConfigured) {
      throw AiServiceException('AI is not configured. Add your API key in Settings.');
    }

    try {
      final response = await http.post(
        Uri.parse(_baseUrl),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $_apiKey',
        },
        body: jsonEncode({
          'model': _model,
          'messages': messages,
          'max_tokens': 1024,
          'temperature': 0.7,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body) as Map<String, dynamic>;
        final choices = data['choices'] as List;
        if (choices.isNotEmpty) {
          return choices[0]['message']['content'] as String;
        }
        return 'No response from AI.';
      } else {
        throw AiServiceException(
            'AI request failed (${response.statusCode}): ${response.body}');
      }
    } catch (e) {
      if (e is AiServiceException) rethrow;
      throw AiServiceException('Network error — check your connection.\n$e');
    }
  }

  /// Streams response tokens from the API.
  /// Yields partial content strings as they arrive.
  static Stream<String> streamMessage(
      List<Map<String, String>> messages) async* {
    if (!isConfigured) {
      throw AiServiceException('AI is not configured. Add your API key in Settings.');
    }

    try {
      final request = http.Request('POST', Uri.parse(_baseUrl));
      request.headers.addAll({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $_apiKey',
      });
      request.body = jsonEncode({
        'model': _model,
        'messages': messages,
        'max_tokens': 1024,
        'temperature': 0.7,
        'stream': true,
      });

      final streamedResponse = await http.Client().send(request);

      if (streamedResponse.statusCode != 200) {
        throw AiServiceException('AI stream failed (${streamedResponse.statusCode})');
      }

      await for (final chunk
          in streamedResponse.stream.transform(utf8.decoder)) {
        // SSE format: data: {...}\n\n
        final lines = chunk.split('\n');
        for (final line in lines) {
          if (line.startsWith('data: ') && !line.contains('[DONE]')) {
            try {
              final json =
                  jsonDecode(line.substring(6)) as Map<String, dynamic>;
              final delta = json['choices']?[0]?['delta']?['content'];
              if (delta != null && delta is String) {
                yield delta;
              }
            } catch (_) {
              // Skip malformed chunks
            }
          }
        }
      }
    } catch (e) {
      if (e is AiServiceException) rethrow;
      throw AiServiceException('Network error — check your connection.\n$e');
    }
  }

  /// Builds the system context from user financial data.
  static Map<String, String> buildSystemContext({
    required double totalExpenses30d,
    required double totalIncome,
    required int healthScore,
    required List<String> activeGoals,
    required String currency,
  }) {
    return {
      'role': 'system',
      'content': '''You are EXPANDA, an expert AI financial advisor. You help users manage their personal finances.

Current user context:
- Currency: $currency
- Monthly income: $totalIncome
- Last 30 days expenses: $totalExpenses30d
- Financial health score: $healthScore/100
- Active goals: ${activeGoals.join(', ')}

Guidelines:
- Be concise and actionable.
- Use the user's currency for all amounts.
- Focus on practical advice, not generic tips.
- Format responses with markdown for readability.''',
    };
  }
}

class AiServiceException implements Exception {
  final String message;
  AiServiceException(this.message);

  @override
  String toString() => message;
}
