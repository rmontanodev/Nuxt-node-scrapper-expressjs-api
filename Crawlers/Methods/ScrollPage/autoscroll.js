module.exports = {
	autoscroll: async function(page) {
		await page.click('#btnMore')
		await page.evaluate(async () => {
			await new Promise((resolve, reject) => {
				var totalHeight = 0
				var distance = 50
				var timer = setInterval(() => {
					var scrollHeight = document.body.scrollHeight
					window.scrollBy(0, distance)
					totalHeight += distance

					if (totalHeight >= scrollHeight) {
						clearInterval(timer)
						resolve()
					}
				}, 120)
			})
		})
	}
}
