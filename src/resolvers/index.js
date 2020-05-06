const { UserInputError, PubSub, withFilter } = require("apollo-server");
const Gpio = require("pigpio").Gpio;
const dht = require("node-dht-sensor");

const resolvers = {
  Query: {
    DHT: async (root, args) => {
      const { pin } = await args;
      // const res = await dht.read(11, pin);
      const temperature = (Math.random() * 100).toFixed(2);
      const humidity = (Math.random() * 100).toFixed(2);
      return { temperature, humidity, pin: pin };
    },
  },

  Mutation: {
    digital: async (root, args) => {
      const { state, pin } = await args;
      const led = new Gpio(pin, { mode: Gpio.OUTPUT });
      led.digitalWrite(state);
      console.log(`Actived led on GPIO ${pin}`);
      return args;
    },
    modular: async (root, args) => {
      const { state, pin } = await args;
      const led = new Gpio(pin, { mode: Gpio.OUTPUT });
      led.pwmWrite(state);
      console.log(`Actived led on GPIO ${pin}`);
      return args;
    },
    servo: async (root, args) => {
      const { state, pin } = await args;
      const servo = new Gpio(pin, {
        mode: Gpio.OUTPUT,
      });
      servo.servoWrite(state);
      console.log(`Servo run ${pin}`);
      return args;
    },
  },
};

module.exports = resolvers;
