class AlertCommander {
  constructor (style,Tools) {
    this.style = style;
    this.alerts= {
      displayed: false,
      buffer: []
    };
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
    ];
    this.sound= new Audio();
    this.sound.autoplay= true;
    this.translate = (...args) => Tools.translate(...args);
    console.log("[ALERT] AlertCommander Ready");
  }

  Alert (info) {
    var alertObject = {
      type: null,
      info: info
    };
    
    this.types.forEach((type) => {
      if (type.event === info.type) alertObject.type = type;
    });

    if (!info.message) { // should not happen
      logALERT("debug information:", info);
      return this.Alert("warning", { message: "Alert Core: No message!" });
    }
    if (!alertObject.type) {
      logALERT("debug information:", alertObject);
      return this.Alert("warning", { message: "Alert Core: Display Type Error!" });
    }

    this.alerts.buffer.push(alertObject);
    logALERT("Buffer Add:", this.alerts);
    //this.AlertBuffer(this.alerts.buffer[0].type, this.alerts.buffer[0].info);
    this.AlertBuffer(this.alerts.buffer[0]);
    console.log("!!!!!", this.alerts.buffer[0]);
  }

  /** Informations Display with translate from buffer **/
  AlertBuffer (alert) { //type, message) {
    if (this.alerts.displayed || !this.alerts.buffer.length) return;
    let timer = alert.info.timer ? alert.info.timer : alert.type.timer;

    // define timer limit...
    if (timer < 3000) timer = 3000;
    if (timer > 30000) timer = 30000;
    switch (this.style) {
      case 0:
        this.AlertLogo(alert);
        this.AlertInformations(alert.info);
        this.AlertShow();
        this.warningTimeout = setTimeout(() => {
          this.AlertHide();
        }, timer);
        break;
      case 1:
        this.SweetAlert(alert,timer);
        break;
    }
  }

  AlertInformations (message) {
    var Message = document.getElementById("EXT-Alert-Message");
    var Sender = document.getElementById("EXT-Alert-Sender");
    Message.innerHTML = this.translate(message.message, { VALUES: message.values });
    Sender.textContent = message.sender ? message.sender : "EXT-Alert";
  }

  AlertLogo (alert) { //type, info) {
    this.playAlert(alert);
    var Logo = document.getElementById("EXT-Alert-Icon");
    Logo.src = alert.info.icon ? alert.info.icon : alert.type.icon;
  }

  AlertShow () {
    this.alerts.displayed=true;
    var Alert = document.getElementById("EXT-Alert");
    removeAnimateCSS("EXT-Alert", "bounceOutUp");
    Alert.classList.remove("hidden");
    addAnimateCSS("EXT-Alert", "bounceInDown", 1);
  }

  AlertHide () {
    var Alert = document.getElementById("EXT-Alert");
    removeAnimateCSS("EXT-Alert", "bounceInDown");
    addAnimateCSS("EXT-Alert", "bounceOutUp", 1);
    setTimeout(() => {
      Alert.classList.add("hidden");
      removeAnimateCSS("EXT-Alert", "bounceOutUp");
      this.AlertInformations("");
      this.AlertShift();
    },1000);
  }

  AlertShift () {
    this.alerts.buffer.shift();
    this.alerts.displayed=false;
    logALERT("Buffer deleted", this.alerts);
    if(this.alerts.buffer.length) this.AlertBuffer(this.alerts.buffer[0]);
    else logALERT("Buffer is now empty!");
  }

  SweetAlert (alert,timer) {
    Swal.fire({
      title: alert.info.type === "error" ? alert.info.type: undefined,
      html: alert.info.message,
      footer: alert.info.sender ? alert.info.sender : "EXT-Alert",
      icon: alert.info.type === "information" ? "info": alert.info.type,
      imageUrl: alert.info.type === "error" ? alert.info.icon : undefined,
      imageWidth: 100,
      timer: timer,
      showConfirmButton: false,
      timerProgressBar: true,
      backdrop: false,
      background: "rgba(33,33,33,.95)",
      color:"#ffffff",
      showClass: {
        popup: `
          animate__animated
          animate__fadeInDown
          animate__faster
        `
      },
      hideClass: {
        popup: `
          animate__animated
          animate__zoomOutUp
          animate__faster
        `
      },
      customClass: {
        timerProgressBar: "AlertProgressColor",
        footer: "AlertFooterColor"
      },
      toast: alert.info.type === "error" ? false : true,
      width: alert.info.type === "error" ?  "32em" : "100%",
      position: alert.info.type === "error" ?  "center" : "top"
    });
    this.alerts.displayed=true;
    this.playAlert(alert);
    this.warningTimeout = setTimeout(() => {
      this.AlertShift();
    },timer);
  }

  playAlert (alert) {
    if (alert.info.sound === "none") return;
    if (alert.type.sound || alert.info.sound) this.sound.src = `${alert.info.sound ? alert.info.sound : alert.type.sound}?seed=${Date.now}`;
  }
}
