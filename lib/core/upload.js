const ora = require('ora');
const path = require('path');
const Client = require('ssh2-sftp-client');

const { log, handleConfigParams } = require('../share')

/**
 * 部署核心函数
 * @param {*} envName 
 * @returns 
 */
const upload = async function(envName) {

  try {
    var { host, port, username, password, buildPath, remotePath, isRemove } = handleConfigParams(envName)
  } catch (error) {
    return log(error, 'red')
  }
  
  const sftp = new Client();
  const spinner = ora("开始连接\n");

  try {

    spinner.start();
    
    await sftp.connect({host, port, username,password})
    
    spinner.stop();
    log('连接成功...', 'green')

    isRemove 
    ? await sftp.rmdir(remotePath, true) && log('删除成功...', 'green')
    : await sftp.rename(remotePath, remotePath + '_' + new Date().getTime()) && log('重命名成功...', 'green')

    log('开始上传...', 'green')

    await sftp.uploadDir(path.resolve(process.cwd(), buildPath), remotePath)

    log('上传成功...', 'green')
    
    await sftp.end()

    log('任务完成!', 'green')

  } catch (error) {
    spinner.stop();
    log(error.message, 'red')
    await sftp.end()
  }
}


module.exports = {
  upload
}




