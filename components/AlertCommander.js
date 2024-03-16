class AlertCommander {
  constructor (style,Tools) {
    this.style = style;
    this.alerts= {
      displayed: false,
      buffer: []
    };
    this.event = ["warning", "error", "information", "info", "success"];
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
      },
      {
        event: "info",
        icon: "modules/EXT-Alert/resources/information.gif",
        timer: 5000,
        sound: null
      },
      {
        event: "success",
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
    
    if (this.event.indexOf(info.type) < 0) {
      logALERT("debug information:", info.type);
      return this.Alert("warning", { message: "Alert Core: unkonw type!" });
    }

    alertObject.type = this.types.find((type) => type.event === info.type);

    if (!info.message) { // should not happen
      logALERT("debug information:", info);
      return this.Alert("warning", { message: "Alert Core: No message!" });
    }
    if (!alertObject.type) {
      logALERT("debug information:", alertObject);
      return this.Alert("warning", { message: "Alert Core: Display Type Error!" });
    }

    this.alerts.buffer.push(alertObject);
    logALERT("Buffer Add:", alertObject);
    this.AlertBuffer(this.alerts.buffer[0]);
  }

  /** Informations Display with translate from buffer **/
  AlertBuffer (alert) {
    if (this.alerts.displayed || !this.alerts.buffer.length) return;
    let timer = alert.info.timer ? alert.info.timer : alert.type.timer;

    // define timer limit...
    if (timer < 3000) timer = 3000;
    if (timer > 30000) timer = 30000;
    switch (this.style) {
      case 0:
        this.CssAlert(alert, timer);
        break;
      case 1:
        this.SweetAlert(alert,timer);
        break;
      case 2:
        this.AlertifyAlert(alert, timer);
        break;
    }
  }

  CssAlert (alert,timer) {
    this.playAlert(alert);
    var Logo = document.getElementById("EXT-Alert-Icon");
    var Message = document.getElementById("EXT-Alert-Message");
    var Sender = document.getElementById("EXT-Alert-Sender");
    Logo.src = alert.info.icon ? alert.info.icon : alert.type.icon;
    Message.innerHTML = this.translate(alert.info.message, { VALUES: alert.info.values });
    Sender.textContent = alert.info.sender ? alert.info.sender : "EXT-Alert";
    this.CssAlertShow();
    this.warningTimeout = setTimeout(() => {
      this.CssAlertHide();
    }, timer);
  }

  CssAlertShow () {
    this.alerts.displayed=true;
    var Alert = document.getElementById("EXT-Alert");
    removeAnimateCSS("EXT-Alert", "bounceOutUp");
    Alert.classList.remove("hidden");
    addAnimateCSS("EXT-Alert", "bounceInDown", 1);
  }

  CssAlertHide () {
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
    logALERT("Buffer deleted:", this.alerts.buffer[0]);
    this.alerts.buffer.shift();
    this.alerts.displayed=false;
    if(this.alerts.buffer.length) this.AlertBuffer(this.alerts.buffer[0]);
    else logALERT("Buffer is now empty!");
  }

  playAlert (alert) {
    if (alert.info.sound === "none") return;
    if (alert.type.sound || alert.info.sound) this.sound.src = `${alert.info.sound ? alert.info.sound : alert.type.sound}?seed=${Date.now}`;
  }

  SweetAlert (alert,timer) {
    let options = {
      html: alert.info.message,
      footer: alert.info.sender ? alert.info.sender : "EXT-Alert",
      icon: alert.info.type === "information" ? "info": alert.info.type,
      timer: timer,
      showConfirmButton: false,
      timerProgressBar: true,
      background: "rgba(33,33,33,.95)",
      color:"#ffffff",
      toast: true,
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
      width: "100%",
      position: "top",
      willOpen: () => { this.alerts.displayed=true; },
      didOpen: () => { this.playAlert(alert); }
    };
    if (alert.info.type === "error") {
      options.iconColor = "#db3236";
      options.toast = false;
      options.backdrop = true;
      options.width = "32em";
      options.position = "center";
      options.title = this.translate("AlertError");
      options.imageUrl = alert.info.icon || undefined;
      options.imageWidth = 100;
      options.customClass.timerProgressBar = "AlertProgressColorError";
    }
    if (alert.info.type === "warning") {
      options.iconColor = "#FFA500";
      options.customClass.timerProgressBar = "AlertProgressColorWarning";
    }
    Swal.fire(options).then(() => this.AlertShift());
  }

  AlertifyAlert (alert, timer) {
    let message = `${alert.info.sender ? alert.info.sender : "EXT-Alert"}: ${alert.info.message}`;
    alertify.set("notifier","delay", timer/1000);
    alertify.set("notifier","position", "top-left");
    if (alert.info.type === "error") alertify.error(message);
    if (alert.info.type === "information") alertify.success(message);
    if (alert.info.type === "warning") alertify.warning(message);
    this.alerts.displayed=true;
    this.playAlert(alert);
    this.AlertShift();
  }
}
