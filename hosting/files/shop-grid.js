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
async function getProductsByType(callback) {
  const urlParams = new URLSearchParams(window.location.search);



  var filter = {};
  var p;

  // let's build our filter criteria and get/set page
  if (urlParams.has("type")) {
    filter.type = urlParams.get("type");
  }
  if (urlParams.has("manufacturer")) {
    filter.manufacturer = urlParams.get("manufacturer");
  }
  if (urlParams.has("cat")) {
    filter["category.id"] = urlParams.get("cat");
  }
  if (urlParams.has("priceMin")) {
    filter.price["$gte"] = urlParams.get("priceMin");
    // price:{"$gte":5, "$lte":10}
  }
  if (urlParams.has("priceMin")) {
    filter.price['$lte'] = urlParams.get("priceMax");
    // price:{"$gte":5, "$lte":10}
  }
  if (!urlParams.has("page")) {
    p = 0;
  } else {
    p = urlParams.get("page");
  }

  console.log("filter : " + JSON.stringify(filter));
  console.log("page : " + p);

  checkAuth(function (isAuthenticated) {

    client.callFunction("getProductsByTypes", [filter, p]).then((facet) => {
      callback(facet);
    });
  });

  // if (cat != null) {
  //   checkAuth(function (isAuthenticated) {
  //     console.log(cat);
  //     client.callFunction("getProductsByCat", [cat, p]).then((productsM) => {
  //       callback(productsM, urlParams);
  //     });
  //   });
  // } else if (type != null) {
  //   checkAuth(function (isAuthenticated) {
  //     console.log(type);
  //     client
  //       .callFunction("getProductsByTypesBeta", [type, p])
  //       .then((productsM) => {
  //         callback(productsM, urlParams);
  //       });
  //   });
  // }

  // checkAuth(function (isAuthenticated) {
  //   client.callFunction("getProductsByTypesBeta", [type]).then((products) => {
  //     callback(products);
  //   });
  // });
}
//, p, urlParams
function printProductsGrid(facet) {

  console.log(JSON.stringify(facet));

  var type = facet[0].type;
  var manufacturer = facet[0].manufacturer;
  var category = facet[0].category;
  var price = facet[0].price;
  var productsDoc = facet[0].productsDoc;
  var totalDoc = facet[0].totalDoc[0].sku;

  /**
   * Products GRID
   */


  var gridDiv = document.getElementById("productsGrid");
  var productFound = document.getElementById("numProductFound");
  var productFoundH6 = document.createElement("h6");
  productFoundH6.innerHTML = "Products found";

  productFoundH6.insertAdjacentHTML(
    "afterbegin",
    "<span>" + totalDoc + "</span>"
  );

  productFound.appendChild(productFoundH6);

  productsDoc.forEach((product) => {
    // declaration of elements
    var div = document.createElement("div");
    div.setAttribute("class", "col-lg-4 col-md-6 col-sm-6");
    var productItemDiv = document.createElement("div");
    productItemDiv.setAttribute("class", "product__item");
    var productPicDiv = document.createElement("div");
    productPicDiv.setAttribute("class", "product__item__pic set-bg");
    productPicDiv.setAttribute(
      "style",
      "background-image: url(" + product.image + ");"
    );
    var productItemTextDiv = document.createElement("div");
    productItemTextDiv.setAttribute("class", "product__item__text");
    var productItemTextName = document.createElement("h6");
    var a = document.createElement("a");
    a.setAttribute("href", "products-details.html?sku=" + product.sku);
    a.innerHTML = product.name;
    var productItemTextPrice = document.createElement("h5");
    productItemTextPrice.innerHTML = product.price;

    // hierarchie of elements inside out
    productItemTextName.appendChild(a);
    productItemTextDiv.appendChild(productItemTextPrice);
    productItemTextDiv.appendChild(productItemTextName);
    productItemDiv.appendChild(productPicDiv);
    productItemDiv.appendChild(productItemTextDiv);

    // append element to root div
    div.appendChild(productItemDiv);

    gridDiv.appendChild(div);
  });

  /**
   * pagination
   */

  var paginationDiv = document.createElement("div");
  paginationDiv.setAttribute("class", "product__pagination");

  var urlParams = new URLSearchParams(window.location.search);


  if (!urlParams.has("page")) {
    urlParams.append("page", 1);
  }
  var p = parseInt(urlParams.get("page"));


  if (p == 0) {
    for (var i = 0; i < 3; i++) {
      if (totalDoc / (p + i) <= 0) {
        return;
      }

      var paginationA = document.createElement("a");
      urlParams.set("page", p + i);
      paginationA.setAttribute("href", "shop-grid.html?" + urlParams);

      if (i == 0) {
        paginationA.setAttribute("class", "active");
      }

      paginationA.innerHTML = urlParams.get("page");
      paginationDiv.appendChild(paginationA);
      //<a href="#"><i class="fa fa-long-arrow-right"></i></a>
    }
  } else {
    for (var i = -1; i < 2; i++) {
      if (totalDoc / (p + i) <= 0) {
        return;
      }

      var paginationA = document.createElement("a");
      urlParams.set("page", p + i);
      paginationA.setAttribute("href", "shop-grid.html?" + urlParams);

      if (i == 0) {
        paginationA.setAttribute("class", "active");
      }

      paginationA.innerHTML = urlParams.get("page");
      paginationDiv.appendChild(paginationA);
      //<a href="#"><i class="fa fa-long-arrow-right"></i></a>
    }
  }

  gridDiv.appendChild(paginationDiv);

  /**
   * FILTER SideBar
   */

  // DEPARTMENT
  var sideDepartement = document.getElementById("sideDepartement");
  type.forEach((t) => {
    var departmentH5 = document.createElement("h5");
    departmentH5.innerHTML = t._id;
    sideDepartement.appendChild(departmentH5);
  });

  // CATEGORY

  urlParams = new URLSearchParams(window.location.search);

  var currentCat;

  if (urlParams.has("cat")) {
    currentCat = urlParams.get("cat");
  }

  var sideCategory = document.getElementById("sideCategory");
  var catH4 = document.createElement("h4");
  catH4.innerHTML = "Categories";

  sideCategory.appendChild(catH4);

  category.forEach((cat) => {


    var catDiv = document.createElement("div");
    catDiv.setAttribute("class", "sidebar__item__size");

    if (currentCat != undefined) {
      if (cat == currentCat) {
        catDiv.setAttribute("class", "active")
      }
    }
    var catLabel = document.createElement("label");
    var catA = document.createElement("a");
    urlParams.set("cat", cat._id.id);
    catA.setAttribute("href", "shop-grid.html?" + urlParams);
    catA.innerHTML = cat._id.name + " (" + cat.numDoc + ")";

    catLabel.appendChild(catA);
    catDiv.appendChild(catLabel);
    sideCategory.appendChild(catDiv);
  })


  // Manufacturer 

  urlParams = new URLSearchParams(window.location.search);
  var currentMan;
  if (urlParams.has("man")) {
    currentMan = urlParams.get("man");
  }

  var sideManufacturer = document.getElementById("sideManufacturer");

  manufacturer.forEach((man) => {

    var manDiv = document.createElement("div");
    manDiv.setAttribute("class", "sidebar__item__size");

    if (currentCat != undefined) {
      if (man == currentMan) {
        currentMan.setAttribute("class", "active")
      }
    }

    var manLabel = document.createElement("label");
    var manA = document.createElement("a");
    urlParams.set("manufacturer", man._id);
    manA.setAttribute("href", "shop-grid.html?" + urlParams);
    manA.innerHTML = man._id + " (" + man.numberDoc + ")";

    manLabel.appendChild(manA);
    manDiv.appendChild(manLabel);
    sideManufacturer.appendChild(manDiv);

  });


}

// async function getPath(callback) {
//   const urlParams = new URLSearchParams(window.location.search);

//   var cat = urlParams.get("cat");

//   checkAuth(function (isAuthenticated) {
//     console.log(cat);
//     client.callFunction("getCategoryPathAndChilds", [cat]).then((CategoryM) => {
//       callback(categoryM);
//     });
//   });

// }

// function printPath(cat, urlParams) {
//   var PathDiv = document.getElementById("productDetailPath");
//   PathDiv.setAttribute("class", "nav-a");
//   // var productDescriptionDiv = document.getElementById(
//   //   "productDetailsDescription"
//   // );

//   // // image
//   // var imageDiv = document.getElementById("productDetailsImage");
//   // var img = document.createElement("img");
//   // img.setAttribute("src", product.image);
//   // imageDiv.appendChild(img);

//   // Path
//   cat.path.forEach((category) => {
//     var categoryId = category.id;
//     var categoryName = category.name;

//     var catA = document.createElement("a");
//     catA.setAttribute("href", "shop-grid.html?cat=" + categoryId);
//     catA.innerHTML = categoryName;
//     PathDiv.appendChild(catA);
//   });
// }

// load product grid html with the right parameter
function printProductsGridBeta(callback) {
  const urlParams = new URLSearchParams(window.location.search);
  var type = urlParams.get("type");

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

      callback(products);
    });
  });
}

getProductsType(function (types) {
  printProductsTypes(types);
});

getProductsByType(function (productsM) {
  printProductsGrid(productsM);
});



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