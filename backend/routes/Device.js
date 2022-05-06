var Registry = require("azure-iothub").Registry;
var uuid = require("uuid");
// Copy/paste your connection string and hub name here
var connectionString =
  "HostName=OcteHub2.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=HGuD4HJJ2dAHX9INppxyO6wXemn4PDRqA0G+ClL5NkU=";

var registry = Registry.fromConnectionString(connectionString);
var hubName = "OcteHub2.azure-devices.net";

exports.newDevice = (req, res) => {
  var device = {
    deviceId: req.body.deviceId,
  };

  // Create a new device
  registry.create(device, function (err) {
    registry.get(device.deviceId, function (err, deviceInfo) {
      console.log(deviceInfo);
      //return res.status(200).send(deviceInfo.authentication.symmetricKey.primaryKey);
      var ConnectionKey =
        "HostName=" +
        hubName +
        ";" +
        "DeviceId=" +
        device.deviceId +
        ";" +
        "SharedAccessKey=" +
        deviceInfo.authentication.symmetricKey.primaryKey;
      return res.status(200).send(ConnectionKey);
    });
  });
};
