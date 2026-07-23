import {
    AIMessage,
    createAgent,
    HumanMessage,
    type ReactAgent,
} from "langchain";
import { getAiModel } from "../repositories/ai-model-repo.js";
import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenRouter } from "@langchain/openrouter";
import { getAiConfig } from "../repositories/ai-config-repo.js";
import {
    getAiChatHistory,
    insertAiChatHistory,
} from "../repositories/ai-chat-history-repo.js";
import type { BaseMessage } from "@langchain/core/messages";
import { prompt } from "../utils/prompt.js";
import { ragSearch } from "../tools/rag-search.js";
import { dbSearch } from "../tools/db-search.js";
import { tavilyTool } from "../tools/tavily.js";
import { dbMap } from "../tools/db-map.js";
import { semaphore } from "./semaphore.js";

export class AIAgent {
    agents: Map<string, ReactAgent<any>>;
    prompt: string;
    isReady: boolean;
    maxRetries: number = 5;

    constructor(prompt: string) {
        this.agents = new Map<string, ReactAgent<any>>();
        this.prompt = prompt;
        this.isReady = false;
    }

    async setup(tools: any) {
        try {
            const modelList = await getAiModel();
            const aiConfig = await getAiConfig();

            if (modelList.length == 0) {
                throw Error("AI Model not found !");
            }

            for (const modelProfile of modelList) {
                let model;

                switch (modelProfile.provider) {
                    case "Nvidia":
                        model = new ChatOpenAI({
                            apiKey: aiConfig.get("nvidia_api_key"),
                            model: modelProfile.modelName,
                            configuration: {
                                baseURL: aiConfig.get("nvidia_base_url"),
                            },
                        });
                        break;
                    case "GoogleGenAI":
                        model = new ChatGoogleGenerativeAI({
                            apiKey: aiConfig.get("google_api_key"),
                            model: modelProfile.modelName,
                            thinkingConfig: {
                                thinkingLevel: "MEDIUM",
                            },
                        });
                        break;
                    case "OpenRouter":
                        model = new ChatOpenRouter({
                            apiKey: aiConfig.get("openrouter_api_key"),
                            model: modelProfile.modelName,
                        });
                        break;
                    default:
                        continue;
                }

                const agent = createAgent({
                    model,
                    tools,
                    systemPrompt: this.prompt,
                });

                this.agents.set(modelProfile.modelName, agent);
            }

            this.isReady = true;
        } catch (e) {
            throw e;
        }
    }

    isAgentReady() {
        return this.isReady;
    }

    async chat(
        sid: string,
        model: string,
        message: string,
        callback: (result: any) => Promise<void>,
    ) {
        const chatHistory = await this.findChatHistory(sid);
        const agentInstance = this.agents.get(model);
        if (!agentInstance) throw new Error("Model not found");

        await insertAiChatHistory(sid, "user", message);
        let attempt = 0;

        while (true) {
            await semaphore.acquire();
            try {
                const stream = await agentInstance.streamEvents(
                    {
                        messages: [...chatHistory, new HumanMessage(message)],
                    },
                    {
                        version: "v3",
                    },
                );

                for await (const snapshot of stream.values) {
                    const latestMessage = snapshot.messages.at(-1);
                    if (
                        !latestMessage?.content ||
                        latestMessage.type !== "ai"
                    ) {
                        continue;
                    }

                    if (typeof latestMessage.content === "string") {
                        await callback({
                            type: "text",
                            content: latestMessage.content,
                        });
                    } else {
                        for (const msg of latestMessage.contentBlocks) {
                            const content = msg.text
                                ? (msg.text as string)
                                : msg.reasoning
                                  ? (msg.reasoning as string)
                                  : "";

                            if (msg.type === "text") {
                                await insertAiChatHistory(
                                    sid,
                                    "agent",
                                    msg.text,
                                );
                            }
                            await callback({ type: msg.type, content });
                        }
                    }
                }
                return;
            } catch (e: any) {
                const isResourceExhausted =
                    e?.error?.message?.includes("ResourceExhausted") ||
                    e.message.includes("ResourceExhausted");

                attempt++;

                if (!isResourceExhausted || attempt > this.maxRetries) {
                    throw e;
                }

                const backOffMs = 500 * 2 * attempt + Math.random() * 300;

                await callback({
                    type: "agent-error",
                    content: JSON.stringify(e)
                })

                await callback({
                    type: "agent-retry",
                    content: `[AI-Agent] Rate Limited (attempt ${attempt}/${this.maxRetries})`,
                });

                await new Promise((resolve) => setTimeout(resolve, backOffMs));
            } finally {
                semaphore.release();
            }
        }
    }

    async findChatHistory(sid: string) {
        const aiConfig = await getAiConfig();
        const history = await getAiChatHistory(
            sid,
            parseInt(aiConfig.get("history_truncate") as string),
        );

        const chatHistory: BaseMessage[] = history.reverse().map((v) => {
            if (v.role === "user") {
                return new HumanMessage(v.content);
            } else {
                return new AIMessage(v.content);
            }
        });

        return chatHistory;
    }
}

export const agent = new AIAgent(prompt);
agent.setup([ragSearch, dbSearch, dbMap, tavilyTool]);
