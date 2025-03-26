import { Anthropic } from "@anthropic-ai/sdk"
import { ApiConfiguration, ModelInfo } from "../shared/api"
import { AnthropicHandler } from "./providers/anthropic"
import { OpenRouterHandler } from "./providers/openrouter"
import { OpenAiHandler } from "./providers/openai"
import { OllamaHandler } from "./providers/ollama"
import { LmStudioHandler } from "./providers/lmstudio"
import { OpenAiNativeHandler } from "./providers/openai-native"
import { ApiStream } from "./transform/stream"
import { DeepSeekHandler } from "./providers/deepseek"
import { QwenHandler } from "./providers/qwen"
import { SWAIHandler } from "./providers/swai"
import { MistralHandler } from "./providers/mistral"
import { VsCodeLmHandler } from "./providers/vscode-lm"
import { LiteLlmHandler } from "./providers/litellm"

export interface ApiHandler {
	createMessage(systemPrompt: string, messages: Anthropic.Messages.MessageParam[]): ApiStream
	getModel(): { id: string; info: ModelInfo }
}

export interface SingleCompletionHandler {
	completePrompt(prompt: string): Promise<string>
}

export function buildApiHandler(configuration: ApiConfiguration): ApiHandler {
	const { apiProvider, ...options } = configuration
	switch (apiProvider) {
		case "anthropic":
			return new AnthropicHandler(options)
		case "openrouter":
			return new OpenRouterHandler(options)
		case "openai":
			return new OpenAiHandler(options)
		case "ollama":
			return new OllamaHandler(options)
		case "lmstudio":
			return new LmStudioHandler(options)
		case "openai-native":
			return new OpenAiNativeHandler(options)
		case "deepseek":
			return new DeepSeekHandler(options)
		case "qwen":
			return new QwenHandler(options)
		case "swai":
			return new SWAIHandler(options)
		case "mistral":
			return new MistralHandler(options)
		case "vscode-lm":
			return new VsCodeLmHandler(options)
		case "litellm":
			return new LiteLlmHandler(options)
		default:
			return new AnthropicHandler(options)
	}
}
