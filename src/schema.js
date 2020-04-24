const { gql } = require("apollo-server");

const typeDefs = gql`
  type User {
    id: ID!
    name: String
    email: String
    password: String
    avatar: String
    token: String
    createdAt: String
  }

  type Task {
    id: ID!
    userId: String
    sender: String
    name: String
    description: String
    done: Boolean
    notificationId: String
    createdAt: String
  }

  type Subscription {
    taskAdded(userId: ID!): [Task]
  }

  type Query {
    users: [User]
    tasks(userId: ID!): [Task]
  }

  type Login {
    user: User
  }

  type Verification {
    user: User
    token: String
  }

  type DeleteTask {
    message: String
  }

  type Mutation {
    register(
      name: String
      email: String
      password: String
      avatar: String
    ): Login
    login(email: String, password: String): Login
    verification(code: String): Verification
    createTask(
      userId: String
      name: String
      description: String
      notificationId: String
    ): Task
    deleteTask(id: ID!, userId: String!): DeleteTask
    doneTask(id: ID!, userId: String!): Task
    sendTask(
      userId: ID!
      email: String
      name: String
      description: String
      notificationId: String
    ): Task
  }
`;

module.exports = typeDefs;
