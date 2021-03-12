$("#btnquicklogin").on("click", function () {
    var l = Ladda.create(document.querySelector("#btnquicklogin"));
    l.start();
    $.ajax({
        url: "/Account/Activating/" + $("#UserMobile").val(),
        dataType: "json",
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        type: "Post",
        data: {
            Active_Code: $("#activatecode").val(),
            __RequestVerificationToken: gettoken(),
        },
        async: true,
        cache: false,
        success: function (result) {
            if (result == true) {
                window.location.reload();
            }
            else if (result == false)
                alert("کد وارد شده اشتباه میباشد!");
        },
        error: function (result) {
        }
    });
    l.stop();
});

$("#activatecode").on('input', function () {
    var value = $("#activatecode").val();
    if (value.length >= 6) {
        $("#btnquicklogin").click();
    }
});

$("#UserMobile").on('input', function () {
    var value = $("#UserMobile").val();
    if (value.length == 11) {
        $("#validmobileNum").html("");
    }
});

$("#btnsendsms").on("click", function () {
    var value = $("#UserMobile").val();
    if (value.length != 11) {
        $("#validmobileNum").html("<p><small  class=\"color-pet\" >لطفا شماره موبایل را به درستی وارد کنید!</small></p>");
        return false;
    }
    else {
        $("#validmobileNum").html("");
    }
    var l = Ladda.create(document.querySelector("#btnsendsms"));
    l.start();
    $.ajax({
        url: "/Account/sendsmsregister/" + $("#UserMobile").val(),
        dataType: "json",
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        type: "Post",
        data: {
            __RequestVerificationToken: gettoken(),
        },
        async: true,
        cache: false,
        success: function (result) {
            if (result == true) {
                timerstart();
                $("#mobilechecker").html($("#UserMobile").val());
                $("#senddiv").css("display", "none");
                $("#Confirmdiv").removeAttr("Style");
            }
            else if (result == "Time")
                alert("کد تاییدیه برای شما به تازگی ارسال شد! لطفا منتظر بمانمید!");
        },
        error: function (result) {
        }
    });
    l.stop();
});

$("#sendAgain").on("click", function () {
    $("#senddiv").removeAttr("Style");
    $("#Confirmdiv").css("display", "none");
});

function timerstart() {
    $("#timerdiv").removeAttr("Style"); $("#sendAgain").css("display", "none");
    var countDownDate = new Date(); countDownDate.setMinutes(countDownDate.getMinutes() + 2); var x = setInterval(function () {
        var now = new Date().getTime(); var distance = countDownDate - now; var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)); var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        document.getElementById("timer").innerHTML = minutes + ":" + seconds; if (distance < 0) {
            clearInterval(x); document.getElementById("timer").innerHTML = "2:00";
            $("#sendAgain").removeAttr("Style"); $("#timerdiv").css("display", "none");
        }
    });
}