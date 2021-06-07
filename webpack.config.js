module.exports = {
    externals: {
        serialport: true,
        electron: true,
        ipcRenderer:true,
        fs:true,
      },
      target: 'electron-renderer'

};