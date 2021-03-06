const fs = require("fs");
const puppeteer = require("puppeteer");

getInclude = (req) => {
  return req.query.include && req.query.include;
};

getWhereQuery = (req, condition) => {
  return { ...req.query.extraParams, ...condition }
}

getOrderQuery = (req) => {
  
  const { sortBy, sortDirection, sortModal } = req.query;
  let orderBys = [];
  sortModal ? 
    orderBys.push([sortModal, sortBy.split('.')[1], sortDirection])
    :
    orderBys.push([sortBy, sortDirection])

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

const getLogoUploadUrl = (logo, registerKey) => {
  let url = logo ? logo : ""
  let type = ["image/png", "image/jpeg", "image/jpg"].find((type) => url.indexOf(type) > -1)

  if(type) {
    let format = type.split("/")[1];
    let base64Data = url.replace(new RegExp("^data:image\/" + format + ";base64,",""), "");
    let imgName = registerKey + "." + format;
    url = 'http://127.0.0.1:8080/logos/' + imgName;

    fs.writeFile(`./public/logos/${imgName}`, base64Data, 'base64', function(err) {
      console.log(err);
    });
  }
  return url
}

const generatePdfFromUrl = async (pdfData, fileName) => {
  try {
    const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/generate-pdf-invoice', { waitUntil: ['domcontentloaded', 'networkidle0', 'load'] });
    await page.evaluate((data) => {
      localStorage.setItem("invoiceValues", JSON.stringify(data.pdfData))
    },{ pdfData: pdfData })
    await page.goto('http://localhost:3000/generate-pdf-invoice', { waitUntil: ['domcontentloaded', 'networkidle0', 'load'] });
    await page.pdf({ path: `public/pdfs/${fileName}.pdf`, format: 'A4', printBackground: true, margin: { top: 30, bottom: 30 } });
    await browser.close();
    
    return { url: `http://127.0.0.1:8080/pdfs/${fileName}.pdf`, fileName: `${fileName}.pdf` }

  } catch (err) {
    console.log(err);
    return err;
  }
}


const helperUtils = {
  getInclude,
  getWhereQuery,
  getOrderQuery,
  getPagination,
  getResponseData,
  getLogoUploadUrl,
  generatePdfFromUrl
};

module.exports = helperUtils;