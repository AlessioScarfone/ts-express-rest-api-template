const monitorConfig = (port: number | string = 8080, path = '/status') => {
    return {
        title: 'Server Status',
        theme: 'default.css',     // Default styles
        path: path,
        spans: [{
            interval: 1,            // Every second
            retention: 60           // Keep 60 datapoints in memory
        }, {
            interval: 5,            // Every 5 seconds
            retention: 60
        }, {
            interval: 15,           // Every 15 seconds
            retention: 60
        }],
        chartVisibility: {
            cpu: true,
            mem: true,
            load: true,
            heap: true,
            responseTime: true,
            rps: true,
            statusCodes: true
        },
        healthChecks: [
            {
                protocol: 'http',
                host: 'localhost',
                path: '/admin/health',
                port: port
            }
        ],
        ignoreStartsWith: '/admin'
    }
}

export default monitorConfig;