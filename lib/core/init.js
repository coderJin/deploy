const fs = require('fs-extra')
const path = require('path')

const { log, fileName, configTemplate } = require('../share')

/**
 * 初始化配置文件
 * @param {*} isDel
 */
const init  = function(isDel) {

    const configFilePath = path.resolve(process.cwd(), fileName)
    
    let isExist = fs.pathExistsSync(configFilePath)

    if(isDel) {
        isExist ? fs.removeSync(configFilePath) : log('文件不存在~', 'yellow')
    }else {
        isExist ? log('配置文件已存在❗️', 'red') : fs.outputFileSync(configFilePath, configTemplate)
    }
}


module.exports = {
    init
}