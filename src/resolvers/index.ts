import Pigpio from "pigpio";
const Gpio = Pigpio.Gpio;

const resolvers = {
  Query: {
    DHT: async (root: any, args: any) => {
      const { pin } = await args;
      // const res = await dht.read(11, pin);
      const temperature = (Math.random() * 100).toFixed(2);
      const humidity = (Math.random() * 100).toFixed(2);
      return { temperature, humidity, pin: pin };
    },

    ultrasonic: async (root: any, args: any) => {
      const { echo, trigger } = await args;
      const MICROSECDONDS_PER_CM = 1e6 / 34321;
      const trgr = new Gpio(trigger, { mode: Gpio.OUTPUT });
      const ech = new Gpio(echo, { mode: Gpio.INPUT, alert: true });

      trgr.digitalWrite(0);

      const watchHCSR04 = () => {
        let startTick: number;

        ech.on("alert", (level, tick) => {
          console.log(level, tick);
          if (level == 1) {
            startTick = tick;
          } else {
            const endTick = tick;
            const diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
            console.log(diff / 2 / MICROSECDONDS_PER_CM);
          }
        });
      };

      watchHCSR04();

      setInterval(() => {
        trgr.trigger(10, 1); // Set trigger high for 10 microseconds
      }, 1000);

      return { distance: 0 };
    },
  },

  Mutation: {
    digital: async (root: any, args: any) => {
      const { state, pin } = await args;
      const led = new Gpio(pin, { mode: Gpio.OUTPUT });
      led.digitalWrite(state);
      console.log(`Actived led on GPIO ${pin}`);
      return args;
    },
    modular: async (root: any, args: any) => {
      const { state, pin } = await args;
      const led = new Gpio(pin, { mode: Gpio.OUTPUT });
      led.pwmWrite(state);
      console.log(`Actived led on GPIO ${pin}`);
      return args;
    },
    servo: async (root: any, args: any) => {
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

export default resolvers;
