const request = require('request');
const jsdom = require("jsdom");
const query = require('query-string');
const {
    JSDOM
} = jsdom;

const shopIdsByUsername = 'https://shopee.vn/api/v1/shop_ids_by_username/';

const getCookie = (url) => {
    return new Promise((res, rej) => {
        request({
            url: url
        }, (error, response, body) => {
            if (error || response.statusCode != 200) {
                return rej(error);
            }
            const cookie = response.headers['set-cookie'];
            return res(cookie);
        })
    })
}
const getMatchCookie = (item) => {
    const regex = /[^;]*/gm;
    const match = regex.exec(item);
    return match[0];
}

const convertCookieToJson = (arr, item) => {
    const arrSplit = item.split("=");
    arr[arrSplit[0]] = arrSplit[1];
    return arr;
}


const getIdsByUsername = (urlShop, cookie) => {
    let arr = {};
    const cookieString = cookie.reduce((result, item, index) => {
        if (index == 1) {
            const temp = getMatchCookie(result)
            arr = convertCookieToJson([], temp);
            result = temp + ";"
        }
        const match = getMatchCookie(item);
        arr = convertCookieToJson(arr, match);
        return result += match + ";";
    });


    // console.log(cookie);
    // console.log(cookieString);
    const headers = {
        'cookie': cookieString,
        'referer': urlShop,
        'x-csrftoken': arr.csrftoken,
        'Content-Type': 'text/plain'
    }
    const body = {
        usernames: ['kieungoc']
    }
    return new Promise((res, rej) => {
        request({
            url: shopIdsByUsername,
            headers: headers,
            body: JSON.stringify({
                "usernames": ["kieungoc"]
            }),
            method: 'POST'
        }, (error, response, body) => {
            console.log(body);
            return res({
                data: body,
                cookie: cookieString,
                cookieObj: arr
            });
        })
    })
}

const getUrlListItem = (id) => {
    return 'https://shopee.vn/api/v2/search_items/?by=pop&limit=30&match_id=' + id + '&newest=0&order=desc&page_type=shop'
}

const getList = (cookie, url) => {
    return new Promise((res, rej) => {
        request({
            url: url,
            headers :{
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36',
                'cookie': cookie.csrftoken,
            }
        }, (error, response, body) => {
            if(error || response.statusCode != 200){
                return rej(error);
            }

            return res(JSON.parse(body));
            
        })
    })

}

const main = async () => {
    const urlShop = 'https://shopee.vn/kieungoc';
    const cookie = await getCookie(urlShop);

    const idShopTemp = await getIdsByUsername(urlShop, cookie);
    const idShop = 1481792;
    const urlListItem = await getUrlListItem(idShop);
    const list = await getList(idShopTemp.cookieObj, urlListItem);
    console.log(list);

}
main();


// var headers = {
//     'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36',
//     'cookie': 'SPC_IA=-1; SPC_EC=-; SPC_F=OHfOpbsFQ30421tMJ3A877kI5zvceMEO; REC_T_ID=267fb904-7230-11e9-a509-3c15fb3af3e9; SPC_T_ID="6Ti+IaP9Um9sK1mDcQGBGPxMrkYfy+nIaTq9tgGrVslacvZDReuf/eMTImiLMCwblipIVlKNNnK8J1vn6zC9nbZjJ92HJXQ45AfGFa6bZos="; SPC_SI=68rm8yoms87dmiyr4uu9z9b3hyhnbpvv; SPC_U=-; SPC_T_IV="TZ+KIExtD83ouf+qm+Sj/A=="; _gcl_au=1.1.1583749137.1557388675; _fbp=fb.1.1557388675695.1062353757; csrftoken=ku1vNQ3vSAFRJ1li6wqeMIhKuWFjxj8y; REC_MD_20=1557392771; AMP_TOKEN=%24NOT_FOUND; _dc_gtm_UA-61914164-6=1',
// };

// var options = {
//     url: 'https://shopee.vn/api/v2/search_items/?by=pop&limit=30&match_id=1481792&newest=0&order=desc&page_type=shop',
//     headers: headers
// };

// function callback(error, response, body) {
//     if (!error && response.statusCode == 200) {
//         console.log(body);
//     }
// }

// request(options, callback);
