"use strict";

var Client = require("azure-iothub").Client;
var Message = require("azure-iot-common").Message;
var uuid = require("uuid");

var connectionString =
  "HostName=OcteHub2.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=HGuD4HJJ2dAHX9INppxyO6wXemn4PDRqA0G+ClL5NkU=";

exports.SendMessage = (req, res) => {
  var targetDeviceToFront = req.body.targetDevice;
  var targetDevice = targetDeviceToFront;
  if (!connectionString) {
    console.log(
      "Please set the IOTHUB_CONNECTION_STRING environment variable."
    );
  }

  if (!targetDevice) {
    console.log(
      "Please give pass a target device id as argument to the script"
    );
  }

  var client = Client.fromConnectionString(connectionString);

  client.open(function (err) {
    if (err) {
      console.error("Could not connect: " + err.message);
    } else {
      console.log("Client connected");

      var message = new Message(
        JSON.stringify({
          messageId: 0,
          deviceId: req.body.targetDevice,
          message: req.body.message,
        })
      );

      message.properties.add("command", req.body.properties.command);
      message.properties.add("param", req.body.properties.param);
      message.properties.add("value", req.body.properties.value);
      message.ack = "full";
      message.messageId = uuid.v4();

      console.log("Sending message: " + message.getData());
      client.send(targetDevice, message, function (err) {
        if (err) {
          console.error(err.toString());
        } else {
          //console.log(targetDeviceToFront);
          console.log("Sent CloudToDevice message : " + targetDevice);
          return res.status(200).send(message.properties);
        }
      });
    }
  });
};
