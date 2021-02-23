exports = function (sku) {

    const activeUser = context.user;

    var collection = context.services.get("mongodb-atlas").db("ecom").collection("cart");
    return collection.updateOne({ user: activeUser, status: "cart" }, { $addToSet: { products: { id: sku, ts: new Date(), num: 1 } } }, { upsert: true })
}