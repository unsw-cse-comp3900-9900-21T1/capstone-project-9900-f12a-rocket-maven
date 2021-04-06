const CracoLessPlugin = require('craco-less')
const CracoAlias = require('craco-alias')

const fs = require('fs')
const fs_Extra = require('fs-extra')
const path = require('path')

var highchartsRoot = './public/third-party/highcharts'
var highchartsImg = highchartsRoot + '/gfx'

if (!fs.existsSync(highchartsRoot)) {
  fs.mkdirSync(highchartsRoot, { recursive: true })
}
if (!fs.existsSync(highchartsImg)) {
  fs_Extra.copy('./node_modules/highcharts/gfx', highchartsImg, function (error) {})
}

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@border-radius-base': '12px'
            },
            javascriptEnabled: true
          }
        }
      }
    },
    {
      plugin: CracoAlias,
      options: {
        source: 'options',
        baseUrl: './',
        aliases: {
          '@rocketmaven': './src'
        }
      }
    }
  ]
}
