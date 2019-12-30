const { app, BrowserWindow, ipcMain } = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')

const neteaseApi = require('./NeteaseCloudMusicApi/app')
const { port } = require('./app-config')
let apiServer
let mainWindow
app.on('ready', () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    useContentSize: true,
    frame: false,
    width: 1200,
    height: 768
  })

  mainWindow.on('close', () => {
    mainWindow = null
  })

  const urlLocation = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, './index.html')}`

  mainWindow.loadURL(urlLocation)

  apiServer = neteaseApi.listen(port, () => {
    console.log('netease api are now running on ' + port + ' port')
  })

  ipcMain.on('unmaximize', () => mainWindow.minimize())
  ipcMain.on('maximize', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
  })
  ipcMain.on('close', () => mainWindow.close())
})

app.on('before-quit', () => {
  apiServer && apiServer.close()
})
