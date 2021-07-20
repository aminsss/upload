var inspectpermission = false;
var size = true;
var format = false;
var imageShow = false;
var requestAdded = false;
var reservationDate = 0;

$(document).ready(function () {
    $('#smartwizard').smartWizard({
        selected: 0, // Initial selected step, 0 = first step
        theme: 'Dots', // theme for the wizard, related css need to include for other than default theme
        justified: true, // Nav menu justification. true/false
        transition: {
            animation: 'fade', // Effect on navigation, none/fade/slide-horizontal/slide-vertical/slide-swing
            speed: '400', // Transion animation speed
            easing: '' // Transition animation easing. Not supported without a jQuery easing plugin
        },
        lang: { // Language variables for button
            next: 'مرحله بعد',
            previous: 'بازگشت'
        },
        keyboardSettings: {
            keyNavigation: false, // Enable/Disable keyboard navigation(left and right keys are used if enabled)
        },
    });

    $("#smartwizard").on("showStep", function (e, anchorObject, stepIndex, stepDirection) {
        if (stepIndex == 4) {
            var enc_data = $("#data").val();
            $.ajax({
                type: "Get",
                url: "/cashdoc/GetInspectFishList",
                data: {
                    data: enc_data,
                },
                beforeSend: function () {
                    Loading(true, 'div-FishLists');
                },
                success: function (data) {
                    $("#div-FishLists").html(data);
                },
                complete: function (data) {
                    Loading(false, 'div-FishLists');
                },
                error: function (data) {
                    Loading(false, 'div-FishLists');
                    $('#div-FishLists').html(ShowAlert(ErrorInConnection, Const_alert_warning, '')).show(300);
                }
            });
        }
        if (stepIndex == 5) {
            DatePickerShow();
        }
    });
});


$("#smartwizard").on("leaveStep", function (e, anchorObject, currentStepIndex, nextStepIndex, stepDirection) {
    $("#ResultDiv1").hide(100);
    if (currentStepIndex == 0) {
        if (!($("#ChkBx_Commitments").is(":checked"))) {
            $("#ResultDiv1").html(ShowAlert(CommitmentAgreementAlert, Const_alert_danger, '')).show(300);
            e.preventDefault();
        }
    }
    if (currentStepIndex == 1 && nextStepIndex == 2) {
        if (($("#BuildingID").val() == "")) {
            $("#ResultDiv1").html(ShowAlert(AlertGetBuildingfirstly, Const_alert_danger, '')).show(300);
            e.preventDefault();
        }
        else {
            if (!imageShow) {
                e.preventDefault();
                imageShow = true;
                var RequestTypeID = $("#RequestTypeID").val();
                $.ajax({
                    type: "Get",
                    url: "/UrbanRequest/GetUploadList",
                    data: {
                        requestTypeId: RequestTypeID,
                    },
                    beforeSend: function () {
                        Loading(true, 'div-ImageUploadlist');
                    },
                    success: function (data) {
                        $("#div-ImageUploadlist").html(data);
                        $('#smartwizard').smartWizard("next");
                    },
                    complete: function (data) {
                        Loading(false, 'div-ImageUploadlist');
                    },
                    error: function (data) {
                        Loading(false, 'div-ImageUploadlist');
                        $('#div-ImageUploadlist').html(ShowAlert(ErrorInConnection, Const_alert_warning, '')).show(300);
                    }
                });
            }
        }
    }
    if (currentStepIndex == 2 && nextStepIndex == 1) {
        $("#ResultDiv3").hide(100);
    }

    if (currentStepIndex == 2 && nextStepIndex == 3) {
        var ImageUploaded = true;
        $('#step-3').find('input').each(function () {
            if ($(this).prop('required')) {
                if (!($(this)[0].files.length > 0)) {
                    ImageUploaded = false;
                }
            } 
        });
        if (!ImageUploaded) {
            e.preventDefault();
            $("#ResultDiv1").html(ShowAlert(AllRequiredImageShouldBeInsert, Const_alert_danger, '')).show(300);
        }
    }

    if (currentStepIndex == 3 && (nextStepIndex == 4 || nextStepIndex == 5)) {
        $("#ResultDiv1").html(ShowAlert(AlertForRequestRegistered, Const_alert_danger, '')).show(300);
        e.preventDefault();
    }
    if (currentStepIndex == 3 && (nextStepIndex == 2 || nextStepIndex == 1 || nextStepIndex == 0)) {
        if (requestAdded) {
            e.preventDefault();
        }
        else {
            $("#ResultDiv3").hide(100);
        }
    }
    if (currentStepIndex == 4 && (nextStepIndex == 3 || nextStepIndex == 2 || nextStepIndex == 1 || nextStepIndex == 0)) {
        e.preventDefault();
    }
    if (currentStepIndex == 4 && nextStepIndex == 5) {
        var enc_data = $("#data").val();
        if (inspectpermission == false) {
            e.preventDefault();
            $.ajax({
                type: "Get",
                url: "/UrbanRequest/CheckRequestCashDoc",
                data: {
                    data: enc_data,
                },
                beforeSend: function () {
                    Loading(true, 'div-FishLists');
                },
                success: function (data) {
                    Loading(false, 'div-FishLists');
                    if (data.State == true) {
                        inspectpermission = true;
                        $('#ResultDiv1').html(ShowAlert(data.Message, Const_alert_success, '')).show(300);
                        $('#smartwizard').smartWizard("next");
                    }
                    else {
                        $('#ResultDiv1').html(ShowAlert(data.ErrorMessage, Const_alert_danger, '')).show(300);
                    }
                },
                complete: function (data) {
                    Loading(false, 'div-FishLists');
                },
                error: function (data) {
                    Loading(false, 'btn_GetBuildingInfo');
                    $('#ResultDiv1').html(ShowAlert(ErrorInConnection, Const_alert_warning, '')).show(300);
                }
            });
        }
    }
    if (currentStepIndex == 5) {
        e.preventDefault();
    }
});

function GetBuildingInfo(EnterTheBuildingInfo, FillAllField, FillJustOneField) {
    $("#ResultDiv2").hide(100);
    var RequestTypeID = $("#RequestTypeID").val();
    var BuildingNumber = $("#BuildingNumber").val();
    var InstaurationBusiness = $("#InstaurationBusiness").val();
    var InstaurationApartment = $("#InstaurationApartment").val();
    var InstaurationBuilding = $("#InstaurationBuilding").val();
    var InstaurationLand = $("#InstaurationLand").val();
    var InstaurationBlock = $("#InstaurationBlock").val();
    var InstaurationZone = $("#InstaurationZone").val();
    var InstaurationArea = $("#InstaurationArea").val();
    //if no input filled
    if (BuildingNumber == "" && InstaurationBusiness == "" && InstaurationApartment == "" && InstaurationBuilding == "" && InstaurationLand == "" && InstaurationBlock == "" && InstaurationZone == "" && InstaurationArea == "")
        $("#ResultDiv2").html(ShowAlert(EnterTheBuildingInfo, Const_alert_danger, '')).show(300);
    //if systemic number Notfilled and One Of InstaurationCode input enterd 
    else if (BuildingNumber == "" && (InstaurationBusiness == "" || InstaurationApartment == "" || InstaurationBuilding == "" || InstaurationLand == "" || InstaurationBlock == "" || InstaurationZone == "" || InstaurationArea == ""))
        $("#ResultDiv2").html(ShowAlert(FillAllField, Const_alert_danger, '')).show(300);
    //if Systemic Number Filled and atleast One of InstaurationCode input also filled
    else if (BuildingNumber != "" && (InstaurationBusiness != "" || InstaurationApartment != "" || InstaurationBuilding != "" || InstaurationLand != "" || InstaurationBlock != "" || InstaurationZone != "" || InstaurationArea != ""))
        $("#ResultDiv2").html(ShowAlert(FillJustOneField, Const_alert_danger, '')).show(300);
    else {
        $.ajax({
            type: "Post",
            url: "/UrbanRequest/GetAllBuildingInfo",
            data: {
                InstaurationBusiness: InstaurationBusiness,
                InstaurationApartment: InstaurationApartment,
                InstaurationBuilding: InstaurationBuilding,
                InstaurationLand: InstaurationLand,
                InstaurationBlock: InstaurationBlock,
                InstaurationZone: InstaurationZone,
                InstaurationArea: InstaurationArea,
                BuildingNumber: BuildingNumber,
                TBASRequestTypeID: RequestTypeID,
            },
            beforeSend: function () {
                Loading(true, 'btn_GetBuildingInfo');
            },
            success: function (data) {
                $("#ResultDiv2").html("").hide(100);
                if (data.state != 0) {
                    $("#BuildingID").val("")
                    $("#ResultDiv2").html(ShowAlert(data.Message, Const_alert_danger, '')).show(300);
                }
                else {
                    $("#ResultDiv1").html("").hide(100);
                    $("#ResultDiv2").html(ShowAlert(data.Message, Const_alert_success, '')).show(300);
                    FillSearch(data);
                }
                if (data.GisId != "" && data.GisId != null) {
                    SelectByGisID(data.GisId);
                }
            },
            complete: function (data) {
                Loading(false, 'btn_GetBuildingInfo');
            },
            error: function (data) {
                Loading(false, 'btn_GetBuildingInfo');
                $('#ResultDiv1').html(ShowAlert(ErrorInConnection, Const_alert_warning, '')).show(300);
            }
        });
    }
}

function selectedFeatureGis(data) {
    $("#ResultDiv1").hide(100);
    data["TBASRequestTypeID"] = $("#RequestTypeID").val();
    $.ajax({
        type: "Post",
        url: "/UrbanRequest/GetAllBuildingInfoGIS",
        data: data,
        beforeSend: function () {
            Loading(true, 'btn_GetBuildingInfo');
        },
        success: function (data) {
            $("#ResultDiv2").html("").hide(100);
            if (data.state != 0) {
                $("#BuildingID").val("")
                $("#ResultDiv2").html(ShowAlert(data.Message, Const_alert_danger, '')).show(300);
            }
            else {
                $("#ResultDiv1").html("").hide(100);
                $("#ResultDiv2").html(ShowAlert(data.Message, Const_alert_success, '')).show(300);
                FillSearch(data);
            }
        },
        complete: function (data) {
            Loading(false, 'btn_GetBuildingInfo');
        },
        error: function (data) {
            Loading(false, 'btn_GetBuildingInfo');
            $('#ResultDiv1').html(ShowAlert(ErrorInConnection, Const_alert_warning, '')).show(300);
        }
    });
}

function beforeSelecteFeatureGis(isRightClick) {
    if (!isRightClick) {
        clearSearch();
    }
}
function FillSearch(data) {
    $("#BuildingID").val(data.BuildingID);
    //$("#BuildingNumber").val(data.BuildingNumber);
    if (data.InstaurationCode != undefined && data.InstaurationCode != null) {
        var InsSplit = data.InstaurationCode.split('-');
        $("#InstaurationBusiness").val(InsSplit[6]).parent().addClass("is-filled");
        $("#InstaurationApartment").val(InsSplit[5]).parent().addClass("is-filled");
        $("#InstaurationBuilding").val(InsSplit[4]).parent().addClass("is-filled");
        $("#InstaurationLand").val(InsSplit[3]).parent().addClass("is-filled");
        $("#InstaurationBlock").val(InsSplit[2]).parent().addClass("is-filled");
        $("#InstaurationZone").val(InsSplit[1]).parent().addClass("is-filled");
        $("#InstaurationArea").val(InsSplit[0]).parent().addClass("is-filled");
    }
}
function clearSearch() {
    $("#ResultDiv2").hide(100);
    $("#BuildingID").val("");
    $("#BuildingNumber").val("");
    $("#InstaurationBusiness").val("").parent().removeClass("is-filled");
    $("#InstaurationApartment").val("").parent().removeClass("is-filled");
    $("#InstaurationBuilding").val("").parent().removeClass("is-filled");
    $("#InstaurationLand").val("").parent().removeClass("is-filled");
    $("#InstaurationBlock").val("").parent().removeClass("is-filled");
    $("#InstaurationZone").val("").parent().removeClass("is-filled");
    $("#InstaurationArea").val("").parent().removeClass("is-filled");
}

function OfferInspect(FirstlyChooseOneDate, DateOverLimit) {
    $("#ResultDiv1").hide(100);
    var enc_data = $("#data").val();
    var dateIn = new persianDate(reservationDate).toArray();
    var date = new persianDate([dateIn[0], dateIn[1], dateIn[2]]);
    date.formatPersian = false;
    date = date.format().split(' ')[0].replace(/-/g, '/');
    if (reservationDate == 0)
        $('#ResultDiv1').html(ShowAlert(FirstlyChooseOneDate, Const_alert_warning, '')).show(300);
    else {
        $.ajax({
            type: "POST",
            traditional: true,
            url: "/Inspection/AddOfferDays",
            data: {
                data: enc_data,
                persianDate: date,
            },
            beforeSend: function () {
                Loading(true, 'btn_OfferInspect');
            },
            success: function (data) {
                Loading(false, 'btn_OfferInspect');
                $("#ResultDiv1").html("").hide(100);
                if (data.State == true) {
                    $('#div-InspectView').hide();
                    $('.btn_ViewMain').css("display", "block");
                    $('#ResultDiv1').html(ShowAlert(data.Result, Const_alert_success, '')).show(300);
                }
                else {
                    $('#ResultDiv1').html(ShowAlert(data.ErrorMessage, Const_alert_danger, '')).show(300);
                }
            },
            complete: function (data) {
                Loading(false, 'btn_OfferInspect');
            },
            error: function (data) {
                if (data.status == "401") {
                    window.location.href = "/Authentication/LogIn?returnUrl=" + window.location.pathname;
                }
                Loading(false, 'btnRequestTracking');
                $('#ResultDiv1').html(ShowAlert(ErrorInConnection, Const_alert_warning, '')).show(300);
            }
        });
    }
}

function RequestTracking() {
    $('#ResultContent_tracking').hide(100);
    var data = {
        number: $("#txtRequestNumber").val()
    };
    $.ajax({
        type: "POST",
        url: "/UrbanRequest/checkTracking",
        data: data,
        beforeSend: function () {
            Loading(true, 'btnRequestTracking');
        },
        success: function (data) {
            Loading(false, 'btnRequestTracking');
            if (data.State == true) {
                $('#ResultContent_tracking').html(ShowAlert(data.Message, Const_alert_success, '')).show(300);
            }
            else {
                $('#ResultContent_tracking').html(ShowAlert(data.ErrorMessage, Const_alert_danger, '')).show(300);
            }
            if (data.Button != "") {
                $('#ResultContent_tracking').append(data.Button);
            }
        },
        complete: function (data) {
            Loading(false, 'btnRequestTracking');
        },
        error: function (data) {
            Loading(false, 'btnRequestTracking');
            if (data.status == "401") {
                window.location.href = "/Authentication/LogIn?returnUrl=" + window.location.pathname;
            }
            else {
                $('#ResultContent_tracking').html(ShowAlert(ErrorInConnection, Const_alert_warning, '')).show(300);
            }
        }
    });
}

 function AddRequest() {
    var BuildingID = $("#BuildingID").val()
    var RequestTypeID = $("#RequestTypeID").val();
    var RequestDescription = $("textarea#RequestDescription").val();
    //vakil is Default
    //var TBASApplicantTypeID = "2";
    //if ($('#ChkBx_Owner').is(":checked")) {
    //    TBASApplicantTypeID = "1";
    //}
    var fi = document.getElementsByName("Images");
    var re = /(?:\.([^.]+))?$/;

    var formData = new FormData();
    formData.append('TINFBuildingID', BuildingID);
    formData.append('TBASRequestTypeID', RequestTypeID);
    formData.append('TBASApplicantTypeID', "1");
    formData.append('RequestDescription', RequestDescription);
     
    for (var i = 0; i < fi.length; i++) {
        if (fi[i].files.length > 0) {
            var files = fi[i].files[0];
            var newFilename = fi[i].id +'.'+ re.exec(files.name)[1];
            formData.append('files', files, newFilename);
        }
    }
    
    $.ajax({
        type: "Post",
        contentType: false,
        processData: false,
        url: "/UrbanRequest/AddRequest",
        data: formData,
       
        beforeSend: function () {
            Loading(true, 'btn_request');
        },
        success: function (data) {
            $("#ResultDiv3").html("").hide(100);
            if (data.state != 0) {
                $('#ResultDiv3').html(ShowAlert(data.Message, Const_alert_danger, '')).show(300);
            }
            else {
                requestAdded = true;
                $("#ResultDiv1").hide(100);
                $("#ResultDiv2").html("").hide(100);
                $('#ResultDiv3').html(ShowAlert(data.Message, Const_alert_success, '')).show(300);
                $("#div-Addrequest").hide();
                AddInspectCashDoc(data.RequestId, BuildingID, RequestTypeID);
            }
        },
        complete: function (data) {
            Loading(false, 'btn_request');
        },
        error: function (data) {
            if (data.status == "401") {
                window.location.href = "/Authentication/LogIn?returnUrl=" + window.location.pathname;
            }
            else {
                $('#ResultDiv1').html(ShowAlert(ErrorInConnection, Const_alert_warning, '')).show(300);
            }
        }
    });
}

function AddInspectCashDoc(requestId, buildingID, requestTypeID) {
    var formData = new FormData();
    formData.append('requestId', requestId);
    formData.append('buildingId', buildingID);
    formData.append('tbasRequestType', requestTypeID);

    $.ajax({
        type: "Post",
        contentType: false,
        processData: false,
        url: "/CashDoc/AddInspectionCashdoc",
        data: formData,

        beforeSend: function () {
            Loading(true, 'step-4');
        },
        success: function (data) {
            if (data.StateId == 0) {
                var url = updateQueryStringParameter("/UrbanRequest/Create/" + data.TbasRequestType, "data", data.Enc_Data, "#step-5");
                window.location.href = url;
            }
            else {
                $('.btn_ViewMain').css("display", "block");
                $("#ResultDiv3").html("").hide(100);
                $('#ResultDiv3').html(ShowAlert(data.Message, Const_alert_success, '')).show(300);
            }
        },
        complete: function (data) {
            Loading(false, 'step-4');
        },
        error: function (data) {
            if (data.status == "401") {
                window.location.href = "/Authentication/LogIn?returnUrl=" + window.location.pathname;
            }
            else {
                $('#ResultDiv1').html(ShowAlert(ErrorInConnection, Const_alert_warning, '')).show(300);
            }
        }
    });
}


function SelectImageUpload(input, id, ImageSizeIsLarge, ImageFormatNotCorrect) {
    $('#ResultDiv1').html("").show(100);
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $("#" + id).attr('src', e.target.result)
            getImageDimensions(e.target.result, function (data) {
                var img = data;
                if (img.height > 500 || img.width > 500) {
                    $('#ResultDiv1').html(ShowAlert(ImageSizeIsLarge, Const_alert_danger, '')).show(300);
                    $("#" + id).attr('src', '/Content/Images/DefaultDoc.jpg');
                    input.value = "";
                    input.value = null;
                }
            });
        };
        format = isImage(input.files[0].name);
        if (format != true) {
            $('#ResultDiv1').html(ShowAlert(ImageFormatNotCorrect, Const_alert_danger, '')).show(300);
        }
        else {
            reader.readAsDataURL(input.files[0]);
        }
    }

    //select the image
    const img = document.querySelector('#' + id);
    img.addEventListener('load', function (event) {
        const dataUrl = getDataUrl(event.currentTarget);
        //console.log(dataUrl);
    });
}

function getDataUrl(img) {
    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    // Set width and height
    canvas.width = img.width;
    canvas.height = img.height;
    // Draw the image
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL('image/jpeg');
}

function getImageDimensions(path, callback) {
    var img = new Image();
    img.src = path;
    img.onload = function () {
        callback({
            width: img.width,
            height: img.height
        });
    }
    img.src = path;
}

function isImage(filename) {
    var ext = getExtension(filename);
    switch (ext.toLowerCase()) {
        case 'jpg': 
        case 'png':
            return true;
    }
    return false;
}

function getExtension(filename) {
    var parts = filename.split('.');
    return parts[parts.length - 1];
}

function DatePickerShow() {
    var enc_data = $("#data").val();
    $.ajax({
        type: "Get",
        url: "/Inspection/GetInspectDays",
        data: {
            data: enc_data,
        },
        beforeSend: function () {
            Loading(true, 'div-InspectView');
        },
        success: function (data) {
            Loading(false, 'div-InspectView');
            $('#div-InspectView').html(data);
            $('.inline-DatePicker').persianDatepicker({

                inline: true,
                altField: '#inlineDatePickerAlt',
                altFormat: 'YYYY/MM/DD',
                formatter: function (unix) {
                    reservationDate = unix;
                },
                toolbox: {
                    calendarSwitch: {
                        enabled: true
                    }
                },
                navigator: {
                    scroll: {
                        enabled: false
                    }
                },
                format: "X",
                //formatPersian = false,
                minDate: new persianDate().add('day', 1).valueOf(),
                maxDate: new persianDate().add('day', GetDaysAllowedCount()).valueOf(),
                timePicker: {
                    enabled: false,
                    meridiem: {
                        enabled: true
                    }
                },
                checkDate: function (unix) {
                    return CheckDateList(unix);
                },
                onlyTimePicker: false,
                onlySelectOnDate: false,
                calendarType: "persian",
                inputDelay: 800,
                observer: true,
                calendar: {
                    "persian": {
                        "locale": "fa",
                        "showHint": false,
                        "leapYearMode": "algorithmic"
                    },
                    "gregorian": {
                        "locale": "en",
                        "showHint": false
                    }
                },
                navigator: {
                    "enabled": true,
                    "scroll": {
                        "enabled": true
                    },
                    "text": {
                        "btnNextText": ">",
                        "btnPrevText": "<"
                    }
                },
                toolbox: {
                    "enabled": true,
                    "calendarSwitch": {
                        "enabled": false,
                        "format": "MMMM"
                    },
                    "todayButton": {
                        "enabled": true,
                        "text": {
                            "fa": "امروز",
                            "en": "Today"
                        }
                    },
                    "submitButton": {
                        "enabled": true,
                        "text": {
                            "fa": "تایید",
                            "en": "Submit"
                        }
                    },
                    "text": {
                        "btnToday": "امروز"
                    }
                },
                timePicker: {
                    "enabled": false,
                    "step": 1,
                    "hour": {
                        "enabled": false,
                        "step": null
                    },
                    "minute": {
                        "enabled": false,
                        "step": null
                    },
                    "second": {
                        "enabled": false,
                        "step": null
                    },
                    "meridian": {
                        "enabled": false
                    }
                },
                dayPicker: {
                    "enabled": true,
                    "titleFormat": "YYYY MMMM"
                },
                monthPicker: {
                    "enabled": true,
                    "titleFormat": "YYYY"
                },
                yearPicker: {
                    "enabled": true,
                    "titleFormat": "YYYY"
                },
                responsive: true
            });
            reservationDate = 0;
        },
        error: function (data) {
            Loading(false, 'div-InspectView');
            $('#div-InspectView').html(ShowAlert(ErrorInConnection, Const_alert_warning, '')).show(300);
        }
    });
}