/**
 * @module Controllers
 * @file Rewiew controllers. Controllers for adding for place, getting, deleting, sorting and searching of reviews for places.
 * @exports getReviewsByPlaceId
 * @exports reateReviewForPlace
 * @exports updateReview
 * @exports deleteReview
 * @exports searchReviews
 * @exports sortReviews
 */
import Review from "../models/Review.js";
import AuthError from "../errors/authError.js";
import ConflictError from "../errors/conflictError.js";
import NotFound from "../errors/notFound.js";
import IncorrectData from "../errors/requestError.js";
import ServerError from "../errors/serverError.js";
import { OK_CODE, CODE_CREATED } from "../states/states.js";

/**
 * @name getReviewsByPlaceId
 * @async
 * @function
 * @description Retrieves reviews for a specific place.
 * @returns {Object|Function} - The array of reviews or the next function.
 * @throws {NotFound} - If no reviews are found.
 * @throws {ServerError} - If there is a server error.
 */
const getReviewsByPlaceId = async (req, res, next) => {
  const { placeId } = req.params;
  try {
    const reviews = await Review.find({ placeId });
    if (!reviews) {
      next(NotFound("No such reviews"));
      return;
    }
    res.status(OK_CODE).send(reviews);
  } catch (e) {
    next(ServerError("Some bugs on server"));
  }
};

/**
 * @name createReviewForPlace
 * @async
 * @function
 * @description Creates a review for a specific place.
 * @returns {Object|Function} - The created review or the next function.
 * @throws {ConflictError} - If the review already exists.
 * @throws {IncorrectData} - If the data is invalid.
 */
const createReviewForPlace = async (req, res, next) => {
  const { placeId } = req.params;
  const userId = req.user._id;
  try {
    const review = await Review.create({ ...req.body, placeId, userId });
    if (!review) {
      next(ConflictError("Review already exists"));
      return;
    }
    res.status(CODE_CREATED).send(review);
  } catch (e) {
    if (e.name === "ValidationError") {
      next(IncorrectData("Invalid data"));
      return;
    }
    if (e.code === 11000) {
      next(ConflictError("You have already reviewed this"));
      return;
    }
    next(ServerError("Some bugs on server"));
  }
};

/**
 * @name updateReview
 * @async
 * @function
 * @description Updates a review.
 * @returns {Object|Function} - The updated review or the next function.
 * @throws {AuthError} - If the user is not the owner of the review.
 */
const updateReview = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    const review = await Review.findById(id);
    if (!review) {
      next(NotFound("No such review"));
      return;
    }
    if (review.userId.toString() !== userId) {
      next(AuthError("Not your review"));
      return;
    }
    const newReview = await Review.findByIdAndUpdate(id, req.body, { new: true });
    res.status(OK_CODE).send(newReview);
  } catch (e) {
    if (e.name === "ValidationError") {
      next(IncorrectData("Invalid data"));
      return;
    }
    next(ServerError("Some bugs on server"));
  }
};

/**
 * @name deleteReview
 * @async
 * @function
 * @description Deletes a review.
 * @returns {Object|Function} - The deleted review or the next function.
 */
const deleteReview = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    const review = await Review.findById(id);
    if (!review) {
      next(NotFound("No such review"));
      return;
    }
    if (review.userId.toString() !== userId) {
      next(AuthError("Not your review"));
      return;
    }
    const deletedReview = await Review.findByIdAndDelete(id);
    res.status(OK_CODE).send(deletedReview);
  } catch (e) {
    next(ServerError("Some bugs on server"));
  }
};

/**
 * @name searchReviews
 * @async
 * @function
 * @description Searches for reviews based on keyword.
 * @returns {Object|Function} - The array of reviews or the next function.
 */
const searchReviews = async (req, res, next) => {
  const { placeId } = req.params;
  const { keyword } = req.query;
  try {
    const reviews = await Review.find({
      placeId: placeId,
      comment: { $regex: keyword, $options: "i" },
    });

    res.status(OK_CODE).send(reviews);
  } catch (e) {
    console.error(e);
    next(ServerError("Some bugs on server"));
  }
};

/**
 * @name sortReviews
 * @async
 * @function
 * @description Sorts reviews based on rating or date.
 * @returns {Object|Function} - The sorted reviews or the next function.
 * @throws {BadRequest} - If the sortBy parameter is invalid.
 */
const sortReviews = async (req, res, next) => {
  const { placeId } = req.params;
  const { sortBy, sortDirection } = req.query;

  try {
    if (sortBy !== "rating" && sortBy !== "date") {
      next(BadRequest("Invalid sortBy parameter"));
      return;
    }
    
    const sortOrder = sortDirection === "desc" ? -1 : 1;
    let sortField;
    if (sortBy === "date") {
      sortField = { timestamp: sortOrder };
    } else {
      sortField = { [sortBy]: sortOrder };
    }
    
    const reviews = await Review.find({ placeId }).sort(sortField);
    res.status(OK_CODE).send(reviews);
  } catch (e) {
    console.error(e);
    next(ServerError("Some bugs on server"));
  }
};

export {
  getReviewsByPlaceId,
  createReviewForPlace,
  updateReview,
  deleteReview,
  searchReviews,
  sortReviews,
};
