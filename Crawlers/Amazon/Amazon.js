
const puppeteer = require('puppeteer');
const fs = require('fs');
var conexion = require('../mysql/mysqlconection.js')
var filtros = require('./Amazon-filtros.js')
var buscar = async (nombre) => {
    const browser = await puppeteer.launch({
        headless: true
    });
    console.log(nombre)
    var enlace = filtros.filtrar(nombre);
    console.log(enlace)
    const page = await browser.newPage();
    await page.goto(enlace);
    await page.setViewport({
        width: 1200,
        height: 800
    });
    let numero = await page.evaluate(() => {   
        var total = document.querySelectorAll('.a-disabled')[1].innerText;
        return total;
    })
    let links = [];
    for (let index = 0; index < numero; index++) {
            try{
                let link = await page.evaluate(()=>{
                    let enlaces = {};
                    const enlace = document.querySelectorAll('h5 .a-link-normal.a-text-normal');
                    enlace.forEach((item)=>{
                    url = item.getAttribute('href');
                    enlaces.url = "https://www.amazon.es"+url;
                })
                return enlaces;
                })
                links.push(link);
                await page.click('li.a-last a');
                await page.waitForSelector('li.a-last a')
            }
            catch(e){
                console.log(e)
            }
        }
    /*const enlaces = await page.evaluate(() => {
        let hrefs = [];
        const todo = document.querySelectorAll('.sg-col-20-of-24.s-result-item.sg-col-0-of-12.sg-col-28-of-32.sg-col-16-of-20.sg-col.sg-col-32-of-36.sg-col-12-of-16.sg-col-24-of-28');
        todo.forEach((item)=>{
            let link = {};
            try{
                enlace = item.querySelectorAll('h5 .a-link-normal.a-text-normal').getAttribute('href')
                link.enlace = "https://www.amazon.es"+enlace
            }
            catch(e){
                
            }
            hrefs.push(link);
        })
        return hrefs;
      });*/
      let PcInfoTotal = [];
      for(let url of links){
          await page.goto(url['url']);

          let PcSpec = await page.evaluate(()=>{
            let PcSpecs = {}
            try{
                PcSpecs.productID = document.querySelector('.item-model-number').textContent;
                PcSpecs.marca = document.querySelectorAll('.pdTab td.value')[0].innerText;
                PcSpecs.modelo = document.querySelectorAll('.pdTab td.value')[1].innerText;
                PcSpecs.price = document.querySelector('#price_inside_buybox').innerText;
                PcSpecs.img = document.querySelector('#landingImage').getAttribute('src');
                PcSpecs.stock = document.querySelector('#availability').innerText;
                PcSpecs.provedor = document.querySelector('#merchant-info').innerText;
            }catch(e){

            }
            return PcSpecs;
          })
          PcInfoTotal.push(PcSpec);
      }
    //Introducir data into DB        
    //Array to JSON
    conexion.insertar(nombre,PcInfoTotal,'Amazon')
    var datosJSON = JSON.stringify(PcInfoTotal);
    fs.writeFile("Json/Amazon-"+nombre+".json",datosJSON, function(err) {
        if (err) {
            console.log(err);
        }
    });
    console.log("Amazon-"+nombre+".json creado!");
    
    browser.close();
}
//tarjetas-graficas
//procesadores
//discos-duros
//fuentes-alimentacicon
//memorias-ram
//placas-base
//cajas
buscar('procesadores');


