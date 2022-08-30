const puppeteer = require('puppeteer')
const fs = require('fs')
const filtros = require('./Xtremmedia-filtros.js')
let fecha = new Date()
var exportar = require('../Methods/Markdown/markdown')
const extractInfo = require('../ExtractInfo/general.js')
const async = require('async')
var flatten = require('lodash.flatten')
var nombres = ['procesadores', 'tarjetas-graficas', 'discos-duros', 'memorias-ram']
var today = new Date()
var horastart
var days = 1
let enlaces = function (nombre, browser) {
	return new Promise(async (resolve, reject) => {
		try {
			const page = await browser.newPage()
			await page.setRequestInterception(true)
			page.on('request', (request) => {
				if (request.resourceType() === 'image') request.abort()
				else request.continue()
			})
			var enlace = filtros.filtrar(nombre)
			await page.goto(enlace, {
				waitUntil: 'load',
				timeout: 0
			})
			await page.setViewport({
				width: 1200,
				height: 800
			})

			const enlaces = await page.evaluate(() => {
				let hrefs = []
				const todo = document.querySelectorAll('.article-list')
				todo.forEach((item) => {
					var eenlace = item.querySelector('.article-list-titulo a').getAttribute('href')
					var enlacedef = eenlace.substr(1, eenlace.length)
					let enlace = 'https://xtremmedia.com' + enlacedef
					hrefs.push(enlace)
				})
				console.log(hrefs)
				return hrefs
			})
			await page.close()
			resolve(enlaces)
		} catch (e) {
			reject(e)
		}
	})
}
// async function extractInfo(url, browser, array, next, index, datos) {
// 	const page = await browser.newPage()
// 	// await page.setRequestInterception(true)
// 	// page.on('request', (request) => {
// 	// 	if (request.resourceType() === 'image') request.abort()
// 	// 	else request.continue()
// 	// 	if (request.resourceType() === 'script') request.abort()
// 	// 	else request.continue()
// 	// })
// 	await page.setViewport({
// 		width: 1200,
// 		height: 800
// 	})
// 	console.log(url)
// 	await page.goto(url, {
// 		waitUntil: 'load',
// 		timeout: 0
// 	})
// 	let PcSpec = await page.evaluate(() => {
// 		let PcSpecs = {}
// 		try {
// 			let pd = document.querySelector('div.identifier.ficha-partnumber').innerText
// 			PcSpecs.productID = pd.replace('P/N: ', '')
// 			PcSpecs.marca = document.querySelector('[itemprop="brand"]').innerText
// 			PcSpecs.modelo = document.querySelector('.name').innerText
// 			PcSpecs.price = document.querySelector('[itemprop="price"]').getAttribute('content')
// 			PcSpecs.img = document.querySelector('[itemprop="image"]').getAttribute('src')
// 			let envio = document.querySelector('.article-list-con_stock-aux2').innerText
// 			let stock = document.querySelector('.article-list-con_stock').innerText
// 			PcSpecs.enviollegada = envio + ' ' + stock
// 			let b = document.querySelector('.article-megusta.ptabs span').innerText
// 			PcSpecs.reviews = b.split('(').join('').split(')').join('')
// 			let a = document.querySelector('.ficha-estrellas div').getAttribute('class')
// 			PcSpecs.rating = a.split('article-estrellas').join('')
// 			PcSpecs.gamma = document.querySelector('#migadepan a').innerText
// 		} catch (e) {}
// 		return PcSpecs
// 	})
// 	PcSpec.provedor = 'xtremmedia'
// 	PcSpec.url = url
// 	PcSpec.origen = 'xtremmedia'
// 	if (PcSpec.price == null) {
// 		PcSpec.price = 0
// 	}
// 	console.log(PcSpec)
// 	array.push(PcSpec)
// 	console.log('Enlace nº' + index + ' / ' + datos.length)
// 	await page.close()
// 	next()
// }

function urls(browser) {
	return new Promise((resolve, reject) => {
		Promise.all(nombres.map((nombre) => enlaces(nombre, browser)))
			.then((results) => resolve(flatten(results)))
			.catch((err) => reject(err + ' no ha ido bien'))
	})
}

async function main() {
	let ardev = []
	const browser = await puppeteer.launch({
		headless: false
		//args: ['--proxy-server=']
	})
	return new Promise((resolve, reject) => {
		urls(browser)
			.then((datos) => {
				browser.close()
				horastart = new Date(today.getTime() + days * 24 * 60 * 60 * 1000)
				async.eachOfLimit(
					datos,
					25,
					async function (item, key, next) {
							await extractInfo.Xtremmedia(item).then((response) => {
								ardev.push(response)
								console.log('Link => ' + item + ' scrapeado, vamos por ' + key + ' / ' + datos.length)
								console.log(response)
								next
							})
						},
						(error) => {
							if (error) reject(error)
							else {
								resolve(ardev)
							}
						}
				)
			})
			.catch((err) => {
				console.log(err)
			})
	})
}
main()
	.then((res) => {
		console.log(res)
		var datosJSON = JSON.stringify(res)
		fs.writeFile(`./../Json/Xtremm-${fecha.getFullYear()}-${fecha.getMonth()}-${fecha.getDate()}`, datosJSON, function (
			err
		) {
			if (err) {
				console.log(err)
			}
		})
		console.log('datos.json creado!')
		var today2 = new Date()
		let horafin = new Date(today2.getTime() + days * 24 * 60 * 60 * 1000)
		exportar.exportar(horastart, horafin, res.length)
		// axios
		// 	.post('http://localhost:3902/json/insertar', {
		// 		info: res,
		// 		origen: 'Xtrem-'
		// 	})
		// 	.then((res) => {
		// 		console.log('todo perf bro')
		// 		console.log(res)
		// 	})
		// 	.catch((err) => {
		// 		console.log('error:')
		// 		console.log(err)
		// 	})
	})
	.catch((err) => console.log('ha dado error : ' + err))