const convertStringToValueModel = function (paramString) {
  const paramArray = paramString.split(";");
  var mappedValue = {};
  mappedValue.paramDoc = [];
  for (let i = 0; i < paramArray.length - 1; i++) {
    const param = paramArray[i].split("[")[0];
    // console.log(i + "__" + param);
    if (param != "TimeStamp") {
      const value = parseFloat(paramArray[i].split("[")[1].slice(0, -1));
      mappedValue.paramDoc[i] = {
        paramName: param,
        paramValue: value,
        paramStatus: 0,
      };
      // console.log(mappedValue.paramDoc[i]);
    } else {
      // if param == "TimeStamp"
      let value = Date.parse(paramArray[i].split("[")[1].slice(0, -1));
      console.log("value = " + value);
      if (value == null) value = Date.now();
      console.log("value = " + value);
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
    return;
  } catch (error) {
    return error;
  }
};

export { convertStringToValueModel, updateStationLatestValue };
