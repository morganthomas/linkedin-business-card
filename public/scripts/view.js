// This module relies on global variables 'user' and 'me' which are initially populated
// in a script tag generated on the server side. 'user' contains the user whose card
// we are viewing, and 'me' contains the user who we are. I thought this approach was
// simpler and more efficient than fetching this information using the AJAX API.

var businessCardApp = angular.module('businessCardApp', ['ui.bootstrap']);

businessCardApp.controller('businessCardController', function($scope, $http) {
  $scope.user = user;
  $scope.me = me;
  $scope.editEnabled = false;
  $scope.alerts = [];

  $scope.addPosition = function() {
    user.positions.push({ title: '', company: '' });
  }

  $scope.removePosition = function(index) {
    user.positions.splice(index, 1);
  }

  $scope.toggleEdit = function() {
    $scope.editEnabled = !$scope.editEnabled;
  }

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  }

  $scope.save = function() {
    $http.put('/api/save', { user: user })
      .then(function(res) {
        $scope.alerts.push({ type: 'info', msg: 'Saved!' });
        $scope.editEnabled = false;
      },
      function(res) {
        $scope.alerts.push({ type: 'danger', msg: res });
        console.log(res);
      });
  }
});

businessCardApp.directive('cardEditableField', function() {
  return {
    restrict: 'E',
    templateUrl: '/angular-templates/card-editable-field',
    scope: {
      object: '=cardObject',
      field: '@cardField',
      label: '@cardLabel',
      showLabel: '=cardShowLabel',
      editEnabled: '=cardEditEnabled'
    },
    link: function(scope, elem, attrs) {
      scope.editing = false;

      scope.setEditing = function() {
        if (!scope.editEnabled) {
          return;
        }

        var $text = elem.find('.editable-text');
        var $editor = elem.find('.in-place-editor');
        $text.hide();
        $editor.show();
        $editor.focus();
        scope.editing = true;
      }

      scope.setNotEditing = function() {
        var $text = elem.find('.editable-text');
        var $editor = elem.find('.in-place-editor');
        $text.show();
        $editor.hide();
        scope.editing = false;
      }
    }
  }
});
