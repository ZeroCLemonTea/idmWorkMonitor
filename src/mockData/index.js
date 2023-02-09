export const mockApplicationStatusList = [
    {
        applicationName: '服务器',
        applicationNumber: 6,
        type: 'server',
        children: [
            {
                type: 'normal',
                name: '服务器一',
                ip: '192.168.1.1'
            },
            {
                type: 'normal',
                name: '服务器一',
                ip: '192.168.1.1'
            },
            {
                type: 'normal',
                name: '服务器一',
                ip: '192.168.1.1'
            },
            {
                type: 'normal',
                name: '服务器一',
                ip: '192.168.1.1'
            },
            {
                type: 'abnormal',
                name: '服务器一',
                ip: '192.168.1.1'
            },
            {
                type: 'close',
                name: '服务器一',
                ip: '192.168.1.1'
            }
        ]
    },
    {
        applicationName: '数据库',
        applicationNumber: 3,
        type: 'database',
        children: [
            {
                type: 'normal',
                name: '数据库一',
                ip: '192.168.1.1'
            },
            {
                type: 'abnormal',
                name: '数据库一',
                ip: '192.168.1.1'
            },
            {
                type: 'close',
                name: '数据库一',
                ip: '192.168.1.1'
            }
        ]
    },
    {
        applicationName: '缓存',
        applicationNumber: 3,
        type: 'cache',
        children: [
            {
                type: 'normal',
                statusText: '正常',
                name: '缓存一',
                ip: '192.168.1.1'
            },
            {
                type: 'abnormal',
                statusText: '异常',
                name: '缓存一',
                ip: '192.168.1.1'
            },
            {
                type: 'close',
                statusText: '关闭',
                name: '缓存一',
                ip: '192.168.1.1'
            }
        ]
    },
    {
        applicationName: 'Web中间件',
        applicationNumber: 3,
        type: 'webMiddleware',
        children: [
            {
                type: 'normal',
                statusText: '正常',
                name: 'Web中间件一',
                ip: '192.168.1.1'
            },
            {
                type: 'abnormal',
                statusText: '异常',
                name: 'Web中间件一',
                ip: '192.168.1.1'
            },
            {
                type: 'close',
                statusText: '关闭',
                name: 'Web中间件一',
                ip: '192.168.1.1'
            }
        ]
    }
]

export const mockSoftwareStaticsList = [
    {
        type: 'database',
        normalNumber: 3,
        warningNumber: 3,
        closeNumber: 3
    },
    {
        type: 'cache',
        normalNumber: 3,
        warningNumber: 3,
        closeNumber: 3
    },
    {
        type: 'webMiddleware',
        normalNumber: 3,
        warningNumber: 3,
        closeNumber: 3
    },
    {
        type: 'elasticsearch',
        normalNumber: 3,
        warningNumber: 3,
        closeNumber: 3
    },
    {
        type: 'messageMiddleware',
        normalNumber: 3,
        warningNumber: 3,
        closeNumber: 3
    }
]
