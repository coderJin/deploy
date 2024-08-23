const ora = require('ora')
const { NodeSSH } = require('node-ssh');

const { log, handleConfigParams } = require('../share')

/**
 * 依次执行可执行命令、功能设计为了重启
 * @param {} envName 
 */
const dockerizing = async function(envName) {
    
    try {
        var { host, port, username, password, dockerBuild } = handleConfigParams(envName, true)
    } catch (error) {
        return log(error, 'red')
    }

    const ssh = new NodeSSH();
    const spinner = ora("开始连接\n");

    try {

        spinner.start();

        await ssh.connect({ host, port, username,password })

        spinner.stop();
        log('连接成功', 'green')

        // 推送到harbor
        async function pushToHarbor(harborIp, harborName, harborPwd, pushPath) {

          const commandList = [
            `docker login -u ${harborName} -p ${harborPwd} ${harborIp}`,
            `docker push ${pushPath}`,
            `docker rmi -f ${pushPath}`,
          ]

          for (const cmd of commandList) {
            
            const cwd = '/'
  
            log(`执行命令:  ${cmd} `, 'green')
  
            let res = await ssh.execCommand(`${cmd}`, {cwd})
  
           if(res.code === 0) {
                log(res.stdout)
                log(`命令 [${cmd}] 执行成功！`, 'green')
           }else {
                console.log(11111);
                log(`错误信息: ${res.stderr}`, 'red')
                process.exit(0);
           }
          }
          process.exit(0);
        }

        async function build() {
          const { DockerfilePath, pushPath, isPush, harborIp, harborName, harborPwd } = dockerBuild

          const cmd = `docker build -t ${pushPath} .`
          const cwd = DockerfilePath || '/'

          log(`执行上下文 ${cwd} `, 'green')
          log(`执行命令:  ${cmd} `, 'green')

          let res = await ssh.execCommand(`${cmd}`, {cwd})

         if(res.code === 0) {
              log(res.stdout)
              log(`命令 [${cmd}] 执行成功！`, 'green')
              if(isPush) {
                pushToHarbor(harborIp, harborName, harborPwd, pushPath)
              }else {
                process.exit(0);
              }
         }else {
              log(`错误信息: ${res.stderr}`, 'red')
              process.exit(0);
         }
        }

        build()

    } catch (error) {
        spinner.stop();
        log(error.message, 'red')
    }
    
}


module.exports = {
  dockerizing
}