class AlertCommander {
  constructor (that) {
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
    this.sound= new Audio()
    this.sound.autoplay= true
    this.translate= (...args) => { return that.translate(...args) }
    console.log("[ALERT] AlertCommander Ready")
  }

  Alert(info) {
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
  }

  /** Informations Display with translate from buffer **/
  AlertBuffer(type, message) {
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
  }

  AlertInformations(message) {
    var Message = document.getElementById("EXT-Alert-Message")
    var Sender = document.getElementById("EXT-Alert-Sender")
    Message.innerHTML = this.translate(message.message, { VALUES: message.values })
    Sender.textContent = message.sender ? message.sender : "EXT-Alert"
  }

  AlertLogo(type, info) {
    var Logo = document.getElementById("EXT-Alert-Icon")
    Logo.src = info.icon ? info.icon : type.icon
    if (info.sound == "none") return
    if (type.sound || info.sound) this.sound.src = (info.sound ? info.sound : type.sound) + "?seed="+Date.now
  }

  AlertShow() {
    this.alerts.displayed=true
    var Alert = document.getElementById("EXT-Alert")
    Alert.classList.remove("hidden", "animate__bounceOutUp")
    Alert.classList.add('animate__bounceInDown')
  }

  AlertHide() {
    var Alert = document.getElementById("EXT-Alert")
    Alert.classList.remove('animate__bounceInDown')
    Alert.classList.add("animate__bounceOutUp")
    Alert.addEventListener('animationend', (e) => {
      if (e.animationName == "bounceOutUp") {
        Alert.classList.add("hidden")
        this.AlertInformations("")
        this.AlertShift()
      }
    }, {once: true})
  }

  AlertShift() {
      this.alerts.buffer.shift()
      this.alerts.displayed=false
      logALERT("Buffer deleted", this.alerts)
      if(this.alerts.buffer.length) this.AlertBuffer(this.alerts.buffer[0].type, this.alerts.buffer[0].info)
      else logALERT("Buffer is now empty!")
  }
}
