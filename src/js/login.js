import _ from "lodash";
import $ from "jquery";

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
