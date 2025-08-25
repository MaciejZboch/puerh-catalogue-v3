import { Request, Response, NextFunction } from "express";
import {ITea} from "../models/tea";
function checkTeaLength(req: Request, res: Response, tea: ITea) {
  function isProperLength(t: string, x: number) {
    return (t.length > 3 && t.length < x) || !t;
  }

  const fields = [
    { key: "name", max: 20, message: "Name must be 3 to 20 characters long!" },
    {
      key: "region",
      max: 20,
      message: "Region must be 3 to 20 characters long!",
    },
    {
      key: "village",
      max: 20,
      message: "Village must be 3 to 20 characters long!",
    },
    {
      key: "ageing_location",
      max: 20,
      message: "Ageing location must be 3 to 20 characters long!",
    },
    {
      key: "description",
      max: 200,
      message: "Description must be 3 to 200 characters long!",
    },
  ];

  for (const field of fields) {
    if (!isProperLength(tea[field.key as keyof ITea], field.max)) {
        return res.status(401).json({ error: field.message });
    }
  }

  return null;
};

export default checkTeaLength;