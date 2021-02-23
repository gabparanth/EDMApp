exports = async function(type, p){

const agg = [
  {
    '$match': {
      'type': type
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
  return await collection.aggregate(agg);

  // var collection = context.services.get("mongodb-atlas").db("ecom").collection("products");
  // return collection.find({type: type}).limit(12);
  
};