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

  type Query {
    digital: Digital
    sensorDHT(pin: String): DHT
  }

  type Mutation {
    digital(state: Int, pin: Int): Digital
    modular(state: Int, pin: Int): Digital
  }
`;

module.exports = typeDefs;
