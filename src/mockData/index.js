export const mockApplicationStatusList = [
    {
        applicationName: '服务器',
        applicationNumber: 6,
        children: [
            {
                status: 'normal',
                statusText: '正常',
                name: '服务器一',
                ip: '192.168.1.1'
            },
            {
                status: 'normal',
                statusText: '正常',
                name: '服务器一',
                ip: '192.168.1.1'
            },
            {
                status: 'normal',
                statusText: '正常',
                name: '服务器一',
                ip: '192.168.1.1'
            },
            {
                status: 'normal',
                statusText: '正常',
                name: '服务器一',
                ip: '192.168.1.1'
            },
            {
                status: 'normal',
                statusText: '异常',
                name: '服务器一',
                ip: '192.168.1.1'
            },
            {
                status: 'normal',
                statusText: '关闭',
                name: '服务器一',
                ip: '192.168.1.1'
            }
        ]
    },
    {
        applicationName: '数据库',
        applicationNumber: 3,
        children: [
            {
                status: 'normal',
                statusText: '正常',
                name: '数据库一',
                ip: '192.168.1.1'
            },
            {
                status: 'normal',
                statusText: '异常',
                name: '数据库一',
                ip: '192.168.1.1'
            },
            {
                status: 'normal',
                statusText: '关闭',
                name: '数据库一',
                ip: '192.168.1.1'
            }
        ]
    }
]

export const mockSoftwareStaticsList = [
    {
        softwareName: '数据库',
        normalNumber: 3,
        warningNumber: 3,
        closeNumber: 3
    },
    {
        softwareName: '缓存',
        normalNumber: 3,
        warningNumber: 3,
        closeNumber: 3
    },
    {
        softwareName: 'Web中间件',
        normalNumber: 3,
        warningNumber: 3,
        closeNumber: 3
    },
    {
        softwareName: 'Elasticsearch',
        normalNumber: 3,
        warningNumber: 3,
        closeNumber: 3
    },
    {
        softwareName: '消息中间件',
        normalNumber: 3,
        warningNumber: 3,
        closeNumber: 3
    }
]
