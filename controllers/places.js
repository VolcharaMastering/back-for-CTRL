import Place from "../models/Place.js";
import NotFound from "../errors/notFound.js";
import IncorrectData from "../errors/requestError.js";
import ConflictError from "../errors/conflictError.js";
import ServerError from "../errors/serverError.js";
import { OK_CODE, CODE_CREATED } from "../states/states.js";

const addPlace = async (req, res, next) => {
  const { placeName, latitude, longitude } = req.body;
  if (!placeName || !latitude || !longitude) {
    return next(IncorrectData("Name, latitude and longitude are required"));
  }
  try {
    const place = await Place.create({ placeName, latitude, longitude });
    res.status(CODE_CREATED).send({ data: place });
  } catch (e) {
    if (e.code === 11000) {
      next(ConflictError("Such place with this name is already exists"));
      return;
    }
    next(ServerError("Some bugs on server"));
  }
};

const getPlaces = async (req, res, next) => {
  try {
    const places = await Place.find({});
    if (!places) {
      next(NotFound("There is no places in database"));
      return;
    }
    res.status(OK_CODE).send(places);
  } catch (e) {
    next(ServerError("Some bugs on server"));
  }
};

const deletePlace = async (req, res, next) => {
  const { id } = req.params;
  // const userId = req.user._id;
  try {
    const place = await Place.findById(id);
    if (!place) {
      next(NotFound("No such place"));
      return;
    }
    const deletedPlace = await Place.findByIdAndDelete(id);
    if (!deletedPlace) {
      next(NotFound("No such place"));
      return;
    }
    res.status(OK_CODE).send(deletedPlace);
  } catch (e) {
    next(ServerError("Some bugs on server"));
  }
};

const searchPlace = async (req, res, next) => {
  const { query } = req.query;
  try {
    ///---Finding of all places by keyword "query" with $options: 'i' - ignore register----///
    const place = await Place.find({ placeName: { $regex: query, $options: "i" } });
    if (!place) {
      next(NotFound("No such place"));
      return;
    }
    res.status(OK_CODE).send(place);
  } catch (e) {
    next(ServerError("Some bugs on server"));
  }
};

export { addPlace, getPlaces, deletePlace, searchPlace };
