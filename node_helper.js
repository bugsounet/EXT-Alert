"use strict";

var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
  socketNotificationReceived (noti, payload) {
    switch (noti) {
      case "INIT":
        console.log("[ALERT] EXT-Alert Version:", require("./package.json").version, "rev:", require("./package.json").rev);
        break;
    }
  }
});
