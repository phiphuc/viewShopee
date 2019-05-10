var request = require('request');

var headers = {
    'cookie': 'SPC_IA=-1;SPC_EC=-;SPC_F=eEIEtiSoXlWzySn7BiEkw8XMYyrPNWEy;REC_T_ID=86d721be-7331-11e9-8c3e-3c15fb7e9a09;SPC_T_ID="cQ0JKXlb4mcD1wo4rGbdfXTMzxEx7tWo0LNPP3T9GsrDix1OERqCw+Z7FFRXGuXWjBFMIhMgynNJCRpmhA7QxBGAo2WUQRM20W1KfAVXCEk=";SPC_SI=n8v60mleashc9akbp2ztii2xi9l42rtx;SPC_U=-;csrftoken=RyEiLWiXT0AYPZANnsQOqKOIRAEAfUaD;SPC_T_IV="BcW/zqfvFwVXU/NX+S62rA=="',
    'origin': 'https://shopee.vn',
    'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
    'x-requested-with': 'XMLHttpRequest',
    'if-none-match-': '55b03-d0be05bfdc21d0e95ba8f58f7fc98f71',
    'x-csrftoken': 'RyEiLWiXT0AYPZANnsQOqKOIRAEAfUaD',
    'pragma': 'no-cache',
    'cache-control': 'no-cache',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36',
    'content-type': 'application/json',
    'accept': 'application/json',
    'referer': 'https://shopee.vn/nguyenphucanh94',
    'authority': 'shopee.vn',
    'x-api-source': 'pc'
};

var dataString = '{"usernames":["nguyenphucanh94"]}';

var options = {
    url: 'https://shopee.vn/api/v1/shop_ids_by_username/',
    method: 'POST',
    headers: headers,
    body: dataString
};

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body);
    }
}

request(options, callback);
