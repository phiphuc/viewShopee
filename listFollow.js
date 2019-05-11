//https://shopee.vn/shop/76523126/followers/?__classic__=1

const request = require('request');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const main = (id) => {
    const url = 'https://shopee.vn/shop/'+id+'/followers/?__classic__=1'
    return new Promise((res,rej) => {
        request({
            url: url, 
            headers:{
            'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'
        }}, (error, response, body) => {
            if(error){
                return rej({code: 1,error: error});
            }
            if(response.statusCode != 200){
                return rej({code: 1,error: response.statusCode,  message: body})
            }
            const dom = new JSDOM(body);
            let domListFollow = dom.window.document.querySelectorAll('#shop-followers > ul > li');
            domListFollow = [... domListFollow];
            const inforFollow = domListFollow.map(item => {
                const shopId = item.getAttribute('data-follower-shop-id');
                const userId = item.getElementsByTagName('a')[0].getAttribute('userid');
                const username = item.getElementsByTagName('a')[0].getAttribute('userid');
                const linkShop = item.getElementsByTagName('a')[0].getAttribute('href');
                return {shopId: shopId, userId: userId, username: username, linkShop: linkShop};
            })
            return res({code: 0,data: inforFollow})
            //#shop-followers > ul
            
        })
    })
}

// main(76523126);
module.exports = main