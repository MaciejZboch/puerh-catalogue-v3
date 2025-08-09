import BaseJoi from "joi";
import sanitizeHtml from 'sanitize-html';

const extension = (joi: typeof BaseJoi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value: string, helpers: BaseJoi.CustomHelpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value) {
          return helpers.error("string.escapeHTML", { value });
        }
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

export const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required().escapeHTML(),
  }).required(),
});

export const vendorSchema = Joi.object({
  name: Joi.string().escapeHTML(),
});

export const producerSchema = Joi.object({
  name: Joi.string().allow("").escapeHTML(),
});
export const teaSchema = Joi.object({
  name: Joi.string().required().escapeHTML(),
  vendor: Joi.any(),
  producer: Joi.any(),
  description: Joi.string().allow("").escapeHTML(),
  type: Joi.string().required(),
  year: Joi.any(),
  region: Joi.string().allow("").escapeHTML(),
  village: Joi.string().allow("").escapeHTML(),
  ageing_location: Joi.string().allow("").escapeHTML(),
  ageing_conditions: Joi.string().allow(""),
  shape: Joi.string().allow(""),
});
