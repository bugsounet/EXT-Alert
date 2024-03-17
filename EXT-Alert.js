/**
 ** Module : EXT-Alert
 ** @bugsounet
 ** ©03-2024
 ** support: https://forum.bugsounet.fr
 **/

var logALERT = (...args) => { /* do nothing */ };

Module.register("EXT-Alert", {
  requiresVersion: "2.25.0",

  defaults: {
    debug: false,
    style: 1,
    ignore: []
  },

  start () {
    if (this.config.debug) logALERT = (...args) => { console.log("[ALERT]", ...args); };
    this.AlertDisplay = new AlertDisplay();
    this.AlertDisplay.prepareAlertPopup(); // better place for create main popup quickly !
    const Tools = {
      translate: (...args) => this.translate(...args)
    };
    if (isNaN(this.config.style) || this.config.style > 2 || this.config.style < 0) this.config.style = 0;
    this.AlertCommander = new AlertCommander(this.config.style,Tools);

    //check ignore modules array (prevent crash)
    if (!Array.isArray(this.config.ignore)) {
      let tmp = this.config.ignore;
      this.config.ignore = [];
      if (tmp) this.config.ignore.push(tmp);
    }
  },

  getScripts () {
    let Scripts = [
      "/modules/EXT-Alert/components/AlertCommander.js",
      "/modules/EXT-Alert/components/AlertDisplay.js"
    ];
    if (this.config.style === 1) Scripts.push("/modules/EXT-Alert/node_modules/sweetalert2/dist/sweetalert2.all.min.js");
    if (this.config.style === 2) Scripts.push("/modules/EXT-Alert/node_modules/alertifyjs/build/alertify.min.js");
    return Scripts;
  },

  getStyles () {
    let Style = [ "EXT-Alert.css" ];
    if (this.config.style === 2) {
      Style.push("/modules/EXT-Alert/node_modules/alertifyjs/build/css/alertify.min.css");
      Style.push("/modules/EXT-Alert/node_modules/alertifyjs/build/css/themes/default.min.css");
    }
    return Style;
  },

  getDom () {
    var dom = document.createElement("div");
    dom.style.display = "none";
    return dom;
  },

  getTranslations () {
    return {
      en: "translations/en.json",
      fr: "translations/fr.json"
    };
  },

  notificationReceived (noti, payload, sender) {
    switch(noti) {
      case "GA_READY":
        if (sender.name === "MMM-GoogleAssistant") {
          this.sendSocketNotification("INIT", this.config);
          this.sendNotification("EXT_HELLO", this.name);
        }
        break;
      case "EXT_ALERT": // can be used all time (for GW starting error)
        if (this.config.ignore.indexOf(sender.name) >= 0) return;
        if (sender.name === "MMM-GoogleAssistant" || sender.name.startsWith("EXT")) {
          if (!payload) return this.AlertCommander.Alert("error", { message: `Alert error by:${sender}` } );
          this.AlertCommander.Alert({
            type: payload.type ? payload.type : "error",
            message: payload.message ? payload.message : "Unknow message",
            timer: payload.timer ? payload.timer : null,
            sender: payload.sender ? payload.sender : sender.name,
            icon: payload.icon ? payload.icon: null,
            sound: payload.sound ? payload.sound: null
          });
        }
        break;
    }
  }
});
