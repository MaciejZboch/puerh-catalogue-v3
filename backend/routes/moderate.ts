import express from 'express';
import catchAsync from '../utilities/catchAsync';
const router = express.Router();
import { isMod } from '../middleware';
import {index, changeVendorStatus, changeProducerStatus} from '../controllers/moderate'

router.get(
  "/",
  isMod,
  catchAsync(index)
);

router.put(
  "/vendor/:id",
  isMod,
  catchAsync(changeVendorStatus)
);

router.put(
  "/producer/:id",
  isMod,
  catchAsync(changeProducerStatus)
);

export default router;
