import 'dart:convert';
import 'package:http/http.dart' as http;

/// AI service powered by Google Gemini (1.5-flash).
class AiService {
  // Inbuilt Gemini API Key
  static final String _apiKey = utf8.decode(base64.decode('QVEuQWI4Uk42SUdRbjk5bFQ4M3d6Z3laYktLNDlCRXhVMGxwR2tZdVB3dlVld1czMmZ5UQ=='));
  static const String _model = 'gemini-1.5-flash';

  static bool get isConfigured => _apiKey.isNotEmpty;

  /// Sends a message to the Gemini API and returns the full response.
  static Future<String> sendMessage(List<Map<String, String>> messages) async {
    try {
      final url = 'https://generativelanguage.googleapis.com/v1beta/models/$_model:generateContent?key=$_apiKey';
      
      String? systemInstruction;
      final contentsList = <Map<String, dynamic>>[];

      for (final msg in messages) {
        if (msg['role'] == 'system') {
          systemInstruction = msg['content'];
        } else {
          // Gemini roles: user, model
          final role = msg['role'] == 'assistant' ? 'model' : 'user';
          contentsList.add({
            'role': role,
            'parts': [
              {'text': msg['content']}
            ]
          });
        }
      }

      final body = <String, dynamic>{
        'contents': contentsList,
      };

      if (systemInstruction != null) {
        body['systemInstruction'] = {
          'parts': [
            {'text': systemInstruction}
          ]
        };
      }

      final response = await http.post(
        Uri.parse(url),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(body),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body) as Map<String, dynamic>;
        final candidates = data['candidates'] as List?;
        if (candidates != null && candidates.isNotEmpty) {
          final parts = candidates[0]['content']?['parts'] as List?;
          if (parts != null && parts.isNotEmpty) {
            return parts[0]['text'] as String;
          }
        }
        return 'No response from AI.';
      } else {
        throw AiServiceException('AI request failed (${response.statusCode}): ${response.body}');
      }
    } catch (e) {
      if (e is AiServiceException) rethrow;
      throw AiServiceException('Network error — check your connection.\n$e');
    }
  }

  /// Streams response tokens from the Gemini API.
  static Stream<String> streamMessage(List<Map<String, String>> messages) async* {
    try {
      // Use streamGenerateContent with alt=sse for Server-Sent Events stream
      final url = 'https://generativelanguage.googleapis.com/v1beta/models/$_model:streamGenerateContent?alt=sse&key=$_apiKey';
      
      String? systemInstruction;
      final contentsList = <Map<String, dynamic>>[];

      for (final msg in messages) {
        if (msg['role'] == 'system') {
          systemInstruction = msg['content'];
        } else {
          final role = msg['role'] == 'assistant' ? 'model' : 'user';
          contentsList.add({
            'role': role,
            'parts': [
              {'text': msg['content']}
            ]
          });
        }
      }

      final body = <String, dynamic>{
        'contents': contentsList,
      };

      if (systemInstruction != null) {
        body['systemInstruction'] = {
          'parts': [
            {'text': systemInstruction}
          ]
        };
      }

      final response = await http.post(
        Uri.parse(url),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(body),
      );

      if (response.statusCode != 200) {
        throw AiServiceException('AI stream failed (${response.statusCode})');
      }

      final bodyString = response.body;

      // Handle standard array JSON or SSE stream response
      if (bodyString.trim().startsWith('[')) {
        try {
          final list = jsonDecode(bodyString) as List;
          for (final item in list) {
            final text = item['candidates']?[0]?['content']?['parts']?[0]?['text'];
            if (text != null && text is String) {
              yield text;
            }
          }
        } catch (_) {}
      } else {
        final lines = bodyString.split('\n');
        for (final line in lines) {
          final trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            try {
              final json = jsonDecode(trimmed.substring(6)) as Map<String, dynamic>;
              final text = json['candidates']?[0]?['content']?['parts']?[0]?['text'];
              if (text != null && text is String) {
                yield text;
              }
            } catch (_) {}
          } else if (trimmed.isNotEmpty && !trimmed.startsWith('event:')) {
            try {
              final json = jsonDecode(trimmed) as Map<String, dynamic>;
              final text = json['candidates']?[0]?['content']?['parts']?[0]?['text'];
              if (text != null && text is String) {
                yield text;
              }
            } catch (_) {}
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
