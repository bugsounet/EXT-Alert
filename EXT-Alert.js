/**
 ** Module : EXT-Alert
 ** @bugsounet
 ** ©03-2023
 ** support: https://forum.bugsounet.fr
 **/

logALERT = (...args) => { /* do nothing */ }

Module.register("EXT-Alert", {
  defaults: {
    debug: false,
    ignore: []
  },

  start: function () {
    new AlertConfig(this)
  },

  getScripts: function() {
    return [
      "/modules/EXT-Alert/components/AlertInit.js",
      "/modules/EXT-Alert/components/AlertCommander.js",
      "/modules/EXT-Alert/components/AlertDisplay.js",
    ]
  },

  getStyles: function () {
    return [
      "EXT-Alert.css",
      "https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
    ]
  },

  getDom: function() {
    var dom = document.createElement("div")
    dom.style.display = 'none'
    return dom
  },

  notificationReceived: function(noti, payload, sender) {
    switch(noti) {
      case "DOM_OBJECTS_CREATED":
        this.sendSocketNotification("INIT", this.config)
        break
      case "GAv5_READY":
        if (sender.name == "MMM-GoogleAssistant") this.sendNotification("EXT_HELLO", this.name)
        break
      case "EXT_ALERT":
        if (this.config.ignore.indexOf(sender.name) >= 0) return
        if (!payload) return  this.AlertCommander.Alert("error", {message: "Alert error by:" + sender } )
        this.AlertCommander.Alert({
          type: payload.type ? payload.type : "error",
          message: payload.message ? payload.message : "Unknow message",
          timer: payload.timer ? payload.timer : null,
          sender: payload.sender ? payload.sender : sender.name,
          icon: payload.icon ? payload.icon: null,
          sound: payload.sound ? payload.sound: null
        })
        break
    }
  }
})
