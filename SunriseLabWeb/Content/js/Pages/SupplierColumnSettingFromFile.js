﻿var Column_Mas_Select = [];
var Column_Mas_ddl = "";
var SupplierColumn = [];
var SupplierColumn_ddl = "";
var filetype = "";
$(document).ready(function () {
    $('#file_upload').on('change', function (event) {
        const selectedFile = event.target.files[0];
        const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
        $(".SheetName").hide();
        filetype = fileExtension;
        if (!(fileExtension == "xlsx" || fileExtension == "xls" || fileExtension == "csv")) {
            $('#file_upload').val('');
            toastr.error("Allowed only .XLSX, .XLS, .CSV file format.");
        }
        else if (fileExtension == "xlsx" || fileExtension == "xls") {
            Get_SheetName_From_File();
        }
    });
    Master_Get();
});
function Get_SheetName_From_File() {
    debugger
    if ($("#DdlSupplierName").val() != "") {
        debugger
        const fileInput = $('#file_upload')[0];
        if (fileInput.files.length > 0) {
            loaderShow();
            debugger
            setTimeout(function () {
                debugger
                const formData = new FormData();
                formData.append('SupplierId', $("#DdlSupplierName").val());
                formData.append('File', fileInput.files[0]);

                debugger
                $.ajax({
                    type: "POST",
                    url: "/User/Get_SheetName_From_File",
                    contentType: false,
                    processData: false,
                    data: formData,
                    async: false,
                    success: function (data) {
                        loaderHide();
                        debugger
                        if (data.Status == "1" && data.Message == "SUCCESS" && data.Data.length > 0) {
                            debugger
                            $(".SheetName").show();
                            $("#DdlSheetName").html("<option value=''>Select</option>");
                            _(data.Data).each(function (obj, i) {
                                $("#DdlSheetName").append("<option value=\"" + obj.SheetName + "\">" + obj.SheetName + "</option>");
                            });
                        }
                        else {
                            debugger
                            toastr.error(data.Message);
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        loaderHide();
                        toastr.error(errorThrown);
                    }
                });

            }, 50);
        }
        else {
            toastr.error("Please Select File (.XLSX, .XLS, .CSV)");
        }
    }
    else {
        toastr.error("Please Select Supplier Name");
    }
}
function Master_Get() {
    loaderShow();
    $("#DdlSupplierName").html("<option value=''>Select</option>");
    var obj = {};
    obj.OrderBy = "SupplierName asc";
    $.ajax({
        url: "/User/Get_SupplierMaster",
        async: false,
        type: "POST",
        data: { req: obj },
        success: function (data, textStatus, jqXHR) {
            if (data.Message.indexOf('Something Went wrong') > -1) {
                MoveToErrorPage(0);
            }
            if (data != null && data.Data.length > 0) {
                for (var k in data.Data) {
                    $("#DdlSupplierName").append("<option value=" + data.Data[k].Id + ">" + data.Data[k].SupplierName + "</option>");
                }
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });

    $.ajax({
        url: "/User/Get_ColumnMaster",
        async: false,
        type: "POST",
        success: function (data, textStatus, jqXHR) {
            if (data.Status == "1" && data.Data != null) {
                Column_Mas_Select = data.Data;

                Column_Mas_ddl = "<option value=''>Select</option>";
                _(Column_Mas_Select).each(function (obj, i) {
                    Column_Mas_ddl += "<option value=\"" + obj.Col_Id + "\">" + obj.SupplierColumn + "</option>";
                });
            }
            loaderHide();
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });

}
function onchange_SupplierName() {
    $('#file_upload').val('');
    filetype = "";
    $(".SheetName").hide();
    $("#Save_btn").hide();
    $("#Delete_btn").hide();
    $("#TB_ColSetting").hide();
    $('#myTableBody').html("");

    //if ($("#DdlSupplierName").val() == "") {
    //    $("#Save_btn").hide();
    //    $("#Delete_btn").hide();
    //    $("#TB_ColSetting").hide();
    //    $('#myTableBody').html("");
    //}
}
function Get_SupplierColumnSetting_FromFile() {
    debugger
    $("#Save_btn").hide();
    $("#Delete_btn").hide();
    $("#TB_ColSetting").hide();
    $('#myTableBody').html("");

    if ($("#DdlSupplierName").val() != "") {
        debugger
        const fileInput = $('#file_upload')[0];
        if (fileInput.files.length > 0) {
            if (((filetype == "xlsx" || filetype == "xls") && $("#DdlSheetName").val() != "") || (filetype == "csv")) {
                loaderShow();
                debugger
                setTimeout(function () {
                    debugger
                    const formData = new FormData();
                    formData.append('SupplierId', $("#DdlSupplierName").val());
                    formData.append('SheetName', $("#DdlSheetName").val()+"$");
                    formData.append('File', fileInput.files[0]);

                    debugger
                    $.ajax({
                        type: "POST",
                        url: "/User/Get_Data_From_File",
                        contentType: false,
                        processData: false,
                        data: formData,
                        async: false,
                        success: function (data) {
                            loaderHide();
                            debugger
                            if (data.Status == "1" && data.Message == "SUCCESS" && data.Data.length > 0) {
                                debugger
                                SupplierColumn = data.Data;
                                SupplierColumn_ddl = "<option value=''>Select</option>";
                                _(SupplierColumn).each(function (obj, i) {
                                    SupplierColumn_ddl += "<option value=\"" + obj.SupplierColumn + "\">" + obj.SupplierColumn + "</option>";
                                });

                                var obj = {};
                                obj.SupplierId = $("#DdlSupplierName").val();
                                $.ajax({
                                    url: "/User/Get_SupplierColumnSetting_FromFile",
                                    async: false,
                                    type: "POST",
                                    data: { req: obj },
                                    success: function (data, textStatus, jqXHR) {
                                        debugger
                                        loaderHide();
                                        if (data.Status == "1" && data.Message == "SUCCESS" && data.Data.length > 0) {
                                            debugger
                                            $("#Save_btn").show();
                                            $("#TB_ColSetting").show();
                                            $('#myTableBody').html("");
                                            debugger
                                            var exists = false;
                                            _(data.Data).each(function (obj, i) {
                                                if (obj.SupplierColumn != null && exists == false) {
                                                    exists = true;
                                                }
                                                SupplierColumn_ddl = "<option value=''>Select</option>";
                                                _(SupplierColumn).each(function (__obj, i) {
                                                    SupplierColumn_ddl += "<option value=\"" + __obj.SupplierColumn + "\"" + (obj.SupplierColumn == __obj.SupplierColumn ? 'Selected' : '') + ">" + __obj.SupplierColumn + "</option>";
                                                });

                                                $('#myTableBody').append('<tr><td>' + (parseInt(i) + parseInt(1)) + '</td><td><input type="hidden" class="SunriseColumn" value="' + obj.Col_Id + '" />' + obj.Column_Name +
                                                    '</td><td><center><select style="margin-top: -9px;margin-bottom: -9px;" onchange="ddlOnChange(\'' + obj.Col_Id + '\');" id="ddl_' + obj.Col_Id + '" class="col-md-7 form-control select2 SupplierColumn">' + SupplierColumn_ddl +
                                                    '</select></center></td></tr>');
                                            });

                                            $(".Save_btn").html("<i class='fa fa-save' aria-hidden='true'></i>&nbsp;" + (exists == true ? "Update" : "Save"));
                                            if (exists == true) {
                                                $("#Delete_btn").show();
                                            }
                                            contentHeight();
                                        }
                                        //else if (data.Status == "1" && data.Message == "No records found.") {
                                        //    debugger
                                        //    $("#Save_btn").html("<i class='fa fa-save' aria-hidden='true'></i>&nbsp;Save");
                                        //    $("#Save_btn").show();
                                        //    $("#TB_ColSetting").show();
                                        //    $('#myTableBody').html("");

                                        //    debugger
                                        //    _(Column_Mas_Select).each(function (obj, i) {
                                        //        debugger
                                        //        $('#myTableBody').append('<tr><td>' + (parseInt(i) + parseInt(1)) + '</td><td><input type="hidden" class="SunriseColumn" value="' + obj.Col_Id + '" />' + obj.SupplierColumn +
                                        //            '</td><td><center><select onchange="ddlOnChange(\'' + obj.Col_Id + '\');" id="ddl_' + obj.Col_Id + '" class="col-md-6 form-control select2 SupplierColumn">' + SupplierColumn_ddl +
                                        //            '</select></center></td></tr>');
                                        //    });
                                        //    contentHeight();
                                        //}
                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        loaderHide();
                                    }
                                });
                            }
                            else {
                                debugger
                                toastr.error(data.Message);
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            loaderHide();
                        }
                    });

                }, 50);
            }
            else {
                toastr.error("Please Select Sheet Name");
            }
        }
        else {
            toastr.error("Please Select File (.XLSX, .XLS, .CSV)");
        }
    }
    else {
        toastr.error("Please Select Supplier Name");
    }
}
function ddlOnChange(id) {
    //if ($("#ddl_" + id).val() != "") {
    //    var DisOrder = 0;
    //    $("#mytable #myTableBody tr").each(function () {
    //        DisOrder = parseInt(DisOrder) + 1;
    //        if ($(this).find('.CustomColumn').val() != "") {
    //            if (DisOrder != parseInt(id) && $("#ddl_" + id).val() == $(this).find('.CustomColumn').val()) {
    //                toastr.error($("#ddl_" + id).children(":selected").text() + " Custom Column Name alredy selected.");
    //                $("#ddl_" + id).val("");
    //            }
    //        }
    //    });
    //}
}
function SaveData() {
    loaderShow();

    setTimeout(function () {
        debugger
        var List2 = [];
        $("#mytable #myTableBody tr").each(function () {
            List2.push({
                SupplierId: $("#DdlSupplierName").val(),
                SupplierColumn: $(this).find('.SupplierColumn').val(),
                ColumnId: $(this).find('.SunriseColumn').val()
            });
        });
        debugger
        var obj = {};
        obj.col = List2;
        $.ajax({
            url: "/User/AddUpdate_SupplierColumnSetting_FromFile",
            async: false,
            type: "POST",
            dataType: "json",
            data: JSON.stringify({ req: obj }),
            contentType: "application/json; charset=utf-8",
            success: function (data, textStatus, jqXHR) {
                debugger
                loaderHide();
                if (data.Status == "1") {
                    toastr.success(data.Message);
                    //Get_SupplierColumnSetting();
                    $(".Save_btn").html("<i class='fa fa-save' aria-hidden='true'></i>&nbsp;Update");
                    $("#Delete_btn").show();
                }
                else {
                    if (data.Message.indexOf('Something Went wrong') > -1) {
                        MoveToErrorPage(0);
                    }
                    toastr.error(data.Message);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                loaderHide();
            }
        });

    }, 20);
}
var ClearRemoveModel = function () {
    $("#DeleteModal").modal("hide");
}
var Delete = function () {
    $("#DeleteModal").modal("show");
    $("#DeleteModal .modal-body li").html("Are You Sure You Want To Delete Column Setting of " + $("#DdlSupplierName option:selected").text() + " Supplier ?");
}
function DeleteData() {
    if ($("#DdlSupplierName").val() != "") {
        var obj = {};
        obj.SupplierId = $("#DdlSupplierName").val();
        loaderShow();

        $.ajax({
            url: '/User/Delete_SupplierColumnSetting_FromFile',
            type: "POST",
            data: { req: obj },
            success: function (data) {
                loaderHide();
                if (data.Status == "1") {
                    toastr.success(data.Message);
                    $("#DeleteModal").modal("hide");
                    $("#Save_btn").hide();
                    $("#Delete_btn").hide();
                    $("#TB_ColSetting").hide();
                    $('#myTableBody').html("");
                }
                else {
                    if (data.Message.indexOf('Something Went wrong') > -1) {
                        MoveToErrorPage(0);
                    }
                    toastr.error(data.Message);
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                loaderHide();
            }
        });
    }
}
function contentHeight() {debugger
    var winH = $(window).height(),
        head = $(".order-history-data").height(),
        contentHei = winH - head - 280;
    $("#mytable").css("height", contentHei);
}
$(window).resize(function () {
    contentHeight();
});