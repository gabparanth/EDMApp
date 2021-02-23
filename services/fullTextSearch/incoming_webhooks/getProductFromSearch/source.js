


exports = function (payload) {

  var collection = context.services.get("mongodb-atlas").db("ecom").collection("products");
  let arg = payload.query.arg;

  const agg =
    [{
      $search: {
        index: "autocomplete",
        autocomplete: {
          query: arg,
          path: 'name',
          tokenOrder: "any"

        }
      }
    }, {
      $project: {
        _id: 1,
        sku: 1,
        name: 1,
        type: 1,
        score: { "$meta": "searchScore" },
        "fuzzy": {
          "maxEdits": 1,
          "prefixLength": 1,
          "maxExpansions": 256
        }
      }
    }, {
      $sort: {
        score: -1
      }
    }, { $limit: 10 }];



  return collection.aggregate(agg);

};


