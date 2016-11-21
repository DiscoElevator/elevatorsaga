import $ from "jquery";
const px = 30;
const px_s = 15;
var ctx;

let avatarSelectionHandler;

const avatarWindow = {
    showModalWindow() {
        $(".modal-avatar").show();
        showVideoFromWebcamera();
    },
    hideModalWindow() {
        $(".modal-avatar").hide();
    },
    getImageUrl() {
        return getImageUrlFromVideo();
    },
    getImageUrlRandomAvatar() {
        return createRandomAvatar();
    },
    onAvatarSelect(callback) {
        avatarSelectionHandler = callback || function() {};
    }
};

$(function () {
    $(".modal-avatar .btn-ok").click(function () {
        var base64ImageUrl = avatarWindow.getImageUrl();

        $(".my-img").get(0).src = base64ImageUrl; // print img (for testing now)
        // for using: "image.src = avatar", where avatar is field from db

        $.post("http://localhost:3002/avatar",
            {
                name: $(".modal input").val(), // FIXME implicit dependency on login dialog
                img: base64ImageUrl
            },
            function (data, status) {
                if (status == "success") {
                    avatarWindow.hideModalWindow();
                    avatarSelectionHandler();
                }
            }
        );
    });

    $(".modal-avatar .btn-cancel").click(function () {
        var base64ImageUrl = avatarWindow.getImageUrlRandomAvatar();

        $(".my-img").get(0).src = base64ImageUrl; // print img (for testing now)

        $.post("http://localhost:3002/avatar",
            {
                name: $(".modal input").val(),
                img: base64ImageUrl
            },
            function (data, status) {
                if (status == "success") {
                    avatarWindow.hideModalWindow();
                    avatarSelectionHandler();
                }
            }
        );
    })
});

function showVideoFromWebcamera() {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
        || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    window.URL.createObjectURL = window.URL.createObjectURL || window.URL.webkitCreateObjectURL
        || window.URL.mozCreateObjectURL || window.URL.msCreateObjectURL;
    if (navigator.getUserMedia) {
        navigator.getUserMedia({video: true}, function (stream) {
            $(".video").get(0).src = window.URL.createObjectURL(stream);
            $(".video").get(0).play();
        }, function () {
            console.log("problems with video stream!");
        });
    }
}

function getImageUrlFromVideo() {
    var canvas = $(".my-canvas").get(0);
    var video = $(".video").get(0);
    var context = canvas.getContext("2d");
    context.drawImage(video, 80, 0, 480, 480, 0, 0, 300, 300);
    context.setTransform(1, 0, 0, 1, 0, 0);
    return canvas.toDataURL("image/jpeg");
}

export function createRandomAvatar () {
    var canvas = $(".my-canvas").get(0);
    // Canvas supported
    if (canvas.getContext) {
        ctx = canvas.getContext('2d');

        var cxlg = ctx.createLinearGradient(0, 0, 300, 300);
        cxlg.addColorStop(0, '#555');
        cxlg.addColorStop(0.5, '#ccc');
        cxlg.addColorStop(1.0, '#666');
        ctx.fillStyle = cxlg;

        ctx.fillRect(0, 0, 300, 300);
        ctx.fillRect(300, 0, 300, 300);
        ctx.fillRect(0, 300, 300, 300);

        face();
        eyes();

        // Mouth
        draw(randomColor(), [
                [4, 6], [5, 6]
            ]
        );

        // Hair
        hair();

        // Body
        body();
    }

    return canvas.toDataURL("image/jpeg");
};

/**
 * Face
 */
function face() {
    var faces = [
        [ // F@ face
            [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3.5],
            [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4],
            [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5],
            [2, 6], [3, 6], [4, 6], [5, 6], [6, 6], [7, 5.5],
        ],
        [ // Normal face
            [3, 3], [4, 3], [5, 3], [6, 3],
            [3, 4], [4, 4], [5, 4], [6, 4],
            [3, 5], [4, 5], [5, 5], [6, 5],
            [3, 6], [4, 6], [5, 6],
        ],
        [ // Alien face
            [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3], [8, 3],
            [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4], [8, 4],
            [3, 5], [4, 5], [5, 5], [6, 5],
            [3, 6], [4, 6], [5, 6],
        ]
    ];

    // Face
    draw(randomColor(), faces[randomBetween(faces.length)]);
}

/**
 * Eyes
 */
function eyes() {
    var eyes = [
        [
            [4, 4], [6, 4]
        ]
    ];

    // Eyes
    draw(randomColor(), eyes[randomBetween(eyes.length)]);

    var pupil = [
        [[4.5, 4], [6.5, 4]],
        [[4.5, 4.5], [6.5, 4.5]],
        [[4, 4.5], [6, 4.5]],
        [[4, 4], [6.5, 4.5]],
        [[4.5, 4.5], [6, 4]],
        []
    ];

    // Pupil
    draw(randomColor(), pupil[randomBetween(pupil.length)], px_s);
}

/**
 * Hair
 */
function hair() {
    var hair = [
        [
            [4, .5], [5, .5], [6, 0],
            [3, 1.5], [4, 1], [5, 1], [6, 1],
            [3, 2.5], [4, 2], [5, 2], [6, 2],
        ],
        [
            [4, .5], [5, .5], [6, 0], [7, 0],
            [2, 1.5], [3, 1.5], [4, 1], [5, 1], [6, 1],
            [2, 2.5], [3, 2.5], [4, 2], [5, 2], [6, 2], [7, 2],
        ],
        [
            [4, .5], [5, .5],
            [2, 1.5], [3, 1.5], [4, 1.5], [5, 1.5], [6, 1.5], [7, 1.5],
            [1, 2.5], [2, 2.5], [3, 2.5], [4, 2.5], [5, 2.5], [6, 2.5], [7, 2.5], [8, 2.5]
        ],
        []
    ];

    draw(randomColor(), hair[randomBetween(hair.length)]);
}

/**
 * Body
 */
function body() {
    var bodys = [
        [
            [2, 7], [3, 7], [4, 7], [5, 7], [6, 7],
            [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 8], [7, 8],
            [1, 9], [2, 9], [3, 9], [4, 9], [5, 9], [6, 9], [7, 9]
        ],
        [
            [2, 7], [3, 7], [4, 7], [5, 7], [5, 7], [6, 7], [7, 7],
            [0, 8], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 8], [7, 8], [8, 8], [9, 8],
            [0, 9], [1, 9], [2, 9], [3, 9], [4, 9], [5, 9], [6, 9], [7, 9], [8, 9], [9, 9]
        ]
    ];

    // Body
    draw(randomColor(), bodys[randomBetween(bodys.length)]);


    var body_decorations = [
        [
            [3, 7], [5, 7], [5, 7],
            [4, 8],
            [4, 9],
        ],
        []
    ];

    draw(randomColor(), body_decorations[randomBetween(body_decorations.length)]);

    var body_decorations_2 = [
        [
            [3.5, 7.5], [5, 7], [5, 7],
            [4, 8],
            [4, 9],
        ],
        [
            [3, 8.5], [5.5, 8.5],
            [2.5, 9], [6, 9],
            [2.5, 9.5], [5.5, 9.5]
        ],
    ];

    draw(randomColor(), body_decorations_2[randomBetween(body_decorations_2.length)], px_s);
}

function draw(color, coords, size) {
    $.each(coords, function (i, v) {

        var _size = px;

        if (size != undefined) {
            _size = size;
        }

        ctx.fillStyle = color;
        ctx.fillRect(coords[i][0] * px, coords[i][1] * px, _size, _size);
    });
}

function randomBetween(max) {
    var r;
    do {
        r = Math.random();
    } while (r == 1.0);
    return parseInt(r * max);
}

function randomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

export default avatarWindow;
