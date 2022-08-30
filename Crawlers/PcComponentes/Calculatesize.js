const axios = require('axios')
let a = axios.get('https://www.pccomponentes.com/').then((data)=>{
    console.log(data.headers)
})
