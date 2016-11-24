import _ from "lodash";
import $ from "jquery";
import avatarWindow from "./avatar";
const url_config = require(".././../url_config.json");

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
    $(".modal form").submit(function (e) {
        $.post(url_config.main_url+"/login",
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
        e.preventDefault();
    });

    $(".modal-avatar .btn-ok").click(function () {
        var base64ImageUrl = avatarWindow.getImageUrl();
        $.post(url_config.main_url+"/avatar",
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
        $.post(url_config.main_url+"/avatar",
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
        $.post(url_config.main_url+"/check",
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
