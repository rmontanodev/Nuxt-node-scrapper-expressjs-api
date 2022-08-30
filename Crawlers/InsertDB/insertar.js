const credentials = require( './credentials/credentials')
const mysql = require('mysql')
var connection = mysql.createConnection({
    host     : credentials.credenciales.host,
    user     : credentials.credenciales.user,
    password : credentials.credenciales.password,
    database : credentials.credenciales.database
  });
module.exports = {
    nuevoproducto: function(producto) {
		return new Promise((resolve, reject) => {
            let category_id = 5
            connection.query('select id from category where name LIKE ?','%'+producto.gamma+'%',(err,results)=>{
                if(err)console.log("error category_id")
                else{
                    console.log(results)
                    if(results.length === 0){
                        category_id = 1
                    }
                    else{
                        category_id = results[0].id
                    }
                }
            })
            let brand_id = 1
            connection.query('select id from brand where name LIKE ?','%'+producto.marca+'%',(err,results)=>{
                if(err) console.log("error brand_id")
                else{
                    if(results.length === 0){
                        connection.query('insert into brand(name) values (?)',producto.marca,(err,results)=>{
                            if(err)console.log("Error al insertar marca")
                            else{
                                console.log("Nueva marca insertada")
                                brand_id = producto.marca
                            }
                        })
                    }
                    else{
                        brand_id = results[0].id
                    }
                }
            })
			connection.query(
				'INSERT INTO products(serialNumber,subcategory_id,category_id,brand_id,model,img) VALUES(?,?,?,?,?,?)',
				[producto.SerialNumber,2,category_id,brand_id,producto.model,producto.img],
				(err, res) => {
					if (err) reject(err)
					else {
                        connection.query('select id from products where SerialNumber = ?',producto.SerialNumber,(err,results)=>{
                            if(err) console.log('ERROR AL OBTENER PRODUCT_ID')
                            else{
                                resolve(results[0].id)
                            }
                        })
					}
				}
			)
		})
	}

}