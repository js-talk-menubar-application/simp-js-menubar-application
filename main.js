const {app, BrowserWindow, ipcMain, Tray, nativeImage} = require('electron')
const path = require('path')

const assetsDir = path.join(__dirname, 'assets')

let tray = undefined
let window = undefined

// This method is called once Electron is ready to run our code
// It is effectively the main method of our Electron app
app.on('ready', () => {
  // Setup the menubar with an icon
  let icon = nativeImage.createFromDataURL(base64Icon)
  tray = new Tray(icon)

  // Add a click handler so that when the user clicks on the menubar icon, it shows
  // our popup window
  tray.on('click', function(event) {
    toggleWindow()

    // Show devtools when command clicked
    if (window.isVisible() && process.defaultApp && event.metaKey) {
      window.openDevTools({mode: 'detach'})
    }
  })

  // Make the popup window for the menubar
  window = new BrowserWindow({
    width: 300,
    height: 410,
    show: false,
    frame: false,
    resizable: false,
  })

  // Tell the popup window to load our index.html file
  window.loadURL(`file://${path.join(__dirname, 'index.html')}`)

  // Only close the window on blur if dev tools isn't opened
  window.on('blur', () => {
    if(!window.webContents.isDevToolsOpened()) {
      window.hide()
    }
  })
})

const toggleWindow = () => {
  if (window.isVisible()) {
    window.hide()
  } else {
    showWindow()
  }
}

const showWindow = () => {
  const trayPos = tray.getBounds()
  const windowPos = window.getBounds()
  let x, y = 0
  if (process.platform == 'darwin') {
    x = Math.round(trayPos.x + (trayPos.width / 2) - (windowPos.width / 2))
    y = Math.round(trayPos.y + trayPos.height)
  } else {
    x = Math.round(trayPos.x + (trayPos.width / 2) - (windowPos.width / 2))
    y = Math.round(trayPos.y + trayPos.height * 10)
  }


  window.setPosition(x, y, false)
  window.show()
  window.focus()
}

ipcMain.on('show-window', () => {
  showWindow()
})

app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Tray Icon as Base64 so tutorial has less overhead
let base64Icon = `data:image/png;base64,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`
