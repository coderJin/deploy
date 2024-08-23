const configTemplate = 
`module.exports = {
    "env1": {
        host: '127.0.0.1',
        port: 22,
        username: 'root',
        password: 'admin123',
        // 相对于当前运行目录的构建产物路径
        buildPath: 'dist',
        // 远程路径
        remotePath: '/opt/tomcat/webapps/views',
        // 是否删除远程产物，false则重命名
        isRemove: false,
        // 放入可执行命令依次执行
        restartCommand: [],
        // 构建镜像
        dockerBuild: {
          DockerfilePath: '/home/front-build/arm',
          isPush: true,
          pushPath : '',
          harborIp: '',
          harborName: '',
          harborPwd: ''
        },
        // 镜像转移
        imageTransfer: {
          pullPath: '',
          pushPath: '',
          harborIp: '',
          harborName: '',
          harborPwd: ''
        }
    },
    "env2": {
        host: '127.0.0.2',
        port: 22,
        username: 'root',
        password: 'admin123',
        buildPath: '',
        remotePath: '',
        isRemove: false,
        restartCommand: [],
        dockerBuild: {
          DockerfilePath: '/home/front-build/arm',
          isPush: true,
          pushPath : '',
          harborIp: '',
          harborName: '',
          harborPwd: ''
        },
        imageTransfer: {
          pullPath: '',
          pushPath: '',
          harborIp: '',
          harborName: '',
          harborPwd: ''
        }
    },
}
`
module.exports = {
    configTemplate
}
