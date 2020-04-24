const { gql } = require("apollo-server");

const typeDefs = gql`
  type Digital {
    state: Int
    pin: Int
  }

  type Query {
    digital: Digital
  }

  type Mutation {
    turnOnOff(state: Int, pin: Int): Digital
  }
`;

module.exports = typeDefs;
