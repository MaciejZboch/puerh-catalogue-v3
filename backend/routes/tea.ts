import express from 'express';
const router = express.Router();
import catchAsync from '../utilities/catchAsync';
import { isLoggedIn, isAuthor, validateTea } from '../middleware';
import multer from 'multer';
import { storage }  from '../cloudinary';
const upload = multer({ storage });
import {collection, browse, index, newForm, remove, create, newProducer, newVendor, postProducer, postVendor, update, show, addToCollection, removeFromCollection, editForm } from '../controllers/tea';
const { hasNoSpecialSymbols } = require("../middleware");

router
  .route("/newVendor")
  .get(catchAsync(newVendor))
  .post(hasNoSpecialSymbols, catchAsync(postVendor));

router.get("/collection/:id", catchAsync(collection));

router.get("/browse", catchAsync(browse));

router
  .route("/")
  .get(catchAsync(index))
  .post(
    isLoggedIn,
    hasNoSpecialSymbols,
    upload.array("image"),
    validateTea,
    catchAsync(create)
  );

router.get("/new", isLoggedIn, catchAsync(newForm));

router.get("/:id/edit", isLoggedIn, isAuthor, validateTea, catchAsync(editForm));

router
  .route("/newVendor")
  .get(isLoggedIn, newVendor)
  .post(isLoggedIn, hasNoSpecialSymbols, catchAsync(postVendor));

router
  .route("/newProducer")
  .get(isLoggedIn, newProducer)
  .post(isLoggedIn, hasNoSpecialSymbols, catchAsync(postProducer));

router
  .route("/:id")
  .get(catchAsync(show))
  .put(
    isLoggedIn,
    hasNoSpecialSymbols,
    isAuthor,
    upload.array("image"),
    validateTea,
    catchAsync(update)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(remove));

router
  .route("/:id/add")
  .post(isLoggedIn, catchAsync(addToCollection))
  .delete(isLoggedIn, catchAsync(removeFromCollection));

export default router;
