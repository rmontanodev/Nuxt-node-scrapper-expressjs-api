module.exports = {
	filtrar: function(nombre) {
		console.log(nombre)
		if (nombre == 'tarjetas-graficas') {
			var nombre2 = 'https://xtremmedia.com/?q=product/view/familia/64/nview/5000'
		} else if (nombre == 'procesadores') {
			var nombre2 = 'https://xtremmedia.com/?q=product/view/familia/31/nview/5000'
		} else if (nombre == 'discos-duros') {
			var nombre2 = 'https://xtremmedia.com/?q=product/view/familia/32/nview/5000'
		} else if (nombre == 'fuentes-alimentacion') {
			var nombre2 = 'https://xtremmedia.com/?q=product/view/familia/29/nview/5000'
		} else if (nombre == 'memorias-ram') {
			var nombre2 = 'https://xtremmedia.com/?q=product/view/familia/62/nview/5000'
		} else if (nombre == 'placas-base') {
			var nombre2 = 'https://xtremmedia.com/?q=product/view/familia/30/nview/5000'
		} else if (nombre == 'cajas') {
			var nombre2 = 'https://xtremmedia.com/?q=product/view/familia/28/nview/5000'
		}
		return nombre2
	}
}
