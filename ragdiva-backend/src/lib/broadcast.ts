import type { BroadcastMessageType } from "../types/broadcast-message-type.js";

export const broadcastPool = new Set<{ id: string; write: (event: string, data: string) => Promise<void>}>()

export async function broadcasting(event: string, message: BroadcastMessageType) {
    for(const client of broadcastPool) {
        try {
            const data = JSON.stringify(message)
            await client.write(event, data)
        }
        catch {
            broadcastPool.delete(client)
        }
    }
}