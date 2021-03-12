var bottom, toop, left, right; var follower = "1"; var view = new ol.View({ center: ol.proj.fromLonLat([51.40876293182373, 35.757448286487595]), zoom: 6, maxZoom: 19, minZoom: 5, }); var map = new ol.Map({ target: 'map', view: view, layers: [new ol.layer.Tile({ preload: 3, source: new ol.source.OSM(), })], loadTilesWhileAnimating: !0, }); var vectorSource = new ol.source.Vector({}); var element = document.getElementById('popup'); var popup = new ol.Overlay({ element: element, positioning: 'bottom-center', stopEvent: !1, offset: [0, -50] }); map.addOverlay(popup); map.on('click', function (evt) {
    map.updateSize(); $(".store").removeClass("activeS"); var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) { return feature }); if (feature) { $("#store_" + feature.getId()).addClass("activeS"); var $container = $('.an-listing-result-content'), $scrollTo = $("#store_" + feature.getId()); $container.animate({ scrollTop: $scrollTo.offset().top - $container.offset().top - 10 + $container.scrollTop() }, 400); var coordinates = feature.getGeometry().getCoordinates(); popup.setPosition(coordinates); $(element).popover({ placement: 'top', html: !0, }); $(element).data('bs.popover').options.content = $("div").data(feature.getId()).contentdata; $(element).popover('show') } else { $(element).popover('destroy') }
    var markervienna = new ol.Overlay({ position: coordinates, positioning: 'bottom-center', element: document.getElementById('markervienna'), stopEvent: !1 }); map.addOverlay(markervienna)
}); function flyTo(long, lat, stId) {
    var popTime = 0; $(".store").removeClass("activeS"); var pos = new ol.proj.fromLonLat([long, lat]); $("#store_" + stId).addClass("activeS"); var markervienna = new ol.Overlay({ position: pos, positioning: 'bottom-center', element: document.getElementById('markervienna'), stopEvent: !1 }); map.addOverlay(markervienna); if (long < left || long > right || lat < bottom || lat > toop) { var centerInPx = map.getPixelFromCoordinate(new ol.proj.fromLonLat([long, lat])); var newCenterInPx = [centerInPx[0] + 200, centerInPx[1]]; var newCenter = map.getCoordinateFromPixel(newCenterInPx); view.animate({ center: newCenter, duration: 500 }); popTime = 1000 }
    var $container = $('.an-listing-result-content'), $scrollTo = $("#store_" + stId); $container.animate({ scrollTop: $scrollTo.offset().top - $container.offset().top - 10 + $container.scrollTop() }, 400); map.updateSize(); setTimeout(function () { popup.setPosition(pos); $(element).popover({ placement: 'top', html: !0, }); $(element).data('bs.popover').options.content = $("div").data(stId).contentdata; $(element).popover('show') }, popTime)
}
function gotomapcenter(maxlong, minlong, maxlat, minlat) {
    var duration = 2000; var zoom = view.getZoom(); var parts = 2; var called = !1; function callback(complete) {
        --parts; if (called) { return }
        if (parts === 0 || !complete) { called = !0 }
    }
    var centerInPx = map.getPixelFromCoordinate(new ol.proj.fromLonLat([((maxlong + minlong) / 2), ((maxlat + minlat) / 2)])); var newCenterInPx = [centerInPx[0] + 100, centerInPx[1]]; var newCenter = map.getCoordinateFromPixel(newCenterInPx); if (maxlong == minlong && maxlat == minlat) { newCenter = ol.proj.fromLonLat([((maxlong + minlong) / 2), ((maxlat + minlat) / 2)]) }
    view.animate({ center: newCenter, duration: duration }, callback); if (maxlong - minlong > 10 || maxlat - minlat > 10)
        zoom = 5; else if (maxlong - minlong > 6 || maxlat - minlat > 6)
        zoom = 6; else if (maxlong - minlong > 2 || maxlat - minlat > 2)
        zoom = 7; else if (maxlong - minlong > 1.3 || maxlat - minlat > 1.3)
        zoom = 8; else if (maxlong - minlong > 0.64 || maxlat - minlat > 0.64)
        zoom = 9; else if (maxlong - minlong > 0.32 || maxlat - minlat > 0.32)
        zoom = 10; else if (maxlong - minlong > 0.16 || maxlat - minlat > 0.16)
        zoom = 11; else if (maxlong - minlong > 0.08 || maxlat - minlat > 0.08)
        zoom = 12; else if (maxlong - minlong > 0.04 || maxlat - minlat > 0.04)
        zoom = 13; else if (maxlong - minlong > 0.02 || maxlat - minlat > 0.02)
        zoom = 14; else if (maxlong - minlong > 0.01 || maxlat - minlat > 0.01)
        zoom = 15; else if (maxlong - minlong > 0.005 || maxlat - minlat > 0.005)
        zoom = 16; else if (maxlong - minlong > 0.002 || maxlat - minlat > 0.002)
        zoom = 17; else zoom = 18; view.animate({ zoom: zoom - 1, duration: duration / 2 }, { zoom: zoom, duration: duration / 2 }, callback)
}
function wrapLon(value) { var worlds = Math.floor((value + 180) / 360); return value - (worlds * 360) }
function onMoveEnd(evt) { var map = evt.map; var extent = map.getView().calculateExtent(map.getSize()); var bottomLeft = new ol.proj.toLonLat(new ol.extent.getBottomLeft(extent)); var topRight = new ol.proj.toLonLat(new ol.extent.getTopRight(extent)); bottom = bottomLeft[1]; toop = topRight[1]; left = wrapLon(bottomLeft[0]); right = wrapLon(topRight[0]); var topRightInPx = map.getPixelFromCoordinate(topRight); var newtopRightInPx = [topRightInPx[0] - 0.0048, topRightInPx[1]]; var newtopRight = map.getCoordinateFromPixel(newtopRightInPx); right = wrapLon(newtopRight[0]) }
map.on('moveend', onMoveEnd); var target = map.getTarget(); var jTarget = typeof target === "string" ? $("#" + target) : $(target); $(map.getViewport()).on('mousemove', function (e) { var pixel = map.getEventPixel(e.originalEvent); var hit = map.forEachFeatureAtPixel(pixel, function (feature, layer) { return !0 }); if (hit) { jTarget.css("cursor", "pointer") } else { jTarget.css("cursor", "") } }); $("#searchinareaid").on("click", function () {
    vectorSource.clear(); $(element).popover('destroy'); var markervienna = new ol.Overlay({ element: document.getElementById('markervienna'), }); map.addOverlay(markervienna); $.ajax({ url: "/Mapshow/storeslist/" + $("#idPr").val(), type: 'GET', data: { follower: follower, bottom: bottom, left: left, right: right, top: toop, __RequestVerificationToken: gettoken(), }, cache: !1, success: function (result) { $('#storeslist').html(result) }, beforeSend: function () { $('.loadingmap').fadeIn() }, error: function (result) { $('.loadingmap').hide() }, }); $.ajax({
        url: "/Mapshow/searchinarea", dataType: "json", type: "POST", contentType: 'application/x-www-form-urlencoded; charset=utf-8', data: { follower: follower, id: $("#idPr").val(), bottom: bottom, left: left, right: right, top: toop, __RequestVerificationToken: gettoken(), }, async: !0, cache: !1, success: function (result) {
            $('.loadingmap').hide(); for (var i = 0; i < (result.length / 4); i++) { var iconFeature = new ol.Feature({ geometry: new ol.geom.Point(ol.proj.transform([parseFloat(result[i * 4]), parseFloat(result[i * 4 + 1])], 'EPSG:4326', 'EPSG:3857')), }); var iconStyle = new ol.style.Style({ image: new ol.style.Icon({ anchor: [0.5, 60], anchorXUnits: 'fraction', anchorYUnits: 'pixels', src: '~/content/Koshop/assets/img/location.png', color: "#AAA", crossOrigin: 'anonymous', }) }); iconFeature.setStyle(iconStyle); iconFeature.setId(result[i * 4 + 2]); vectorSource.addFeature(iconFeature); $("div").data((result[i * 4 + 2]), { contentdata: (result[i * 4 + 3]) }) }
            var vectorLayer = new ol.layer.Vector({ source: vectorSource, updateWhileAnimating: !0, updateWhileInteracting: !0, }); map.addLayer(vectorLayer)
        }, error: function (result) { $('.loadingmap').hide(); alert("در حال حاضر در دسترس نمیباشد") },
    })
}); $(document).ready(function () { fisrtload() }); function followerror(id) {
    if ($("#followclick_" + id).hasClass("an-btn-light")) { changefollowicon(id, "an-btn-light") }
    else if ($("#followclick_" + id).hasClass("an-btn-default")) { changefollowicon(id, "an-btn-default") }
}
function changefollowicon(id, btn) {
    if (btn == "an-btn-default") {
        $("#followclick_" + id).addClass("an-btn-light")
        $("#followclick_" + id).removeClass("an-btn-default")
        $("#followclick_" + id).text("دنبال میکنم")
    }
    else if (btn == "an-btn-light") {
        $("#followclick_" + id).addClass("an-btn-default")
        $("#followclick_" + id).removeClass("an-btn-light")
        $("#followclick_" + id).text("دنبال کردن")
    }
}
$("#followshop").on("click", function () {
    if ($("#authStatus").val() == "True") {
        if ($("#followshop").hasClass("an-btn-default")) { follower = "2"; $("#followshop").removeClass("an-btn-default"); $("#followshop").addClass("an-btn-light"); $("#notfollowshop").removeClass("an-btn-light"); $("#notfollowshop").addClass("an-btn-default") }
        else if ($("#followshop").hasClass("an-btn-light")) { follower = "1"; $("#followshop").removeClass("an-btn-light"); $("#followshop").addClass("an-btn-default") }
        fisrtload()
    }
    else { $("#ModalLogin").modal("show") }
}); $("#notfollowshop").on("click", function () {
    if ($("#authStatus").val() == "True") {
        if ($("#notfollowshop").hasClass("an-btn-default")) { follower = "3"; $("#notfollowshop").removeClass("an-btn-default"); $("#notfollowshop").addClass("an-btn-light"); $("#followshop").removeClass("an-btn-light"); $("#followshop").addClass("an-btn-default") }
        else if ($("#notfollowshop").hasClass("an-btn-light")) { follower = "1"; $("#notfollowshop").removeClass("an-btn-light"); $("#notfollowshop").addClass("an-btn-default") }
        fisrtload()
    }
    else { $("#ModalLogin").modal("show") }
}); function fisrtload() {
    vectorSource.clear(); $(element).popover('destroy'); var markervienna = new ol.Overlay({ element: document.getElementById('markervienna'), }); map.addOverlay(markervienna); $.ajax({ url: "/Mapshow/storeslist/" + $("#idPr").val(), type: 'GET', data: { cityid: $("#cityid").val(), stateid: $("#stateid").val(), follower: follower, __RequestVerificationToken: gettoken(), }, cache: !1, success: function (result) { $('#storeslist').html(result) }, beforeSend: function () { $('.loadingmap').fadeIn() }, }); $.ajax({
        url: "/Mapshow/searchinarea", dataType: "json", type: "POST", contentType: 'application/x-www-form-urlencoded; charset=utf-8', data: { id: $("#idPr").val(), cityid: $("#cityid").val(), stateid: $("#stateid").val(), follower: follower, __RequestVerificationToken: gettoken() }, async: !0, cache: !1, success: function (result) {
            $('.loadingmap').hide(); if (result.length > 0) {
                var maxlong = 20.1, minlong = 70.1, maxlat = 10.1, minlat = 50.1; for (var i = 0; i < (result.length / 4); i++) {
                    var iconFeature = new ol.Feature({ geometry: new ol.geom.Point(ol.proj.transform([parseFloat(result[i * 4]), parseFloat(result[i * 4 + 1])], 'EPSG:4326', 'EPSG:3857')), }); var iconStyle = new ol.style.Style({ image: new ol.style.Icon({ anchor: [0.5, 60], positioning: 'bottom-center', anchorXUnits: 'fraction', anchorYUnits: 'pixels', src: '~/content/Koshop/assets/img/location.png', color: "#AAA", crossOrigin: 'anonymous', }) }); iconFeature.setStyle(iconStyle); iconFeature.setId(result[i * 4 + 2]); vectorSource.addFeature(iconFeature); $("div").data((result[i * 4 + 2]), { contentdata: (result[i * 4 + 3]) }); if (parseFloat(result[i * 4]) > maxlong)
                        maxlong = parseFloat(result[i * 4]); if (parseFloat(result[i * 4]) < minlong)
                        minlong = parseFloat(result[i * 4]); if (parseFloat(result[i * 4 + 1]) > maxlat)
                        maxlat = parseFloat(result[i * 4 + 1]); if (parseFloat(result[i * 4 + 1]) < minlat)
                        minlat = parseFloat(result[i * 4 + 1])
                }
                var vectorLayer = new ol.layer.Vector({ source: vectorSource, updateWhileAnimating: !0, updateWhileInteracting: !0, }); map.addLayer(vectorLayer); gotomapcenter(maxlong, minlong, maxlat, minlat)
            }
        }, error: function (result) { alert("در حال حاضر در دسترس نمیباشد") },
    })
}
function followStor(id) {
    if ($("#authStatus").val() != "True") { $('#ModalLogin').modal('show') }
    else {
        var status = !1; if ($("#followclick_" + id).hasClass("an-btn-light")) { status = !0; changefollowicon(id, "an-btn-light") }
        else { changefollowicon(id, "an-btn-default") }
        $.ajax({
            url: "/ownshop/followRequest", dataType: "json", type: "POST", contentType: 'application/x-www-form-urlencoded; charset=utf-8', data: { storeid: id, status: status, __RequestVerificationToken: gettoken() }, async: !0, cache: !1, success: function (result) {
                if (result == !0) { }
                else if (result == !1) { followerror(id) }
            }, error: function () { followerror(id) }, beforeSend: function () { },
        })
    }
}
$(".back-slide").on("click", function () { $(".block-slide").fadeOut() }); $(".zoom-kala").on("click", function () { $("body").css("overflow", "hidden"); $(".block-slide").show() }); $(document).ready(function () { $(".picsscroll img").click(function (event) { $("#slidercontent").html(""); $("#slidercontent").prepend('<img class=" slidecontent-image" src="/Content/Upload/productImages/Images/' + $(this).attr('id').replace("preview_", "") + '.jpg" />'); $(".activemode").removeClass("activePic"); $("#preview_" + $(this).attr('id').replace("preview_", "")).addClass("activePic"); var $container = $('.all-galleries'), $scrollTo = $("#preview_" + $(this).attr('id').replace("preview_", "")); $container.animate({ scrollTop: $scrollTo.offset().top - $container.offset().top - ((innerHeight - 180) / 2) + $container.scrollTop() }, 400) }) })