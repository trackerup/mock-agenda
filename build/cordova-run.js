const spawn = require('cross-spawn')
const fs = require('fs')
const path = require('path')
const portfinder = require('portfinder')
const address = require('address')

const defaults = {
  cordovaPath: 'src-cordova',
  id: 'com.vue.example.app',
  appName: 'VueExampleAppName',
  platforms: ['android', 'ios', 'browser', 'osx', 'electron'],
  routerMode: 'hash',
  gitIgnoreContent: '*\n*/\n!.gitignore'
}

const cordovaRun = () => {
  const srcCordovaPath = path.join(__dirname, '../')
  const cordovaPath = srcCordovaPath

  const getPlatformPath = platform => {
    return path.resolve(`${cordovaPath}/platforms/${platform}`)
  }

  const getPlatformPathWWW = platform => {
    return path.resolve(`${cordovaPath}/platforms/${platform}/platform_www`)
  }

  const getCordovaPathConfig = platform => {
    let cordovaConfigPathToUpdate
    if (platform === 'android') {
      cordovaConfigPathToUpdate = 'app/src/main/res/xml/config.xml'
    } else if (platform === 'ios' || platform === 'osx') {
      const cordovaConfigPath = path.resolve(`${cordovaPath}/config.xml`)
      const cordovaConfig = fs.readFileSync(cordovaConfigPath, 'utf-8')
      const regexAppName = /\s+<name(.*)>(.*)<\/name>/
      const appNameMatch = cordovaConfig.match(regexAppName)
      if (appNameMatch.length >= 3) {
        const appName = appNameMatch[2]
        cordovaConfigPathToUpdate = `${appName}/config.xml`
      } else {
        console.error('Unable to detect AppName!')
      }
    } else {
      cordovaConfigPathToUpdate = 'config.xml'
    }
    process.env.CORDOVA_FILES = JSON.stringify([
      {
        from: path.resolve(`${getPlatformPathWWW(platform)}/cordova-js-src`),
        to: 'cordova-js-src'
      },
      {
        from: path.resolve(`${getPlatformPathWWW(platform)}/plugins`),
        to: 'plugins'
      },
      {
        from: path.resolve(`${getPlatformPathWWW(platform)}/cordova.js`),
        to: 'cordova.js'
      },
      {
        from: path.resolve(`${getPlatformPathWWW(platform)}/cordova_plugins.js`),
        to: 'cordova_plugins.js'
      }
    ])
    return path.resolve(`${cordovaPath}/platforms/${platform}/${cordovaConfigPathToUpdate}`)
  }

  const cordovaRun = (platform, target) => {
    // cordova run platform
    console.log(`executing "cordova run ${platform}" in folder ${srcCordovaPath}`)

    let runCommands
    if (target) {
      runCommands = [
        'run',
        platform,
        '--target',
        `${target}`
      ]
    } else {
      runCommands = [
        'run',
        platform
      ]
    }

    return spawn.sync('cordova', runCommands, {
      cwd: srcCordovaPath,
      env: process.env,
      stdio: 'inherit', // pipe to console
      encoding: 'utf-8'
    })
  }

  const webpackRun = () => {
    // cordova clean
    console.log(`executing "npm run dev" in folder ${srcCordovaPath}`)
    return spawn('webpack-dev-server', [
      '--inline',
      '--progress',
      '--config',
      'build/webpack.dev.conf.js'
    ], {
      cwd: srcCordovaPath,
      env: process.env,
      stdio: 'inherit', // pipe to console
      encoding: 'utf-8'
    })
  }

  const cordovaClean = (platform) => {
    // cordova clean
    console.log(`executing "cordova clean ${platform}" in folder ${srcCordovaPath}`)
    return spawn.sync('cordova', [
      'clean',
      platform
    ], {
      cwd: srcCordovaPath,
      env: process.env,
      stdio: 'inherit', // pipe to console
      encoding: 'utf-8'
    })
  }

  const runServe = async (platform, args) => {
    const availablePlatforms = []
    const platforms = defaults.platforms

    platforms.forEach(platform => {
      const platformPath = getPlatformPath(platform)
      if (fs.existsSync(platformPath)) {
        availablePlatforms.push(platform)
      }
    })

    if (availablePlatforms.includes(platform)) {
      const projectDevServerOptions = {}
      // resolve server options
      // const open = false // browser does not need to be opened
      const https = true // check devServer.options for user defined https setting
      const protocol = https ? 'https' : 'http'
      // const host = args.host || process.env.HOST || projectDevServerOptions.host
      let port = '8080'
      portfinder.basePort = port
      port = await portfinder.getPortPromise()
      const publicArg = args.public || projectDevServerOptions.public
      const defaultPublicURL = `${protocol}://${address.ip()}:${port}`
      const rawPublicUrl = publicArg || defaultPublicURL
      const publicUrl = rawPublicUrl
        ? /^[a-zA-Z]+:\/\//.test(rawPublicUrl)
          ? rawPublicUrl
          : `${protocol}://${rawPublicUrl}`
        : null

      // const serveArgs = {
      //   open,
      //   host,
      //   port,
      //   https,
      //   public: publicArg
      // }

      const target = args.target

      // set content url to devServer
      process.env.CORDOVA_PATH = cordovaPath
      process.env.CORDOVA_WEBVIEW_SRC = publicUrl
      process.env.CORDOVA_PREPARE_CONFIG = getCordovaPathConfig(platform)
      process.env.CORDOVA_API_URL = `"https://${address.ip()}/multimarcas-trackerup/trackerup-api/"`

      // npm run serve
      // const server = await api.service.run('serve', serveArgs)
      const server = webpackRun()
      cordovaClean(platform)
      cordovaRun(platform, target)
      return server
    } else {
      if (availablePlatforms.length === 0) {
        console.error(`No platforms installed in '${srcCordovaPath}', please execute "cordova platform add ${platform}" in ${srcCordovaPath}`)
      } else {
        console.error(`Missing platform '${platform}', please execute "cordova platform add ${platform}" in ${srcCordovaPath}`)
      }
    }
  }
  runServe(process.argv[2], {})
}

cordovaRun()
// console.log(process.argv[2])
// cordovaRun.runServe('android', {})
// console.log('cordovaRun', cordovaRun)
