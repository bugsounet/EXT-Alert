/**
 ** Module : MMM-Notification
 ** @bugsounet
 ** ©12-2021
 ** support: http://forum.bugsounet.fr
 **/

logNOTI = (...args) => { /* do nothing */ }

Module.register("MMM-Notification", {
  defaults: {
    debug: true,
    types: [
      {
        event: "warning",
        icon: "modules/MMM-Notification/resources/warning.gif",
        timer: 3000,
        sound: "modules/MMM-Notification/resources/warning.mp3"
      },
      {
        event: "error",
        icon: "modules/MMM-Notification/resources/error.gif",
        timer: 3000,
        sound: "modules/MMM-Notification/resources/error.mp3"
      },
      {
        event: "information",
        icon: "modules/MMM-Notification/resources/information.gif",
        timer: 3000,
        sound: "modules/MMM-Notification/resources/warning.mp3"
      }
    ]
  },

  start: function () {
    if (this.config.debug) logNOTI = (...args) => { console.log("[NOTI]", ...args) }
    this.Infos= {
      displayed: false,
      buffer: []
    }
  },

  getScripts: function() {
    return [ ]
  },

  getStyles: function () {
    return [
      "MMM-Notification.css",
      "https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
    ]
  },

  getDom: function() {

  },

  notificationReceived: function(noti, payload) {
    switch(noti) {
      case "DOM_OBJECTS_CREATED":
        this.prepareInfoDisplayer()
        this.sendSocketNotification("INIT", this.helperConfig)
        setTimeout(() => { this.Informations("information", { message: "ClassicRed: I test Display ! avec timerForce: 6 sec", timer: 6000}) }, 1000)
        setTimeout(() => { this.Informations("warning", { message: "ClassicRed: warning avec timerForce: 2 sec", timer: 2000}) }, 1000)
        setTimeout(() => { this.Informations("error", { message: "ClassicRed: error avec timerForce: 4 sec", timer: 4000}) }, 1000)
        break
    }
  },

  socketNotificationReceived: function(noti, payload) {
    switch(noti) {
   
    }    
  },

  /** Information buffer to array **/
  Informations(wantedType,info) {
    var infoObject = {
      type: null,
      info: info
    }
    
    let informationsTypes= this.config.types
    informationsTypes.forEach((type) => {
      if (type.event == wantedType)  infoObject.type = type
    })
    if (!info.message) { // should not happen
      logNOTI("debug information:", info)
      return this.Informations("warning", { message: "Core Information: no message!" })
    }
    if (!infoObject.type) {
      logNOTI("debug information:", infoObject)
      return this.Informations("warning", { message: "Core Information: Display Type Error!" })
    }

    this.Infos.buffer.push(infoObject)
    logNOTI("Informations Buffer Add:", this.Infos)
    this.InformationsBuffer(this.Infos.buffer[0].type, this.Infos.buffer[0].info)
  },

  /***************************/
  /** Information Displayer **/
  /***************************/

  prepareInfoDisplayer: function() {
    this.sound= new Audio()
    this.sound.autoplay= true
    var Displayer_Infos = document.createElement("div")
    Displayer_Infos.id = "Displayer_Infos"
    Displayer_Infos.style.zoom = "80%"
    Displayer_Infos.className= "hidden animate__animated"
    Displayer_Infos.style.setProperty('--animate-duration', '1s')

    var Displayer_InfosBar = document.createElement("div")
    Displayer_InfosBar.id = "Displayer_Infos-bar"
    Displayer_InfosBar.tabindex = -1
    Displayer_Infos.appendChild(Displayer_InfosBar)

    //informations image
    var Displayer_InfosIcon = document.createElement("img")
    Displayer_InfosIcon.id= "Displayer_Infos-Icon"
    Displayer_InfosIcon.className="Displayer_Infos-icon"
    Displayer_InfosIcon.src = "/modules/MMM-Notification/resources/warning.gif"
    Displayer_InfosBar.appendChild(Displayer_InfosIcon)

    //transcription informations text
    var Displayer_InfosResponse = document.createElement("span")
    Displayer_InfosResponse.id= "Displayer_Infos-Transcription"
    Displayer_InfosResponse.className="Displayer_Infos-response"
    Displayer_InfosResponse.textContent= "~MMM-Notification Displayer~"
    Displayer_InfosBar.appendChild(Displayer_InfosResponse)

    document.body.appendChild(Displayer_Infos)
  },

  /** Informations Display with translate from buffer **/
  InformationsBuffer: function(type, info) {
    if (this.Infos.displayed || !this.Infos.buffer.length) return
    logNOTI(type + ":", info)
    this.logoInformations(type)
    this.showInformations(info)
    this.InformationShow()

    let timer = info.timer ? info.timer : (type.timer ? type.timer : this.config.timer)
    console.log(timer)

    this.warningTimeout = setTimeout(() => {
      this.InformationHidden()
    }, timer)
  },

  showInformations: function (info) {
    console.log(info)
    var tr = document.getElementById("Displayer_Infos-Transcription")
    tr.textContent = this.translate(info.message, { VALUES: info.values })
  },

  logoInformations: function (type) {
    var InfoLogo = document.getElementById("Displayer_Infos-Icon")
    InfoLogo.src = type.icon
    if (type.sound) this.sound.src = type.sound
  },

  InformationHidden: function () {
    var infosDiv = document.getElementById("Displayer_Infos")
    infosDiv.classList.remove('animate__bounceInDown')
    infosDiv.classList.add("animate__bounceOutUp")
    infosDiv.addEventListener('animationend', (e) => {
    if (e.animationName == "bounceOutUp" && e.path[0].id == "Infos")
      Infos.classList.add("hidden")
      this.showInformations("")
      this.Infos.buffer.shift()
      this.Infos.displayed=false
      logNOTI("Informations Buffer deleted", this.Infos)
      if(this.Infos.buffer.length) this.InformationsBuffer(this.Infos.buffer[0].type, this.Infos.buffer[0].info)
    }, {once: true})
  },

  InformationShow: function () {
    this.Infos.displayed=true
    var infosDiv = document.getElementById("Displayer_Infos")
    infosDiv.classList.remove("hidden", "animate__bounceOutUp")
    infosDiv.classList.add('animate__bounceInDown')
  }
})
