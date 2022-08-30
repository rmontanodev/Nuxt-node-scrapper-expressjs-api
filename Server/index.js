var express = require('express')
var app = express()
var jwt = require('jsonwebtoken')
var mysql = require('mysql')
var path = require('path')
const cors = require('cors')
var cred = require('./credenciales/credjwt.js')
var bodyParser = require('body-parser')
var credenciales = require('./credenciales/credenciales.js')
var nodemailer = require('nodemailer')
var multer = require('multer')
var credemail = require('./credenciales/credencialesmail.js')
var sha1 = require('sha1')
const url = require('url')
const download = require('image-downloader')
app.use(bodyParser.json({
	limit: '30mb',
	extended: true
}))
app.use(bodyParser.urlencoded({
	limit: '30mb',
	extended: true
}))

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
	next()
})
var transporter = nodemailer.createTransport({
	port: 25,
	secure: false,
	tls: {
		rejectUnauthorized: false
	},
	service: 'gmail',
	auth: {
		user: credemail.info.usuario,
		pass: credemail.info.password
	}
})
var r1 = express.Router()
r1.get('/imagenes', function (req, res, next) {
	next()
})
//cuidao
app.use(cors())
app.use((req, res, next) => {
	const path = url.parse(req.url).pathname
	console.log(path)
	console.log(req.body.token)
	//No JWT token check
	if (/^\/register/.test(path)) {
		jwtTokenValidate(req.body.token)
		return next()
	}
	if (req.body.token) {
		jwtTokenValidate(req.body.token)
		return next()
	} else {
		return next()
	}
})
app.use('/imagenes', express.static(path.join(__dirname, 'public/uploads')))
//Creamos conexion
var connection = mysql.createConnection({
	host: credenciales.info.host,
	user: credenciales.info.user,
	password: credenciales.info.password,
	database: credenciales.info.database
})
var connection2 = mysql.createConnection({
	host: credenciales.info.host,
	user: credenciales.info.user,
	password: credenciales.info.password,
	database: credenciales.info.database2
})

function comprobarprecios() {
	connection.query(
		'select cp.id,cp.idcons,cp.sn,cp.price,c.email from consumerprodalert cp,customers c where cp.idcons = c.id',
		(err, results) => {
			if (err) console.log(err)
			else {
				results.forEach((cliente) => {
					connection.query(
						'select pp.provedor,pp.url,pp.price,p.modelo from productos_precio pp, productos p where p.sn = pp.idprod and pp.idprod = ? and fecha = CURDATE() order by pp.price asc',
						cliente.sn,
						(err, results) => {
							if (err) console.log(err)
							else {
								results.forEach((precio) => {
									let preciocliente = parseFloat(cliente.price)
									let precioproducto = parseFloat(precio.price)
									if (precioproducto <= preciocliente) {
										var mailOptions = {
											from: credemail.info.usuario,
											to: cliente.email,
											subject: 'El producto ' +
												precio.modelo +
												' ha bajado de ' +
												preciocliente +
												' !',
											text: 'El producto ' +
												precio.modelo +
												' tiene un precio de: ' +
												precioproducto +
												' en la pagina ' +
												precio.provedor +
												' , enlace al producto => ' +
												precio.url +
												' \n Se ha eliminado ' +
												precio.modelo +
												' de su lista de avisos'
										}
										transporter.sendMail(mailOptions, function (error, info) {
											if (error) {
												console.log('Error =( ' + error)
											} else {
												console.log('Email sent: ' + info.response)
											}
										})
										connection.query(
											'DELETE FROM consumerprodalert where id = ? ',
											cliente.id,
											(err) => {
												if (err) console.log(err)
												else {
													console.log('buscador ' + cliente.id + ' finalizado y borrado')
												}
											}
										)
									}
								})
							}
						}
					)
				})
			}
		}
	)
}
//La idea para comprobar si una imagen esta descargada de un producto es la siguiente: En el primer insert de un producto nuevo
function comprobarimagenes() {
	connection.query('select sn,imgtodo from imgtodo where descargado = 0 ', (err, results) => {
		if (err) console.log(err)
		else {
			if (results.length !== 0) {
				results.forEach((element) => {
					let ruta
					ruta = element.sn
					if (element.sn.includes('/')) {
						ruta = element.sn.split('/').join('')
					}
					let options = {
						url: element.imgtodo,
						dest: './public/uploads/' + ruta + '.jpg' // Save to /path/to/dest/photo.jpg
					}
					download
						.image(options)
						.then(({
							filename
						}) => {
							console.log(filename)
							connection.query('UPDATE imgtodo SET descargado = 1 WHERE sn = ?', element.sn, (err) => {
								if (err) console.log(err)
								else {
									console.log(element.sn + ' descargado y updateado')
								}
							})
							let rutaimg = 'http://localhost:3902/imagenes/' + ruta + '.jpg'
							connection.query(
								'UPDATE productos SET img = ? where sn = ?',
								[rutaimg, element.sn],
								(err) => {
									if (err) console.log(err)
									else {
										console.log(element.sn + ' updated productos')
									}
								}
							)
						})
						.catch((err) => {
							if (err.message.includes('404')) {
								connection.query(
									'UPDATE imgtodo,productos SET productos.img = "No image",imgtodo.descargado = 1 where productos.sn = ?',
									element.sn,
									(err) => {
										if (err) console.log(err)
										else console.log(element.sn + ' no tiene imagen')
									}
								)
							}
						})
				})
				console.log('hola')
			} else {
				console.log('Nada que descargar...')
			}
		}
	})
}
//Ejecuta la funcion comprobarimagenes para descargar las imagenes de los nuevos productos cada X tiempo(200 segundos)
setInterval(comprobarimagenes, 200000)
//Ejecuta la funcion comprobar precios cada X tiempo (300 segundos)
setInterval(comprobarprecios, 300000)

function insertarfirst(producto) {
	return new Promise(async (resolve, reject) => {
		await connection.query(
			'INSERT INTO productos(sn,modelo,marca,gamma,img) VALUES(?,?,?,?,?)',
			[producto.productID, producto.modelo, producto.marca, producto.gamma, producto.img],
			(err, res) => {
				if (err) reject(err)
				else {
					connection.query(
						'INSERT INTO imgtodo(sn,imgtodo) VALUES(?,?)',
						[producto.productID, producto.img],
						(err, results) => {
							if (err) reject(err)
							else {
								resolve(producto)
							}
						}
					)
					console.log('Se ha añadido el siguiente producto: ' + producto.modelo)
				}
			}
		)
	})
}

function jwtTokenValidate(token) {
	if (token) {
		getToken(token)
			.then((response) => {
				req.decoded = response
				next()
			})
			.catch((err) => {
				return
			})
	} else {
		next()
	}
}
//Función para generar un nuevo token, en este se envia el userid
function generateToken(user) {
	var u = {
		userid: user
	}
	return (token = jwt.sign(u, cred.cred.passwd, {
		expiresIn: 60 * 60 * 24 // expira en 24 horas
	}))
}
//Función para obtener la información del token, esta función llama a checkToken
function getToken(token) {
	return new Promise((resolve, reject) => {
		//0-38 token, 78-128 token, 168-219 token
		let primerapartecr = token.substr(0, 38)
		let segundapartecr = token.substr(78, 50)
		let tercerapartecr = token.substr(168, 51)
		checkToken(primerapartecr + segundapartecr + tercerapartecr)
			.then((res) => {
				resolve(res)
			})
			.catch((err) => {
				reject(err)
			})
	})
}
//Esta función comprueba el token, si el token es invalido devolvera un error de token invalido, token expirado..., lo bueno es que la funcion jwt.decode() ya comprueba la expiración del token y otros posibles fallos
function checkToken(token) {
	return new Promise((resolve, reject) => {
		var decoded = jwt.decode(token, {
			complete: true
		}, (err) => {
			if (err) reject(err)
		})
		resolve(decoded.payload.userid)
	})
}
//   transporter.sendMail(mailOptions, function(error, info){
// 	if (error) {
// 	  console.log(error);
// 	} else {
// 	  console.log('Email sent: ' + info.response);
// 	}
//   });

// parse application/x-www-form-urlencoded
// parse application/json
//Esta función me sirve para crear tokens aleatorios(token para verificar cuenta,generar passwords..)
function makeid(length) {
	var time = Date.now()
	var digits = ('' + time).split('')
	var result = ''
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	var charactersLength = characters.length
	for (var i = 0; i < length; i++) {
		result += digits[i] + characters.charAt(Math.floor(Math.random() * charactersLength))
	}
	return result
}
//middleware
app.use(
	multer({
		dest: './public/uploads'
	}).single('image')
)

// }) else {
// 	connection.query(
// 		'SELECT min(pp.price) as minprice,p.img,p.modelo,ca.price from consumerprodalert ca, productos p,productos_precio pp WHERE idcons = ? and p.sn = ca.sn and ca.sn = pp.idprod and pp.fecha = CURDATE()',
// 		[ response.id ],
// 		(err, results) => {
// 			if (err) console.log(err)
// 			else console.log(results), res.send(results)
// 		}
// 	)
// }

app.post('/login', function (req, res) {
	connection.query(
		'select imgAvatar,email,id,idun,password from customers where password = ? and email = ? ',
		[sha1(req.body.password), req.body.email],
		(err, results) => {
			if (err) console.log('Error: ' + err)
			else {
				console.log(results.length + ' 1 es logeado')
				if (results.length === 0) {
					console.log('Login failed')
					res.json({
						login: false,
						message: 'Error al autentificar, no me gustan los hackers..'
					})
				} else {
					let token = generateToken(results[0].id, results[0].email, results[0].imgAvatar)
					let primeraparte = token.substr(0, 38)
					let segundaparte = token.substr(38, 50)
					let terceraparte = token.substr(88, 51)
					let tokenfinal =
						primeraparte + sha1(results[0].idun) + segundaparte + sha1(results[0].password) + terceraparte
					connection.query(
						'select DISTINCT p.sn,p.img,p.modelo,cp.price as PrecioCliente, c.imgAvatar,c.email,c.id,c.idun,c.password,pp.price FROM productos p, productos_precio pp,customers c,consumerprodalert cp where c.email = ? and c.password = ? and cp.idcons = c.id and cp.sn = pp.idprod and pp.idprod = p.sn',
						[req.body.email, sha1(req.body.password)],
						(err, resultss) => {
							if (err) console.log(err)
							else {
								console.log(results[0].email)
								let deseados = {}
								deseados.producto = []
								resultss.forEach((item, index) => {
									deseados.producto[index] = {}
									deseados.producto[index].img = item.img
									deseados.producto[index].precioCliente = item.PrecioCliente
									deseados.producto[index].precio = item.price
									deseados.producto[index].modelo = item.modelo
									deseados.producto[index].error = false
									deseados.producto[index].errormsg = ''
									deseados.producto[index].elprecio = item.price
									deseados.producto[index].sn = item.sn
								})
								console.log(deseados)
								res.json({
									token: tokenfinal,
									email: results[0].email,
									imgAvatar: results[0].imgAvatar,
									userid: results[0].id,
									productos: deseados
								})
							}
						}
					)
				}
			}
		}
	)
})
app.post('/updatepassword', function (req, res) {
	connection.query('select email from customers where password = ?', sha1(req.body.password), (err, results) => {
		if (err) {
			console.log(err)
			res.json({
				error: true,
				msg: 'error'
			})
		}
		if (results.length === 0) {
			console.log('password incorrecta')
			res.json({
				error: true,
				msg: 'contraseña incorrecta'
			})
		} else {
			connection.query(
				'UPDATE CUSTOMERS SET password = ? where password = ?',
				[sha1(req.body.newpasswd), sha1(req.body.password)],
				(err, results) => {
					if (err) {
						console.log(err)
						res.json({
							error: true,
							msg: 'error'
						})
					} else {
						console.log('Contraseña updateada!')
						res.json({
							error: false,
							msg: 'Contraseña actualizada!'
						})
					}
				}
			)
		}
	})
})
app.post('/updatemail', function (req, res) {
	connection.query('select email from customers where password = ?', sha1(req.body.password), (err, results) => {
		if (err) {
			console.log(err)
			res.send({
				error: true,
				msg: 'error'
			})
		} else {
			if (results.length === 0) {
				console.log('Contraseña incorrecta email')
				res.send({
					error: true,
					msg: 'Contraseña incorrecta'
				})
			} else {
				if (results[0].email === req.body.email) {
					console.log(req.body.email)
					res.send({
						error: true,
						msg: 'No puedes actualizar el mismo email =D'
					})
				} else {
					connection.query(
						'UPDATE customers set email = ? where email = ?',
						[req.body.email, req.body.emailantiguo],
						(err, results) => {
							if (err) {
								console.log(err)
								res.json({
									error: true,
									msg: 'error'
								})
							} else {
								console.log('email updateado')
								res.json({
									error: false,
									msg: 'email actualizado!'
								})
							}
						}
					)
				}
			}
		}
	})
})
app.get('/verify', function (req, res) {
	connection.query(
		'select tokenconfirmacion from customers where tokenconfirmacion = ?',
		[req.query.token],
		(err, results) => {
			if (err) console.log('Error ' + err)
			else {
				if (results.length === 0) {
					res.redirect('http://localhost:3000/error')
				} else if (results.length === 1) {
					connection.query(
						'update customers set activado = 1 where tokenconfirmacion = ?',
						[req.query.token],
						(err, results) => {
							if (err) console.log('Mala query ' + err)
							else console.log('updateado1')
						}
					)
					connection.query(
						'update customers set tokenconfirmacion = ?  where tokenconfirmacion = ?',
						['', req.query.token],
						(err, results) => {
							if (err) console.log('Mala query ' + err)
							else console.log('updateado2')
						}
					)
					res.redirect('http://localhost:3000/login')
				}
			}
		}
	)
})
app.post('/eliminarprod', function (req, res) {
	console.log(req.body.idcons + ' modelo => ' + req.body.sn)
	connection.query(
		'DELETE FROM consumerprodalert WHERE idcons = ? and sn = ?',
		[req.body.idcons, req.body.sn],
		(err, results) => {
			if (err) console.log(err)
			else {
				console.log('Sn: ' + req.body.sn + ' eliminado del usuario ' + req.body.idcons)
				res.json({
					deleted: true,
					msg: 'Se ha eliminado ' + req.body.modelo + ' correctamente!'
				})
			}
		}
	)
})
app.post('/registrame', function (req, res) {
	let tokenverify = makeid(Math.floor(Math.random() * 6) + 8)
	let generatedpswd = makeid(Math.floor(Math.random() * 6) + 8)
	var mailOptions = {
		from: credemail.info.usuario,
		to: req.body.email,
		subject: 'Email verification',
		text: 'Si desea abrir su cuenta pinxa o engancha este enlace: http://localhost:3902/verify?token=' +
			tokenverify +
			' \n se te ha assigando la siguiente contraseña: ' +
			generatedpswd
	}
	console.log(req.body.nombre)
	connection.query('select email from customers where email = ?', req.body.email, (err, results) => {
		if (err) console.log('Error: ' + err)
		else {
			console.log(results.length)
			if (results.length === 0) {
				connection.query(
					'INSERT INTO customers(idun,email,password,tokenconfirmacion,activado) VALUES (?,?,?,?,0)',
					[makeid(Math.floor(Math.random() * 6) + 8), req.body.email, sha1(generatedpswd), tokenverify],
					(err, results) => {
						if (err) console.log('Ha ido mal ' + err)
						transporter.sendMail(mailOptions, function (error, info) {
							if (error) {
								console.log('Error =( ' + error)
							} else {
								console.log('Email sent: ' + info.response)
							}
						})
						res.send({
							respuesta: 1
						})
					}
				)
			} else {
				res.send({
					respuesta: 0
				})
			}
		}
	})
})
//Insertar avisos
app.post('/deseado', function (req, res) {
	console.log(req.body.token)
	getToken(req.body.token)
		.then((response) => {
			connection.query('select * from consumerprodalert where idcons = ?', response, (err, results) => {
				if (err) console.log(err)
				else {
					console.log(results)
					let insertar = true
					results.forEach((item) => {
						console.log(item.sn + ' = ' + req.body.modelo)
						if (item.sn == req.body.modelo) {
							insertar = false
						}
					})
					console.log(insertar)
					if (insertar == true) {
						connection.query(
							'insert into consumerprodalert(idcons,sn,price) values (?,?,?)',
							[response, req.body.modelo, req.body.precio],
							function (error, results) {
								if (error) {
									console.log(error)
									res.send(error)
								} else {
									console.log('Producto añadido!')
									res.send(true)
								}
							}
						)
					} else {
						console.log('repetido')
						res.send(false)
					}
				}
			})
			//idusuario
			console.log(response)
		})
		.catch((err) => {
			console.log(err)
		})
})
//buscar producto unico
app.post('/json/buscar', function (req, res) {
	console.log('me han pedido info =O')
	let sn = req.body.modelo.sn
	connection.query(
		'SELECT pd.price,pd.provedor,pd.url,pd.envioprice,pd.enviollegada,pd.reviews,pd.rating,p.modelo,p.marca,p.img,p.sn from productos p, productos_precio pd where sn = ? and fecha = CURDATE() and pd.idprod = p.sn order by price',
		[sn],
		function (error, results) {
			if (error) console.log(error)
			else {
				console.log(results)
				res.json(results)
			}
		}
	)
})

//lista autocompletar
app.get('/json/autocompletar', function (req, res) {
	connection.query(
		'SELECT p.model,o.price,p.img,p.serialNumber FROM offers o,products p where p.id = o.product_id                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            ',
		function (err, results) {
			if (err) {
				res.json('Ha habido un error: ' + err)
			} else {
				console.log(results)
				res.json(results)
			}
		}
	)
})
app.get('/proxylist', (req, res) => {
	connection2.query('select ip from proxy where on_off = 1 and country = "es"', (err, results) => {
		if (err) {
			console.log(err)
		} else {
			res.json(results)
		}
	})
})
app.post('/json/insertar', (req, res) => {
	let testopiniones = /Opin/g
	let productos = req.body.info
	let provedor = req.body.origen
	for (const producto of productos) {
		let opiniones
		if (!testopiniones.test(producto.reviews)) {
			opiniones = producto.reviews + 'Opiniones'
		} else {
			if (producto.reviews.includes('Opina')) {
				opiniones = '0 Opiniones'
			} else {
				opiniones = producto.reviews
			}
		}
		console.log(producto)
		if (producto.price == null) {
			producto.price = 0
		}
		if (producto.productID == null) {
			producto.productID = 'nodaba'
		}

		let rating = parseFloat(producto.rating) / 100 * 5
		connection.query('select sn from productos where sn = ?', [producto.productID], function (err, results) {
			if (err) console.log(err)
			else {
				if (results.length === 0) {
					insertarfirst(producto)
						.then((res) => {
							console.log(res)
							connection.query(
								'INSERT INTO productos_precio (idprod,fecha,price,provedor,envioprice,enviollegada,reviews,rating,url) VALUES (?,CURDATE(),?,?,?,?,?,?,?)',
								[
									producto.productID,
									producto.price,
									provedor,
									producto.envioprice,
									producto.enviollegada,
									opiniones,
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
					connection.query(
						'INSERT INTO productos_precio (idprod,fecha,price,provedor,envioprice,enviollegada,reviews,rating,url) VALUES (?,CURDATE(),?,?,?,?,?,?,?)',
						[
							producto.productID,
							producto.price,
							provedor,
							producto.envioprice,
							producto.enviollegada,
							opiniones,
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
			}
		})
	}
	res.send('todo hecho cruck')
})
app.post('/jwt', (req, res) => {
	getToken(req.body.token)
		.then((response) => {
			if (response.id == null) {
				res.send('error')
			} else {
				connection.query(
					'Select email,imgAvatar from customers where id = ?',
					[response.id],
					(err, results) => {
						if (err) console.log(err)
						else console.log('gol'), res.send(results)
					}
				)
			}
		})
		.catch((err) => {
			res.send('error')
		})
})
app.listen(3902, function () {
	console.log('Example app listening on port 3902!')
})