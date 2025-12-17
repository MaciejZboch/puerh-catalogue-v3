import Vendor from "../models/vendor";
import Producer from "../models/producer";
import { Request, Response } from "express";

export const index = async (req: Request, res: Response) => {
  const vendors = await Vendor.find({ status: "pending" });
  const producers = await Producer.find({ status: "pending" });

  res.json({ vendors, producers });
};

export const changeVendorStatus = async (req: Request, res: Response) => {
  if (req.query.status == "approved") {
    await Vendor.findByIdAndUpdate(req.params.id, {
      status: "approved",
    });
  } else if (req.query.status == "rejected") {
    await Vendor.findByIdAndUpdate(req.params.id, {
      status: "rejected",
    });
  }
  res.json({ success: true });
};

export const changeProducerStatus = async (req: Request, res: Response) => {
  if (req.query.status == "approved") {
    await Producer.findByIdAndUpdate(req.params.id, {
      status: "approved",
    });
  } else if (req.query.status == "rejected") {
    await Producer.findByIdAndUpdate(req.params.id, {
      status: "rejected",
    });
  }
  res.json({ success: true });
};
