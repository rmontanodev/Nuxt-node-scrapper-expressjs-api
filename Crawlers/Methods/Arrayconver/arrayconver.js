module.exports = {
    toArray : function (array) {

    var result=[];

    function toarray(array) {
        for (var l=array.length,i=0;i<l;i++) {
            if (Array.isArray(array[i])) {
                toarray(array[i]);
            } else {
                result.push(array[i]);
            }
        }
        return result;
    }

    return toarray(array);
}
}