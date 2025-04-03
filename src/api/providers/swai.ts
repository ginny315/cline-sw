import { Anthropic } from "@anthropic-ai/sdk"
import OpenAI from "openai"
import { withRetry } from "../retry"
import { ApiHandlerOptions, SWAIModelId, ModelInfo, swaiDefaultModelId, swaiModels } from "../../shared/api"
import { ApiHandler } from "../index"
import { calculateApiCostOpenAI } from "../../utils/cost"
import { convertToOpenAiMessages } from "../transform/openai-format"
import { ApiStream } from "../transform/stream"
import { convertToR1Format } from "../transform/r1-format"
import { ChatCompletionReasoningEffort } from "openai/resources/chat/completions.mjs"

export class SWAIHandler implements ApiHandler {
	private options: ApiHandlerOptions
	private client: OpenAI

	constructor(options: ApiHandlerOptions) {
		this.options = options
		this.client = new OpenAI({
			// baseURL: "http://111.20.209.158:30299/r1/v1/",
			baseURL: "http://api.thuwaytec.com/v1/",
			apiKey: this.options.swaiApiKey,
		})
	}

	@withRetry()
	async *createMessage(systemPrompt: string, messages: Anthropic.Messages.MessageParam[]): ApiStream {
		const model = this.getModel()
		console.log('model', model)

		const isDeepseekReasoner = model.id.includes("deepseek-ai/DeepSeek-R1")

		let openAiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
			{ role: "system", content: systemPrompt },
			...convertToOpenAiMessages(messages),
		]
		let temperature: number | undefined = 0
		let reasoningEffort: ChatCompletionReasoningEffort | undefined = undefined

		if (isDeepseekReasoner) {
			openAiMessages = convertToR1Format([{ role: "user", content: systemPrompt }, ...messages])
		}

		const stream = await this.client.chat.completions.create({
			model: model.id,
			// max_completion_tokens: model.info.maxTokens,
			messages: openAiMessages,
			temperature: 1,
			reasoning_effort: "medium",
			stream: true,
			stream_options: { include_usage: true },
			// Only set temperature for non-reasoner models
			// ...(model.id === "deepseek-ai/DeepSeek-R1" ? {} : { temperature: 0 }),
		})

		for await (const chunk of stream) {
			const delta = chunk.choices[0]?.delta
			if (delta?.content) {
				yield {
					type: "text",
					text: delta.content,
				}
			}

			if (delta && "reasoning_content" in delta && delta.reasoning_content) {
				yield {
					type: "reasoning",
					reasoning: (delta.reasoning_content as string | undefined) || "",
				}
			}

			if (chunk.usage) {
				yield {
					type: "usage",
					inputTokens: chunk.usage.prompt_tokens || 0,
					outputTokens: chunk.usage.completion_tokens || 0,
				}
			}
		}
	}

	getModel(): { id: SWAIModelId; info: ModelInfo } {
		const modelId = this.options.apiModelId
		if (modelId && modelId in swaiModels) {
			const id = modelId as SWAIModelId
			return { id, info: swaiModels[id] }
		}
		return {
			id: swaiDefaultModelId,
			info: swaiModels[swaiDefaultModelId],
		}
	}
}
