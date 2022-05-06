const express = require("express");
const cors = require("cors");

const app = express();
const message = require("./routes/SendCloudToDeviceMessage");
const create = require("./routes/Device");
var connectionString =
  "HostName=OcteHub2.azure-devices.net;DeviceId=JordanDevice;SharedAccessKey=3dL/4w8tptDpQwa17Os1rMMrY/4Cvw10DS8zXJ1MdJs=";

var Mqtt = require("azure-iot-device-mqtt").Mqtt;
var DeviceClient = require("azure-iot-device").Client;

var client = DeviceClient.fromConnectionString(connectionString, Mqtt);

var corsOptions = {
  origin: "*",
};

// création du serveur
// autoriser les requêtes provenant de n'importe quel domaine
app.use(cors(corsOptions));

// analyser les requêtes de type de contenu - application/json
app.use(express.json());

// analyser les requêtes de type de contenu - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// définir le port, écouter les demandes
const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
  console.log(`Le server est lancé sur le port ${PORT}.`);
});

// route pour intercation avec AzureIotHub
// Ajouter un device
app.post("/infoDevice", create.newDevice);

app.post("/sendMessage/", message.SendMessage);

client.on("message", function (msg) {
  console.log("Body: " + JSON.stringify(msg));

  client.complete(msg, function (err) {
    if (err) {
      console.error("complete error: " + err.toString());
    } else {
      console.log("Completed C2D message with ID=" + msg.messageId);
      console.log(msg);
    }
  });
});
