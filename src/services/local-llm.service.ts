/**
 * Local On-Device LLM Service
 * 
 * Uses @capgo/capacitor-llm to run
 * gemma-4-e2b-q4_k_m locally on-device. No network required.
 * 
 * Platform asset paths:
 *   Android: public/models/gemma-4-E2B-it.litertlm (inside assets)
 *   iOS:     models/gemma-4-E2B-it.litertlm (copied via Xcode bundle)
 */

import { Capacitor } from '@capacitor/core';
import type { LLMPlugin, TextFromAiEvent, AiFinishedEvent } from '@capgo/capacitor-llm';

// ---------- Types ----------

export interface LocalLLMStatus {
  ready: boolean;
  error: string | null;
  modelName: string;
}

type StreamCallback = (chunk: string) => void;
type DoneCallback = (fullResponse: string) => void;
type ErrorCallback = (error: Error) => void;

// ---------- Constants ----------

const MODEL_FILENAME = 'gemma-4-E2B-it.litertlm';
const MODEL_TYPE = 'litertlm';

// ---------- Helpers ----------

/**
 * Resolves the correct native asset path for the model file
 * based on the current platform.
 */
function getModelPath(): string {
  const platform = Capacitor.getPlatform();

  if (platform === 'android') {
    // Android assets are served from the public/ folder which maps to
    // file:///android_asset/ inside the WebView
    return `public/models/${MODEL_FILENAME}`;
  }

  if (platform === 'ios') {
    // iOS bundles assets into the app's main bundle
    return `models/${MODEL_FILENAME}`;
  }

  // Web fallback — the plugin won't work, but we return a path
  // so the service can degrade gracefully
  return `models/${MODEL_FILENAME}`;
}

// ---------- Service ----------

class _LocalLLMService {
  private _ready = false;
  private _initializing = false;
  private _error: string | null = null;
  private _plugin: LLMPlugin | null = null; // Lazy-loaded native plugin
  private _chatId: string | null = null;
  
  // Active listeners
  private _textListenerHandle: unknown = null;
  private _finishListenerHandle: unknown = null;
  
  // Streaming state
  private _currentFullResponse = '';
  private _onChunk: StreamCallback | null = null;
  private _onDone: DoneCallback | null = null;

  // ---- Public getters ----

  get status(): LocalLLMStatus {
    return {
      ready: this._ready,
      error: this._error,
      modelName: MODEL_FILENAME,
    };
  }

  get isAvailable(): boolean {
    return Capacitor.isNativePlatform();
  }

  // ---- Initialization ----

  /**
   * Lazily loads the native plugin module.
   * This prevents import errors on web where the plugin is not available.
   */
  private async loadPlugin() {
    if (this._plugin) return this._plugin;

    try {
      const mod = await import('@capgo/capacitor-llm');
      this._plugin = mod.CapgoLLM;
      return this._plugin;
    } catch (e) {
      console.warn('[LocalLLM] Plugin not available:', e);
      this._error = 'Plugin not installed';
      return null;
    }
  }

  /**
   * Initialize the on-device model.
   * Safe to call multiple times — subsequent calls are no-ops if already ready.
   */
  async initialize(): Promise<boolean> {
    if (this._ready) return true;
    if (this._initializing) return false;
    if (!this.isAvailable) {
      this._error = 'Not running on a native platform';
      return false;
    }

    this._initializing = true;
    this._error = null;

    try {
      const plugin = await this.loadPlugin();
      if (!plugin) {
        this._initializing = false;
        return false;
      }

      const modelPath = getModelPath();
      console.log(`[LocalLLM] Loading model from: ${modelPath}`);

      // Configure and load the model
      await plugin.setModel({
        path: modelPath,
        modelType: MODEL_TYPE,
        engine: 'auto',
        temperature: 0.7,
        topk: 40,
        maxTokens: 1024,
      });

      console.log('[LocalLLM] Model loaded successfully');

      // Create a chat session
      const session = await plugin.createChat();
      this._chatId = session.id;

      // Register global listeners for this session
      await this.setupListeners(plugin);

      this._ready = true;
      console.log(`[LocalLLM] Session created: ${this._chatId}`);

      return true;
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e) || 'Failed to load model');
      console.error('[LocalLLM] Initialization failed:', error);
      this._error = error.message || 'Failed to load model';
      return false;
    } finally {
      this._initializing = false;
    }
  }

  private async setupListeners(plugin: LLMPlugin) {
    // Clean up old listeners if they exist
    const textHandle = this._textListenerHandle as { remove?: () => Promise<void> };
    const finishHandle = this._finishListenerHandle as { remove?: () => Promise<void> };
    if (textHandle?.remove) await textHandle.remove();
    if (finishHandle?.remove) await finishHandle.remove();

    this._textListenerHandle = await plugin.addListener('textFromAi', (event: TextFromAiEvent) => {
      if (event.chatId !== this._chatId || !event.text) return;
      
      this._currentFullResponse += event.text;
      if (this._onChunk) {
        this._onChunk(event.text);
      }
    });

    this._finishListenerHandle = await plugin.addListener('aiFinished', (event: AiFinishedEvent) => {
      if (event.chatId !== this._chatId) return;
      
      if (this._onDone) {
        this._onDone(this._currentFullResponse);
      }
      
      // Reset streaming state for the next message
      this._currentFullResponse = '';
      this._onChunk = null;
      this._onDone = null;
    });
  }

  // ---- Chat (streaming) ----

  /**
   * Send a message and stream back the model's response token-by-token.
   */
  async sendMessageStreaming(
    message: string,
    onChunk: StreamCallback,
    onDone: DoneCallback,
    onError: ErrorCallback,
  ): Promise<void> {
    if (!this._ready || !this._plugin || !this._chatId) {
      onError(new Error('Local LLM is not initialized'));
      return;
    }

    try {
      // Set up the callbacks for the global listeners to use
      this._currentFullResponse = '';
      this._onChunk = onChunk;
      this._onDone = onDone;

      // Send the message — the response arrives asynchronously via events
      await this._plugin.sendMessage({
        chatId: this._chatId,
        message: message,
      });

    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e) || 'Generation failed');
      console.error('[LocalLLM] Streaming error:', error);
      // Reset state on failure
      this._currentFullResponse = '';
      this._onChunk = null;
      this._onDone = null;
      onError(error);
    }
  }

  /**
   * Send a message and wait for the complete (non-streamed) response.
   */
  async sendMessage(message: string): Promise<string> {
    if (!this._ready || !this._plugin || !this._chatId) {
      throw new Error('Local LLM is not initialized');
    }

    return new Promise((resolve, reject) => {
      this.sendMessageStreaming(
        message,
        () => {}, // ignore chunks
        (fullResponse) => resolve(fullResponse),
        (error) => reject(error)
      );
    });
  }
}

/** Singleton instance */
export const LocalLLMService = new _LocalLLMService();
