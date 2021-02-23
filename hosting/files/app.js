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

/**
 *
 * Home Page
 */

// get product types from Atlas Realm (stitch) function
async function getProductsType(callback) {
  checkAuth(function (isAuthenticated) {
    client.callFunction("getProductsType", []).then((types) => {
      callback(types);
    });
  });
}



// print products category
function printProductsTypes(productsTypes) {
  var ul = document.getElementById("productsTypesList");

  productsTypes.forEach((productsType) => {
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.setAttribute("href", "shop-grid.html?type=" + productsType);
    a.innerHTML = productsType;

    li.appendChild(a);
    ul.appendChild(li);
  });
}

// get products data from Atlas Realm (stitch) function
// async function getProductsByType(callback) {
//   checkAuth(function (isAuthenticated) {
//     client.callFunction("getProductsType", []).then((types) => {
//       callback(types);
//     });
//   });
// }

// load product grid html with the right parameter
function loadProductsGrid() {
  const urlParams = new URLSearchParams(window.location.search);
  const type = urlParams.get("type");

  return function (type) {
    checkAuth(function (isAuthenticated) {
      client.callFunction("getProductsByTypes", [type]).then((products) => {
        console.log(products);
        var gridDiv = document.getElementById("productsGrid");

        products.forEach((product) => {
          // declaration of elements
          var div = document.createElement("div");
          div.setAttribute("class", "col-lg-4 col-md-6 col-sm-6");
          var productItemDiv = document.createElement("div");
          productItemDiv.setAttribute("class", "product__item");
          var productPicDiv = document.createElement("div");
          productPicDiv.setAttribute("class", "product__item__pic set-bg");
          productPicDiv.setAttribute("data-setbg", product.image);
          var productItemTextDiv = document.createElement("div");
          productItemTextDiv.setAttribute("class", "product__item__text");
          var productItemTextName = document.createElement("h6");
          var a = document.createElement("a");
          a.innerHTML = product.name;
          var productItemTextPrice = document.createElement("h5");
          productItemTextPrice.innerHTML = product.price;

          // hierarchie of elements inside out
          productItemTextName.appendChild(a);
          productItemTextDiv.appendChild(productItemTextPrice);
          productItemTextDiv.appendChild(productItemTextName);

          productItemDiv.appendChild(productItemTextDiv);
          productItemDiv.appendChild(productPicDiv);

          div.appendChild(productItemDiv);

          gridDiv.appendChild(div);
        });

        // callback(products);
      });
    });
  };
}



function getSampleProduct(callback) {
  checkAuth(function (isAuthenticated) {
    client.callFunction("getSampleProduct", []).then((product) => {
      callback(product);
    });
  });
}



/* <div id="sampleProduct">
<div class="container">
<div class="row">
<div class="col-lg-6">
    <img src="http://img.bbystatic.com/BestBuy_US/images/products/5188/5188243_sa.jpg">
    </div>
<div class="col-lg-6">
    <div class="hero__text" style="          position:absolute;                  
                bottom:0;                          
                left:0;     "><span>HardGood</span><p>Apple - Smart Case for Apple iPad® mini, iPad mini 2 and iPad mini 3 - Brown</p><a href="products-details.html?sku=2865361" class="primary-btn">SHOP NOW</a></div></div>
</div>
</div>
</div> */

function printSampleProduct(product) {
  var sampleProductDiv = document.getElementById("sampleProduct");

  sampleProductDiv.innerHTML = "<div class='container' style='padding-top:30px'><div class='row'><div class='col-lg-6'><img src=" + product[0].image + "></div><div class='col-lg-6'><div class='hero__text' style='position:absolute;bottom:0;left:0;'><span>" + product[0].type + "</span><p>" + product[0].name + "</p><a href='products-details.html?sku=" + product[0].sku + "' class='primary-btn'>SHOP NOW</a></div></div></div></div>"


}

getProductsType(function (types) {
  printProductsTypes(types);
});

getSampleProduct(function (product) {
  printSampleProduct(product);
});

// <!-- <div class="hero__text">
// <span>FRUIT FRESH</span>
// <h2>Vegetable <br />100% Organic</h2>
// <p>Free Pickup and Delivery Available</p>
// <a href="#" class="primary-btn">SHOP NOW</a>
// </div> -->


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