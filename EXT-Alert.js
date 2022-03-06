/**
 ** Module : EXT-Alert
 ** @bugsounet
 ** ©02-2022
 ** support: http://forum.bugsounet.fr
 **/

logALERT = (...args) => { /* do nothing */ }

Module.register("EXT-Alert", {
  defaults: {
    debug: false,
    ignore: []
  },

  start: function () {
    if (this.config.debug) logALERT = (...args) => { console.log("[ALERT]", ...args) }
    this.alerts= {
      displayed: false,
      buffer: []
    }
    this.types= [
      {
        event: "warning",
        icon: "modules/EXT-Alert/resources/warning.gif",
        timer: 5000,
        sound: "modules/EXT-Alert/resources/warning.ogg"
      },
      {
        event: "error",
        icon: "modules/EXT-Alert/resources/error.gif",
        timer: 5000,
        sound: "modules/EXT-Alert/resources/error.mp3"
      },
      {
        event: "information",
        icon: "modules/EXT-Alert/resources/information.gif",
        timer: 5000,
        sound: null
      }
    ]
    this.prepareAlertPopup() // better place for create main popup quickly !

    //check ignore modules array (prevent crash)
    if (!Array.isArray(this.config.ignore)) {
      let tmp = this.config.ignore
      this.config.ignore = []
      if (tmp) this.config.ignore.push(tmp)
    }
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
      case "GAv4_READY":
        if (sender.name == "MMM-GoogleAssistant") this.sendNotification("EXT_HELLO", this.name)
        break
      case "EXT_ALERT":
        if (this.config.ignore.indexOf(sender.name) >= 0) return
        if (!payload) return  this.Alert("error", {message: "Alert error by:" + sender } )
        this.Alert({
          type: payload.type ? payload.type : "error",
          message: payload.message ? payload.message : "Unknow message",
          timer: payload.timer ? payload.timer : null,
          sender: payload.sender ? payload.sender : sender.name,
          icon: payload.icon ? payload.icon: null,
          sound: payload.sound ? payload.sound: null
        })
        break
    }
  },

  /** alert buffer to array **/
  Alert: function(info) {
    var alertObject = {
      type: null,
      info: info
    }
    
    this.types.forEach((type) => {
      if (type.event == info.type) alertObject.type = type
    })
    if (!info.message) { // should not happen
      logALERT("debug information:", info)
      return this.Alert("warning", { message: "Alert Core: No message!" })
    }
    if (!alertObject.type) {
      logALERT("debug information:", alertObject)
      return this.Alert("warning", { message: "Alert Core: Display Type Error!" })
    }

    this.alerts.buffer.push(alertObject)
    logALERT("Buffer Add:", this.alerts)
    this.AlertBuffer(this.alerts.buffer[0].type, this.alerts.buffer[0].info)
  },

  /***************************/
  /** Information Displayer **/
  /***************************/

  prepareAlertPopup: function() {
    this.sound= new Audio()
    this.sound.autoplay= true
    var Alert = document.createElement("div")
    Alert.id = "EXT-Alert"
    Alert.style.zoom = "80%"
    Alert.className= "hidden animate__animated"
    Alert.style.setProperty('--animate-duration', '1s')

    var Alert_Bar = document.createElement("div")
    Alert_Bar.id = "EXT-Alert-bar"
    Alert_Bar.tabindex = -1
    Alert.appendChild(Alert_Bar)

    //informations image
    var Alert_Icon = document.createElement("img")
    Alert_Icon.id= "EXT-Alert-Icon"
    Alert_Icon.className="EXT-Alert-icon"
    Alert_Icon.src = "/modules/EXT-Alert/resources/warning.gif"
    Alert_Bar.appendChild(Alert_Icon)

    var Alert_Displayer = document.createElement("div")
    Alert_Displayer.id= "EXT-Alert-Displayer"
    Alert_Displayer.className="EXT-Alert-displayer"
    Alert_Bar.appendChild(Alert_Displayer)

    //transcription informations text
    var Alert_Response = document.createElement("span")
    Alert_Response.id= "EXT-Alert-Message"
    Alert_Response.className="EXT-Alert-response"
    Alert_Response.textContent= "~EXT-Alert Displayer~"
    Alert_Displayer.appendChild(Alert_Response)

    var Alert_Sender = document.createElement("span")
    Alert_Sender.id= "EXT-Alert-Sender"
    Alert_Sender.className="EXT-Alert-sender"
    Alert_Sender.textContent= "by EXT-Alert"
    Alert_Displayer.appendChild(Alert_Sender)

    document.body.appendChild(Alert)
  },

  /** Informations Display with translate from buffer **/
  AlertBuffer: function(type, message) {
    if (this.alerts.displayed || !this.alerts.buffer.length) return
    this.AlertLogo(type, message)
    this.AlertInformations(message)
    this.AlertShow()

    let timer = message.timer ? message.timer : type.timer

    // define timer limit...
    if (timer < 3000) timer = 3000
    if (timer > 30000) timer = 30000

    this.warningTimeout = setTimeout(() => {
      this.AlertHide()
    }, timer)
  },

  AlertInformations: function (message) {
    var Message = document.getElementById("EXT-Alert-Message")
    var Sender = document.getElementById("EXT-Alert-Sender")
    Message.innerHTML = this.translate(message.message, { VALUES: message.values })
    Sender.textContent = message.sender ? message.sender : "EXT-Alert"
  },

  AlertLogo: function (type, info) {
    var Logo = document.getElementById("EXT-Alert-Icon")
    Logo.src = info.icon ? info.icon : type.icon
    if (info.sound == "none") return
    if (type.sound || info.sound) this.sound.src = (info.sound ? info.sound : type.sound) + "?seed="+Date.now
  },

  AlertHide: function () {
    var Alert = document.getElementById("EXT-Alert")
    Alert.classList.remove('animate__bounceInDown')
    Alert.classList.add("animate__bounceOutUp")
    Alert.addEventListener('animationend', (e) => {
    if (e.animationName == "bounceOutUp" && e.path[0].id == "EXT-Alert")
      Alert.classList.add("hidden")
      this.AlertInformations("")
      this.alerts.buffer.shift()
      this.alerts.displayed=false
      logALERT("Buffer deleted", this.alerts)
      if(this.alerts.buffer.length) this.AlertBuffer(this.alerts.buffer[0].type, this.alerts.buffer[0].info)
      else logALERT("Buffer is now empty!")
    }, {once: true})
  },

  AlertShow: function () {
    this.alerts.displayed=true
    var Alert = document.getElementById("EXT-Alert")
    Alert.classList.remove("hidden", "animate__bounceOutUp")
    Alert.classList.add('animate__bounceInDown')
  }
})
