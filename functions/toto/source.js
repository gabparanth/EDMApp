exports = async function()
{
  const collection = context.services.get("mongodb-atlas").db("EDMApp").collection("Test");
  
  // var emailAddress = context.user.data.email.split("@");
  
  
  // var emailAddressMongo = emailAddress[0] + "@mongodb.com";
  
  // console.log(emailAddressMongo);
  
  var result = collection.find({}).toArray();
  console.log(result);
  
return result;
};
