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

//limit the number of record to return base on pageSize ans pageNum
const pagingFilter = function (filtedValueDoc, pageSize, pageNum) {
  const totalDataCount = filtedValueDoc.length;
  const totalPage = Math.ceil(totalDataCount / pageSize);
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

export { valueDocTimeFilter, pagingFilter };
