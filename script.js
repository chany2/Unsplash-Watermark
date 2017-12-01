$(document).ready(function($) {

    // SAVE IMAGE
    $('#save_image_locally').click(function(){
        html2canvas($(".canvas-editor"), 
        {
          onrendered: function (canvas) {
            var a = document.createElement('a');
            // toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
            a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
            a.download = filename()+'.jpg';
            a.click();
          }
        });
      });

    // SAVE QUOTE IMAGE
    $("#btnColor").click(function() {
        $('#output').toggleClass('blacktext');
        $('#output').toggleClass('whitetext');
    });

});

function filename(){

    var filename = "unsplash-" + image_user_name.replace(/\s/g, '-').toLowerCase() + "-" + photo_id;

    // USE IMAGE DESCRIPTION
    if(image_description != null){
        filename = image_description.removeStopWords().replace(/\s/g, '-');
    }

    return filename;

}

function fetchPhotoID(){

    photo_id = $('#unsplash_photo_url').val().split('/')[4].replace(/\s/g, '');

}

function fetchUnsplashImageInfo() {

    // FETCH UNSPLASH URL
    fetchPhotoID()

    $.ajax({
        type:"GET",
        dataType: "json",
        url: "https://api.unsplash.com/photos/"+photo_id+"/?client_id=33ce694504bc84f43699526a0130e9e288718cae9f039369d20982c8fcb8641f",
        success: function(data){
            regular_src_image_url = data.urls.regular;
            image_user_name = data.user.name;
            image_description = data.description;
            photo_color = data.color;

            // PRINT PHOTOGRAPHER ON IMAGE
            $('.watermark span').show();
            $('#output b#photographer_name').text(image_user_name);

            // PRINT IMAGE
            changeimage(regular_src_image_url);

            // CHANGE COLOR TEXT
            detectBGcolor(photo_color);
        }
    });

}


function changeimage(regular_src_image_url) {

    var thisVal = regular_src_image_url //GET GLOBAL RAW SRC IMAGE URL
    var imageUrl = thisVal;
    var canvas = document.getElementById('s1-canvas');
    var img = new Image();

    img.crossOrigin = "Anonymous";

    img.onload = function() {
        canvas.width = this.width;
        canvas.height = this.height;
        canvas.getContext('2d').drawImage(this, 0, 0);

        canvas.toDataURL();
        canvas.getContext('2d').getImageData(0, 0, 100, 100);

        // CHANGE CANVAS SIZE
        fixCanvasSize();
    };
    img.src = imageUrl;

}

function fixCanvasSize(){
    $('.canvas-editor').height($('#s1-canvas').height());
    $('.canvas-editor').width($('#s1-canvas').width()-1);
}

function detectBGcolor(photo_color){
    var hex = photo_color;

    var c = hex.substring(1);      // strip #
    var rgb = parseInt(c, 16);   // convert rrggbb to decimal
    var r = (rgb >> 16) & 0xff;  // extract red
    var g = (rgb >>  8) & 0xff;  // extract green
    var b = (rgb >>  0) & 0xff;  // extract blue

    var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

    if (luma < 128) { // DARK
        $('#output').toggleClass('blacktext');
        $('#output').toggleClass('whitetext');
    }else{ // LIGHT
        $('#output').toggleClass('blacktext');
        $('#output').toggleClass('whitetext');
    }
}