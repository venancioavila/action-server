#! /usr/bin/env node

import { ApolloServer } from "apollo-server";
import typeDefs from "./schema";
import resolvers from "./resolvers";
import IP from "ip";
import dotenv from "dotenv"
dotenv.config();

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ 
    port: process.env.PORT || 4000 
}).then(({ url: string }) => {
    console.log("⚡  Server running...");
    console.log(`➡️  ${IP.address()} `);
});