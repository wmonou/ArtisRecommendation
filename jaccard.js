    
var jaccardLib = function(data) {
    
   var data = data;
   var dataLiked = [];
   var dataDisliked = [];
   
   var setDataLiked = function(liked){
       dataLiked = liked;
   }
   
   var setDataDisliked = function(disliked){
       dataDisliked = disliked;
   }
 
   var sortArtistLiked = function()  {
        var artistLiked = new Array();
        for (let i = 0; i < data.length; i++) {
            var userId = data[i].UserID; 
            
            if (typeof artistLiked[userId] === typeof undefined) {
                artistLiked[userId] = [];
            }
                            
            if (data[i].UserID == userId && data[i].Liked == 'Y') {
                 artistLiked[userId].push(data[i].ArtistID);
            }
        }
        
        return artistLiked;
    }
    
    var sortArtistDisliked = function(userID)  {
        var artistDisliked = new Array();
        for (let i = 0; i < data.length; i++) {
            var userId = data[i].UserID; 
            
            if (typeof artistDisliked[userId] === typeof undefined && userId !== null) {
                artistDisliked[userId] = [];
            }
                            
            if (data[i].UserID == userId && data[i].Liked == 'N') {
                artistDisliked[userId].push(data[i].ArtistID);
            }
        }
        
        return artistDisliked;
    }
    
    var jaccardResult = function() {
        return recommendation = jaccardCalculation();
    }

    var jaccardCalculation = function() {
        var artistLiked = sortArtistLiked();
        var artistDisliked = sortArtistDisliked();

        var allScore = new Array();
        var dataLength = (artistLiked.length >= artistDisliked.length)? artistLiked.length : artistDisliked.length ;
        for(let i = 1; i < dataLength; i++) { // coz userid start from 1
            var score = 
                (intersect(dataLiked, artistLiked[i]).length + 
                intersect(dataDisliked, artistDisliked[i]).length - 
                intersect(dataDisliked, artistLiked[i]).length - 
                intersect(dataLiked, artistDisliked[i]).length)
                / union(union(dataLiked, artistLiked[i]), union(dataDisliked, artistDisliked[i])).length  ;
            allScore.push({userId : i, score: score}) 
        } // get preferences score, similiarity between users

        var recommendation = getRecommendation(allScore, artistLiked, artistDisliked);
        recommendation = difference(recommendation.recommedation, union(dataLiked, dataDisliked)) // exclude all choice by user
        recommendation = differencePercentage(recommendation, artistLiked, artistDisliked); // rating liked artist by all users

        return {
            recommendation: recommendation
        };
    }
    
    var getRecommendation = function(allScore, allArtistLiked, allArtistDisliked) {
        var unionArtisLiked = [];
        var intersectArtistDisliked = [];
        var similarUserId = [];
        var closestUserId = 0;
        var maxScore = 0;
        
        for(let i = 0; i < allScore.length; i++) {            
            if (maxScore <= allScore[i].score) {
                if (maxScore != allScore[i].score) { // if score higher
                    maxScore = allScore[i].score;                
                    closestUserId = allScore[i].userId;
                    similarUserId = []; // reset similar
                    similarUserId.push(closestUserId);
                } else { // if score equal
                    closestUserId = allScore[i].userId;
                    similarUserId.push(closestUserId);
                }
            }
        }
        
        for(let j = 0; j < similarUserId.length; j++) {
            (unionArtisLiked.length != 0) ?
                unionArtisLiked = union(unionArtisLiked, allArtistLiked[similarUserId[j]]) :
                unionArtisLiked = allArtistLiked[similarUserId[j]];
            
            (intersectArtistDisliked.length != 0) ?
                intersectArtistDisliked = intersect(intersectArtistDisliked, allArtistDisliked[similarUserId[j]]) :
                intersectArtistDisliked = allArtistDisliked[similarUserId[j]] ;
        }        

        return {
            maxScore : maxScore,
            similarUserId : similarUserId,
            recommedation : difference(unionArtisLiked, intersectArtistDisliked)
        }

    }

    var differencePercentage = function(artist, artistLiked, artistDisliked) {
        var percentage = new Array();
        var userLength = (artistLiked > artistDisliked)? artistLiked.length - 1 : artistDisliked.length - 1 ;
        for(let i = 0; i < artist.length; i++) {
            var artistId = artist[i];
            var countLiked = 0;
            var countDisliked = 0;
            for(let d = 0; d < data.length; d++) {
                if (artistId == data[d].ArtistID && data[d].Liked == 'Y') 
                    countLiked = countLiked + 1 ;
                if (artistId == data[d].ArtistID && data[d].Liked == 'N')     
                    countDisliked = countDisliked + 1 ;                
            }
            percentage.push({artistId : artistId , percentageLiked : (countLiked / userLength), percentageDisliked : (countDisliked / userLength)})                
        }

        return percentage.sort((a, b) => parseFloat(b.percentageLiked) - parseFloat(a.percentageLiked));
    }

    var intersect = function(array1, array2){
        var filteredArray = array1.filter(value => array2.includes(value));
        return filteredArray;
    }

    var union = function(array1, array2) {
        var combinedArray = arrayUnique(array1.concat(array2)) ;
        return combinedArray;
    }
    
    var difference = function(array1, array2){
        var differentArray = array1.filter(value => !array2.includes(value));
        return differentArray;
    }

    function arrayUnique(array) {
        var seen = {};
        var out = [];
        var len = array.length;
        var j = 0;
        for(var i = 0; i < len; i++) {
             var item = array[i];
             if(seen[item] !== 1) {
                   seen[item] = 1;
                   out[j++] = item;
             }
        }
        return out;
    }
    
    return {
        setDataLiked : setDataLiked,
        setDataDisliked : setDataDisliked,
        sortArtistLiked : sortArtistLiked,
        sortArtistDisliked : sortArtistDisliked,
        jaccardResult : jaccardResult
    }

}
