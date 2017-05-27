var subsimapp = angular.module('subsimapp',[]);

subsimapp.controller('subsimcontroller', ['$scope', function($scope) {
  $scope.state = "toconnect";
  $scope.host = "localhost";
  $scope.port = 9555;
  $scope.name = "tester";
  $scope.turn = "";
  $scope.sub = "";
  $scope.map = [];
  
  $scope.asciiToBuf = function(message) {
    var asciiKeys = [];
    for (var i = 0; i < message.length; i ++)
      asciiKeys.push(message[i].charCodeAt(0));
    return new Uint8Array(asciiKeys).buffer;
  };
  
  $scope.bufToAscii = function(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
  };
  
  $scope.sendMessage = function(message) {
	  chrome.sockets.tcp.send($scope.socket, $scope.asciiToBuf(message + "\n"), function(){});
  };
  
  $scope.connect = function() {
    chrome.sockets.tcp.create({}, function(createInfo) {
	  $scope.socket = createInfo.socketId;
	  chrome.sockets.tcp.connect($scope.socket, $scope.host, $scope.port, function(){});
    });
  };
  
  $scope.disconnect = function() {
    chrome.sockets.tcp.disconnect($scope.socket);
  };
  
  chrome.sockets.tcp.onReceive.addListener(function(info) {
    if (info.socketId != $scope.socket)
      return;
    var message = $scope.bufToAscii(info.data).trim();
	console.log(message);
	var command = message.split("|")
	
	if(command[0] == "C")
      $scope.initMap(command);
	if(command[0] == "J")
      $scope.joining(command);
	if(command[0] == "I")
      $scope.readInfo(command);
	if(command[0] == "B")
      $scope.beginTurn(command);
  });
  
  $scope.initMap = function(command) {
	var maparr =  new Array(command[3]);
    for (var i = 0; i < command[3]; i++) {
      maparr[i] = new Array(command[4]);
      for (var j = 0; j < command[3]; j++) {
        maparr[i][j] = "blank";
      }
    }
    $scope.$apply(function(){
      $scope.state = "tojoin";
      $scope.title = command[2];
      $scope.map = maparr;
    });
  };
  
  $scope.join = function() {
    $scope.sendMessage("J|" + $scope.name + "|1|1");
  };
  
  $scope.readInfo = function(command) {
    $scope.$apply(function(){
      $scope.sub = command;
    });
  };
  
  $scope.joining = function() {
    $scope.$apply(function(){
      $scope.state = "waitstart";
    });
  };
  
  $scope.beginTurn = function(command) {
    $scope.$apply(function(){
      $scope.state = "playing";
      $scope.turn = command[1];
    });
  };  
}]);