module.exports = {
    exportar: function markdownExport(horainicio, horafin, cantidadproductos) {
        const fs = require('fs')
        let fecha = new Date()
        let markdown = `#Prueba técnica 
#####Hora inicio: ${horainicio}
#####Hora fin: ${horafin}
---
##Total productos: ${cantidadproductos}
##Tiempo total: ` + this.mili(horafin - horainicio)
        fs.writeFile(`./../Logs/${fecha.getFullYear()}-${fecha.getMonth()}-${fecha.getDate()}---${fecha.getHours()}h-${fecha.getMinutes()}m.md`, markdown.trim(), function (err) {
            if (err) console.log(err)
            else {
                console.log(`markdown creado`)
            }
        })

    },
    mili: function millisToMinutesAndSeconds(millis) {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }
}