const sensor = require('node-dht-sensor');

const DHT = 11;
const SENSOR_PIN = 4;

module.exports.readTemp = () => {
    const sensorResult = sensor.read(DHT, SENSOR_PIN);
    return { value : `${sensorResult.temperature.toFixed(2)} `, uom : '°C'};
}

module.exports.readHumidity = () => {
    const sensorResult = sensor.read(DHT, SENSOR_PIN);
    return { value : `${sensorResult.humidity.toFixed(2)} `, uom : '%'};    
}