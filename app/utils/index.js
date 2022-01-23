getInclude = (req) => {
  return req.query.include && req.query.include;
};

getWhereQuery = (req) => {
  return req.query.extraParams
}

const helperUtils = {
  getInclude,
  getWhereQuery
};

module.exports = helperUtils;