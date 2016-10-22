// JavaScript Document
window.eventType = (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera(window.mobile) Mini|IEMobile/i)) ? "touchend" : "click";
var dataGrid = function(table_id, gridDataIn) {
    var lObj = this;
    gridDataIn = gridDataIn || [];
    lObj.setting = {
        tableContent: jQuery("#" + table_id),
        showItemCount: 10,
        gridDataOrignal: gridDataIn,
        gridData: [],
        totalItemCount: gridDataIn.length,
        pageCounter: 1,
        startPoint: 0,
        endPoint: 10,
        showEntryList: [10, 25, 50, 100],
        order: [1, "asc"],
        configColumns: [],
        maxViewCloumn: 5,
        currentViewCol: 0,
        confirmDelete: true,
        dataSelected: [],
        formConfig: {},
        mode: "",
        prevSearchText: '',
        currentSearchText: '',
        tableEventType: window.eventType || "click",
        toolbar: {
            "add": true,
            "delete": true,
            "edit": true,
            "showcolumn": true,
            "bulkupload": false,
            "download": false
        }
    };

    lObj.gridTemplate = '<div class="dataGridContainer {GRID CLASS}">\
                <div class="dataGridHeader clearfix">\
                    <div class="dataGridSelectFilter">\
                        <select class="entrycount"></select>\
                        <span class="selectCountWrapper"><span class="selectedCount"> (<span></span> Selected)</span></span>\
                    </div>\
                    <div class="optinContainer ">\
                        <div class="dataGridToolbar"></div>\
                        <div class="dataGridSearchFilter dataGridOption gridOptionActiveBg searchContainer">\
                            <span class="searchfield"><input type="text" class="act_gridFilter" placeholder="search" data-search="searchContent"></span><span class="selectfield"><select class="filterSelect"></select></span>\
                        </div>\
                    </div>\
                    <div class="selectCountWrapper"><span class="selectedCount"> (<span></span> Selected)</span></div>\
                </div>\
                <div class="addRow clearfix"></div>\
                <div class="uploadRow clearfix"></div>\
                <div class="dataGridContentHeader"></div>\
                <div class="dataGridContentBody"></div>\
                <div class="dataGridContentFooter"></div>\
                <div class="dataGridFooter"></div>\
            </div>';

    lObj.randomString = function() {
        return new Date().valueOf();
    };
    lObj.setting.randomClass = lObj.randomString();
    lObj.setting.gridClass = ".dataGridContainer_" + lObj.setting.randomClass;

    lObj.makeResponsive = function() {
        jQuery("body").on(lObj.setting.tableEventType, lObj.setting.gridClass + " .dataGridContentBody>ul>li>ul>li:nth-child(1)", function(eve) {
            if (jQuery(this).css('display') != "table-cell") {
                var status = jQuery(this).parent().attr("data-status");
                if (status == "close") {
                    jQuery(this).parent().parent().parent().children("li").each(function() {
                        var liCounter = 0;
                        jQuery(this).children(".expanded").each(function() {
                            jQuery(this).attr("data-status", "close");
                            jQuery(this).removeClass("expanded");
                        });
                    });
                    jQuery(this).parent().attr("data-status", "open");
                    jQuery(this).parent().addClass("expanded");
                } else if (status == "open") {
                    jQuery(this).parent().attr("data-status", "close");
                    jQuery(this).parent().removeClass("expanded");
                }
            }
        });
    }

    lObj.searchGrid = function(searchVal) {
        lObj.setting.gridData = [];
        lObj.d = [];
        lObj.filterVal = jQuery(lObj.setting.gridClass + " .filterSelect").val();
        var searchContent = searchVal.attr("data-search");
        var searchText = searchVal.val().toLowerCase();

        jQuery.each(lObj.setting.formatedData.d, function(i, item) {
            item = lObj.setting.formatedData.o[item];
            if (lObj.filterVal == "All") {
                lObj.d = JSON.stringify(item).toLowerCase();
            } else {
                lObj.d = String(item[lObj.filterVal]).toLowerCase();
            }
            if (lObj.d.indexOf(searchText) > -1) {
                lObj.setting.gridData.push(item);
            }
        });
    }

    lObj.prepareGridOption = function() {
        if (!lObj.setting.toolbar.showcolumn) {
            return;
        }

        var $dataGridOption = jQuery("<div>", {
            "class": "dataGridOption dataGridTableIcon"
        });
        var $dataGridOptionBtn = jQuery("<div>", {
            "class": "dataGridOptionBtn",
            "data-mode": "off"
        }).append('<span class="fa fa-table"></span>');
        var $gridOptionContent = jQuery("<div>", {
            "class": "gridOptionContent hide"
        });
        var $gridOptionLabel = jQuery("<div>").append("<label>Show Cloumns</label>");
        $gridOptionContent.append($gridOptionLabel);
        for (var i = 1; i < lObj.setting.configColumns.length; i++) {
            $gridOptionDiv = jQuery("<div>");
            $gridOptionLabel = jQuery("<label>");
            $gridOptionInput = jQuery("<input>", {
                "type": "checkbox",
                "value": (i + 1)
            }).prop("checked", lObj.setting.configColumns[i]['visible']);
            $gridOptionLabel.append($gridOptionInput);
            $gridOptionLabel.append(" " + lObj.setting.configColumns[i].label);
            $gridOptionDiv.append($gridOptionLabel);
            $gridOptionContent.append($gridOptionDiv);
        }
        var $gridOptionError = jQuery("<div>", {
            "class": "gridOptionError"
        });
        $gridOptionContent.append($gridOptionError);
        $dataGridOption.append($dataGridOptionBtn);
        $dataGridOption.append($gridOptionContent);
        jQuery(lObj.setting.gridClass + " .dataGridToolbar").append($dataGridOption);
    }

    lObj.prepareSelectOptions = function() {
        var $select = jQuery("<select>", {
            "class": "filterSelect"
        }).append("<option vlaue='all'>All</option>");
        for (var i = 0; i < lObj.setting.configColumns.length; i++) {
            var $option = jQuery("<option>", {
                "value": lObj.setting.configColumns[i].mData
            }).text(lObj.setting.configColumns[i].label);
            if (lObj.setting.configColumns[i]["visible"] == true) {
                $select.append($option);
            }
            jQuery(".selectfield").empty().append($select);
        }
    }

    lObj.prepareFilter = function() {
        var $EntrySelectList = jQuery(lObj.setting.gridClass + ' .entrycount');
        for (var x = 0; x < lObj.setting.showEntryList.length; x++) {
            $EntrySelectList.append(jQuery("<option>", {
                "value": lObj.setting.showEntryList[x]
            }).text(lObj.setting.showEntryList[x]));
        }

        var $optionContainer = jQuery(lObj.setting.gridClass + ' .dataGridToolbar');
        var $toolIcons = "";
        if (datagrid.setting.toolbar.add) {
            $toolIcons += '<div class="dataGridOption dataGridAddIcon" ><span class="fa fa-plus"></span></div>';
        }
        if (datagrid.setting.toolbar.edit) {
            $toolIcons += '<div class="dataGridOption dataGridEditIcon" style="display:none" ><span class="fa fa-pencil"></span></div>';
        }
        if (datagrid.setting.toolbar.delete) {
            $toolIcons += '<div class="dataGridOption dataGridDeleteIcon" style="display:none" data-toggle="modal" data-target="#myModal"><span class="fa fa-trash-o"></span></div>';
        }
        if (datagrid.setting.toolbar.bulkupload) {
            $toolIcons += '<div class="dataGridOption dataGridBulkUploadIcon"><span class="fa fa-upload"></span></div>';
        }
        if (datagrid.setting.toolbar.download) {
            $toolIcons += '<div class="dataGridOption dataGridDownloadIcon"><span class="fa fa-download"></span></div>';
        }
        $toolIcons += '<div class="dataGridOption dataGridSearchIcon"><span class="fa fa-search"></span></div>';
        var $select = jQuery(lObj.setting.gridClass + ' .filterSelect').append("<option vlaue='all'>All</option>");
        for (var i = 0; i < lObj.setting.configColumns.length; i++) {
            var $option = jQuery("<option>", {
                "value": lObj.setting.configColumns[i].mData
            }).text(lObj.setting.configColumns[i].label);

            if (lObj.setting.configColumns[i]["visible"] == true) {
                $select.append($option);
            }
        }
        $optionContainer.append($toolIcons);
    }

    lObj.prepareGridHeader = function() {
        var $dataGridContentHeader = jQuery(lObj.setting.gridClass + " .dataGridContentHeader");
        var $levelOneUL = jQuery("<ul>");
        for (var i = 0; i < lObj.setting.configColumns.length; i++) {

            $levelLI = jQuery("<li>").attr("data-colnum", (i + 1));
            if (i == 0 && (lObj.setting.toolbar.edit || lObj.setting.toolbar.delete)) {
                $levelLI.append('<div class="selectAll"><span class="fa fa-circle"></span><span class="fa fa-check-circle"></span></div>');
            }
            $levelLI.append("<div class='gridThContent'>" + lObj.setting.configColumns[i].label + "</div><span><span class='fa fa-caret-up'></span><span class='fa fa-caret-down'></span><span class='fa fa-sort'></span></span>");
            if (lObj.setting.configColumns[i]["visible"] == false) {
                $levelLI.addClass("hide");
            } else {
                lObj.setting.currentViewCol++
            }
            $levelOneUL.append($levelLI);
        }
        $dataGridContentHeader.append($levelOneUL);
    }

    lObj.changeCounter = function() {
        var listCount = Math.ceil(lObj.setting.totalItemCount / lObj.setting.showItemCount);
        if (listCount < lObj.setting.pageCounter) {
            lObj.setting.pageCounter = listCount;
        } else if (lObj.setting.pageCounter <= 0) {
            lObj.setting.pageCounter = 1;
        }
        lObj.setting.startPoint = (lObj.setting.pageCounter * lObj.setting.showItemCount) - lObj.setting.showItemCount;
        lObj.setting.endPoint = lObj.setting.startPoint + lObj.setting.showItemCount;
        if (lObj.setting.startPoint < 0 || lObj.setting.endPoint < 0) {
            lObj.setting.startPoint = 0;
            lObj.setting.endPoint = 0;
        }
    }

    lObj.createDataRow = function() {
        if (lObj.setting.endPoint > lObj.setting.totalItemCount) {
            var endpnt = lObj.setting.totalItemCount;
        } else {
            var endpnt = lObj.setting.endPoint;
        }

        var tablecontent = "";
        var tablerow = ""
        if (lObj.setting.gridData.length == 0) {
            tablecontent = '<ul class="searchContent"><li><ul><li class="nodatafound"><span class="fa fa-meh-o"></span> no data found</li></ul></li></ul>';
        } else {
            tablecontent = '<ul class="searchContent">%TABLECONTENT%</ul>';
            for (var i = lObj.setting.startPoint; i < endpnt; i++) {
                var data = lObj.setting.gridData[i];
                var dataclass = '';
                if (lObj.setting.dataSelected.indexOf("" + data['id']) != -1) {
                    dataclass = "class='selected'";
                }
                tablerow += '<li>\
                                <ul data-id="' + data.id + '" data-status="close" ' + dataclass + '>\
                                    %DATALI%\
                                </ul>\
                                <div class="editRow clearfix"></div>\
                                <div class="viewRow clearfix"></div>\
                            </li>';
                var flag = 1;
                var tablecell = "";
                jQuery.each(lObj.setting.configColumns, function(i1, item1) {
                    var hideclass = "";
                    if (item1.visible == false) {
                        hideclass = "class = 'hide'";
                    }
                    if (data[item1.mData] == "") {
                        data[item1.mData] = "-";
                    }
                    if (flag == 1) {
                        tablecell += '<li>';
                        if (lObj.setting.toolbar.edit || lObj.setting.toolbar.delete) {
                            tablecell += '<div class="selectRow"><span class="fa fa-circle"></span><span class="fa fa-check-circle"></span></div>';
                        }
                        tablecell += '<div class="gridTableCell">' + data[item1.mData] + '<span class="moreIcon"><span class="fa fa-angle-down"></span><span class="fa fa-angle-up"></span></span></div>\
                                    </li>';
                    } else {
                        tablecell += '<li ' + hideclass + '><span>' + item1.label + ' -</span> <span>' + data[item1.mData] + '</span></li>';
                    }

                    flag++;
                });
                tablerow = tablerow.replace('%DATALI%', tablecell);
            }
            tablecontent = tablecontent.replace('%TABLECONTENT%', tablerow);
        }
        lObj.setting.dataGridContentBody.html(tablecontent);
        if (lObj.setting.mode == "edit") {
            var form = lObj.renderForm();
            jQuery(lObj.setting.gridClass + " .selected").parent().children(".editRow").append(form).show();
            lObj.fillFormData(lObj.setting.dataSelected[0]);
        }
    }
    lObj.prepareGridBody = function() {
        var $dataGridContentBody = jQuery(lObj.setting.gridClass + " .dataGridContentBody");
        lObj.setting.dataGridContentBody = $dataGridContentBody;
        lObj.createDataRow();
    }

    lObj.prepareGridFooter = function() {
        var $dataGridContentHeader = jQuery(lObj.setting.gridClass + " .dataGridContentFooter");
        var $levelOneUL = jQuery("<ul>");
        for (var i = 0; i < lObj.setting.configColumns.length; i++) {
            $levelLI = jQuery("<li>");
            if (i == 0 && (lObj.setting.toolbar.edit || lObj.setting.toolbar.delete)) {
                $levelLI.append('<div class="selectAll"><span class="fa fa-circle"></span><span class="fa fa-check-circle"></span></div>');
            }
            $levelLI.append("<div class='gridTfContent'>" + lObj.setting.configColumns[i].label + "</div>");
            if (lObj.setting.configColumns[i]["visible"] == false) {
                $levelLI.addClass("hide");
            }
            $levelOneUL.append($levelLI);
        }
        $dataGridContentHeader.append($levelOneUL);
    }

    lObj.rearrangePagination = function(clickedLiNumber) {
        var listCount = Math.ceil(lObj.setting.totalItemCount / lObj.setting.showItemCount);
        var clickedLI = parseInt(clickedLiNumber);
        var $paginationListUL = jQuery("<ul>", {
            "class": "paginationContainer"
        });
        if (clickedLI < 5) {
            for (var i = 1; i <= listCount; i++) {
                if (i == clickedLI) {
                    var $paginationListLI = jQuery("<li>", {
                        "data-page": i
                    }).text(i);
                } else if (i >= 1 && i < 6) {
                    var $paginationListLI = jQuery("<li>", {
                        "data-page": i
                    }).text(i);
                } else if (i == 6) {
                    var $paginationListLI = jQuery("<span>", {
                        "data-page": i
                    }).text("...");
                } else if (i == listCount) {
                    var $paginationListLI = jQuery("<li>", {
                        "data-page": i
                    }).text(i);
                }
                $paginationListUL.append($paginationListLI);
            }
        } else if (clickedLI > listCount - 4) {
            for (var i = 1; i <= listCount; i++) {
                if (i == clickedLI) {
                    var $paginationListLI = jQuery("<li>", {
                        "data-page": i
                    }).text(i);
                } else if (i == (listCount - 4) || i == (listCount - 3) || i == (listCount - 2) || i == (listCount - 1) || i == listCount) {
                    var $paginationListLI = jQuery("<li>", {
                        "data-page": i
                    }).text(i);
                } else if (i == (listCount - 5)) {
                    var $paginationListLI = jQuery("<span>", {
                        "data-page": i
                    }).text("...");
                } else if (i == 1) {
                    var $paginationListLI = jQuery("<li>", {
                        "data-page": i
                    }).text(i);
                }
                $paginationListUL.append($paginationListLI);
            }
        } else {
            for (var i = 1; i <= listCount; i++) {
                if (i == clickedLI) {
                    var $paginationListLI = jQuery("<li>", {
                        "data-page": i
                    }).text(i);
                } else if (i == 1) {
                    var $paginationListLI = jQuery("<li>", {
                        "data-page": i
                    }).text(i);
                } else if (i == (clickedLI - 2) || i == (clickedLI + 2)) {
                    var $paginationListLI = jQuery("<span>", {
                        "data-page": i
                    }).text("...");
                } else if (i == (clickedLI - 1) || i == (clickedLI + 1)) {
                    var $paginationListLI = jQuery("<li>", {
                        "data-page": i
                    }).text(i);
                } else if (i == listCount) {
                    var $paginationListLI = jQuery("<li>", {
                        "data-page": i
                    }).text(i);
                }
                $paginationListUL.append($paginationListLI);
            }
        }
        if (clickedLI == 1) {
            jQuery(".paginationPrev").attr("data-switch", "off");
            jQuery(".paginationNext").attr("data-switch", "on");
        } else if (clickedLI == listCount) {
            jQuery(".paginationPrev").attr("data-switch", "on");
            jQuery(".paginationNext").attr("data-switch", "off");
        } else {
            jQuery(".paginationPrev, .paginationNext").attr("data-switch", "on");
        }
        $paginationListUL.children("li").each(function(eve) {
            var pageNum = jQuery(this).attr("data-page");
            if (pageNum == clickedLiNumber) {
                jQuery(this).addClass("active");
            }
        });
        lObj.setting.paginationList.html($paginationListUL);
    }

    lObj.createPagination = function() {
        var $paginationParnetUL = jQuery("<ul>", {
            "class": "paginationWrapper"
        });
        var $paginationPrevLI = jQuery("<li>", {
            "class": "paginationPrev switchOff",
            "data-action": "prev",
            "data-switch": "off"
        }).html('<span class="fa fa-angle-double-left"></span>');
        var $paginationNextLI = jQuery("<li>", {
            "class": "paginationNext",
            "data-action": "next",
            "data-switch": "on"
        }).html('<span class="fa fa-angle-double-right"></span>');
        lObj.setting.paginationList = jQuery("<li>");
        $paginationParnetUL.append($paginationPrevLI);
        $paginationParnetUL.append(lObj.setting.paginationList);
        $paginationParnetUL.append($paginationNextLI);
        lObj.setting.paginationWrapper.html($paginationParnetUL);
        lObj.rearrangePagination(lObj.setting.pageCounter);
    }
    lObj.createFooterCounter = function() {
        if (lObj.setting.endPoint > lObj.setting.totalItemCount) {
            var $listCounter = "Showing " + (lObj.setting.startPoint + 1) + " to " + lObj.setting.totalItemCount + " of " + lObj.setting.totalItemCount + " entries";
        } else {
            var $listCounter = "Showing " + (lObj.setting.startPoint + 1) + " to " + lObj.setting.endPoint + " of " + lObj.setting.totalItemCount + " entries";
        }
        if (lObj.setting.gridData.length == 0) {
            console.log(lObj.setting.startPoint);
            var $listCounter = "Showing " + lObj.setting.startPoint + " to " + lObj.setting.startPoint + " of " + lObj.setting.totalItemCount + " entries";
        }
        lObj.setting.dataEntryCounter.html($listCounter);
    }

    lObj.prepareFooter = function() {
        var $dataGridFooter = jQuery(lObj.setting.gridClass + " .dataGridFooter");
        var $dataEntryCounter = jQuery("<div>", {
            "class": "dataEntryCounter"
        });
        var $paginationWrapper = jQuery("<div>", {
            "class": "dataEntryPagination"
        });

        lObj.setting.dataEntryCounter = $dataEntryCounter;
        lObj.setting.paginationWrapper = $paginationWrapper;
        lObj.createFooterCounter();
        lObj.createPagination();
        $dataGridFooter.append($dataEntryCounter);
        $dataGridFooter.append($paginationWrapper);
    }
    lObj.sortByName = function(colNum) {
        var flag = 0,
            sortName;
        for (key in lObj.setting.gridData[0]) {
            if (flag == (colNum - 1)) {
                sortName = key;
            }
            flag++;
        }
        return sortName;
    }
    lObj.ascending = function(colNum) {
        console.log(colNum);
        var sortName = lObj.sortByName(colNum);
        lObj.setting.gridData.sort(function(a, b) {
            var nameA = a[sortName].toLowerCase(),
                nameB = b[sortName].toLowerCase()
            if (nameA < nameB) //sort string ascending
                return -1
            if (nameA > nameB)
                return 1
            return 0 //default return value (no sorting)
        });
        lObj.createDataRow();
    }

    lObj.descending = function(colNum) {
        var sortName = lObj.sortByName(colNum);
        lObj.setting.gridData.sort(function(a, b) {
            var nameA = a[sortName].toLowerCase(),
                nameB = b[sortName].toLowerCase()
            if (nameA > nameB) //sort string ascending
                return -1
            if (nameA < nameB)
                return 1
            return 0 //default return value (no sorting)
        });
        lObj.createDataRow();
    }

    lObj.sortOrder = function() {
        if (lObj.setting.order[1] == "desc") {
            jQuery(lObj.setting.gridClass + " .dataGridContentHeader ul li:nth-child(" + lObj.setting.order[0] + ")").addClass("descending");
            lObj.descending(lObj.setting.order[0]);
        } else if (lObj.setting.order[1] == "asc") {
            jQuery(lObj.setting.gridClass + " .dataGridContentHeader ul li:nth-child(" + lObj.setting.order[0] + ")").addClass("ascending");
            lObj.ascending(lObj.setting.order[0]);
        }
        jQuery(lObj.setting.gridClass + " .dataGridContentBody ul li ul li").removeClass("sorted");
        jQuery(lObj.setting.gridClass + " .dataGridContentBody ul li ul li:nth-child(" + lObj.setting.order[0] + ")").addClass("sorted");
    }

    lObj.prepareModal = function() {
        var $modalnWrapper = jQuery("<div>", {
            "class": "modalWrapper"
        });
        jQuery("body").append($modalnWrapper);
    }

    lObj.createModal = function(title, msg, button, className) {
        var $model = '<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\
					  <div class="modal-dialog">\
					    <div class="modal-content">\
					      <div class="modal-header">\
					        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>\
					        <h4 class="modal-title" id="myModalLabel">' + title + '</h4>\
					      </div>\
					      <div class="modal-body"> ' + msg + '</div>\
					      <div class="modal-footer">\
					        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\
					        <button type="button" class="btn btn-primary ' + className + '">' + button + '</button>\
					      </div>\
					    </div>\
					  </div>\
					</div>';
        jQuery(".modalWrapper").html($model);
    }
    lObj.createEvents = function() {
        jQuery("body").on("change", lObj.setting.gridClass + " .entrycount", function(eve) {
            lObj.eventHandler("entrycount", jQuery(this));
        });
        jQuery("body").on(lObj.setting.tableEventType, lObj.setting.gridClass + " .paginationContainer li", function(eve) {
            lObj.eventHandler("paginationli", jQuery(this));
        });
        jQuery("body").on(lObj.setting.tableEventType, lObj.setting.gridClass + " .paginationPrev, .paginationNext", function(eve) {
            lObj.eventHandler("paginationbtn", jQuery(this));
        });
        jQuery("body").on(lObj.setting.tableEventType, lObj.setting.gridClass + " .dataGridContentHeader ul li", function(eve) {
            lObj.eventHandler("sorting", jQuery(this));
        });
        jQuery("body").on(lObj.setting.tableEventType, lObj.setting.gridClass + " .dataGridOptionBtn", function(i, item) {
            lObj.eventHandler("coloption", jQuery(this));
        });
        jQuery("body").on("change", lObj.setting.gridClass + " .dataGridOption .gridOptionContent input", function(eve) {
            lObj.eventHandler("selectcol", jQuery(this));
        });

        jQuery("body").on("keyup", lObj.setting.gridClass + " .act_gridFilter", function(eve) {
            lObj.setting.currentSearchText = jQuery(this).val();
            if (lObj.setting.prevSearchText == lObj.setting.currentSearchText) {
                return;
            }
            var data = jQuery(lObj.setting.gridClass + " .act_gridFilter");
            lObj.eventHandler("search", data);
        });
        jQuery("body").on("keydown", lObj.setting.gridClass + " .act_gridFilter", function(eve) {
            lObj.setting.prevSearchText = jQuery(this).val();
        });
        jQuery("body").on("change", lObj.setting.gridClass + " .filterSelect", function(eve) {
            if (lObj.setting.currentSearchText == '') {
                return;
            }
            var data = jQuery(lObj.setting.gridClass + " .act_gridFilter");
            lObj.eventHandler("search", data);
        });

        jQuery("body").on(lObj.setting.tableEventType, lObj.setting.gridClass + " .searchContent>li>ul .selectRow", function(eve) {
            lObj.eventHandler("select", jQuery(this).parent().parent());
            return false;
        });
        jQuery("body").on(lObj.setting.tableEventType, lObj.setting.gridClass + " .dataGridDeleteIcon", function(eve) {
            lObj.eventHandler("delete");
        });
        jQuery("body").on(lObj.setting.tableEventType, lObj.setting.gridClass + " .dataGridEditIcon", function(eve) {
            lObj.eventHandler("edit", jQuery(this));
        });

        jQuery("body").on(lObj.setting.tableEventType, lObj.setting.gridClass + " .dataGridAddIcon", function(eve) {
            lObj.eventHandler("add", jQuery(this));
        });

        jQuery("body").on(lObj.setting.tableEventType, lObj.setting.gridClass + " .dataGridSearchIcon", function(eve) {
            lObj.eventHandler("showfilter", jQuery(this));
        });

        jQuery("body").on(lObj.setting.tableEventType, lObj.setting.gridClass + " .form_btn_cancel", function(eve) {
            lObj.eventHandler("formclose");
        });

        jQuery("body").on(lObj.setting.tableEventType, lObj.setting.gridClass + " .selectAll", function(eve) {
            lObj.eventHandler("selectall");
            return false;
        });

        jQuery("body").on(lObj.setting.tableEventType, ".remove_btn_" + lObj.setting.randomClass, function(eve) {
            lObj.prepareRemoveApi(lObj.setting.dataSelected, lObj.remove);
        });
    }

    lObj.renderHandler = function(action, elem) {
        elem = elem || {};
        switch (action) {
            case "entrycount":
                lObj.setting.showItemCount = parseInt(elem.val());
                lObj.changeCounter();
                lObj.rearrangePagination(lObj.setting.pageCounter);
                lObj.createDataRow();
                lObj.createFooterCounter();
                break;
            case "paginationli":
                lObj.setting.pageCounter = parseInt(elem.attr("data-page"));
                lObj.changeCounter();
                lObj.rearrangePagination(lObj.setting.pageCounter);
                lObj.createDataRow();
                lObj.createFooterCounter();

                break;
            case "paginationbtn":
                lObj.changeCounter();
                lObj.rearrangePagination(lObj.setting.pageCounter);
                lObj.createDataRow();
                lObj.createFooterCounter();

                break;
            case "sorting":
                break;
            case "search":
                lObj.setting.pageCounter = 1;
                lObj.setting.startPoint = 1;
                lObj.setting.totalItemCount = lObj.setting.gridData.length;
                lObj.setting.dataSelected = [];
                jQuery(lObj.setting.gridClass + " .selectAll").removeClass("active");
                jQuery(lObj.setting.gridClass + " .selectedCount").hide();
                jQuery(lObj.setting.gridClass + " .dataGridDeleteIcon").hide();
                jQuery(lObj.setting.gridClass + " .dataGridEditIcon").hide();
                jQuery(lObj.setting.gridClass + " .dataGridAddIcon").show();
                lObj.changeCounter();
                lObj.rearrangePagination(lObj.setting.pageCounter);
                lObj.createDataRow();
                lObj.createFooterCounter();
                break;
            case "add":
                lObj.setting.totalItemCount = lObj.setting.gridData.length;
                lObj.changeCounter();
                lObj.rearrangePagination(lObj.setting.pageCounter);
                lObj.createDataRow();
                lObj.createFooterCounter();
                jQuery(lObj.setting.gridClass + " .dataGridEditIcon").hide();
                jQuery(lObj.setting.gridClass + " .dataGridDeleteIcon").hide();
                jQuery(lObj.setting.gridClass + " .dataGridAddIcon").show();
                break;
            case "delete":
                lObj.setting.totalItemCount = lObj.setting.gridData.length;
                lObj.changeCounter();
                lObj.rearrangePagination(lObj.setting.pageCounter);
                lObj.createDataRow();
                lObj.createFooterCounter();
                jQuery(lObj.setting.gridClass + " .dataGridEditIcon").hide();
                jQuery(lObj.setting.gridClass + " .selectedCount").hide();
                jQuery(lObj.setting.gridClass + " .dataGridDeleteIcon").hide();
                jQuery(lObj.setting.gridClass + " .dataGridAddIcon").show();
                lObj.setting.mode = "";
                break;
            case "edit":
                lObj.createDataRow();
                jQuery(lObj.setting.gridClass + " .dataGridEditIcon").show();
                jQuery(lObj.setting.gridClass + " .dataGridDeleteIcon").show();
                jQuery(lObj.setting.gridClass + " .dataGridAddIcon").hide();
                break;
            case "selectall":
                var isCheck = jQuery(lObj.setting.gridClass + " .selectAll").hasClass('active');
                if (!isCheck) {
                    lObj.setting.dataSelected = [];
                    for (var i = 0; i < lObj.setting.gridData.length; i++) {
                        lObj.setting.dataSelected.push("" + lObj.setting.gridData[i]["id"]);
                    }
                    jQuery(lObj.setting.gridClass + " .selectedCount>span").text(lObj.setting.dataSelected.length);
                    jQuery(lObj.setting.gridClass + " .selectedCount").show();
                    jQuery(lObj.setting.gridClass + " .dataGridAddIcon").hide();
                    jQuery(lObj.setting.gridClass + " .dataGridEditIcon").hide();
                    jQuery(lObj.setting.gridClass + " .dataGridDeleteIcon").show();
                    jQuery(lObj.setting.gridClass + " .selectAll").addClass('active')
                    lObj.createDataRow();
                } else {
                    lObj.setting.dataSelected = [];
                    jQuery(lObj.setting.gridClass + " .selectedCount>span").text(lObj.setting.dataSelected.length);
                    jQuery(lObj.setting.gridClass + " .selectedCount").hide();
                    jQuery(lObj.setting.gridClass + " .dataGridDeleteIcon").hide();
                    jQuery(lObj.setting.gridClass + " .dataGridEditIcon").hide();
                    jQuery(lObj.setting.gridClass + " .dataGridAddIcon").show();
                    jQuery(lObj.setting.gridClass + " .selectAll").removeClass('active')
                    lObj.createDataRow();
                }
                break;
            case "select":
                if (lObj.setting.dataSelected.length === 0) {
                    jQuery(lObj.setting.gridClass + " .selectedCount").hide();
                    jQuery(lObj.setting.gridClass + " .dataGridDeleteIcon").hide();
                    jQuery(lObj.setting.gridClass + " .dataGridEditIcon").hide();
                    jQuery(lObj.setting.gridClass + " .dataGridAddIcon").show();
                } else {
                    jQuery(lObj.setting.gridClass + " .dataGridEditIcon").hide();
                    jQuery(lObj.setting.gridClass + " .dataGridAddIcon").hide();
                    jQuery(lObj.setting.gridClass + " .selectAllOpt input").prop('checked', false);
                    jQuery(lObj.setting.gridClass + " .selectedCount>span").text(lObj.setting.dataSelected.length);
                    jQuery(lObj.setting.gridClass + " .selectedCount").show();
                    jQuery(lObj.setting.gridClass + " .dataGridDeleteIcon").show();
                }
                if (lObj.setting.dataSelected.length === 1) {
                    jQuery(lObj.setting.gridClass + " .dataGridEditIcon").show();
                }
                if (lObj.setting.dataSelected.length === lObj.setting.gridData.length) {
                    jQuery(lObj.setting.gridClass + " .selectAll").addClass("active");
                } else {
                    jQuery(lObj.setting.gridClass + " .selectAll").removeClass("active");
                }
                break;
            case "formclose":
                var mode = lObj.setting.mode
                switch (mode) {
                    case "add":
                        jQuery(lObj.setting.gridClass + " .addRow").slideUp().empty();
                        jQuery(lObj.setting.gridClass + " .dataGridDeleteIcon").hide();
                        jQuery(lObj.setting.gridClass + " .dataGridEditIcon").hide();
                        jQuery(lObj.setting.gridClass + " .dataGridAddIcon").show();
                        jQuery(lObj.setting.gridClass + " .selectAllOpt").show();
                        break;
                    case "edit":
                        jQuery(lObj.setting.gridClass + " .selected").parent().children(".editRow").slideUp().empty();
                        jQuery(lObj.setting.gridClass + " .dataGridDeleteIcon").show();
                        jQuery(lObj.setting.gridClass + " .dataGridEditIcon").show();
                        jQuery(lObj.setting.gridClass + " .dataGridAddIcon").hide();
                        jQuery(lObj.setting.gridClass + " .selectAllOpt").show();
                        break;

                }
                lObj.setting.mode = "";
                break;
        }

    }
    lObj.eventHandler = function(action, elem) {
        elem = elem || {};
        switch (action) {
            case "paginationbtn":
                var dataAction = elem.attr("data-action");
                var dataSwitch = elem.attr("data-switch");
                if (dataSwitch == "on") {
                    if (dataAction == "prev") {
                        lObj.setting.pageCounter = parseInt(lObj.setting.pageCounter) - 1;
                    } else if (dataAction == "next") {
                        lObj.setting.pageCounter = parseInt(lObj.setting.pageCounter) + 1;
                    }
                    jQuery(lObj.setting.gridClass + " .paginationContainer li").each(function(i, item) {
                        jQuery(this).removeClass("active");
                    });
                    jQuery(lObj.setting.gridClass + " .paginationContainer li:nth-child(" + lObj.setting.pageCounter + ")").addClass("active");
                    lObj.renderHandler(action, elem);
                }
                break;
            case "setting":
                var isActive = elem.hasClass("active");
                if (!isActive) {
                    elem.addClass("active");
                } else {
                    elem.removeClass("active");
                    lObj.renderHandler(action, elem);
                }
                break;
            case "sorting":
                var checkAsc = elem.hasClass("ascending");
                var checkDsc = elem.hasClass("descending");
                var colNum = elem.attr("data-colnum");
                elem.parent().children("li").each(function(i, item) {
                    jQuery(this).removeClass("ascending");
                    jQuery(this).removeClass("descending");
                });
                if (checkAsc == false && checkDsc == false) {
                    elem.addClass("ascending");
                    lObj.ascending(colNum);
                } else if (checkAsc) {
                    elem.addClass("descending");
                    lObj.descending(colNum);
                } else if (checkDsc) {
                    elem.addClass("ascending");
                    lObj.ascending(colNum);
                }
                jQuery(lObj.setting.gridClass + " .dataGridContentBody ul li ul li").removeClass("sorted");
                jQuery(lObj.setting.gridClass + " .dataGridContentBody ul li ul li:nth-child(" + colNum + ")").addClass("sorted");
                break;
            case "search":
                lObj.searchGrid(elem);
                lObj.renderHandler(action, elem);
                break;
            case "add":
                lObj.setting.mode = "add";
                var form = lObj.renderForm();
                elem.hide();
                jQuery(lObj.setting.gridClass + " .selectAllOpt").hide();
                jQuery(lObj.setting.gridClass + " .dataGridDeleteIcon").hide();
                jQuery(lObj.setting.gridClass + " .addRow").append(form).slideDown();
                lObj.formSubmit();
                break;
            case "delete":
                if (lObj.setting.confirmDelete) {
                    lObj.delMsg = "Are you sure, want to delete %MESSAGE%";
                    lObj.delMsg = lObj.delMsg.replace(/%MESSAGE%/, lObj.setting.dataSelected.length + " row(s)?");
                    lObj.createModal("Delete item", lObj.delMsg, "Delete", "remove_btn_" + lObj.setting.randomClass);
                }
                break;
            case "edit":
                lObj.setting.mode = "edit";
                var form = lObj.renderForm("edit");
                elem.hide();
                jQuery(lObj.setting.gridClass + " .selectAllOpt").hide();
                jQuery(lObj.setting.gridClass + " .dataGridDeleteIcon").hide();
                jQuery(lObj.setting.gridClass + " .selected").parent().children(".editRow").append(form).slideDown();
                lObj.fillFormData(lObj.setting.dataSelected[0]);
                lObj.formSubmit();
                break;
            case "selectall":
                if (lObj.setting.mode == "add" || lObj.setting.mode == "edit") {
                    jQuery(lObj.setting.gridClass + " .selectAll").removeClass("active");
                    return;
                }
                lObj.renderHandler(action, elem);
                break;
            case "select":
                if (lObj.setting.mode == "add" || lObj.setting.mode == "edit") {
                    return;
                }

                var checkStatus = elem.hasClass("selected");
                var id = elem.attr("data-id");
                if (checkStatus) {
                    elem.removeClass("selected");
                    var index = lObj.setting.dataSelected.indexOf(id);
                    if (index != -1) lObj.setting.dataSelected.splice(index, 1);
                } else {
                    elem.addClass("selected");
                    lObj.setting.dataSelected.push(id);
                }
                lObj.renderHandler(action, elem);
                break;
            case "coloption":
                var dataMode = elem.attr("data-mode");
                var parent = elem.parent();
                var dataContainer = parent.children(".gridOptionContent");
                switch (dataMode) {
                    case "on":
                        {
                            dataContainer.addClass("hide");
                            parent.removeClass("gridOptionActiveBg");
                            elem.attr("data-mode", "off");
                            break;
                        }
                    case "off":
                        {
                            dataContainer.removeClass("hide");
                            parent.addClass("gridOptionActiveBg");
                            elem.attr("data-mode", "on");
                            break;
                        }
                }
                break;

            case "selectcol":
                var elVal = elem.val();
                var elState = elem.prop("checked");
                var el = [];
                el.push(jQuery(lObj.setting.gridClass + " .dataGridContentHeader ul li:nth-child(" + elVal + ")"));
                el.push(jQuery(lObj.setting.gridClass + " .dataGridContentBody ul li ul li:nth-child(" + elVal + ")"));
                el.push(jQuery(lObj.setting.gridClass + " .dataGridContentFooter ul li:nth-child(" + elVal + ")"));
                if (elState == true) {
                    if (lObj.setting.currentViewCol < lObj.setting.maxViewCloumn) {
                        for (i = 0; i < el.length; i++) {
                            el[i].removeClass("hide");
                        }
                        lObj.setting.configColumns[elVal - 1]["visible"] = true;
                        lObj.setting.currentViewCol++;
                        lObj.prepareSelectOptions();
                    } else {
                        elem.prop("checked", false);
                        jQuery(lObj.setting.gridClass + " .dataGridOption .gridOptionError").text("Select maximum " + (lObj.setting.maxViewCloumn - 1) + " items");
                    }
                } else if (elState == false) {
                    jQuery(lObj.setting.gridClass + " .dataGridOption .gridOptionError").empty();
                    for (i = 0; i < el.length; i++) {
                        el[i].addClass("hide");
                    }
                    lObj.setting.configColumns[elVal - 1]["visible"] = false;
                    lObj.setting.currentViewCol--;
                    lObj.prepareSelectOptions();
                }
                break;
            case "showfilter":
                var srFilter = jQuery(lObj.setting.gridClass + " .dataGridSearchFilter");
                var srVisble = srFilter.is(":visible");
                if (srVisble) {
                    elem.removeClass("active");

                    srFilter.removeClass("showfilter");
                } else {
                    elem.addClass("active");
                    srFilter.addClass("showfilter");
                }
                break;
            default:
                lObj.renderHandler(action, elem);
        }

    }
    lObj.fileTypeRule = function() {};
    lObj.fileTypeMessage = function() {};
    lObj.prepareDataForPOST = function(obj) {
        return obj;
    };
    lObj.formSubmitCB = function() {
        lObj.eventHandler("formclose");
    };

    lObj.formSubmit = function() {
        /*        jQuery('#' + lObj.setting.formID).validate({
                    rules: lObj.fileTypeRule(),
                    messages: lObj.fileTypeMessage(),
                    submitHandler: function(form) {
                        lObj.XHR = {};
                        lObj.XHR.DATA = (jQuery(form).serializeObject());
                        var dummyjson = JSON.stringify(lObj.XHR.DATA);
                        if (window.recentformsubmit == dummyjson) {
                            return false;
                        }
                        window.recentformsubmit = dummyjson;
                        console.log(lObj.XHR.DATA)
                        lObj.XHR.DATA = lObj.prepareDataForPOST(lObj.XHR.DATA);
                        lObj.XHR.DATA['action'] = "create";
                        if (lObj.XHR.DATA.id != void 0) {
                            lObj.XHR.DATA['action'] = "update";
                        }
                        lObj.XHR.URL = lObj.setting.ajaxURL || "";
                        debug(lObj.XHR);
                        jQuery.ajax({
                            url: lObj.XHR.URL,
                            type: "POST",
                            dataType: "json",
                            data: lObj.XHR.DATA,
                            cache: false,
                            beforeSend: function() {},
                            xhrFields: {
                                onprogress: function(e) {}
                            }
                        }).done(function(r) {
                            debug(lObj.XHR.URL, r);
                            if (lObj.XHR.DATA['action'] == "create") {
                                lObj.setting.formatedData.d.push(r.id);
                                lObj.setting.formatedData.o[r.id] = {};
                                lObj.XHR.DATA.id = r.id;
                            }
                            jQuery.extend(lObj.setting.formatedData.o[r.id], lObj.XHR.DATA);
                            lObj.reformatData();
                            lObj.refresh();
                            lObj.formSubmitCB(r);
                            window.recentformsubmit = void 0;
                        }).error(function(r) {
                            debug(lObj.XHR.URL, 'error', r);
                            window.recentformsubmit = void 0;
                        });
                        return false;
                    }
                });*/
        return false;
    };

    lObj.updateFormCB = function(obj) {};
    lObj.prepareRemoveApi = function() {
        lObj.deleteCB()
    };
    lObj.remove = function(url, dataObj, cb) {
        url = url || '';
        dataObj = dataObj || {};
        cb = cb || function() {};
        jQuery.ajax({
            url: url,
            type: "POST",
            dataType: "json",
            data: dataObj,
            cache: false,
            beforeSend: function() {},
            xhrFields: {
                onprogress: function(e) {}
            }
        }).done(function(r) {
            debug(url, r);
            cb(r);
            lObj.deleteCB();
            window.recentformsubmit = void 0;
            window.justDelete = void 0;
        }).error(function(r) {
            debug(url, 'error', r);
            cb(r);
            jQuery('#myModal').modal("hide");
            window.recentformsubmit = void 0;
            window.justDelete = void 0;
        });
    };
    lObj.fillFormData = function(id) {
        var obj = {};
        jQuery.each(lObj.setting.formatedData.o[id], function(i, item) {
            obj.ele = jQuery("[name=" + i + "]");
            if (obj.ele.length > 0) {
                obj.ele = obj.ele[0];
                switch (obj.ele.nodeName) {
                    case 'SELECT':
                        jQuery("[name=" + i + "]").val(item);
                        break;
                    case 'INPUT':
                        switch (obj.ele.type) {
                            case 'checkbox':
                                if (item != "1") {
                                    jQuery("input[name=" + i + "]").trigger(window.eventType);
                                }
                                break;
                            case 'radio':
                                jQuery("input[name=" + i + "][value=" + item + "]").trigger(window.eventType);
                                break;
                            default:
                                jQuery("input[name=" + i + "]").val(item);
                        }
                        break;
                    default:
                        jQuery("[name=" + i + "]").val(item);
                }
            }
        });
        lObj.updateFormCB(lObj.setting.formatedData.o[id]);
    };
    lObj.deleteCB = function() {
        for (var i = 0; i < lObj.setting.dataSelected.length; i++) {
            var index = lObj.setting.formatedData.d.indexOf(lObj.setting.dataSelected[i]);
            if (index != -1) {
                lObj.setting.formatedData.d.splice(index, 1);
                delete lObj.setting.formatedData.o[lObj.setting.dataSelected[i]];
            }
        }
        lObj.setting.dataSelected = [];
        lObj.reformatData();
        lObj.setting.mode = "delete";
        lObj.refresh();
        jQuery('#myModal').modal("hide");
    };
    lObj.renderForm = function(mode) {
        var jsonToHTML = function(elem, obj, name) {
            var formAttr = '';
            if (name != 'form') {
                formAttr += 'name="' + name + '" ';
                obj['class'] = ("submit,radio,checkbox".indexOf(obj.type) < 0 ? "form-control " : "") + (obj['class'] || '');
            } else {
                obj['id'] = obj['id'] || "update_form_" + lObj.setting.randomClass;
                lObj.setting.formID = obj['id'];
            }

            for (var key in obj) {
                if (key == "label") {
                    formAttr += 'placeholder="' + obj[key] + '" ';
                } else if (key == "options") {
                    var opt = '<option value="">--Select--</option>';
                    var opt1 = '<option value="%ID%">%VALUE%</option>';
                    for (var i = 0; i < obj['options'].length; i++) {
                        var opt2 = opt1.replace('%ID%', obj['options'][i]['key']);
                        opt2 = opt2.replace('%VALUE%', obj['options'][i]['value']);
                        opt += opt2;
                    }
                    elem = elem.replace('%OPTIONS%', opt);
                } else {
                    formAttr += key + '="' + obj[key] + '" ';
                }
            }
            elem = elem.replace('%ATTR%', formAttr);
            return elem;
        }
        var formStructure = '<div class="col-xs-12 col-sm-6 col-md-3">\
								<div class="form-group">\
									%LBL_ELEMENT%\
									%INPUT_ELEMENT%\
								</div>\
							  </div>';
        var radioStructure = '<div class="col-xs-12 col-sm-12 col-md-12">\
								<div class="form-group">\
									%INPUT_ELEMENT%\
                                                                        %LBL_ELEMENT%\
								</div>\
							  </div>';
        var buttonStructure = '<div class="col-xs-12 col-sm-12 col-md-12">\
								<div class="form-group">\
									%INPUT_ELEMENT%\
								</div>\
							  </div>';
        var fData = lObj.setting.formConfig;
        var form = "";
        for (var k in fData) {
            if (k == "form") {
                form += jsonToHTML('<form %ATTR%>', fData[k], k);
                if (mode == "edit") {
                    var inputIdElm = '<input type="hidden" name="id" value=' + lObj.setting.dataSelected[0] + ' />';
                    form += inputIdElm;
                }
            } else {
                var type = fData[k]["type"] || 'text';
                fData[k]['id'] = fData[k]['id'] || "id_" + k;
                switch (type) {
                    case 'text':
                        {
                            var labelElem = '<label for="' + fData[k]['id'] + '" class="control-label">' + fData[k]['label'] + '</label>';
                            var inputElem = jsonToHTML('<input %ATTR% />', fData[k], k);
                            var htmlStruct = formStructure.replace('%LBL_ELEMENT%', labelElem);
                            htmlStruct = htmlStruct.replace('%INPUT_ELEMENT%', inputElem);
                            form += htmlStruct;
                            break;
                        }
                    case 'textarea':
                        {
                            var labelElem = '<label for="' + fData[k]['id'] + '" class="control-label">' + fData[k]['label'] + '</label>';
                            var inputElem = jsonToHTML('<textarea %ATTR% />', fData[k], k);
                            var htmlStruct = formStructure.replace('%LBL_ELEMENT%', labelElem);
                            htmlStruct = htmlStruct.replace('%INPUT_ELEMENT%', inputElem);
                            form += htmlStruct;
                            break;
                        }
                    case 'select':
                        {
                            var labelElem = '<label for="' + fData[k]['id'] + '" class="control-label">' + fData[k]['label'] + '</label>';
                            var inputElem = jsonToHTML('<select %ATTR%>%OPTIONS%</select>', fData[k], k);
                            var htmlStruct = formStructure.replace('%LBL_ELEMENT%', labelElem);
                            htmlStruct = htmlStruct.replace('%INPUT_ELEMENT%', inputElem);
                            form += htmlStruct;
                            break;
                        }
                    case 'radio':
                        {
                            //  console.log(k);
                            for (var l = 0; l < fData[k]["elem"].length; l++) {
                                //  console.log(fData[k]["elem"][l]['label']);
                                var labelElem = '<label for="' + fData[k]["elem"][l]['id'] + '" class="control-label">' + fData[k]["elem"][l]['label'] + '</label>';
                                var inputElem = jsonToHTML('<input %ATTR% />', fData[k]["elem"][l], k);
                                var htmlStruct = radioStructure.replace('%LBL_ELEMENT%', labelElem);
                                htmlStruct = htmlStruct.replace('%INPUT_ELEMENT%', inputElem);
                                form += htmlStruct;
                            }
                            break;
                        }
                    case 'submit':
                        {
                            var inputElem = jsonToHTML('<button class="btn btn-default form_btn_cancel">Cancel</button> <button %ATTR% >%BUTTON_NAME%</button>', fData[k], k);
                            var htmlStruct = buttonStructure.replace('%INPUT_ELEMENT%', inputElem);
                            htmlStruct = htmlStruct.replace('%BUTTON_NAME%', k);
                            form += htmlStruct;
                            break;
                        }
                }
            }
        }
        form += '</form>';
        return form;
    };


    lObj.renderGrid = function() {
        lObj.setting.tableContent.empty();
        var $dataGridContainer = lObj.gridTemplate.replace("{GRID CLASS}", "dataGridContainer_" + lObj.setting.randomClass);
        var wrapper = lObj.setting.tableContent.append($dataGridContainer);
        lObj.setting.dataGridContainer = jQuery(wrapper).children();
        lObj.prepareFilter();
        lObj.prepareGridOption();
        lObj.prepareGridHeader();
        lObj.prepareGridBody();
        lObj.prepareGridFooter();
        lObj.prepareFooter();
        lObj.prepareModal();
    };
    lObj.sizeOfObj = function(obj) {
        var size = 0,
            key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };
    lObj.checkColumns = function() {
        var colSize = 100 / lObj.sizeOfObj(lObj.setting.gridData[0]);
        if (lObj.setting.configColumns.length == 0) {
            for (j in lObj.setting.gridData[0]) {
                var configObj = {};
                configObj["mData"] = j;
                configObj["sWidth"] = colSize;
                lObj.setting.configColumns.push(configObj)
            }
        }
    };
    lObj.setColumWidth = function() {
        var $style = jQuery("<style>");
        var $mediaStyle = "@media only screen and (min-width : 601px){"
        for (var k = 0; k < lObj.setting.configColumns.length; k++) {
            for (j in lObj.setting.gridData[0]) {
                $mediaStyle += lObj.setting.gridClass + " .dataGridContentHeader ul li:nth-child(" + (k + 1) + "), " + lObj.setting.gridClass + " .dataGridContentFooter ul li:nth-child(" + (k + 1) + ") { width:" + lObj.setting.configColumns[k]["sWidth"] + "}";
                $mediaStyle += lObj.setting.gridClass + " .dataGridContentBody ul li ul li:nth-child(" + (k + 1) + ") { width:" + lObj.setting.configColumns[k]["sWidth"] + "}";
            }
        }
        $mediaStyle += "}";
        $style.append($mediaStyle);
        $style.appendTo("head");
    };
    lObj.reformatData = function() {
        lObj.setting.gridData = [];
        for (var k = 0; k < lObj.setting.formatedData.d.length; k++) {
            var key = lObj.setting.formatedData.d[k];
            lObj.setting.gridData.push(lObj.setting.formatedData.o[key])
        }
    };
    lObj.formatData = function(data) {
        lObj.setting.formatedData = {};
        lObj.setting.formatedData.d = [];
        lObj.setting.formatedData.o = {};
        for (var i = 0; i < data.length; i++) {
            var id = data[i]['id'];
            lObj.setting.formatedData.d.push(id);
            lObj.setting.formatedData.o[id] = data[i];
        }
        lObj.reformatData();
    };
    lObj.refresh = function() {
        var data = jQuery(lObj.setting.gridClass + " .act_gridFilter");
        var mode = lObj.setting.mode;
        if (data.val() != "") {
            lObj.searchGrid(data);
        }
        lObj.renderHandler(mode);
    }
    lObj.init = function() {
        lObj.formatData(lObj.setting.gridDataOrignal);
        lObj.checkColumns();
        lObj.makeResponsive();
        lObj.setColumWidth();
        lObj.createEvents();
        lObj.renderGrid();
        lObj.sortOrder();
    };
}
