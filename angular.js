var app = angular.module("myapp", ["ngRoute"]);

app.config(function($routeProvider) {
  $routeProvider
    .when("/", { templateUrl: "trangchu.html", controller: "myCtrl" })
    .when("/gioithieu", { templateUrl: "gioithieu.html", controller: "myCtrl" })
    .when("/lienhe", { templateUrl: "lienhe.html", controller: "myCtrl" })
    .when("/lienhe123", { templateUrl: "lienhe123.html", controller: "myCtrl" })
    .when("/detail/:id", { templateUrl: "chitiet.html", controller: "myCtrl" })
    .otherwise({ templateUrl: "trangchu.html", controller: "myCtrl" });
});

app.controller("myCtrl", function($scope, $rootScope, $routeParams, $http) {
  $scope.products = [];
  $http.get("http://localhost:3000/products").then(function(response) {
    $scope.products = response.data;
    console.log($scope.products);
    $scope.detailPro = $scope.products.find(item => item.id == $routeParams.id);
  });

  $scope.sort = "price";
  $scope.tang = function() {
    $scope.sort = "price";
  };
  $scope.giam = function() {
    $scope.sort = "-price";
  };

  $scope.setSearchTerm = function(term) {
    $scope.search = term;
  };

  $scope.newPlace = {
    name: "",
    price: "",
    category: "",
    description: ""
  };

  // Thêm sản phẩm mới vào danh sách
  $scope.addNewPlace = function() {
    $scope.products.push({
      id: $scope.products.length + 1,
      name: $scope.newPlace.name,
      price: $scope.newPlace.price,
      category: $scope.newPlace.category,
      description: $scope.newPlace.description,
      image: URL.createObjectURL($scope.newPlace.image) 
    });

    // Xóa thông tin đã nhập trong form
    $scope.newPlace = {
      name: "",
      price: "",
      category: "",
      description: ""
    };
  };

  $scope.addCart = function(product) {
    $rootScope.cart = $rootScope.cart || [];
    var found = false;
    for (var i = 0; i < $rootScope.cart.length; i++) {
      if ($rootScope.cart[i].id === product.id) {
        $rootScope.cart[i].quantity++;
        found = true;
        break;
      }
    }
    if (!found) {
      product.quantity = 1;
      $rootScope.cart.push(angular.copy(product));
    }
  };

  $scope.plus = function(item) {
    item.quantity += 1;
  };

  $scope.minus = function(item) {
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      $scope.remove(item);
    }
  };

  $scope.remove = function(item) {
    const index = $scope.cart.indexOf(item);
    if (index > -1) {
      $scope.cart.splice(index, 1);
    }
  };

  $scope.total = function() {
    let total = 0;
    for (let i = 0; i < $scope.cart.length; i++) {
      total += $scope.cart[i].price * $scope.cart[i].quantity;
    }
    return total;
  };
});

app.directive("fileModel", ["$parse", function ($parse) {
    return {
      restrict: "A",
      link: function (scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;

        element.bind("change", function () {
          scope.$apply(function () {
            modelSetter(scope, element[0].files[0]);
          });
        });
      }
    };
  }]);