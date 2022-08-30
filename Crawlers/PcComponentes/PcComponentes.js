const insertar = require( '../InsertDB/offers')
const puppeteer = require('puppeteer')
const fs = require('fs')
const scroll = require('../Methods/ScrollPage/autoscroll.js')
const async = require('async')
var flatten = require('lodash.flatten')
var exportar = require('../Methods/Markdown/markdown')
let fecha = new Date()
const extractInfo = require('../ExtractInfo/general.js')
var nombres = [
	// 'procesadores',
	// 'tarjetas-graficas',
	// 'memorias-ram',
	// 'fuentes-alimentacion',
	// 'placas-base',
	// 'discos-duros',
	// 'monitores-pc',
	// 'teclados',
	// 'ratones',
	'altavoces',
	'auriculares',
	// 'sillas-gaming',
	// 'mesas-gaming',
	// 'sais',
	// 'discos-duros-externos',
	// 'tarjetas-de-memoria',
	// 'proyectores',
	// 'memorias-usb-pendrive',
	// 'televisores',
	// 'videoconsolas-ps4',
	// 'juegos-ps4'
]
var today = new Date()
var horastart
var days = 1
let enlaces = async function (nombre, browser, array, next) {
	const page = await browser.newPage()
	await page.setRequestInterception(true)
	page.on('request', (request) => {
		if (request.resourceType() === 'image') request.abort()
		else request.continue()
	})
	await page.goto('https://www.pccomponentes.com/' + nombre, {
		waitUntil: 'load',
		timeout: 0
	})
	await page.setViewport({
		width: 1200,
		height: 800
	})

	await scroll.autoscroll(page)
	const enlaces = await page.evaluate(() => {
		let hrefs = []
		const todo = document.querySelectorAll('div.col-xs-6.col-sm-4.col-md-4.col-lg-4')
		todo.forEach((item) => {
			let link = {}
			try {
				link.enlace = item.querySelector('.GTM-productClick.enlace-superpuesto').getAttribute('href')
			} catch (e) {}
			hrefs.push('https://www.pccomponentes.com' + link.enlace)
		})
		return hrefs
	})
	await page.close()
	console.log(nombre + ' acabado')
	array.push(enlaces)
	next()
}

function urls(browser) {
	let results = []
	return new Promise((resolve, reject) => {
		async.eachOfLimit(
			nombres,
			1,
			function (item, index, next) {
				enlaces(item, browser, results, next)
			},
			(error) => {
				if (error) reject(error)
				else {
					resolve(flatten(results))
				}
			}
		)
	})
}

async function main() {
	const browser = await puppeteer.launch({
		headless: false
		//args: ['--proxy-server=']
	})
	return new Promise((resolve, reject) => {
		urls(browser).then(async (datos) => {
			horastart = new Date(today.getTime() + days * 24 * 60 * 60 * 1000)
			let arrayproductos = []
			async.eachOfLimit(
				datos,
				30,
				async function (item, key, next) {
						await extractInfo.Pccomponentes(item).then((response) => {
							arrayproductos.push(response)
							console.log('Link => ' + item + ' scrapeado, vamos por ' + key + ' / ' + datos.length)
							console.log(response)
							next
						})
					},
					function (err) {
						if (err) {
							console.log(err)
						} else {
							resolve(arrayproductos)
						}
					}
			)
		})
	})
}
main().then((res) => {
	console.log(res)
	var datosJSON = JSON.stringify(res)
	fs.writeFile(`./../Json/PcComp-${fecha.getFullYear()}-${fecha.getMonth()}-${fecha.getDate()}`, datosJSON, function (
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
	insertar.insertaroffer(res)

})