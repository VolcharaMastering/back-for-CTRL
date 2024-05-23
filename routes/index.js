import express from "express";
import {
  validateUpdateUser,
  validateCreateUser,
  validateLogin,
} from "../middlewares/errorValidator.js";
import NotFound from "../errors/notFound.js";
import auth from "../middlewares/auth.js";

import { updateUser, aboutMe, login, createUser, getUsers } from "../controllers/users.js";
import { validatePlace, getPlaces, deletePlace, searchPlace } from "../controllers/places.js";
import {
  getReviewsByPlaceId,
  createReviewForPlace,
  updateReview,
  deleteReview,
  searchReviews,
  sortReviews
} from "../controllers/reviews.js";

const router = express.Router();
////users routes ////////
router.post("/login/", validateLogin, login);
router.post("/register/", validateCreateUser, createUser);
router.get("/users/", getUsers);
router.get("/users/me", auth, aboutMe);
router.patch("/users/me", auth, validateUpdateUser, updateUser);

///places routes///
router.post("/places/", auth, validatePlace);
router.get("/places/", auth, getPlaces);
router.delete("/places/:Id", auth, deletePlace);
router.get("/places/search?query=placeNamed", auth, searchPlace);
///----------------//////

//places and reviews routes///
router.get("/places/:id/reviews", auth, getReviewsByPlaceId);
router.post("/places/:id/reviews", auth, createReviewForPlace);
///----------------//////

////reviews routes///
router.put("/reviews/:id", auth, updateReview);
router.delete("/reviews/:id", auth, deleteReview);
router.get("/reviews/search?keyword=someKeyword", auth, searchReviews);
router.get("/reviews?sortBy=rating|date", auth, sortReviews);
///----------------//////

router.all("*", (req, res, next) => {
  next(new NotFound("Page not found"));
});

export default router;
