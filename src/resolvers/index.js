const { UserInputError, PubSub, withFilter } = require("apollo-server");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Task = require("../models/task");
const Code = require("../models/code");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const transporter = require("../services/email");
require("dotenv").config();

const generateToken = (params) => {
  return jwt.sign(params, process.env.APPKEY, {
    expiresIn: 86400,
  });
};

const pubsub = new PubSub();

const TASK_ADDED = "TASK_ADDED";

const resolvers = {
  Subscription: {
    taskAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([TASK_ADDED]),
        (payload, variables) => {
          return variables.userId === payload.userId;
        }
      ),
    },
  },
  Query: {
    users: async () => await User.find(),
    tasks: async (root, args) => {
      const tasks = await Task.find({ userId: args.userId });
      pubsub.publish(TASK_ADDED, { taskAdded: tasks, userId: args.userId });
      return tasks;
    },
  },
  Mutation: {
    register: async (root, args) => {
      const { name, email, password, avatar } = await args;
      if (await User.findOne({ email })) {
        throw new UserInputError("This email is already registered.", {
          invalidArgs: Object.keys(args),
        });
      }
      const hash = await bcrypt.hash(password, 10);
      const newUser = { name, email, avatar, password: hash };
      const user = await User.create(newUser);

      const code = crypto.randomBytes(2).toString("hex").toUpperCase();

      await Code.create({ userId: user.id, code });

      const mailOptions = {
        from: "services.apolloapp@gmail.com", // endereço do remetente
        to: email, // lista de destinatários
        subject: "Apollo code", // Linha de assunto
        html: `<p> ${code} </p> `, // corpo de texto sem formatação
      };

      transporter.sendMail(mailOptions, function (err, info) {
        if (err) console.log(err);
      });

      return { user, token: generateToken({ id: user.id }) };
    },

    login: async (root, args) => {
      const { email, password } = await args;
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        throw new UserInputError("User not found.", {
          invalidArgs: Object.keys(args),
        });
      }
      var match = await bcrypt.compare(password, user.password);
      if (!match) {
        throw new UserInputError("Invalid password.", {
          invalidArgs: Object.keys(args),
        });
      }

      const code = crypto.randomBytes(2).toString("hex").toUpperCase();

      await Code.create({ userId: user.id, code });

      const mailOptions = {
        from: "services.apolloapp@gmail.com", // endereço do remetente
        to: email, // lista de destinatários
        subject: "Apollo code", // Linha de assunto
        html: `<p> ${code} </p> `, // corpo de texto sem formatação
      };

      transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          console.log(err);
        }
      });

      user.password = undefined;
      return { user };
    },

    verification: async (root, args) => {
      const { code } = await args;

      const currentCode = await Code.findOne({ code: code });
      if (!currentCode) {
        throw new UserInputError("Invalid code.", {
          invalidArgs: Object.keys(args),
        });
      }

      const user = await User.findById(currentCode.userId);
      if (!user) {
        throw new UserInputError("User not found.", {
          invalidArgs: Object.keys(args),
        });
      }
      await currentCode.delete();
      return { user, token: generateToken({ id: user.id }) };
    },

    createTask: async (root, args) => {
      const { userId, name, description, notificationId } = await args;
      if (!userId) {
        throw new UserInputError("User not found.", {
          invalidArgs: Object.keys(args),
        });
      }
      if (!name) {
        throw new UserInputError("Name is required.", {
          invalidArgs: Object.keys(args),
        });
      }
      const task = await Task.create({
        userId,
        name,
        description,
        notificationId,
      });

      const tasks = await Task.find({ userId });
      pubsub.publish(TASK_ADDED, { taskAdded: tasks, userId });

      return task;
    },

    deleteTask: async (root, args) => {
      const { id, userId } = await args;
      if (!id) {
        throw new UserInputError("Task not found.", {
          invalidArgs: Object.keys(args),
        });
      }
      const task = await Task.findByIdAndDelete(id);

      const tasks = await Task.find({ userId: userId });
      pubsub.publish(TASK_ADDED, { taskAdded: tasks, userId });

      return { message: `"${task.name}" has been successfully deleted.` };
    },

    doneTask: async (root, args) => {
      const { id, userId } = await args;
      if (!id) {
        throw new UserInputError("Task not found.", {
          invalidArgs: Object.keys(args),
        });
      }
      const task = await Task.findById(id);
      if (task.done) {
        task.done = false;
      } else {
        task.done = true;
      }
      await task.save();

      const tasks = await Task.find({ userId: userId });
      pubsub.publish(TASK_ADDED, { taskAdded: tasks, userId });

      return task;
    },

    sendTask: async (root, args) => {
      const { email, userId, name, description, notificationId } = await args;

      if (!email) {
        throw new UserInputError("email is required.", {
          invalidArgs: Object.keys(args),
        });
      }

      if (!name) {
        throw new UserInputError("name is required.", {
          invalidArgs: Object.keys(args),
        });
      }

      if (!description) {
        throw new UserInputError("description is required.", {
          invalidArgs: Object.keys(args),
        });
      }

      const senderUser = await User.findById(userId);
      const toUser = await User.findOne({ email });

      if (!toUser) {
        throw new UserInputError("Email user not found.", {
          invalidArgs: Object.keys(args),
        });
      }

      const task = await Task.create({
        sender: userId,
        userId: toUser.id,
        name,
        description,
        notificationId,
      });

      const tasks = await Task.find({ userId: toUser.id });
      pubsub.publish(TASK_ADDED, { taskAdded: tasks, userId: toUser.id });

      const mailOptions = {
        from: "services.apolloapp@gmail.com", // endereço do remetente
        to: email, // lista de destinatários
        subject: `Task recebida!`, // Linha de assunto
        html: `<p> ${senderUser.name} enviou uma task para você! Abra o app e confira. </p> `, // corpo de texto sem formatação
      };

      transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          console.log(err);
        }
      });

      return task;
    },
  },
};

module.exports = resolvers;
