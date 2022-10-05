import Joi from "joi";

const registerValidation = function (data) {
  const schema = Joi.object({
    username: Joi.string().min(3).required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};
const loginValidation = function (data) {
  const schema = Joi.object({
    username: Joi.string().min(3).required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};
const createStationValidation = function (data) {
  const schema = Joi.object({
    StationId: Joi.string().required(),
    StationName: Joi.string().required(),
    DeviceCode: Joi.string().required(),
    Address: Joi.string().required(),
    TelNo: Joi.string().required(),
    Latitude: Joi.string().required(),
    Longitude: Joi.string().required(),
    Params: Joi.array().items(
      Joi.object({
        Name: Joi.string().required(),
        Code: Joi.string().required(),
        Unit: Joi.string().required(),
        Min: Joi.number().required(),
        Max: Joi.number().required(),
        Color: Joi.string().required(),
      })
    ),
  });

  return schema.validate(data);
};

export { registerValidation, loginValidation, createStationValidation };
