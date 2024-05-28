/**
* @module Controllers
* @file User controllers. Controllers for registering, logging in, and getting information about users.
* @exports getUsers
* @exports login
* @exports aboutMe
* @exports createUser
* @exports updateUser
*/
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AuthError from "../errors/authError.js";
import ConflictError from "../errors/conflictError.js";
import NotFound from "../errors/notFound.js";
import IncorrectData from "../errors/requestError.js";
import ServerError from "../errors/serverError.js";
import User from "../models/User.js";

import { OK_CODE, CODE_CREATED } from "../states/states.js";

/**
 * Retrieves all users from the database and sends them as a response.
 * @return {Promise<void>} - Returns a promise that resolves when the response is sent.
 * @throws {NotFound} - Throws a NotFound error if there are no users in the database.
 * @throws {ServerError} - Throws a ServerError if there is a server error.
 */
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    if (!users) {
      next(NotFound("There is no users"));
      return;
    }
    res.status(OK_CODE).send(users);
  } catch (e) {
    next(ServerError("Some bugs on server"));
  }
};

/**
 * Authenticates a user by checking their email and password against the database.
 * @throws {AuthError} - Throws an AuthError if the login or password is invalid.
 */
const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      next(AuthError("Invalid login or password"));
      return;
    }
    const validUser = await bcrypt.compare(password, user.password);
    if (!validUser) {
      next(AuthError("Invalid login or password"));
      return;
    }
    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.NODE_ENV === "production" ? process.env.JWT_SECRET : "dev-secret"
    );
    res.status(OK_CODE).send({ data: user, token });
  } catch (e) {
    next(ServerError("Some bugs on server"));
  }
};

/**
 * Retrieves information about the authenticated user.
 */
const aboutMe = async (req, res, next) => {
  const myId = req.user._id;
  try {
    const me = await User.findById(myId);
    if (!me) {
      next(NotFound("No such user"));
      return;
    }
    res.status(OK_CODE).send(me);
  } catch (e) {
    next(ServerError("Some bugs on server"));
  }
};

/**
 * Creates a new user with the provided email, password, and name.
 *
 * @throws {ConflictError} - If a user with the same email already exists.
 * @throws {IncorrectData} - If there is a validation error with the user data.
 */
const createUser = async (req, res, next) => {
  const { email, password, username } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await new User({
      email,
      password: hashedPassword,
      username,
    }).save();
    res.status(CODE_CREATED).send({ data: user });
  } catch (e) {
    if (e.code === 11000) {
      next(ConflictError("User with this email already exists"));
      return;
    }
    if (e.name === "ValidatorError") {
      next(IncorrectData("Validation error"));
      return;
    }

    next(ServerError("Some bugs on server"));
  }
};

/**
 * Updates a user's information in the database.
 *
 * @throws {ConflictError} - Throws a ConflictError if a user with the same email already exists.
 * @throws {IncorrectData} - Throws an IncorrectData error if the user's data is invalid.
 */
const updateUser = (req, res, next) => {
  const { email, username } = req.body;
  User.findByIdAndUpdate(req.user._id, { email, username }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(NotFound("No such user"));
        return;
      }
      res.send(user);
    })
    .catch((e) => {
      if (e.code === 11000) {
        next(ConflictError("User with this email already exists"));
        return;
      }
      if (e.name === "ValidationError") {
        next(IncorrectData("Invalid data"));
        return;
      }
      next(ServerError("Some bugs on server"));
    });
};

export { getUsers, login, aboutMe, createUser, updateUser };
