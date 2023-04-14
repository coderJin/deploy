const { Command  } = require('commander');
const figlet = require("figlet");
const { init, upload, restart } = require('./core')
const { version } = require('../package.json')

const program = new Command();

/**
 * init命令 --- 初始化配置文件
 */
program.command('init')
  .description('初始化配置文件')
  .option('-d, --delete', '删除配置文件')
  .action((opts) => {
    init(opts.delete)
  });


/**
 * upload命令 --- upload  
 */
program.command('upload')
  .description('上传构建产物')
  .requiredOption('-c, --config<env>', '配置名称')
  .action((opts) => {
    let envName = opts['config<env>']
    upload(envName)
  });

/**
 * restart命令 --- restart  
 */
program.command('restart')
  .description('依次执行传入命令')
  .requiredOption('-c, --config<env>', '配置名称')
  .action((opts) => {
    let envName = opts['config<env>']
    restart(envName)
  });



/**
 * Version 版本
 */
program.version(`V ${version}`)

/**
 * help提示
 */
program
  .on('--help', () => {
    console.log('\r\n' + figlet.textSync('DEPLOY', {
      font: 'Ghost',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: false
    }));
  })

program.parse(process.argv);
