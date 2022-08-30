module.exports = {
    renombrar(nombre){
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //Enero es 0!
        var yyyy = today.getFullYear();
        var todayy = mm + '/' + dd + '/' + yyyy;
        //Formatear Nombre
        var nombrejson = nombre.replace(/[-]/i, "")
        nombrejson = nombrejson+todayy;
        return nombrejson
        }
}