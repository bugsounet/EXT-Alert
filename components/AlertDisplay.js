class AlertDisplay {
  constructor () {
    console.log("[ALERT] AlertDisplay Ready")
  }

  /***************************/
  /** Information Displayer **/
  /***************************/

  prepareAlertPopup() {
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
  }
}
