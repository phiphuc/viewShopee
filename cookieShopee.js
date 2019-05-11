const request = require('request');

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
  
  const getCookie = () => {
    return new Promise(async (res, rej) => {
      try {
        const cookiePage = await getPage('https://shopee.vn/nguyenphucanh94');
        const result = getCookieGlobal(cookiePage);
        return res(result);
      } catch (error) {
        return rej(error);
      }
    });
  };

  module.exports = getCookie;