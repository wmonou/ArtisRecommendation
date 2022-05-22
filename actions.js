var actions = function(data){

    var data = data;
    var counter = 0;
    var maxCounter = 5;
    var taken = [];
    var liked = [];
    var disliked = [];
    var recommedation = [];

    var artistIds = 
        [
         '1', '2', '3', '4', '5', 
         '6', '7', '8', '9', '10', 
         '11', '12', '13', '14', '15',
         '16', '17', '18', '19', '20',
         '21', '22', '23', '24', '25'
        ];
    
    var readyButtonClicked = function(){
        $("#readyButton").click(function (e) {
            console.log("readyButtonClicked");

            e.preventDefault();
            $("#cover").fadeOut("slow", function() {
                $("#question").fadeIn("slow", function(){
                    randomizeData();
                });
            });
      });
    }
    
    var yesButtonClicked = function(){
        $("#yesButton").click(function (e) {
            if (counter < maxCounter) {
                liked.push($('.artistbox').attr('artist-id'))
                randomizeData()
                counter = counter + 1;
                console.log(counter);            
            } else {
                calculationData();
            }

        });
    }

    var noButtonClicked = function(){  
        $("#noButton").click(function (e) {      
            if (counter < maxCounter) {
                disliked.push($('.artistbox').attr('artist-id'));
                randomizeData()
                counter = counter + 1;
                console.log(counter);
            } else {
                calculationData();
            }
        });
    }

    var randomizeData = function(){
        var artist = artistIds[Math.floor(Math.random() * artistIds.length)];
        if (taken.includes(artist)) {
            randomizeData();
        }
        $('.artistbox').attr('artist-id', artist);
        $('.artistid').html('Artist Name ' + artist);
        $('.artistname').html('Artist Id ' + artist);
        $('.artistbox').css('background-image', 'url(images/'+ artist + ".jpg)");

        taken.push(artist);
    }

    var calculationData = function(){
        console.log(liked, disliked);
        $("#question").fadeOut("slow", function(){
            $("#recommendation").fadeIn("slow", function(){
                var j = jaccardLib(data);
                j.setDataLiked(liked);
                j.setDataDisliked(disliked);
                var result = j.jaccardResult();
                getRecommendation(result.recommendation);
            });
        });
        
    }

    var getRecommendation = function(recommendation) {
        $("#recommendationArtist").html("");
        for(let i = 0; i < maxCounter; i++){
            $("#recommendationArtist").append("<div>Artist Name "+ recommendation[i].artistId +", Id"+ recommendation[i].artistId +"</div>");            
        }
        responData({liked : liked, disliked : disliked, recommedation : recommedation})
        return recommedation = recommedation;
    }
    
    return {
        readyButtonClicked : readyButtonClicked,
        yesButtonClicked : yesButtonClicked,
        noButtonClicked : noButtonClicked,
        recommedation : recommedation
    }
}