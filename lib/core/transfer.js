const ora = require('ora')
const { NodeSSH } = require('node-ssh');

const { log, handleConfigParams } = require('../share')

/**
 * 依次执行可执行命令、功能设计为了重启
 * @param {} envName 
 */
const transfer = async function(envName) {
    
    try {
        var { host, port, username, password, imageTransfer } = handleConfigParams(envName, true)
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
        const { pullPath, pushPath, harborIp, harborName, harborPwd } = imageTransfer
        // 命令列表
        const commandList = [
          `docker pull ${pullPath}`,
          `docker tag ${pullPath} ${pushPath}`,
          `docker login -u ${harborName} -p ${harborPwd} ${harborIp}`,
          `docker push ${pushPath}`,
          `docker rmi -f ${pullPath}`,
        ]

        async function run() {
          for (const cmd of commandList) {
            
            const cwd = '/'
  
            log(`执行命令:  ${cmd} `, 'green')
  
            let res = await ssh.execCommand(`${cmd}`, {cwd})
  
           if(res.code === 0) {
                log(res.stdout)
                log(`命令 [${cmd}] 执行成功！`, 'green')
           }else {
                log(`错误信息: ${res.stderr}`, 'red')
                process.exit(0);
           }
          }
          process.exit(0);
        }

        run()

    } catch (error) {
        spinner.stop();
        log(error.message, 'red')
    }
    
}


module.exports = {
  transfer
}