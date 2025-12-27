import Tea from "../models/tea";
import Vendor from "../models/vendor";
import Producer from "../models/producer";
import User from "../models/user";
import Review from "../models/review";
import { cloudinary } from "../cloudinary/index";
import checkTeaLength from "../utilities/checkTeaLength";
import { Request, Response } from "express";
const currentYear = new Date().getFullYear();

//index
export const index = async (req: Request, res: Response) => {
  try {
    const vendors = await Vendor.find();
    const producers = await Producer.find();

    const unfilteredReviews = await Review.find({})
      .sort({ _id: -1 }) // sort newest first
      .limit(8)
      .populate("author")
      .populate("tea");

    const reviews = unfilteredReviews.filter((r) => r.tea);

    const teas = await Tea.find({})
      .sort({ _id: -1 })
      .limit(10)
      .populate("vendor")
      .populate("producer");

    res.json({
      vendors,
      producers,
      teas,
      reviews,
    });
  } catch (err) {
    console.error("Error in index controller:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

//new
export const newForm = async (req: Request, res: Response) => {
  const vendors = await Vendor.find();
  const producers = await Producer.find();
  res.json({ currentYear, vendors, producers });
};

//create tea
export const create = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized!" });
  }
  const tea = req.body;
  const lengthError = checkTeaLength(req, res, tea); //returns null if the tea length is fine
  if (lengthError) {
    return res.status(401).json({ error: "Invalid length!" });
  }
  const newTea = new Tea(tea);
  newTea.author = req.user._id;
  newTea.vendor = await Vendor.findById(req.body.vendor);
  newTea.producer = await Producer.findById(req.body.producer);

  if (!newTea.vendor) {
    throw new Error("Vendor not found!");
  }

  //search db to check if there is something with the same exact name, vendor and year in the DB
  const sameTea = await Tea.find({
    name: newTea.name,
    vendor: newTea.vendor,
    year: newTea.year,
  });
  if (sameTea.length > 0) {
    return res.status(400).json({ error: "This tea has already been added!" });
  }

  if (req.files) {
    if (Array.isArray(req.files)) {
      newTea.images = req.files.map((f: Express.Multer.File) => ({
        url: f.path,
        filename: f.filename,
      })) as any;
    }
  }
  await newTea.save();
  return res
    .status(201)
    .json({ message: "Tea created successfully!", tea: newTea });
};

//:id
export const show = async (req: Request, res: Response) => {
  const tea = await Tea.findById(req.params.id)
    .populate("producer")
    .populate("vendor");

  if (!tea) {
    return res.status(404).json({ error: "Tea not found!" });
  }

  const reviews = await Review.find({ tea: tea._id }).populate("author");

  //calculate user's average rating for this tea
  let average = null;
  const numberOfRatings = reviews.length;
  if (reviews.length > 0) {
    const ratings = reviews.map((r) => r.rating);
    average = ratings.reduce((a, b) => a + b, 0) / ratings.length;
  }

  let myRatings: any = [];

  if (req.user) {
    const userId = req.user._id.toString();
    myRatings = reviews
      .filter((review) => review.author._id.toString() === userId)
      .map((review) => review.rating);
  } else {
    myRatings = false;
  }
  res.json({ tea, reviews, myRatings, average, numberOfRatings });
};

export const editForm = async (req: Request, res: Response) => {
  const t = await Tea.findById(req.params.id)
    .populate("vendor")
    .populate("producer");
  if (!t) {
    return res.status(404).json({ error: "Tea not found!" });
  }
  const vendors = await Vendor.find();
  const producers = await Producer.find();
  res.json({ t, currentYear, vendors, producers });
};

export const update = async (req: Request, res: Response) => {
  const tea = req.body;
  const lengthError = checkTeaLength(req, res, tea); //returns null if the tea length is fine

  if (lengthError) {
    return res.status(500).json({ error: "Invalid length!" });
  }

  //if empty number field, set to null
  if (!req.body.year) {
    tea.year = null;
  }

  if (!req.body.price) {
    tea.price = null;
  }

  if (!req.body.sizeInGrams) {
    tea.sizeInGrams = null;
  }

  const foundTea = await Tea.findByIdAndUpdate(req.params.id, {
    ...tea,
  });

  if (!foundTea) {
    return res.status(401).json({ error: "Tea not found!" });
  }
  foundTea.vendor = await Vendor.findById(req.body.vendor);
  foundTea.producer = await Producer.findById(req.body.producer);

  if (req.files) {
    if (Array.isArray(req.files)) {
      const imgs = req.files.map((f) => ({
        url: f.path,
        filename: f.filename,
      }));

      if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
          await cloudinary.uploader.destroy(filename);
        }
      }
      foundTea.images.push(...imgs);
      await foundTea.updateOne({
        $pull: { images: { filename: { $in: req.body.deleteImages } } },
      });
      await foundTea.save();
    }
    return res.status(201).json({ message: "Tea updated!", tea: foundTea });
  }
};

export const remove = async (req: Request, res: Response) => {
  await Tea.findByIdAndDelete(req.params.id);
  await Review.deleteMany({ tea: req.params.id });

  return res.status(201).json({ message: "Tea removed!" });
};

// vendor/producer controllers
export const newVendor = async (req: Request, res: Response) => {
  const vendors = await Vendor.find();
  res.json({ vendors });
};

export const postVendor = async (req: Request, res: Response) => {
  const v = new Vendor({ name: req.body.name });

  await v.save();
  return res.status(201).json({ message: "Vendor submitted for approval!" });
};

export const newProducer = async (req: Request, res: Response) => {
  const producers = await Producer.find();
  res.json({ producers });
};

export const postProducer = async (req: Request, res: Response) => {
  const p = await new Producer({ name: req.body.name });

  await p.save();
  return res.status(201).json({ message: "Producer submitted for approval!" });
};

//add or remove from collection
export const addToCollection = async (req: Request, res: Response) => {
  try {
    const t = await Tea.findById(req.params.id);
    if (!t) {
      return res.status(404).json({ error: "Tea not found" });
    }

    if (req.user && !t.owners.includes(req.user._id)) {
      t.owners.push(req.user._id);
      await t.save();

      return res.json(t); // send the updated tea with owners
    } else {
      return res
        .status(400)
        .json({ error: "This tea is already in your collection!" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const removeFromCollection = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ error: "Unauthorized, user not logged in" });
    }

    const updatedTea = await Tea.findByIdAndUpdate(
      req.params.id,
      { $pull: { owners: req.user._id } },
      { new: true } // returns the updated tea
    );

    if (!updatedTea) {
      return res.status(404).json({ error: "Tea not found" });
    }

    return res.json(updatedTea); // frontend gets the updated tea
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

//get collection and browse tables
export const collection = async (req: Request, res: Response) => {
  const teas = await Tea.find({ owners: req.params.id })
    .populate("vendor")
    .populate("producer");
  const collector = await User.findById(req.params.id).populate("following");

  if (!collector) {
    return res.status(404).json({ error: "User not found!" });
  }
  const followedUsers = collector.following;
  res.json({ teas, collector, followedUsers });
};

export const browse = async (req: Request, res: Response) => {
  const search: any = req.query.search;
  async function searchTea(searchTerm: string) {
    try {
      if (!searchTerm || searchTerm.trim() === "") {
        console.error("Invalid search term");
        return [];
      }

      const regex = new RegExp(searchTerm, "i");

      const results = await Tea.aggregate([
        {
          $lookup: {
            from: "vendors",
            localField: "vendor",
            foreignField: "_id",
            as: "vendor",
          },
        },
        {
          $lookup: {
            from: "producers",
            localField: "producer",
            foreignField: "_id",
            as: "producer",
          },
        },
        { $unwind: { path: "$vendor", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$producer", preserveNullAndEmptyArrays: true } },
        {
          $unwind: {
            path: "$images",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            images: { $ifNull: ["$images", []] },
          },
        },
        {
          $match: {
            $and: [
              {
                $or: [
                  { name: regex },
                  { type: regex },
                  {
                    $expr: {
                      $regexMatch: {
                        input: { $toString: "$year" },
                        regex: searchTerm,
                        options: "i",
                      },
                    },
                  },
                  { region: regex },
                  { ageing_location: regex },
                  { ageing_conditions: regex },
                  { "vendor.name": regex },
                  { "producer.name": regex },
                ],
              },
              {
                $or: [
                  { vendor: { $eq: null } },
                  { "vendor.status": "approved" },
                  { "vendor.status": { $exists: false } },
                ],
              },
              {
                $or: [
                  { producer: { $eq: null } },
                  { "producer.status": "approved" },
                  { "producer.status": { $exists: false } },
                ],
              },
            ],
          },
        },
        {
          $group: {
            _id: "$_id",
            name: { $first: "$name" },
            type: { $first: "$type" },
            year: { $first: "$year" },
            region: { $first: "$region" },
            ageing_location: { $first: "$ageing_location" },
            ageing_conditions: { $first: "$ageing_conditions" },
            vendor: { $first: "$vendor" },
            producer: { $first: "$producer" },
            owners: { $first: "$owners" },
            firstImage: { $first: "$images" },
          },
        },
      ]);

      return results;
    } catch (err) {
      console.error("Aggregation error:", err);
      return [];
    }
  }

  const teas = await searchTea(search);

  //searching for vendors / producers to populate datalist
  const vendors = await Vendor.find();
  const producers = await Producer.find();
  res.json({ teas, search, vendors, producers });
};

export const searchSuggestions = async (req: Request, res: Response) => {
  const q = (req.query.q as string)?.trim();

  if (!q || q.length < 2) {
    return res.json([]);
  }

  const regex = new RegExp("^" + q, "i");

  const [teas, vendors, producers, regionsRaw] = await Promise.all([
    Tea.find({ name: regex }).select("name").limit(5),

    Vendor.find({ name: regex, status: "approved" }).select("name").limit(5),

    Producer.find({ name: regex, status: "approved" }).select("name").limit(5),

    Tea.distinct("region", { region: regex }),
  ]);

  const regions = regionsRaw.slice(0, 5);

  const suggestions = [
    ...teas.map((t) => ({ type: "tea", label: t.name, id: t._id })),
    ...vendors.map((v) => ({ type: "vendor", label: v.name })),
    ...producers.map((p) => ({ type: "producer", label: p.name })),
    ...regions.map((r) => ({ type: "region", label: r })),
  ];

  res.json(suggestions.slice(0, 10));
};
