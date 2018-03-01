function requiredFieldValidator(value) {
  if (value == null || value == undefined || !value.length) {
    return {valid: false, msg: "This is a required field"};
  } else {
    return {valid: true, msg: null};
  }
}


var TaskNameFormatter = function (row, cell, value, columnDef, dataContext) {
  if (value == null || value == undefined || dataContext === undefined) { return ""; }
  
  value = value.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  var spacer = "<span style='display:inline-block;height:1px;width:" + (15 * dataContext["indent"]) + "px'></span>";
  var idx = dataView.getIdxById(dataContext.id);
  console.log(dataContext._collapsed);
  if (data[idx + 1] && data[idx + 1].indent > data[idx].indent) {
    if (dataContext._collapsed) {
      return spacer + " <span class='toggle expand'></span>&nbsp;" + value;
    } else {
      return spacer + " <span class='toggle collapse'></span>&nbsp;" + value;
    }
  } else {
    return spacer + " <span class='toggle'></span>&nbsp;" + value;
  }
};

var dataView;
var grid;
var data = [];
var columns = [
  {id: "block", name: "Block", field: "block", width: 220, cssClass: "cell-title", editor: Slick.Editors.Text, validator: requiredFieldValidator},
  {id: "benchmark", name: "Benchmark", field: "benchmark", editor: Slick.Editors.Text},
  {id: "stratAlloc", name: "Strategy Alloc %", field: "stratAlloc", width: 80, resizable: false, editor: Slick.Editors.PercentComplete},
  {id: "tactAlloc", name: "Tactical Alloc %", field: "tactAlloc", width: 80, resizable: false, editor: Slick.Editors.PercentComplete},
  {id: "title", name: "Title", field: "title", width: 220, formatter: TaskNameFormatter},
  {id: "clientID", name: "Client ID", field: "clientID", minWidth: 60, editor: Slick.Editors.Text},
  {id: "isin", name: "ISIN", width: 80, minWidth: 20, maxWidth: 80, cssClass: "cell-effort-driven", field: "isin"},
  {id: "holdType", name: "Hold Type", width: 80, minWidth: 20, maxWidth: 80, cssClass: "cell-effort-driven", field: "holdType"},
  {id: "country", name: "Country", field: "country", minWidth: 60, editor: Slick.Editors.Text},
  {id: "currency", name: "Currency", field: "currency", minWidth: 60, editor: Slick.Editors.Text},
  {id: "assetType", name: "Asset Type", field: "assetType", minWidth: 60, editor: Slick.Editors.Text},
  {id: "ytm", name: "YTM", field: "ytm", minWidth: 60, editor: Slick.Editors.Text},
  {id: "oad", name: "OAD", field: "oad", minWidth: 60, editor: Slick.Editors.Text},
  {id: "mv", name: "MV", field: "mv", minWidth: 60, editor: Slick.Editors.Text},
  {id: "totalmv", name: "Total MV", field: "totalmv", minWidth: 60, editor: Slick.Editors.Text},
  {id: "mvp", name: "MV %", field: "mvp", width: 80, resizable: false, editor: Slick.Editors.PercentComplete},
  {id: "description", name: "Description", field: "description", minWidth: 60, editor: Slick.Editors.Text}
  ];

var options = {
  editable: true,
  enableAddRow: true,
  enableCellNavigation: true,
  asyncEditorLoading: false
};

var percentCompleteThreshold = 0;
var searchString = "";

function myFilter(item) {
  if (item["percentComplete"] < percentCompleteThreshold) {
    return false;
  }

  if (searchString != "" && item["title"].indexOf(searchString) == -1) {
    return false;
  }

  if (item.parent != null) {
    var parent = data[item.parent];

    while (parent) {
      if (parent._collapsed || (parent["percentComplete"] < percentCompleteThreshold) || (searchString != "" && parent["title"].indexOf(searchString) == -1)) {
        return false;
      }

      parent = data[parent.parent];
    }
  }

  return true;
}

function percentCompleteSort(a, b) {
  return a["percentComplete"] - b["percentComplete"];
}

export function renderGrid() {
  var indent = 0;
  var parents = [];

  data = [{
	  "id": "id_0", "indent": 0, "parent": null,
      "block":"ADR - DEV MARKETS ABC USD",
      "benchmark":"benchmark 1",
      "stratAlloc":"5%",
      "tactAlloc":"6%",
      "title":"ADR - DEV MARKETS",
      "clientID":"",
      "isin":"",
      "holdType":"",
      "country":"",
      "currency":"",
      "assetType":"",
      "ytm":"0.0",
      "oad":"0.0",
      "mv":"7367289",
      "totalmv":"7367289",
      "mvp":"30%",
      "description":""
   },
   {
      "id": "id_1", "indent": 1, "parent": 0,
      "title":"ABC",
      "clientID":"",
      "isin":"",
      "holdType":"",
      "country":"",
      "currency":"",
      "assetType":"",
      "ytm":"0.0",
      "oad":"0.0",
      "mv":"7367289",
      "totalmv":"7367289",
      "mvp":"30%",
      "description":""
   },
   {
      "id": "id_2", "indent": 2, "parent": 1,
      "title":"USD",
      "clientID":"",
      "isin":"",
      "holdType":"",
      "country":"",
      "currency":"",
      "assetType":"",
      "ytm":"0.0",
      "oad":"0.0",
      "mv":"7367289",
      "totalmv":"7367289",
      "mvp":"30%",
      "description":""
   },
   {
      "id": "id_3", "indent": 3, "parent": 2,
      "title":"Security ABC",
      "clientID":"8747238",
      "isin":"IR0004324843",
      "holdType":"MARKETS",
      "country":"SCOTLAND",
      "currency":"USD",
      "assetType":"EQUITIES",
      "ytm":"0.0",
      "oad":"0.0",
      "mv":"482839",
      "totalmv":"482839",
      "mvp":"12%",
      "description":"Security ABC"
   },
   {
      "id": "id_4", "indent": 3, "parent": 2,
      "title":"Security XYZ",
      "clientID":"6573000",
      "isin":"EN0004396400",
      "holdType":"MARKETS",
      "country":"SCOTLAND",
      "currency":"USD",
      "assetType":"EQUITIES",
      "ytm":"0.0",
      "oad":"0.0",
      "mv":"482839",
      "totalmv":"482839",
      "mvp":"18%",
      "description":"Security XYZ"
   },
   {
	  "id": "id_5", "indent": 0, "parent": null,
      "block":"CURRENCIES AUS AUD",
      "benchmark":"benchmark 7",
      "stratAlloc":"",
      "tactAlloc":"",
      "title":"CURRENCIES",
      "clientID":"",
      "isin":"",
      "holdType":"",
      "country":"",
      "currency":"",
      "assetType":"",
      "ytm":"0.0",
      "oad":"0.0",
      "mv":"9482901933",
      "totalmv":"9482901933",
      "mvp":"70%",
      "description":""
   },
   {
      "id": "id_6", "indent": 1, "parent": 5,
      "title":"AUSTRALIA",
      "clientID":"",
      "isin":"",
      "holdType":"",
      "country":"",
      "currency":"",
      "assetType":"",
      "ytm":"0.0",
      "oad":"0.0",
      "mv":"7006889",
      "totalmv":"7006889",
      "mvp":"3%",
      "description":""
   },
   {
	  "id": "id_7", "indent": 2, "parent": 6,
      "title":"AUD",
      "clientID":"",
      "isin":"",
      "holdType":"",
      "country":"",
      "currency":"",
      "assetType":"",
      "ytm":"0.0",
      "oad":"0.0",
      "mv":"7006889",
      "totalmv":"7006889",
      "mvp":"3%",
      "description":""
   },	
   {
      "id": "id_8", "indent": 3, "parent": 7,
      "title":"AU Dollar",
      "clientID":"0910D09",
      "isin":"",
      "holdType":"CURRENCIES",
      "country":"AUSTRALIA",
      "currency":"AUD",
      "assetType":"Cash Equivalents",
      "ytm":"0.0",
      "oad":"0.0",
      "mv":"47436",
      "totalmv":"47436",
      "mvp":"1%",
      "description":"AUS Dollar"
   },
   {
      "id": "id_9", "indent": 3, "parent": 7,
      "title":"AU Dollar",
      "clientID":"0910D09",
      "isin":"",
      "holdType":"CURRENCIES",
      "country":"AUSTRALIA",
      "currency":"AUD",
      "assetType":"Cash Equivalents",
      "ytm":"0.0",
      "oad":"0.0",
      "mv":"83294",
      "totalmv":"83294",
      "mvp":"2%",
      "description":"AUS Dollar"
   },
   {
      "id": "id_10", "indent": 1, "parent": 5,
      "title":"UNITED KINGDOM",
      "clientID":"",
      "isin":"",
      "holdType":"",
      "country":"",
      "currency":"",
      "assetType":"",
      "ytm":"0.0",
      "oad":"0.0",
      "mv":"-7006889",
      "totalmv":"-7006889",
      "mvp":"-4%",
      "description":""
   },   
   {
      "id": "id_11", "indent": 2, "parent": 10,
      "title":"GBP",
      "clientID":"",
      "isin":"",
      "holdType":"",
      "country":"",
      "currency":"",
      "assetType":"",
      "ytm":"0.0",
      "oad":"0.0",
      "mv":"-7006889",
      "totalmv":"-7006889",
      "mvp":"-4%",
      "description":""
   }];

  // initialize the model
  dataView = new Slick.Data.DataView({ inlineFilters: true });
  dataView.beginUpdate();
  dataView.setItems(data);
  //dataView.setFilter(myFilter);
  dataView.endUpdate();

  // initialize the grid
  grid = new Slick.Grid("#myGrid", dataView, columns, options);

  grid.onCellChange.subscribe(function (e, args) {
	  console.log("1");
    dataView.updateItem(args.item.id, args.item);
  });

  grid.onAddNewRow.subscribe(function (e, args) {
	  console.log("2");
    var item = {
      "id": "new_" + (Math.round(Math.random() * 10000)),
      "indent": 0,
      "title": "New task",
      "duration": "1 day",
      "percentComplete": 0,
      "start": "01/01/2009",
      "finish": "01/01/2009",
      "effortDriven": false};
    $.extend(item, args.item);
    dataView.addItem(item);
  });

  grid.onClick.subscribe(function (e, args) {
	  console.log("3");
    if ($(e.target).hasClass("toggle")) {
      var item = dataView.getItem(args.row);
      if (item) {
        if (!item._collapsed) {
          item._collapsed = true;
        } else {
          item._collapsed = false;
        }

        dataView.updateItem(item.id, item);
      }
      e.stopImmediatePropagation();
    }
  });


  // wire up model events to drive the grid
  dataView.onRowCountChanged.subscribe(function (e, args) {
	  console.log("4");
    grid.updateRowCount();
    grid.render();
  });

  dataView.onRowsChanged.subscribe(function (e, args) {
	  console.log("5");
	  grid.updateRowCount();
    grid.render();

    grid.invalidateRows(args.rows);
    grid.render();
  });


  var h_runfilters = null;

  // wire up the slider to apply the filter to the model
  $("#pcSlider").slider({
    "range": "min",
    "slide": function (event, ui) {
      Slick.GlobalEditorLock.cancelCurrentEdit();

      if (percentCompleteThreshold != ui.value) {
        window.clearTimeout(h_runfilters);
        h_runfilters = window.setTimeout(dataView.refresh, 10);
        percentCompleteThreshold = ui.value;
      }
    }
  });


  // wire up the search textbox to apply the filter to the model
  $("#txtSearch").keyup(function (e) {
    Slick.GlobalEditorLock.cancelCurrentEdit();

    // clear on Esc
    if (e.which == 27) {
      this.value = "";
    }

    searchString = this.value;
    dataView.refresh();
  })
}
