const puppeteer = require('puppeteer')
const fs = require('fs')
const scroll = require('../Methods/ScrollPage/autoscroll.js')
var axios = require('axios')
var tablename = require('../Methods/TableName/tablename.js')
const { Cluster } = require('puppeteer-cluster')
var nombres = [
	'procesadores',
	'tarjetas-graficas',
	'memorias-ram',
	'fuentes-alimentacion',
	'torres',
	'placas-base',
	'discos-duros'
]
try {
	// nombres.map((item) => {
	// 	buscar(item)
	// })
	buscar(nombres[0])
	// for (let index = 0; index < nombres.length; index++) {
	// 	buscar(nombres[index])
	// }
} catch (e) {
} finally {
}

async function buscar(nombre) {
	try {
		const browser = await puppeteer.launch({
			headless: false
			//args: ['--proxy-server=']
		})
		const page = await browser.newPage()
		await page.setRequestInterception(true)
		page.on('request', (request) => {
			if (request.resourceType() === 'image') request.abort()
			else request.continue()
		})
		await page.goto('https://www.pccomponentes.com/' + nombre, { waitUntil: 'load', timeout: 0 })
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
				hrefs.push(link)
			})
			return hrefs
		})
		console.log(enlaces)
		let PcInfoTotal = []
		// var promocionado = /https:\/\/ad-geo\.tagdelivery\.com\//g
		// var index = 0
		// for (let url of enlaces) {
		// 	if (promocionado.test(url['enlace'])) {
		// 		await page.goto(url['enlace'], { waitUntil: 'load', timeout: 0 })
		// 	} else {
	
			const cluster = await Cluster.launch({
				concurrency: Cluster.CONCURRENCY_CONTEXT,
				maxConcurrency: 3
			})
			await cluster.task(async ({ page, data: url }) => {
				await page.goto('https://www.pccomponentes.com' + url['enlace'], { timeout: 0, waitUntil: 'load' })

				let PcSpec = await page.evaluate(() => {
					let PcSpecs = {}
					PcSpecs.origen = 'PcComponentes'
					try {
						PcSpecs.productID = document.querySelector('span[itemprop]').innerText
						PcSpecs.marca = document.querySelector('a[itemprop="brand"]').innerText
						PcSpecs.modelo = document.querySelector('h1[itemprop="name"]').innerText
						PcSpecs.price = document.querySelector('#precio-main').getAttribute('data-price')
						if (document.querySelector('.c-delivery__emphasis')) {
							PcSpecs.stock = document.querySelector('.c-delivery__emphasis').innerText
						} else if (document.querySelector('.row.envio[style="display:none"]')) {
							PcSpecs.stock = document.querySelector('span#enstock').innerText
						} else {
							PcSpecs.stock = 'No stock'
						}
						let img = document.querySelector('img[itemprop="image"]').getAttribute('src')
						PcSpecs.img = 'https:' + img
						if (document.querySelectorAll('.col-xs-12.col-sm-9')[2].innerText.includes('PcComponentes')) {
							PcSpecs.provedor = document.querySelectorAll('.col-xs-12.col-sm-9')[2].innerText
						} else if (document.querySelector('a.js-marketplace-winner-shopname')) {
							//otros provedores
							PcSpecs.provedor = document.querySelector('a.js-marketplace-winner-shopname').innerText
						} else {
							PcSpecs.provedor = document.querySelectorAll(
								'.row.col-xs-12[class="col-xs-12"]'
							)[2].innerText
						}
					} catch (e) {}
					return PcSpecs
				})
				PcSpec.url = 'https://www.pccomponentes.com' + url['enlace']
				PcSpec.gamma = nombre
				if (PcSpec.productID == null) {
					PcSpec.productID = 'dabanulo'
				}
				PcInfoTotal.push(PcSpec)
				console.log(PcSpec)
			})
			for (let index = 0; index < enlaces.length; index = index + 3) {
				if (index == enlaces.length - 1 || index > enlaces.length) {
					console.log('Acabado')
				} else if (index + 1 > enlaces.length || index + 1 == enlaces.length) {
					cluster.queue(enlaces[index].enlace)
				} else if (index + 2 > enlaces.length || index + 2 == enlaces.length) {
					cluster.queue(enlaces[index].enlace)
					cluster.queue(enlaces[index + 1].enlace)
				} else {
					cluster.queue(enlaces[index].enlace)
					cluster.queue(enlaces[index + 1].enlace)
					cluster.queue(enlaces[index + 2].enlace)
				}
			}
		
		/*
						await page.waitForNavigation({ waitUntil : 'domcontentloaded' });
						await page.evaluate(async()=>{
							PcData.productID = evaluarInnerText('span[itemprop]')
							PcData.name = evaluarInnerText('h1[itemprop="name"]')
							PcData.base = evaluarInnerText('span.baseprice')
							PcData.cents = evaluarInnerText('span.cents')
							PcData.stock = evaluarInnerText('span#enstock')
							let imgsrc = document.querySelector('img[itemprop="image"]').getAttribute('src')
							PcData.img = 'https://www.pccomponentes.com'+imgsrc;
							PcData.name = evaluarInnerText('h1[itemprop="name"]')
							console.log(PcData.productID)
								PcData.gastosenvio = document.querySelectorAll('.col-xs-12.col-sm-9')[2].innerText;
						})*/

		//Array to JSON
		console.log(PcInfoTotal)
		var datosJSON = JSON.stringify(PcInfoTotal)
		var nombretabla = tablename.renombrar(nombre)
		nombretabla = 'PcComponentes-' + nombretabla
		fs.writeFile('../Json/PcComponentes/' + nombretabla + '.json', datosJSON, function(err) {
			if (err) {
				console.log(err)
			}
		})
		console.log(nombretabla + '.json creado!')
		axios
			.post('http://localhost:3902/json/insertar', {
				info: PcInfoTotal,
				origen: 'Pccom-'
			})
			.then((res) => {
				console.log('todo perf bro')
				console.log(res)
			})
			.catch((err) => {
				console.log('error:')
				console.log(err)
			})

		browser.close()
	} catch (e) {
		console.log(e)
	}
}
