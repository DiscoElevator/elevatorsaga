import _ from "lodash";
import $ from "jquery";
import {ravatar} from "./avatar";

const loginHandlers = [];
const loginDialog = {
    show(){
        $(".modal").show();
    },
    hide(){
        $(".modal").hide();
    },
    onLogin(callback){
        if (callback) {
            loginHandlers.push(callback);
        }
    }
};
var token;

$(function () {
    $(".modal button").click(function () {
        $.post("http://localhost:3002/login",
            {
                name: $(".modal input").val()
            },
            function (data, status) {
                if (status == "success") {
                    token = data;
                    loginDialog.hide();
                    loginHandlers.forEach(handler => handler(token));
                    // show video from webcam
                    $(".modal-avatar").show();
                    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
                    window.URL.createObjectURL = window.URL.createObjectURL || window.URL.webkitCreateObjectURL || window.URL.mozCreateObjectURL || window.URL.msCreateObjectURL;

                    if (navigator.getUserMedia) {
                        navigator.getUserMedia({video: true}, function (stream) {
                            var video_url = window.URL.createObjectURL(stream);
                            $(".video").get(0).src = video_url;
                            $(".video").get(0).play();
                        }, function () {
                            console.log("problems with video stream!");
                        });
                    }
                }
            })
            .fail(function () {
                $(".modal input").addClass("error");
            });
    });

    $(".modal-avatar .btn-ok").click(function () {
        var canvas = $(".my-canvas")[0];
        var video = $(".video")[0];
        var context = canvas.getContext("2d");
        context.drawImage(video, 80, 0, 480, 480, 0, 0, 300, 300);
        context.setTransform(1, 0, 0, 1, 0, 0);
        var base64dataUrl = canvas.toDataURL("image/jpeg");

        $(".my-img")[0].src = base64dataUrl; // print img (for testing now)
        // image.src = avatar (avatar - field from db)

        $.post("http://localhost:3002/avatar",
            {
                name: $(".modal input").val(),
                img: base64dataUrl
            },
            function (data, status) {
                if (status == "success") {
                    $(".modal-avatar").hide();
                }
            }
        );
    });

    $(".modal-avatar .btn-cancel").click(function () {
        var canvas = $(".my-canvas")[0];
        var base64dataUrl = ravatar(canvas);

        $(".my-img")[0].src = base64dataUrl;

        $.post("http://localhost:3002/avatar",
            {
                name: $(".modal input").val(),
                img: base64dataUrl
            },
            function (data, status) {
                if (status == "success") {
                    $(".modal-avatar").hide();
                }
            }
        );
    });

    $(".modal input").on('keyup', _.debounce(function (e) {
        $.post("http://localhost:3002/check",
            {
                name: $(".modal input").val()
            },
            function (data, status) {
                $(".modal input").removeClass("error");
                $(".modal button").prop("disabled", false);
            })
            .fail(function () {
                $(".modal input").addClass("error");
                $(".modal button").prop("disabled", true);
            });
    }, 300));
});

export default loginDialog;
