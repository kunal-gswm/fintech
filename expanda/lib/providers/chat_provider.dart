import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/chat_message.dart';
import '../services/hive_service.dart';
import '../services/ai_service.dart';
import 'package:uuid/uuid.dart';

const _uuid = Uuid();

final chatProvider =
    NotifierProvider<ChatNotifier, ChatState>(() {
  return ChatNotifier();
});

class ChatState {
  final List<ChatMessage> messages;
  final bool isLoading;
  final String streamingContent;
  final String? error;

  const ChatState({
    this.messages = const [],
    this.isLoading = false,
    this.streamingContent = '',
    this.error,
  });

  ChatState copyWith({
    List<ChatMessage>? messages,
    bool? isLoading,
    String? streamingContent,
    String? error,
  }) {
    return ChatState(
      messages: messages ?? this.messages,
      isLoading: isLoading ?? this.isLoading,
      streamingContent: streamingContent ?? this.streamingContent,
      error: error,
    );
  }
}

class ChatNotifier extends Notifier<ChatState> {
  @override
  ChatState build() {
    final messages = HiveService.getChatHistory();
    return ChatState(messages: messages);
  }

  /// Send a user message and stream the AI response.
  Future<void> sendMessage(
    String content, {
    required Map<String, String> systemContext,
  }) async {
    // Add user message
    final userMessage = ChatMessage(
      id: _uuid.v4(),
      role: 'user',
      content: content,
    );
    await HiveService.addMessage(userMessage);
    state = state.copyWith(
      messages: [...state.messages, userMessage],
      isLoading: true,
      streamingContent: '',
      error: null,
    );

    // Build message history for API
    final apiMessages = <Map<String, String>>[
      systemContext,
      ...state.messages.map((m) => {'role': m.role, 'content': m.content}),
    ];

    try {
      if (!AiService.isConfigured) {
        // Fallback: return a helpful message if API isn't configured
        final fallback = ChatMessage(
          id: _uuid.v4(),
          role: 'assistant',
          content:
              'AI is currently unavailable. Please add your API key in **Settings → AI Configuration** to enable the assistant.',
        );
        await HiveService.addMessage(fallback);
        state = state.copyWith(
          messages: [...state.messages, fallback],
          isLoading: false,
        );
        return;
      }

      // Stream response
      final buffer = StringBuffer();
      await for (final chunk in AiService.streamMessage(apiMessages)) {
        buffer.write(chunk);
        state = state.copyWith(streamingContent: buffer.toString());
      }

      // Save completed response
      final assistantMessage = ChatMessage(
        id: _uuid.v4(),
        role: 'assistant',
        content: buffer.toString(),
      );
      await HiveService.addMessage(assistantMessage);
      state = state.copyWith(
        messages: [...state.messages, assistantMessage],
        isLoading: false,
        streamingContent: '',
      );
    } on AiServiceException catch (e) {
      state = state.copyWith(
        isLoading: false,
        streamingContent: '',
        error: e.message,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        streamingContent: '',
        error: 'AI unavailable — check your connection.',
      );
    }
  }

  Future<void> clearHistory() async {
    await HiveService.clearChat();
    state = const ChatState();
  }
}
