import "dotenv/config";
import { AIAgent } from "./lib/agent.js";

const agent = new AIAgent("Anda adalah agent yang berbicara dalam bahasa indonesia")
agent.setup([]).then(() => {
    agent.chat("abcdefg", "gemini-3.5-flash-lite", "Dimanakah letak indonesia ?", (result) => {
        console.log(result)
    })
})