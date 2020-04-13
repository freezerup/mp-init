const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')
const chalk = require('chalk')
const sass = require('sass')
const program = require('commander')

// 日志
function log(msg = '', color = 'green') {
  console.log(chalk[color](msg))
}

// px 转 rpx
function pxToRpx(dir, source, buffer, encode = 'utf8') {
  const outPath = dir.replace(/(.css|.scss)$/, '.wxss')
  const bufferString = buffer.toString(encode).replace(/(\d+)px/g, '$1rpx')
  fs.writeFile(outPath, bufferString, err => {
    if (err) {
      log(`${source} -> scssToWxss -> pxToRpx error -> ${err}`, 'red')
      return false
    }
    log(`${source} -> scss 2 wxss success`, 'green')
  })
}

// 根据scss生成同名wxss
function scssToWxss(dir, source) {
  sass.render({
    file: path.resolve(dir),
  }, (error, { css: buffer }) => {
    if (error) {
      log(`${source} -> scssToWxss => sass.render error -> ${error}`, 'red')
      return false
    }
    pxToRpx(dir, source, buffer)
  })
}

// 监听scss文件变化
function scssMonitor(path) {
  const dir = path.replace(/\/*$/, '')
  const watch = chokidar.watch([`${dir}/**/*.css`, `${dir}/**/*.scss`], {
    ignored: /.idea|assets|miniprogram_npm|static|utils/,
  })

  watch
    .on('add', path => scssToWxss(path, 'add'))
    .on('change', path => scssToWxss(path, 'change'))
}

program
  .usage('yarn run scss [path]')
  .arguments('[path]')
  .action((path) => {
    if (!path) {
      log('please input path', 'red')
      return false
    }
    fs.stat(path, err => {
      if (err) {
        log(err, 'red')
        return false
      }
      log(' sass to wxss is running... ', 'yellow')
      scssMonitor(path)
    })
  })
  .parse(process.argv)
