#! /usr/bin/env node

const { ApolloServer } = require("apollo-server");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const IP = require("ip");
require("dotenv").config();

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`⚡  Server running...`);
  console.log(`➡️  ${IP.address()} `);
});
