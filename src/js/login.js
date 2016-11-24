import _ from "lodash";
import $ from "jquery";
import urlConfig from "../../urlConfig";

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
        $.post(urlConfig.loginServerUrl + "/login",
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


    $(".modal input").on('keyup', _.debounce(function (e) {
        $.post(urlConfig.loginServerUrl + "/check",
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
