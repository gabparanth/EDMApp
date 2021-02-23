exports = async function (cartID) {




    var cartCollection = context.services.get("mongodb-atlas").db("ecom").collection("cart");
    var orderCollection = context.services.get("mongodb-atlas").db("ecom").collection("order");
    // var cartCollection = context.services.get("mongodb-atlas").db("ecom").collection("cart");

    const session = context.services.get("mongodb-atlas").startSession();

    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };


    try {
        const transactionResults = await session.withTransaction(async () => {

            // 0 : get cart data 
            const getCartResults = await cartCollection.findOne({
                _id: new BSON.ObjectId(cartID)
            }, { session });
            // console.log(JSON.stringify(getCartResults));

            //1 update car
            const cartUpdateResults = await cartCollection.updateOne(
                { _id: new BSON.ObjectId(cartID) },
                { $set: { status: "ordered" } },
                { session });
            console.log(`${cartUpdateResults.matchedCount} document(s) found in the users collection with the email address .`);
            console.log(`${cartUpdateResults.modifiedCount} document(s) was/were updated to include the reservation.`);


            const OrderCreationResults = await orderCollection.insertOne(
                { date: new Date(), orderDetail: getCartResults },
                { session });


        }, transactionOptions);

        if (transactionResults) {
            console.log("The order was successfully created.");
        } else {
            console.log("The order was intentionally aborted.");
        }
    } catch (e) {
        console.log("The transaction was aborted due to an unexpected error: " + e);
    } finally {
        await session.endSession();
    }
    // return collection.aggregate(agg);
};