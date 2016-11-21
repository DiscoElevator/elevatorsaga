import _ from "lodash";
import $ from "jquery";
import avatarWindow from "./avatar";

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
                }
            })
            .fail(function () {
                $(".modal input").addClass("error");
            });
    });

    $(".modal-avatar .btn-ok").click(function () {
        var base64ImageUrl = avatarWindow.getImageUrl();

        $(".my-img").get(0).src = base64ImageUrl; // print img (for testing now)
        // for using: "image.src = avatar", where avatar is field from db

        $.post("http://localhost:3002/avatar",
            {
                name: $(".modal input").val(),
                img: base64ImageUrl
            },
            function (data, status) {
                if (status == "success") {
                    avatarWindow.hideModalWindow();
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
