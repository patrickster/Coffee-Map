
$(document).ready(function() {

    var initLat  = 47.6348,
        initLng  = -122.3436,
        initZoom = 13,
        minZoom  = 12,
        maxZoom  = 18,
        defaultCellOpacity = 0.4;
        highlightedCellOpacity = 0.8;

    var image_paths = { 
        "1"   : "img/stars_1.png", 
        "1.5" : "img/stars_1_half.png",
        "2"   : "img/stars_2.png",
        "2.5" : "img/stars_2_half.png",
        "3"   : "img/stars_3.png",
        "3.5" : "img/stars_3_half.png",
        "4"   : "img/stars_4.png",
        "4.5" : "img/stars_4_half.png",
        "5"   : "img/stars_5.png" 
    };

    var pointStyle = {
        fillColor: "#ff7800",
        // color: "#ff7800",
        weight: 0,
        opacity: 0,
        fillOpacity: 1
    };

    var pathOptions = {
        stroke: true,
        color: 'black',
        fillColor: 'black',
        fillOpacity: 1,
        opacity: 1
        // radius: 2
    };

    var styleControl;

    function getRatingColor(rating, palette) {
        if (palette == "red") {
            switch (rating) {
                case 1:   return "rgb(255, 245, 240)";
                case 1.5: return "rgb(254, 224, 210)";
                case 2:   return "rgb(252, 187, 161)";
                case 2.5: return "rgb(252, 146, 114)";
                case 3:   return "rgb(251, 106, 74)";
                case 3.5: return "rgb(239, 59, 44)";
                case 4:   return "rgb(203, 24, 29)";
                case 4.5: return "rgb(165, 15, 21)";
                case 5:   return "rgb(103, 0, 13)";
            }
        }
        if (palette == "yellowred") {
            switch (rating) {
                case 1:   return "rgb(255, 255, 204)";
                case 1.5: return "rgb(255, 237, 160)";
                case 2:   return "rgb(254, 217, 118)";
                case 2.5: return "rgb(254, 178, 76)";
                case 3:   return "rgb(253, 141, 60)";
                case 3.5: return "rgb(252, 78, 42)";
                case 4:   return "rgb(227, 26, 28)";
                case 4.5: return "rgb(189, 0, 38)";
                case 5:   return "rgb(128, 0, 38)";
            }
        }
    } 
    
    function getReviewColor(numReviews) {
        if (numReviews < 5)  return "rgb(242, 240, 247)";
        if (numReviews < 10) return "rgb(203, 201, 226)"; 
        if (numReviews < 20) return "rgb(158, 154, 200)"; 
        if (numReviews < 50) return "rgb(117, 107, 177)"; 
        return "rgb(84, 39, 143)";

        // if (numReviews < 5)  return "rgb(254, 237, 222)";
        // if (numReviews < 10) return "rgb(253, 190, 133)"; 
        // if (numReviews < 20) return "rgb(253, 141, 60)"; 
        // if (numReviews < 50) return "rgb(230, 85, 13)"; 
        // return "rgb(166, 54, 3)";

        
    }


    function getChainColor(name) {
        switch (name) {
            case "Starbucks":       return "rgb(0, 112, 66)";
            case "Tully's Coffee":  return "rgb(184, 61, 28)";
            default:                return "#b7b2b2";
        }
    }

    function calcOpacity(numReviews) {
        try {
            if (styleControl.getCurrentStyle() == "Rating") {
                return Math.log(numReviews + 3) / 9.0;
            } else {
                return defaultCellOpacity;
            }
        } catch (err) {
            return Math.log(numReviews + 3) / 9.0;
        }
    }

    function styleCell(cell) {
        return {
            weight: 0.7,
            opacity: 1,
            color: '#FFFFFF',
            // fillColor: cell.properties.rtng_cl,
            fillColor: getRatingColor(cell.properties.rating, "yellowred"),
            // fillColor: 'gray',
            // fillOpacity: 0.3
            fillOpacity: calcOpacity(cell.properties.reviews)
        };
    }

    function displayInfo(d) {
        console.log($('.info').text());
    }

    function highlightCell(e) {
        // var cell = L.DomUtil.get(e.target);
        var cell = e.target;
        // cell = cell._container.firstChild;
        // L.DomUtil.addClass(cell, 'highlighted-cell');
        // console.log(cell.style);
        cell.setStyle({
            fillOpacity: highlightedCellOpacity,
            weight: 2
        });
        info.update(cell.feature.properties);
    }

    function removeHighlight(e) {
        var cell = e.target;

        cell.setStyle({
            fillOpacity: calcOpacity(cell.feature.properties.reviews),
            weight: 0.7
        });
    }

    function addCellInteractions(cell, layer) {
        layer.on({
            mouseover: highlightCell,
            mouseout: removeHighlight
        });
    }

    /* ===================================== *
     * Styling functions                     */

    function colorByRating(cell) {
        return {
            weight: 0.7,
            opacity: 1,
            color: '#FFFFFF',
            fillColor: getRatingColor(cell.properties.rating, "yellowred"),
            fillOpacity: calcOpacity(cell.properties.reviews)
        };
    }

    function colorByReviews(cell) {
        return {
            weight: 0.7,
            opacity: 1,
            color: '#FFFFFF',
            fillColor: getReviewColor(cell.properties.reviews),
            fillOpacity: 0.3
        };
    }

    function colorByChain(cell) {
        return {
            weight: 0.7,
            opacity: 1,
            color: '#FFFFFF',
            fillColor: getChainColor(cell.properties.name),
            fillOpacity: 0.3
            
        };
    }

    function noColor(cell) {
        return {
            weight: 0.7,
            opacity: 1,
            color: '#FFFFFF',
            fillColor: 'black',
            fillOpacity: 0.1
        };
    }

    var map = L.map('map', {zoomControl: false}).setView([initLat, initLng], initZoom);
    
    L.tileLayer('http://{s}.tile.cloudmade.com/' + apiKey + '/22677/256/{z}/{x}/{y}.png', {
	   attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,'
                   + ' <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,' 
                   + ' Imagery &copy; <a href="http://cloudmade.com">CloudMade</a>,'
                   + ' Business data from <a href="http://www.yelp.com"><img src="img/yelp.png" alt="yelp-logo" style="vertical-align:bottom;"></a>',
	   maxZoom: maxZoom,
	   minZoom: minZoom
    }).addTo(map);

    // Add Voronoi cells 
    var cellGroup = new L.FeatureGroup();
    L.geoJson(cells, {
        style: styleCell,
        onEachFeature: addCellInteractions
    }).addTo(cellGroup);

    // cellGroup.setStyle(styleCell2);
    cellGroup.addTo(map);

    // Add points
    var pointGroup = new L.FeatureGroup();
    L.geoJson(points, {
	   pointToLayer: function (feature, latlng) {
             // return L.circleMarker(latlng, pathOptions);
             return L.circle(latlng, 3, pathOptions);
	   }
    }).addTo(pointGroup);
    pointGroup.addTo(map);

    var info = L.control({position: 'bottomleft'});
    
    info.onAdd = function (map) {
        var infoDiv = L.DomUtil.create('div', 'info');
        var topRow = document.createElement('div');
        var bottomRow = document.createElement('div');
        topRow.id = 'top_row';
        bottomRow.id = 'bottom_row';

        var nameTag = document.createElement('div');
        nameTag.id = 'name';
        nameTag.innerHTML = 'Every Coffee Shop in Seattle';
        var addressTag = document.createElement('div');
        addressTag.id = 'address';
        var ratingImage = document.createElement('img');
        ratingImage.id = 'rating_image';
        ratingImage.src = 'img/blank.gif';
        var reviewTag = document.createElement('div');
        reviewTag.id = 'reviews';

        // topRow.appendChild(nameTag);
        // topRow.appendChild(ratingImage);
        // bottomRow.appendChild(addressTag);
        // bottomRow.appendChild(reviewTag);

        // infoDiv.appendChild(topRow);
        // infoDiv.appendChild(bottomRow);

        infoDiv.appendChild(nameTag);
        infoDiv.appendChild(addressTag);
        infoDiv.appendChild(ratingImage);
        infoDiv.appendChild(reviewTag);

        this._div = infoDiv;
        return this._div;
    };

    info.update = function(d) {
        $('.info').css('visibility', 'visible');
        $(this._div).find('#name').html(d.name);
        $(this._div).find('#address').html(d.address);
        $(this._div).find('#rating_image').attr("src", image_paths[d.rating]);
        var reviewText;
        if (d.reviews == 1) {
            reviewText = "(1 review)";
        } else {
            reviewText = "(" + d.reviews + " reviews)";
        }
        $(this._div).find('#reviews').html(reviewText);
    };

    info.addTo(map);

    var styles = {
        "Rating"  : colorByRating,
        "Reviews" : colorByReviews,
        "Chains"  : colorByChain,
        "Nonet"   : noColor
    };

    var options = {
        position: 'topright',
        title: 'Color Scheme'
    };

    styleControl = L.control.styles(cellGroup, styles, options, "Rating").addTo(map);

    // var colorSelect = L.control({position: 'topright'});
    
    // colorSelect.onAdd = function (map) {
    //     var colorDiv = L.DomUtil.create('div', 'info');
    //     // colorDiv.innerHTML = 'Color scheme <select> <option value="none">None</option><option value="chain">Chains</option><option value="rating">Rating</option><option value="reviews">Reviews</option></select>';
    //     this._div = colorDiv;
    //     return this._div;
    // };

    // colorSelect.addTo(map);
    
})

