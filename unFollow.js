const puppeteer = require("puppeteer");
const iPhone = puppeteer.devices['iPhone 6'];
main = async ( username, password, shopID) => {
  const browser = await puppeteer.launch({
    args: ["--incognito"],
    headless: false,
    args: [
      "--disable-dev-shm-usage",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-popup-blocking"
    ],
    env: {
      TZ: '	Asia/Ho_Chi_Minh',
    }
  });
  //const browser = await browserTemp.createIncognitoBrowserContext();
  console.log("Browser openned");
  const page = await browser.newPage();
  await page.emulate(iPhone);
  
  await page.goto('https://shopee.vn/buyer/login/', {waitUntil: 'domcontentloaded'});
  // await page.waitForNavigation({ waitUntil: 'networkidle0' }),
  page.setDefaultTimeout(180000);
  
  await page.waitFor('#login > div.v-center > div:nth-child(1) > input');
  await page.focus('#login > div.v-center > div:nth-child(1) > input');
  await page.type('#login > div.v-center > div:nth-child(1) > input',username);
  await page.focus('#login > div.v-center > div:nth-child(2) > input');
  await page.type('#login > div.v-center > div:nth-child(2) > input',password);
  await page.focus('#btn_login');
  await page.click('#btn_login');
  await page.waitForNavigation();

  const urlShop = 'https://shopee.vn/shop/'+shopID+'/following/';
  await page.goto(urlShop);
  await page.waitFor('#shop-followers#shop-followers > ul > li > div.btn-follow.follow.L14.active');

  await autoScroll(page);

  let pageFollow =  await page.evaluate(() => {
    let pageFollow = document.querySelectorAll('#shop-followers div.btn-follow.active.follow.L14');
    pageFollow = [...pageFollow];
    return pageFollow;
  });

  for (let i = 1; i < pageFollow.length +1;i++){
    await sleep(5000);
    const temp = '#shop-followers > ul > li:nth-child('+i+') > div.btn-follow.active.follow.L14';
    await page.click(temp);
  }
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
async function autoScroll(page){
  await page.evaluate( async() => {
      await new Promise( (resolve, reject) => {
          var totalHeight = 0;
          var distance = 100;
          var timer = setInterval(() => {
              var scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;

              if(totalHeight >= scrollHeight){
                  clearInterval(timer);
                  resolve();
              }
          }, 100);
      });
  });
}

main('nguyenphucanh94@gmail.com', 'Phiphuc1994@','144010383');
