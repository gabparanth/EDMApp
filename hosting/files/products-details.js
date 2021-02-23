const STITCH_APP_ID = "ecom-xwqkg";

// const rootUrl = "ecom-xwqkg.mongodbstitch.com";

const client = stitch.Stitch.initializeDefaultAppClient(STITCH_APP_ID);

function checkAuth(callback) {
  client.auth
    .loginWithCredential(new stitch.AnonymousCredential())
    .then((user) => {
      callback(true);
    });
}

async function getProductsById(callback) {
  const urlParams = new URLSearchParams(window.location.search);
  var sku = parseInt(urlParams.get("sku"));
  console.log(sku);

  checkAuth(function (isAuthenticated) {
    client.callFunction("getProductBySku", [sku]).then((product) => {
      callback(product);
    });
  });
}

function printProductDetail(product) {
  var PathDiv = document.getElementById("productDetailPath");
  PathDiv.setAttribute("class", "nav-a");
  var productDescriptionDiv = document.getElementById(
    "productDetailsDescription"
  );

  // image
  var imageDiv = document.getElementById("productDetailsImage");
  var img = document.createElement("img");
  img.setAttribute("src", product.image);
  imageDiv.appendChild(img);

  // Path
  product.category.forEach((category) => {
    var categoryId = category.id;
    var categoryName = category.name;

    var catA = document.createElement("a");
    catA.setAttribute("href", "shop-grid.html?cat=" + categoryId);
    catA.innerHTML = categoryName;
    PathDiv.appendChild(catA);
  });

  // description

  var productNameH4 = document.createElement("h4");
  productNameH4.innerHTML = product.name;
  var productFromH5 = document.createElement("h5");
  productFromH5.innerHTML = "From: " + product.manufacturer;

  var descriptionDiv = document.createElement("div");
  descriptionDiv.setAttribute("style", "padding-top: 50px;");
  var descriptionLabel = document.createElement("h5");
  descriptionLabel.innerHTML = "Description";
  var descriptionParagraph = document.createElement("p");
  descriptionParagraph.innerHTML = product.description;
  var modelLabel = document.createElement("h5");
  modelLabel.innerHTML = "Model";
  var modelParagraph = document.createElement("p");
  modelParagraph.innerHTML = product.model;
  descriptionDiv.appendChild(descriptionLabel);
  descriptionDiv.appendChild(descriptionParagraph);
  descriptionDiv.appendChild(modelLabel);
  descriptionDiv.appendChild(modelParagraph);

  var productPriceH5 = document.createElement("h5");
  productPriceH5.innerHTML = "Price: £" + product.price;

  var buttonDiv = document.createElement("div");
  buttonDiv.setAttribute("style", "padding-top: 50px;");
  var buttonAddToCart = document.createElement("button");
  buttonAddToCart.setAttribute("class", "site-btn");
  buttonAddToCart.setAttribute("onclick", "addCart(" + product.sku + ")");
  buttonAddToCart.innerHTML = "add to cart";
  buttonDiv.appendChild(buttonAddToCart);

  productDescriptionDiv.appendChild(productNameH4);
  productDescriptionDiv.appendChild(productFromH5);
  productDescriptionDiv.appendChild(descriptionDiv);
  productDescriptionDiv.appendChild(productPriceH5);
  productDescriptionDiv.appendChild(buttonDiv);

}


function getCart(callback) {
  checkAuth(function (isAuthenticated) {
    client.callFunction("getCartDetail", []).then((cart) => {

      callback(cart);
    });
  });
}

function printCart(cart) {

  console.log(JSON.stringify(cart));

  var cartDiv = document.getElementById("header__cart");
  // var tempDiv = document.createElement("div");
  cartDiv.innerHTML = "";
  var cartUl = document.createElement("ul");
  var cartLi = document.createElement("li");
  var cartA = document.createElement("a");
  cartA.setAttribute("href", "javascript:alertBox('" + cart[0]._id + "');");

  var cartI = document.createElement("i");
  cartI.setAttribute("class", "fa fa-shopping-bag");
  var cartSpan = document.createElement("span");

  cartSpan.innerHTML = cart[0].totalProducts;

  // <div class="header__cart__price" id="header__cart__price"></div>
  var cartPriceDiv = document.createElement("div");
  cartPriceDiv.setAttribute("class", "header__cart__price")

  cartPriceDiv.innerHTML = "item:";
  cartPriceDiv.insertAdjacentHTML(
    "beforeend",
    "<span>£" + cart[0].totalPrice + "</span>"
  );

  cartA.appendChild(cartI);
  cartA.appendChild(cartSpan);
  cartLi.appendChild(cartA);
  cartUl.appendChild(cartLi);

  cartDiv.appendChild(cartUl);
  cartDiv.appendChild(cartPriceDiv);
}

getCart(function (cart) {
  printCart(cart);
});

//https://www.w3schools.com/howto/howto_js_alert.asp
function addCart(sku) {
  checkAuth(function (isAuthenticated) {

    return client.callFunction("addToCart", [sku])
      .then(() => {
        getCart(function (cart) {
          printCart(cart);
        });
      });
  });
}

function alertBox(cartId) {

  alert("You are going to confrim an order!");

  if (confirm('Are you sure to confirm the order')) {
    // Save it!
    console.log('Thing was saved to the database.');

    checkAuth(function (isAuthenticated) {

      return client.callFunction("createOrder", [cartId])
        .then(() => {
          getCart(function (cart) {
            printCart(cart);
          });
        });
    });

  } else {
    // Do nothing!
    console.log('Thing was not saved to the database.');
  }


}

getProductsById(function (product) {
  printProductDetail(product);
});
