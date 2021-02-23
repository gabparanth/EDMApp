exports = async function(catId, p){

  const agg = [
  {
    '$match': {
      'category.id': catId
    }
  }, {
    '$facet': {
      'count': [
        {
          '$count': 'count'
        }
      ], 
      'products': [
        {
          '$skip': 12 * p
        }, {
          '$limit': 12 
        }
      ]
    }
  }, {
    '$project': {
      'numDoc': '$count.count', 
      'products': 1
    }
  }, {
    '$unwind': {
      'path': '$numDoc'
    }
  }
];

  var collection = context.services.get("mongodb-atlas").db("ecom").collection("products");
  // return collection.find({'category.id': catId}).limit(12);
  
  return await collection.aggregate(agg);
  
};