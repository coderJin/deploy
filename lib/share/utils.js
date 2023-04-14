const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')

const { fileName } = require('./constant.js')

/**
 * 基于chalk封装的log
 * @param {*} msg 
 * @param {*} color 
 */
const log = function(msg, color = 'blue') {
    console.log(chalk.blueBright('[running log]: '), chalk[color](msg));
}


/**
 * 参数整理并进行前置校验
 * @param {*} envName 
 * @returns 
 */
const handleConfigParams = function(envName, isValidCommandParams = false) {

    const configFilePath = path.resolve(process.cwd(), fileName)
    
    const isExist = fs.pathExistsSync(configFilePath)
  
    if (!isExist) {
      throw "配置文件不存在"
    }
  
    const configInfo = require(configFilePath)
  
    if(typeof configInfo[envName] !== 'object' || configInfo[envName] === null) {
      throw "配置参数有误"
    }
  
    const paramsList = isValidCommandParams 
    ? ['host', 'port', 'username', 'password','restartCommand'] 
    : ['host', 'port', 'username', 'password', 'buildPath', 'remotePath']
    
    paramsList.forEach(key => {
      if(!configInfo[envName][key] || String(configInfo[envName][key]).length === 0) {
        throw `${key}为必填项`
      }
    })
  
    return {
      ...configInfo[envName]
    }
}

module.exports = {
    log,
    handleConfigParams
}