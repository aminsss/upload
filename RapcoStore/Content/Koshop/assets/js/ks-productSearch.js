//$(".an-scalupkala").hover(function () {
//    var id = $(this).attr("id");
//    $("#existence_" + id.replace("kalaStore_", "")).fadeIn();
//    $("#count_" + id.replace("kalaStore_", "")).fadeIn();
//    $("#price_" + id.replace("kalaStore_", "")).hide();
//}, function () {
//    var id = $(this).attr("id");
//    $("#price_" + id.replace("kalaStore_", "")).fadeIn();
//    $("#existence_" + id.replace("kalaStore_", "")).hide();
//    $("#count_" + id.replace("kalaStore_", "")).hide();
//});
$(document).ready(function () {
    $("#titlegropsearch").text($("#SlctGrpList").val().replace(/-/g, " ")/* + " در " + $("#slcstateList").val().replace(/-/g, " ")*/);
    var thishref = getUrlVars();
    if (thishref.SlctGrpFilt != undefined && thishref.SlctGrpFilt != '') {
        $.ajax({
            url: "/Product/getOthFilter/" + thishref.SlctGrpFilt /*$("#SlctGrpList").val()*/,
            success: function (result) {
                $('#OthFilter').html(result);
            },
        }).done(
            function () {
                if (thishref.filt != undefined && thishref.filt !== '') {
                    var pastfilters = thishref.filt.split('_');
                    for (var i = 0; i < pastfilters.length; i++) {
                        Pastfilt = pastfilters[i].split('*');
                        $("#Filter_" + Pastfilt[0]).val(Pastfilt[1]);
                    }
                }
            });
    }
    if ((thishref.state != undefined && thishref.state != '') || (thishref.city != undefined && thishref.city != '')) {
        $.ajax({
            url: "/Product/getCities/" + $("#slcstateList").val(),
            success: function (result) {
                $('#slccitydiv').html(result);
            },
        });
    }
    if (thishref.sortOption != undefined && thishref.sortOption != '') {
        if (thishref.sortOption == 1)
            $('#newsrt').addClass("active");
        if (thishref.sortOption == 2)
            $('#favsrt').addClass("active");
        if (thishref.sortOption == 3)
            $('#mostsrt').addClass("active");
    } else
    {
        $('#newsrt').addClass("active")
    }
    if (thishref.exist != undefined && thishref.exist != '')
    {
        if (thishref.exist == "yes") {
            $('#onlyexist-check').prop('checked', !0);
        }
    }
    $('#dvContent  a[href]').each(function () {
        var href = $(this).attr('href');
        ret = linkeditor(href); $(this).attr('href', ret);
    });
    $('#citychooser  a[href]').each(function () {
        var href = $(this).attr('href'); ret = linkeditor(href); $(this).attr('href', ret);
    });
    //$.ajax({ url: "/Product/getyadak/" + $("#yadak").val(),
    //  success: function (result) { $("#slcyadakdiv").html(result);
    //  $.ajax({ url: "/product/getOthFilter/" + $("#yadak").val(),
    //            success: function (result) { $("#yadakFilter").html(result); }
    //        });
    //    }, error: function () { }
    //});
});

function resetfilters() {
    var thishref = getUrlVars();
    if (thishref.filt != undefined && thishref.filt != '')
    {
        var pastfilters = thishref.filt.split('_');
        for (var i = 0; i < pastfilters.length; i++) {
            var PastfiltGrp = pastfilters[i].split('~');
            $("#deltfilter_" + PastfiltGrp[0]).removeAttr("checked");
            var Pastfilt = PastfiltGrp[1].split('*');
            for (var j = 0; j < Pastfilt.length; j++) {
                $("#checked-" + Pastfilt[j]).prop("checked", !0);
            }
        }
    }
}
$(document).ready(function ()
{
    $('#myPager').on('click', 'a', function (e) {
        e.preventDefault(); var url = this.href;
        $.ajax({
            url: url, type: 'GET', cache: !1,
            success: function (result, status, xhr) {
                $('#dvContent').html(result);
                $("#counter").html(" ( " + xhr.getResponseHeader("Counter") + " کالا ) ");
                $('#loadingIndicator').hide();
                ChangeUrl("Product/search", url);
            }
            , beforeSend: function () {
                $('html, body').animate({ scrollTop: 0 }, 'slow');
                $('#loadingIndicator').fadeIn();
            },
        });
        return !1;
    });
});

window.addEventListener("popstate", function (e) {
    {
        refreshback(); var thishref = getUrlVars();
        $('#loadingIndicator').fadeIn();
        $.ajax({
            url: location.href, success: function (result, status, xhr) {
                $('#loadingIndicator').hide();
                $('#dvContent').html(result);
                $("#counter").html(" ( " + xhr.getResponseHeader("Counter") + " کالا ) ");
            }
        });
        if (thishref.SlctGrpFilt != undefined && thishref.SlctGrpFilt != '')
        {
            $.ajax({
                url: "/Product/getOthFilter/" + thishref.SlctGrpFilt,
                success: function (result) {
                    $('#OthFilter').html(result);
                },
            }).done(function () {
                if (thishref.filt != undefined && thishref.filt != '')
                {
                    var pastfilters = thishref.filt.split('_');
                    for (var i = 0; i < pastfilters.length; i++)
                    {
                        Pastfilt = pastfilters[i].split('*');
                        $("#Filter_" + Pastfilt[0]).val(Pastfilt[1]);
                    }
                }
            });
        }
        else {
            $('#OthFilter').html("");
        }
        if (thishref.SearchString != undefined && thishref.SearchString != '') {
            $('#SearchString').html(thishref.SearchString);
        }
    }
});

function ChangeUrl(page, url) {
    $('#dvscript').load("~/content/Koshop/assets/_scriptload.html");
    $("#titlegropsearch").text($("#SlctGrpList").val().replace(/-/g, " ") /*+ " در " + $("#slcstateList").val().replace(/-/g, " ")*/);
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    if (typeof (history.pushState) != "undefined")
    {
        var obj = { Page: page, Url: url };
        history.pushState(null, obj.Page, obj.Url);
    } else {
        alert("Browser does not support HTML5.");
    }
}
$("#SearchString").keypress(function (e) {
    if (e.keyCode == 13) {
        e.preventDefault(); search();
    }
});

$("#btnSearch").click(function (e) {
    e.preventDefault(); search();
});

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]); vars[hash[0]] = hash[1];
    }
    return vars;
}

//function yadaktreeCrtor(id) {
//    $.ajax({
//        url: "/Product/getyadak/" + id, success: function (result) {
//            $("#slcyadakdiv").html(result);
//            $.ajax({
//                url: "/product/getOthFilter/" + id,
//                success: function (result) { $("#yadakFilter").html(result); }
//            });
//        }
//        , error: function () {
//        },
//    });
//}

function filterseprator(grp, atr, chksts) {
    var total = ""; var pastfilters; var chosenfilt = "";
    if (chksts == 0)
    {
        chosenfilt = '*' + atr;
    }
    var thisgroup = !1;
    var thishref = getUrlVars();
    if (thishref.filt != undefined && thishref.filt != '') {
        pastfilters = thishref.filt.split('_');
    }
    
    if (pastfilters != null) {
        for (var i = 0; i < pastfilters.length; i++) {
            var PastfiltGrp = pastfilters[i].split('~');
            if (PastfiltGrp[0] == grp) {
                thisgroup = !0;
                var Pastfilt = PastfiltGrp[1].split('*');
                if (Pastfilt.length == 1 && chksts == 1)
                {
                    $("#isfiltercheck_" + grp).css("display", "none");
                    $("#deltfilter_" + grp).attr("checked", "checked");
                }
                if (Pastfilt.length > 1 || chksts == 0) {
                    for (var j = 0; j < Pastfilt.length; j++) {
                        if (Pastfilt[j] != atr)
                            chosenfilt += '*' + Pastfilt[j];
                        else if (Pastfilt[j] == atr && chksts == 0)
                            chosenfilt = '*' + atr;
                    }
                    total += "_" + grp + '~' + chosenfilt.slice(1);
                }
            }
            else {
                total += "_" + pastfilters[i];
            }
        }
    }
    var varvar = "?filt="; if (thisgroup == !1) {
        $("#isfiltercheck_" + grp).removeAttr("style");
        $("#deltfilter_" + grp).removeAttr("checked").removeAttr("disabled");
        varvar += grp + '~' + chosenfilt.slice(1) + total;
    }
    else varvar += total.slice(1);
    return varvar;
}
function filterdeliter(grp) {
    var total = ""; var pastfilters;
    var thishref = getUrlVars();
    if (thishref.filt != undefined && thishref.filt != '') {
        pastfilters = thishref.filt.split('_');
    }
    if (pastfilters != null) {
        for (var i = 0; i < pastfilters.length; i++) {
            var PastfiltGrp = pastfilters[i].split('~');
            if (PastfiltGrp[0] == grp) {
                var Pastfilt = PastfiltGrp[1].split('*'); for (var j = 0; j < Pastfilt.length; j++) {
                    $("#checked-" + Pastfilt[j]).prop("checked", !1);
                }
                $("#deltfilter_" + grp).attr("checked", "checked"); $("#isfiltercheck_" + grp).css("display", "none");
            }
            else {
                total += '_' + pastfilters[i];
            }
        }
    }
    var varvar = "?filt=" + total.slice(1);
    return varvar;
}

function filterGroup(grpid, attrid) {
    $('#loadingIndicator').show();
    var curentUrl;
    var allvarstype = "filt";
    var checkbox = document.getElementById("checked-" + attrid);
    if (checkbox.checked != true) {
        var fitterseprator = filterseprator(grpid, attrid, 1);
    }
    else {
        var fitterseprator = filterseprator(grpid, attrid, 0);
    }
    curentUrl = "/Product/search" + fitterseprator + getAllVars(allvarstype);
    $.ajax({
        url: curentUrl,
        success: function (result, status, xhr) {
            $('#loadingIndicator').hide();
            $('#dvContent').html(result);
            $("#counter").html(" ( " + xhr.getResponseHeader("Counter") + " کالا ) ");
            ChangeUrl("Product/search", curentUrl);
            resetfilters();
        },
        error: function () {
            resetfilters();
            $('#loadingIndicator').hide();
        },

    });
}

function delfilters(id) {
    $('#loadingIndicator').show();
    var allvarstype = "filt";
    var filtdeliter = filterdeliter(id);
    var curentUrl = "/Product/search" + filtdeliter + getAllVars(allvarstype);
    $.ajax({
        url: curentUrl,
        success: function (result, status, xhr) {
            $('#loadingIndicator').hide();
            $('#dvContent').html(result);
            $("#counter").html(" ( " + xhr.getResponseHeader("Counter") + " کالا ) ");
            ChangeUrl("Product/search", curentUrl);
            resetfilters();
        },
        error: function () {
            resetfilters();
            $('#loadingIndicator').hide();
        },

    });
}


function getAllVars(id) {
    var VarString = ""; var thisVars = getUrlVars(); if (thisVars.state != undefined && thisVars.state != '' && "slcstateList" != id) { VarString += "&state=" + thisVars.state }
    if (thisVars.city != undefined && thisVars.city != '' && "slccityList" != id && "slcstateList" != id) { VarString += "&city=" + thisVars.city }
    if ((thisVars.state == undefined || thisVars.state == '') && "slccityList" == id) { VarString += "&state=" + $("#slcstateList").val() }
    if (thisVars._PageSize != undefined && thisVars._PageSize != '' && "PageSize" != id)
        VarString += "&_PageSize=" + $("#pagesizelist").val(); if (thisVars.SearchString != undefined && thisVars.SearchString != '' && "SearchString" != id)
        VarString += "&SearchString=" + thisVars.SearchString; if (thisVars.sortOption != undefined && thisVars.sortOption != '' && "sortOption" != id)
        VarString += "&sortOption=" + thisVars.sortOption; if (thisVars.SlctGrpFilt != undefined && thisVars.SlctGrpFilt != '' && "SlctGrpFilt" != id) { VarString += "&SlctGrpFilt=" + thisVars.SlctGrpFilt }
    if (thisVars.yadak != undefined && thisVars.yadak != '' && "yadak" != id) { VarString += "&yadak=" + thisVars.yadak }
    if (thisVars.exist != undefined && thisVars.exist != '' && "exist" != id) { VarString += "&exist=" + thisVars.exist }
    if (thisVars.filt != undefined && thisVars.filt != '' && "filt" != id && "SlctGrpFilt" != id) { VarString += "&filt=" + thisVars.filt; }
    if (thisVars.yadf != undefined && thisVars.yadf != '' && "yadak" != id && "yadf" != id) { VarString += "&yadf=" + thisVars.yadf; }
    return VarString;

}
function search() {
    $('#loadingIndicator').fadeIn();
    var curentUrl = "/Product/search?SearchString=" + $('#SearchString').val() + getAllVars("SearchString");
    if ($('#SearchString').val() == "")
         curentUrl = "/Product/search?" + getAllVars("SearchString");
    $.ajax({
        url: curentUrl, success: function (result, status, xhr) {
            $('#loadingIndicator').hide(); $('#dvContent').html(result);
            $("#counter").html(" ( " + xhr.getResponseHeader("Counter") + " کالا ) ");
            ChangeUrl("AllProduct", curentUrl);
        }
    });
}
$("#SlctGrpList").on("change", function (e) { e.preventDefault(); $('#loadingIndicator').fadeIn(); var curentUrl = "/Product/search?SlctGrpFilt=" + $("#SlctGrpList").val() + getAllVars("SlctGrpFilt"); $.ajax({ url: curentUrl, success: function (result, status, xhr) { $('#loadingIndicator').hide(); $('#dvContent').html(result); $("#counter").html(" ( " + xhr.getResponseHeader("Counter") + " کالا ) "); ChangeUrl("Product/search", curentUrl) }, error: function () { $('#loadingIndicator').hide() }, }); $.ajax({ url: "/Product/getOthFilter/" + $("#SlctGrpList").val(), success: function (result) { $('#OthFilter').html(result); $('.dropdown-toggle').dropdown() }, error: function () { }, }) }); $("#slcstateList").on("change", function (e) { e.preventDefault(); $('#loadingIndicator').fadeIn(); var curentUrl = "/Product/search?state=" + $("#slcstateList").val() + getAllVars("slcstateList"); $.ajax({ url: curentUrl, success: function (result, status, xhr) { $('#loadingIndicator').hide(); ChangeUrl("Product/search", curentUrl); $('#dvContent').html(result); $("#counter").html(" ( " + xhr.getResponseHeader("Counter") + " کالا ) ") }, error: function () { $('#loadingIndicator').hide() }, }); $.ajax({ url: "/Product/getCities/" + $("#slcstateList").val(), success: function (result) { $("#slccitydiv").html(result) }, error: function () { }, }) }); $('#onlyexist-check').on("change", function (e) {
    e.preventDefault(); $('#loadingIndicator').fadeIn(); var exist = "no"; if ($(this).is(":checked")) { exist = "yes" }
    else { exist = "no" }
    var curentUrl = "/Product/search?exist=" + exist + getAllVars("exist");
    $.ajax({
        url: curentUrl, success: function (result, status, xhr)
        {
            $('#loadingIndicator').hide(); ChangeUrl("Product/search", curentUrl);
            $('#dvContent').html(result); $("#counter").html(" ( " + xhr.getResponseHeader("Counter") + " کالا ) ");
        }, error: function () {
            $('#loadingIndicator').hide();
        },
    })
}); $('#dvContent').bind("DOMSubtreeModified", function ()
{
    $('#citychooser  a[href]').each(function () {
        if (href != "#")
        {
            var href = $(this).attr('href');
            var statesplit = href.split("&city");
            var citysplit = statesplit[0].split("&state");
            ret = linkeditor(citysplit[0]); $(this).attr('href', ret);
        }
    });

    $('#dvContent  a[href]').each(function () {
        var href = $(this).attr('href');
        ret = linkeditor(href); $(this).attr('href', ret);
    });

}); function linkeditor(href) {
    var querystring = '';
    var thisVars = getUrlVars();
    if (!href.includes("collapsekala") && !href.includes("city") && thisVars.city != undefined && thisVars.city != '')
    {
        href += (href.match(/\?/) ? '&' : '?') + "city=" + thisVars.city;
    }
    if (!href.includes("collapsekala") && !href.includes("state") && thisVars.state != undefined && thisVars.state != '')
    {
        href += (href.match(/\?/) ? '&' : '?') + "state=" + thisVars.state;
    }
    return href;
}
function sortchange(id) {
    $('#loadingIndicator').fadeIn();
    var thisVars = getUrlVars();
    var curentUrl = "/Product/search?sortOption=" + id + getAllVars("sortOption");
    $.ajax({
        url: curentUrl, success: function (result, status, xhr) {
            $('#loadingIndicator').hide(); $('#dvContent').html(result);
            $("#counter").html(" ( " + xhr.getResponseHeader("Counter") + " کالا ) ");
            ChangeUrl("Product/search", curentUrl);
        }, error: function () {
            $('#loadingIndicator').hide();
        }
    });
}
