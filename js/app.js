var app = angular.module('RconApp', ['ngRoute', 'nvd3', 'angucomplete-alt']);

app.service('rconService', [RconService]);

app.config(function($routeProvider) {
  $routeProvider.when("/home", {Title: "Home"});
  $routeProvider.when("/:address/info", {
    Title: "Server",
    templateUrl: "html/serverInfo.html",
    Nav: true
  });
  $routeProvider.when("/:address/console", {
    Title: "Console",
    templateUrl: "html/console.html",
    Nav: true
  });
  $routeProvider.when("/:address/chat", {
    Title: "Chat",
    templateUrl: "html/chat.html",
    Nav: true
  });
  $routeProvider.when("/:address/playerlist", {
    Title: "Player List",
    templateUrl: "html/playerlist.html",
    Nav: true
  });
  $routeProvider.when("/:address/player/:userid", {
    Title: "Player Info",
    templateUrl: "html/playerInfo.html"
  });
  $routeProvider.otherwise({redirectTo: '/home'});
});

app.controller('RconController', RconController);

function RconController($scope, $rootScope, rconService, $timeout, $route, $http) {
  $scope.$route = $route;

  $scope.pages = $.map($route.routes, function(value, index) {
    if (value.Nav) {
      return [value];
    }
  });

  $scope.OpenLeftMenu = function() {
    $mdSidenav('left').toggle();
  };

  $scope.IsConnected = function() {
    return rconService.IsConnected();
  }

  $rootScope.Nav = function(url) {
    return url.replace(":address", rconService.Address);
  }

  $rootScope.$on('$stateChangeStart', function(next, current) {
    console.log(next);
  });

  rconService.OnOpen = function() {
    $scope.Connected = true;
    $scope.$broadcast("OnConnected");
    $scope.$digest();
    $scope.address = rconService.Address;
  }

  rconService.OnClose = function(ev) {
    $scope.$broadcast("OnDisconnected", ev);
    $scope.$digest();
  }

  rconService.OnError = function(ev) {
    $scope.$broadcast("OnConnectionError", ev);
    $scope.$digest();
  }

  rconService.OnMessage = function(msg) {
    $scope.$apply(function() {
      $scope.$broadcast("OnMessage", msg);
    });
  }

  $scope.Disconnect = function() {
    if (confirm('Do you really want to disconnect?')) {
      rconService.Disconnect();
      $scope.Connected = false;

      $scope.address = '#!/home';
    }
  }

    $scope.commands = [
        {name: 'oxide.load', code: 'OL'},
        {name: 'oxide.reload', code: 'OR'},
        {name: 'oxide.unload', code: 'OU'},
        {name: 'ban', code: 'BN'},
        {name: 'banid', code: 'BI'},
        {name: 'banlist', code: 'BL'},
        {name: 'banlistex', code: 'BX'},
        {name: 'kick', code: 'KK'},
        {name: 'kickall', code: 'KA'},
        {name: 'listid', code: 'LI'},
        {name: 'moderatorid ', code: 'MI'},
        {name: 'ownerid', code: 'OI'},
        {name: 'removemoderator', code: 'RM'},
        {name: 'removeowner', code: 'RO'},
        {name: 'unban', code: 'UB'},
        {name: 'writecfg', code: 'WC'},
        {name: 'version', code: 'vs'},
        {name: 'say', code: 'SY'}
    ]; //todo add more commands
    $http.get('json/commands.json') //unused todo make it work
        .then(function(res){
            $scope.countries = res.data;
            console.log(res.data)
        });

}

app.filter('SecondsToDuration', [SecondsToDuration]);

function SecondsToDuration() {
  return function(input) {
    input = parseInt(input);

    var out = "";
    var hours = Math.floor(input / 3600);
    if (input > 3600)
      out += hours + "h";

    var minutes = Math.floor(input / 60) % 60;
    if (input > 60)
      out += minutes + "m";

    var seconds = input % 60;
    out += seconds + "s";

    return out;
  }
}
