angular.module('contactos.controllers', [])

.controller('ContactosCtrl', function ($scope, $http, $ionicActionSheet, $ionicPopup, $state) {
  //http://localhost:3000/contactos
  $scope.peticion_get = function () {
    $http.get("https://apiuni.herokuapp.com/contactos")
    .success(function (respuesta, estado) {
      //console.log(JSON.stringify(respuesta));
      $scope.contactos = {};
      $scope.contactos = respuesta;
    })
    .error(function (respuesta, estado) {
      if (estado == 404) {
        $ionicPopup.alert({
          title: "Error 404",
          template: "La ruta especificada no existe"
        });
      };
    })
    .finally(function () {
      $scope.$broadcast('scroll.refreshComplete');
    });
  }

  $scope.peticion_get();

  // $scope.contactos = [{
  //   id: 0,
  //   nombre: 'Bill Gate',
  //   correo: 'bill@microsoft.com',
  //   edad: '50'
  // }, {
  //   id: 1,
  //   nombre: 'Steve Job',
  //   correo: 'steve@apple.com',
  //   edad: '50'
  // }, {
  //   id: 2,
  //   nombre: 'Mark Zuckemberg',
  //   correo: 'mark@facebook.com',
  //   edad: '35'
  // }]

  $scope.contacto = {};
  $scope.nuevo = function(contacto) {
    $http.post("https://apiuni.herokuapp.com/contactos", {contacto: contacto})
    .success(function (respuesta, estado) {
      $state.go("contactos", {}, { reload: true});
    })
    .error(function (respuesta, estado) {
      $ionicPopup.alert({
        title: "estado " + estado,
        template: "Ocurrio un error en la peticion"
      });
    });
  };

  $scope.show_menu = function (contacto_id) {
    $ionicActionSheet.show({
      titleText: 'Opciones Contactos',
      buttons: [
      {text: 'Editar'},
      {text: 'Compartir'},
      ],
      destructiveText: 'Eliminar',
      cancelText: 'Cancelar',
      cancel: function () {
        // hideSheet();
        return true;
      },
      destructiveButtonClicked: function () {
        $http.delete("https://apiuni.herokuapp.com/contactos/"+contacto_id)
        .success(function (estado) {
          $scope.contactos = {};
          $scope.peticion_get();
          $ionicPopup.alert({
            title: "Informacion",
            template: "Contacto Eliminado"
          });
        })
        .error(function (respuesta, estado) {
          $ionicPopup.alert({
            title: "estado " + estado,
            template: "Ocurrio un error"
          });
        });
        return true;
      },
      buttonClicked: function (index) {
        switch(index){
          case 0:
             $ionicPopup.alert({
              title: "App",
              template: "Contacto Editado"
             });
            return true;
            break
          case 1:
            $ionicPopup.alert({
              title: "App",
              template: "Contacto Compartido"
            });
            return true;
            break
        }
      }
    })
  };
});