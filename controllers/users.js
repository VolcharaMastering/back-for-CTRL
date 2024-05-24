import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AuthError from '../errors/authError.js';
import ConflictError from '../errors/conflictError.js';
import NotFound from '../errors/notFound.js';
import IncorrectData from '../errors/requestError.js';
import ServerError from '../errors/serverError.js';
import User from '../models/User.js';

import { OK_CODE, CODE_CREATED } from '../states/states.js';

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    if (!users) {
      next(NotFound('There is no users'));
      return;
    }
    res.status(OK_CODE).send(users);
  } catch (e) {
    next(ServerError('Some bugs on server'));
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      next(AuthError('Invalid login or password'));
      return;
    }
    const validUser = await bcrypt.compare(password, user.password);
    if (!validUser) {
      next(AuthError('Invalid login or password'));
      return;
    }
    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev-secret',
    );
    res.status(OK_CODE).send({ data: user, token });
  } catch (e) {
    next(ServerError('Some bugs on server'));
  }
};

const aboutMe = async (req, res, next) => {
  const myId = req.user._id;
  try {
    const me = await User.findById(myId);
    if (!me) {
      next(NotFound('No such user'));
      return;
    }
    res.status(OK_CODE).send(me);
  } catch (e) {
    next(ServerError('Some bugs on server'));
  }
};

const createUser = async (req, res, next) => {
  const { email, password, name } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await new User({
      email,
      password: hashedPassword,
      name,
    }).save();
    res.status(CODE_CREATED).send({ data: user });
  } catch (e) {
    if (e.code === 11000) {
      next(ConflictError('User with this email already exists'));
      return;
    }
    if (e.name === 'ValidatorError') {
      next(IncorrectData('Validation error'));
      return;
    }

    next(ServerError('Some bugs on server'));
  }
};

const updateUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(NotFound('No such user'));
        return;
      }
      res.send(user);
    })
    .catch((e) => {
      if (e.code === 11000) {
        next(ConflictError('User with this email already exists'));
        return;
      }
      if (e.name === 'ValidationError') {
        next(IncorrectData('Invalid data'));
        return;
      }
      next(ServerError('Some bugs on server'));
    });
};

export {
  getUsers, login, aboutMe, createUser, updateUser,
};
