"use strict"

var NodeHelper = require("node_helper")
var logNOTI = (...args) => { /* do nothing */ }

module.exports = NodeHelper.create({
  start: function () {
    
  },

  socketNotificationReceived: function (noti, payload) {
    switch (noti) {
      case "INIT":
        console.log("[NOTI] MMM-Notification Version:", require('./package.json').version, "rev:", require('./package.json').rev)
        this.initialize(payload)
      break
    }
  },

  initialize: async function (config) {
    this.config = config
    if (this.config.debug) logNOTI = (...args) => { console.log("[NOTI]", ...args) }

    let Version = {
      version: require('./package.json').version,
      rev: require('./package.json').rev
    }
  },

  DisplayError: function (err, error, details = null) {
    if (details) console.log("[NOTI][ERROR]" + err, details.message, details)
    else console.log("[NOTI][ERROR]" + err)
    return this.sendSocketNotification("NOT_INITIALIZED", { message: error.message, values: error.values })
  },

})
