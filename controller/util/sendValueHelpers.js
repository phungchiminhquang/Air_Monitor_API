const convertStringToValueModel = function (paramString) {
  const paramArray = paramString.split(";");
  var mappedValue = {};
  mappedValue.paramDoc = [];
  for (let i = 0; i < paramArray.length - 1; i++) {
    const param = paramArray[i].split("[")[0];
    console.log(i + "__" + param);
    if (param != "TimeStamp") {
      const value = parseFloat(paramArray[i].split("[")[1].slice(0, -1));
      mappedValue.paramDoc[i] = {
        paramName: param,
        paramValue: value,
        paramStatus: 0,
      };
    } else {
      // if param == "TimeStamp"
      const value = Date.parse(paramArray[i].split("[")[1].slice(0, -1));
      mappedValue.happenedTime = value;
    }
  }
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
  } catch (error) {
    return error;
  }
  return;
};

export { convertStringToValueModel, updateStationLatestValue };
