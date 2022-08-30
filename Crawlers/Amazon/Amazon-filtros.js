module.exports = {
    filtrar: function(nombre){
        console.log(nombre)
      if(nombre == 'tarjetas-graficas'){
        var nombre2 = 'https://www.amazon.es/s?k='+nombre+'&i=computers&rh=n%3A937935031'
      }
      else if(nombre == 'procesadores'){
        var nombre2 = 'https://www.amazon.es/s?k='+nombre+'&i=computers&rh=n%3A667049031%2Cn%3A937925031'

      }
      else if(nombre == 'discos-duros'){
        var nombre2 = 'https://www.amazon.es/s?k='+nombre+'&i=computers&rh=n%3A667049031%2Cn%3A937917031'

    }
    else if(nombre == 'fuentes-alimentacion'){
        var nombre2 = 'https://www.amazon.es/s?k='+nombre+'&i=computers&rh=n%3A667049031%2Cn%3A937935031'

    }
    else if(nombre == 'memorias-ram'){
        var nombre2 = 'https://www.amazon.es/s?k='+nombre+'&i=computers&rh=n%3A667049031%2Cn%3A937935031'

    }
    else if(nombre == 'fuentes-alimentacion'){
        var nombre2 = 'https://www.amazon.es/s?k='+nombre+'&i=computers&rh=n%3A667049031%2Cn%3A667049031'

    }
    else if(nombre == 'placas-base'){
        var nombre2 = 'https://www.amazon.es/s?k='+nombre+'&i=computers&rh=n%3A667049031%2Cn%3A937924031'

    }
    else if(nombre == 'cajas'){
        var nombre2 = 'https://www.amazon.es/s?k='+nombre+'&i=computers&rh=n%3A667049031%2Cn%3A937916031'

        
    }
    return nombre2;
  
    }
  }
