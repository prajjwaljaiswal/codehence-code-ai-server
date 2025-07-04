import {promptExtra, ToolInfo} from "./prompt";
import {Messages} from "./action"
import {handleBuilderMode} from "./handlers/builderHandler"
import {handleChatMode} from "./handlers/chatHandler"
import { modelConfig } from "../model/config";

enum ChatMode {
    Chat = "chat",
    Builder = "builder",
}



interface ChatRequest {
    messages: Messages;
    model: string;
    mode: ChatMode;
    otherConfig: promptExtra
    tools?: ToolInfo[]
}

export async function OPTIONS(request: Request) {
    return new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*", // Change to your frontend URL in production
            "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
    });
}

export async function POST(request: Request) {
    try {
        const {
            messages,
            model,
            mode = ChatMode.Builder,
            otherConfig,
            tools,
        } = (await request.json()) as ChatRequest;
        const userId = request.headers.get("userId");
        const result =
            mode === ChatMode.Chat
                ? await handleChatMode(messages, model, userId, tools)
                : await handleBuilderMode(messages, model, userId, otherConfig, tools)
        console.log(result, 'result');
        // Add CORS headers to the response
        const headers = new Headers(result.headers);
        headers.set("Access-Control-Allow-Origin", "*");
        headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
        headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
        return new Response(result.body, {
            status: result.status,
            statusText: result.statusText,
            headers,
        });
    } catch (error) {
        console.log(error, "error");
        if (error instanceof Error && error.message?.includes("API key")) {
            return new Response("Invalid or missing API key", {
                status: 401,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization",
                },
            });
        }
        return new Response(String(error.message), {
            status: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
        });
    }
}

