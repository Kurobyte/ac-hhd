/**
* AC-HDD Amiibo List 0.1 by Kurobyte (Ivan M.)
*/

(function() {
    angular
        .module('amiiboHhd', [ ])
        .directive("amiiboList", function(){
        return {
            restrict: 'E',
            templateUrl: 'partials/amiibo-list.html',
            require: ['$http', '$scope'],
            controller: function($http, $scope) {
                this.amiibos = undefined;
                this.userData = getURLParameter('data');
                this.editMode = getURLParameter('edit') == null ? false : true;
                $scope.editMode = this.editMode;
                this.storage = window.localStorage;
                this.language = getURLParameter('lang') == null ? (this.storage.getItem('lang') == null ? 'en' : this.storage.getItem('lang') ) : getURLParameter('lang');
                
                if (this.userData == undefined || this.userData == null) {
                    this.userData = this.storage.getItem('userData');
                    if (this.userData != null) {
                        this.userData = JSON.parse(atob(this.userData));
                        this.editMode = true;
                        $scope.editMode = this.editMode;
                    }
                } else {
                    this.userData = JSON.parse(atob(this.userData));
                }
                
                var that = this;
                $http.get('amiibos.json').then(function(res){
                    that.amiibos = res.data.amiiboData;
                    if (that.userData == undefined || that.userData == null) {
                        genUserData(res.data.amiiboData);
                        that.editMode = true;
                        $scope.editMode = that.editMode;
                        that.storage.setItem('userData', btoa(JSON.stringify(that.userData)));
                    }
                });
                
                this.getAnimalName = function(card) {
                    return acNames[this.language][parseInt(card.nCard)-1];
                }
                
                function genUserData(data) {
                    that.userData = {};
                    for(var i = 0; i < data.length; i++) {
                        that.userData[data[i].id] = {units: 0};
                    }
                }
                
                function getURLParameter(name) {
                    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
                }
                
                $scope.changeLanguage = function() {
                    that.language = $scope.language.code;
                    that.storage.setItem('lang', $scope.language.code);
                }
                
                $scope.saveChanges = function(opt) {
                    that.storage.setItem('userData', btoa(JSON.stringify(that.userData)));
                    if (opt)
                        showMessage("List saved!");
                }
                
                $scope.exportUrl = function(id) {
                    $('#'+id).html(window.location.origin+window.location.pathname+'?data='+$scope.exportData());
                }
                
                $scope.exportUserData = function(id) {
                    $('#'+id).html($scope.exportData());
                }
                
                $scope.exportShortUrl = function(id) {
                    var urlData = $scope.exportData();
                    $.getJSON("http://is.gd/create.php?format=json&url="+window.location.origin+window.location.pathname+"?data="+urlData).success(function(response){
                        $('#'+id).html(response.shorturl);
                    });
                }
                
                $scope.exportData = function(){
                    return btoa(JSON.stringify(that.userData));
                }
                
                $scope.importData = function(id) {
                    var strData = $('#'+id).val();
                    if (strData != "") {
                        try {
                            var strJson = atob(strData);
                            if (strJson != null || strJson != undefined) {
                                that.userData = JSON.parse(strJson);
                            }
                        } catch(err) {
                            alert("Invalid data!");
                        }
                    }
                    
                    return true;
                }
                
                $scope.appLangs = [
                    {name: "English", code: "en"},
                    {name: "Español", code: "es"},
                    {name: "Frances", code: "fr"}
                ];
                
                for (var i = 0; i < $scope.appLangs.length; i++) {
                    if ($scope.appLangs[i].code == this.language)
                        $scope.language = $scope.appLangs[i];
                }

            },
            controllerAs: 'aList'
        }
    })
    .directive("exportModal", function(){
        return {
            restrict: 'E',
            templateUrl: 'partials/export-modal.html'
        }
    })
    .directive("importModal", function(){
        return {
            restrict: 'E',
            templateUrl: 'partials/import-modal.html'
        }
    })
})();