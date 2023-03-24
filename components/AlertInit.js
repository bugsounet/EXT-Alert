class AlertConfig {
  constructor (that) {
    if (that.config.debug) logALERT = (...args) => { console.log("[ALERT]", ...args) }
    that.ready = false
    that.AlertDisplay = new AlertDisplay()
    that.AlertDisplay.prepareAlertPopup() // better place for create main popup quickly !
    that.AlertCommander = new AlertCommander(that)

    //check ignore modules array (prevent crash)
    if (!Array.isArray(that.config.ignore)) {
      let tmp = that.config.ignore
      that.config.ignore = []
      if (tmp) that.config.ignore.push(tmp)
    }
    console.log("[ALERT] AlertConfig Ready")
  }
}
