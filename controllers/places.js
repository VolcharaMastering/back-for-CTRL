/**
 * @module Controllers
 * @file Place controllers. Controllers for adding, getting, deleting, and searching of places.
 * @exports addPlace
 * @exports getPlaces
 * @exports deletePlace
 * @exports searchPlace
 */
import Place from "../models/Place.js";
import NotFound from "../errors/notFound.js";
import IncorrectData from "../errors/requestError.js";
import ConflictError from "../errors/conflictError.js";
import ServerError from "../errors/serverError.js";
import { OK_CODE, CODE_CREATED } from "../states/states.js";
import Review from "../models/Review.js";

/**
 * @name addPlace. Adds a new place to the database.
 * @async
 * @function
 * @description Adds a new place to the database.
 * @returns {Object|Function} - The created place object or the next function.
 * @throws {IncorrectData} - If the place name, latitude, or longitude is missing.
 * @throws {ConflictError} - If a place with the same name already exists.
 * @throws {ServerError} - If there is a server error.
 */
const addPlace = async (req, res, next) => {
  const { placeName, lat, lng } = req.body;
  if (!placeName || !lat || !lng) {
    return next(IncorrectData("Name, latitude and longitude are required"));
  }
  try {
    const place = await Place.create({ placeName, lat, lng });
    res.status(CODE_CREATED).send({ data: place });
  } catch (e) {
    if (e.code === 11000) {
      next(ConflictError("Such place with this name is already exists"));
      return;
    }
    next(ServerError("Some bugs on server"));
  }
};

/**
 * @name getPlaces. Gets all places from the database.
 * @async
 * @function
 * @description Fetches all places from the database.
 * @returns {Object|Function} - The array of places or the next function.
 * @throws {NotFound} - If there are no places in the database.
 */
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

/**
 * @name deletePlace. Deletes a place from the database.
 * @async
 * @function
 * @description Deletes a place from the database.
 * @returns {Object|Function} - The deleted place object or the next function.
 */
const deletePlace = async (req, res, next) => {
  const { id } = req.params;
  try {
    const place = await Place.findById(id);
    if (!place) {
      next(NotFound("No such place"));
      return;
    }
    const deletedPlace = await Place.findByIdAndDelete(id);
    await Review.deleteMany({ placeId: id });
    if (!deletedPlace) {
      next(NotFound("No such place"));
      return;
    }
    res.status(OK_CODE).send(deletedPlace);
  } catch (e) {
    next(ServerError("Some bugs on server"));
  }
};

/**
 * @name searchPlace. Searches for places based on keyword.
 * @async
 * @function
 * @description Searches for places based on keyword.
 * @returns {Object|Function} - The array of places or the next function.
 */
const searchPlace = async (req, res, next) => {
  const { query } = req.query;
  try {
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
