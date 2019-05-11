const request = require("request");
const jsdom = require("jsdom");
const query = require("query-string");
const { JSDOM } = jsdom;

const shopIdsByUsername = "https://shopee.vn/api/v1/shop_ids_by_username/";

const getPage = url => {
  return new Promise((res, rej) => {
    request(
      {
        url: url,
      },
      (error, response, body) => {
        if (error || response.statusCode != 200) {
          return rej(error);
        }
        const cookie = response.headers["set-cookie"];
        return res(cookie);
      }
    );
  });
};
const getMatchCookie = item => {
  const regex = /[^;]*/gm;
  const match = regex.exec(item);
  return match[0];
};

const convertCookieToJson = (arr, item) => {
  item = item.replace(/"/gi, "");
  const arrSplit = item.split("=");
  arr[arrSplit[0]] = arrSplit[1];
  return arr;
};

const getCookieGlobal = cookie => {
  let arr = {};
  const cookieString = cookie.reduce((result, item, index) => {
    if (index == 1) {
      const temp = getMatchCookie(result);
      arr = convertCookieToJson([], temp);
      result = temp + ";";
    }
    const match = getMatchCookie(item);
    arr = convertCookieToJson(arr, match);
    return (result += match + ";");
  });
  return {
    cookie: cookieString,
    cookieArray: arr,
  };
};

const getCookie = urlShop => {
  return new Promise(async (res, rej) => {
    try {
      const cookiePage = await getPage(urlShop);
      const result = getCookieGlobal(cookiePage);
      return res(result);
    } catch (error) {
      return rej(error);
    }
  });
};

const getUsername = url => {
  const regex = /https:\/\/shopee.vn\/(.*)/gm;
  const match = regex.exec(url);
  if (match && match[1]) {
    return match[1];
  }
  return "";
};
const getIdsByUsername = (urlShop, cookie) => {
  const headers = {
    cookie: cookie.cookie,
    origin: "https://shopee.vn",
    "x-csrftoken": cookie.cookieArray.csrftoken,
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36",
    referer: urlShop,
  };

  return new Promise((res, rej) => {
    const username = getUsername(urlShop);
    if (username == "" || username == undefined) {
      return rej("khong lay duoc username");
    }
    const dataString = '{"usernames":["' + username + '"]}';
    request(
      {
        url: shopIdsByUsername,
        headers: headers,
        body: dataString,
        method: "POST",
      },
      (error, response, body) => {
        if (error || response.statusCode != 200) {
          return rej(error);
        }
        const temp = JSON.parse(body);
        if (temp && temp.length > 0 && temp[0][username]) {
          const shopId = temp[0][username];
          return res(shopId);
        }
        console.log(error);
        return rej("khong lay duoc username");
      }
    );
  });
};

const getList = (cookie, idShop, page) => {
  const url  = "https://shopee.vn/api/v2/search_items/?by=pop&limit=30&match_id=" +
  idShop +
  "&newest="+page+"&order=desc&page_type=shop"
  return new Promise((res, rej) => {
    request(
      {
        url: url,
        headers: {
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36",
          cookie: cookie.csrftoken,
        },
      },
      (error, response, body) => {
        if (error || response.statusCode != 200) {
          return rej(error);
        }
        return res(JSON.parse(body));
      }
    );
  });
};

const viewPage = (idShop, idItem, cookie) => {
  const getDate = Date.now();
  const body = [
    null,
    null,
    '"' + cookie.SPC_T_ID + '"',
    null,
    null,
    5,
    3,
    [
      [
        null,
        idItem,
        idShop,
        null,
        false,
        false,
        null,
        null,
        null,
        null,
        [],
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ],
    ],
    getDate,
    "VN",
    '"' + cookie.SPC_T_IV + '"',
    null,
    [],
  ];
  return new Promise((res, rej) => {
    request(
      {
        url: "https://shopee.vn/__t__",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36",
        },
        body: JSON.stringify(body),
        method: "POST",
      },
      (error, response, body) => {
        if (error) {
          return rej(error);
        }
        return res(response.statusCode);
      }
    );
  });
};

const main = async url => {
  try {
    const cookie = await getCookie(url);
    const idShop = await getIdsByUsername(url, cookie);
    console.log("start view shop id: " + idShop + " .....Link : " + url);

    let count  = 0;
    let itemsPage = [];
    while(true){
      const list = await getList(cookie.cookieArray, 
        idShop, count);
      list.items.forEach(item => {
        itemsPage.push(item);
      });
      count +=  30;
      if(list.items.length < 30){
        break
      }
    }
    console.log(itemsPage.length);
    itemsPage.forEach(async item => {
      console.log(
        "view item: " +
          item.itemid +
          " ... Link: https://shopee.vn/product/" +
          idShop +
          "/" +
          item.itemid
      );
      await viewPage(idShop, item.itemid, cookie.cookieArray);
    });
    console.log("end view shop id: " + idShop + " .....Link : " + url);
  } catch (error) {
    console.log("Error view ");
    console.log(error);
  }
};

 main('https://shopee.vn/applecare96');
// module.exports = ma;
