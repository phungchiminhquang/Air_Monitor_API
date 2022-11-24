import "datejs";

const calculateAverageValue = function (groupArray) {
  var result;
  for (let i = 0; i < groupArray.length; i++) {
    console.log(groupArray[i].paramDoc);
  }
};
const valueDocTimeFilter = function (bucketDoc, startTime, endTime) {
  var valueDoc = [];
  var filtedValueDoc = [];

  for (let i in bucketDoc) {
    valueDoc = valueDoc.concat(bucketDoc[i].data); //copy only data part in the bucket document
  }

  for (let i in valueDoc) {
    if (
      valueDoc[i].happenedTime >= startTime &&
      valueDoc[i].happenedTime <= endTime
    ) {
      filtedValueDoc.push(valueDoc[i]);
    }
  }
  return filtedValueDoc;
};
const valueDocAQIComputing = function (valueFiltedByTime, interval) {
  console.log(
    "///////begin of AQI calculation////////////////////////////////////////"
  );

  // hardcode
  interval = 30;
  var averageValue = [];
  var gapMinute = 0;
  var j = 0;
  var groupArray = [];
  console.log(valueFiltedByTime.length);
  for (let i = 0; i <= valueFiltedByTime.length - 1; i++) {
    console.log("i = " + i);
    // console.log(valueFiltedByTime[i].happenedTime);
    // console.log(valueFiltedByTime[i + 1].happenedTime);
    gapMinute = Math.round(
      (valueFiltedByTime[i].happenedTime - valueFiltedByTime[j].happenedTime) /
        60000
    );
    if (gapMinute <= interval) {
      groupArray.push(valueFiltedByTime[i]);
    }
    console.log(groupArray);
    calculateAverageValue(groupArray);
    console.log("Gap =========" + gapMinute);
  }

  console.log(interval);
  return 0;
};

//limit the number of record to return base on pageSize ans pageNum
const pagingFilter = function (filtedValueDoc, pageSize, pageNum) {
  const totalDataCount = filtedValueDoc.length;
  const totalPage = Math.ceil(totalDataCount / pageSize);
  if (pageNum == 0) {
    return { error: "No record" };
  }
  if (pageNum > totalPage) {
    return { error: "pageNum is out of range" };
  }
  const skip = (pageNum - 1) * pageSize;
  const limit = pageSize + skip;
  const data = filtedValueDoc.slice(skip, limit);
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
