const URL = "https://www.sacramento365.com/";
const puppeteer = require("puppeteer");
// const xlsx = require("xlsx");

(async () => {
  const menuOptions = [
    ".menu-cultural",
    ".menu-film",
    ".menu-local-marketplace",
  ];
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(URL);

  for (let i = 0; i < 3; i++) {
    await page.hover(".menu-festivals");
    await page.click(menuOptions[i]);
    await page.waitForSelector(".category-itm");

    const enlaces = await page.evaluate(() => {
      const elements = document.querySelectorAll(".category-itm h2 a");

      const links = [];
      for (let element of elements) {
        links.push(element.href);
      }
      return links;
    });

    await getData(enlaces, menuOptions[i], page);
  }

  await browser.close();
})();

async function getData(enlaces, menuOptions, page) {
  const events = [];

  for (let enlace of enlaces) {
    await page.goto(enlace);
    await page.waitForSelector(".p-ttl");

    const evento = await page.evaluate((cat) => {
      const tmp = {};
      tmp.title = document.querySelector(".p-ttl").innerText;
      tmp.fech = document.querySelector(".ind-time").innerText;
      tmp.venue = document.querySelector(".locatn b").innerText;
      tmp.locations = document.querySelector(".locatn p").textContent;
      tmp.category = document.querySelector(cat).innerText;
      return tmp;
    }, menuOptions);

    events.push(evento);
  }
  // Excel
  //   const wb = xlsx.utils.book_new();
  //   const ws = xlsx.utils.json_to_sheet(events);
  //   xlsx.utils.book_append_sheet(wb, ws);
  //   xlsx.writeFile(wb, "data.xlsx");

  console.log(events);
}
