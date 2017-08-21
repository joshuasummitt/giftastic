
// We need to start with some cars:
var colorList = ["Ford", "Chevrolet", "Dodge"];

// We need these arrays to switch from still to animated and back
var srcIMGMoving = [];
var srcIMGStill = [];


$(document).ready(function () {

    // This creates a button for every car in the original car list
    // and also makes each subsequent button
    function makeButtons(array) {

        $.each(array, function (x, thisCar) {

            var carButton = $("<button>");

            // This makes the background color of the buttons to be the same
            var buttonBGColor = 'background-color: ' + thisCar + ';';

            carButton.attr({
                id: thisCar,
                class: "searchCar",
                value: thisCar,
                style: buttonBGColor
            });

            carButton.append(thisCar);

            $("#carButtons").append(carButton);

        }); // end of $.each(array, function (x, thisCar)
    }; // end of function makeButtons(array)

    // This renders the buttons on the initial load
    makeButtons(carList);



    // Action that happens when user enters a new car in the form
    $("#carForm").submit(function (event) {
        event.preventDefault();

        // Using a singleton array so I can use the array function makeButtons
        var carInputted = [];
        carInputted.push($("#carInput").val().trim());

        // launching the array function so we can make carInputted into a button
        makeButtons(carInputted);

        // This clears the input blank so it's not annoying
        $("#carInput").val("");
    }); // end of $("#carForm").submit(function (event)

   // This launches the ajax request on the giphy api when a color button is clicked
    $("#carButtons").on("click", ".searchCar", function () {

        // carNow is the current car we'll search and get gifs for
        var carNow = this.id;

        srcIMGMoving = [];
        srcIMGStill = [];

        // pulling pg rated images a max of 10 gif
        var rating = "pg";
        var limit = 10;

        // this is the search url for the color button that gets clicked
        var searchURL = "https://api.giphy.com/v1/gifs/search?q=" + carNow + "&rating=" + rating + "&limit=" + limit + "&api_key=bdcb153f07674582b757337f01962da5";

        $.ajax({
            url: searchURL,
            method: "GET"
        }).done(function(whatImGettingBack){

            $("#carImages").text("");

            carImgArray = whatImGettingBack.data;

            $.each(carImgArray, function (i) {

                rating = whatImGettingBack.data[i].rating;
                var thisImg = whatImGettingBack.data[i].images.original_still.url;

                // Populating these arrays for the logic below to do still vs. animated
                // The first is the still and the second one is the animated one
                srcIMGStill.push(thisImg);
                srcIMGMoving.push(whatImGettingBack.data[i].images.original.url);

                var containerForAll = $("<div>");
                $(containerForAll).attr("class", "imgContainer");

                var htmlForRating = $("<figcaption>");
                $(htmlForRating).append("Rating: " + rating);

                // html goodies for the (still) image
                var htmlForImage = $("<img>");
                $(htmlForImage).attr({
                    id: "image" + i,
                    src: thisImg
                });

                // rating and the image in the container
                $(containerForAll).append(htmlForRating);
                $(containerForAll).append(htmlForImage);
                $("#colorImages").append(containerForAll);

            });

            // the click event that switches from still to animated and back again
            $("img").on("click", function () {

                var srcOfClickedImage = $(this).attr("src");

                var switchToAnim = -1;
                var switchToStill = -1;

                $.each(srcIMGStill, function (i) {

                    if (srcOfClickedImage === srcIMGStill[i]){
                        switchToAnim = i;
                    };

                    if (srcOfClickedImage === srcIMGAnim[i]){
                        switchToStill = i;
                    };

                });

                if (switchToAnim != -1) {
                    $(this).attr("src", srcIMGAnim[switchToAnim]);
                };

                if (switchToStill != -1){
                    $(this).attr("src", srcIMGStill[switchToStill]);
                };

            }); // end of $("img").on("click", function ()
        }); // end of .done(function(whatImGettingBack)
    }); // end of $("#colorButtons").on("click", ".searchColor", function ()
}); // end of $(document).ready(function ()