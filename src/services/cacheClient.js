import { createClient } from "redis";

let redisClients = [];
export const connectClients = async () => {
    try {
        redisClients = [
            createClient({ url: `redis://${process.env.REDIS_HOST_1}:${process.env.REDIS_PORT_1}` }),
            createClient({ url: `redis://${process.env.REDIS_HOST_2}:${process.env.REDIS_PORT_2}` }),
        ];
        await Promise.all(redisClients.map(client => client.connect()));
        console.log('Connected to all Redis clients');
    } catch (err) {
        console.error('Error connecting to Redis:', err);
    }
}

function getClient(key) {
    if (!redisClients || redisClients.length === 0) {
        console.error('No Redis clients available');
        return null;
    }
    const hash = key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return redisClients[hash % redisClients.length];
}

function redisClient() {
    const functions = {
        get: async (key) => {
            const client = getClient(key);
            if (!client) {
                console.log(`No Redis client available for key: ${key}`);
                return null;
            }

            try {
                const value = await client.get(key);
                if (!value) {
                    console.log(`Cache miss - key: ${key}`);
                    return null;
                }
                console.log(`Cache hit - key: ${key}`);
                return value;
            } catch (error) {
                console.error(`Error getting value for key: ${key}`, error);
                return null;
            }
        },

        set: async (key, value) => {
            const client = getClient(key);
            if (!client) {
                console.log(`No Redis client available for key: ${key}`);
                return;
            }

            try {
                await client.set(key, value);
                console.log(`Set value for key: ${key}`);
            } catch (error) {
                console.error(`Error setting value for key: ${key}`, error);
            }
        }
    };

    return functions;
}

export default redisClient();
