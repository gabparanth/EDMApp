exports = function(id){

  var collection = context.services.get("mongodb-atlas").db("ecom").collection("categories");
  return collection.findOne({id: id});
  
};