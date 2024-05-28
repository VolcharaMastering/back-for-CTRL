import express from "express";
/**
 * Express router for handling user, place, and review routes.
 * Includes middleware functions for error validation, authentication, and handling not found pages.
 * Imports necessary modules and controllers for user, place, and review operations.
 *
 * @module routes
 */

import {
  validateUpdateUser,
  validateCreateUser,
  validateLogin,
} from "../middlewares/errorValidator.js";
import NotFound from "../errors/notFound.js";
import auth from "../middlewares/auth.js";

import { updateUser, aboutMe, login, createUser, getUsers } from "../controllers/users.js";
import { addPlace, getPlaces, deletePlace, searchPlace } from "../controllers/places.js";
import {
  getReviewsByPlaceId,
  createReviewForPlace,
  updateReview,
  deleteReview,
  searchReviews,
  sortReviews,
} from "../controllers/reviews.js";

const router = express.Router();
/**
 * Routes for user login, registration, getting all users, getting current user information, updating current user information.
 * @name POST/login/
 * @name POST/register/
 * @name GET/users/
 * @name GET/users/me
 * @name PATCH/users/me
 * @function
 */
router.post("/login/", validateLogin, login);
router.post("/register/", validateCreateUser, createUser);
router.get("/users/", getUsers);
router.get("/users/me", auth, aboutMe);
router.patch("/users/me", auth, validateUpdateUser, updateUser);

/**
 * Routes for places create, get all places, delete, find places by keyword
 * @name POST/places/
 * @name GET/places//
 * @name GET//places/search
 * @name DELETE/places/:id
 * @function
 */
router.post("/places/", auth, addPlace);
router.get("/places/", getPlaces);
router.delete("/places/:id", auth, deletePlace);
router.get("/places/search", searchPlace);

/**
 * Routes for revies create, get reviews for place, change, delete, find reviews by keyword, sort reviews
 * @name POST/places/:placeId/reviews
 * @name GET/places/:placeId/reviews
 * @name PUT/reviews/:id
 * @name DELETE/reviews/:id
 * @name GET/reviews/search
 * @name GET/reviews?
 * @function
 */
router.get("/places/:placeId/reviews", getReviewsByPlaceId);
router.post("/places/:placeId/reviews", auth, createReviewForPlace);
router.put("/reviews/:id", auth, updateReview);
router.delete("/reviews/:id", auth, deleteReview);
router.get("/:placeId/reviews/search", searchReviews);
router.get("/reviews?", sortReviews);

/**
 * Middleware to handle all other routes and return a "Page not found" error.
 * @name all/*
 * @function
 */
router.all("*", (req, res, next) => {
  next(new NotFound("Page not found"));
});

export default router;
