const { UserInputError, PubSub, withFilter } = require("apollo-server");
const Gpio = require("pigpio").Gpio;

const resolvers = {
  Mutation: {
    turnOnOff: async (root, args) => {
      const { state, pin } = await args;
      const led = new Gpio(pin, { mode: Gpio.OUTPUT });
      led.digitalWrite(state);
      console.log(`Actived led on GPIO ${pin}`);
      return args;
    },
  },
};

module.exports = resolvers;
