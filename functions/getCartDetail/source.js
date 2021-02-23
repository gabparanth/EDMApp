exports = function () {

  const activeUserId = context.user.id;


  const agg = [{
    $match: {
      "user.id": activeUserId,
      status: "cart"
    }
  }, {
    $project: {
      products: 1
    }
  }, {
    $addFields: {
      cartId: "$_id"
    }
  }, {
    $unwind: {
      path: "$products"
    }
  }, {
    $group: {
      _id: "$products.id",
      count: {
        "$sum": 1
      },
      cartId: { "$addToSet": "$cartId" }
    }
  }, {
    $lookup: {
      from: 'products',
      localField: '_id',
      foreignField: 'sku',
      as: 'productsDescription'
    }
  }, {
    $unwind: {
      path: "$productsDescription"
    }
  }, {
    $unwind: {
      path: "$cartId"
    }
  }, {
    $addFields: {
      TotalPrice: {
        $multiply: ["$count", "$productsDescription.price"]
      }
    }
  }, {
    $group: {
      _id: "$cartId",
      totalPrice: {
        $sum: "$TotalPrice"
      },
      totalProducts: {
        $sum: "$count"
      },



      products: {
        "$addToSet": "$productsDescription"
      }
    }
  }];


  // archive in case...    
  //    const agg = [{$match: {
  //     "user.id" : "5f4546e5cde513434d0a939e"
  //    }}, {$project: {
  //      products:1
  //    }}, {$unwind: {
  //      path: "$products"
  //    }}, {$group: {
  //      _id: "$products.id",
  //      count: {
  //        "$sum": 1
  //      }
  //    }}, {$lookup: {
  //      from: 'products',
  //      localField: '_id',
  //      foreignField: 'sku',
  //      as: 'productsDescription'
  //    }}, {$unwind: {
  //      path: "$productsDescription"
  //    }}, {$addFields: {
  //      TotalPrice: {
  //        $multiply : ["$count", "$productsDescription.price"]
  //      }
  //    }}, {$group: {
  //      _id: "facet",
  //      totalPrice: {
  //        $sum: "$TotalPrice"
  //      }, 
  //      totalProducts: {
  //        $sum :"$count"
  //      }, 
  //      products: {
  //        "$addToSet":"$productsDescription"
  //      }
  //    }}];




  var collection = context.services.get("mongodb-atlas").db("ecom").collection("cart");



  return collection.aggregate(agg);
}