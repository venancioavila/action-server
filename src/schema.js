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
    digital(state: Int, pin: Int): Digital
    modular(state: Int, pin: Int): Digital
  }
`;

module.exports = typeDefs;
