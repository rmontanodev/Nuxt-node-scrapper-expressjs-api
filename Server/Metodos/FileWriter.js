const fs = require('fs');
module.exports = {
    append: function(path,output) {
        fs.appendFile(path,output,(err)=>{
            if (err){
                console.log("error path")
            }
            console.log("Guardado");
        
    });
    }
}
