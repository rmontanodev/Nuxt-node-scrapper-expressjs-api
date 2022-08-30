var cheerio = require('cheerio')
var axios = require('axios')

module.exports = {
    Pccomponentes: function (url) {
        return new Promise(async (resolve, reject) => {
            await axios
                .get(url)
                .then((res) => {
                    let infoproducto = {}
                    const $ = cheerio.load(res.data)
                    infoproducto.url = url
                    infoproducto.price = parseFloat($('div.precioMain.h1').attr('data-price'))
                    infoproducto.model = $('.articulo').text()
                    // infoproducto.reviews = $('#article-hlink-comments').text()
                    // if (infoproducto.reviews.includes('Opina')) {
                    //     infoproducto.reviews = 'Sin opiniones'
                    // }
                    infoproducto.rating =
                        parseFloat($('div.rating-stars').attr('style').replace('width: ', '').replace('%', '')) / 20
                    infoproducto.SerialNumber = $('span[content]').attr('content')
                    let cadena = $('.col-xs-12.col-sm-9').text()
                    let principio = cadena.indexOf('Desde') + 6
                    let final = cadena.indexOf('€')
                    let enviotemp
                    if (cadena.substr(principio, final - principio).includes(',')) {
                        enviotemp = cadena.substr(principio, final - principio).replace(',', '.')
                    }
                    infoproducto.sendprice = parseFloat(enviotemp)
                    // infoproducto.stock = $('span#enstock').text()
                    let img = $('.pc-com-zoom.img-fluid').attr('src')
                    infoproducto.img = 'https://' + img.replace('//', '')
                    infoproducto.gamma = l = $('[class="GTM-breadcumb"]').map((i,x)=>$(x).text()).splice(1)
                    infoproducto.marca = $('[itemprop="brand"]').text()
                    infoproducto.totalprice = infoproducto.price + infoproducto.sendprice
                    resolve(infoproducto)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },
    Xtremmedia: function (url) {
        return new Promise(async (resolve, reject) => {
            var config = {
                proxy: {
                    host: proxy.ip,
                    port: proxy.port
                }
            }
            await axios
                .get(url)
                .then((res) => {
                    let infoproducto = {}
                    const $ = cheerio.load(res.data)
                    infoproducto.url = url
                    if ($('.article-list-avisame').text().length > 1) {
                        infoproducto.precio = "no disponible"
                    } else {
                        infoproducto.precio = parseFloat($('span[itemprop="price"]').attr('content'))
                    }
                    infoproducto.modelo = $('span[itemprop="name"]').text()
                    // infoproducto.reviews = $('#article-hlink-comments').text()
                    // if (infoproducto.reviews.includes('Opina')) {
                    //     infoproducto.reviews = 'Sin opiniones'
                    // }
                    infoproducto.rating =
                        ($('.ficha-estrellas').text()).trim()
                    infoproducto.sn = $('div.identifier.ficha-partnumber').attr('content')
                    if ($('.article-list-con_stock-aux2')) {
                        infoproducto.envio = $('.article-list-con_stock-aux2').text()
                    } else {
                        infoproducto.envio = $('.article-list-sin_stock').text()
                    }
                    // infoproducto.stock = $('span#enstock').text()
                    infoproducto.img = $('.image').attr('src')
                    infoproducto.gamma = $('#migdepan').text()
                    infoproducto.marca = $('[itemprop="brand"]').text()
                    // infoproducto.preciototal = infoproducto.precio + infoproducto.envio
                    resolve(infoproducto)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }


}