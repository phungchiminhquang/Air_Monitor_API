import "datejs";

// calculate vaverage value of all param in groupArray and return 1 value record

const computeAQIBaseOnAverageValue = function (averageArray) {
  // Compute right here
};

// const devideParamValue = function (tempValue, groupArrayLength) {
//   for (let i = 0; i < tempValue.paramDoc.length; i++) {
//     tempValue.paramDoc[i].paramValue =
//       tempValue.paramDoc[i].paramValue / groupArrayLength;
//   }
// };
// const addParamValue = function (tempValue, paramDocObj) {
//   // console.log("paramDocObj");
//   // console.log(paramDocObj);
//   if (tempValue.paramDoc.length == 0) {
//     tempValue.paramDoc.push(paramDocObj);
//   } else {
//     // loop to compare paramDoc by paramName
//     for (let z = 0; z < tempValue.paramDoc.length; z++) {
//       if (tempValue.paramDoc[z].paramName == paramDocObj.paramName) {
//         // If there are at leases one paramName matched
//         tempValue.paramDoc[z].paramValue += paramDocObj.paramValue;
//         tempValue.paramDoc[z].paramValue =
//           Math.round(tempValue.paramDoc[z].paramValue * 10) / 10;
//         break;
//       } else {
//         if (z == tempValue.paramDoc.length - 1) {
//           // If there is no paramName matched
//           tempValue.paramDoc.push(paramDocObj);
//           break;
//         }
//       }
//     }
//   }
// };

// return one paramValue after compute average base on group of paramValues
const computeAverageParamValue = function (groupParamValueArray) {
  // console.log(groupParamValueArray);
  if (groupParamValueArray.length == 0) return 0;
  var firstParamValue = groupParamValueArray[0];

  var tempParamValue = JSON.parse(JSON.stringify(firstParamValue));
  tempParamValue.Time = new Date(firstParamValue.Time.getTime());

  for (let i = 0; i < groupParamValueArray.length; i++) {
    // console.log("in looop");
    tempParamValue.ParamValue += groupParamValueArray[i].ParamValue;
  }
  tempParamValue.ParamValue /= groupParamValueArray.length;

  return tempParamValue;
};

// Only using this function for PM param
// It will group value base on interval and compute average value for each group
// Return a Average ValueDict Array
const computeAverageArray12Interval = function (
  paramCode,
  valueFiltedByTime,
  interval
) {
  var averageArray = [];
  var gapMinute = 0;
  var j = 0;
  var groupArray = [];
  // console.log(valueFiltedByTime.length);
  for (let i = 0; i <= valueFiltedByTime.length - 1; i++) {
    gapMinute = Math.round(
      (valueFiltedByTime[i].HappenedTime - valueFiltedByTime[j].HappenedTime) /
        60000
    );
    // console.log("gapMinute = " + gapMinute);
    var valueDictObj = Object.fromEntries(valueFiltedByTime[i].ValueDict);
    if (gapMinute <= interval) {
      if (valueDictObj[paramCode] != undefined) {
        // console.log("Pushinggggggg");
        var paramValue = valueDictObj[paramCode];
        groupArray.push(paramValue);
      }
    } else if (j == i - 1) {
      j = i;
      i--;
      continue;
    } else {
      // assgin result to averageValue
      // console.log("average Param Record  ::::  ");
      var averageParamValue = computeAverageParamValue(groupArray);
      averageArray.push(averageParamValue);
      groupArray.length = 0; // clear array
      j = i - 1;
      i = i - 2;
      // console.log("seting j = " + j);
      // console.log("seting i = " + i);
    }
    // console.log("Gap =========" + gapMinute);
  }
  // if for loop is end, calculate remain param in group Array
  if (groupArray.length > 0) {
    // console.log("Calculate remain param in group Array");
    var averageParamValue = computeAverageParamValue(groupArray);
    averageArray.push(averageParamValue);
  }

  return averageArray;
};

// const isApproxEqualTime = function (compareTime, pickedTime, interval) {
//   var upperLimitTime = new Date(pickedTime.getTime());
//   var lowerLimitTime = new Date(pickedTime.getTime());

//   upperLimitTime.addMinutes(interval / 2);
//   lowerLimitTime.addMinutes(-interval / 2);

//   if (compareTime >= lowerLimitTime && compareTime <= upperLimitTime)
//     return true;
//   else return false;
// };

// const calculateAQI = function (valueFiltedByTime, pickedTime, interval) {
//   var tempPickedTime = new Date(pickedTime.getTime());

//   console.log("inside calculate AQI");

//   // var averageArray = calculateAverageValueArray(valueFiltedByTime, interval);
//   var valueArray = [];
//   var j = 0;
//   for (let i = averageArray.length - 1; i < averageArray.length; i--) {
//     if (isApproxEqualTime(averageArray[i], pickedTime, interval)) {
//     }
//   }

//   return 0;
// };
const formatTo_C_Array = function (averageArray, pickTime, interval) {
  var formatedArray = [];
  var valueArray = new Array(12).fill(0);
  // inloop formatAvergeArray
  for (let i = 0; i < averageArray.length; i++) {
    var index = Math.floor(
      (pickTime - averageArray[i].Time) / (interval * 60000)
    );
    console.log({
      pickTime: pickTime,
      averageArrayTime: averageArray[i].Time,
      index: index,
    });
    if (index >= 12 || index < 0) {
      // do nothing
    } else {
      // console.log({
      //   averageTime: averageArray[i].Time,
      //   pickTime: pickTime,
      //   index: index,
      // });
      // formatedArray[index] = averageArray[i];
      valueArray[index] = averageArray[i].ParamValue;
    }

    // console.log(index);
  }
  // console.log(valueArray);
  return valueArray;
};
// This function is only use for PM param
const computeNowCast = function (c_Array) {
  var c_max = Math.max(...c_Array);
  var c_min = Math.min(...c_Array);
  var w = c_min / c_max;
  console.log(c_max, c_min, w);
  if (w <= 1 / 2) w = 1 / 2;

  console.log(w);
  // check 3 nearest value
  var checkCount = 0;
  for (let i = 0; i < 3; i++) {
    if (c_Array[i] != 0) {
      checkCount++;
    }
  }
  if (checkCount < 2) return -1;
  /////////////////////////
  var NowCast = 0;
  if (w > 1 / 2) {
    var upper = 0;
    var lower = 0;
    for (let i = 0; i < 12; i++) {
      let w_exp = w ** i;
      if (c_Array[i] == 0) w_exp = 0;
      upper += w_exp * c_Array[i];
      lower += w_exp;
    }
    NowCast = upper / lower;
  } else {
    for (let i = 0; i < 12; i++) {
      NowCast += (1 / 2) ** (i + 1) * c_Array[i];
    }
  }
  console.log("NowCast = " + NowCast);
  return NowCast;
};
const formularAQI_param = function (NowCast_or_cValue, ParamCode) {
  var BP_table = {
    I: [0, 50, 100, 150, 200, 300, 400, 500],
    O3: [0, 160, 200, 300, 400, 800, 1000, 1200],
    CO: [0, 10, 30, 45, 60, 90, 120000, 150000],
    SO2: [0, 125, 350, 550, 800, 1600, 2100, 2630],
    NO2: [0, 100, 200, 700, 1200, 2350, 3100, 3850],
    Pm10: [0, 50, 150, 250, 350, 420, 500, 600],
    Pm25: [0, 25, 50, 80, 150, 250, 350, 500],
  };
  var AQI = 0;
  for (let i = 0; i < 8; i++) {
    let lowerValue = BP_table[ParamCode][i];
    let upperValue = BP_table[ParamCode][i + 1];
    if (NowCast_or_cValue >= lowerValue && NowCast_or_cValue < upperValue) {
      let upperI = BP_table["I"][i + 1];
      let lowerI = BP_table["I"][i];
      AQI =
        ((upperI - lowerI) / (upperValue - lowerValue)) *
          (NowCast_or_cValue - lowerValue) +
        lowerI;
    }
  }

  AQI = Math.round(AQI);
  console.log("AQI = " + AQI);
  return AQI;
};
const dataArrayFilter = function (
  dataArray,
  pickTime,
  ParamCode,
  interval,
  stepNumber
) {
  var filtedDataArray = [];
  // console.log("data Array filter");
  // console.log("pickTime");
  // console.log(pickTime);
  var backwardGap = stepNumber * interval * 60000;
  var forwardGap = interval * 60000;
  for (let i = 0; i < dataArray.length; i++) {
    var diff = pickTime - dataArray[i].HappenedTime;
    if (
      (diff <= backwardGap && diff >= 0) ||
      (diff < 0 && Math.abs(diff) <= forwardGap)
    ) {
      filtedDataArray.push(dataArray[i]);
    }
  }
  // console.log(filtedDataArray);
  return filtedDataArray;
};
const computeAQI_PM = function (dataArray, pickTime, ParamCode, interval) {
  // console.log("dataArray: " + dataArray[0]);
  var newDataArray = dataArrayFilter(
    dataArray,
    pickTime,
    ParamCode,
    interval,
    12
  );
  // console.log("newDataArray: " + newDataArray[0]);
  var RawAverageArrayPM = computeAverageArray12Interval(
    ParamCode,
    newDataArray,
    interval
  );
  console.log("RawAverageArray" + ParamCode);
  console.log(RawAverageArrayPM);
  var formated_C_Array_PM = formatTo_C_Array(
    RawAverageArrayPM,
    pickTime,
    interval
  );
  console.log("formated_C_Array_PM = " + formated_C_Array_PM);

  // var test1 = [
  //   26.9, 24.7, 20.5, 23.5, 19.5, 16.5, 19.0, 16.5, 20.3, 22.4, 19.6, 20.6,
  // ];
  // var test2 = test1.reverse();
  var nowCastValue = computeNowCast(formated_C_Array_PM);
  console.log("nowCastValue = " + nowCastValue);
  var AQI_PM = formularAQI_param(nowCastValue, ParamCode);
  return AQI_PM;
};
// const computeAverageArray1Interval = function (
//   ParamCode,
//   valueFiltedByTime,
//   pickTime,
//   interval
// ) {};
const valueDocAQIComputing = function (
  valueFiltedByTime,
  originalStartTime,
  originalEndTime,
  interval
) {
  var pickTime = originalStartTime;
  var AQI_PM25 = computeAQI_PM(valueFiltedByTime, pickTime, "Pm25", interval);
  console.log("AQI_PM25 = " + AQI_PM25);

  // var AverageValue = computeAverageArray1Interval(
  //   "CO",
  //   valueFiltedByTime,
  //   originalStartTime,
  //   interval
  // );
  // hardcode
  // we have to compute AQI base on average array and add AQI param into res
  return 0;
};

const valueDocTimeFilter = function (bucketDoc, startTime, endTime) {
  var valueArray = [];
  var filtedValueDoc = [];

  for (let i in bucketDoc) {
    valueArray = valueArray.concat(bucketDoc[i].data); //copy only data part in the bucket document
  }

  for (let i in valueArray) {
    if (
      valueArray[i].HappenedTime >= startTime &&
      valueArray[i].HappenedTime <= endTime
    ) {
      filtedValueDoc.push(valueArray[i]);
    }
  }
  return filtedValueDoc;
};

//limit the number of record to return base on pageSize ans pageNum
const pagingFilter = function (filtedValueArray, pageSize, pageNum) {
  const totalDataCount = filtedValueArray.length;
  const totalPage = Math.ceil(totalDataCount / pageSize);
  if (pageNum == 0) {
    return { error: "No record" };
  }
  if (pageNum > totalPage) {
    return { error: "pageNum is out of range" };
  }
  const skip = (pageNum - 1) * pageSize;
  const limit = pageSize + skip;
  const data = filtedValueArray.slice(skip, limit);
  const nextPage = pageNum < totalPage;
  const prevPage = pageNum > 1;
  return {
    totalPage: totalPage,
    totalDataCount: totalDataCount,
    currentPage: pageNum,
    pageSize: pageSize,
    currentDataCount: data.length,
    nextPage: nextPage,
    prevPage: prevPage,
    data: data,
  };
};

export { valueDocTimeFilter, pagingFilter, valueDocAQIComputing };
