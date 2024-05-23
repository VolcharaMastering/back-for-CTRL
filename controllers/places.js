import NotFound from "../errors/notFound.js";
import IncorrectData from "../errors/requestError.js";
import ServerError from "../errors/serverError.js";
import Place from "../models/Place.js";
import { OK_CODE, CODE_CREATED } from "../states/states.js";

const validatePlace = (req, res, next) => {
  const { name, latitude, longitude } = req.body;
  try {
    if (!name || !latitude || !longitude) {
      next(IncorrectData("Name, latitude and longitude are required"));
      return;
    }
  } catch {
    if (
      e.name === "ValidatorError" ||
      e.latitude === "ValidatorError" ||
      e.longitude === "ValidatorError"
    ) {
      next(IncorrectData("Validation error"));
      return;
    }
  }
  next(ServerError("Some bugs on server"));
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
  try {
    const place = await Place.findById(id);
    if (!place) {
      next(NotFound("No such place"));
      return;
    }
  } catch (e) {
    next(ServerError("Some bugs on server"));
  }
};

const searchPlace = async (req, res, next) => {
  const { placeName } = req.query; 
  try {
    const place = await Place.findOne({ placeName });
    if (!place) {
      next(NotFound("No such place"));
      return;
    }
    res.status(OK_CODE).send(place);
  } catch (e) {
    next(ServerError("Some bugs on server"));
  }
}

export { validatePlace, getPlaces, deletePlace, searchPlace };
