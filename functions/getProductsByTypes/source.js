exports = function (filter, p) {

  var collection = context.services.get("mongodb-atlas").db("ecom").collection("products");

  const agg = [
    {
      '$match': filter
    }, {
      '$facet': {
        type: [{
          $group: {
            _id: "$type",
            numberDoc: {
              $sum: 1
            },
          }
        }, {
          $sort: {
            _id: 1
          }
        }

        ],
        manufacturer: [{
          $group: {
            _id: "$manufacturer",
            numberDoc: {
              "$sum": 1
            }
          }
        }, {
          $sort: {
            numberDoc: -1
          }
        }, { $limit: 12 }],
        category: [{
          $unwind:
          {
            path: "$category"
          }
        },
        {
          $group:
          {
            _id: "$category",
            numDoc: {
              $sum: 1
            }
          }

        },

        {
          $sort: {
            "numDoc": -1
          }
        }, { $limit: 12 }

        ],
        price: [{
          $bucketAuto: {
            groupBy: "$price",
            buckets: 4,
          }
        }],
        productsDoc: [{
          $project: {
            sku: 1,
            name: 1,
            price: 1,
            description: 1,
            manufacturer: 1,
            model: 1,
            image: 1,
            category: 1,
            type: 1
          }
        },
        {
          $sort: {
            name: 1
          }
        },
        { $skip: p * 12 },
        { $limit: 12 }
        ],
        totalDoc: [{
          $count: "sku"
        }]
      }
    }
  ];

  return collection.aggregate(agg, { allowDiskUse: true });


  // return collection.find({type: type, image : {"$ne": "http://img.bbystatic.com/BestBuy_US/images/products/nonsku/default_hardlines_l.jpg"}}).limit(12);

};