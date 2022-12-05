const fastGetUnit = function (key) {
  var unit = "ug/m3";
  switch (key) {
    case "Bat":
      unit = "Volt";
      break;
    case "Humi":
      unit = "g/m3";
      break;
    default:
      unit = "ug/m3";
  }
  return unit;
};

const mappingValue = function (reqValue) {
  var mappedValue = {};
  mappedValue.ValueDict = {};
  var time = new Date(reqValue.Time);
  for (const [key, value] of Object.entries(reqValue)) {
    console.log(`${key}: ${value}`);
    if (key == "Time") {
      mappedValue["HappenedTime"] = time;
    } else if (key == "stationId") {
      // do no thing
    } else {
      mappedValue.ValueDict[key] = {
        ParamValue: parseFloat(value),
        ParamStatus: 0,
        Time: time,
        Unit: fastGetUnit(key),
      };
    }
  }
  // mappedValue.HappenedTime = ;
  console.log(mappedValue);
  return mappedValue;
};
// update latest value to station
const updateStationLatestValue = async function (stationId, value) {
  const filter = { StationId: stationId };
  const update = { lastesValue: value };
  try {
    var result = await StationModel.findOneAndUpdate(filter, update, {
      new: true,
    });
    // console.log("sucessfully update latest value_____________");
    // console.log(result);
    return;
  } catch (error) {
    return error;
  }
};

export { mappingValue, updateStationLatestValue };
