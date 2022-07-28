function toBool(value: string | undefined | null): boolean {
    return value === 'true';
}

function toNumber(value: string): number {
    return parseInt(value, 10);
}

function toArray(key: string, delimiter = ','): string[] {
    return process.env[key] && process?.env?.[key]?.split(delimiter) || [];
}

/**
 * Get `required` env variable
 * @param key
 * @returns 
 */
function getEnv(key: string): string {
    if (typeof process.env[key] === 'undefined') {
        throw new Error(`Environment variable ${key} is not set.`);
    }

    return process.env[key] as string;
}

const env = {
    node_env: process.env.NODE_ENV || "production",
    port: process.env.PORT || 8080,
    monitor: {
        enabled: toBool(process.env.MONITOR_ENABLED),
        page: process.env.MONITOR_ROUTE,
        user: process.env.MONITOR_USERNAME,
        password: process.env.MONITOR_PASSWORD
    }
}

export default env;