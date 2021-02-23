exports = function () {
    var collection = context.services.get("mongodb-atlas").db("ecom").collection("products");


    return collection.aggregate([{
        $sample: {
            size: 1
        }
    }]);
};