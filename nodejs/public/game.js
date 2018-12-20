(function() {
    var app = angular.module('switch_or_not', []);
    
    app.filter('unsafe', function($sce) {
        return function(val) {
            return $sce.trustAsHtml(val);
        };
    });
    
    app.controller('playController', function($scope, $rootScope, $http){
        getWeeks();
        
        var userid = uuidv4()
        
        $scope.selected = {}
        $scope.score = ""
        $scope.affiliate = ""
        
        getAffiliate()
        
        function getAffiliate(){
            $http.get('/api/titles/affiliate/text')
            .then(function(data){
                console.log(data.data)
                $scope.affiliate = data.data + " That's an affiliate link that supports the cost of hosting this game."
            })
        }
        
        function getWeeks(){
            $http.get('/api/titles')
            .then(function(data){
                $scope.weeks = data.data;
            })
        }
        
        function process_selected(selected){
            var sel_id = Object.keys(selected)
            var output = []
            for(var i=0; i < sel_id.length; i++){
                if(selected[sel_id[i]]){
                    output.push(sel_id[i])
                }
            }
            return(output)
        }
        
        function generate_score(fake, selected, all){
            var sel_id = process_selected(selected)
            var n = sel_id.length
            var true_pos = []
            var false_pos = []
            var false_neg = []
            for(var i=0; i < n; i++){
                var curr = sel_id[i]
                if(fake.indexOf(curr) > -1){
                    for(var m=0; m<all.length; m++){
                        if(all[m].game_id == curr){
                            true_pos.push(all[m].game)
                        }
                    }
                } else {
                    for(var k=0; k<all.length; k++){
                        if(all[k].game_id == curr){
                            false_pos.push(all[k].game)
                        }
                    }
                }
            }
            for(var j=0; j<fake.length; j++){
                var curr2 = fake[j]
                if(sel_id.indexOf(curr2) < 0){
                    for(var l=0; l<all.length; l++){
                        if(all[l].game_id == curr2){
                            false_neg.push(all[l].game)
                        }
                    }
                }
            }
            
            var lead = ""
            if(true_pos.length == fake.length){
                lead = "<h3>Wow!<h3>"
            }
            if(true_pos.length === 0){
                lead = "<h3>Oh, well!</h3>"
            }
            var output = lead+"<strong>You correctly found <big>"+true_pos.length+" of the "+fake.length+"</big> fake games hidden in this week's releases!"
            if(true_pos.length > 0){
                output += "<br>"+true_pos.join('<br>')
            }
            output += "</strong>"
            if(false_pos.length > 0){
                output += "<br><br><em>Real games you thought were fake:</em><br>"+false_pos.join('<br>')
            }
            if(false_neg.length > 0){
                output += "<br><br><em>Fake games you thought were real:</em><br>"+false_neg.join('<br>')
            }
            
            $scope.score = output
        }
        
        function generate_correct(all){
            var output = {}
            for(var i=0; i < all.length; i++){
                output[all[i].game_id] = all[i].real
            }
            return(output)
        }
        
        function select_fake(all){
            var output = []
            var keys = Object.keys(all)
            for(var i=0; i < keys.length; i++){
                if(all[keys[i]] === 0){
                    output.push(keys[i])
                }
            }
            return(output)
        }
        
        function uuidv4() {
          return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
        }
        
        function prep_data(games, guess, fake){
            var guesses = process_selected(guess)
            var output = []
            for(var i=0; i < games.length; i++){
                var tmp = games[i]
                var correct = 0
                if((fake.indexOf(tmp.game_id) > -1 && guesses.indexOf(tmp.game_id) > -1) ||
                   (fake.indexOf(tmp.game_id) < 0  && guesses.indexOf(tmp.game_id) < 0)){
                    correct = 1
                }
                output.push([tmp.week_id, tmp.game_id, userid, correct])
            }
            return(output)
        }
        
        function remove_null(games){
            var week_id = null
            for(var i=0; i < games.length; i++){
                if(games[i].week_id != null){
                    week_id = games[i].week_id
                }
            }
            for(var j=0; j < games.length; j++){
                games[j].week_id = week_id
            }
            return(games)
        }
        
        $scope.get_selected_week = function(){
            $scope.score = ""
            $scope.selected = {}
            $scope.games = {}
            $scope.correct = {}
            $scope.fake = {}
            var selected = $scope.week.selected
            $http.get('/api/titles/'+selected)
            .then(function(data){
                $scope.games = remove_null(data.data)
                $scope.correct = generate_correct(data.data)
                $scope.fake = select_fake($scope.correct)
            })
        }
        
        $scope.score_submission = function(){
            generate_score($scope.fake, $scope.selected, $scope.games)
            var data_packet = prep_data($scope.games, $scope.selected, $scope.fake)
            console.log(data_packet)
            $http.post('/api/scores', data_packet)
                .then(function(data){
                    console.log(data)      
                })
        }
    })
})();