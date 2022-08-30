const credentials = require( './credentials/credentials')
const mysql = require('mysql')
const insertar = require('./insertar.js')
var connection = mysql.createConnection({
    host     : credentials.credenciales.host,
    user     : credentials.credenciales.user,
    password : credentials.credenciales.password,
    database : credentials.credenciales.database
  });
module.exports = {
    insertaroffer: function(productos){
        let testopiniones = /Opin/g
        for (const producto of productos) {
            
            if (producto.price == null) {
                producto.price = 0
            }
            if (producto.SerialNumber == null) {
                producto.SerialNumber = 'nodaba'
            }
    
            let rating = parseFloat(producto.rating) / 100 * 5
            connection.query('select serialNumber from products where serialNumber = ?', [producto.SerialNumber], function (err, results) {
                if (err) console.log(err)
                else {
                    if (results.length === 0) {
                        insertar.nuevoproducto(producto)
                            .then((res) => {
                                console.log(res)
                                connection.query(
                                    'INSERT INTO offers (product_id,price,sendPrice,totalPrice,rating,url) VALUES (?,?,?,?,?,?)',
                                    [
                                        res,
                                        producto.price,
                                        producto.sendprice,
                                        producto.totalprice,
                                        rating,
                                        producto.url
                                    ],
                                    function (err, res) {
                                        if (err) {
                                            console.log('Ha ido mal ' + err)
                                        } else {
                                            console.log('Info insertada')
                                        }
                                    }
                                )
                            })
                            .catch((err) => {
                                console.log(err)
                            })
                    } else {
                        connection.query('select id from products where serialNumber = ?',producto.SerialNumber,(err,results)=>{
                            if(err) console.log('ERROR AL OBTENER PRODUCT_ID')
                            else{
                                connection.query(
                                    'INSERT INTO offers (product_id,price,sendPrice,totalPrice,rating,url) VALUES (?,?,?,?,?,?)',
                                            [
                                                results[0].id,
                                                producto.price,
                                                producto.sendprice,
                                                producto.totalprice,
                                                rating,
                                                producto.url
                                            ],
                                    function (err, res) {
                                        if (err) {
                                            console.log('Ha ido mal ' + err)
                                        } else {
                                            console.log('Info insertada')
                                        }
                                    }
                                )
                            }
                        })
                        
                    }
                }
            })
    }
}
}