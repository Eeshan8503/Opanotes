const electron = require("electron");
const { ipcMain } = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
var fs = require('fs');
const isDev = require("electron-is-dev");
// var remote = require('remote'); // Load remote compnent that contains the dialog dependency
// var dialog = remote.require('dialog'); // Load the dialogs component of the OS
// var fs = require('fs'); // Load the File System to execute our common tasks (CRUD)
let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 500,
    movable:true,
    transparent:true,
    frame:false,
    icon: "./icon.png",
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.webContents.on("new-window", function (e, url) {
    e.preventDefault();
    require("electron").shell.openExternal(url);
  });

  mainWindow.on("closed", () => (mainWindow = null));
}

ipcMain.on("file:sent", (event,file)=>{
  fs.readFile(file, 'utf-8', (err, data) => {
    if(err){
        alert("An error ocurred reading the file :" + err.message);
        return;
    }
    console.log("The file content is : " + data);
    mainWindow.webContents.send("hello",data);
});
})
ipcMain.on("closer",(event)=>{
  mainWindow.close();
})
app.on("ready",()=>{setTimeout(createWindow,300)} );
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});