const ora = require('ora')
const { NodeSSH } = require('node-ssh');

const { log, handleConfigParams } = require('../share')

/**
 * 依次执行可执行命令、功能设计为了重启
 * @param {} envName 
 */
const restart = async function(envName) {
    
    try {
        var { host, port, username, password, restartCommand } = handleConfigParams(envName, true)
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

        async function run() {
            for (const commandStr of restartCommand) {
                const tempArry = commandStr.split('/')
                const cmd = tempArry.pop()
                const cwd = tempArry.join('/')
    
                log(`执行上下文 ${cwd} `, 'green')
                log(`执行命令:  ${cmd} `, 'green')
    
                let res = await ssh.execCommand(`bash ${cmd}`, {cwd})

               if(res.code === 0) {
                    log(`命令 [${cmd}] 执行成功！`, 'green')
               }else {
                    log(`错误信息: ${res.stderr}`, 'red')
                    process.exit(0);
               }
                
               await new Promise(resolve => setTimeout(resolve, 3000))
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
    restart
}