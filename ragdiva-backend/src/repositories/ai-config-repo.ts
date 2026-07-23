import { prisma } from "../lib/database.js";

export async function getAiConfig() {
    const configDB = await prisma.aIConfig.findMany();
    const configMap = new Map<string, string>();

    for (const config of configDB) {
        configMap.set(config.key, config.value);
    }

    return configMap;
}
