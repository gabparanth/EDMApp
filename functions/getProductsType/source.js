exports = function(){

  var collection = context.services.get("mongodb-atlas").db("ecom").collection("products");
  return collection.distinct('type');

};