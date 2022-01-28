getInclude = (req) => {
  return req.query.include && req.query.include;
};

getWhereQuery = (req, condition) => {
  return { ...req.query.extraParams, ...condition }
}

getOrderQuery = (req) => {
  let orderBys = [];
  orderBys.push([req.query.sortBy, req.query.sortDirection])
  return orderBys
}

const getPagination = (page, rpp) => {
  const limit = rpp ? +rpp : 5;
  const offset = page ? (+page * limit) - limit : 0;

  return { limit, offset };
};

const getResponseData = (records, page, rpp) => {
  const { count: totalRecords, rows: data } = records;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalRecords / +rpp);

  return { pagination: { totalRecords, totalPages, currentPage }, data };
};

const helperUtils = {
  getInclude,
  getWhereQuery,
  getOrderQuery,
  getPagination,
  getResponseData
};

module.exports = helperUtils;