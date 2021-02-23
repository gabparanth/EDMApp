exports = function(sku){

  var collection = context.services.get("mongodb-atlas").db("ecom").collection("products");
  console.log(JSON.stringify(collection.findOne({sku: sku})));
  return collection.findOne({sku: sku});
  
};