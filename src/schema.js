const { gql } = require("apollo-server");

const typeDefs = gql`
  type Digital {
    state: Int
    pin: Int
  }

  type DHT {
    temperature: Float
    humidity: Float
    pin: Int
  }

  type Ultrasonic {
    distance: Int
  }

  type Servo {
    state: Int
    pin: Int
  }

  type Query {
    digital: Digital
    DHT(pin: Int): DHT
    ultrasonic(echo: Int, trigger: int): Ultrasonic
  }

  type Mutation {
    digital(state: Int, pin: Int): Digital
    modular(state: Int, pin: Int): Digital
    servo(state: Int, pin: Int): Servo
  }
`;

module.exports = typeDefs;
