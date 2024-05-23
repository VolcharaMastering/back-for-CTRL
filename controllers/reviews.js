import AuthError from "../errors/authError.js";
import ConflictError from "../errors/conflictError.js";
import NotFound from "../errors/notFound.js";
import IncorrectData from "../errors/requestError.js";
import ServerError from "../errors/serverError.js";
import Review from "../models/Review.js";
import { OK_CODE, CODE_CREATED } from "../states/states.js";

const getReviewsByPlaceId = async (req, res, next) => {
  try {
    const { placeId } = req.params;
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

const createReviewForPlace = async (req, res, next) => {
  const { placeId } = req.params;
  const { userId } = req.body;
  try {
    const review = await Review.create({ ...req.body, placeId, userId });
    if (!review) {
      next(ConflictError("Review already exists"));
      return;
    }
    res.status(CODE_CREATED).send(review);
  } catch (e) {
    next(ServerError("Some bugs on server"));
  }
};

const updateReview = async (req, res, next) => {
  const { reviewId } = req.params;
  const { userId } = req.body;
  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      next(NotFound("No such review"));
      return;
    }
    if (review.userId.toString() !== userId) {
      next(AuthError("Not your review"));
      return;
    }
    const newReview = await Review.findByIdAndUpdate(reviewId, req.body, { new: true });
    if (!newReview) {
      next(ConflictError("Review already exists"));
      return;
    }
    res.status(OK_CODE).send(newReview);
  } catch (e) {
    next(ServerError("Some bugs on server"));
  }
};

const deleteReview = async (req, res, next) => {
  const { reviewId } = req.params;
  const { userId } = req.body;
  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      next(NotFound("No such review"));
      return;
    }
    if (review.userId.toString() !== userId) {
      next(AuthError("Not your review"));
      return;
    }
    await Review.findByIdAndDelete(reviewId);
    res.status(OK_CODE).send({ message: "Review deleted" });
  } catch (e) {
    next(ServerError("Some bugs on server"));
  }
};

const searchReviews = async (req, res, next) => {
  const { placeId } = req.params;
  try {
    const review = await Review.findOne({ placeId });
    if (!review) {
      next(NotFound("No such review"));
      return;
    }
    res.status(OK_CODE).send(review);
  } catch (e) {
    next(ServerError("Some bugs on server"));
  }
};

const sortReviews = async (req, res, next) => {
  const { sortBy } = req.query;
  try {
    const reviews = await Review.find({}).sort({ [sortBy]: 1 });
    if (!reviews) {
      next(NotFound("No such review"));
      return;
    }
    res.status(OK_CODE).send(reviews);
  } catch (e) {
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
