# wise-deploy
  deploy package files to server
## Install

```javascript
$ npm install -g wise-deploy
```

## Example

```javascript
$ deploy init
$ deploy upload -c <envName>
$ deploy restart -c <envName>
```

## Usage

```javascript
Usage: cli [options] [command]

Options:

  -V, --version      output the version number
  -h, --help         display help for command

Commands:

  init [options]     初始化配置文件
  upload [options]   上传构建产物
  restart [options]  依次执行传入命令
```


