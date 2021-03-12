$(document).ready(function () {
    $('#search_filtcity').on('click', 'a', function (e) {
        e.preventDefault(); var id = $(this).attr("id"); if (id.includes("filt")) {
            var iconfilt = document.getElementById(id.replace("filt_", "ifilt_")); var attr = $(iconfilt).attr('style'); if (typeof attr !== typeof undefined && attr !== !1) { $(iconfilt).removeAttr("style") }
            else { $(iconfilt).css("display", "none") }
        }
        else if (id.includes("city")) {
            var iconcity = document.getElementById(id.replace("city_", "icity_")); var attr = $(iconcity).attr('style'); var idsplit = $(iconcity).attr("id").split("_"); $("[id^='icity_" + idsplit[1] + "']").each(function () { $(this).css("display", "none") }); var iconcityeach = document.getElementById(id.replace("city_" + idsplit[1], "")); if (typeof attr !== typeof undefined && attr !== !1) { $(iconcity).removeAttr("style") }
            else { $(iconcity).css("display", "none") }
        }
        else if (id.includes("btnsearch")) {
            var allstring = ""; var state = ""
            var idsplit = id.split("_"); var filt = ""; $("[id^='ifilt_" + idsplit[1] + "']").each(function () { var attr = $(this).attr('style'); if (typeof attr == typeof undefined || attr == !1) { var attritem = $(this).attr('id').split("_"); filt += "*" + attritem[2] } }); if (filt !== "") { allstring = "&filt=" + idsplit[1] + "~" + filt.slice(1) }
            $("[id^='icity_" + idsplit[2] + "']").each(function () { var attr = $(this).attr('style'); if (typeof attr == typeof undefined || attr == !1) { var attritem = $(this).attr('id').split("_"); state += attritem[2] } }); if (state !== "") { allstring += "&city=" + state }
            window.location.href = "/Product/search?SlctGrpFilt=" + idsplit[2] + allstring
        }
    }); $("#btnsearch").on("click", function (e) {
        e.preventDefault(); var url = "/Product/search?"; if ($("#SlctGrpFilt").val() != "")
            url += "SlctGrpFilt=" + $("#SlctGrpFilt").val(); if ($("#state").val() != "")
            url += "&city=" + $("#state").val(); if ($("#Searchstring").val() != "")
            url += "&Searchstring=" + $("#Searchstring").val(); if (url != "/Product/search?")
            window.location.href = url
    })
})