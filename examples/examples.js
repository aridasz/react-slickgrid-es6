webpackJsonp([1],{

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(90);


/***/ }),

/***/ 7:
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/** *
	 * Contains core SlickGrid classes.
	 * @module Core
	 * @namespace Slick
	 */
	var Slick = {
	  Event: Event,
	  EventData: EventData,
	  EventHandler: EventHandler,
	  Range: Range,
	  NonDataRow: NonDataItem,
	  Group: Group,
	  GroupTotals: GroupTotals,
	  EditorLock: EditorLock,
	  /** *
	   * A global singleton editor lock.
	   * @class GlobalEditorLock
	   * @static
	   * @constructor
	   */
	  GlobalEditorLock: new EditorLock(),
	  TreeColumns: TreeColumns,
	
	  keyCode: {
	    BACKSPACE: 8,
	    DELETE: 46,
	    DOWN: 40,
	    END: 35,
	    ENTER: 13,
	    ESCAPE: 27,
	    HOME: 36,
	    INSERT: 45,
	    LEFT: 37,
	    PAGE_DOWN: 34,
	    PAGE_UP: 33,
	    RIGHT: 39,
	    TAB: 9,
	    UP: 38,
	    SPACE: 32
	  }
	};
	
	exports.default = Slick;
	
	/***
	 * An event object for passing data to event handlers and letting them control propagation.
	 * <p>This is pretty much identical to how W3C and jQuery implement events.</p>
	 * @class EventData
	 * @constructor
	 */
	
	function EventData() {
	  var isPropagationStopped = false;
	  var isImmediatePropagationStopped = false;
	
	  /***
	   * Stops event from propagating up the DOM tree.
	   * @method stopPropagation
	   */
	  this.stopPropagation = function () {
	    isPropagationStopped = true;
	  };
	
	  /***
	   * Returns whether stopPropagation was called on this event object.
	   * @method isPropagationStopped
	   * @return {Boolean}
	   */
	  this.isPropagationStopped = function () {
	    return isPropagationStopped;
	  };
	
	  /***
	   * Prevents the rest of the handlers from being executed.
	   * @method stopImmediatePropagation
	   */
	  this.stopImmediatePropagation = function () {
	    isImmediatePropagationStopped = true;
	  };
	
	  /***
	   * Returns whether stopImmediatePropagation was called on this event object.\
	   * @method isImmediatePropagationStopped
	   * @return {Boolean}
	   */
	  this.isImmediatePropagationStopped = function () {
	    return isImmediatePropagationStopped;
	  };
	}
	
	/***
	 * A simple publisher-subscriber implementation.
	 * @class Event
	 * @constructor
	 */
	function Event() {
	  var handlers = [];
	
	  /***
	   * Adds an event handler to be called when the event is fired.
	   * <p>Event handler will receive two arguments - an <code>EventData</code> and the <code>data</code>
	   * object the event was fired with.<p>
	   * @method subscribe
	   * @param fn {Function} Event handler.
	   */
	  this.subscribe = function (fn) {
	    handlers.push(fn);
	  };
	
	  /***
	   * Removes an event handler added with <code>subscribe(fn)</code>.
	   * @method unsubscribe
	   * @param fn {Function} Event handler to be removed.
	   */
	  this.unsubscribe = function (fn) {
	    for (var i = handlers.length - 1; i >= 0; i--) {
	      if (handlers[i] === fn) {
	        handlers.splice(i, 1);
	      }
	    }
	  };
	
	  /***
	   * Fires an event notifying all subscribers.
	   * @method notify
	   * @param args {Object} Additional data object to be passed to all handlers.
	   * @param e {EventData}
	   *      Optional.
	   *      An <code>EventData</code> object to be passed to all handlers.
	   *      For DOM events, an existing W3C/jQuery event object can be passed in.
	   * @param scope {Object}
	   *      Optional.
	   *      The scope ("this") within which the handler will be executed.
	   *      If not specified, the scope will be set to the <code>Event</code> instance.
	   */
	  this.notify = function (args, e, scope) {
	    e = e || new EventData();
	    scope = scope || this;
	
	    var returnValue;
	    for (var i = 0; i < handlers.length && !(e.isPropagationStopped() || e.isImmediatePropagationStopped()); i++) {
	      returnValue = handlers[i].call(scope, e, args);
	    }
	
	    return returnValue;
	  };
	}
	
	function EventHandler() {
	  var handlers = [];
	
	  this.subscribe = function (event, handler) {
	    handlers.push({
	      event: event,
	      handler: handler
	    });
	    event.subscribe(handler);
	
	    return this; // allow chaining
	  };
	
	  this.unsubscribe = function (event, handler) {
	    var i = handlers.length;
	    while (i--) {
	      if (handlers[i].event === event && handlers[i].handler === handler) {
	        handlers.splice(i, 1);
	        event.unsubscribe(handler);
	        return;
	      }
	    }
	
	    return this; // allow chaining
	  };
	
	  this.unsubscribeAll = function () {
	    var i = handlers.length;
	    while (i--) {
	      handlers[i].event.unsubscribe(handlers[i].handler);
	    }
	    handlers = [];
	
	    return this; // allow chaining
	  };
	}
	
	/***
	 * A structure containing a range of cells.
	 * @class Range
	 * @constructor
	 * @param fromRow {Integer} Starting row.
	 * @param fromCell {Integer} Starting cell.
	 * @param toRow {Integer} Optional. Ending row. Defaults to <code>fromRow</code>.
	 * @param toCell {Integer} Optional. Ending cell. Defaults to <code>fromCell</code>.
	 */
	function Range(fromRow, fromCell, toRow, toCell) {
	  if (toRow === undefined && toCell === undefined) {
	    toRow = fromRow;
	    toCell = fromCell;
	  }
	
	  /***
	   * @property fromRow
	   * @type {Integer}
	   */
	  this.fromRow = Math.min(fromRow, toRow);
	
	  /***
	   * @property fromCell
	   * @type {Integer}
	   */
	  this.fromCell = Math.min(fromCell, toCell);
	
	  /***
	   * @property toRow
	   * @type {Integer}
	   */
	  this.toRow = Math.max(fromRow, toRow);
	
	  /***
	   * @property toCell
	   * @type {Integer}
	   */
	  this.toCell = Math.max(fromCell, toCell);
	
	  /***
	   * Returns whether a range represents a single row.
	   * @method isSingleRow
	   * @return {Boolean}
	   */
	  this.isSingleRow = function () {
	    return this.fromRow == this.toRow;
	  };
	
	  /***
	   * Returns whether a range represents a single cell.
	   * @method isSingleCell
	   * @return {Boolean}
	   */
	  this.isSingleCell = function () {
	    return this.fromRow == this.toRow && this.fromCell == this.toCell;
	  };
	
	  /***
	   * Returns whether a range contains a given cell.
	   * @method contains
	   * @param row {Integer}
	   * @param cell {Integer}
	   * @return {Boolean}
	   */
	  this.contains = function (row, cell) {
	    return row >= this.fromRow && row <= this.toRow && cell >= this.fromCell && cell <= this.toCell;
	  };
	
	  /***
	   * Returns a readable representation of a range.
	   * @method toString
	   * @return {String}
	   */
	  this.toString = function () {
	    if (this.isSingleCell()) {
	      return "(" + this.fromRow + ":" + this.fromCell + ")";
	    } else {
	      return "(" + this.fromRow + ":" + this.fromCell + " - " + this.toRow + ":" + this.toCell + ")";
	    }
	  };
	}
	
	/***
	 * A base class that all special / non-data rows (like Group and GroupTotals) derive from.
	 * @class NonDataItem
	 * @constructor
	 */
	function NonDataItem() {
	  this.__nonDataRow = true;
	}
	
	/***
	 * Information about a group of rows.
	 * @class Group
	 * @extends Slick.NonDataItem
	 * @constructor
	 */
	function Group() {
	  this.__group = true;
	
	  /**
	   * Grouping level, starting with 0.
	   * @property level
	   * @type {Number}
	   */
	  this.level = 0;
	
	  /***
	   * Number of rows in the group.
	   * @property count
	   * @type {Integer}
	   */
	  this.count = 0;
	
	  /***
	   * Grouping value.
	   * @property value
	   * @type {Object}
	   */
	  this.value = null;
	
	  /***
	   * Formatted display value of the group.
	   * @property title
	   * @type {String}
	   */
	  this.title = null;
	
	  /***
	   * Whether a group is collapsed.
	   * @property collapsed
	   * @type {Boolean}
	   */
	  this.collapsed = false;
	
	  /***
	   * GroupTotals, if any.
	   * @property totals
	   * @type {GroupTotals}
	   */
	  this.totals = null;
	
	  /**
	   * Rows that are part of the group.
	   * @property rows
	   * @type {Array}
	   */
	  this.rows = [];
	
	  /**
	   * Sub-groups that are part of the group.
	   * @property groups
	   * @type {Array}
	   */
	  this.groups = null;
	
	  /**
	   * A unique key used to identify the group.  This key can be used in calls to DataView
	   * collapseGroup() or expandGroup().
	   * @property groupingKey
	   * @type {Object}
	   */
	  this.groupingKey = null;
	}
	
	Group.prototype = new NonDataItem();
	
	/***
	 * Compares two Group instances.
	 * @method equals
	 * @return {Boolean}
	 * @param group {Group} Group instance to compare to.
	 */
	Group.prototype.equals = function (group) {
	  return this.value === group.value && this.count === group.count && this.collapsed === group.collapsed && this.title === group.title;
	};
	
	/***
	 * Information about group totals.
	 * An instance of GroupTotals will be created for each totals row and passed to the aggregators
	 * so that they can store arbitrary data in it.  That data can later be accessed by group totals
	 * formatters during the display.
	 * @class GroupTotals
	 * @extends Slick.NonDataItem
	 * @constructor
	 */
	function GroupTotals() {
	  this.__groupTotals = true;
	
	  /***
	   * Parent Group.
	   * @param group
	   * @type {Group}
	   */
	  this.group = null;
	
	  /***
	   * Whether the totals have been fully initialized / calculated.
	   * Will be set to false for lazy-calculated group totals.
	   * @param initialized
	   * @type {Boolean}
	   */
	  this.initialized = false;
	}
	
	GroupTotals.prototype = new NonDataItem();
	
	/***
	 * A locking helper to track the active edit controller and ensure that only a single controller
	 * can be active at a time.  This prevents a whole class of state and validation synchronization
	 * issues.  An edit controller (such as SlickGrid) can query if an active edit is in progress
	 * and attempt a commit or cancel before proceeding.
	 * @class EditorLock
	 * @constructor
	 */
	function EditorLock() {
	  var activeEditController = null;
	
	  /***
	   * Returns true if a specified edit controller is active (has the edit lock).
	   * If the parameter is not specified, returns true if any edit controller is active.
	   * @method isActive
	   * @param editController {EditController}
	   * @return {Boolean}
	   */
	  this.isActive = function (editController) {
	    return editController ? activeEditController === editController : activeEditController !== null;
	  };
	
	  /***
	   * Sets the specified edit controller as the active edit controller (acquire edit lock).
	   * If another edit controller is already active, and exception will be thrown.
	   * @method activate
	   * @param editController {EditController} edit controller acquiring the lock
	   */
	  this.activate = function (editController) {
	    if (editController === activeEditController) {
	      // already activated?
	      return;
	    }
	    if (activeEditController !== null) {
	      throw "SlickGrid.EditorLock.activate: an editController is still active, can't activate another editController";
	    }
	    if (!editController.commitCurrentEdit) {
	      throw "SlickGrid.EditorLock.activate: editController must implement .commitCurrentEdit()";
	    }
	    if (!editController.cancelCurrentEdit) {
	      throw "SlickGrid.EditorLock.activate: editController must implement .cancelCurrentEdit()";
	    }
	    activeEditController = editController;
	  };
	
	  /***
	   * Unsets the specified edit controller as the active edit controller (release edit lock).
	   * If the specified edit controller is not the active one, an exception will be thrown.
	   * @method deactivate
	   * @param editController {EditController} edit controller releasing the lock
	   */
	  this.deactivate = function (editController) {
	    if (activeEditController !== editController) {
	      throw "SlickGrid.EditorLock.deactivate: specified editController is not the currently active one";
	    }
	    activeEditController = null;
	  };
	
	  /***
	   * Attempts to commit the current edit by calling "commitCurrentEdit" method on the active edit
	   * controller and returns whether the commit attempt was successful (commit may fail due to validation
	   * errors, etc.).  Edit controller's "commitCurrentEdit" must return true if the commit has succeeded
	   * and false otherwise.  If no edit controller is active, returns true.
	   * @method commitCurrentEdit
	   * @return {Boolean}
	   */
	  this.commitCurrentEdit = function () {
	    return activeEditController ? activeEditController.commitCurrentEdit() : true;
	  };
	
	  /***
	   * Attempts to cancel the current edit by calling "cancelCurrentEdit" method on the active edit
	   * controller and returns whether the edit was successfully cancelled.  If no edit controller is
	   * active, returns true.
	   * @method cancelCurrentEdit
	   * @return {Boolean}
	   */
	  this.cancelCurrentEdit = function cancelCurrentEdit() {
	    return activeEditController ? activeEditController.cancelCurrentEdit() : true;
	  };
	}
	
	/**
	 *
	 * @param {Array} treeColumns Array com levels of columns
	 * @returns {{hasDepth: 'hasDepth', getTreeColumns: 'getTreeColumns', extractColumns: 'extractColumns', getDepth: 'getDepth', getColumnsInDepth: 'getColumnsInDepth', getColumnsInGroup: 'getColumnsInGroup', visibleColumns: 'visibleColumns', filter: 'filter', reOrder: reOrder}}
	 * @constructor
	 */
	function TreeColumns(treeColumns) {
	
	  var columnsById = {};
	
	  function init() {
	    mapToId(treeColumns);
	  }
	
	  function mapToId(columns) {
	    columns.forEach(function (column) {
	      columnsById[column.id] = column;
	
	      if (column.columns) mapToId(column.columns);
	    });
	  }
	
	  function filter(node, condition) {
	
	    return node.filter(function (column) {
	
	      var valid = condition.call(column);
	
	      if (valid && column.columns) column.columns = filter(column.columns, condition);
	
	      return valid && (!column.columns || column.columns.length);
	    });
	  }
	
	  function sort(columns, grid) {
	    columns.sort(function (a, b) {
	      var indexA = getOrDefault(grid.getColumnIndex(a.id)),
	          indexB = getOrDefault(grid.getColumnIndex(b.id));
	
	      return indexA - indexB;
	    }).forEach(function (column) {
	      if (column.columns) sort(column.columns, grid);
	    });
	  }
	
	  function getOrDefault(value) {
	    return typeof value === 'undefined' ? -1 : value;
	  }
	
	  function getDepth(node) {
	    if (node.length) for (var i in node) {
	      return getDepth(node[i]);
	    } else if (node.columns) return 1 + getDepth(node.columns);else return 1;
	  }
	
	  function getColumnsInDepth(node, depth, current) {
	    var columns = [];
	    current = current || 0;
	
	    if (depth == current) {
	
	      if (node.length) node.forEach(function (n) {
	        if (n.columns) n.extractColumns = function () {
	          return extractColumns(n);
	        };
	      });
	
	      return node;
	    } else for (var i in node) {
	      if (node[i].columns) {
	        columns = columns.concat(getColumnsInDepth(node[i].columns, depth, current + 1));
	      }
	    }return columns;
	  }
	
	  function extractColumns(node) {
	    var result = [];
	
	    if (node.hasOwnProperty('length')) {
	
	      for (var i = 0; i < node.length; i++) {
	        result = result.concat(extractColumns(node[i]));
	      }
	    } else {
	
	      if (node.hasOwnProperty('columns')) result = result.concat(extractColumns(node.columns));else return node;
	    }
	
	    return result;
	  }
	
	  function cloneTreeColumns() {
	    return $.extend(true, [], treeColumns);
	  }
	
	  init();
	
	  this.hasDepth = function () {
	
	    for (var i in treeColumns) {
	      if (treeColumns[i].hasOwnProperty('columns')) return true;
	    }return false;
	  };
	
	  this.getTreeColumns = function () {
	    return treeColumns;
	  };
	
	  this.extractColumns = function () {
	    return this.hasDepth() ? extractColumns(treeColumns) : treeColumns;
	  };
	
	  this.getDepth = function () {
	    return getDepth(treeColumns);
	  };
	
	  this.getColumnsInDepth = function (depth) {
	    return getColumnsInDepth(treeColumns, depth);
	  };
	
	  this.getColumnsInGroup = function (groups) {
	    return extractColumns(groups);
	  };
	
	  this.visibleColumns = function () {
	    return filter(cloneTreeColumns(), function () {
	      return this.visible;
	    });
	  };
	
	  this.filter = function (condition) {
	    return filter(cloneTreeColumns(), condition);
	  };
	
	  this.reOrder = function (grid) {
	    return sort(treeColumns, grid);
	  };
	
	  this.getById = function (id) {
	    return columnsById[id];
	  };
	
	  this.getInIds = function (ids) {
	    return ids.map(function (id) {
	      return columnsById[id];
	    });
	  };
	}

/***/ }),

/***/ 52:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _jquery = __webpack_require__(8);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _slick = __webpack_require__(7);
	
	var _slick2 = _interopRequireDefault(_slick);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = CellRangeDecorator;
	
	/** *
	 * Displays an overlay on top of a given cell range.
	 *
	 * TODO:
	 * Currently, it blocks mouse events to DOM nodes behind it.
	 * Use FF and WebKit-specific 'pointer-events' CSS style, or some kind of event forwarding.
	 * Could also construct the borders separately using 4 individual DIVs.
	 *
	 * @param {Grid} grid
	 * @param {Object} options
	 */
	
	function CellRangeDecorator(grid, options) {
	  var _elem = void 0;
	  var _defaults = {
	    selectionCssClass: 'slick-range-decorator',
	    selectionCss: {
	      zIndex: '9999',
	      border: '2px dashed red'
	    }
	  };
	
	  options = Object.assign({}, _defaults, options);
	
	  function show(range) {
	    if (!_elem) {
	      _elem = (0, _jquery2.default)('<div></div>', { css: options.selectionCss }).addClass(options.selectionCssClass).css('position', 'absolute').appendTo(grid.getCanvasNode());
	    }
	
	    var from = grid.getCellNodeBox(range.fromRow, range.fromCell);
	    var to = grid.getCellNodeBox(range.toRow, range.toCell);
	
	    _elem.css({
	      top: from.top - 1,
	      left: from.left - 1,
	      height: to.bottom - from.top - 2,
	      width: to.right - from.left - 2
	    });
	
	    return _elem;
	  }
	
	  function hide() {
	    if (_elem) {
	      _elem.remove();
	      _elem = null;
	    }
	  }
	
	  Object.assign(this, {
	    show: show,
	    hide: hide
	  });
	}

/***/ }),

/***/ 53:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _jquery = __webpack_require__(8);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _slick = __webpack_require__(7);
	
	var _slick2 = _interopRequireDefault(_slick);
	
	var _slick3 = __webpack_require__(52);
	
	var _slick4 = _interopRequireDefault(_slick3);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = CellRangeSelector;
	
	
	function CellRangeSelector(options) {
	  var _grid = void 0;
	  var _canvas = void 0;
	  var _dragging = void 0;
	  var _decorator = void 0;
	  var _range = {};
	
	  var _self = this;
	  var _handler = new _slick2.default.EventHandler();
	  var _defaults = {
	    selectionCss: {
	      // 'border': '2px dashed blue'
	    }
	  };
	
	  function init(grid) {
	    options = Object.assign({}, _defaults, options);
	    _decorator = new _slick4.default(grid, options);
	    _grid = grid;
	    _canvas = _grid.getCanvasNode();
	    _handler.subscribe(_grid.onDragInit, handleDragInit).subscribe(_grid.onDragStart, handleDragStart).subscribe(_grid.onDrag, handleDrag).subscribe(_grid.onDragEnd, handleDragEnd);
	  }
	
	  function destroy() {
	    _handler.unsubscribeAll();
	  }
	
	  function handleDragInit(e, dd) {
	    // prevent the grid from cancelling drag'n'drop by default
	    e.stopImmediatePropagation();
	  }
	
	  function handleDragStart(jqueryEvent, interactEvent) {
	    var cell = _grid.getCellFromEvent(interactEvent.originalEvent);
	    if (_self.onBeforeCellRangeSelected.notify(cell) !== false) {
	      if (_grid.canCellBeSelected(cell.row, cell.cell)) {
	        _dragging = true;
	        // jqueryEvent.stopImmediatePropagation();
	      }
	    }
	    if (!_dragging) {
	      return;
	    }
	
	    _grid.focus();
	
	    var start = _grid.getCellFromPoint(interactEvent.x0 - (0, _jquery2.default)(_canvas).offset().left, interactEvent.y0 - (0, _jquery2.default)(_canvas).offset().top);
	
	    _range = {
	      start: start,
	      end: {}
	    };
	
	    return _decorator.show(new _slick2.default.Range(start.row, start.cell));
	  }
	
	  function handleDrag(e, interactEvent) {
	    if (!_dragging) {
	      return;
	    }
	    // e.stopImmediatePropagation();
	
	    var end = _grid.getCellFromPoint(interactEvent.pageX - (0, _jquery2.default)(_canvas).offset().left, interactEvent.pageY - (0, _jquery2.default)(_canvas).offset().top);
	
	    if (!_grid.canCellBeSelected(end.row, end.cell)) {
	      return;
	    }
	
	    _range.end = end;
	    _decorator.show(new _slick2.default.Range(_range.start.row, _range.start.cell, end.row, end.cell));
	  }
	
	  function handleDragEnd(e) {
	    if (!_dragging) {
	      return;
	    }
	
	    _dragging = false;
	    // e.stopImmediatePropagation();
	
	    _decorator.hide();
	    _self.onCellRangeSelected.notify({
	      range: new _slick2.default.Range(_range.start.row, _range.start.cell, _range.end.row, _range.end.cell)
	    });
	    _range = {};
	  }
	
	  Object.assign(this, {
	    init: init,
	    destroy: destroy,
	
	    onBeforeCellRangeSelected: new _slick2.default.Event(),
	    onCellRangeSelected: new _slick2.default.Event()
	  });
	}

/***/ }),

/***/ 54:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	/**
	 * interact.js v1.2.6
	 *
	 * Copyright (c) 2012-2015 Taye Adeyemi <dev@taye.me>
	 * Open source under the MIT License.
	 * https://raw.github.com/taye/interact.js/master/LICENSE
	 *
	 * This file has been monkey patched to pass the originalEvent on to drag events
	 */
	(function (realWindow) {
	  'use strict';
	
	  // return early if there's no window to work with (eg. Node.js)
	
	  if (!realWindow) {
	    return;
	  }
	
	  var // get wrapped window if using Shadow DOM polyfill
	  window = function () {
	    // create a TextNode
	    var el = realWindow.document.createTextNode('');
	
	    // check if it's wrapped by a polyfill
	    if (el.ownerDocument !== realWindow.document && typeof realWindow.wrap === 'function' && realWindow.wrap(el) === el) {
	      // return wrapped window
	      return realWindow.wrap(realWindow);
	    }
	
	    // no Shadow DOM polyfil or native implementation
	    return realWindow;
	  }(),
	      document = window.document,
	      DocumentFragment = window.DocumentFragment || blank,
	      SVGElement = window.SVGElement || blank,
	      SVGSVGElement = window.SVGSVGElement || blank,
	      SVGElementInstance = window.SVGElementInstance || blank,
	      HTMLElement = window.HTMLElement || window.Element,
	      PointerEvent = window.PointerEvent || window.MSPointerEvent,
	      pEventTypes,
	      hypot = Math.hypot || function (x, y) {
	    return Math.sqrt(x * x + y * y);
	  },
	      tmpXY = {},
	      // reduce object creation in getXY()
	
	  documents = [],
	      // all documents being listened to
	
	  interactables = [],
	      // all set interactables
	  interactions = [],
	      // all interactions
	
	  dynamicDrop = false,
	
	
	  // {
	  //      type: {
	  //          selectors: ['selector', ...],
	  //          contexts : [document, ...],
	  //          listeners: [[listener, useCapture], ...]
	  //      }
	  //  }
	  delegatedEvents = {},
	      defaultOptions = {
	    base: {
	      accept: null,
	      actionChecker: null,
	      styleCursor: true,
	      preventDefault: 'auto',
	      origin: { x: 0, y: 0 },
	      deltaSource: 'page',
	      allowFrom: null,
	      ignoreFrom: null,
	      _context: document,
	      dropChecker: null
	    },
	
	    drag: {
	      enabled: false,
	      manualStart: true,
	      max: Infinity,
	      maxPerElement: 1,
	
	      snap: null,
	      restrict: null,
	      inertia: null,
	      autoScroll: null,
	
	      axis: 'xy'
	    },
	
	    drop: {
	      enabled: false,
	      accept: null,
	      overlap: 'pointer'
	    },
	
	    resize: {
	      enabled: false,
	      manualStart: false,
	      max: Infinity,
	      maxPerElement: 1,
	
	      snap: null,
	      restrict: null,
	      inertia: null,
	      autoScroll: null,
	
	      square: false,
	      preserveAspectRatio: false,
	      axis: 'xy',
	
	      // use default margin
	      margin: NaN,
	
	      // object with props left, right, top, bottom which are
	      // true/false values to resize when the pointer is over that edge,
	      // CSS selectors to match the handles for each direction
	      // or the Elements for each handle
	      edges: null,
	
	      // a value of 'none' will limit the resize rect to a minimum of 0x0
	      // 'negate' will alow the rect to have negative width/height
	      // 'reposition' will keep the width/height positive by swapping
	      // the top and bottom edges and/or swapping the left and right edges
	      invert: 'none'
	    },
	
	    gesture: {
	      manualStart: false,
	      enabled: false,
	      max: Infinity,
	      maxPerElement: 1,
	
	      restrict: null
	    },
	
	    perAction: {
	      manualStart: false,
	      max: Infinity,
	      maxPerElement: 1,
	
	      snap: {
	        enabled: false,
	        endOnly: false,
	        range: Infinity,
	        targets: null,
	        offsets: null,
	
	        relativePoints: null
	      },
	
	      restrict: {
	        enabled: false,
	        endOnly: false
	      },
	
	      autoScroll: {
	        enabled: false,
	        container: null, // the item that is scrolled (Window or HTMLElement)
	        margin: 60,
	        speed: 300 // the scroll speed in pixels per second
	      },
	
	      inertia: {
	        enabled: false,
	        resistance: 10, // the lambda in exponential decay
	        minSpeed: 100, // target speed must be above this for inertia to start
	        endSpeed: 10, // the speed at which inertia is slow enough to stop
	        allowResume: true, // allow resuming an action in inertia phase
	        zeroResumeDelta: true, // if an action is resumed after launch, set dx/dy to 0
	        smoothEndDuration: 300 // animate to snap/restrict endOnly if there's no inertia
	      }
	    },
	
	    _holdDuration: 600
	  },
	
	
	  // Things related to autoScroll
	  autoScroll = {
	    interaction: null,
	    i: null, // the handle returned by window.setInterval
	    x: 0, y: 0, // Direction each pulse is to scroll in
	
	    // scroll the window by the values in scroll.x/y
	    scroll: function scroll() {
	      var options = autoScroll.interaction.target.options[autoScroll.interaction.prepared.name].autoScroll,
	          container = options.container || getWindow(autoScroll.interaction.element),
	          now = new Date().getTime(),
	
	      // change in time in seconds
	      dtx = (now - autoScroll.prevTimeX) / 1000,
	          dty = (now - autoScroll.prevTimeY) / 1000,
	          vx,
	          vy,
	          sx,
	          sy;
	
	      // displacement
	      if (options.velocity) {
	        vx = options.velocity.x;
	        vy = options.velocity.y;
	      } else {
	        vx = vy = options.speed;
	      }
	
	      sx = vx * dtx;
	      sy = vy * dty;
	
	      if (sx >= 1 || sy >= 1) {
	        if (isWindow(container)) {
	          container.scrollBy(autoScroll.x * sx, autoScroll.y * sy);
	        } else if (container) {
	          container.scrollLeft += autoScroll.x * sx;
	          container.scrollTop += autoScroll.y * sy;
	        }
	
	        if (sx >= 1) autoScroll.prevTimeX = now;
	        if (sy >= 1) autoScroll.prevTimeY = now;
	      }
	
	      if (autoScroll.isScrolling) {
	        cancelFrame(autoScroll.i);
	        autoScroll.i = reqFrame(autoScroll.scroll);
	      }
	    },
	
	    isScrolling: false,
	    prevTimeX: 0,
	    prevTimeY: 0,
	
	    start: function start(interaction) {
	      autoScroll.isScrolling = true;
	      cancelFrame(autoScroll.i);
	
	      autoScroll.interaction = interaction;
	      autoScroll.prevTimeX = new Date().getTime();
	      autoScroll.prevTimeY = new Date().getTime();
	      autoScroll.i = reqFrame(autoScroll.scroll);
	    },
	
	    stop: function stop() {
	      autoScroll.isScrolling = false;
	      cancelFrame(autoScroll.i);
	    }
	  },
	
	
	  // Does the browser support touch input?
	  supportsTouch = 'ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch,
	
	
	  // Does the browser support PointerEvents
	  supportsPointerEvent = PointerEvent && !/Chrome/.test(navigator.userAgent),
	
	
	  // Less Precision with touch input
	  margin = supportsTouch || supportsPointerEvent ? 20 : 10,
	      pointerMoveTolerance = 1,
	
	
	  // for ignoring browser's simulated mouse events
	  prevTouchTime = 0,
	
	
	  // Allow this many interactions to happen simultaneously
	  maxInteractions = Infinity,
	
	
	  // Check if is IE9 or older
	  actionCursors = document.all && !window.atob ? {
	    drag: 'move',
	    resizex: 'e-resize',
	    resizey: 's-resize',
	    resizexy: 'se-resize',
	
	    resizetop: 'n-resize',
	    resizeleft: 'w-resize',
	    resizebottom: 's-resize',
	    resizeright: 'e-resize',
	    resizetopleft: 'se-resize',
	    resizebottomright: 'se-resize',
	    resizetopright: 'ne-resize',
	    resizebottomleft: 'ne-resize',
	
	    gesture: ''
	  } : {
	    drag: 'move',
	    resizex: 'ew-resize',
	    resizey: 'ns-resize',
	    resizexy: 'nwse-resize',
	
	    resizetop: 'ns-resize',
	    resizeleft: 'ew-resize',
	    resizebottom: 'ns-resize',
	    resizeright: 'ew-resize',
	    resizetopleft: 'nwse-resize',
	    resizebottomright: 'nwse-resize',
	    resizetopright: 'nesw-resize',
	    resizebottomleft: 'nesw-resize',
	
	    gesture: ''
	  },
	      actionIsEnabled = {
	    drag: true,
	    resize: true,
	    gesture: true
	  },
	
	
	  // because Webkit and Opera still use 'mousewheel' event type
	  wheelEvent = 'onmousewheel' in document ? 'mousewheel' : 'wheel',
	      eventTypes = ['dragstart', 'dragmove', 'draginertiastart', 'dragend', 'dragenter', 'dragleave', 'dropactivate', 'dropdeactivate', 'dropmove', 'drop', 'resizestart', 'resizemove', 'resizeinertiastart', 'resizeend', 'gesturestart', 'gesturemove', 'gestureinertiastart', 'gestureend', 'down', 'move', 'up', 'cancel', 'tap', 'doubletap', 'hold'],
	      globalEvents = {},
	
	
	  // Opera Mobile must be handled differently
	  isOperaMobile = navigator.appName == 'Opera' && supportsTouch && navigator.userAgent.match('Presto'),
	
	
	  // scrolling doesn't change the result of getClientRects on iOS 7
	  isIOS7 = /iP(hone|od|ad)/.test(navigator.platform) && /OS 7[^\d]/.test(navigator.appVersion),
	
	
	  // prefix matchesSelector
	  prefixedMatchesSelector = 'matches' in Element.prototype ? 'matches' : 'webkitMatchesSelector' in Element.prototype ? 'webkitMatchesSelector' : 'mozMatchesSelector' in Element.prototype ? 'mozMatchesSelector' : 'oMatchesSelector' in Element.prototype ? 'oMatchesSelector' : 'msMatchesSelector',
	
	
	  // will be polyfill function if browser is IE8
	  ie8MatchesSelector,
	
	
	  // native requestAnimationFrame or polyfill
	  reqFrame = realWindow.requestAnimationFrame,
	      cancelFrame = realWindow.cancelAnimationFrame,
	
	
	  // Events wrapper
	  events = function () {
	    var useAttachEvent = 'attachEvent' in window && !('addEventListener' in window),
	        addEvent = useAttachEvent ? 'attachEvent' : 'addEventListener',
	        removeEvent = useAttachEvent ? 'detachEvent' : 'removeEventListener',
	        on = useAttachEvent ? 'on' : '',
	        elements = [],
	        targets = [],
	        attachedListeners = [];
	
	    function add(element, type, listener, useCapture) {
	      var elementIndex = indexOf(elements, element),
	          target = targets[elementIndex];
	
	      if (!target) {
	        target = {
	          events: {},
	          typeCount: 0
	        };
	
	        elementIndex = elements.push(element) - 1;
	        targets.push(target);
	
	        attachedListeners.push(useAttachEvent ? {
	          supplied: [],
	          wrapped: [],
	          useCount: []
	        } : null);
	      }
	
	      if (!target.events[type]) {
	        target.events[type] = [];
	        target.typeCount++;
	      }
	
	      if (!contains(target.events[type], listener)) {
	        var ret;
	
	        if (useAttachEvent) {
	          var listeners = attachedListeners[elementIndex],
	              listenerIndex = indexOf(listeners.supplied, listener);
	
	          var wrapped = listeners.wrapped[listenerIndex] || function (event) {
	            if (!event.immediatePropagationStopped) {
	              event.target = event.srcElement;
	              event.currentTarget = element;
	
	              event.preventDefault = event.preventDefault || preventDef;
	              event.stopPropagation = event.stopPropagation || stopProp;
	              event.stopImmediatePropagation = event.stopImmediatePropagation || stopImmProp;
	
	              if (/mouse|click/.test(event.type)) {
	                event.pageX = event.clientX + getWindow(element).document.documentElement.scrollLeft;
	                event.pageY = event.clientY + getWindow(element).document.documentElement.scrollTop;
	              }
	
	              listener(event);
	            }
	          };
	
	          ret = element[addEvent](on + type, wrapped, Boolean(useCapture));
	
	          if (listenerIndex === -1) {
	            listeners.supplied.push(listener);
	            listeners.wrapped.push(wrapped);
	            listeners.useCount.push(1);
	          } else {
	            listeners.useCount[listenerIndex]++;
	          }
	        } else {
	          ret = element[addEvent](type, listener, useCapture || false);
	        }
	        target.events[type].push(listener);
	
	        return ret;
	      }
	    }
	
	    function remove(element, type, listener, useCapture) {
	      var i,
	          elementIndex = indexOf(elements, element),
	          target = targets[elementIndex],
	          listeners,
	          listenerIndex,
	          wrapped = listener;
	
	      if (!target || !target.events) {
	        return;
	      }
	
	      if (useAttachEvent) {
	        listeners = attachedListeners[elementIndex];
	        listenerIndex = indexOf(listeners.supplied, listener);
	        wrapped = listeners.wrapped[listenerIndex];
	      }
	
	      if (type === 'all') {
	        for (type in target.events) {
	          if (target.events.hasOwnProperty(type)) {
	            remove(element, type, 'all');
	          }
	        }
	        return;
	      }
	
	      if (target.events[type]) {
	        var len = target.events[type].length;
	
	        if (listener === 'all') {
	          for (i = 0; i < len; i++) {
	            remove(element, type, target.events[type][i], Boolean(useCapture));
	          }
	          return;
	        } else {
	          for (i = 0; i < len; i++) {
	            if (target.events[type][i] === listener) {
	              element[removeEvent](on + type, wrapped, useCapture || false);
	              target.events[type].splice(i, 1);
	
	              if (useAttachEvent && listeners) {
	                listeners.useCount[listenerIndex]--;
	                if (listeners.useCount[listenerIndex] === 0) {
	                  listeners.supplied.splice(listenerIndex, 1);
	                  listeners.wrapped.splice(listenerIndex, 1);
	                  listeners.useCount.splice(listenerIndex, 1);
	                }
	              }
	
	              break;
	            }
	          }
	        }
	
	        if (target.events[type] && target.events[type].length === 0) {
	          target.events[type] = null;
	          target.typeCount--;
	        }
	      }
	
	      if (!target.typeCount) {
	        targets.splice(elementIndex, 1);
	        elements.splice(elementIndex, 1);
	        attachedListeners.splice(elementIndex, 1);
	      }
	    }
	
	    function preventDef() {
	      this.returnValue = false;
	    }
	
	    function stopProp() {
	      this.cancelBubble = true;
	    }
	
	    function stopImmProp() {
	      this.cancelBubble = true;
	      this.immediatePropagationStopped = true;
	    }
	
	    return {
	      add: add,
	      remove: remove,
	      useAttachEvent: useAttachEvent,
	
	      _elements: elements,
	      _targets: targets,
	      _attachedListeners: attachedListeners
	    };
	  }();
	
	  function blank() {}
	
	  function isElement(o) {
	    if (!o || (typeof o === 'undefined' ? 'undefined' : _typeof(o)) !== 'object') {
	      return false;
	    }
	
	    var _window = getWindow(o) || window;
	
	    return (/object|function/.test(_typeof(_window.Element)) ? o instanceof _window.Element // DOM2
	      : o.nodeType === 1 && typeof o.nodeName === 'string'
	    );
	  }
	  function isWindow(thing) {
	    return thing === window || !!(thing && thing.Window) && thing instanceof thing.Window;
	  }
	  function isDocFrag(thing) {
	    return !!thing && thing instanceof DocumentFragment;
	  }
	  function isArray(thing) {
	    return isObject(thing) && _typeof(thing.length) !== undefined && isFunction(thing.splice);
	  }
	  function isObject(thing) {
	    return !!thing && (typeof thing === 'undefined' ? 'undefined' : _typeof(thing)) === 'object';
	  }
	  function isFunction(thing) {
	    return typeof thing === 'function';
	  }
	  function isNumber(thing) {
	    return typeof thing === 'number';
	  }
	  function isBool(thing) {
	    return typeof thing === 'boolean';
	  }
	  function isString(thing) {
	    return typeof thing === 'string';
	  }
	
	  function trySelector(value) {
	    if (!isString(value)) {
	      return false;
	    }
	
	    // an exception will be raised if it is invalid
	    document.querySelector(value);
	    return true;
	  }
	
	  function extend(dest, source) {
	    for (var prop in source) {
	      dest[prop] = source[prop];
	    }
	    return dest;
	  }
	
	  var prefixedPropREs = {
	    webkit: /(Movement[XY]|Radius[XY]|RotationAngle|Force)$/
	  };
	
	  function pointerExtend(dest, source) {
	    for (var prop in source) {
	      var deprecated = false;
	
	      // skip deprecated prefixed properties
	      for (var vendor in prefixedPropREs) {
	        if (prop.indexOf(vendor) === 0 && prefixedPropREs[vendor].test(prop)) {
	          deprecated = true;
	          break;
	        }
	      }
	
	      if (!deprecated) {
	        dest[prop] = source[prop];
	      }
	    }
	    return dest;
	  }
	
	  function copyCoords(dest, src) {
	    dest.page = dest.page || {};
	    dest.page.x = src.page.x;
	    dest.page.y = src.page.y;
	
	    dest.client = dest.client || {};
	    dest.client.x = src.client.x;
	    dest.client.y = src.client.y;
	
	    dest.timeStamp = src.timeStamp;
	  }
	
	  function _setEventXY(targetObj, pointers, interaction) {
	    var pointer = pointers.length > 1 ? pointerAverage(pointers) : pointers[0];
	
	    _getPageXY(pointer, tmpXY, interaction);
	    targetObj.page.x = tmpXY.x;
	    targetObj.page.y = tmpXY.y;
	
	    _getClientXY(pointer, tmpXY, interaction);
	    targetObj.client.x = tmpXY.x;
	    targetObj.client.y = tmpXY.y;
	
	    targetObj.timeStamp = new Date().getTime();
	  }
	
	  function setEventDeltas(targetObj, prev, cur) {
	    targetObj.page.x = cur.page.x - prev.page.x;
	    targetObj.page.y = cur.page.y - prev.page.y;
	    targetObj.client.x = cur.client.x - prev.client.x;
	    targetObj.client.y = cur.client.y - prev.client.y;
	    targetObj.timeStamp = new Date().getTime() - prev.timeStamp;
	
	    // set pointer velocity
	    var dt = Math.max(targetObj.timeStamp / 1000, 0.001);
	    targetObj.page.speed = hypot(targetObj.page.x, targetObj.page.y) / dt;
	    targetObj.page.vx = targetObj.page.x / dt;
	    targetObj.page.vy = targetObj.page.y / dt;
	
	    targetObj.client.speed = hypot(targetObj.client.x, targetObj.page.y) / dt;
	    targetObj.client.vx = targetObj.client.x / dt;
	    targetObj.client.vy = targetObj.client.y / dt;
	  }
	
	  function isNativePointer(pointer) {
	    return pointer instanceof window.Event || supportsTouch && window.Touch && pointer instanceof window.Touch;
	  }
	
	  // Get specified X/Y coords for mouse or event.touches[0]
	  function getXY(type, pointer, xy) {
	    xy = xy || {};
	    type = type || 'page';
	
	    xy.x = pointer[type + 'X'];
	    xy.y = pointer[type + 'Y'];
	
	    return xy;
	  }
	
	  function _getPageXY(pointer, page) {
	    page = page || {};
	
	    // Opera Mobile handles the viewport and scrolling oddly
	    if (isOperaMobile && isNativePointer(pointer)) {
	      getXY('screen', pointer, page);
	
	      page.x += window.scrollX;
	      page.y += window.scrollY;
	    } else {
	      getXY('page', pointer, page);
	    }
	
	    return page;
	  }
	
	  function _getClientXY(pointer, client) {
	    client = client || {};
	
	    if (isOperaMobile && isNativePointer(pointer)) {
	      // Opera Mobile handles the viewport and scrolling oddly
	      getXY('screen', pointer, client);
	    } else {
	      getXY('client', pointer, client);
	    }
	
	    return client;
	  }
	
	  function getScrollXY(win) {
	    win = win || window;
	    return {
	      x: win.scrollX || win.document.documentElement.scrollLeft,
	      y: win.scrollY || win.document.documentElement.scrollTop
	    };
	  }
	
	  function getPointerId(pointer) {
	    return isNumber(pointer.pointerId) ? pointer.pointerId : pointer.identifier;
	  }
	
	  function getActualElement(element) {
	    return element instanceof SVGElementInstance ? element.correspondingUseElement : element;
	  }
	
	  function getWindow(node) {
	    if (isWindow(node)) {
	      return node;
	    }
	
	    var rootNode = node.ownerDocument || node;
	
	    return rootNode.defaultView || rootNode.parentWindow || window;
	  }
	
	  function getElementClientRect(element) {
	    var clientRect = element instanceof SVGElement ? element.getBoundingClientRect() : element.getClientRects()[0];
	
	    return clientRect && {
	      left: clientRect.left,
	      right: clientRect.right,
	      top: clientRect.top,
	      bottom: clientRect.bottom,
	      width: clientRect.width || clientRect.right - clientRect.left,
	      height: clientRect.height || clientRect.bottom - clientRect.top
	    };
	  }
	
	  function getElementRect(element) {
	    var clientRect = getElementClientRect(element);
	
	    if (!isIOS7 && clientRect) {
	      var scroll = getScrollXY(getWindow(element));
	
	      clientRect.left += scroll.x;
	      clientRect.right += scroll.x;
	      clientRect.top += scroll.y;
	      clientRect.bottom += scroll.y;
	    }
	
	    return clientRect;
	  }
	
	  function getTouchPair(event) {
	    var touches = [];
	
	    // array of touches is supplied
	    if (isArray(event)) {
	      touches[0] = event[0];
	      touches[1] = event[1];
	    }
	    // an event
	    else {
	        if (event.type === 'touchend') {
	          if (event.touches.length === 1) {
	            touches[0] = event.touches[0];
	            touches[1] = event.changedTouches[0];
	          } else if (event.touches.length === 0) {
	            touches[0] = event.changedTouches[0];
	            touches[1] = event.changedTouches[1];
	          }
	        } else {
	          touches[0] = event.touches[0];
	          touches[1] = event.touches[1];
	        }
	      }
	
	    return touches;
	  }
	
	  function pointerAverage(pointers) {
	    var average = {
	      pageX: 0,
	      pageY: 0,
	      clientX: 0,
	      clientY: 0,
	      screenX: 0,
	      screenY: 0
	    };
	    var prop;
	
	    for (var i = 0; i < pointers.length; i++) {
	      for (prop in average) {
	        average[prop] += pointers[i][prop];
	      }
	    }
	    for (prop in average) {
	      average[prop] /= pointers.length;
	    }
	
	    return average;
	  }
	
	  function touchBBox(event) {
	    if (!event.length && !(event.touches && event.touches.length > 1)) {
	      return;
	    }
	
	    var touches = getTouchPair(event),
	        minX = Math.min(touches[0].pageX, touches[1].pageX),
	        minY = Math.min(touches[0].pageY, touches[1].pageY),
	        maxX = Math.max(touches[0].pageX, touches[1].pageX),
	        maxY = Math.max(touches[0].pageY, touches[1].pageY);
	
	    return {
	      x: minX,
	      y: minY,
	      left: minX,
	      top: minY,
	      width: maxX - minX,
	      height: maxY - minY
	    };
	  }
	
	  function touchDistance(event, deltaSource) {
	    deltaSource = deltaSource || defaultOptions.deltaSource;
	
	    var sourceX = deltaSource + 'X',
	        sourceY = deltaSource + 'Y',
	        touches = getTouchPair(event);
	
	    var dx = touches[0][sourceX] - touches[1][sourceX],
	        dy = touches[0][sourceY] - touches[1][sourceY];
	
	    return hypot(dx, dy);
	  }
	
	  function touchAngle(event, prevAngle, deltaSource) {
	    deltaSource = deltaSource || defaultOptions.deltaSource;
	
	    var sourceX = deltaSource + 'X',
	        sourceY = deltaSource + 'Y',
	        touches = getTouchPair(event),
	        dx = touches[0][sourceX] - touches[1][sourceX],
	        dy = touches[0][sourceY] - touches[1][sourceY],
	        angle = 180 * Math.atan(dy / dx) / Math.PI;
	
	    if (isNumber(prevAngle)) {
	      var dr = angle - prevAngle,
	          drClamped = dr % 360;
	
	      if (drClamped > 315) {
	        angle -= 360 + angle / 360 | 0 * 360;
	      } else if (drClamped > 135) {
	        angle -= 180 + angle / 360 | 0 * 360;
	      } else if (drClamped < -315) {
	        angle += 360 + angle / 360 | 0 * 360;
	      } else if (drClamped < -135) {
	        angle += 180 + angle / 360 | 0 * 360;
	      }
	    }
	
	    return angle;
	  }
	
	  function getOriginXY(interactable, element) {
	    var origin = interactable ? interactable.options.origin : defaultOptions.origin;
	
	    if (origin === 'parent') {
	      origin = parentElement(element);
	    } else if (origin === 'self') {
	      origin = interactable.getRect(element);
	    } else if (trySelector(origin)) {
	      origin = closest(element, origin) || { x: 0, y: 0 };
	    }
	
	    if (isFunction(origin)) {
	      origin = origin(interactable && element);
	    }
	
	    if (isElement(origin)) {
	      origin = getElementRect(origin);
	    }
	
	    origin.x = 'x' in origin ? origin.x : origin.left;
	    origin.y = 'y' in origin ? origin.y : origin.top;
	
	    return origin;
	  }
	
	  // http://stackoverflow.com/a/5634528/2280888
	  function _getQBezierValue(t, p1, p2, p3) {
	    var iT = 1 - t;
	    return iT * iT * p1 + 2 * iT * t * p2 + t * t * p3;
	  }
	
	  function getQuadraticCurvePoint(startX, startY, cpX, cpY, endX, endY, position) {
	    return {
	      x: _getQBezierValue(position, startX, cpX, endX),
	      y: _getQBezierValue(position, startY, cpY, endY)
	    };
	  }
	
	  // http://gizma.com/easing/
	  function easeOutQuad(t, b, c, d) {
	    t /= d;
	    return -c * t * (t - 2) + b;
	  }
	
	  function nodeContains(parent, child) {
	    while (child) {
	      if (child === parent) {
	        return true;
	      }
	
	      child = child.parentNode;
	    }
	
	    return false;
	  }
	
	  function closest(child, selector) {
	    var parent = parentElement(child);
	
	    while (isElement(parent)) {
	      if (matchesSelector(parent, selector)) {
	        return parent;
	      }
	
	      parent = parentElement(parent);
	    }
	
	    return null;
	  }
	
	  function parentElement(node) {
	    var parent = node.parentNode;
	
	    if (isDocFrag(parent)) {
	      // skip past #shado-root fragments
	      while ((parent = parent.host) && isDocFrag(parent)) {}
	
	      return parent;
	    }
	
	    return parent;
	  }
	
	  function inContext(interactable, element) {
	    return interactable._context === element.ownerDocument || nodeContains(interactable._context, element);
	  }
	
	  function testIgnore(interactable, interactableElement, element) {
	    var ignoreFrom = interactable.options.ignoreFrom;
	
	    if (!ignoreFrom || !isElement(element)) {
	      return false;
	    }
	
	    if (isString(ignoreFrom)) {
	      return matchesUpTo(element, ignoreFrom, interactableElement);
	    } else if (isElement(ignoreFrom)) {
	      return nodeContains(ignoreFrom, element);
	    }
	
	    return false;
	  }
	
	  function testAllow(interactable, interactableElement, element) {
	    var allowFrom = interactable.options.allowFrom;
	
	    if (!allowFrom) {
	      return true;
	    }
	
	    if (!isElement(element)) {
	      return false;
	    }
	
	    if (isString(allowFrom)) {
	      return matchesUpTo(element, allowFrom, interactableElement);
	    } else if (isElement(allowFrom)) {
	      return nodeContains(allowFrom, element);
	    }
	
	    return false;
	  }
	
	  function checkAxis(axis, interactable) {
	    if (!interactable) {
	      return false;
	    }
	
	    var thisAxis = interactable.options.drag.axis;
	
	    return axis === 'xy' || thisAxis === 'xy' || thisAxis === axis;
	  }
	
	  function checkSnap(interactable, action) {
	    var options = interactable.options;
	
	    if (/^resize/.test(action)) {
	      action = 'resize';
	    }
	
	    return options[action].snap && options[action].snap.enabled;
	  }
	
	  function checkRestrict(interactable, action) {
	    var options = interactable.options;
	
	    if (/^resize/.test(action)) {
	      action = 'resize';
	    }
	
	    return options[action].restrict && options[action].restrict.enabled;
	  }
	
	  function checkAutoScroll(interactable, action) {
	    var options = interactable.options;
	
	    if (/^resize/.test(action)) {
	      action = 'resize';
	    }
	
	    return options[action].autoScroll && options[action].autoScroll.enabled;
	  }
	
	  function withinInteractionLimit(interactable, element, action) {
	    var options = interactable.options,
	        maxActions = options[action.name].max,
	        maxPerElement = options[action.name].maxPerElement,
	        activeInteractions = 0,
	        targetCount = 0,
	        targetElementCount = 0;
	
	    for (var i = 0, len = interactions.length; i < len; i++) {
	      var interaction = interactions[i],
	          otherAction = interaction.prepared.name,
	          active = interaction.interacting();
	
	      if (!active) {
	        continue;
	      }
	
	      activeInteractions++;
	
	      if (activeInteractions >= maxInteractions) {
	        return false;
	      }
	
	      if (interaction.target !== interactable) {
	        continue;
	      }
	
	      targetCount += otherAction === action.name | 0;
	
	      if (targetCount >= maxActions) {
	        return false;
	      }
	
	      if (interaction.element === element) {
	        targetElementCount++;
	
	        if (otherAction !== action.name || targetElementCount >= maxPerElement) {
	          return false;
	        }
	      }
	    }
	
	    return maxInteractions > 0;
	  }
	
	  // Test for the element that's "above" all other qualifiers
	  function indexOfDeepestElement(elements) {
	    var dropzone,
	        deepestZone = elements[0],
	        index = deepestZone ? 0 : -1,
	        parent,
	        deepestZoneParents = [],
	        dropzoneParents = [],
	        child,
	        i,
	        n;
	
	    for (i = 1; i < elements.length; i++) {
	      dropzone = elements[i];
	
	      // an element might belong to multiple selector dropzones
	      if (!dropzone || dropzone === deepestZone) {
	        continue;
	      }
	
	      if (!deepestZone) {
	        deepestZone = dropzone;
	        index = i;
	        continue;
	      }
	
	      // check if the deepest or current are document.documentElement or document.rootElement
	      // - if the current dropzone is, do nothing and continue
	      if (dropzone.parentNode === dropzone.ownerDocument) {
	        continue;
	      }
	      // - if deepest is, update with the current dropzone and continue to next
	      else if (deepestZone.parentNode === dropzone.ownerDocument) {
	          deepestZone = dropzone;
	          index = i;
	          continue;
	        }
	
	      if (!deepestZoneParents.length) {
	        parent = deepestZone;
	        while (parent.parentNode && parent.parentNode !== parent.ownerDocument) {
	          deepestZoneParents.unshift(parent);
	          parent = parent.parentNode;
	        }
	      }
	
	      // if this element is an svg element and the current deepest is
	      // an HTMLElement
	      if (deepestZone instanceof HTMLElement && dropzone instanceof SVGElement && !(dropzone instanceof SVGSVGElement)) {
	        if (dropzone === deepestZone.parentNode) {
	          continue;
	        }
	
	        parent = dropzone.ownerSVGElement;
	      } else {
	        parent = dropzone;
	      }
	
	      dropzoneParents = [];
	
	      while (parent.parentNode !== parent.ownerDocument) {
	        dropzoneParents.unshift(parent);
	        parent = parent.parentNode;
	      }
	
	      n = 0;
	
	      // get (position of last common ancestor) + 1
	      while (dropzoneParents[n] && dropzoneParents[n] === deepestZoneParents[n]) {
	        n++;
	      }
	
	      var parents = [dropzoneParents[n - 1], dropzoneParents[n], deepestZoneParents[n]];
	
	      child = parents[0].lastChild;
	
	      while (child) {
	        if (child === parents[1]) {
	          deepestZone = dropzone;
	          index = i;
	          deepestZoneParents = [];
	
	          break;
	        } else if (child === parents[2]) {
	          break;
	        }
	
	        child = child.previousSibling;
	      }
	    }
	
	    return index;
	  }
	
	  function Interaction() {
	    this.target = null; // current interactable being interacted with
	    this.element = null; // the target element of the interactable
	    this.dropTarget = null; // the dropzone a drag target might be dropped into
	    this.dropElement = null; // the element at the time of checking
	    this.prevDropTarget = null; // the dropzone that was recently dragged away from
	    this.prevDropElement = null; // the element at the time of checking
	
	    this.prepared = { // action that's ready to be fired on next move event
	      name: null,
	      axis: null,
	      edges: null
	    };
	
	    this.matches = []; // all selectors that are matched by target element
	    this.matchElements = []; // corresponding elements
	
	    this.inertiaStatus = {
	      active: false,
	      smoothEnd: false,
	      ending: false,
	
	      startEvent: null,
	      upCoords: {},
	
	      xe: 0, ye: 0,
	      sx: 0, sy: 0,
	
	      t0: 0,
	      vx0: 0, vys: 0,
	      duration: 0,
	
	      resumeDx: 0,
	      resumeDy: 0,
	
	      lambda_v0: 0,
	      one_ve_v0: 0,
	      i: null
	    };
	
	    if (isFunction(Function.prototype.bind)) {
	      this.boundInertiaFrame = this.inertiaFrame.bind(this);
	      this.boundSmoothEndFrame = this.smoothEndFrame.bind(this);
	    } else {
	      var that = this;
	
	      this.boundInertiaFrame = function () {
	        return that.inertiaFrame();
	      };
	      this.boundSmoothEndFrame = function () {
	        return that.smoothEndFrame();
	      };
	    }
	
	    this.activeDrops = {
	      dropzones: [], // the dropzones that are mentioned below
	      elements: [], // elements of dropzones that accept the target draggable
	      rects: [] // the rects of the elements mentioned above
	    };
	
	    // keep track of added pointers
	    this.pointers = [];
	    this.pointerIds = [];
	    this.downTargets = [];
	    this.downTimes = [];
	    this.holdTimers = [];
	
	    // Previous native pointer move event coordinates
	    this.prevCoords = {
	      page: { x: 0, y: 0 },
	      client: { x: 0, y: 0 },
	      timeStamp: 0
	    };
	    // current native pointer move event coordinates
	    this.curCoords = {
	      page: { x: 0, y: 0 },
	      client: { x: 0, y: 0 },
	      timeStamp: 0
	    };
	
	    // Starting InteractEvent pointer coordinates
	    this.startCoords = {
	      page: { x: 0, y: 0 },
	      client: { x: 0, y: 0 },
	      timeStamp: 0
	    };
	
	    // Change in coordinates and time of the pointer
	    this.pointerDelta = {
	      page: { x: 0, y: 0, vx: 0, vy: 0, speed: 0 },
	      client: { x: 0, y: 0, vx: 0, vy: 0, speed: 0 },
	      timeStamp: 0
	    };
	
	    this.downEvent = null; // pointerdown/mousedown/touchstart event
	    this.downPointer = {};
	
	    this._eventTarget = null;
	    this._curEventTarget = null;
	
	    this.prevEvent = null; // previous action event
	    this.tapTime = 0; // time of the most recent tap event
	    this.prevTap = null;
	
	    this.startOffset = { left: 0, right: 0, top: 0, bottom: 0 };
	    this.restrictOffset = { left: 0, right: 0, top: 0, bottom: 0 };
	    this.snapOffsets = [];
	
	    this.gesture = {
	      start: { x: 0, y: 0 },
	
	      startDistance: 0, // distance between two touches of touchStart
	      prevDistance: 0,
	      distance: 0,
	
	      scale: 1, // gesture.distance / gesture.startDistance
	
	      startAngle: 0, // angle of line joining two touches
	      prevAngle: 0 // angle of the previous gesture event
	    };
	
	    this.snapStatus = {
	      x: 0, y: 0,
	      dx: 0, dy: 0,
	      realX: 0, realY: 0,
	      snappedX: 0, snappedY: 0,
	      targets: [],
	      locked: false,
	      changed: false
	    };
	
	    this.restrictStatus = {
	      dx: 0, dy: 0,
	      restrictedX: 0, restrictedY: 0,
	      snap: null,
	      restricted: false,
	      changed: false
	    };
	
	    this.restrictStatus.snap = this.snapStatus;
	
	    this.pointerIsDown = false;
	    this.pointerWasMoved = false;
	    this.gesturing = false;
	    this.dragging = false;
	    this.resizing = false;
	    this.resizeAxes = 'xy';
	
	    this.mouse = false;
	
	    interactions.push(this);
	  }
	
	  Interaction.prototype = {
	    getPageXY: function getPageXY(pointer, xy) {
	      return _getPageXY(pointer, xy, this);
	    },
	    getClientXY: function getClientXY(pointer, xy) {
	      return _getClientXY(pointer, xy, this);
	    },
	    setEventXY: function setEventXY(target, ptr) {
	      return _setEventXY(target, ptr, this);
	    },
	
	    pointerOver: function pointerOver(pointer, event, eventTarget) {
	      if (this.prepared.name || !this.mouse) {
	        return;
	      }
	
	      var curMatches = [],
	          curMatchElements = [],
	          prevTargetElement = this.element;
	
	      this.addPointer(pointer);
	
	      if (this.target && (testIgnore(this.target, this.element, eventTarget) || !testAllow(this.target, this.element, eventTarget))) {
	        // if the eventTarget should be ignored or shouldn't be allowed
	        // clear the previous target
	        this.target = null;
	        this.element = null;
	        this.matches = [];
	        this.matchElements = [];
	      }
	
	      var elementInteractable = interactables.get(eventTarget),
	          elementAction = elementInteractable && !testIgnore(elementInteractable, eventTarget, eventTarget) && testAllow(elementInteractable, eventTarget, eventTarget) && validateAction(elementInteractable.getAction(pointer, event, this, eventTarget), elementInteractable);
	
	      if (elementAction && !withinInteractionLimit(elementInteractable, eventTarget, elementAction)) {
	        elementAction = null;
	      }
	
	      function pushCurMatches(interactable, selector) {
	        if (interactable && inContext(interactable, eventTarget) && !testIgnore(interactable, eventTarget, eventTarget) && testAllow(interactable, eventTarget, eventTarget) && matchesSelector(eventTarget, selector)) {
	          curMatches.push(interactable);
	          curMatchElements.push(eventTarget);
	        }
	      }
	
	      if (elementAction) {
	        this.target = elementInteractable;
	        this.element = eventTarget;
	        this.matches = [];
	        this.matchElements = [];
	      } else {
	        interactables.forEachSelector(pushCurMatches);
	
	        if (this.validateSelector(pointer, event, curMatches, curMatchElements)) {
	          this.matches = curMatches;
	          this.matchElements = curMatchElements;
	
	          this.pointerHover(pointer, event, this.matches, this.matchElements);
	          events.add(eventTarget, supportsPointerEvent ? pEventTypes.move : 'mousemove', listeners.pointerHover);
	        } else if (this.target) {
	          if (nodeContains(prevTargetElement, eventTarget)) {
	            this.pointerHover(pointer, event, this.matches, this.matchElements);
	            events.add(this.element, supportsPointerEvent ? pEventTypes.move : 'mousemove', listeners.pointerHover);
	          } else {
	            this.target = null;
	            this.element = null;
	            this.matches = [];
	            this.matchElements = [];
	          }
	        }
	      }
	    },
	
	    // Check what action would be performed on pointerMove target if a mouse
	    // button were pressed and change the cursor accordingly
	    pointerHover: function pointerHover(pointer, event, eventTarget, curEventTarget, matches, matchElements) {
	      var target = this.target;
	
	      if (!this.prepared.name && this.mouse) {
	        var action;
	
	        // update pointer coords for defaultActionChecker to use
	        this.setEventXY(this.curCoords, [pointer]);
	
	        if (matches) {
	          action = this.validateSelector(pointer, event, matches, matchElements);
	        } else if (target) {
	          action = validateAction(target.getAction(this.pointers[0], event, this, this.element), this.target);
	        }
	
	        if (target && target.options.styleCursor) {
	          if (action) {
	            target._doc.documentElement.style.cursor = getActionCursor(action);
	          } else {
	            target._doc.documentElement.style.cursor = '';
	          }
	        }
	      } else if (this.prepared.name) {
	        this.checkAndPreventDefault(event, target, this.element);
	      }
	    },
	
	    pointerOut: function pointerOut(pointer, event, eventTarget) {
	      if (this.prepared.name) {
	        return;
	      }
	
	      // Remove temporary event listeners for selector Interactables
	      if (!interactables.get(eventTarget)) {
	        events.remove(eventTarget, supportsPointerEvent ? pEventTypes.move : 'mousemove', listeners.pointerHover);
	      }
	
	      if (this.target && this.target.options.styleCursor && !this.interacting()) {
	        this.target._doc.documentElement.style.cursor = '';
	      }
	    },
	
	    selectorDown: function selectorDown(pointer, event, eventTarget, curEventTarget) {
	      var that = this,
	
	      // copy event to be used in timeout for IE8
	      eventCopy = events.useAttachEvent ? extend({}, event) : event,
	          element = eventTarget,
	          pointerIndex = this.addPointer(pointer),
	          action;
	
	      this.holdTimers[pointerIndex] = setTimeout(function () {
	        that.pointerHold(events.useAttachEvent ? eventCopy : pointer, eventCopy, eventTarget, curEventTarget);
	      }, defaultOptions._holdDuration);
	
	      this.pointerIsDown = true;
	
	      // Check if the down event hits the current inertia target
	      if (this.inertiaStatus.active && this.target.selector) {
	        // climb up the DOM tree from the event target
	        while (isElement(element)) {
	          // if this element is the current inertia target element
	          if (element === this.element
	          // and the prospective action is the same as the ongoing one
	          && validateAction(this.target.getAction(pointer, event, this, this.element), this.target).name === this.prepared.name) {
	            // stop inertia so that the next move will be a normal one
	            cancelFrame(this.inertiaStatus.i);
	            this.inertiaStatus.active = false;
	
	            this.collectEventTargets(pointer, event, eventTarget, 'down');
	            return;
	          }
	          element = parentElement(element);
	        }
	      }
	
	      // do nothing if interacting
	      if (this.interacting()) {
	        this.collectEventTargets(pointer, event, eventTarget, 'down');
	        return;
	      }
	
	      function pushMatches(interactable, selector, context) {
	        var elements = ie8MatchesSelector ? context.querySelectorAll(selector) : undefined;
	
	        if (inContext(interactable, element) && !testIgnore(interactable, element, eventTarget) && testAllow(interactable, element, eventTarget) && matchesSelector(element, selector, elements)) {
	          that.matches.push(interactable);
	          that.matchElements.push(element);
	        }
	      }
	
	      // update pointer coords for defaultActionChecker to use
	      this.setEventXY(this.curCoords, [pointer]);
	      this.downEvent = event;
	
	      while (isElement(element) && !action) {
	        this.matches = [];
	        this.matchElements = [];
	
	        interactables.forEachSelector(pushMatches);
	
	        action = this.validateSelector(pointer, event, this.matches, this.matchElements);
	        element = parentElement(element);
	      }
	
	      if (action) {
	        this.prepared.name = action.name;
	        this.prepared.axis = action.axis;
	        this.prepared.edges = action.edges;
	
	        this.collectEventTargets(pointer, event, eventTarget, 'down');
	
	        return this.pointerDown(pointer, event, eventTarget, curEventTarget, action);
	      } else {
	        // do these now since pointerDown isn't being called from here
	        this.downTimes[pointerIndex] = new Date().getTime();
	        this.downTargets[pointerIndex] = eventTarget;
	        pointerExtend(this.downPointer, pointer);
	
	        copyCoords(this.prevCoords, this.curCoords);
	        this.pointerWasMoved = false;
	      }
	
	      this.collectEventTargets(pointer, event, eventTarget, 'down');
	    },
	
	    // Determine action to be performed on next pointerMove and add appropriate
	    // style and event Listeners
	    pointerDown: function pointerDown(pointer, event, eventTarget, curEventTarget, forceAction) {
	      if (!forceAction && !this.inertiaStatus.active && this.pointerWasMoved && this.prepared.name) {
	        this.checkAndPreventDefault(event, this.target, this.element);
	
	        return;
	      }
	
	      this.pointerIsDown = true;
	      this.downEvent = event;
	
	      var pointerIndex = this.addPointer(pointer),
	          action;
	
	      // If it is the second touch of a multi-touch gesture, keep the
	      // target the same and get a new action if a target was set by the
	      // first touch
	      if (this.pointerIds.length > 1 && this.target._element === this.element) {
	        var newAction = validateAction(forceAction || this.target.getAction(pointer, event, this, this.element), this.target);
	
	        if (withinInteractionLimit(this.target, this.element, newAction)) {
	          action = newAction;
	        }
	
	        this.prepared.name = null;
	      }
	      // Otherwise, set the target if there is no action prepared
	      else if (!this.prepared.name) {
	          var interactable = interactables.get(curEventTarget);
	
	          if (interactable && !testIgnore(interactable, curEventTarget, eventTarget) && testAllow(interactable, curEventTarget, eventTarget) && (action = validateAction(forceAction || interactable.getAction(pointer, event, this, curEventTarget), interactable, eventTarget)) && withinInteractionLimit(interactable, curEventTarget, action)) {
	            this.target = interactable;
	            this.element = curEventTarget;
	          }
	        }
	
	      var target = this.target,
	          options = target && target.options;
	
	      if (target && (forceAction || !this.prepared.name)) {
	        action = action || validateAction(forceAction || target.getAction(pointer, event, this, curEventTarget), target, this.element);
	
	        this.setEventXY(this.startCoords, this.pointers);
	
	        if (!action) {
	          return;
	        }
	
	        if (options.styleCursor) {
	          target._doc.documentElement.style.cursor = getActionCursor(action);
	        }
	
	        this.resizeAxes = action.name === 'resize' ? action.axis : null;
	
	        if (action === 'gesture' && this.pointerIds.length < 2) {
	          action = null;
	        }
	
	        this.prepared.name = action.name;
	        this.prepared.axis = action.axis;
	        this.prepared.edges = action.edges;
	
	        this.snapStatus.snappedX = this.snapStatus.snappedY = this.restrictStatus.restrictedX = this.restrictStatus.restrictedY = NaN;
	
	        this.downTimes[pointerIndex] = new Date().getTime();
	        this.downTargets[pointerIndex] = eventTarget;
	        pointerExtend(this.downPointer, pointer);
	
	        copyCoords(this.prevCoords, this.startCoords);
	        this.pointerWasMoved = false;
	
	        this.checkAndPreventDefault(event, target, this.element);
	      }
	      // if inertia is active try to resume action
	      else if (this.inertiaStatus.active && curEventTarget === this.element && validateAction(target.getAction(pointer, event, this, this.element), target).name === this.prepared.name) {
	          cancelFrame(this.inertiaStatus.i);
	          this.inertiaStatus.active = false;
	
	          this.checkAndPreventDefault(event, target, this.element);
	        }
	    },
	
	    setModifications: function setModifications(coords, preEnd) {
	      var target = this.target,
	          shouldMove = true,
	          shouldSnap = checkSnap(target, this.prepared.name) && (!target.options[this.prepared.name].snap.endOnly || preEnd),
	          shouldRestrict = checkRestrict(target, this.prepared.name) && (!target.options[this.prepared.name].restrict.endOnly || preEnd);
	
	      if (shouldSnap) {
	        this.setSnapping(coords);
	      } else {
	        this.snapStatus.locked = false;
	      }
	      if (shouldRestrict) {
	        this.setRestriction(coords);
	      } else {
	        this.restrictStatus.restricted = false;
	      }
	
	      if (shouldSnap && this.snapStatus.locked && !this.snapStatus.changed) {
	        shouldMove = shouldRestrict && this.restrictStatus.restricted && this.restrictStatus.changed;
	      } else if (shouldRestrict && this.restrictStatus.restricted && !this.restrictStatus.changed) {
	        shouldMove = false;
	      }
	
	      return shouldMove;
	    },
	
	    setStartOffsets: function setStartOffsets(action, interactable, element) {
	      var rect = interactable.getRect(element),
	          origin = getOriginXY(interactable, element),
	          snap = interactable.options[this.prepared.name].snap,
	          restrict = interactable.options[this.prepared.name].restrict,
	          width,
	          height;
	
	      if (rect) {
	        this.startOffset.left = this.startCoords.page.x - rect.left;
	        this.startOffset.top = this.startCoords.page.y - rect.top;
	
	        this.startOffset.right = rect.right - this.startCoords.page.x;
	        this.startOffset.bottom = rect.bottom - this.startCoords.page.y;
	
	        if ('width' in rect) {
	          width = rect.width;
	        } else {
	          width = rect.right - rect.left;
	        }
	        if ('height' in rect) {
	          height = rect.height;
	        } else {
	          height = rect.bottom - rect.top;
	        }
	      } else {
	        this.startOffset.left = this.startOffset.top = this.startOffset.right = this.startOffset.bottom = 0;
	      }
	
	      this.snapOffsets.splice(0);
	
	      var snapOffset = snap && snap.offset === 'startCoords' ? {
	        x: this.startCoords.page.x - origin.x,
	        y: this.startCoords.page.y - origin.y
	      } : snap && snap.offset || { x: 0, y: 0 };
	
	      if (rect && snap && snap.relativePoints && snap.relativePoints.length) {
	        for (var i = 0; i < snap.relativePoints.length; i++) {
	          this.snapOffsets.push({
	            x: this.startOffset.left - width * snap.relativePoints[i].x + snapOffset.x,
	            y: this.startOffset.top - height * snap.relativePoints[i].y + snapOffset.y
	          });
	        }
	      } else {
	        this.snapOffsets.push(snapOffset);
	      }
	
	      if (rect && restrict.elementRect) {
	        this.restrictOffset.left = this.startOffset.left - width * restrict.elementRect.left;
	        this.restrictOffset.top = this.startOffset.top - height * restrict.elementRect.top;
	
	        this.restrictOffset.right = this.startOffset.right - width * (1 - restrict.elementRect.right);
	        this.restrictOffset.bottom = this.startOffset.bottom - height * (1 - restrict.elementRect.bottom);
	      } else {
	        this.restrictOffset.left = this.restrictOffset.top = this.restrictOffset.right = this.restrictOffset.bottom = 0;
	      }
	    },
	
	    /* \
	     * Interaction.start
	     [ method ]
	     *
	     * Start an action with the given Interactable and Element as tartgets. The
	     * action must be enabled for the target Interactable and an appropriate number
	     * of pointers must be held down – 1 for drag/resize, 2 for gesture.
	     *
	     * Use it with `interactable.<action>able({ manualStart: false })` to always
	     * [start actions manually](https://github.com/taye/interact.js/issues/114)
	     *
	     - action       (object)  The action to be performed - drag, resize, etc.
	     - interactable (Interactable) The Interactable to target
	     - element      (Element) The DOM Element to target
	     = (object) interact
	     **
	     | interact(target)
	     |   .draggable({
	     |     // disable the default drag start by down->move
	     |     manualStart: true
	     |   })
	     |   // start dragging after the user holds the pointer down
	     |   .on('hold', function (event) {
	     |     var interaction = event.interaction;
	     |
	     |     if (!interaction.interacting()) {
	     |       interaction.start({ name: 'drag' },
	     |                         event.interactable,
	     |                         event.currentTarget);
	     |     }
	     | });
	    \*/
	    start: function start(action, interactable, element) {
	      if (this.interacting() || !this.pointerIsDown || this.pointerIds.length < (action.name === 'gesture' ? 2 : 1)) {
	        return;
	      }
	
	      // if this interaction had been removed after stopping
	      // add it back
	      if (indexOf(interactions, this) === -1) {
	        interactions.push(this);
	      }
	
	      // set the startCoords if there was no prepared action
	      if (!this.prepared.name) {
	        this.setEventXY(this.startCoords);
	      }
	
	      this.prepared.name = action.name;
	      this.prepared.axis = action.axis;
	      this.prepared.edges = action.edges;
	      this.target = interactable;
	      this.element = element;
	
	      this.setStartOffsets(action.name, interactable, element);
	      this.setModifications(this.startCoords.page);
	
	      this.prevEvent = this[this.prepared.name + 'Start'](this.downEvent);
	    },
	
	    pointerMove: function pointerMove(pointer, event, eventTarget, curEventTarget, preEnd) {
	      if (this.inertiaStatus.active) {
	        var pageUp = this.inertiaStatus.upCoords.page;
	        var clientUp = this.inertiaStatus.upCoords.client;
	
	        var inertiaPosition = {
	          pageX: pageUp.x + this.inertiaStatus.sx,
	          pageY: pageUp.y + this.inertiaStatus.sy,
	          clientX: clientUp.x + this.inertiaStatus.sx,
	          clientY: clientUp.y + this.inertiaStatus.sy
	        };
	
	        this.setEventXY(this.curCoords, [inertiaPosition]);
	      } else {
	        this.recordPointer(pointer);
	        this.setEventXY(this.curCoords, this.pointers);
	      }
	
	      var duplicateMove = this.curCoords.page.x === this.prevCoords.page.x && this.curCoords.page.y === this.prevCoords.page.y && this.curCoords.client.x === this.prevCoords.client.x && this.curCoords.client.y === this.prevCoords.client.y;
	
	      var dx,
	          dy,
	          pointerIndex = this.mouse ? 0 : indexOf(this.pointerIds, getPointerId(pointer));
	
	      // register movement greater than pointerMoveTolerance
	      if (this.pointerIsDown && !this.pointerWasMoved) {
	        dx = this.curCoords.client.x - this.startCoords.client.x;
	        dy = this.curCoords.client.y - this.startCoords.client.y;
	
	        this.pointerWasMoved = hypot(dx, dy) > pointerMoveTolerance;
	      }
	
	      if (!duplicateMove && (!this.pointerIsDown || this.pointerWasMoved)) {
	        if (this.pointerIsDown) {
	          clearTimeout(this.holdTimers[pointerIndex]);
	        }
	
	        this.collectEventTargets(pointer, event, eventTarget, 'move');
	      }
	
	      if (!this.pointerIsDown) {
	        return;
	      }
	
	      if (duplicateMove && this.pointerWasMoved && !preEnd) {
	        this.checkAndPreventDefault(event, this.target, this.element);
	        return;
	      }
	
	      // set pointer coordinate, time changes and speeds
	      setEventDeltas(this.pointerDelta, this.prevCoords, this.curCoords);
	
	      if (!this.prepared.name) {
	        return;
	      }
	
	      if (this.pointerWasMoved
	      // ignore movement while inertia is active
	      && (!this.inertiaStatus.active || pointer instanceof InteractEvent && /inertiastart/.test(pointer.type))) {
	        // if just starting an action, calculate the pointer speed now
	        if (!this.interacting()) {
	          setEventDeltas(this.pointerDelta, this.prevCoords, this.curCoords);
	
	          // check if a drag is in the correct axis
	          if (this.prepared.name === 'drag') {
	            var absX = Math.abs(dx),
	                absY = Math.abs(dy),
	                targetAxis = this.target.options.drag.axis,
	                axis = absX > absY ? 'x' : absX < absY ? 'y' : 'xy';
	
	            // if the movement isn't in the axis of the interactable
	            if (axis !== 'xy' && targetAxis !== 'xy' && targetAxis !== axis) {
	              // cancel the prepared action
	              this.prepared.name = null;
	
	              // then try to get a drag from another ineractable
	
	              var element = eventTarget;
	
	              // check element interactables
	              while (isElement(element)) {
	                var elementInteractable = interactables.get(element);
	
	                if (elementInteractable && elementInteractable !== this.target && !elementInteractable.options.drag.manualStart && elementInteractable.getAction(this.downPointer, this.downEvent, this, element).name === 'drag' && checkAxis(axis, elementInteractable)) {
	                  this.prepared.name = 'drag';
	                  this.target = elementInteractable;
	                  this.element = element;
	                  break;
	                }
	
	                element = parentElement(element);
	              }
	
	              // if there's no drag from element interactables,
	              // check the selector interactables
	              if (!this.prepared.name) {
	                var thisInteraction = this;
	
	                var getDraggable = function getDraggable(interactable, selector, context) {
	                  var elements = ie8MatchesSelector ? context.querySelectorAll(selector) : undefined;
	
	                  if (interactable === thisInteraction.target) {
	                    return;
	                  }
	
	                  if (inContext(interactable, eventTarget) && !interactable.options.drag.manualStart && !testIgnore(interactable, element, eventTarget) && testAllow(interactable, element, eventTarget) && matchesSelector(element, selector, elements) && interactable.getAction(thisInteraction.downPointer, thisInteraction.downEvent, thisInteraction, element).name === 'drag' && checkAxis(axis, interactable) && withinInteractionLimit(interactable, element, 'drag')) {
	                    return interactable;
	                  }
	                };
	
	                element = eventTarget;
	
	                while (isElement(element)) {
	                  var selectorInteractable = interactables.forEachSelector(getDraggable);
	
	                  if (selectorInteractable) {
	                    this.prepared.name = 'drag';
	                    this.target = selectorInteractable;
	                    this.element = element;
	                    break;
	                  }
	
	                  element = parentElement(element);
	                }
	              }
	            }
	          }
	        }
	
	        var starting = !!this.prepared.name && !this.interacting();
	
	        if (starting && (this.target.options[this.prepared.name].manualStart || !withinInteractionLimit(this.target, this.element, this.prepared))) {
	          this.stop(event);
	          return;
	        }
	
	        if (this.prepared.name && this.target) {
	          if (starting) {
	            this.start(this.prepared, this.target, this.element);
	          }
	
	          var shouldMove = this.setModifications(this.curCoords.page, preEnd);
	
	          // move if snapping or restriction doesn't prevent it
	          if (shouldMove || starting) {
	            this.prevEvent = this[this.prepared.name + 'Move'](event);
	          }
	
	          this.checkAndPreventDefault(event, this.target, this.element);
	        }
	      }
	
	      copyCoords(this.prevCoords, this.curCoords);
	
	      if (this.dragging || this.resizing) {
	        this.autoScrollMove(pointer);
	      }
	    },
	
	    dragStart: function dragStart(event) {
	      var dragEvent = new InteractEvent(this, event, 'drag', 'start', this.element);
	
	      dragEvent.originalEvent = event;
	      this.dragging = true;
	      this.target.fire(dragEvent);
	
	      // reset active dropzones
	      this.activeDrops.dropzones = [];
	      this.activeDrops.elements = [];
	      this.activeDrops.rects = [];
	
	      if (!this.dynamicDrop) {
	        this.setActiveDrops(this.element);
	      }
	
	      var dropEvents = this.getDropEvents(event, dragEvent);
	
	      if (dropEvents.activate) {
	        this.fireActiveDrops(dropEvents.activate);
	      }
	
	      return dragEvent;
	    },
	
	    dragMove: function dragMove(event) {
	      var target = this.target,
	          dragEvent = new InteractEvent(this, event, 'drag', 'move', this.element),
	          draggableElement = this.element,
	          drop = this.getDrop(dragEvent, event, draggableElement);
	
	      dragEvent.originalEvent = event;
	
	      this.dropTarget = drop.dropzone;
	      this.dropElement = drop.element;
	
	      var dropEvents = this.getDropEvents(event, dragEvent);
	
	      target.fire(dragEvent);
	
	      if (dropEvents.leave) {
	        this.prevDropTarget.fire(dropEvents.leave);
	      }
	      if (dropEvents.enter) {
	        this.dropTarget.fire(dropEvents.enter);
	      }
	      if (dropEvents.move) {
	        this.dropTarget.fire(dropEvents.move);
	      }
	
	      this.prevDropTarget = this.dropTarget;
	      this.prevDropElement = this.dropElement;
	
	      return dragEvent;
	    },
	
	    resizeStart: function resizeStart(event) {
	      var resizeEvent = new InteractEvent(this, event, 'resize', 'start', this.element);
	
	      if (this.prepared.edges) {
	        var startRect = this.target.getRect(this.element);
	
	        /*
	         * When using the `resizable.square` or `resizable.preserveAspectRatio` options, resizing from one edge
	         * will affect another. E.g. with `resizable.square`, resizing to make the right edge larger will make
	         * the bottom edge larger by the same amount. We call these 'linked' edges. Any linked edges will depend
	         * on the active edges and the edge being interacted with.
	         */
	        if (this.target.options.resize.square || this.target.options.resize.preserveAspectRatio) {
	          var linkedEdges = extend({}, this.prepared.edges);
	
	          linkedEdges.top = linkedEdges.top || linkedEdges.left && !linkedEdges.bottom;
	          linkedEdges.left = linkedEdges.left || linkedEdges.top && !linkedEdges.right;
	          linkedEdges.bottom = linkedEdges.bottom || linkedEdges.right && !linkedEdges.top;
	          linkedEdges.right = linkedEdges.right || linkedEdges.bottom && !linkedEdges.left;
	
	          this.prepared._linkedEdges = linkedEdges;
	        } else {
	          this.prepared._linkedEdges = null;
	        }
	
	        // if using `resizable.preserveAspectRatio` option, record aspect ratio at the start of the resize
	        if (this.target.options.resize.preserveAspectRatio) {
	          this.resizeStartAspectRatio = startRect.width / startRect.height;
	        }
	
	        this.resizeRects = {
	          start: startRect,
	          current: extend({}, startRect),
	          restricted: extend({}, startRect),
	          previous: extend({}, startRect),
	          delta: {
	            left: 0, right: 0, width: 0,
	            top: 0, bottom: 0, height: 0
	          }
	        };
	
	        resizeEvent.rect = this.resizeRects.restricted;
	        resizeEvent.deltaRect = this.resizeRects.delta;
	      }
	
	      this.target.fire(resizeEvent);
	
	      this.resizing = true;
	
	      return resizeEvent;
	    },
	
	    resizeMove: function resizeMove(event) {
	      var resizeEvent = new InteractEvent(this, event, 'resize', 'move', this.element);
	
	      var edges = this.prepared.edges,
	          invert = this.target.options.resize.invert,
	          invertible = invert === 'reposition' || invert === 'negate';
	
	      if (edges) {
	        var dx = resizeEvent.dx,
	            dy = resizeEvent.dy,
	            start = this.resizeRects.start,
	            current = this.resizeRects.current,
	            restricted = this.resizeRects.restricted,
	            delta = this.resizeRects.delta,
	            previous = extend(this.resizeRects.previous, restricted),
	            originalEdges = edges;
	
	        // `resize.preserveAspectRatio` takes precedence over `resize.square`
	        if (this.target.options.resize.preserveAspectRatio) {
	          var resizeStartAspectRatio = this.resizeStartAspectRatio;
	
	          edges = this.prepared._linkedEdges;
	
	          if (originalEdges.left && originalEdges.bottom || originalEdges.right && originalEdges.top) {
	            dy = -dx / resizeStartAspectRatio;
	          } else if (originalEdges.left || originalEdges.right) {
	            dy = dx / resizeStartAspectRatio;
	          } else if (originalEdges.top || originalEdges.bottom) {
	            dx = dy * resizeStartAspectRatio;
	          }
	        } else if (this.target.options.resize.square) {
	          edges = this.prepared._linkedEdges;
	
	          if (originalEdges.left && originalEdges.bottom || originalEdges.right && originalEdges.top) {
	            dy = -dx;
	          } else if (originalEdges.left || originalEdges.right) {
	            dy = dx;
	          } else if (originalEdges.top || originalEdges.bottom) {
	            dx = dy;
	          }
	        }
	
	        // update the 'current' rect without modifications
	        if (edges.top) {
	          current.top += dy;
	        }
	        if (edges.bottom) {
	          current.bottom += dy;
	        }
	        if (edges.left) {
	          current.left += dx;
	        }
	        if (edges.right) {
	          current.right += dx;
	        }
	
	        if (invertible) {
	          // if invertible, copy the current rect
	          extend(restricted, current);
	
	          if (invert === 'reposition') {
	            // swap edge values if necessary to keep width/height positive
	            var swap;
	
	            if (restricted.top > restricted.bottom) {
	              swap = restricted.top;
	
	              restricted.top = restricted.bottom;
	              restricted.bottom = swap;
	            }
	            if (restricted.left > restricted.right) {
	              swap = restricted.left;
	
	              restricted.left = restricted.right;
	              restricted.right = swap;
	            }
	          }
	        } else {
	          // if not invertible, restrict to minimum of 0x0 rect
	          restricted.top = Math.min(current.top, start.bottom);
	          restricted.bottom = Math.max(current.bottom, start.top);
	          restricted.left = Math.min(current.left, start.right);
	          restricted.right = Math.max(current.right, start.left);
	        }
	
	        restricted.width = restricted.right - restricted.left;
	        restricted.height = restricted.bottom - restricted.top;
	
	        for (var edge in restricted) {
	          delta[edge] = restricted[edge] - previous[edge];
	        }
	
	        resizeEvent.edges = this.prepared.edges;
	        resizeEvent.rect = restricted;
	        resizeEvent.deltaRect = delta;
	      }
	
	      this.target.fire(resizeEvent);
	
	      return resizeEvent;
	    },
	
	    gestureStart: function gestureStart(event) {
	      var gestureEvent = new InteractEvent(this, event, 'gesture', 'start', this.element);
	
	      gestureEvent.ds = 0;
	
	      this.gesture.startDistance = this.gesture.prevDistance = gestureEvent.distance;
	      this.gesture.startAngle = this.gesture.prevAngle = gestureEvent.angle;
	      this.gesture.scale = 1;
	
	      this.gesturing = true;
	
	      this.target.fire(gestureEvent);
	
	      return gestureEvent;
	    },
	
	    gestureMove: function gestureMove(event) {
	      if (!this.pointerIds.length) {
	        return this.prevEvent;
	      }
	
	      var gestureEvent;
	
	      gestureEvent = new InteractEvent(this, event, 'gesture', 'move', this.element);
	      gestureEvent.ds = gestureEvent.scale - this.gesture.scale;
	
	      this.target.fire(gestureEvent);
	
	      this.gesture.prevAngle = gestureEvent.angle;
	      this.gesture.prevDistance = gestureEvent.distance;
	
	      if (gestureEvent.scale !== Infinity && gestureEvent.scale !== null && gestureEvent.scale !== undefined && !isNaN(gestureEvent.scale)) {
	        this.gesture.scale = gestureEvent.scale;
	      }
	
	      return gestureEvent;
	    },
	
	    pointerHold: function pointerHold(pointer, event, eventTarget) {
	      this.collectEventTargets(pointer, event, eventTarget, 'hold');
	    },
	
	    pointerUp: function pointerUp(pointer, event, eventTarget, curEventTarget) {
	      var pointerIndex = this.mouse ? 0 : indexOf(this.pointerIds, getPointerId(pointer));
	
	      clearTimeout(this.holdTimers[pointerIndex]);
	
	      this.collectEventTargets(pointer, event, eventTarget, 'up');
	      this.collectEventTargets(pointer, event, eventTarget, 'tap');
	
	      this.pointerEnd(pointer, event, eventTarget, curEventTarget);
	
	      this.removePointer(pointer);
	    },
	
	    pointerCancel: function pointerCancel(pointer, event, eventTarget, curEventTarget) {
	      var pointerIndex = this.mouse ? 0 : indexOf(this.pointerIds, getPointerId(pointer));
	
	      clearTimeout(this.holdTimers[pointerIndex]);
	
	      this.collectEventTargets(pointer, event, eventTarget, 'cancel');
	      this.pointerEnd(pointer, event, eventTarget, curEventTarget);
	
	      this.removePointer(pointer);
	    },
	
	    // http://www.quirksmode.org/dom/events/click.html
	    // >Events leading to dblclick
	    //
	    // IE8 doesn't fire down event before dblclick.
	    // This workaround tries to fire a tap and doubletap after dblclick
	    ie8Dblclick: function ie8Dblclick(pointer, event, eventTarget) {
	      if (this.prevTap && event.clientX === this.prevTap.clientX && event.clientY === this.prevTap.clientY && eventTarget === this.prevTap.target) {
	        this.downTargets[0] = eventTarget;
	        this.downTimes[0] = new Date().getTime();
	        this.collectEventTargets(pointer, event, eventTarget, 'tap');
	      }
	    },
	
	    // End interact move events and stop auto-scroll unless inertia is enabled
	    pointerEnd: function pointerEnd(pointer, event, eventTarget, curEventTarget) {
	      var endEvent,
	          target = this.target,
	          options = target && target.options,
	          inertiaOptions = options && this.prepared.name && options[this.prepared.name].inertia,
	          inertiaStatus = this.inertiaStatus;
	
	      if (this.interacting()) {
	        if (inertiaStatus.active && !inertiaStatus.ending) {
	          return;
	        }
	
	        var pointerSpeed,
	            now = new Date().getTime(),
	            inertiaPossible = false,
	            inertia = false,
	            smoothEnd = false,
	            endSnap = checkSnap(target, this.prepared.name) && options[this.prepared.name].snap.endOnly,
	            endRestrict = checkRestrict(target, this.prepared.name) && options[this.prepared.name].restrict.endOnly,
	            dx = 0,
	            dy = 0,
	            startEvent;
	
	        if (this.dragging) {
	          if (options.drag.axis === 'x') {
	            pointerSpeed = Math.abs(this.pointerDelta.client.vx);
	          } else if (options.drag.axis === 'y') {
	            pointerSpeed = Math.abs(this.pointerDelta.client.vy);
	          } else /* options.drag.axis === 'xy'*/{
	              pointerSpeed = this.pointerDelta.client.speed;
	            }
	        } else {
	          pointerSpeed = this.pointerDelta.client.speed;
	        }
	
	        // check if inertia should be started
	        inertiaPossible = inertiaOptions && inertiaOptions.enabled && this.prepared.name !== 'gesture' && event !== inertiaStatus.startEvent;
	
	        inertia = inertiaPossible && now - this.curCoords.timeStamp < 50 && pointerSpeed > inertiaOptions.minSpeed && pointerSpeed > inertiaOptions.endSpeed;
	
	        if (inertiaPossible && !inertia && (endSnap || endRestrict)) {
	          var snapRestrict = {};
	
	          snapRestrict.snap = snapRestrict.restrict = snapRestrict;
	
	          if (endSnap) {
	            this.setSnapping(this.curCoords.page, snapRestrict);
	            if (snapRestrict.locked) {
	              dx += snapRestrict.dx;
	              dy += snapRestrict.dy;
	            }
	          }
	
	          if (endRestrict) {
	            this.setRestriction(this.curCoords.page, snapRestrict);
	            if (snapRestrict.restricted) {
	              dx += snapRestrict.dx;
	              dy += snapRestrict.dy;
	            }
	          }
	
	          if (dx || dy) {
	            smoothEnd = true;
	          }
	        }
	
	        if (inertia || smoothEnd) {
	          copyCoords(inertiaStatus.upCoords, this.curCoords);
	
	          this.pointers[0] = inertiaStatus.startEvent = startEvent = new InteractEvent(this, event, this.prepared.name, 'inertiastart', this.element);
	
	          inertiaStatus.t0 = now;
	
	          target.fire(inertiaStatus.startEvent);
	
	          if (inertia) {
	            inertiaStatus.vx0 = this.pointerDelta.client.vx;
	            inertiaStatus.vy0 = this.pointerDelta.client.vy;
	            inertiaStatus.v0 = pointerSpeed;
	
	            this.calcInertia(inertiaStatus);
	
	            var page = extend({}, this.curCoords.page),
	                origin = getOriginXY(target, this.element),
	                statusObject;
	
	            page.x = page.x + inertiaStatus.xe - origin.x;
	            page.y = page.y + inertiaStatus.ye - origin.y;
	
	            statusObject = {
	              useStatusXY: true,
	              x: page.x,
	              y: page.y,
	              dx: 0,
	              dy: 0,
	              snap: null
	            };
	
	            statusObject.snap = statusObject;
	
	            dx = dy = 0;
	
	            if (endSnap) {
	              var snap = this.setSnapping(this.curCoords.page, statusObject);
	
	              if (snap.locked) {
	                dx += snap.dx;
	                dy += snap.dy;
	              }
	            }
	
	            if (endRestrict) {
	              var restrict = this.setRestriction(this.curCoords.page, statusObject);
	
	              if (restrict.restricted) {
	                dx += restrict.dx;
	                dy += restrict.dy;
	              }
	            }
	
	            inertiaStatus.modifiedXe += dx;
	            inertiaStatus.modifiedYe += dy;
	
	            inertiaStatus.i = reqFrame(this.boundInertiaFrame);
	          } else {
	            inertiaStatus.smoothEnd = true;
	            inertiaStatus.xe = dx;
	            inertiaStatus.ye = dy;
	
	            inertiaStatus.sx = inertiaStatus.sy = 0;
	
	            inertiaStatus.i = reqFrame(this.boundSmoothEndFrame);
	          }
	
	          inertiaStatus.active = true;
	          return;
	        }
	
	        if (endSnap || endRestrict) {
	          // fire a move event at the snapped coordinates
	          this.pointerMove(pointer, event, eventTarget, curEventTarget, true);
	        }
	      }
	
	      if (this.dragging) {
	        endEvent = new InteractEvent(this, event, 'drag', 'end', this.element);
	
	        var draggableElement = this.element,
	            drop = this.getDrop(endEvent, event, draggableElement);
	
	        this.dropTarget = drop.dropzone;
	        this.dropElement = drop.element;
	
	        var dropEvents = this.getDropEvents(event, endEvent);
	
	        if (dropEvents.leave) {
	          this.prevDropTarget.fire(dropEvents.leave);
	        }
	        if (dropEvents.enter) {
	          this.dropTarget.fire(dropEvents.enter);
	        }
	        if (dropEvents.drop) {
	          this.dropTarget.fire(dropEvents.drop);
	        }
	        if (dropEvents.deactivate) {
	          this.fireActiveDrops(dropEvents.deactivate);
	        }
	
	        target.fire(endEvent);
	      } else if (this.resizing) {
	        endEvent = new InteractEvent(this, event, 'resize', 'end', this.element);
	        target.fire(endEvent);
	      } else if (this.gesturing) {
	        endEvent = new InteractEvent(this, event, 'gesture', 'end', this.element);
	        target.fire(endEvent);
	      }
	
	      this.stop(event);
	    },
	
	    collectDrops: function collectDrops(element) {
	      var drops = [],
	          elements = [],
	          i;
	
	      element = element || this.element;
	
	      // collect all dropzones and their elements which qualify for a drop
	      for (i = 0; i < interactables.length; i++) {
	        if (!interactables[i].options.drop.enabled) {
	          continue;
	        }
	
	        var current = interactables[i],
	            accept = current.options.drop.accept;
	
	        // test the draggable element against the dropzone's accept setting
	        if (isElement(accept) && accept !== element || isString(accept) && !matchesSelector(element, accept)) {
	          continue;
	        }
	
	        // query for new elements if necessary
	        var dropElements = current.selector ? current._context.querySelectorAll(current.selector) : [current._element];
	
	        for (var j = 0, len = dropElements.length; j < len; j++) {
	          var currentElement = dropElements[j];
	
	          if (currentElement === element) {
	            continue;
	          }
	
	          drops.push(current);
	          elements.push(currentElement);
	        }
	      }
	
	      return {
	        dropzones: drops,
	        elements: elements
	      };
	    },
	
	    fireActiveDrops: function fireActiveDrops(event) {
	      var i, current, currentElement, prevElement;
	
	      // loop through all active dropzones and trigger event
	      for (i = 0; i < this.activeDrops.dropzones.length; i++) {
	        current = this.activeDrops.dropzones[i];
	        currentElement = this.activeDrops.elements[i];
	
	        // prevent trigger of duplicate events on same element
	        if (currentElement !== prevElement) {
	          // set current element as event target
	          event.target = currentElement;
	          current.fire(event);
	        }
	        prevElement = currentElement;
	      }
	    },
	
	    // Collect a new set of possible drops and save them in activeDrops.
	    // setActiveDrops should always be called when a drag has just started or a
	    // drag event happens while dynamicDrop is true
	    setActiveDrops: function setActiveDrops(dragElement) {
	      // get dropzones and their elements that could receive the draggable
	      var possibleDrops = this.collectDrops(dragElement, true);
	
	      this.activeDrops.dropzones = possibleDrops.dropzones;
	      this.activeDrops.elements = possibleDrops.elements;
	      this.activeDrops.rects = [];
	
	      for (var i = 0; i < this.activeDrops.dropzones.length; i++) {
	        this.activeDrops.rects[i] = this.activeDrops.dropzones[i].getRect(this.activeDrops.elements[i]);
	      }
	    },
	
	    getDrop: function getDrop(dragEvent, event, dragElement) {
	      var validDrops = [];
	
	      if (dynamicDrop) {
	        this.setActiveDrops(dragElement);
	      }
	
	      // collect all dropzones and their elements which qualify for a drop
	      for (var j = 0; j < this.activeDrops.dropzones.length; j++) {
	        var current = this.activeDrops.dropzones[j],
	            currentElement = this.activeDrops.elements[j],
	            rect = this.activeDrops.rects[j];
	
	        validDrops.push(current.dropCheck(dragEvent, event, this.target, dragElement, currentElement, rect) ? currentElement : null);
	      }
	
	      // get the most appropriate dropzone based on DOM depth and order
	      var dropIndex = indexOfDeepestElement(validDrops),
	          dropzone = this.activeDrops.dropzones[dropIndex] || null,
	          element = this.activeDrops.elements[dropIndex] || null;
	
	      return {
	        dropzone: dropzone,
	        element: element
	      };
	    },
	
	    getDropEvents: function getDropEvents(pointerEvent, dragEvent) {
	      var dropEvents = {
	        enter: null,
	        leave: null,
	        activate: null,
	        deactivate: null,
	        move: null,
	        drop: null
	      };
	
	      if (this.dropElement !== this.prevDropElement) {
	        // if there was a prevDropTarget, create a dragleave event
	        if (this.prevDropTarget) {
	          dropEvents.leave = {
	            target: this.prevDropElement,
	            dropzone: this.prevDropTarget,
	            relatedTarget: dragEvent.target,
	            draggable: dragEvent.interactable,
	            dragEvent: dragEvent,
	            interaction: this,
	            timeStamp: dragEvent.timeStamp,
	            type: 'dragleave'
	          };
	
	          dragEvent.dragLeave = this.prevDropElement;
	          dragEvent.prevDropzone = this.prevDropTarget;
	        }
	        // if the dropTarget is not null, create a dragenter event
	        if (this.dropTarget) {
	          dropEvents.enter = {
	            target: this.dropElement,
	            dropzone: this.dropTarget,
	            relatedTarget: dragEvent.target,
	            draggable: dragEvent.interactable,
	            dragEvent: dragEvent,
	            interaction: this,
	            timeStamp: dragEvent.timeStamp,
	            type: 'dragenter'
	          };
	
	          dragEvent.dragEnter = this.dropElement;
	          dragEvent.dropzone = this.dropTarget;
	        }
	      }
	
	      if (dragEvent.type === 'dragend' && this.dropTarget) {
	        dropEvents.drop = {
	          target: this.dropElement,
	          dropzone: this.dropTarget,
	          relatedTarget: dragEvent.target,
	          draggable: dragEvent.interactable,
	          dragEvent: dragEvent,
	          interaction: this,
	          timeStamp: dragEvent.timeStamp,
	          type: 'drop'
	        };
	
	        dragEvent.dropzone = this.dropTarget;
	      }
	      if (dragEvent.type === 'dragstart') {
	        dropEvents.activate = {
	          target: null,
	          dropzone: null,
	          relatedTarget: dragEvent.target,
	          draggable: dragEvent.interactable,
	          dragEvent: dragEvent,
	          interaction: this,
	          timeStamp: dragEvent.timeStamp,
	          type: 'dropactivate'
	        };
	      }
	      if (dragEvent.type === 'dragend') {
	        dropEvents.deactivate = {
	          target: null,
	          dropzone: null,
	          relatedTarget: dragEvent.target,
	          draggable: dragEvent.interactable,
	          dragEvent: dragEvent,
	          interaction: this,
	          timeStamp: dragEvent.timeStamp,
	          type: 'dropdeactivate'
	        };
	      }
	      if (dragEvent.type === 'dragmove' && this.dropTarget) {
	        dropEvents.move = {
	          target: this.dropElement,
	          dropzone: this.dropTarget,
	          relatedTarget: dragEvent.target,
	          draggable: dragEvent.interactable,
	          dragEvent: dragEvent,
	          interaction: this,
	          dragmove: dragEvent,
	          timeStamp: dragEvent.timeStamp,
	          type: 'dropmove'
	        };
	        dragEvent.dropzone = this.dropTarget;
	      }
	
	      return dropEvents;
	    },
	
	    currentAction: function currentAction() {
	      return this.dragging && 'drag' || this.resizing && 'resize' || this.gesturing && 'gesture' || null;
	    },
	
	    interacting: function interacting() {
	      return this.dragging || this.resizing || this.gesturing;
	    },
	
	    clearTargets: function clearTargets() {
	      this.target = this.element = null;
	
	      this.dropTarget = this.dropElement = this.prevDropTarget = this.prevDropElement = null;
	    },
	
	    stop: function stop(event) {
	      if (this.interacting()) {
	        autoScroll.stop();
	        this.matches = [];
	        this.matchElements = [];
	
	        var target = this.target;
	
	        if (target.options.styleCursor) {
	          target._doc.documentElement.style.cursor = '';
	        }
	
	        // prevent Default only if were previously interacting
	        if (event && isFunction(event.preventDefault)) {
	          this.checkAndPreventDefault(event, target, this.element);
	        }
	
	        if (this.dragging) {
	          this.activeDrops.dropzones = this.activeDrops.elements = this.activeDrops.rects = null;
	        }
	      }
	
	      this.clearTargets();
	
	      this.pointerIsDown = this.snapStatus.locked = this.dragging = this.resizing = this.gesturing = false;
	      this.prepared.name = this.prevEvent = null;
	      this.inertiaStatus.resumeDx = this.inertiaStatus.resumeDy = 0;
	
	      // remove pointers if their ID isn't in this.pointerIds
	      for (var i = 0; i < this.pointers.length; i++) {
	        if (indexOf(this.pointerIds, getPointerId(this.pointers[i])) === -1) {
	          this.pointers.splice(i, 1);
	        }
	      }
	    },
	
	    inertiaFrame: function inertiaFrame() {
	      var inertiaStatus = this.inertiaStatus,
	          options = this.target.options[this.prepared.name].inertia,
	          lambda = options.resistance,
	          t = new Date().getTime() / 1000 - inertiaStatus.t0;
	
	      if (t < inertiaStatus.te) {
	        var progress = 1 - (Math.exp(-lambda * t) - inertiaStatus.lambda_v0) / inertiaStatus.one_ve_v0;
	
	        if (inertiaStatus.modifiedXe === inertiaStatus.xe && inertiaStatus.modifiedYe === inertiaStatus.ye) {
	          inertiaStatus.sx = inertiaStatus.xe * progress;
	          inertiaStatus.sy = inertiaStatus.ye * progress;
	        } else {
	          var quadPoint = getQuadraticCurvePoint(0, 0, inertiaStatus.xe, inertiaStatus.ye, inertiaStatus.modifiedXe, inertiaStatus.modifiedYe, progress);
	
	          inertiaStatus.sx = quadPoint.x;
	          inertiaStatus.sy = quadPoint.y;
	        }
	
	        this.pointerMove(inertiaStatus.startEvent, inertiaStatus.startEvent);
	
	        inertiaStatus.i = reqFrame(this.boundInertiaFrame);
	      } else {
	        inertiaStatus.ending = true;
	
	        inertiaStatus.sx = inertiaStatus.modifiedXe;
	        inertiaStatus.sy = inertiaStatus.modifiedYe;
	
	        this.pointerMove(inertiaStatus.startEvent, inertiaStatus.startEvent);
	        this.pointerEnd(inertiaStatus.startEvent, inertiaStatus.startEvent);
	
	        inertiaStatus.active = inertiaStatus.ending = false;
	      }
	    },
	
	    smoothEndFrame: function smoothEndFrame() {
	      var inertiaStatus = this.inertiaStatus,
	          t = new Date().getTime() - inertiaStatus.t0,
	          duration = this.target.options[this.prepared.name].inertia.smoothEndDuration;
	
	      if (t < duration) {
	        inertiaStatus.sx = easeOutQuad(t, 0, inertiaStatus.xe, duration);
	        inertiaStatus.sy = easeOutQuad(t, 0, inertiaStatus.ye, duration);
	
	        this.pointerMove(inertiaStatus.startEvent, inertiaStatus.startEvent);
	
	        inertiaStatus.i = reqFrame(this.boundSmoothEndFrame);
	      } else {
	        inertiaStatus.ending = true;
	
	        inertiaStatus.sx = inertiaStatus.xe;
	        inertiaStatus.sy = inertiaStatus.ye;
	
	        this.pointerMove(inertiaStatus.startEvent, inertiaStatus.startEvent);
	        this.pointerEnd(inertiaStatus.startEvent, inertiaStatus.startEvent);
	
	        inertiaStatus.smoothEnd = inertiaStatus.active = inertiaStatus.ending = false;
	      }
	    },
	
	    addPointer: function addPointer(pointer) {
	      var id = getPointerId(pointer),
	          index = this.mouse ? 0 : indexOf(this.pointerIds, id);
	
	      if (index === -1) {
	        index = this.pointerIds.length;
	      }
	
	      this.pointerIds[index] = id;
	      this.pointers[index] = pointer;
	
	      return index;
	    },
	
	    removePointer: function removePointer(pointer) {
	      var id = getPointerId(pointer),
	          index = this.mouse ? 0 : indexOf(this.pointerIds, id);
	
	      if (index === -1) {
	        return;
	      }
	
	      this.pointers.splice(index, 1);
	      this.pointerIds.splice(index, 1);
	      this.downTargets.splice(index, 1);
	      this.downTimes.splice(index, 1);
	      this.holdTimers.splice(index, 1);
	    },
	
	    recordPointer: function recordPointer(pointer) {
	      var index = this.mouse ? 0 : indexOf(this.pointerIds, getPointerId(pointer));
	
	      if (index === -1) {
	        return;
	      }
	
	      this.pointers[index] = pointer;
	    },
	
	    collectEventTargets: function collectEventTargets(pointer, event, eventTarget, eventType) {
	      var pointerIndex = this.mouse ? 0 : indexOf(this.pointerIds, getPointerId(pointer));
	
	      // do not fire a tap event if the pointer was moved before being lifted
	      if (eventType === 'tap' && (this.pointerWasMoved
	      // or if the pointerup target is different to the pointerdown target
	      || !(this.downTargets[pointerIndex] && this.downTargets[pointerIndex] === eventTarget))) {
	        return;
	      }
	
	      var targets = [],
	          elements = [],
	          element = eventTarget;
	
	      function collectSelectors(interactable, selector, context) {
	        var els = ie8MatchesSelector ? context.querySelectorAll(selector) : undefined;
	
	        if (interactable._iEvents[eventType] && isElement(element) && inContext(interactable, element) && !testIgnore(interactable, element, eventTarget) && testAllow(interactable, element, eventTarget) && matchesSelector(element, selector, els)) {
	          targets.push(interactable);
	          elements.push(element);
	        }
	      }
	
	      while (element) {
	        if (interact.isSet(element) && interact(element)._iEvents[eventType]) {
	          targets.push(interact(element));
	          elements.push(element);
	        }
	
	        interactables.forEachSelector(collectSelectors);
	
	        element = parentElement(element);
	      }
	
	      // create the tap event even if there are no listeners so that
	      // doubletap can still be created and fired
	      if (targets.length || eventType === 'tap') {
	        this.firePointers(pointer, event, eventTarget, targets, elements, eventType);
	      }
	    },
	
	    firePointers: function firePointers(pointer, event, eventTarget, targets, elements, eventType) {
	      var pointerIndex = this.mouse ? 0 : indexOf(this.pointerIds, getPointerId(pointer)),
	          pointerEvent = {},
	          i,
	
	      // for tap events
	      interval,
	          createNewDoubleTap;
	
	      // if it's a doubletap then the event properties would have been
	      // copied from the tap event and provided as the pointer argument
	      if (eventType === 'doubletap') {
	        pointerEvent = pointer;
	      } else {
	        pointerExtend(pointerEvent, event);
	        if (event !== pointer) {
	          pointerExtend(pointerEvent, pointer);
	        }
	
	        pointerEvent.preventDefault = preventOriginalDefault;
	        pointerEvent.stopPropagation = InteractEvent.prototype.stopPropagation;
	        pointerEvent.stopImmediatePropagation = InteractEvent.prototype.stopImmediatePropagation;
	        pointerEvent.interaction = this;
	
	        pointerEvent.timeStamp = new Date().getTime();
	        pointerEvent.originalEvent = event;
	        pointerEvent.originalPointer = pointer;
	        pointerEvent.type = eventType;
	        pointerEvent.pointerId = getPointerId(pointer);
	        pointerEvent.pointerType = this.mouse ? 'mouse' : !supportsPointerEvent ? 'touch' : isString(pointer.pointerType) ? pointer.pointerType : [,, 'touch', 'pen', 'mouse'][pointer.pointerType];
	      }
	
	      if (eventType === 'tap') {
	        pointerEvent.dt = pointerEvent.timeStamp - this.downTimes[pointerIndex];
	
	        interval = pointerEvent.timeStamp - this.tapTime;
	        createNewDoubleTap = !!(this.prevTap && this.prevTap.type !== 'doubletap' && this.prevTap.target === pointerEvent.target && interval < 500);
	
	        pointerEvent.double = createNewDoubleTap;
	
	        this.tapTime = pointerEvent.timeStamp;
	      }
	
	      for (i = 0; i < targets.length; i++) {
	        pointerEvent.currentTarget = elements[i];
	        pointerEvent.interactable = targets[i];
	        targets[i].fire(pointerEvent);
	
	        if (pointerEvent.immediatePropagationStopped || pointerEvent.propagationStopped && elements[i + 1] !== pointerEvent.currentTarget) {
	          break;
	        }
	      }
	
	      if (createNewDoubleTap) {
	        var doubleTap = {};
	
	        extend(doubleTap, pointerEvent);
	
	        doubleTap.dt = interval;
	        doubleTap.type = 'doubletap';
	
	        this.collectEventTargets(doubleTap, event, eventTarget, 'doubletap');
	
	        this.prevTap = doubleTap;
	      } else if (eventType === 'tap') {
	        this.prevTap = pointerEvent;
	      }
	    },
	
	    validateSelector: function validateSelector(pointer, event, matches, matchElements) {
	      for (var i = 0, len = matches.length; i < len; i++) {
	        var match = matches[i],
	            matchElement = matchElements[i],
	            action = validateAction(match.getAction(pointer, event, this, matchElement), match);
	
	        if (action && withinInteractionLimit(match, matchElement, action)) {
	          this.target = match;
	          this.element = matchElement;
	
	          return action;
	        }
	      }
	    },
	
	    setSnapping: function setSnapping(pageCoords, status) {
	      var snap = this.target.options[this.prepared.name].snap,
	          targets = [],
	          target,
	          page,
	          i;
	
	      status = status || this.snapStatus;
	
	      if (status.useStatusXY) {
	        page = { x: status.x, y: status.y };
	      } else {
	        var origin = getOriginXY(this.target, this.element);
	
	        page = extend({}, pageCoords);
	
	        page.x -= origin.x;
	        page.y -= origin.y;
	      }
	
	      status.realX = page.x;
	      status.realY = page.y;
	
	      page.x = page.x - this.inertiaStatus.resumeDx;
	      page.y = page.y - this.inertiaStatus.resumeDy;
	
	      var len = snap.targets ? snap.targets.length : 0;
	
	      for (var relIndex = 0; relIndex < this.snapOffsets.length; relIndex++) {
	        var relative = {
	          x: page.x - this.snapOffsets[relIndex].x,
	          y: page.y - this.snapOffsets[relIndex].y
	        };
	
	        for (i = 0; i < len; i++) {
	          if (isFunction(snap.targets[i])) {
	            target = snap.targets[i](relative.x, relative.y, this);
	          } else {
	            target = snap.targets[i];
	          }
	
	          if (!target) {
	            continue;
	          }
	
	          targets.push({
	            x: isNumber(target.x) ? target.x + this.snapOffsets[relIndex].x : relative.x,
	            y: isNumber(target.y) ? target.y + this.snapOffsets[relIndex].y : relative.y,
	
	            range: isNumber(target.range) ? target.range : snap.range
	          });
	        }
	      }
	
	      var closest = {
	        target: null,
	        inRange: false,
	        distance: 0,
	        range: 0,
	        dx: 0,
	        dy: 0
	      };
	
	      for (i = 0, len = targets.length; i < len; i++) {
	        target = targets[i];
	
	        var range = target.range,
	            dx = target.x - page.x,
	            dy = target.y - page.y,
	            distance = hypot(dx, dy),
	            inRange = distance <= range;
	
	        // Infinite targets count as being out of range
	        // compared to non infinite ones that are in range
	        if (range === Infinity && closest.inRange && closest.range !== Infinity) {
	          inRange = false;
	        }
	
	        if (!closest.target || (inRange
	        // is the closest target in range?
	        ? closest.inRange && range !== Infinity
	        // the pointer is relatively deeper in this target
	        ? distance / range < closest.distance / closest.range
	        // this target has Infinite range and the closest doesn't
	        : range === Infinity && closest.range !== Infinity ||
	        // OR this target is closer that the previous closest
	        distance < closest.distance :
	        // The other is not in range and the pointer is closer to this target
	        !closest.inRange && distance < closest.distance)) {
	          if (range === Infinity) {
	            inRange = true;
	          }
	
	          closest.target = target;
	          closest.distance = distance;
	          closest.range = range;
	          closest.inRange = inRange;
	          closest.dx = dx;
	          closest.dy = dy;
	
	          status.range = range;
	        }
	      }
	
	      var snapChanged;
	
	      if (closest.target) {
	        snapChanged = status.snappedX !== closest.target.x || status.snappedY !== closest.target.y;
	
	        status.snappedX = closest.target.x;
	        status.snappedY = closest.target.y;
	      } else {
	        snapChanged = true;
	
	        status.snappedX = NaN;
	        status.snappedY = NaN;
	      }
	
	      status.dx = closest.dx;
	      status.dy = closest.dy;
	
	      status.changed = snapChanged || closest.inRange && !status.locked;
	      status.locked = closest.inRange;
	
	      return status;
	    },
	
	    setRestriction: function setRestriction(pageCoords, status) {
	      var target = this.target,
	          restrict = target && target.options[this.prepared.name].restrict,
	          restriction = restrict && restrict.restriction,
	          page;
	
	      if (!restriction) {
	        return status;
	      }
	
	      status = status || this.restrictStatus;
	
	      page = status.useStatusXY ? page = { x: status.x, y: status.y } : page = extend({}, pageCoords);
	
	      if (status.snap && status.snap.locked) {
	        page.x += status.snap.dx || 0;
	        page.y += status.snap.dy || 0;
	      }
	
	      page.x -= this.inertiaStatus.resumeDx;
	      page.y -= this.inertiaStatus.resumeDy;
	
	      status.dx = 0;
	      status.dy = 0;
	      status.restricted = false;
	
	      var rect, restrictedX, restrictedY;
	
	      if (isString(restriction)) {
	        if (restriction === 'parent') {
	          restriction = parentElement(this.element);
	        } else if (restriction === 'self') {
	          restriction = target.getRect(this.element);
	        } else {
	          restriction = closest(this.element, restriction);
	        }
	
	        if (!restriction) {
	          return status;
	        }
	      }
	
	      if (isFunction(restriction)) {
	        restriction = restriction(page.x, page.y, this.element);
	      }
	
	      if (isElement(restriction)) {
	        restriction = getElementRect(restriction);
	      }
	
	      rect = restriction;
	
	      if (!restriction) {
	        restrictedX = page.x;
	        restrictedY = page.y;
	      }
	      // object is assumed to have
	      // x, y, width, height or
	      // left, top, right, bottom
	      else if ('x' in restriction && 'y' in restriction) {
	          restrictedX = Math.max(Math.min(rect.x + rect.width - this.restrictOffset.right, page.x), rect.x + this.restrictOffset.left);
	          restrictedY = Math.max(Math.min(rect.y + rect.height - this.restrictOffset.bottom, page.y), rect.y + this.restrictOffset.top);
	        } else {
	          restrictedX = Math.max(Math.min(rect.right - this.restrictOffset.right, page.x), rect.left + this.restrictOffset.left);
	          restrictedY = Math.max(Math.min(rect.bottom - this.restrictOffset.bottom, page.y), rect.top + this.restrictOffset.top);
	        }
	
	      status.dx = restrictedX - page.x;
	      status.dy = restrictedY - page.y;
	
	      status.changed = status.restrictedX !== restrictedX || status.restrictedY !== restrictedY;
	      status.restricted = !!(status.dx || status.dy);
	
	      status.restrictedX = restrictedX;
	      status.restrictedY = restrictedY;
	
	      return status;
	    },
	
	    checkAndPreventDefault: function checkAndPreventDefault(event, interactable, element) {
	      if (!(interactable = interactable || this.target)) {
	        return;
	      }
	
	      var options = interactable.options,
	          prevent = options.preventDefault;
	
	      if (prevent === 'auto' && element && !/^(input|select|textarea)$/i.test(event.target.nodeName)) {
	        // do not preventDefault on pointerdown if the prepared action is a drag
	        // and dragging can only start from a certain direction - this allows
	        // a touch to pan the viewport if a drag isn't in the right direction
	        if (/down|start/i.test(event.type) && this.prepared.name === 'drag' && options.drag.axis !== 'xy') {
	          return;
	        }
	
	        // with manualStart, only preventDefault while interacting
	        if (options[this.prepared.name] && options[this.prepared.name].manualStart && !this.interacting()) {
	          return;
	        }
	
	        event.preventDefault();
	        return;
	      }
	
	      if (prevent === 'always') {
	        event.preventDefault();
	        return;
	      }
	    },
	
	    calcInertia: function calcInertia(status) {
	      var inertiaOptions = this.target.options[this.prepared.name].inertia,
	          lambda = inertiaOptions.resistance,
	          inertiaDur = -Math.log(inertiaOptions.endSpeed / status.v0) / lambda;
	
	      status.x0 = this.prevEvent.pageX;
	      status.y0 = this.prevEvent.pageY;
	      status.t0 = status.startEvent.timeStamp / 1000;
	      status.sx = status.sy = 0;
	
	      status.modifiedXe = status.xe = (status.vx0 - inertiaDur) / lambda;
	      status.modifiedYe = status.ye = (status.vy0 - inertiaDur) / lambda;
	      status.te = inertiaDur;
	
	      status.lambda_v0 = lambda / status.v0;
	      status.one_ve_v0 = 1 - inertiaOptions.endSpeed / status.v0;
	    },
	
	    autoScrollMove: function autoScrollMove(pointer) {
	      if (!(this.interacting() && checkAutoScroll(this.target, this.prepared.name))) {
	        return;
	      }
	
	      if (this.inertiaStatus.active) {
	        autoScroll.x = autoScroll.y = 0;
	        return;
	      }
	
	      var top,
	          right,
	          bottom,
	          left,
	          options = this.target.options[this.prepared.name].autoScroll,
	          container = options.container || getWindow(this.element);
	
	      if (isWindow(container)) {
	        left = pointer.clientX < autoScroll.margin;
	        top = pointer.clientY < autoScroll.margin;
	        right = pointer.clientX > container.innerWidth - autoScroll.margin;
	        bottom = pointer.clientY > container.innerHeight - autoScroll.margin;
	      } else {
	        var rect = getElementClientRect(container);
	
	        left = pointer.clientX < rect.left + autoScroll.margin;
	        top = pointer.clientY < rect.top + autoScroll.margin;
	        right = pointer.clientX > rect.right - autoScroll.margin;
	        bottom = pointer.clientY > rect.bottom - autoScroll.margin;
	      }
	
	      autoScroll.x = right ? 1 : left ? -1 : 0;
	      autoScroll.y = bottom ? 1 : top ? -1 : 0;
	
	      if (!autoScroll.isScrolling) {
	        // set the autoScroll properties to those of the target
	        autoScroll.margin = options.margin;
	        autoScroll.speed = options.speed;
	
	        autoScroll.start(this);
	      }
	    },
	
	    _updateEventTargets: function _updateEventTargets(target, currentTarget) {
	      this._eventTarget = target;
	      this._curEventTarget = currentTarget;
	    }
	
	  };
	
	  function getInteractionFromPointer(pointer, eventType, eventTarget) {
	    var i = 0,
	        len = interactions.length,
	        mouseEvent = /mouse/i.test(pointer.pointerType || eventType)
	    // MSPointerEvent.MSPOINTER_TYPE_MOUSE
	    || pointer.pointerType === 4,
	        interaction;
	
	    var id = getPointerId(pointer);
	
	    // try to resume inertia with a new pointer
	    if (/down|start/i.test(eventType)) {
	      for (i = 0; i < len; i++) {
	        interaction = interactions[i];
	
	        var element = eventTarget;
	
	        if (interaction.inertiaStatus.active && interaction.target.options[interaction.prepared.name].inertia.allowResume && interaction.mouse === mouseEvent) {
	          while (element) {
	            // if the element is the interaction element
	            if (element === interaction.element) {
	              return interaction;
	            }
	            element = parentElement(element);
	          }
	        }
	      }
	    }
	
	    // if it's a mouse interaction
	    if (mouseEvent || !supportsTouch || supportsPointerEvent) {
	      // find a mouse interaction that's not in inertia phase
	      for (i = 0; i < len; i++) {
	        if (interactions[i].mouse && !interactions[i].inertiaStatus.active) {
	          return interactions[i];
	        }
	      }
	
	      // find any interaction specifically for mouse.
	      // if the eventType is a mousedown, and inertia is active
	      // ignore the interaction
	      for (i = 0; i < len; i++) {
	        if (interactions[i].mouse && !(/down/.test(eventType) && interactions[i].inertiaStatus.active)) {
	          return interaction;
	        }
	      }
	
	      // create a new interaction for mouse
	      interaction = new Interaction();
	      interaction.mouse = true;
	
	      return interaction;
	    }
	
	    // get interaction that has this pointer
	    for (i = 0; i < len; i++) {
	      if (contains(interactions[i].pointerIds, id)) {
	        return interactions[i];
	      }
	    }
	
	    // at this stage, a pointerUp should not return an interaction
	    if (/up|end|out/i.test(eventType)) {
	      return null;
	    }
	
	    // get first idle interaction
	    for (i = 0; i < len; i++) {
	      interaction = interactions[i];
	
	      if ((!interaction.prepared.name || interaction.target.options.gesture.enabled) && !interaction.interacting() && !(!mouseEvent && interaction.mouse)) {
	        return interaction;
	      }
	    }
	
	    return new Interaction();
	  }
	
	  function doOnInteractions(method) {
	    return function (event) {
	      var interaction,
	          eventTarget = getActualElement(event.path ? event.path[0] : event.target),
	          curEventTarget = getActualElement(event.currentTarget),
	          i;
	
	      if (supportsTouch && /touch/.test(event.type)) {
	        prevTouchTime = new Date().getTime();
	
	        for (i = 0; i < event.changedTouches.length; i++) {
	          var pointer = event.changedTouches[i];
	
	          interaction = getInteractionFromPointer(pointer, event.type, eventTarget);
	
	          if (!interaction) {
	            continue;
	          }
	
	          interaction._updateEventTargets(eventTarget, curEventTarget);
	
	          interaction[method](pointer, event, eventTarget, curEventTarget);
	        }
	      } else {
	        if (!supportsPointerEvent && /mouse/.test(event.type)) {
	          // ignore mouse events while touch interactions are active
	          for (i = 0; i < interactions.length; i++) {
	            if (!interactions[i].mouse && interactions[i].pointerIsDown) {
	              return;
	            }
	          }
	
	          // try to ignore mouse events that are simulated by the browser
	          // after a touch event
	          if (new Date().getTime() - prevTouchTime < 500) {
	            return;
	          }
	        }
	
	        interaction = getInteractionFromPointer(event, event.type, eventTarget);
	
	        if (!interaction) {
	          return;
	        }
	
	        interaction._updateEventTargets(eventTarget, curEventTarget);
	
	        interaction[method](event, event, eventTarget, curEventTarget);
	      }
	    };
	  }
	
	  function InteractEvent(interaction, event, action, phase, element, related) {
	    var client,
	        page,
	        target = interaction.target,
	        snapStatus = interaction.snapStatus,
	        restrictStatus = interaction.restrictStatus,
	        pointers = interaction.pointers,
	        deltaSource = (target && target.options || defaultOptions).deltaSource,
	        sourceX = deltaSource + 'X',
	        sourceY = deltaSource + 'Y',
	        options = target ? target.options : defaultOptions,
	        origin = getOriginXY(target, element),
	        starting = phase === 'start',
	        ending = phase === 'end',
	        coords = starting ? interaction.startCoords : interaction.curCoords;
	
	    element = element || interaction.element;
	
	    page = extend({}, coords.page);
	    client = extend({}, coords.client);
	
	    page.x -= origin.x;
	    page.y -= origin.y;
	
	    client.x -= origin.x;
	    client.y -= origin.y;
	
	    var relativePoints = options[action].snap && options[action].snap.relativePoints;
	
	    if (checkSnap(target, action) && !(starting && relativePoints && relativePoints.length)) {
	      this.snap = {
	        range: snapStatus.range,
	        locked: snapStatus.locked,
	        x: snapStatus.snappedX,
	        y: snapStatus.snappedY,
	        realX: snapStatus.realX,
	        realY: snapStatus.realY,
	        dx: snapStatus.dx,
	        dy: snapStatus.dy
	      };
	
	      if (snapStatus.locked) {
	        page.x += snapStatus.dx;
	        page.y += snapStatus.dy;
	        client.x += snapStatus.dx;
	        client.y += snapStatus.dy;
	      }
	    }
	
	    if (checkRestrict(target, action) && !(starting && options[action].restrict.elementRect) && restrictStatus.restricted) {
	      page.x += restrictStatus.dx;
	      page.y += restrictStatus.dy;
	      client.x += restrictStatus.dx;
	      client.y += restrictStatus.dy;
	
	      this.restrict = {
	        dx: restrictStatus.dx,
	        dy: restrictStatus.dy
	      };
	    }
	
	    this.pageX = page.x;
	    this.pageY = page.y;
	    this.clientX = client.x;
	    this.clientY = client.y;
	
	    this.x0 = interaction.startCoords.page.x - origin.x;
	    this.y0 = interaction.startCoords.page.y - origin.y;
	    this.clientX0 = interaction.startCoords.client.x - origin.x;
	    this.clientY0 = interaction.startCoords.client.y - origin.y;
	    this.ctrlKey = event.ctrlKey;
	    this.altKey = event.altKey;
	    this.shiftKey = event.shiftKey;
	    this.metaKey = event.metaKey;
	    this.button = event.button;
	    this.buttons = event.buttons;
	    this.target = element;
	    this.t0 = interaction.downTimes[0];
	    this.type = action + (phase || '');
	
	    this.interaction = interaction;
	    this.interactable = target;
	
	    var inertiaStatus = interaction.inertiaStatus;
	
	    if (inertiaStatus.active) {
	      this.detail = 'inertia';
	    }
	
	    if (related) {
	      this.relatedTarget = related;
	    }
	
	    // end event dx, dy is difference between start and end points
	    if (ending) {
	      if (deltaSource === 'client') {
	        this.dx = client.x - interaction.startCoords.client.x;
	        this.dy = client.y - interaction.startCoords.client.y;
	      } else {
	        this.dx = page.x - interaction.startCoords.page.x;
	        this.dy = page.y - interaction.startCoords.page.y;
	      }
	    } else if (starting) {
	      this.dx = 0;
	      this.dy = 0;
	    }
	    // copy properties from previousmove if starting inertia
	    else if (phase === 'inertiastart') {
	        this.dx = interaction.prevEvent.dx;
	        this.dy = interaction.prevEvent.dy;
	      } else {
	        if (deltaSource === 'client') {
	          this.dx = client.x - interaction.prevEvent.clientX;
	          this.dy = client.y - interaction.prevEvent.clientY;
	        } else {
	          this.dx = page.x - interaction.prevEvent.pageX;
	          this.dy = page.y - interaction.prevEvent.pageY;
	        }
	      }
	    if (interaction.prevEvent && interaction.prevEvent.detail === 'inertia' && !inertiaStatus.active && options[action].inertia && options[action].inertia.zeroResumeDelta) {
	      inertiaStatus.resumeDx += this.dx;
	      inertiaStatus.resumeDy += this.dy;
	
	      this.dx = this.dy = 0;
	    }
	
	    if (action === 'resize' && interaction.resizeAxes) {
	      if (options.resize.square) {
	        if (interaction.resizeAxes === 'y') {
	          this.dx = this.dy;
	        } else {
	          this.dy = this.dx;
	        }
	        this.axes = 'xy';
	      } else {
	        this.axes = interaction.resizeAxes;
	
	        if (interaction.resizeAxes === 'x') {
	          this.dy = 0;
	        } else if (interaction.resizeAxes === 'y') {
	          this.dx = 0;
	        }
	      }
	    } else if (action === 'gesture') {
	      this.touches = [pointers[0], pointers[1]];
	
	      if (starting) {
	        this.distance = touchDistance(pointers, deltaSource);
	        this.box = touchBBox(pointers);
	        this.scale = 1;
	        this.ds = 0;
	        this.angle = touchAngle(pointers, undefined, deltaSource);
	        this.da = 0;
	      } else if (ending || event instanceof InteractEvent) {
	        this.distance = interaction.prevEvent.distance;
	        this.box = interaction.prevEvent.box;
	        this.scale = interaction.prevEvent.scale;
	        this.ds = this.scale - 1;
	        this.angle = interaction.prevEvent.angle;
	        this.da = this.angle - interaction.gesture.startAngle;
	      } else {
	        this.distance = touchDistance(pointers, deltaSource);
	        this.box = touchBBox(pointers);
	        this.scale = this.distance / interaction.gesture.startDistance;
	        this.angle = touchAngle(pointers, interaction.gesture.prevAngle, deltaSource);
	
	        this.ds = this.scale - interaction.gesture.prevScale;
	        this.da = this.angle - interaction.gesture.prevAngle;
	      }
	    }
	
	    if (starting) {
	      this.timeStamp = interaction.downTimes[0];
	      this.dt = 0;
	      this.duration = 0;
	      this.speed = 0;
	      this.velocityX = 0;
	      this.velocityY = 0;
	    } else if (phase === 'inertiastart') {
	      this.timeStamp = interaction.prevEvent.timeStamp;
	      this.dt = interaction.prevEvent.dt;
	      this.duration = interaction.prevEvent.duration;
	      this.speed = interaction.prevEvent.speed;
	      this.velocityX = interaction.prevEvent.velocityX;
	      this.velocityY = interaction.prevEvent.velocityY;
	    } else {
	      this.timeStamp = new Date().getTime();
	      this.dt = this.timeStamp - interaction.prevEvent.timeStamp;
	      this.duration = this.timeStamp - interaction.downTimes[0];
	
	      if (event instanceof InteractEvent) {
	        var dx = this[sourceX] - interaction.prevEvent[sourceX],
	            dy = this[sourceY] - interaction.prevEvent[sourceY],
	            dt = this.dt / 1000;
	
	        this.speed = hypot(dx, dy) / dt;
	        this.velocityX = dx / dt;
	        this.velocityY = dy / dt;
	      }
	      // if normal move or end event, use previous user event coords
	      else {
	          // speed and velocity in pixels per second
	          this.speed = interaction.pointerDelta[deltaSource].speed;
	          this.velocityX = interaction.pointerDelta[deltaSource].vx;
	          this.velocityY = interaction.pointerDelta[deltaSource].vy;
	        }
	    }
	
	    if ((ending || phase === 'inertiastart') && interaction.prevEvent.speed > 600 && this.timeStamp - interaction.prevEvent.timeStamp < 150) {
	      var angle = 180 * Math.atan2(interaction.prevEvent.velocityY, interaction.prevEvent.velocityX) / Math.PI,
	          overlap = 22.5;
	
	      if (angle < 0) {
	        angle += 360;
	      }
	
	      var left = 135 - overlap <= angle && angle < 225 + overlap,
	          up = 225 - overlap <= angle && angle < 315 + overlap,
	          right = !left && (315 - overlap <= angle || angle < 45 + overlap),
	          down = !up && 45 - overlap <= angle && angle < 135 + overlap;
	
	      this.swipe = {
	        up: up,
	        down: down,
	        left: left,
	        right: right,
	        angle: angle,
	        speed: interaction.prevEvent.speed,
	        velocity: {
	          x: interaction.prevEvent.velocityX,
	          y: interaction.prevEvent.velocityY
	        }
	      };
	    }
	  }
	
	  InteractEvent.prototype = {
	    preventDefault: blank,
	    stopImmediatePropagation: function stopImmediatePropagation() {
	      this.immediatePropagationStopped = this.propagationStopped = true;
	    },
	    stopPropagation: function stopPropagation() {
	      this.propagationStopped = true;
	    }
	  };
	
	  function preventOriginalDefault() {
	    this.originalEvent.preventDefault();
	  }
	
	  function getActionCursor(action) {
	    var cursor = '';
	
	    if (action.name === 'drag') {
	      cursor = actionCursors.drag;
	    }
	    if (action.name === 'resize') {
	      if (action.axis) {
	        cursor = actionCursors[action.name + action.axis];
	      } else if (action.edges) {
	        var cursorKey = 'resize',
	            edgeNames = ['top', 'bottom', 'left', 'right'];
	
	        for (var i = 0; i < 4; i++) {
	          if (action.edges[edgeNames[i]]) {
	            cursorKey += edgeNames[i];
	          }
	        }
	
	        cursor = actionCursors[cursorKey];
	      }
	    }
	
	    return cursor;
	  }
	
	  function checkResizeEdge(name, value, page, element, interactableElement, rect, margin) {
	    // false, '', undefined, null
	    if (!value) {
	      return false;
	    }
	
	    // true value, use pointer coords and element rect
	    if (value === true) {
	      // if dimensions are negative, "switch" edges
	      var width = isNumber(rect.width) ? rect.width : rect.right - rect.left,
	          height = isNumber(rect.height) ? rect.height : rect.bottom - rect.top;
	
	      if (width < 0) {
	        if (name === 'left') {
	          name = 'right';
	        } else if (name === 'right') {
	          name = 'left';
	        }
	      }
	      if (height < 0) {
	        if (name === 'top') {
	          name = 'bottom';
	        } else if (name === 'bottom') {
	          name = 'top';
	        }
	      }
	
	      if (name === 'left') {
	        return page.x < (width >= 0 ? rect.left : rect.right) + margin;
	      }
	      if (name === 'top') {
	        return page.y < (height >= 0 ? rect.top : rect.bottom) + margin;
	      }
	
	      if (name === 'right') {
	        return page.x > (width >= 0 ? rect.right : rect.left) - margin;
	      }
	      if (name === 'bottom') {
	        return page.y > (height >= 0 ? rect.bottom : rect.top) - margin;
	      }
	    }
	
	    // the remaining checks require an element
	    if (!isElement(element)) {
	      return false;
	    }
	
	    return isElement(value)
	    // the value is an element to use as a resize handle
	    ? value === element
	    // otherwise check if element matches value as selector
	    : matchesUpTo(element, value, interactableElement);
	  }
	
	  function defaultActionChecker(pointer, interaction, element) {
	    var rect = this.getRect(element),
	        shouldResize = false,
	        action = null,
	        resizeAxes = null,
	        resizeEdges,
	        page = extend({}, interaction.curCoords.page),
	        options = this.options;
	
	    if (!rect) {
	      return null;
	    }
	
	    if (actionIsEnabled.resize && options.resize.enabled) {
	      var resizeOptions = options.resize;
	
	      resizeEdges = {
	        left: false, right: false, top: false, bottom: false
	      };
	
	      // if using resize.edges
	      if (isObject(resizeOptions.edges)) {
	        for (var edge in resizeEdges) {
	          resizeEdges[edge] = checkResizeEdge(edge, resizeOptions.edges[edge], page, interaction._eventTarget, element, rect, resizeOptions.margin || margin);
	        }
	
	        resizeEdges.left = resizeEdges.left && !resizeEdges.right;
	        resizeEdges.top = resizeEdges.top && !resizeEdges.bottom;
	
	        shouldResize = resizeEdges.left || resizeEdges.right || resizeEdges.top || resizeEdges.bottom;
	      } else {
	        var right = options.resize.axis !== 'y' && page.x > rect.right - margin,
	            bottom = options.resize.axis !== 'x' && page.y > rect.bottom - margin;
	
	        shouldResize = right || bottom;
	        resizeAxes = (right ? 'x' : '') + (bottom ? 'y' : '');
	      }
	    }
	
	    action = shouldResize ? 'resize' : actionIsEnabled.drag && options.drag.enabled ? 'drag' : null;
	
	    if (actionIsEnabled.gesture && interaction.pointerIds.length >= 2 && !(interaction.dragging || interaction.resizing)) {
	      action = 'gesture';
	    }
	
	    if (action) {
	      return {
	        name: action,
	        axis: resizeAxes,
	        edges: resizeEdges
	      };
	    }
	
	    return null;
	  }
	
	  // Check if action is enabled globally and the current target supports it
	  // If so, return the validated action. Otherwise, return null
	  function validateAction(action, interactable) {
	    if (!isObject(action)) {
	      return null;
	    }
	
	    var actionName = action.name,
	        options = interactable.options;
	
	    if ((actionName === 'resize' && options.resize.enabled || actionName === 'drag' && options.drag.enabled || actionName === 'gesture' && options.gesture.enabled) && actionIsEnabled[actionName]) {
	      if (actionName === 'resize' || actionName === 'resizeyx') {
	        actionName = 'resizexy';
	      }
	
	      return action;
	    }
	    return null;
	  }
	
	  var listeners = {},
	      interactionListeners = ['dragStart', 'dragMove', 'resizeStart', 'resizeMove', 'gestureStart', 'gestureMove', 'pointerOver', 'pointerOut', 'pointerHover', 'selectorDown', 'pointerDown', 'pointerMove', 'pointerUp', 'pointerCancel', 'pointerEnd', 'addPointer', 'removePointer', 'recordPointer', 'autoScrollMove'];
	
	  for (var i = 0, len = interactionListeners.length; i < len; i++) {
	    var name = interactionListeners[i];
	
	    listeners[name] = doOnInteractions(name);
	  }
	
	  // bound to the interactable context when a DOM event
	  // listener is added to a selector interactable
	  function delegateListener(event, useCapture) {
	    var fakeEvent = {},
	        delegated = delegatedEvents[event.type],
	        eventTarget = getActualElement(event.path ? event.path[0] : event.target),
	        element = eventTarget;
	
	    useCapture = useCapture ? true : false;
	
	    // duplicate the event so that currentTarget can be changed
	    for (var prop in event) {
	      fakeEvent[prop] = event[prop];
	    }
	
	    fakeEvent.originalEvent = event;
	    fakeEvent.preventDefault = preventOriginalDefault;
	
	    // climb up document tree looking for selector matches
	    while (isElement(element)) {
	      for (var i = 0; i < delegated.selectors.length; i++) {
	        var selector = delegated.selectors[i],
	            context = delegated.contexts[i];
	
	        if (matchesSelector(element, selector) && nodeContains(context, eventTarget) && nodeContains(context, element)) {
	          var listeners = delegated.listeners[i];
	
	          fakeEvent.currentTarget = element;
	
	          for (var j = 0; j < listeners.length; j++) {
	            if (listeners[j][1] === useCapture) {
	              listeners[j][0](fakeEvent);
	            }
	          }
	        }
	      }
	
	      element = parentElement(element);
	    }
	  }
	
	  function delegateUseCapture(event) {
	    return delegateListener.call(this, event, true);
	  }
	
	  interactables.indexOfElement = function indexOfElement(element, context) {
	    context = context || document;
	
	    for (var i = 0; i < this.length; i++) {
	      var interactable = this[i];
	
	      if (interactable.selector === element && interactable._context === context || !interactable.selector && interactable._element === element) {
	        return i;
	      }
	    }
	    return -1;
	  };
	
	  interactables.get = function interactableGet(element, options) {
	    return this[this.indexOfElement(element, options && options.context)];
	  };
	
	  interactables.forEachSelector = function (callback) {
	    for (var i = 0; i < this.length; i++) {
	      var interactable = this[i];
	
	      if (!interactable.selector) {
	        continue;
	      }
	
	      var ret = callback(interactable, interactable.selector, interactable._context, i, this);
	
	      if (ret !== undefined) {
	        return ret;
	      }
	    }
	  };
	
	  /* \
	   * interact
	   [ method ]
	   *
	   * The methods of this variable can be used to set elements as
	   * interactables and also to change various default settings.
	   *
	   * Calling it as a function and passing an element or a valid CSS selector
	   * string returns an Interactable object which has various methods to
	   * configure it.
	   *
	   - element (Element | string) The HTML or SVG Element to interact with or CSS selector
	   = (object) An @Interactable
	   *
	   > Usage
	   | interact(document.getElementById('draggable')).draggable(true);
	   |
	   | var rectables = interact('rect');
	   | rectables
	   |     .gesturable(true)
	   |     .on('gesturemove', function (event) {
	   |         // something cool...
	   |     })
	   |     .autoScroll(true);
	  \*/
	  function interact(element, options) {
	    return interactables.get(element, options) || new Interactable(element, options);
	  }
	
	  /* \
	   * Interactable
	   [ property ]
	   **
	   * Object type returned by @interact
	  \*/
	  function Interactable(element, options) {
	    this._element = element;
	    this._iEvents = this._iEvents || {};
	
	    var _window;
	
	    if (trySelector(element)) {
	      this.selector = element;
	
	      var context = options && options.context;
	
	      _window = context ? getWindow(context) : window;
	
	      if (context && (_window.Node ? context instanceof _window.Node : isElement(context) || context === _window.document)) {
	        this._context = context;
	      }
	    } else {
	      _window = getWindow(element);
	
	      if (isElement(element, _window)) {
	        if (supportsPointerEvent) {
	          events.add(this._element, pEventTypes.down, listeners.pointerDown);
	          events.add(this._element, pEventTypes.move, listeners.pointerHover);
	        } else {
	          events.add(this._element, 'mousedown', listeners.pointerDown);
	          events.add(this._element, 'mousemove', listeners.pointerHover);
	          events.add(this._element, 'touchstart', listeners.pointerDown);
	          events.add(this._element, 'touchmove', listeners.pointerHover);
	        }
	      }
	    }
	
	    this._doc = _window.document;
	
	    if (!contains(documents, this._doc)) {
	      listenToDocument(this._doc);
	    }
	
	    interactables.push(this);
	
	    this.set(options);
	  }
	
	  Interactable.prototype = {
	    setOnEvents: function setOnEvents(action, phases) {
	      if (action === 'drop') {
	        if (isFunction(phases.ondrop)) {
	          this.ondrop = phases.ondrop;
	        }
	        if (isFunction(phases.ondropactivate)) {
	          this.ondropactivate = phases.ondropactivate;
	        }
	        if (isFunction(phases.ondropdeactivate)) {
	          this.ondropdeactivate = phases.ondropdeactivate;
	        }
	        if (isFunction(phases.ondragenter)) {
	          this.ondragenter = phases.ondragenter;
	        }
	        if (isFunction(phases.ondragleave)) {
	          this.ondragleave = phases.ondragleave;
	        }
	        if (isFunction(phases.ondropmove)) {
	          this.ondropmove = phases.ondropmove;
	        }
	      } else {
	        action = 'on' + action;
	
	        if (isFunction(phases.onstart)) {
	          this[action + 'start'] = phases.onstart;
	        }
	        if (isFunction(phases.onmove)) {
	          this[action + 'move'] = phases.onmove;
	        }
	        if (isFunction(phases.onend)) {
	          this[action + 'end'] = phases.onend;
	        }
	        if (isFunction(phases.oninertiastart)) {
	          this[action + 'inertiastart'] = phases.oninertiastart;
	        }
	      }
	
	      return this;
	    },
	
	    /* \
	     * Interactable.draggable
	     [ method ]
	     *
	     * Gets or sets whether drag actions can be performed on the
	     * Interactable
	     *
	     = (boolean) Indicates if this can be the target of drag events
	     | var isDraggable = interact('ul li').draggable();
	     * or
	     - options (boolean | object) #optional true/false or An object with event listeners to be fired on drag events (object makes the Interactable draggable)
	     = (object) This Interactable
	     | interact(element).draggable({
	     |     onstart: function (event) {},
	     |     onmove : function (event) {},
	     |     onend  : function (event) {},
	     |
	     |     // the axis in which the first movement must be
	     |     // for the drag sequence to start
	     |     // 'xy' by default - any direction
	     |     axis: 'x' || 'y' || 'xy',
	     |
	     |     // max number of drags that can happen concurrently
	     |     // with elements of this Interactable. Infinity by default
	     |     max: Infinity,
	     |
	     |     // max number of drags that can target the same element+Interactable
	     |     // 1 by default
	     |     maxPerElement: 2
	     | });
	    \*/
	    draggable: function draggable(options) {
	      if (isObject(options)) {
	        this.options.drag.enabled = options.enabled === false ? false : true;
	        this.setPerAction('drag', options);
	        this.setOnEvents('drag', options);
	
	        if (/^x$|^y$|^xy$/.test(options.axis)) {
	          this.options.drag.axis = options.axis;
	        } else if (options.axis === null) {
	          delete this.options.drag.axis;
	        }
	
	        return this;
	      }
	
	      if (isBool(options)) {
	        this.options.drag.enabled = options;
	
	        return this;
	      }
	
	      return this.options.drag;
	    },
	
	    setPerAction: function setPerAction(action, options) {
	      // for all the default per-action options
	      for (var option in options) {
	        // if this option exists for this action
	        if (option in defaultOptions[action]) {
	          // if the option in the options arg is an object value
	          if (isObject(options[option])) {
	            // duplicate the object
	            this.options[action][option] = extend(this.options[action][option] || {}, options[option]);
	
	            if (isObject(defaultOptions.perAction[option]) && 'enabled' in defaultOptions.perAction[option]) {
	              this.options[action][option].enabled = options[option].enabled === false ? false : true;
	            }
	          } else if (isBool(options[option]) && isObject(defaultOptions.perAction[option])) {
	            this.options[action][option].enabled = options[option];
	          } else if (options[option] !== undefined) {
	            // or if it's not undefined, do a plain assignment
	            this.options[action][option] = options[option];
	          }
	        }
	      }
	    },
	
	    /* \
	     * Interactable.dropzone
	     [ method ]
	     *
	     * Returns or sets whether elements can be dropped onto this
	     * Interactable to trigger drop events
	     *
	     * Dropzones can receive the following events:
	     *  - `dropactivate` and `dropdeactivate` when an acceptable drag starts and ends
	     *  - `dragenter` and `dragleave` when a draggable enters and leaves the dropzone
	     *  - `dragmove` when a draggable that has entered the dropzone is moved
	     *  - `drop` when a draggable is dropped into this dropzone
	     *
	     *  Use the `accept` option to allow only elements that match the given CSS selector or element.
	     *
	     *  Use the `overlap` option to set how drops are checked for. The allowed values are:
	     *   - `'pointer'`, the pointer must be over the dropzone (default)
	     *   - `'center'`, the draggable element's center must be over the dropzone
	     *   - a number from 0-1 which is the `(intersection area) / (draggable area)`.
	     *       e.g. `0.5` for drop to happen when half of the area of the
	     *       draggable is over the dropzone
	     *
	     - options (boolean | object | null) #optional The new value to be set.
	     | interact('.drop').dropzone({
	     |   accept: '.can-drop' || document.getElementById('single-drop'),
	     |   overlap: 'pointer' || 'center' || zeroToOne
	     | }
	     = (boolean | object) The current setting or this Interactable
	    \*/
	    dropzone: function dropzone(options) {
	      if (isObject(options)) {
	        this.options.drop.enabled = options.enabled === false ? false : true;
	        this.setOnEvents('drop', options);
	
	        if (/^(pointer|center)$/.test(options.overlap)) {
	          this.options.drop.overlap = options.overlap;
	        } else if (isNumber(options.overlap)) {
	          this.options.drop.overlap = Math.max(Math.min(1, options.overlap), 0);
	        }
	        if ('accept' in options) {
	          this.options.drop.accept = options.accept;
	        }
	        if ('checker' in options) {
	          this.options.drop.checker = options.checker;
	        }
	
	        return this;
	      }
	
	      if (isBool(options)) {
	        this.options.drop.enabled = options;
	
	        return this;
	      }
	
	      return this.options.drop;
	    },
	
	    dropCheck: function dropCheck(dragEvent, event, draggable, draggableElement, dropElement, rect) {
	      var dropped = false;
	
	      // if the dropzone has no rect (eg. display: none)
	      // call the custom dropChecker or just return false
	      if (!(rect = rect || this.getRect(dropElement))) {
	        return this.options.drop.checker ? this.options.drop.checker(dragEvent, event, dropped, this, dropElement, draggable, draggableElement) : false;
	      }
	
	      var dropOverlap = this.options.drop.overlap;
	
	      if (dropOverlap === 'pointer') {
	        var page = _getPageXY(dragEvent),
	            origin = getOriginXY(draggable, draggableElement),
	            horizontal,
	            vertical;
	
	        page.x += origin.x;
	        page.y += origin.y;
	
	        horizontal = page.x > rect.left && page.x < rect.right;
	        vertical = page.y > rect.top && page.y < rect.bottom;
	
	        dropped = horizontal && vertical;
	      }
	
	      var dragRect = draggable.getRect(draggableElement);
	
	      if (dropOverlap === 'center') {
	        var cx = dragRect.left + dragRect.width / 2,
	            cy = dragRect.top + dragRect.height / 2;
	
	        dropped = cx >= rect.left && cx <= rect.right && cy >= rect.top && cy <= rect.bottom;
	      }
	
	      if (isNumber(dropOverlap)) {
	        var overlapArea = Math.max(0, Math.min(rect.right, dragRect.right) - Math.max(rect.left, dragRect.left)) * Math.max(0, Math.min(rect.bottom, dragRect.bottom) - Math.max(rect.top, dragRect.top)),
	            overlapRatio = overlapArea / (dragRect.width * dragRect.height);
	
	        dropped = overlapRatio >= dropOverlap;
	      }
	
	      if (this.options.drop.checker) {
	        dropped = this.options.drop.checker(dragEvent, event, dropped, this, dropElement, draggable, draggableElement);
	      }
	
	      return dropped;
	    },
	
	    /* \
	     * Interactable.dropChecker
	     [ method ]
	     *
	     * DEPRECATED. Use interactable.dropzone({ checker: function... }) instead.
	     *
	     * Gets or sets the function used to check if a dragged element is
	     * over this Interactable.
	     *
	     - checker (function) #optional The function that will be called when checking for a drop
	     = (Function | Interactable) The checker function or this Interactable
	     *
	     * The checker function takes the following arguments:
	     *
	     - dragEvent (InteractEvent) The related dragmove or dragend event
	     - event (TouchEvent | PointerEvent | MouseEvent) The user move/up/end Event related to the dragEvent
	     - dropped (boolean) The value from the default drop checker
	     - dropzone (Interactable) The dropzone interactable
	     - dropElement (Element) The dropzone element
	     - draggable (Interactable) The Interactable being dragged
	     - draggableElement (Element) The actual element that's being dragged
	     *
	     > Usage:
	     | interact(target)
	     | .dropChecker(function(dragEvent,         // related dragmove or dragend event
	     |                       event,             // TouchEvent/PointerEvent/MouseEvent
	     |                       dropped,           // bool result of the default checker
	     |                       dropzone,          // dropzone Interactable
	     |                       dropElement,       // dropzone elemnt
	     |                       draggable,         // draggable Interactable
	     |                       draggableElement) {// draggable element
	     |
	     |   return dropped && event.target.hasAttribute('allow-drop');
	     | }
	    \*/
	    dropChecker: function dropChecker(checker) {
	      if (isFunction(checker)) {
	        this.options.drop.checker = checker;
	
	        return this;
	      }
	      if (checker === null) {
	        delete this.options.getRect;
	
	        return this;
	      }
	
	      return this.options.drop.checker;
	    },
	
	    /* \
	     * Interactable.accept
	     [ method ]
	     *
	     * Deprecated. add an `accept` property to the options object passed to
	     * @Interactable.dropzone instead.
	     *
	     * Gets or sets the Element or CSS selector match that this
	     * Interactable accepts if it is a dropzone.
	     *
	     - newValue (Element | string | null) #optional
	     * If it is an Element, then only that element can be dropped into this dropzone.
	     * If it is a string, the element being dragged must match it as a selector.
	     * If it is null, the accept options is cleared - it accepts any element.
	     *
	     = (string | Element | null | Interactable) The current accept option if given `undefined` or this Interactable
	    \*/
	    accept: function accept(newValue) {
	      if (isElement(newValue)) {
	        this.options.drop.accept = newValue;
	
	        return this;
	      }
	
	      // test if it is a valid CSS selector
	      if (trySelector(newValue)) {
	        this.options.drop.accept = newValue;
	
	        return this;
	      }
	
	      if (newValue === null) {
	        delete this.options.drop.accept;
	
	        return this;
	      }
	
	      return this.options.drop.accept;
	    },
	
	    /* \
	     * Interactable.resizable
	     [ method ]
	     *
	     * Gets or sets whether resize actions can be performed on the
	     * Interactable
	     *
	     = (boolean) Indicates if this can be the target of resize elements
	     | var isResizeable = interact('input[type=text]').resizable();
	     * or
	     - options (boolean | object) #optional true/false or An object with event listeners to be fired on resize events (object makes the Interactable resizable)
	     = (object) This Interactable
	     | interact(element).resizable({
	     |     onstart: function (event) {},
	     |     onmove : function (event) {},
	     |     onend  : function (event) {},
	     |
	     |     edges: {
	     |       top   : true,       // Use pointer coords to check for resize.
	     |       left  : false,      // Disable resizing from left edge.
	     |       bottom: '.resize-s',// Resize if pointer target matches selector
	     |       right : handleEl    // Resize if pointer target is the given Element
	     |     },
	     |
	     |     // Width and height can be adjusted independently. When `true`, width and
	     |     // height are adjusted at a 1:1 ratio.
	     |     square: false,
	     |
	     |     // Width and height can be adjusted independently. When `true`, width and
	     |     // height maintain the aspect ratio they had when resizing started.
	     |     preserveAspectRatio: false,
	     |
	     |     // a value of 'none' will limit the resize rect to a minimum of 0x0
	     |     // 'negate' will allow the rect to have negative width/height
	     |     // 'reposition' will keep the width/height positive by swapping
	     |     // the top and bottom edges and/or swapping the left and right edges
	     |     invert: 'none' || 'negate' || 'reposition'
	     |
	     |     // limit multiple resizes.
	     |     // See the explanation in the @Interactable.draggable example
	     |     max: Infinity,
	     |     maxPerElement: 1,
	     | });
	    \*/
	    resizable: function resizable(options) {
	      if (isObject(options)) {
	        this.options.resize.enabled = options.enabled === false ? false : true;
	        this.setPerAction('resize', options);
	        this.setOnEvents('resize', options);
	
	        if (/^x$|^y$|^xy$/.test(options.axis)) {
	          this.options.resize.axis = options.axis;
	        } else if (options.axis === null) {
	          this.options.resize.axis = defaultOptions.resize.axis;
	        }
	
	        if (isBool(options.preserveAspectRatio)) {
	          this.options.resize.preserveAspectRatio = options.preserveAspectRatio;
	        } else if (isBool(options.square)) {
	          this.options.resize.square = options.square;
	        }
	
	        return this;
	      }
	      if (isBool(options)) {
	        this.options.resize.enabled = options;
	
	        return this;
	      }
	      return this.options.resize;
	    },
	
	    /* \
	     * Interactable.squareResize
	     [ method ]
	     *
	     * Deprecated. Add a `square: true || false` property to @Interactable.resizable instead
	     *
	     * Gets or sets whether resizing is forced 1:1 aspect
	     *
	     = (boolean) Current setting
	     *
	     * or
	     *
	     - newValue (boolean) #optional
	     = (object) this Interactable
	    \*/
	    squareResize: function squareResize(newValue) {
	      if (isBool(newValue)) {
	        this.options.resize.square = newValue;
	
	        return this;
	      }
	
	      if (newValue === null) {
	        delete this.options.resize.square;
	
	        return this;
	      }
	
	      return this.options.resize.square;
	    },
	
	    /* \
	     * Interactable.gesturable
	     [ method ]
	     *
	     * Gets or sets whether multitouch gestures can be performed on the
	     * Interactable's element
	     *
	     = (boolean) Indicates if this can be the target of gesture events
	     | var isGestureable = interact(element).gesturable();
	     * or
	     - options (boolean | object) #optional true/false or An object with event listeners to be fired on gesture events (makes the Interactable gesturable)
	     = (object) this Interactable
	     | interact(element).gesturable({
	     |     onstart: function (event) {},
	     |     onmove : function (event) {},
	     |     onend  : function (event) {},
	     |
	     |     // limit multiple gestures.
	     |     // See the explanation in @Interactable.draggable example
	     |     max: Infinity,
	     |     maxPerElement: 1,
	     | });
	    \*/
	    gesturable: function gesturable(options) {
	      if (isObject(options)) {
	        this.options.gesture.enabled = options.enabled === false ? false : true;
	        this.setPerAction('gesture', options);
	        this.setOnEvents('gesture', options);
	
	        return this;
	      }
	
	      if (isBool(options)) {
	        this.options.gesture.enabled = options;
	
	        return this;
	      }
	
	      return this.options.gesture;
	    },
	
	    /* \
	     * Interactable.autoScroll
	     [ method ]
	     **
	     * Deprecated. Add an `autoscroll` property to the options object
	     * passed to @Interactable.draggable or @Interactable.resizable instead.
	     *
	     * Returns or sets whether dragging and resizing near the edges of the
	     * window/container trigger autoScroll for this Interactable
	     *
	     = (object) Object with autoScroll properties
	     *
	     * or
	     *
	     - options (object | boolean) #optional
	     * options can be:
	     * - an object with margin, distance and interval properties,
	     * - true or false to enable or disable autoScroll or
	     = (Interactable) this Interactable
	    \*/
	    autoScroll: function autoScroll(options) {
	      if (isObject(options)) {
	        options = extend({ actions: ['drag', 'resize'] }, options);
	      } else if (isBool(options)) {
	        options = { actions: ['drag', 'resize'], enabled: options };
	      }
	
	      return this.setOptions('autoScroll', options);
	    },
	
	    /* \
	     * Interactable.snap
	     [ method ]
	     **
	     * Deprecated. Add a `snap` property to the options object passed
	     * to @Interactable.draggable or @Interactable.resizable instead.
	     *
	     * Returns or sets if and how action coordinates are snapped. By
	     * default, snapping is relative to the pointer coordinates. You can
	     * change this by setting the
	     * [`elementOrigin`](https://github.com/taye/interact.js/pull/72).
	     **
	     = (boolean | object) `false` if snap is disabled; object with snap properties if snap is enabled
	     **
	     * or
	     **
	     - options (object | boolean | null) #optional
	     = (Interactable) this Interactable
	     > Usage
	     | interact(document.querySelector('#thing')).snap({
	     |     targets: [
	     |         // snap to this specific point
	     |         {
	     |             x: 100,
	     |             y: 100,
	     |             range: 25
	     |         },
	     |         // give this function the x and y page coords and snap to the object returned
	     |         function (x, y) {
	     |             return {
	     |                 x: x,
	     |                 y: (75 + 50 * Math.sin(x * 0.04)),
	     |                 range: 40
	     |             };
	     |         },
	     |         // create a function that snaps to a grid
	     |         interact.createSnapGrid({
	     |             x: 50,
	     |             y: 50,
	     |             range: 10,              // optional
	     |             offset: { x: 5, y: 10 } // optional
	     |         })
	     |     ],
	     |     // do not snap during normal movement.
	     |     // Instead, trigger only one snapped move event
	     |     // immediately before the end event.
	     |     endOnly: true,
	     |
	     |     relativePoints: [
	     |         { x: 0, y: 0 },  // snap relative to the top left of the element
	     |         { x: 1, y: 1 },  // and also to the bottom right
	     |     ],
	     |
	     |     // offset the snap target coordinates
	     |     // can be an object with x/y or 'startCoords'
	     |     offset: { x: 50, y: 50 }
	     |   }
	     | });
	    \*/
	    snap: function snap(options) {
	      var ret = this.setOptions('snap', options);
	
	      if (ret === this) {
	        return this;
	      }
	
	      return ret.drag;
	    },
	
	    setOptions: function setOptions(option, options) {
	      var actions = options && isArray(options.actions) ? options.actions : ['drag'];
	
	      var i;
	
	      if (isObject(options) || isBool(options)) {
	        for (i = 0; i < actions.length; i++) {
	          var action = /resize/.test(actions[i]) ? 'resize' : actions[i];
	
	          if (!isObject(this.options[action])) {
	            continue;
	          }
	
	          var thisOption = this.options[action][option];
	
	          if (isObject(options)) {
	            extend(thisOption, options);
	            thisOption.enabled = options.enabled === false ? false : true;
	
	            if (option === 'snap') {
	              if (thisOption.mode === 'grid') {
	                thisOption.targets = [interact.createSnapGrid(extend({
	                  offset: thisOption.gridOffset || { x: 0, y: 0 }
	                }, thisOption.grid || {}))];
	              } else if (thisOption.mode === 'anchor') {
	                thisOption.targets = thisOption.anchors;
	              } else if (thisOption.mode === 'path') {
	                thisOption.targets = thisOption.paths;
	              }
	
	              if ('elementOrigin' in options) {
	                thisOption.relativePoints = [options.elementOrigin];
	              }
	            }
	          } else if (isBool(options)) {
	            thisOption.enabled = options;
	          }
	        }
	
	        return this;
	      }
	
	      var ret = {},
	          allActions = ['drag', 'resize', 'gesture'];
	
	      for (i = 0; i < allActions.length; i++) {
	        if (option in defaultOptions[allActions[i]]) {
	          ret[allActions[i]] = this.options[allActions[i]][option];
	        }
	      }
	
	      return ret;
	    },
	
	    /* \
	     * Interactable.inertia
	     [ method ]
	     **
	     * Deprecated. Add an `inertia` property to the options object passed
	     * to @Interactable.draggable or @Interactable.resizable instead.
	     *
	     * Returns or sets if and how events continue to run after the pointer is released
	     **
	     = (boolean | object) `false` if inertia is disabled; `object` with inertia properties if inertia is enabled
	     **
	     * or
	     **
	     - options (object | boolean | null) #optional
	     = (Interactable) this Interactable
	     > Usage
	     | // enable and use default settings
	     | interact(element).inertia(true);
	     |
	     | // enable and use custom settings
	     | interact(element).inertia({
	     |     // value greater than 0
	     |     // high values slow the object down more quickly
	     |     resistance     : 16,
	     |
	     |     // the minimum launch speed (pixels per second) that results in inertia start
	     |     minSpeed       : 200,
	     |
	     |     // inertia will stop when the object slows down to this speed
	     |     endSpeed       : 20,
	     |
	     |     // boolean; should actions be resumed when the pointer goes down during inertia
	     |     allowResume    : true,
	     |
	     |     // boolean; should the jump when resuming from inertia be ignored in event.dx/dy
	     |     zeroResumeDelta: false,
	     |
	     |     // if snap/restrict are set to be endOnly and inertia is enabled, releasing
	     |     // the pointer without triggering inertia will animate from the release
	     |     // point to the snaped/restricted point in the given amount of time (ms)
	     |     smoothEndDuration: 300,
	     |
	     |     // an array of action types that can have inertia (no gesture)
	     |     actions        : ['drag', 'resize']
	     | });
	     |
	     | // reset custom settings and use all defaults
	     | interact(element).inertia(null);
	    \*/
	    inertia: function inertia(options) {
	      var ret = this.setOptions('inertia', options);
	
	      if (ret === this) {
	        return this;
	      }
	
	      return ret.drag;
	    },
	
	    getAction: function getAction(pointer, event, interaction, element) {
	      var action = this.defaultActionChecker(pointer, interaction, element);
	
	      if (this.options.actionChecker) {
	        return this.options.actionChecker(pointer, event, action, this, element, interaction);
	      }
	
	      return action;
	    },
	
	    defaultActionChecker: defaultActionChecker,
	
	    /* \
	     * Interactable.actionChecker
	     [ method ]
	     *
	     * Gets or sets the function used to check action to be performed on
	     * pointerDown
	     *
	     - checker (function | null) #optional A function which takes a pointer event, defaultAction string, interactable, element and interaction as parameters and returns an object with name property 'drag' 'resize' or 'gesture' and optionally an `edges` object with boolean 'top', 'left', 'bottom' and right props.
	     = (Function | Interactable) The checker function or this Interactable
	     *
	     | interact('.resize-drag')
	     |   .resizable(true)
	     |   .draggable(true)
	     |   .actionChecker(function (pointer, event, action, interactable, element, interaction) {
	     |
	     |   if (interact.matchesSelector(event.target, '.drag-handle') {
	     |     // force drag with handle target
	     |     action.name = drag;
	     |   }
	     |   else {
	     |     // resize from the top and right edges
	     |     action.name  = 'resize';
	     |     action.edges = { top: true, right: true };
	     |   }
	     |
	     |   return action;
	     | });
	    \*/
	    actionChecker: function actionChecker(checker) {
	      if (isFunction(checker)) {
	        this.options.actionChecker = checker;
	
	        return this;
	      }
	
	      if (checker === null) {
	        delete this.options.actionChecker;
	
	        return this;
	      }
	
	      return this.options.actionChecker;
	    },
	
	    /* \
	     * Interactable.getRect
	     [ method ]
	     *
	     * The default function to get an Interactables bounding rect. Can be
	     * overridden using @Interactable.rectChecker.
	     *
	     - element (Element) #optional The element to measure.
	     = (object) The object's bounding rectangle.
	     o {
	     o     top   : 0,
	     o     left  : 0,
	     o     bottom: 0,
	     o     right : 0,
	     o     width : 0,
	     o     height: 0
	     o }
	    \*/
	    getRect: function rectCheck(element) {
	      element = element || this._element;
	
	      if (this.selector && !isElement(element)) {
	        element = this._context.querySelector(this.selector);
	      }
	
	      return getElementRect(element);
	    },
	
	    /* \
	     * Interactable.rectChecker
	     [ method ]
	     *
	     * Returns or sets the function used to calculate the interactable's
	     * element's rectangle
	     *
	     - checker (function) #optional A function which returns this Interactable's bounding rectangle. See @Interactable.getRect
	     = (function | object) The checker function or this Interactable
	    \*/
	    rectChecker: function rectChecker(checker) {
	      if (isFunction(checker)) {
	        this.getRect = checker;
	
	        return this;
	      }
	
	      if (checker === null) {
	        delete this.options.getRect;
	
	        return this;
	      }
	
	      return this.getRect;
	    },
	
	    /* \
	     * Interactable.styleCursor
	     [ method ]
	     *
	     * Returns or sets whether the action that would be performed when the
	     * mouse on the element are checked on `mousemove` so that the cursor
	     * may be styled appropriately
	     *
	     - newValue (boolean) #optional
	     = (boolean | Interactable) The current setting or this Interactable
	    \*/
	    styleCursor: function styleCursor(newValue) {
	      if (isBool(newValue)) {
	        this.options.styleCursor = newValue;
	
	        return this;
	      }
	
	      if (newValue === null) {
	        delete this.options.styleCursor;
	
	        return this;
	      }
	
	      return this.options.styleCursor;
	    },
	
	    /* \
	     * Interactable.preventDefault
	     [ method ]
	     *
	     * Returns or sets whether to prevent the browser's default behaviour
	     * in response to pointer events. Can be set to:
	     *  - `'always'` to always prevent
	     *  - `'never'` to never prevent
	     *  - `'auto'` to let interact.js try to determine what would be best
	     *
	     - newValue (string) #optional `true`, `false` or `'auto'`
	     = (string | Interactable) The current setting or this Interactable
	    \*/
	    preventDefault: function preventDefault(newValue) {
	      if (/^(always|never|auto)$/.test(newValue)) {
	        this.options.preventDefault = newValue;
	        return this;
	      }
	
	      if (isBool(newValue)) {
	        this.options.preventDefault = newValue ? 'always' : 'never';
	        return this;
	      }
	
	      return this.options.preventDefault;
	    },
	
	    /* \
	     * Interactable.origin
	     [ method ]
	     *
	     * Gets or sets the origin of the Interactable's element.  The x and y
	     * of the origin will be subtracted from action event coordinates.
	     *
	     - origin (object | string) #optional An object eg. { x: 0, y: 0 } or string 'parent', 'self' or any CSS selector
	     * OR
	     - origin (Element) #optional An HTML or SVG Element whose rect will be used
	     **
	     = (object) The current origin or this Interactable
	    \*/
	    origin: function origin(newValue) {
	      if (trySelector(newValue)) {
	        this.options.origin = newValue;
	        return this;
	      } else if (isObject(newValue)) {
	        this.options.origin = newValue;
	        return this;
	      }
	
	      return this.options.origin;
	    },
	
	    /* \
	     * Interactable.deltaSource
	     [ method ]
	     *
	     * Returns or sets the mouse coordinate types used to calculate the
	     * movement of the pointer.
	     *
	     - newValue (string) #optional Use 'client' if you will be scrolling while interacting; Use 'page' if you want autoScroll to work
	     = (string | object) The current deltaSource or this Interactable
	    \*/
	    deltaSource: function deltaSource(newValue) {
	      if (newValue === 'page' || newValue === 'client') {
	        this.options.deltaSource = newValue;
	
	        return this;
	      }
	
	      return this.options.deltaSource;
	    },
	
	    /* \
	     * Interactable.restrict
	     [ method ]
	     **
	     * Deprecated. Add a `restrict` property to the options object passed to
	     * @Interactable.draggable, @Interactable.resizable or @Interactable.gesturable instead.
	     *
	     * Returns or sets the rectangles within which actions on this
	     * interactable (after snap calculations) are restricted. By default,
	     * restricting is relative to the pointer coordinates. You can change
	     * this by setting the
	     * [`elementRect`](https://github.com/taye/interact.js/pull/72).
	     **
	     - options (object) #optional an object with keys drag, resize, and/or gesture whose values are rects, Elements, CSS selectors, or 'parent' or 'self'
	     = (object) The current restrictions object or this Interactable
	     **
	     | interact(element).restrict({
	     |     // the rect will be `interact.getElementRect(element.parentNode)`
	     |     drag: element.parentNode,
	     |
	     |     // x and y are relative to the the interactable's origin
	     |     resize: { x: 100, y: 100, width: 200, height: 200 }
	     | })
	     |
	     | interact('.draggable').restrict({
	     |     // the rect will be the selected element's parent
	     |     drag: 'parent',
	     |
	     |     // do not restrict during normal movement.
	     |     // Instead, trigger only one restricted move event
	     |     // immediately before the end event.
	     |     endOnly: true,
	     |
	     |     // https://github.com/taye/interact.js/pull/72#issue-41813493
	     |     elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
	     | });
	    \*/
	    restrict: function restrict(options) {
	      if (!isObject(options)) {
	        return this.setOptions('restrict', options);
	      }
	
	      var actions = ['drag', 'resize', 'gesture'],
	          ret;
	
	      for (var i = 0; i < actions.length; i++) {
	        var action = actions[i];
	
	        if (action in options) {
	          var perAction = extend({
	            actions: [action],
	            restriction: options[action]
	          }, options);
	
	          ret = this.setOptions('restrict', perAction);
	        }
	      }
	
	      return ret;
	    },
	
	    /* \
	     * Interactable.context
	     [ method ]
	     *
	     * Gets the selector context Node of the Interactable. The default is `window.document`.
	     *
	     = (Node) The context Node of this Interactable
	     **
	    \*/
	    context: function context() {
	      return this._context;
	    },
	
	    _context: document,
	
	    /* \
	     * Interactable.ignoreFrom
	     [ method ]
	     *
	     * If the target of the `mousedown`, `pointerdown` or `touchstart`
	     * event or any of it's parents match the given CSS selector or
	     * Element, no drag/resize/gesture is started.
	     *
	     - newValue (string | Element | null) #optional a CSS selector string, an Element or `null` to not ignore any elements
	     = (string | Element | object) The current ignoreFrom value or this Interactable
	     **
	     | interact(element, { ignoreFrom: document.getElementById('no-action') });
	     | // or
	     | interact(element).ignoreFrom('input, textarea, a');
	    \*/
	    ignoreFrom: function ignoreFrom(newValue) {
	      if (trySelector(newValue)) {
	        // CSS selector to match event.target
	        this.options.ignoreFrom = newValue;
	        return this;
	      }
	
	      if (isElement(newValue)) {
	        // specific element
	        this.options.ignoreFrom = newValue;
	        return this;
	      }
	
	      return this.options.ignoreFrom;
	    },
	
	    /* \
	     * Interactable.allowFrom
	     [ method ]
	     *
	     * A drag/resize/gesture is started only If the target of the
	     * `mousedown`, `pointerdown` or `touchstart` event or any of it's
	     * parents match the given CSS selector or Element.
	     *
	     - newValue (string | Element | null) #optional a CSS selector string, an Element or `null` to allow from any element
	     = (string | Element | object) The current allowFrom value or this Interactable
	     **
	     | interact(element, { allowFrom: document.getElementById('drag-handle') });
	     | // or
	     | interact(element).allowFrom('.handle');
	    \*/
	    allowFrom: function allowFrom(newValue) {
	      if (trySelector(newValue)) {
	        // CSS selector to match event.target
	        this.options.allowFrom = newValue;
	        return this;
	      }
	
	      if (isElement(newValue)) {
	        // specific element
	        this.options.allowFrom = newValue;
	        return this;
	      }
	
	      return this.options.allowFrom;
	    },
	
	    /* \
	     * Interactable.element
	     [ method ]
	     *
	     * If this is not a selector Interactable, it returns the element this
	     * interactable represents
	     *
	     = (Element) HTML / SVG Element
	    \*/
	    element: function element() {
	      return this._element;
	    },
	
	    /* \
	     * Interactable.fire
	     [ method ]
	     *
	     * Calls listeners for the given InteractEvent type bound globally
	     * and directly to this Interactable
	     *
	     - iEvent (InteractEvent) The InteractEvent object to be fired on this Interactable
	     = (Interactable) this Interactable
	    \*/
	    fire: function fire(iEvent) {
	      if (!(iEvent && iEvent.type) || !contains(eventTypes, iEvent.type)) {
	        return this;
	      }
	
	      var listeners,
	          i,
	          len,
	          onEvent = 'on' + iEvent.type,
	          funcName = '';
	
	      // Interactable#on() listeners
	      if (iEvent.type in this._iEvents) {
	        listeners = this._iEvents[iEvent.type];
	
	        for (i = 0, len = listeners.length; i < len && !iEvent.immediatePropagationStopped; i++) {
	          funcName = listeners[i].name;
	          listeners[i](iEvent);
	        }
	      }
	
	      // interactable.onevent listener
	      if (isFunction(this[onEvent])) {
	        funcName = this[onEvent].name;
	        this[onEvent](iEvent);
	      }
	
	      // interact.on() listeners
	      if (iEvent.type in globalEvents && (listeners = globalEvents[iEvent.type])) {
	        for (i = 0, len = listeners.length; i < len && !iEvent.immediatePropagationStopped; i++) {
	          funcName = listeners[i].name;
	          listeners[i](iEvent);
	        }
	      }
	
	      return this;
	    },
	
	    /* \
	     * Interactable.on
	     [ method ]
	     *
	     * Binds a listener for an InteractEvent or DOM event.
	     *
	     - eventType  (string | array | object) The types of events to listen for
	     - listener   (function) The function to be called on the given event(s)
	     - useCapture (boolean) #optional useCapture flag for addEventListener
	     = (object) This Interactable
	    \*/
	    on: function on(eventType, listener, useCapture) {
	      var i;
	
	      if (isString(eventType) && eventType.search(' ') !== -1) {
	        eventType = eventType.trim().split(/ +/);
	      }
	
	      if (isArray(eventType)) {
	        for (i = 0; i < eventType.length; i++) {
	          this.on(eventType[i], listener, useCapture);
	        }
	
	        return this;
	      }
	
	      if (isObject(eventType)) {
	        for (var prop in eventType) {
	          this.on(prop, eventType[prop], listener);
	        }
	
	        return this;
	      }
	
	      if (eventType === 'wheel') {
	        eventType = wheelEvent;
	      }
	
	      // convert to boolean
	      useCapture = useCapture ? true : false;
	
	      if (contains(eventTypes, eventType)) {
	        // if this type of event was never bound to this Interactable
	        if (!(eventType in this._iEvents)) {
	          this._iEvents[eventType] = [listener];
	        } else {
	          this._iEvents[eventType].push(listener);
	        }
	      }
	      // delegated event for selector
	      else if (this.selector) {
	          if (!delegatedEvents[eventType]) {
	            delegatedEvents[eventType] = {
	              selectors: [],
	              contexts: [],
	              listeners: []
	            };
	
	            // add delegate listener functions
	            for (i = 0; i < documents.length; i++) {
	              events.add(documents[i], eventType, delegateListener);
	              events.add(documents[i], eventType, delegateUseCapture, true);
	            }
	          }
	
	          var delegated = delegatedEvents[eventType],
	              index;
	
	          for (index = delegated.selectors.length - 1; index >= 0; index--) {
	            if (delegated.selectors[index] === this.selector && delegated.contexts[index] === this._context) {
	              break;
	            }
	          }
	
	          if (index === -1) {
	            index = delegated.selectors.length;
	
	            delegated.selectors.push(this.selector);
	            delegated.contexts.push(this._context);
	            delegated.listeners.push([]);
	          }
	
	          // keep listener and useCapture flag
	          delegated.listeners[index].push([listener, useCapture]);
	        } else {
	          events.add(this._element, eventType, listener, useCapture);
	        }
	
	      return this;
	    },
	
	    /* \
	     * Interactable.off
	     [ method ]
	     *
	     * Removes an InteractEvent or DOM event listener
	     *
	     - eventType  (string | array | object) The types of events that were listened for
	     - listener   (function) The listener function to be removed
	     - useCapture (boolean) #optional useCapture flag for removeEventListener
	     = (object) This Interactable
	    \*/
	    off: function off(eventType, listener, useCapture) {
	      var i;
	
	      if (isString(eventType) && eventType.search(' ') !== -1) {
	        eventType = eventType.trim().split(/ +/);
	      }
	
	      if (isArray(eventType)) {
	        for (i = 0; i < eventType.length; i++) {
	          this.off(eventType[i], listener, useCapture);
	        }
	
	        return this;
	      }
	
	      if (isObject(eventType)) {
	        for (var prop in eventType) {
	          this.off(prop, eventType[prop], listener);
	        }
	
	        return this;
	      }
	
	      var eventList,
	          index = -1;
	
	      // convert to boolean
	      useCapture = useCapture ? true : false;
	
	      if (eventType === 'wheel') {
	        eventType = wheelEvent;
	      }
	
	      // if it is an action event type
	      if (contains(eventTypes, eventType)) {
	        eventList = this._iEvents[eventType];
	
	        if (eventList && (index = indexOf(eventList, listener)) !== -1) {
	          this._iEvents[eventType].splice(index, 1);
	        }
	      }
	      // delegated event
	      else if (this.selector) {
	          var delegated = delegatedEvents[eventType],
	              matchFound = false;
	
	          if (!delegated) {
	            return this;
	          }
	
	          // count from last index of delegated to 0
	          for (index = delegated.selectors.length - 1; index >= 0; index--) {
	            // look for matching selector and context Node
	            if (delegated.selectors[index] === this.selector && delegated.contexts[index] === this._context) {
	              var listeners = delegated.listeners[index];
	
	              // each item of the listeners array is an array: [function, useCaptureFlag]
	              for (i = listeners.length - 1; i >= 0; i--) {
	                var fn = listeners[i][0],
	                    useCap = listeners[i][1];
	
	                // check if the listener functions and useCapture flags match
	                if (fn === listener && useCap === useCapture) {
	                  // remove the listener from the array of listeners
	                  listeners.splice(i, 1);
	
	                  // if all listeners for this interactable have been removed
	                  // remove the interactable from the delegated arrays
	                  if (!listeners.length) {
	                    delegated.selectors.splice(index, 1);
	                    delegated.contexts.splice(index, 1);
	                    delegated.listeners.splice(index, 1);
	
	                    // remove delegate function from context
	                    events.remove(this._context, eventType, delegateListener);
	                    events.remove(this._context, eventType, delegateUseCapture, true);
	
	                    // remove the arrays if they are empty
	                    if (!delegated.selectors.length) {
	                      delegatedEvents[eventType] = null;
	                    }
	                  }
	
	                  // only remove one listener
	                  matchFound = true;
	                  break;
	                }
	              }
	
	              if (matchFound) {
	                break;
	              }
	            }
	          }
	        }
	        // remove listener from this Interatable's element
	        else {
	            events.remove(this._element, eventType, listener, useCapture);
	          }
	
	      return this;
	    },
	
	    /* \
	     * Interactable.set
	     [ method ]
	     *
	     * Reset the options of this Interactable
	     - options (object) The new settings to apply
	     = (object) This Interactable
	    \*/
	    set: function set(options) {
	      if (!isObject(options)) {
	        options = {};
	      }
	
	      this.options = extend({}, defaultOptions.base);
	
	      var i,
	          actions = ['drag', 'drop', 'resize', 'gesture'],
	          methods = ['draggable', 'dropzone', 'resizable', 'gesturable'],
	          perActions = extend(extend({}, defaultOptions.perAction), options[action] || {});
	
	      for (i = 0; i < actions.length; i++) {
	        var action = actions[i];
	
	        this.options[action] = extend({}, defaultOptions[action]);
	
	        this.setPerAction(action, perActions);
	
	        this[methods[i]](options[action]);
	      }
	
	      var settings = ['accept', 'actionChecker', 'allowFrom', 'deltaSource', 'dropChecker', 'ignoreFrom', 'origin', 'preventDefault', 'rectChecker', 'styleCursor'];
	
	      for (i = 0, len = settings.length; i < len; i++) {
	        var setting = settings[i];
	
	        this.options[setting] = defaultOptions.base[setting];
	
	        if (setting in options) {
	          this[setting](options[setting]);
	        }
	      }
	
	      return this;
	    },
	
	    /* \
	     * Interactable.unset
	     [ method ]
	     *
	     * Remove this interactable from the list of interactables and remove
	     * it's drag, drop, resize and gesture capabilities
	     *
	     = (object) @interact
	    \*/
	    unset: function unset() {
	      events.remove(this._element, 'all');
	
	      if (!isString(this.selector)) {
	        events.remove(this, 'all');
	        if (this.options.styleCursor) {
	          this._element.style.cursor = '';
	        }
	      } else {
	        // remove delegated events
	        for (var type in delegatedEvents) {
	          var delegated = delegatedEvents[type];
	
	          for (var i = 0; i < delegated.selectors.length; i++) {
	            if (delegated.selectors[i] === this.selector && delegated.contexts[i] === this._context) {
	              delegated.selectors.splice(i, 1);
	              delegated.contexts.splice(i, 1);
	              delegated.listeners.splice(i, 1);
	
	              // remove the arrays if they are empty
	              if (!delegated.selectors.length) {
	                delegatedEvents[type] = null;
	              }
	            }
	
	            events.remove(this._context, type, delegateListener);
	            events.remove(this._context, type, delegateUseCapture, true);
	
	            break;
	          }
	        }
	      }
	
	      this.dropzone(false);
	
	      interactables.splice(indexOf(interactables, this), 1);
	
	      return interact;
	    }
	  };
	
	  function warnOnce(method, message) {
	    var warned = false;
	
	    return function () {
	      if (!warned) {
	        window.console.warn(message);
	        warned = true;
	      }
	
	      return method.apply(this, arguments);
	    };
	  }
	
	  Interactable.prototype.snap = warnOnce(Interactable.prototype.snap, 'Interactable#snap is deprecated. See the new documentation for snapping at http://interactjs.io/docs/snapping');
	  Interactable.prototype.restrict = warnOnce(Interactable.prototype.restrict, 'Interactable#restrict is deprecated. See the new documentation for resticting at http://interactjs.io/docs/restriction');
	  Interactable.prototype.inertia = warnOnce(Interactable.prototype.inertia, 'Interactable#inertia is deprecated. See the new documentation for inertia at http://interactjs.io/docs/inertia');
	  Interactable.prototype.autoScroll = warnOnce(Interactable.prototype.autoScroll, 'Interactable#autoScroll is deprecated. See the new documentation for autoScroll at http://interactjs.io/docs/#autoscroll');
	  Interactable.prototype.squareResize = warnOnce(Interactable.prototype.squareResize, 'Interactable#squareResize is deprecated. See http://interactjs.io/docs/#resize-square');
	
	  Interactable.prototype.accept = warnOnce(Interactable.prototype.accept, 'Interactable#accept is deprecated. use Interactable#dropzone({ accept: target }) instead');
	  Interactable.prototype.dropChecker = warnOnce(Interactable.prototype.dropChecker, 'Interactable#dropChecker is deprecated. use Interactable#dropzone({ dropChecker: checkerFunction }) instead');
	  Interactable.prototype.context = warnOnce(Interactable.prototype.context, 'Interactable#context as a method is deprecated. It will soon be a DOM Node instead');
	
	  /* \
	   * interact.isSet
	   [ method ]
	   *
	   * Check if an element has been set
	   - element (Element) The Element being searched for
	   = (boolean) Indicates if the element or CSS selector was previously passed to interact
	  \*/
	  interact.isSet = function (element, options) {
	    return interactables.indexOfElement(element, options && options.context) !== -1;
	  };
	
	  /* \
	   * interact.on
	   [ method ]
	   *
	   * Adds a global listener for an InteractEvent or adds a DOM event to
	   * `document`
	   *
	   - type       (string | array | object) The types of events to listen for
	   - listener   (function) The function to be called on the given event(s)
	   - useCapture (boolean) #optional useCapture flag for addEventListener
	   = (object) interact
	  \*/
	  interact.on = function (type, listener, useCapture) {
	    if (isString(type) && type.search(' ') !== -1) {
	      type = type.trim().split(/ +/);
	    }
	
	    if (isArray(type)) {
	      for (var i = 0; i < type.length; i++) {
	        interact.on(type[i], listener, useCapture);
	      }
	
	      return interact;
	    }
	
	    if (isObject(type)) {
	      for (var prop in type) {
	        interact.on(prop, type[prop], listener);
	      }
	
	      return interact;
	    }
	
	    // if it is an InteractEvent type, add listener to globalEvents
	    if (contains(eventTypes, type)) {
	      // if this type of event was never bound
	      if (!globalEvents[type]) {
	        globalEvents[type] = [listener];
	      } else {
	        globalEvents[type].push(listener);
	      }
	    }
	    // If non InteractEvent type, addEventListener to document
	    else {
	        events.add(document, type, listener, useCapture);
	      }
	
	    return interact;
	  };
	
	  /* \
	   * interact.off
	   [ method ]
	   *
	   * Removes a global InteractEvent listener or DOM event from `document`
	   *
	   - type       (string | array | object) The types of events that were listened for
	   - listener   (function) The listener function to be removed
	   - useCapture (boolean) #optional useCapture flag for removeEventListener
	   = (object) interact
	   \*/
	  interact.off = function (type, listener, useCapture) {
	    if (isString(type) && type.search(' ') !== -1) {
	      type = type.trim().split(/ +/);
	    }
	
	    if (isArray(type)) {
	      for (var i = 0; i < type.length; i++) {
	        interact.off(type[i], listener, useCapture);
	      }
	
	      return interact;
	    }
	
	    if (isObject(type)) {
	      for (var prop in type) {
	        interact.off(prop, type[prop], listener);
	      }
	
	      return interact;
	    }
	
	    if (!contains(eventTypes, type)) {
	      events.remove(document, type, listener, useCapture);
	    } else {
	      var index;
	
	      if (type in globalEvents && (index = indexOf(globalEvents[type], listener)) !== -1) {
	        globalEvents[type].splice(index, 1);
	      }
	    }
	
	    return interact;
	  };
	
	  /* \
	   * interact.enableDragging
	   [ method ]
	   *
	   * Deprecated.
	   *
	   * Returns or sets whether dragging is enabled for any Interactables
	   *
	   - newValue (boolean) #optional `true` to allow the action; `false` to disable action for all Interactables
	   = (boolean | object) The current setting or interact
	  \*/
	  interact.enableDragging = warnOnce(function (newValue) {
	    if (newValue !== null && newValue !== undefined) {
	      actionIsEnabled.drag = newValue;
	
	      return interact;
	    }
	    return actionIsEnabled.drag;
	  }, 'interact.enableDragging is deprecated and will soon be removed.');
	
	  /* \
	   * interact.enableResizing
	   [ method ]
	   *
	   * Deprecated.
	   *
	   * Returns or sets whether resizing is enabled for any Interactables
	   *
	   - newValue (boolean) #optional `true` to allow the action; `false` to disable action for all Interactables
	   = (boolean | object) The current setting or interact
	  \*/
	  interact.enableResizing = warnOnce(function (newValue) {
	    if (newValue !== null && newValue !== undefined) {
	      actionIsEnabled.resize = newValue;
	
	      return interact;
	    }
	    return actionIsEnabled.resize;
	  }, 'interact.enableResizing is deprecated and will soon be removed.');
	
	  /* \
	   * interact.enableGesturing
	   [ method ]
	   *
	   * Deprecated.
	   *
	   * Returns or sets whether gesturing is enabled for any Interactables
	   *
	   - newValue (boolean) #optional `true` to allow the action; `false` to disable action for all Interactables
	   = (boolean | object) The current setting or interact
	  \*/
	  interact.enableGesturing = warnOnce(function (newValue) {
	    if (newValue !== null && newValue !== undefined) {
	      actionIsEnabled.gesture = newValue;
	
	      return interact;
	    }
	    return actionIsEnabled.gesture;
	  }, 'interact.enableGesturing is deprecated and will soon be removed.');
	
	  interact.eventTypes = eventTypes;
	
	  /* \
	   * interact.debug
	   [ method ]
	   *
	   * Returns debugging data
	   = (object) An object with properties that outline the current state and expose internal functions and variables
	  \*/
	  interact.debug = function () {
	    var interaction = interactions[0] || new Interaction();
	
	    return {
	      interactions: interactions,
	      target: interaction.target,
	      dragging: interaction.dragging,
	      resizing: interaction.resizing,
	      gesturing: interaction.gesturing,
	      prepared: interaction.prepared,
	      matches: interaction.matches,
	      matchElements: interaction.matchElements,
	
	      prevCoords: interaction.prevCoords,
	      startCoords: interaction.startCoords,
	
	      pointerIds: interaction.pointerIds,
	      pointers: interaction.pointers,
	      addPointer: listeners.addPointer,
	      removePointer: listeners.removePointer,
	      recordPointer: listeners.recordPointer,
	
	      snap: interaction.snapStatus,
	      restrict: interaction.restrictStatus,
	      inertia: interaction.inertiaStatus,
	
	      downTime: interaction.downTimes[0],
	      downEvent: interaction.downEvent,
	      downPointer: interaction.downPointer,
	      prevEvent: interaction.prevEvent,
	
	      Interactable: Interactable,
	      interactables: interactables,
	      pointerIsDown: interaction.pointerIsDown,
	      defaultOptions: defaultOptions,
	      defaultActionChecker: defaultActionChecker,
	
	      actionCursors: actionCursors,
	      dragMove: listeners.dragMove,
	      resizeMove: listeners.resizeMove,
	      gestureMove: listeners.gestureMove,
	      pointerUp: listeners.pointerUp,
	      pointerDown: listeners.pointerDown,
	      pointerMove: listeners.pointerMove,
	      pointerHover: listeners.pointerHover,
	
	      eventTypes: eventTypes,
	
	      events: events,
	      globalEvents: globalEvents,
	      delegatedEvents: delegatedEvents,
	
	      prefixedPropREs: prefixedPropREs
	    };
	  };
	
	  // expose the functions used to calculate multi-touch properties
	  interact.getPointerAverage = pointerAverage;
	  interact.getTouchBBox = touchBBox;
	  interact.getTouchDistance = touchDistance;
	  interact.getTouchAngle = touchAngle;
	
	  interact.getElementRect = getElementRect;
	  interact.getElementClientRect = getElementClientRect;
	  interact.matchesSelector = matchesSelector;
	  interact.closest = closest;
	
	  /* \
	   * interact.margin
	   [ method ]
	   *
	   * Deprecated. Use `interact(target).resizable({ margin: number });` instead.
	   * Returns or sets the margin for autocheck resizing used in
	   * @Interactable.getAction. That is the distance from the bottom and right
	   * edges of an element clicking in which will start resizing
	   *
	   - newValue (number) #optional
	   = (number | interact) The current margin value or interact
	  \*/
	  interact.margin = warnOnce(function (newvalue) {
	    if (isNumber(newvalue)) {
	      margin = newvalue;
	
	      return interact;
	    }
	    return margin;
	  }, 'interact.margin is deprecated. Use interact(target).resizable({ margin: number }); instead.');
	
	  /* \
	   * interact.supportsTouch
	   [ method ]
	   *
	   = (boolean) Whether or not the browser supports touch input
	  \*/
	  interact.supportsTouch = function () {
	    return supportsTouch;
	  };
	
	  /* \
	   * interact.supportsPointerEvent
	   [ method ]
	   *
	   = (boolean) Whether or not the browser supports PointerEvents
	  \*/
	  interact.supportsPointerEvent = function () {
	    return supportsPointerEvent;
	  };
	
	  /* \
	   * interact.stop
	   [ method ]
	   *
	   * Cancels all interactions (end events are not fired)
	   *
	   - event (Event) An event on which to call preventDefault()
	   = (object) interact
	  \*/
	  interact.stop = function (event) {
	    for (var i = interactions.length - 1; i >= 0; i--) {
	      interactions[i].stop(event);
	    }
	
	    return interact;
	  };
	
	  /* \
	   * interact.dynamicDrop
	   [ method ]
	   *
	   * Returns or sets whether the dimensions of dropzone elements are
	   * calculated on every dragmove or only on dragstart for the default
	   * dropChecker
	   *
	   - newValue (boolean) #optional True to check on each move. False to check only before start
	   = (boolean | interact) The current setting or interact
	  \*/
	  interact.dynamicDrop = function (newValue) {
	    if (isBool(newValue)) {
	      // if (dragging && dynamicDrop !== newValue && !newValue) {
	      // calcRects(dropzones);
	      // }
	
	      dynamicDrop = newValue;
	
	      return interact;
	    }
	    return dynamicDrop;
	  };
	
	  /* \
	   * interact.pointerMoveTolerance
	   [ method ]
	   * Returns or sets the distance the pointer must be moved before an action
	   * sequence occurs. This also affects tolerance for tap events.
	   *
	   - newValue (number) #optional The movement from the start position must be greater than this value
	   = (number | Interactable) The current setting or interact
	  \*/
	  interact.pointerMoveTolerance = function (newValue) {
	    if (isNumber(newValue)) {
	      pointerMoveTolerance = newValue;
	
	      return this;
	    }
	
	    return pointerMoveTolerance;
	  };
	
	  /* \
	   * interact.maxInteractions
	   [ method ]
	   **
	   * Returns or sets the maximum number of concurrent interactions allowed.
	   * By default only 1 interaction is allowed at a time (for backwards
	   * compatibility). To allow multiple interactions on the same Interactables
	   * and elements, you need to enable it in the draggable, resizable and
	   * gesturable `'max'` and `'maxPerElement'` options.
	   **
	   - newValue (number) #optional Any number. newValue <= 0 means no interactions.
	  \*/
	  interact.maxInteractions = function (newValue) {
	    if (isNumber(newValue)) {
	      maxInteractions = newValue;
	
	      return this;
	    }
	
	    return maxInteractions;
	  };
	
	  interact.createSnapGrid = function (grid) {
	    return function (x, y) {
	      var offsetX = 0,
	          offsetY = 0;
	
	      if (isObject(grid.offset)) {
	        offsetX = grid.offset.x;
	        offsetY = grid.offset.y;
	      }
	
	      var gridx = Math.round((x - offsetX) / grid.x),
	          gridy = Math.round((y - offsetY) / grid.y),
	          newX = gridx * grid.x + offsetX,
	          newY = gridy * grid.y + offsetY;
	
	      return {
	        x: newX,
	        y: newY,
	        range: grid.range
	      };
	    };
	  };
	
	  function endAllInteractions(event) {
	    for (var i = 0; i < interactions.length; i++) {
	      interactions[i].pointerEnd(event, event);
	    }
	  }
	
	  function listenToDocument(doc) {
	    if (contains(documents, doc)) {
	      return;
	    }
	
	    var win = doc.defaultView || doc.parentWindow;
	
	    // add delegate event listener
	    for (var eventType in delegatedEvents) {
	      events.add(doc, eventType, delegateListener);
	      events.add(doc, eventType, delegateUseCapture, true);
	    }
	
	    if (supportsPointerEvent) {
	      if (PointerEvent === win.MSPointerEvent) {
	        pEventTypes = {
	          up: 'MSPointerUp', down: 'MSPointerDown', over: 'mouseover',
	          out: 'mouseout', move: 'MSPointerMove', cancel: 'MSPointerCancel' };
	      } else {
	        pEventTypes = {
	          up: 'pointerup', down: 'pointerdown', over: 'pointerover',
	          out: 'pointerout', move: 'pointermove', cancel: 'pointercancel' };
	      }
	
	      events.add(doc, pEventTypes.down, listeners.selectorDown);
	      events.add(doc, pEventTypes.move, listeners.pointerMove);
	      events.add(doc, pEventTypes.over, listeners.pointerOver);
	      events.add(doc, pEventTypes.out, listeners.pointerOut);
	      events.add(doc, pEventTypes.up, listeners.pointerUp);
	      events.add(doc, pEventTypes.cancel, listeners.pointerCancel);
	
	      // autoscroll
	      events.add(doc, pEventTypes.move, listeners.autoScrollMove);
	    } else {
	      events.add(doc, 'mousedown', listeners.selectorDown);
	      events.add(doc, 'mousemove', listeners.pointerMove);
	      events.add(doc, 'mouseup', listeners.pointerUp);
	      events.add(doc, 'mouseover', listeners.pointerOver);
	      events.add(doc, 'mouseout', listeners.pointerOut);
	
	      events.add(doc, 'touchstart', listeners.selectorDown);
	      events.add(doc, 'touchmove', listeners.pointerMove);
	      events.add(doc, 'touchend', listeners.pointerUp);
	      events.add(doc, 'touchcancel', listeners.pointerCancel);
	
	      // autoscroll
	      events.add(doc, 'mousemove', listeners.autoScrollMove);
	      events.add(doc, 'touchmove', listeners.autoScrollMove);
	    }
	
	    events.add(win, 'blur', endAllInteractions);
	
	    try {
	      if (win.frameElement) {
	        var parentDoc = win.frameElement.ownerDocument,
	            parentWindow = parentDoc.defaultView;
	
	        events.add(parentDoc, 'mouseup', listeners.pointerEnd);
	        events.add(parentDoc, 'touchend', listeners.pointerEnd);
	        events.add(parentDoc, 'touchcancel', listeners.pointerEnd);
	        events.add(parentDoc, 'pointerup', listeners.pointerEnd);
	        events.add(parentDoc, 'MSPointerUp', listeners.pointerEnd);
	        events.add(parentWindow, 'blur', endAllInteractions);
	      }
	    } catch (error) {
	      interact.windowParentError = error;
	    }
	
	    // prevent native HTML5 drag on interact.js target elements
	    events.add(doc, 'dragstart', function (event) {
	      for (var i = 0; i < interactions.length; i++) {
	        var interaction = interactions[i];
	
	        if (interaction.element && (interaction.element === event.target || nodeContains(interaction.element, event.target))) {
	          interaction.checkAndPreventDefault(event, interaction.target, interaction.element);
	          return;
	        }
	      }
	    });
	
	    if (events.useAttachEvent) {
	      // For IE's lack of Event#preventDefault
	      events.add(doc, 'selectstart', function (event) {
	        var interaction = interactions[0];
	
	        if (interaction.currentAction()) {
	          interaction.checkAndPreventDefault(event);
	        }
	      });
	
	      // For IE's bad dblclick event sequence
	      events.add(doc, 'dblclick', doOnInteractions('ie8Dblclick'));
	    }
	
	    documents.push(doc);
	  }
	
	  listenToDocument(document);
	
	  function indexOf(array, target) {
	    for (var i = 0, len = array.length; i < len; i++) {
	      if (array[i] === target) {
	        return i;
	      }
	    }
	
	    return -1;
	  }
	
	  function contains(array, target) {
	    return indexOf(array, target) !== -1;
	  }
	
	  function matchesSelector(element, selector, nodeList) {
	    if (ie8MatchesSelector) {
	      return ie8MatchesSelector(element, selector, nodeList);
	    }
	
	    // remove /deep/ from selectors if shadowDOM polyfill is used
	    if (window !== realWindow) {
	      selector = selector.replace(/\/deep\//g, ' ');
	    }
	
	    return element[prefixedMatchesSelector](selector);
	  }
	
	  function matchesUpTo(element, selector, limit) {
	    while (isElement(element)) {
	      if (matchesSelector(element, selector)) {
	        return true;
	      }
	
	      element = parentElement(element);
	
	      if (element === limit) {
	        return matchesSelector(element, selector);
	      }
	    }
	
	    return false;
	  }
	
	  // For IE8's lack of an Element#matchesSelector
	  // taken from http://tanalin.com/en/blog/2012/12/matches-selector-ie8/ and modified
	  if (!(prefixedMatchesSelector in Element.prototype) || !isFunction(Element.prototype[prefixedMatchesSelector])) {
	    ie8MatchesSelector = function ie8MatchesSelector(element, selector, elems) {
	      elems = elems || element.parentNode.querySelectorAll(selector);
	
	      for (var i = 0, len = elems.length; i < len; i++) {
	        if (elems[i] === element) {
	          return true;
	        }
	      }
	
	      return false;
	    };
	  }
	
	  // requestAnimationFrame polyfill
	  (function () {
	    var lastTime = 0,
	        vendors = ['ms', 'moz', 'webkit', 'o'];
	
	    for (var x = 0; x < vendors.length && !realWindow.requestAnimationFrame; ++x) {
	      reqFrame = realWindow[vendors[x] + 'RequestAnimationFrame'];
	      cancelFrame = realWindow[vendors[x] + 'CancelAnimationFrame'] || realWindow[vendors[x] + 'CancelRequestAnimationFrame'];
	    }
	
	    if (!reqFrame) {
	      reqFrame = function reqFrame(callback) {
	        var currTime = new Date().getTime(),
	            timeToCall = Math.max(0, 16 - (currTime - lastTime)),
	            id = setTimeout(function () {
	          callback(currTime + timeToCall);
	        }, timeToCall);
	        lastTime = currTime + timeToCall;
	        return id;
	      };
	    }
	
	    if (!cancelFrame) {
	      cancelFrame = function cancelFrame(id) {
	        clearTimeout(id);
	      };
	    }
	  })();
	
	  /* global exports: true, module, define */
	
	  // http://documentcloud.github.io/underscore/docs/underscore.html#section-11
	  if (true) {
	    if (typeof module !== 'undefined' && module.exports) {
	      exports = module.exports = interact;
	    }
	    exports.interact = interact;
	  }
	  // AMD
	  else if (typeof define === 'function' && define.amd) {
	      define('interact', function () {
	        return interact;
	      });
	    } else {
	      realWindow.interact = interact;
	    }
	})(typeof window === 'undefined' ? undefined : window);

/***/ }),

/***/ 55:
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function(useSourceMap) {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			return this.map(function (item) {
				var content = cssWithMappingToString(item, useSourceMap);
				if(item[2]) {
					return "@media " + item[2] + "{" + content + "}";
				} else {
					return content;
				}
			}).join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};
	
	function cssWithMappingToString(item, useSourceMap) {
		var content = item[1] || '';
		var cssMapping = item[3];
		if (!cssMapping) {
			return content;
		}
	
		if (useSourceMap) {
			var sourceMapping = toComment(cssMapping);
			var sourceURLs = cssMapping.sources.map(function (source) {
				return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
			});
	
			return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
		}
	
		return [content].join('\n');
	}
	
	// Adapted from convert-source-map (MIT)
	function toComment(sourceMap) {
	  var base64 = new Buffer(JSON.stringify(sourceMap)).toString('base64');
	  var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;
	
	  return '/*# ' + data + ' */';
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(119).Buffer))

/***/ }),

/***/ 90:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	__webpack_require__(232);
	
	var _react = __webpack_require__(89);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(61);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _treegrid = __webpack_require__(91);
	
	var _treegrid2 = _interopRequireDefault(_treegrid);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var examples = new Array(8).join(',').split(',');
	var grid = void 0;
	
	window.addEventListener('resize', function () {
	  return grid.resizeCanvas();
	});
	
	var GridWrapper = function (_React$Component) {
	  _inherits(GridWrapper, _React$Component);
	
	  function GridWrapper() {
	    _classCallCheck(this, GridWrapper);
	
	    return _possibleConstructorReturn(this, (GridWrapper.__proto__ || Object.getPrototypeOf(GridWrapper)).apply(this, arguments));
	  }
	
	  _createClass(GridWrapper, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      grid = _treegrid2.default.init('#myGrid');
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {}
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement('div', null);
	    }
	  }]);
	
	  return GridWrapper;
	}(_react2.default.Component);
	
	;
	
	_reactDom2.default.render(_react2.default.createElement(GridWrapper, null), document.querySelector('#myGrid'));
	
	//const gridcomponent = require(`./treegrid`).default;
	//grid = gridcomponent.init('#myGrid');

/***/ }),

/***/ 91:
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _src = __webpack_require__(111);
	
	//import data from './example-data';
	
	var data = [{
	  "id": "id_0", "indent": 0, "parent": null,
	  "block": "ADR - DEV MARKETS ABC USD",
	  "benchmark": "benchmark 1",
	  "stratAlloc": "5%",
	  "tactAlloc": "6%",
	  "title": "ADR - DEV MARKETS",
	  "clientID": "",
	  "isin": "",
	  "holdType": "",
	  "country": "",
	  "currency": "",
	  "assetType": "",
	  "ytm": "0.0",
	  "oad": "0.0",
	  "mv": "7367289",
	  "totalmv": "7367289",
	  "mvp": "30%",
	  "description": ""
	}, {
	  "id": "id_1", "indent": 1, "parent": 0,
	  "title": "ABC",
	  "clientID": "",
	  "isin": "",
	  "holdType": "",
	  "country": "",
	  "currency": "",
	  "assetType": "",
	  "ytm": "0.0",
	  "oad": "0.0",
	  "mv": "7367289",
	  "totalmv": "7367289",
	  "mvp": "30%",
	  "description": ""
	}, {
	  "id": "id_2", "indent": 2, "parent": 1,
	  "title": "USD",
	  "clientID": "",
	  "isin": "",
	  "holdType": "",
	  "country": "",
	  "currency": "",
	  "assetType": "",
	  "ytm": "0.0",
	  "oad": "0.0",
	  "mv": "7367289",
	  "totalmv": "7367289",
	  "mvp": "30%",
	  "description": ""
	}, {
	  "id": "id_3", "indent": 3, "parent": 2,
	  "title": "Security ABC",
	  "clientID": "8747238",
	  "isin": "IR0004324843",
	  "holdType": "MARKETS",
	  "country": "SCOTLAND",
	  "currency": "USD",
	  "assetType": "EQUITIES",
	  "ytm": "0.0",
	  "oad": "0.0",
	  "mv": "482839",
	  "totalmv": "482839",
	  "mvp": "12%",
	  "description": "Security ABC"
	}, {
	  "id": "id_4", "indent": 3, "parent": 2,
	  "title": "Security XYZ",
	  "clientID": "6573000",
	  "isin": "EN0004396400",
	  "holdType": "MARKETS",
	  "country": "SCOTLAND",
	  "currency": "USD",
	  "assetType": "EQUITIES",
	  "ytm": "0.0",
	  "oad": "0.0",
	  "mv": "482839",
	  "totalmv": "482839",
	  "mvp": "18%",
	  "description": "Security XYZ"
	}, {
	  "id": "id_5", "indent": 0, "parent": null,
	  "block": "CURRENCIES AUS AUD",
	  "benchmark": "benchmark 7",
	  "stratAlloc": "",
	  "tactAlloc": "",
	  "title": "CURRENCIES",
	  "clientID": "",
	  "isin": "",
	  "holdType": "",
	  "country": "",
	  "currency": "",
	  "assetType": "",
	  "ytm": "0.0",
	  "oad": "0.0",
	  "mv": "9482901933",
	  "totalmv": "9482901933",
	  "mvp": "70%",
	  "description": ""
	}, {
	  "id": "id_6", "indent": 1, "parent": 5,
	  "title": "AUSTRALIA",
	  "clientID": "",
	  "isin": "",
	  "holdType": "",
	  "country": "",
	  "currency": "",
	  "assetType": "",
	  "ytm": "0.0",
	  "oad": "0.0",
	  "mv": "7006889",
	  "totalmv": "7006889",
	  "mvp": "3%",
	  "description": ""
	}, {
	  "id": "id_7", "indent": 2, "parent": 6,
	  "title": "AUD",
	  "clientID": "",
	  "isin": "",
	  "holdType": "",
	  "country": "",
	  "currency": "",
	  "assetType": "",
	  "ytm": "0.0",
	  "oad": "0.0",
	  "mv": "7006889",
	  "totalmv": "7006889",
	  "mvp": "3%",
	  "description": ""
	}, {
	  "id": "id_8", "indent": 3, "parent": 7,
	  "title": "AU Dollar",
	  "clientID": "0910D09",
	  "isin": "",
	  "holdType": "CURRENCIES",
	  "country": "AUSTRALIA",
	  "currency": "AUD",
	  "assetType": "Cash Equivalents",
	  "ytm": "0.0",
	  "oad": "0.0",
	  "mv": "47436",
	  "totalmv": "47436",
	  "mvp": "1%",
	  "description": "AUS Dollar"
	}, {
	  "id": "id_9", "indent": 3, "parent": 7,
	  "title": "AU Dollar",
	  "clientID": "0910D09",
	  "isin": "",
	  "holdType": "CURRENCIES",
	  "country": "AUSTRALIA",
	  "currency": "AUD",
	  "assetType": "Cash Equivalents",
	  "ytm": "0.0",
	  "oad": "0.0",
	  "mv": "83294",
	  "totalmv": "83294",
	  "mvp": "2%",
	  "description": "AUS Dollar"
	}, {
	  "id": "id_10", "indent": 1, "parent": 5,
	  "title": "UNITED KINGDOM",
	  "clientID": "",
	  "isin": "",
	  "holdType": "",
	  "country": "",
	  "currency": "",
	  "assetType": "",
	  "ytm": "0.0",
	  "oad": "0.0",
	  "mv": "-7006889",
	  "totalmv": "-7006889",
	  "mvp": "-4%",
	  "description": ""
	}, {
	  "id": "id_11", "indent": 2, "parent": 10,
	  "title": "GBP",
	  "clientID": "",
	  "isin": "",
	  "holdType": "",
	  "country": "",
	  "currency": "",
	  "assetType": "",
	  "ytm": "0.0",
	  "oad": "0.0",
	  "mv": "-7006889",
	  "totalmv": "-7006889",
	  "mvp": "-4%",
	  "description": ""
	}];
	
	function formatter(row, cell, value, columnDef, dataContext) {
	  return value;
	}
	
	function requiredFieldValidator(value) {
	  if (value == null || value == undefined || !value.length) {
	    return { valid: false, msg: "This is a required field" };
	  } else {
	    return { valid: true, msg: null };
	  }
	}
	
	var TaskNameFormatter = function TaskNameFormatter(row, cell, value, columnDef, dataContext) {
	  if (value == null || value == undefined || dataContext === undefined) {
	    return "";
	  }
	
	  value = value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	  var spacer = "<span style='display:inline-block;height:1px;width:" + 15 * dataContext["indent"] + "px'></span>";
	  var idx = dataView.getIdxById(dataContext.id);
	
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
	
	var grid = void 0;
	var dataView = new _src.Data.DataView();
	dataView.beginUpdate();
	dataView.setItems(data);
	dataView.setFilter(function (item) {
	  if (item.parent != null) {
	    var parent = data[item.parent];
	
	    while (parent) {
	      if (parent._collapsed) {
	        return false;
	      }
	      parent = data[parent.parent];
	    }
	  }
	
	  return true;
	});
	
	dataView.endUpdate();
	
	var columns = [{ id: "block", name: "Block", field: "block", width: 220, cssClass: "cell-title", validator: requiredFieldValidator }, { id: "benchmark", name: "Benchmark", field: "benchmark" }, { id: "stratAlloc", name: "Strategy Alloc %", field: "stratAlloc", width: 80, resizable: false }, { id: "tactAlloc", name: "Tactical Alloc %", field: "tactAlloc", width: 80, resizable: false }, { id: "title", name: "Title", field: "title", width: 220, formatter: TaskNameFormatter }, { id: "clientID", name: "Client ID", field: "clientID", minWidth: 60 }, { id: "isin", name: "ISIN", width: 80, minWidth: 20, maxWidth: 80, cssClass: "cell-effort-driven", field: "isin" }, { id: "holdType", name: "Hold Type", width: 80, minWidth: 20, maxWidth: 80, cssClass: "cell-effort-driven", field: "holdType" }, { id: "country", name: "Country", field: "country", minWidth: 60 }, { id: "currency", name: "Currency", field: "currency", minWidth: 60 }, { id: "assetType", name: "Asset Type", field: "assetType", minWidth: 60 }, { id: "ytm", name: "YTM", field: "ytm", minWidth: 60 }, { id: "oad", name: "OAD", field: "oad", minWidth: 60 }, { id: "mv", name: "MV", field: "mv", minWidth: 60 }, { id: "totalmv", name: "Total MV", field: "totalmv", minWidth: 60 }, { id: "mvp", name: "MV %", field: "mvp", width: 80, resizable: false }, { id: "description", name: "Description", field: "description", minWidth: 60 }];
	
	var options = {
	  editable: false,
	  enableAddRow: false,
	  enableCellNavigation: true,
	  enableColumnReorder: false
	};
	
	exports.default = {
	  init: function init(elementid) {
	    grid = new _src.Grid(elementid, dataView, columns, options);
	
	    grid.onClick.subscribe(function (e, args) {
	
	      if (e.target.className.indexOf("toggle") > -1) {
	        var item = dataView.getItem(args.row);
	
	        if (item) {
	          if (!item._collapsed) {
	            item._collapsed = true;
	          } else {
	            item._collapsed = false;
	          }
	          console.log("collapsed changed to - " + item._collapsed);
	          console.log("item - " + item);
	          dataView.updateItem(item.id, item);
	          dataView.refresh();
	        }
	        e.stopImmediatePropagation();
	      }
	    });
	
	    dataView.onRowCountChanged.subscribe(function () {
	      grid.updateRowCount();
	      grid.render();
	    });
	
	    dataView.onRowsChanged.subscribe(function (e, _ref) {
	      var rows = _ref.rows;
	
	      grid.invalidateRows(rows);
	      grid.render();
	    });
	
	    return grid;
	  },
	  title: 'Tree Grid',
	  route: '/example-treegrid'
	};

/***/ }),

/***/ 92:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.RowSelectionModel = exports.RowMoveManager = exports.HeaderMenu = exports.HeaderButtons = exports.CheckboxSelectColumn = exports.CellSelectionModel = exports.CellRangeSelector = exports.CellRangeDecorator = exports.CellCopyManager = exports.AutoTooltips = undefined;
	
	var _slick = __webpack_require__(93);
	
	var _slick2 = _interopRequireDefault(_slick);
	
	var _slick3 = __webpack_require__(95);
	
	var _slick4 = _interopRequireDefault(_slick3);
	
	var _slick5 = __webpack_require__(97);
	
	var _slick6 = _interopRequireDefault(_slick5);
	
	var _slick7 = __webpack_require__(98);
	
	var _slick8 = _interopRequireDefault(_slick7);
	
	var _slick9 = __webpack_require__(99);
	
	var _slick10 = _interopRequireDefault(_slick9);
	
	var _slick11 = __webpack_require__(101);
	
	var _slick12 = _interopRequireDefault(_slick11);
	
	var _slick13 = __webpack_require__(103);
	
	var _slick14 = _interopRequireDefault(_slick13);
	
	var _slick15 = __webpack_require__(105);
	
	var _slick16 = _interopRequireDefault(_slick15);
	
	var _slick17 = __webpack_require__(107);
	
	var _slick18 = _interopRequireDefault(_slick17);
	
	var _slick19 = __webpack_require__(109);
	
	var _slick20 = _interopRequireDefault(_slick19);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.AutoTooltips = _slick2.default;
	exports.CellCopyManager = _slick4.default;
	exports.CellRangeDecorator = _slick6.default;
	exports.CellRangeSelector = _slick8.default;
	exports.CellSelectionModel = _slick10.default;
	exports.CheckboxSelectColumn = _slick12.default;
	exports.HeaderButtons = _slick14.default;
	exports.HeaderMenu = _slick16.default;
	exports.RowMoveManager = _slick18.default;
	exports.RowSelectionModel = _slick20.default;

/***/ }),

/***/ 93:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _slick = __webpack_require__(94);
	
	var _slick2 = _interopRequireDefault(_slick);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _slick2.default;

/***/ }),

/***/ 94:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _jquery = __webpack_require__(8);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = AutoTooltips;
	
	/**
	 * AutoTooltips plugin to show/hide tooltips when columns are too narrow to fit content.
	 * @constructor
	 * @param {boolean} [options.enableForCells=true]        - Enable tooltip for grid cells
	 * @param {boolean} [options.enableForHeaderCells=false] - Enable tooltip for header cells
	 * @param {number}  [options.maxToolTipLength=null]      - The maximum length for a tooltip
	 */
	
	function AutoTooltips(options) {
	  var _grid = void 0;
	  var _self = this;
	  var _defaults = {
	    enableForCells: true,
	    enableForHeaderCells: false,
	    maxToolTipLength: null
	  };
	
	  /**
	   * Initialize plugin.
	   */
	  function init(grid) {
	    options = Object.assign({}, _defaults, options);
	    _grid = grid;
	    if (options.enableForCells) _grid.onMouseEnter.subscribe(handleMouseEnter);
	    if (options.enableForHeaderCells) _grid.onHeaderMouseEnter.subscribe(handleHeaderMouseEnter);
	  }
	
	  /**
	   * Destroy plugin.
	   */
	  function destroy() {
	    if (options.enableForCells) _grid.onMouseEnter.unsubscribe(handleMouseEnter);
	    if (options.enableForHeaderCells) _grid.onHeaderMouseEnter.unsubscribe(handleHeaderMouseEnter);
	  }
	
	  /**
	   * Handle mouse entering grid cell to add/remove tooltip.
	   * @param {jQuery.Event} e - The event
	   */
	  function handleMouseEnter(e) {
	    var cell = _grid.getCellFromEvent(e);
	    if (cell) {
	      var $node = (0, _jquery2.default)(_grid.getCellNode(cell.row, cell.cell));
	      var text = void 0;
	      if ($node.innerWidth() < $node[0].scrollWidth) {
	        text = _jquery2.default.trim($node.text());
	        if (options.maxToolTipLength && text.length > options.maxToolTipLength) {
	          text = text.substr(0, options.maxToolTipLength - 3) + '...';
	        }
	      } else {
	        text = '';
	      }
	      $node.attr('title', text);
	    }
	  }
	
	  /**
	   * Handle mouse entering header cell to add/remove tooltip.
	   * @param {jQuery.Event} e     - The event
	   * @param {object} args.column - The column definition
	   */
	  function handleHeaderMouseEnter(e, args) {
	    var column = args.column,
	        $node = (0, _jquery2.default)(e.target).closest('.slick-header-column');
	    if (column && !column.toolTip) {
	      $node.attr('title', $node.innerWidth() < $node[0].scrollWidth ? column.name : '');
	    }
	  }
	
	  // Public API
	  Object.assign(this, {
	    init: init,
	    destroy: destroy
	  });
	}

/***/ }),

/***/ 95:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _slick = __webpack_require__(96);
	
	var _slick2 = _interopRequireDefault(_slick);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _slick2.default;

/***/ }),

/***/ 96:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _slick = __webpack_require__(7);
	
	var _slick2 = _interopRequireDefault(_slick);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var keyCode = _slick2.default.keyCode;
	exports.default = CellCopyManager;
	
	
	function CellCopyManager() {
	  var _grid;
	  var _self = this;
	  var _copiedRanges;
	
	  function init(grid) {
	    _grid = grid;
	    _grid.onKeyDown.subscribe(handleKeyDown);
	  }
	
	  function destroy() {
	    _grid.onKeyDown.unsubscribe(handleKeyDown);
	  }
	
	  function handleKeyDown(e, args) {
	    var ranges;
	    if (!_grid.getEditorLock().isActive()) {
	      if (e.which == keyCode.ESCAPE) {
	        if (_copiedRanges) {
	          e.preventDefault();
	          clearCopySelection();
	          _self.onCopyCancelled.notify({ ranges: _copiedRanges });
	          _copiedRanges = null;
	        }
	      }
	
	      if (e.which == 67 && (e.ctrlKey || e.metaKey)) {
	        ranges = _grid.getSelectionModel().getSelectedRanges();
	        if (ranges.length != 0) {
	          e.preventDefault();
	          _copiedRanges = ranges;
	          markCopySelection(ranges);
	          _self.onCopyCells.notify({ ranges: ranges });
	        }
	      }
	
	      if (e.which == 86 && (e.ctrlKey || e.metaKey)) {
	        if (_copiedRanges) {
	          e.preventDefault();
	          clearCopySelection();
	          ranges = _grid.getSelectionModel().getSelectedRanges();
	          _self.onPasteCells.notify({ from: _copiedRanges, to: ranges });
	          _copiedRanges = null;
	        }
	      }
	    }
	  }
	
	  function markCopySelection(ranges) {
	    var columns = _grid.getColumns();
	    var hash = {};
	    for (var i = 0; i < ranges.length; i++) {
	      for (var j = ranges[i].fromRow; j <= ranges[i].toRow; j++) {
	        hash[j] = {};
	        for (var k = ranges[i].fromCell; k <= ranges[i].toCell; k++) {
	          hash[j][columns[k].id] = 'copied';
	        }
	      }
	    }
	    _grid.setCellCssStyles('copy-manager', hash);
	  }
	
	  function clearCopySelection() {
	    _grid.removeCellCssStyles('copy-manager');
	  }
	
	  Object.assign(this, {
	    init: init,
	    destroy: destroy,
	    clearCopySelection: clearCopySelection,
	
	    onCopyCells: new _slick2.default.Event(),
	    onCopyCancelled: new _slick2.default.Event(),
	    onPasteCells: new _slick2.default.Event()
	  });
	}

/***/ }),

/***/ 97:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _slick = __webpack_require__(52);
	
	var _slick2 = _interopRequireDefault(_slick);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _slick2.default;

/***/ }),

/***/ 98:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _slick = __webpack_require__(53);
	
	var _slick2 = _interopRequireDefault(_slick);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _slick2.default;

/***/ }),

/***/ 99:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _slick = __webpack_require__(100);
	
	var _slick2 = _interopRequireDefault(_slick);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _slick2.default;

/***/ }),

/***/ 100:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _slick = __webpack_require__(7);
	
	var _slick2 = _interopRequireDefault(_slick);
	
	var _slick3 = __webpack_require__(53);
	
	var _slick4 = _interopRequireDefault(_slick3);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = CellSelectionModel;
	
	
	function CellSelectionModel() {
	  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
	    selectActiveCell: true
	  };
	
	  var _grid = void 0;
	  var _canvas = void 0;
	  var _ranges = [];
	  var _self = this;
	  var _selector = new _slick4.default({
	    selectionCss: {
	      border: '2px solid black'
	    }
	  });
	  var _options = void 0;
	  var _defaults = {
	    selectActiveCell: true
	  };
	
	  function init(grid) {
	    _options = Object.assign({}, options);
	    _grid = grid;
	    _canvas = _grid.getCanvasNode();
	    _grid.onActiveCellChanged.subscribe(handleActiveCellChange);
	    _grid.onKeyDown.subscribe(handleKeyDown);
	    grid.registerPlugin(_selector);
	    _selector.onCellRangeSelected.subscribe(handleCellRangeSelected);
	    _selector.onBeforeCellRangeSelected.subscribe(handleBeforeCellRangeSelected);
	  }
	
	  function destroy() {
	    _grid.onActiveCellChanged.unsubscribe(handleActiveCellChange);
	    _grid.onKeyDown.unsubscribe(handleKeyDown);
	    _selector.onCellRangeSelected.unsubscribe(handleCellRangeSelected);
	    _selector.onBeforeCellRangeSelected.unsubscribe(handleBeforeCellRangeSelected);
	    _grid.unregisterPlugin(_selector);
	  }
	
	  function removeInvalidRanges(ranges) {
	    var result = [];
	
	    for (var i = 0; i < ranges.length; i++) {
	      var r = ranges[i];
	      if (_grid.canCellBeSelected(r.fromRow, r.fromCell) && _grid.canCellBeSelected(r.toRow, r.toCell)) {
	        result.push(r);
	      }
	    }
	
	    return result;
	  }
	
	  function setSelectedRanges(ranges) {
	    // simle check for: empty selection didn't change, prevent firing onSelectedRangesChanged
	    if ((!_ranges || _ranges.length === 0) && (!ranges || ranges.length === 0)) {
	      return;
	    }
	
	    _ranges = removeInvalidRanges(ranges);
	    _self.onSelectedRangesChanged.notify(_ranges);
	  }
	
	  function getSelectedRanges() {
	    return _ranges;
	  }
	
	  function handleBeforeCellRangeSelected(e, args) {
	    if (_grid.getEditorLock().isActive()) {
	      e.stopPropagation();
	      return false;
	    }
	  }
	
	  function handleCellRangeSelected(e, args) {
	    setSelectedRanges([args.range]);
	  }
	
	  function handleActiveCellChange(e, args) {
	    if (_options.selectActiveCell && args.row != null && args.cell != null) {
	      setSelectedRanges([new _slick2.default.Range(args.row, args.cell)]);
	    }
	  }
	
	  function handleKeyDown(e) {
	    /** *
	     * Кey codes
	     * 37 left
	     * 38 up
	     * 39 right
	     * 40 down
	     */
	    var ranges = void 0,
	        last = void 0;
	    var active = _grid.getActiveCell();
	
	    if (active && e.shiftKey && !e.ctrlKey && !e.altKey && (e.which == 37 || e.which == 39 || e.which == 38 || e.which == 40)) {
	      ranges = getSelectedRanges();
	      if (!ranges.length) ranges.push(new _slick2.default.Range(active.row, active.cell));
	
	      // keyboard can work with last range only
	      last = ranges.pop();
	
	      // can't handle selection out of active cell
	      if (!last.contains(active.row, active.cell)) last = new _slick2.default.Range(active.row, active.cell);
	
	      var dRow = last.toRow - last.fromRow,
	          dCell = last.toCell - last.fromCell,
	
	      // walking direction
	      dirRow = active.row == last.fromRow ? 1 : -1,
	          dirCell = active.cell == last.fromCell ? 1 : -1;
	
	      if (e.which == 37) {
	        dCell -= dirCell;
	      } else if (e.which == 39) {
	        dCell += dirCell;
	      } else if (e.which == 38) {
	        dRow -= dirRow;
	      } else if (e.which == 40) {
	        dRow += dirRow;
	      }
	
	      // define new selection range
	      var new_last = new _slick2.default.Range(active.row, active.cell, active.row + dirRow * dRow, active.cell + dirCell * dCell);
	      if (removeInvalidRanges([new_last]).length) {
	        ranges.push(new_last);
	        var viewRow = dirRow > 0 ? new_last.toRow : new_last.fromRow;
	        var viewCell = dirCell > 0 ? new_last.toCell : new_last.fromCell;
	        _grid.scrollRowIntoView(viewRow);
	        _grid.scrollCellIntoView(viewRow, viewCell);
	      } else ranges.push(last);
	
	      setSelectedRanges(ranges);
	
	      e.preventDefault();
	      e.stopPropagation();
	    }
	  }
	
	  Object.assign(this, {
	    getSelectedRanges: getSelectedRanges,
	    setSelectedRanges: setSelectedRanges,
	
	    init: init,
	    destroy: destroy,
	
	    onSelectedRangesChanged: new _slick2.default.Event()
	  });
	}

/***/ }),

/***/ 101:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _slick = __webpack_require__(102);
	
	var _slick2 = _interopRequireDefault(_slick);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _slick2.default;

/***/ }),

/***/ 102:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _jquery = __webpack_require__(8);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _slick = __webpack_require__(7);
	
	var _slick2 = _interopRequireDefault(_slick);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = CheckboxSelectColumn;
	
	
	function CheckboxSelectColumn(options) {
	  var _grid = void 0;
	  var _self = this;
	  var _handler = new _slick2.default.EventHandler();
	  var _selectedRowsLookup = {};
	  var _defaults = {
	    columnId: '_checkbox_selector',
	    cssClass: null,
	    toolTip: 'Select/Deselect All',
	    width: 30
	  };
	
	  var _options = _jquery2.default.extend(true, {}, _defaults, options);
	
	  function init(grid) {
	    _grid = grid;
	    _handler.subscribe(_grid.onSelectedRowsChanged, handleSelectedRowsChanged).subscribe(_grid.onClick, handleClick).subscribe(_grid.onHeaderClick, handleHeaderClick).subscribe(_grid.onKeyDown, handleKeyDown);
	  }
	
	  function destroy() {
	    _handler.unsubscribeAll();
	  }
	
	  function handleSelectedRowsChanged(e, args) {
	    var selectedRows = _grid.getSelectedRows();
	    var lookup = {},
	        row = void 0,
	        i = void 0;
	    for (i = 0; i < selectedRows.length; i++) {
	      row = selectedRows[i];
	      lookup[row] = true;
	      if (lookup[row] !== _selectedRowsLookup[row]) {
	        _grid.invalidateRow(row);
	        delete _selectedRowsLookup[row];
	      }
	    }
	    for (i in _selectedRowsLookup) {
	      _grid.invalidateRow(i);
	    }
	    _selectedRowsLookup = lookup;
	    _grid.render();
	
	    if (selectedRows.length && selectedRows.length == _grid.getDataLength()) {
	      _grid.updateColumnHeader(_options.columnId, "<input type='checkbox' checked='checked'>", _options.toolTip);
	    } else {
	      _grid.updateColumnHeader(_options.columnId, "<input type='checkbox'>", _options.toolTip);
	    }
	  }
	
	  function handleKeyDown(e, args) {
	    if (e.which == 32) {
	      if (_grid.getColumns()[args.cell].id === _options.columnId) {
	        // if editing, try to commit
	        if (!_grid.getEditorLock().isActive() || _grid.getEditorLock().commitCurrentEdit()) {
	          toggleRowSelection(args.row);
	        }
	        e.preventDefault();
	        e.stopImmediatePropagation();
	      }
	    }
	  }
	
	  function handleClick(e, args) {
	    // clicking on a row select checkbox
	    if (_grid.getColumns()[args.cell].id === _options.columnId && (0, _jquery2.default)(e.target).is(':checkbox')) {
	      // if editing, try to commit
	      if (_grid.getEditorLock().isActive() && !_grid.getEditorLock().commitCurrentEdit()) {
	        e.preventDefault();
	        e.stopImmediatePropagation();
	        return;
	      }
	
	      toggleRowSelection(args.row);
	      e.stopPropagation();
	      e.stopImmediatePropagation();
	    }
	  }
	
	  function toggleRowSelection(row) {
	    if (_selectedRowsLookup[row]) {
	      _grid.setSelectedRows(_jquery2.default.grep(_grid.getSelectedRows(), function (n) {
	        return n != row;
	      }));
	    } else {
	      _grid.setSelectedRows(_grid.getSelectedRows().concat(row));
	    }
	  }
	
	  function handleHeaderClick(e, args) {
	    if (args.column.id == _options.columnId && (0, _jquery2.default)(e.target).is(':checkbox')) {
	      // if editing, try to commit
	      if (_grid.getEditorLock().isActive() && !_grid.getEditorLock().commitCurrentEdit()) {
	        e.preventDefault();
	        e.stopImmediatePropagation();
	        return;
	      }
	
	      if ((0, _jquery2.default)(e.target).is(':checked')) {
	        var rows = [];
	        for (var i = 0; i < _grid.getDataLength(); i++) {
	          rows.push(i);
	        }
	        _grid.setSelectedRows(rows);
	      } else {
	        _grid.setSelectedRows([]);
	      }
	      e.stopPropagation();
	      e.stopImmediatePropagation();
	    }
	  }
	
	  function getColumnDefinition() {
	    return {
	      id: _options.columnId,
	      name: "<input type='checkbox'>",
	      toolTip: _options.toolTip,
	      field: 'sel',
	      width: _options.width,
	      resizable: false,
	      sortable: false,
	      cssClass: _options.cssClass,
	      formatter: checkboxSelectionFormatter
	    };
	  }
	
	  function checkboxSelectionFormatter(row, cell, value, columnDef, dataContext) {
	    if (dataContext) {
	      return _selectedRowsLookup[row] ? "<input type='checkbox' checked='checked'>" : "<input type='checkbox'>";
	    }
	    return null;
	  }
	
	  Object.assign(this, {
	    init: init,
	    destroy: destroy,
	
	    getColumnDefinition: getColumnDefinition
	  });
	}

/***/ }),

/***/ 103:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _slick = __webpack_require__(104);
	
	var _slick2 = _interopRequireDefault(_slick);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _slick2.default;

/***/ }),

/***/ 104:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _jquery = __webpack_require__(8);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _slick = __webpack_require__(7);
	
	var _slick2 = _interopRequireDefault(_slick);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = HeaderButtons;
	/** *
	 * A plugin to add custom buttons to column headers.
	 *
	 * USAGE:
	 *
	 * Add the plugin .js & .css files and register it with the grid.
	 *
	 * To specify a custom button in a column header, extend the column definition like so:
	 *
	 *   var columns = [
	 *     {
	 *       id: 'myColumn',
	 *       name: 'My column',
	 *
	 *       // This is the relevant part
	 *       header: {
	 *          buttons: [
	 *              {
	 *                // button options
	 *              },
	 *              {
	 *                // button options
	 *              }
	 *          ]
	 *       }
	 *     }
	 *   ];
	 *
	 * Available button options:
	 *    cssClass:     CSS class to add to the button.
	 *    image:        Relative button image path.
	 *    tooltip:      Button tooltip.
	 *    showOnHover:  Only show the button on hover.
	 *    handler:      Button click handler.
	 *    command:      A command identifier to be passed to the onCommand event handlers.
	 *
	 * The plugin exposes the following events:
	 *    onCommand:    Fired on button click for buttons with 'command' specified.
	 *        Event args:
	 *            grid:     Reference to the grid.
	 *            column:   Column definition.
	 *            command:  Button command identified.
	 *            button:   Button options.  Note that you can change the button options in your
	 *                      event handler, and the column header will be automatically updated to
	 *                      reflect them.  This is useful if you want to implement something like a
	 *                      toggle button.
	 *
	 *
	 * @param options {Object} Options:
	 *    buttonCssClass:   a CSS class to use for buttons (default 'slick-header-button')
	 * @class Slick.Plugins.HeaderButtons
	 * @constructor
	 */
	
	function HeaderButtons(options) {
	  var _grid;
	  var _self = this;
	  var _handler = new _slick2.default.EventHandler();
	  var _defaults = {
	    buttonCssClass: 'slick-header-button'
	  };
	
	  function init(grid) {
	    options = Object.assign({}, _defaults, options);
	    _grid = grid;
	    _handler.subscribe(_grid.onHeaderCellRendered, handleHeaderCellRendered).subscribe(_grid.onBeforeHeaderCellDestroy, handleBeforeHeaderCellDestroy);
	
	    // Force the grid to re-render the header now that the events are hooked up.
	    _grid.setColumns(_grid.getColumns());
	  }
	
	  function destroy() {
	    _handler.unsubscribeAll();
	  }
	
	  function handleHeaderCellRendered(e, args) {
	    var column = args.column;
	
	    if (column.header && column.header.buttons) {
	      // Append buttons in reverse order since they are floated to the right.
	      var i = column.header.buttons.length;
	      while (i--) {
	        var button = column.header.buttons[i];
	        var btn = (0, _jquery2.default)('<div></div>').addClass(options.buttonCssClass).data('column', column).data('button', button);
	
	        if (button.showOnHover) {
	          btn.addClass('slick-header-button-hidden');
	        }
	
	        if (button.image) {
	          btn.css('backgroundImage', 'url(' + button.image + ')');
	        }
	
	        if (button.cssClass) {
	          btn.addClass(button.cssClass);
	        }
	
	        if (button.tooltip) {
	          btn.attr('title', button.tooltip);
	        }
	
	        if (button.command) {
	          btn.data('command', button.command);
	        }
	
	        if (button.handler) {
	          btn.bind('click', button.handler);
	        }
	
	        btn.bind('click', handleButtonClick).appendTo(args.node);
	        args.node.classList.add('has-buttons');
	      }
	    }
	  }
	
	  function handleBeforeHeaderCellDestroy(e, args) {
	    var column = args.column;
	
	    if (column.header && column.header.buttons) {
	      // Removing buttons via jQuery will also clean up any event handlers and data.
	      // NOTE: If you attach event handlers directly or using a different framework,
	      //       you must also clean them up here to avoid memory leaks.
	      (0, _jquery2.default)(args.node).find('.' + options.buttonCssClass).remove();
	    }
	  }
	
	  function handleButtonClick(e) {
	    var command = (0, _jquery2.default)(this).data('command');
	    var columnDef = (0, _jquery2.default)(this).data('column');
	    var button = (0, _jquery2.default)(this).data('button');
	
	    if (command != null) {
	      _self.onCommand.notify({
	        'grid': _grid,
	        'column': columnDef,
	        'command': command,
	        'button': button
	      }, e, _self);
	
	      // Update the header in case the user updated the button definition in the handler.
	      _grid.updateColumnHeader(columnDef.id);
	    }
	
	    // Stop propagation so that it doesn't register as a header click event.
	    e.preventDefault();
	    e.stopPropagation();
	  }
	
	  Object.assign(this, {
	    init: init,
	    destroy: destroy,
	
	    'onCommand': new _slick2.default.Event()
	  });
	}

/***/ }),

/***/ 105:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _slick = __webpack_require__(106);
	
	var _slick2 = _interopRequireDefault(_slick);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _slick2.default;

/***/ }),

/***/ 106:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _jquery = __webpack_require__(8);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _slick = __webpack_require__(7);
	
	var _slick2 = _interopRequireDefault(_slick);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// import './slick.headermenu.css';
	
	exports.default = HeaderMenu;
	
	/** *
	 * A plugin to add drop-down menus to column headers.
	 *
	 * USAGE:
	 *
	 * Add the plugin .js & .css files and register it with the grid.
	 *
	 * To specify a menu in a column header, extend the column definition like so:
	 *
	 *   const columns = [
	 *     {
	 *       id: 'myColumn',
	 *       name: 'My column',
	 *
	 *       // This is the relevant part
	 *       header: {
	 *          menu: {
	 *              items: [
	 *                {
	 *                  // menu item options
	 *                },
	 *                {
	 *                  // menu item options
	 *                }
	 *              ]
	 *          }
	 *       }
	 *     }
	 *   ];
	 *
	 *
	 * Available menu options:
	 *    tooltip:      Menu button tooltip.
	 *
	 *
	 * Available menu item options:
	 *    title:        Menu item text.
	 *    disabled:     Whether the item is disabled.
	 *    tooltip:      Item tooltip.
	 *    command:      A command identifier to be passed to the onCommand event handlers.
	 *    iconCssClass: A CSS class to be added to the menu item icon.
	 *    iconImage:    A url to the icon image.
	 *
	 *
	 * The plugin exposes the following events:
	 *    onBeforeMenuShow:   Fired before the menu is shown.  You can customize the menu or dismiss it by returning false.
	 *        Event args:
	 *            grid:     Reference to the grid.
	 *            column:   Column definition.
	 *            menu:     Menu options.  Note that you can change the menu items here.
	 *
	 *    onCommand:    Fired on menu item click for buttons with 'command' specified.
	 *        Event args:
	 *            grid:     Reference to the grid.
	 *            column:   Column definition.
	 *            command:  Button command identified.
	 *            button:   Button options.  Note that you can change the button options in your
	 *                      event handler, and the column header will be automatically updated to
	 *                      reflect them.  This is useful if you want to implement something like a
	 *                      toggle button.
	 *
	 *
	 * @param options {Object} Options:
	 *    buttonCssClass:   an extra CSS class to add to the menu button
	 *    buttonImage:      a url to the menu button image (default '../images/down.gif')
	 * @class Slick.Plugins.HeaderButtons
	 * @constructor
	 */
	
	function HeaderMenu(options) {
	  var _grid = void 0;
	  var _self = this;
	  var _handler = new _slick2.default.EventHandler();
	  var _defaults = {
	    buttonCssClass: null,
	    buttonImage: null
	  };
	
	  var $menu = void 0;
	  var $activeHeaderColumn = void 0;
	
	  function init(grid) {
	    options = Object.assign({}, _defaults, options);
	    _grid = grid;
	    _handler.subscribe(_grid.onHeaderCellRendered, handleHeaderCellRendered).subscribe(_grid.onBeforeHeaderCellDestroy, handleBeforeHeaderCellDestroy);
	
	    // Force the grid to re-render the header now that the events are hooked up.
	    _grid.setColumns(_grid.getColumns());
	
	    // Hide the menu on outside click.
	    (0, _jquery2.default)(document.body).bind('mousedown', handleBodyMouseDown);
	  }
	
	  function destroy() {
	    _handler.unsubscribeAll();
	    (0, _jquery2.default)(document.body).unbind('mousedown', handleBodyMouseDown);
	  }
	
	  function handleBodyMouseDown(e) {
	    if ($menu && $menu[0] != e.target && !_jquery2.default.contains($menu[0], e.target)) {
	      hideMenu();
	    }
	  }
	
	  function hideMenu() {
	    if ($menu) {
	      $menu.remove();
	      $menu = null;
	      $activeHeaderColumn.removeClass('slick-header-column-active');
	    }
	  }
	
	  function handleHeaderCellRendered(e, args) {
	    var column = args.column;
	    var menu = column.header && column.header.menu;
	
	    if (menu) {
	      var $el = (0, _jquery2.default)('<div></div>').addClass('slick-header-menubutton').data('column', column).data('menu', menu);
	
	      if (options.buttonCssClass) {
	        $el.addClass(options.buttonCssClass);
	      }
	
	      if (options.buttonImage) {
	        $el.css('background-image', 'url(' + options.buttonImage + ')');
	      }
	
	      if (menu.tooltip) {
	        $el.attr('title', menu.tooltip);
	      }
	
	      $el.bind('click', showMenu).appendTo(args.node);
	    }
	  }
	
	  function handleBeforeHeaderCellDestroy(e, args) {
	    var column = args.column;
	
	    if (column.header && column.header.menu) {
	      (0, _jquery2.default)(args.node).find('.slick-header-menubutton').remove();
	    }
	  }
	
	  function showMenu(e) {
	    var $menuButton = (0, _jquery2.default)(this);
	    var menu = $menuButton.data('menu');
	    var columnDef = $menuButton.data('column');
	
	    // Let the user modify the menu or cancel altogether,
	    // or provide alternative menu implementation.
	    if (_self.onBeforeMenuShow.notify({
	      'grid': _grid,
	      'column': columnDef,
	      'menu': menu
	    }, e, _self) == false) {
	      return;
	    }
	
	    if (!$menu) {
	      $menu = (0, _jquery2.default)("<div class='slick-header-menu'></div>").appendTo(_grid.getContainerNode());
	    }
	    $menu.empty();
	
	    // Construct the menu items.
	    for (var i = 0; i < menu.items.length; i++) {
	      var item = menu.items[i];
	
	      var $li = (0, _jquery2.default)("<div class='slick-header-menuitem'></div>").data('command', item.command || '').data('column', columnDef).data('item', item).bind('click', handleMenuItemClick).appendTo($menu);
	
	      if (item.disabled) {
	        $li.addClass('slick-header-menuitem-disabled');
	      }
	
	      if (item.tooltip) {
	        $li.attr('title', item.tooltip);
	      }
	
	      var $icon = (0, _jquery2.default)("<div class='slick-header-menuicon'></div>").appendTo($li);
	
	      if (item.iconCssClass) {
	        $icon.addClass(item.iconCssClass);
	      }
	
	      if (item.iconImage) {
	        $icon.css('background-image', 'url(' + item.iconImage + ')');
	      }
	
	      (0, _jquery2.default)("<span class='slick-header-menucontent'></span>").text(item.title).appendTo($li);
	    }
	
	    // Position the menu.
	    $menu.offset({ top: (0, _jquery2.default)(this).offset().top + (0, _jquery2.default)(this).height(), left: (0, _jquery2.default)(this).offset().left });
	
	    // Mark the header as active to keep the highlighting.
	    $activeHeaderColumn = $menuButton.closest('.slick-header-column');
	    $activeHeaderColumn.addClass('slick-header-column-active');
	
	    // Stop propagation so that it doesn't register as a header click event.
	    e.preventDefault();
	    e.stopPropagation();
	  }
	
	  function handleMenuItemClick(e) {
	    var command = (0, _jquery2.default)(this).data('command');
	    var columnDef = (0, _jquery2.default)(this).data('column');
	    var item = (0, _jquery2.default)(this).data('item');
	
	    if (item.disabled) {
	      return;
	    }
	
	    hideMenu();
	
	    if (command != null && command != '') {
	      _self.onCommand.notify({
	        'grid': _grid,
	        'column': columnDef,
	        'command': command,
	        'item': item
	      }, e, _self);
	    }
	
	    // Stop propagation so that it doesn't register as a header click event.
	    e.preventDefault();
	    e.stopPropagation();
	  }
	
	  Object.assign(this, {
	    init: init,
	    destroy: destroy,
	
	    'onBeforeMenuShow': new _slick2.default.Event(),
	    'onCommand': new _slick2.default.Event()
	  });
	}

/***/ }),

/***/ 107:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _slick = __webpack_require__(108);
	
	var _slick2 = _interopRequireDefault(_slick);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _slick2.default;

/***/ }),

/***/ 108:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _slick = __webpack_require__(7);
	
	var _slick2 = _interopRequireDefault(_slick);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = RowMoveManager;
	
	
	function RowMoveManager(options) {
	  var _grid = void 0;
	  var _canvas = void 0;
	  var _dragging = void 0;
	  var _self = this;
	  var _handler = new _slick2.default.EventHandler();
	  var _defaults = {
	    cancelEditOnDrag: false
	  };
	
	  function init(grid) {
	    options = Object.assign({}, _defaults, options);
	    _grid = grid;
	    _canvas = _grid.getCanvasNode();
	    _handler.subscribe(_grid.onDragInit, handleDragInit).subscribe(_grid.onDragStart, handleDragStart).subscribe(_grid.onDrag, handleDrag).subscribe(_grid.onDragEnd, handleDragEnd);
	  }
	
	  function destroy() {
	    _handler.unsubscribeAll();
	  }
	
	  function handleDragInit(e, dd) {
	    // prevent the grid from cancelling drag'n'drop by default
	    e.stopImmediatePropagation();
	  }
	
	  function handleDragStart(e, dd) {
	    var cell = _grid.getCellFromEvent(e);
	
	    if (options.cancelEditOnDrag && _grid.getEditorLock().isActive()) {
	      _grid.getEditorLock().cancelCurrentEdit();
	    }
	
	    if (_grid.getEditorLock().isActive() || !/move|selectAndMove/.test(_grid.getColumns()[cell.cell].behavior)) {
	      return false;
	    }
	
	    _dragging = true;
	    e.stopImmediatePropagation();
	
	    var selectedRows = _grid.getSelectedRows();
	
	    if (selectedRows.length == 0 || $.inArray(cell.row, selectedRows) == -1) {
	      selectedRows = [cell.row];
	      _grid.setSelectedRows(selectedRows);
	    }
	
	    var rowHeight = _grid.getOptions().rowHeight;
	
	    dd.selectedRows = selectedRows;
	
	    dd.selectionProxy = $("<div class='slick-reorder-proxy'/>").css('position', 'absolute').css('zIndex', '99999').css('width', $(_canvas).innerWidth()).css('height', rowHeight * selectedRows.length).appendTo(_canvas);
	
	    dd.guide = $("<div class='slick-reorder-guide'/>").css('position', 'absolute').css('zIndex', '99998').css('width', $(_canvas).innerWidth()).css('top', -1000).appendTo(_canvas);
	
	    dd.insertBefore = -1;
	  }
	
	  function handleDrag(e, dd) {
	    if (!_dragging) {
	      return;
	    }
	
	    e.stopImmediatePropagation();
	
	    var top = e.pageY - $(_canvas).offset().top;
	    dd.selectionProxy.css('top', top - 5);
	
	    var insertBefore = Math.max(0, Math.min(Math.round(top / _grid.getOptions().rowHeight), _grid.getDataLength()));
	    if (insertBefore !== dd.insertBefore) {
	      var eventData = {
	        'rows': dd.selectedRows,
	        'insertBefore': insertBefore
	      };
	
	      if (_self.onBeforeMoveRows.notify(eventData) === false) {
	        dd.guide.css('top', -1000);
	        dd.canMove = false;
	      } else {
	        dd.guide.css('top', insertBefore * _grid.getOptions().rowHeight);
	        dd.canMove = true;
	      }
	
	      dd.insertBefore = insertBefore;
	    }
	  }
	
	  function handleDragEnd(e, dd) {
	    if (!_dragging) {
	      return;
	    }
	    _dragging = false;
	    e.stopImmediatePropagation();
	
	    dd.guide.remove();
	    dd.selectionProxy.remove();
	
	    if (dd.canMove) {
	      var eventData = {
	        'rows': dd.selectedRows,
	        'insertBefore': dd.insertBefore
	      };
	      // TODO:  _grid.remapCellCssClasses ?
	      _self.onMoveRows.notify(eventData);
	    }
	  }
	
	  Object.assign(this, {
	    'onBeforeMoveRows': new _slick2.default.Event(),
	    'onMoveRows': new _slick2.default.Event(),
	    init: init,
	    destroy: destroy
	  });
	}

/***/ }),

/***/ 109:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _slick = __webpack_require__(110);
	
	var _slick2 = _interopRequireDefault(_slick);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _slick2.default;

/***/ }),

/***/ 110:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _jquery = __webpack_require__(8);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _slick = __webpack_require__(7);
	
	var _slick2 = _interopRequireDefault(_slick);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = RowSelectionModel;
	
	
	function RowSelectionModel(options) {
	  var _grid = void 0;
	  var _ranges = [];
	  var _self = this;
	  var _handler = new _slick2.default.EventHandler();
	  var _inHandler = void 0;
	  var _options = void 0;
	  var _defaults = {
	    selectActiveRow: true
	  };
	
	  function init(grid) {
	    _options = Object.assign({}, _defaults, options);
	    _grid = grid;
	    _handler.subscribe(_grid.onActiveCellChanged, wrapHandler(handleActiveCellChange));
	    _handler.subscribe(_grid.onKeyDown, wrapHandler(handleKeyDown));
	    _handler.subscribe(_grid.onClick, wrapHandler(handleClick));
	  }
	
	  function destroy() {
	    _handler.unsubscribeAll();
	  }
	
	  function wrapHandler(handler) {
	    return function () {
	      if (!_inHandler) {
	        _inHandler = true;
	        handler.apply(this, arguments);
	        _inHandler = false;
	      }
	    };
	  }
	
	  function rangesToRows(ranges) {
	    var rows = [];
	    for (var i = 0; i < ranges.length; i++) {
	      for (var j = ranges[i].fromRow; j <= ranges[i].toRow; j++) {
	        rows.push(j);
	      }
	    }
	    return rows;
	  }
	
	  function rowsToRanges(rows) {
	    var ranges = [];
	    var lastCell = _grid.getColumns().length - 1;
	    for (var i = 0; i < rows.length; i++) {
	      ranges.push(new _slick2.default.Range(rows[i], 0, rows[i], lastCell));
	    }
	    return ranges;
	  }
	
	  function getRowsRange(from, to) {
	    var i = void 0;
	    var rows = [];
	    for (i = from; i <= to; i++) {
	      rows.push(i);
	    }
	    for (i = to; i < from; i++) {
	      rows.push(i);
	    }
	    return rows;
	  }
	
	  function getSelectedRows() {
	    return rangesToRows(_ranges);
	  }
	
	  function setSelectedRows(rows) {
	    setSelectedRanges(rowsToRanges(rows));
	  }
	
	  function setSelectedRanges(ranges) {
	    // simle check for: empty selection didn't change, prevent firing onSelectedRangesChanged
	    if ((!_ranges || _ranges.length === 0) && (!ranges || ranges.length === 0)) {
	      return;
	    }
	    _ranges = ranges;
	    _self.onSelectedRangesChanged.notify(_ranges);
	  }
	
	  function getSelectedRanges() {
	    return _ranges;
	  }
	
	  function handleActiveCellChange(e, data) {
	    if (_options.selectActiveRow && data.row != null) {
	      setSelectedRanges([new _slick2.default.Range(data.row, 0, data.row, _grid.getColumns().length - 1)]);
	    }
	  }
	
	  function handleKeyDown(e) {
	    var activeRow = _grid.getActiveCell();
	    if (activeRow && e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey && (e.which == 38 || e.which == 40)) {
	      var selectedRows = getSelectedRows();
	      selectedRows.sort(function (x, y) {
	        return x - y;
	      });
	
	      if (!selectedRows.length) {
	        selectedRows = [activeRow.row];
	      }
	
	      var top = selectedRows[0];
	      var bottom = selectedRows[selectedRows.length - 1];
	      var active = void 0;
	
	      if (e.which == 40) {
	        active = activeRow.row < bottom || top == bottom ? ++bottom : ++top;
	      } else {
	        active = activeRow.row < bottom ? --bottom : --top;
	      }
	
	      if (active >= 0 && active < _grid.getDataLength()) {
	        _grid.scrollRowIntoView(active);
	        _ranges = rowsToRanges(getRowsRange(top, bottom));
	        setSelectedRanges(_ranges);
	      }
	
	      e.preventDefault();
	      e.stopPropagation();
	    }
	  }
	
	  function handleClick(e) {
	    var cell = _grid.getCellFromEvent(e);
	    if (!cell || !_grid.canCellBeActive(cell.row, cell.cell)) {
	      return false;
	    }
	
	    if (!_grid.getOptions().multiSelect || !e.ctrlKey && !e.shiftKey && !e.metaKey) {
	      return false;
	    }
	
	    var selection = rangesToRows(_ranges);
	    var idx = _jquery2.default.inArray(cell.row, selection);
	
	    if (idx === -1 && (e.ctrlKey || e.metaKey)) {
	      selection.push(cell.row);
	      _grid.setActiveCell(cell.row, cell.cell);
	    } else if (idx !== -1 && (e.ctrlKey || e.metaKey)) {
	      selection = _jquery2.default.grep(selection, function (o, i) {
	        return o !== cell.row;
	      });
	      _grid.setActiveCell(cell.row, cell.cell);
	    } else if (selection.length && e.shiftKey) {
	      var last = selection.pop();
	      var from = Math.min(cell.row, last);
	      var to = Math.max(cell.row, last);
	      selection = [];
	      for (var i = from; i <= to; i++) {
	        if (i !== last) {
	          selection.push(i);
	        }
	      }
	      selection.push(last);
	      _grid.setActiveCell(cell.row, cell.cell);
	    }
	
	    _ranges = rowsToRanges(selection);
	    setSelectedRanges(_ranges);
	    e.stopImmediatePropagation();
	
	    return true;
	  }
	
	  Object.assign(this, {
	    getSelectedRows: getSelectedRows,
	    setSelectedRows: setSelectedRows,
	
	    getSelectedRanges: getSelectedRanges,
	    setSelectedRanges: setSelectedRanges,
	
	    init: init,
	    destroy: destroy,
	
	    'onSelectedRangesChanged': new _slick2.default.Event()
	  });
	}

/***/ }),

/***/ 111:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Plugins = exports.FrozenGrid = exports.Grid = exports.Data = exports.Formatters = exports.Editors = exports.Slick = undefined;
	
	var _slick = __webpack_require__(7);
	
	var _slick2 = _interopRequireDefault(_slick);
	
	var _slick3 = __webpack_require__(114);
	
	var _slick4 = _interopRequireDefault(_slick3);
	
	var _slick5 = __webpack_require__(113);
	
	var _slick6 = _interopRequireDefault(_slick5);
	
	var _slick7 = __webpack_require__(116);
	
	var _slick8 = _interopRequireDefault(_slick7);
	
	var _slickFrozen = __webpack_require__(112);
	
	var _slickFrozen2 = _interopRequireDefault(_slickFrozen);
	
	var _slick9 = __webpack_require__(115);
	
	var _slick10 = _interopRequireDefault(_slick9);
	
	var _plugins = __webpack_require__(92);
	
	var Plugins = _interopRequireWildcard(_plugins);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.Slick = _slick2.default;
	exports.Editors = _slick4.default;
	exports.Formatters = _slick10.default;
	exports.Data = _slick6.default;
	exports.Grid = _slick8.default;
	exports.FrozenGrid = _slickFrozen2.default;
	exports.Plugins = Plugins;

/***/ }),

/***/ 112:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _jquery = __webpack_require__(8);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _interact = __webpack_require__(54);
	
	var _interact2 = _interopRequireDefault(_interact);
	
	var _slick = __webpack_require__(7);
	
	var _slick2 = _interopRequireDefault(_slick);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// Slick.Grid globals pretense
	_slick2.default.FrozenGrid = SlickGrid; /**
	                                         * @license
	                                         * (c) 2009-2013 Michael Leibman
	                                         * michael{dot}leibman{at}gmail{dot}com
	                                         * http://github.com/mleibman/slickgrid
	                                         *
	                                         * Distributed under MIT license.
	                                         * All rights reserved.
	                                         *
	                                         * SlickGrid v2.2
	                                         *
	                                         * NOTES:
	                                         *     Cell/row DOM manipulations are done directly bypassing jQuery's DOM manipulation methods.
	                                         *     This increases the speed dramatically, but can only be done safely because there are no event handlers
	                                         *     or data associated with any cell/row DOM nodes.  Cell editors must make sure they implement .destroy()
	                                         *     and do proper cleanup.
	                                         */
	
	exports.default = SlickGrid;
	
	// shared across all grids on the page
	
	var scrollbarDimensions;
	var maxSupportedCssHeight; // browser's breaking point
	
	//////////////////////////////////////////////////////////////////////////////////////////////
	// SlickGrid class implementation (available as Slick.Grid)
	
	/**
	 * Creates a new instance of the grid.
	 * @class SlickGrid
	 * @constructor
	 * @param {Node}              container   Container node to create the grid in.
	 * @param {Array,Object}      data        An array of objects for databinding.
	 * @param {Array}             columns     An array of column definitions.
	 * @param {Object}            options     Grid options.
	 **/
	function SlickGrid(container, data, columns, options) {
	  // settings
	  var defaults = {
	    explicitInitialization: false,
	    rowHeight: 25,
	    defaultColumnWidth: 80,
	    enableAddRow: false,
	    leaveSpaceForNewRows: false,
	    editable: false,
	    autoEdit: true,
	    enableCellNavigation: true,
	    enableColumnReorder: true,
	    asyncEditorLoading: false,
	    asyncEditorLoadDelay: 100,
	    forceFitColumns: false,
	    enableAsyncPostRender: false,
	    asyncPostRenderDelay: 50,
	    autoHeight: false,
	    editorLock: _slick2.default.GlobalEditorLock,
	    showHeaderRow: false,
	    headerRowHeight: 25,
	    showFooterRow: false,
	    footerRowHeight: 25,
	    showTopPanel: false,
	    topPanelHeight: 25,
	    formatterFactory: null,
	    editorFactory: null,
	    cellFlashingCssClass: "flashing",
	    selectedCellCssClass: "selected",
	    multiSelect: true,
	    enableTextSelectionOnCells: false,
	    dataItemColumnValueExtractor: null,
	    frozenBottom: false,
	    frozenColumn: -1,
	    frozenRow: -1,
	    fullWidthRows: false,
	    multiColumnSort: false,
	    defaultFormatter: defaultFormatter,
	    forceSyncScrolling: false,
	    addNewRowCssClass: "new-row"
	  };
	
	  var columnDefaults = {
	    name: "",
	    resizable: true,
	    sortable: false,
	    minWidth: 30,
	    rerenderOnResize: false,
	    headerCssClass: null,
	    defaultSortAsc: true,
	    focusable: true,
	    selectable: true
	  };
	
	  // scroller
	  var th; // virtual height
	  var h; // real scrollable height
	  var ph; // page height
	  var n; // number of pages
	  var cj; // "jumpiness" coefficient
	
	  var page = 0; // current page
	  var offset = 0; // current page offset
	  var vScrollDir = 1;
	
	  // private
	  var initialized = false;
	  var $container;
	  var uid = "slickgrid_" + Math.round(1000000 * Math.random());
	  var self = this;
	  var $focusSink, $focusSink2;
	  var $groupHeaders = (0, _jquery2.default)();
	  var $headerScroller;
	  var $headers;
	  var $headerRow, $headerRowScroller, $headerRowSpacerL, $headerRowSpacerR;
	  var $footerRow, $footerRowScroller, $footerRowSpacerL, $footerRowSpacerR;
	  var $topPanelScroller;
	  var $topPanel;
	  var $viewport;
	  var $canvas;
	  var $style;
	  var $boundAncestors;
	  var treeColumns;
	  var stylesheet, columnCssRulesL, columnCssRulesR;
	  var viewportH, viewportW;
	  var canvasWidth, canvasWidthL, canvasWidthR;
	  var headersWidth, headersWidthL, headersWidthR;
	  var viewportHasHScroll, viewportHasVScroll;
	  var headerColumnWidthDiff = 0,
	      headerColumnHeightDiff = 0,
	      // border+padding
	  cellWidthDiff = 0,
	      cellHeightDiff = 0;
	  var absoluteColumnMinWidth;
	  var hasFrozenRows = false;
	  var frozenRowsHeight = 0;
	  var actualFrozenRow = -1;
	  var paneTopH = 0;
	  var paneBottomH = 0;
	  var viewportTopH = 0;
	  var viewportBottomH = 0;
	  var topPanelH = 0;
	  var headerRowH = 0;
	  var footerRowH = 0;
	
	  var tabbingDirection = 1;
	  var $activeCanvasNode;
	  var $activeViewportNode;
	  var activePosX;
	  var activeRow, activeCell;
	  var activeCellNode = null;
	  var currentEditor = null;
	  var serializedEditorValue;
	  var editController;
	
	  var rowsCache = {};
	  var renderedRows = 0;
	  var numVisibleRows = 0;
	  var prevScrollTop = 0;
	  var scrollTop = 0;
	  var lastRenderedScrollTop = 0;
	  var lastRenderedScrollLeft = 0;
	  var prevScrollLeft = 0;
	  var scrollLeft = 0;
	
	  var selectionModel;
	  var selectedRows = [];
	
	  var plugins = [];
	  var cellCssClasses = {};
	
	  var columnsById = {};
	  var sortColumns = [];
	  var columnPosLeft = [];
	  var columnPosRight = [];
	
	  // async call handles
	  var h_editorLoader = null;
	  var h_render = null;
	  var h_postrender = null;
	  var postProcessedRows = {};
	  var postProcessToRow = null;
	  var postProcessFromRow = null;
	
	  // perf counters
	  var counter_rows_rendered = 0;
	  var counter_rows_removed = 0;
	
	  // These two variables work around a bug with inertial scrolling in Webkit/Blink on Mac.
	  // See http://crbug.com/312427.
	  var rowNodeFromLastMouseWheelEvent; // this node must not be deleted while inertial scrolling
	  var zombieRowNodeFromLastMouseWheelEvent; // node that was hidden instead of getting deleted
	
	  var $paneHeaderL;
	  var $paneHeaderR;
	  var $paneTopL;
	  var $paneTopR;
	  var $paneBottomL;
	  var $paneBottomR;
	
	  var $headerScrollerL;
	  var $headerScrollerR;
	
	  var $headerL;
	  var $headerR;
	
	  var $groupHeadersL;
	  var $groupHeadersR;
	
	  var $headerRowScrollerL;
	  var $headerRowScrollerR;
	
	  var $footerRowScrollerL;
	  var $footerRowScrollerR;
	
	  var $headerRowL;
	  var $headerRowR;
	
	  var $footerRowL;
	  var $footerRowR;
	
	  var $topPanelScrollerL;
	  var $topPanelScrollerR;
	
	  var $topPanelL;
	  var $topPanelR;
	
	  var $viewportTopL;
	  var $viewportTopR;
	  var $viewportBottomL;
	  var $viewportBottomR;
	
	  var $canvasTopL;
	  var $canvasTopR;
	  var $canvasBottomL;
	  var $canvasBottomR;
	
	  var $viewportScrollContainerX;
	  var $viewportScrollContainerY;
	  var $headerScrollContainer;
	  var $headerRowScrollContainer;
	  var $footerRowScrollContainer;
	
	  //////////////////////////////////////////////////////////////////////////////////////////////
	  // Initialization
	
	  function init() {
	    $container = (0, _jquery2.default)(container);
	    if ($container.length < 1) {
	      throw new Error("SlickGrid requires a valid container, " + container + " does not exist in the DOM.");
	    }
	
	    // calculate these only once and share between grid instances
	    maxSupportedCssHeight = maxSupportedCssHeight || getMaxSupportedCssHeight();
	    scrollbarDimensions = scrollbarDimensions || measureScrollbar();
	
	    options = _jquery2.default.extend({}, defaults, options);
	    validateAndEnforceOptions();
	    columnDefaults.width = options.defaultColumnWidth;
	
	    treeColumns = new _slick2.default.TreeColumns(columns);
	    columns = treeColumns.extractColumns();
	
	    columnsById = {};
	    for (var i = 0; i < columns.length; i++) {
	      var m = columns[i] = _jquery2.default.extend({}, columnDefaults, columns[i]);
	      columnsById[m.id] = i;
	      if (m.minWidth && m.width < m.minWidth) {
	        m.width = m.minWidth;
	      }
	      if (m.maxWidth && m.width > m.maxWidth) {
	        m.width = m.maxWidth;
	      }
	    }
	
	    editController = {
	      "commitCurrentEdit": commitCurrentEdit,
	      "cancelCurrentEdit": cancelCurrentEdit
	    };
	
	    $container.empty().css("overflow", "hidden").css("outline", 0).addClass(uid).addClass("ui-widget");
	
	    // set up a positioning container if needed
	    if (!/relative|absolute|fixed/.test($container.css("position"))) {
	      $container.css("position", "relative");
	    }
	
	    $focusSink = (0, _jquery2.default)("<div tabIndex='0' hideFocus style='position:fixed;width:0;height:0;top:0;left:0;outline:0;'></div>").appendTo($container);
	
	    // Containers used for scrolling frozen columns and rows
	    $paneHeaderL = (0, _jquery2.default)("<div class='slick-pane slick-pane-header slick-pane-left' tabIndex='0' />").appendTo($container);
	    $paneHeaderR = (0, _jquery2.default)("<div class='slick-pane slick-pane-header slick-pane-right' tabIndex='0' />").appendTo($container);
	    $paneTopL = (0, _jquery2.default)("<div class='slick-pane slick-pane-top slick-pane-left' tabIndex='0' />").appendTo($container);
	    $paneTopR = (0, _jquery2.default)("<div class='slick-pane slick-pane-top slick-pane-right' tabIndex='0' />").appendTo($container);
	    $paneBottomL = (0, _jquery2.default)("<div class='slick-pane slick-pane-bottom slick-pane-left' tabIndex='0' />").appendTo($container);
	    $paneBottomR = (0, _jquery2.default)("<div class='slick-pane slick-pane-bottom slick-pane-right' tabIndex='0' />").appendTo($container);
	
	    // Append the header scroller containers
	    $headerScrollerL = (0, _jquery2.default)("<div class='ui-state-default slick-header slick-header-left' />").appendTo($paneHeaderL);
	    $headerScrollerR = (0, _jquery2.default)("<div class='ui-state-default slick-header slick-header-right' />").appendTo($paneHeaderR);
	
	    // Cache the header scroller containers
	    $headerScroller = (0, _jquery2.default)().add($headerScrollerL).add($headerScrollerR);
	
	    if (treeColumns.hasDepth()) {
	      $groupHeadersL = [], $groupHeadersR = [];
	      for (var index = 0; index < treeColumns.getDepth() - 1; index++) {
	        $groupHeadersL[index] = (0, _jquery2.default)("<div class='slick-group-header-columns slick-group-header-columns-left' style='left:-1000px' />").appendTo($headerScrollerL);
	        $groupHeadersR[index] = (0, _jquery2.default)("<div class='slick-group-header-columns slick-group-header-columns-right' style='left:-1000px' />").appendTo($headerScrollerR);
	      }
	
	      $groupHeaders = (0, _jquery2.default)().add($groupHeadersL).add($groupHeadersR);
	    }
	
	    // Append the columnn containers to the headers
	    $headerL = (0, _jquery2.default)("<div class='slick-header-columns slick-header-columns-left' style='left:-1000px' />").appendTo($headerScrollerL);
	    $headerR = (0, _jquery2.default)("<div class='slick-header-columns slick-header-columns-right' style='left:-1000px' />").appendTo($headerScrollerR);
	
	    // Cache the header columns
	    $headers = (0, _jquery2.default)().add($headerL).add($headerR);
	
	    $headerRowScrollerL = (0, _jquery2.default)("<div class='ui-state-default slick-headerrow' />").appendTo($paneTopL);
	    $headerRowScrollerR = (0, _jquery2.default)("<div class='ui-state-default slick-headerrow' />").appendTo($paneTopR);
	
	    $headerRowScroller = (0, _jquery2.default)().add($headerRowScrollerL).add($headerRowScrollerR);
	
	    $headerRowSpacerL = (0, _jquery2.default)("<div style='display:block;height:1px;position:absolute;top:0;left:0;'></div>").css("width", getCanvasWidth() + scrollbarDimensions.width + "px").appendTo($headerRowScrollerL);
	    $headerRowSpacerR = (0, _jquery2.default)("<div style='display:block;height:1px;position:absolute;top:0;left:0;'></div>").css("width", getCanvasWidth() + scrollbarDimensions.width + "px").appendTo($headerRowScrollerR);
	
	    $headerRowL = (0, _jquery2.default)("<div class='slick-headerrow-columns slick-headerrow-columns-left' />").appendTo($headerRowScrollerL);
	    $headerRowR = (0, _jquery2.default)("<div class='slick-headerrow-columns slick-headerrow-columns-right' />").appendTo($headerRowScrollerR);
	
	    $headerRow = (0, _jquery2.default)().add($headerRowL).add($headerRowR);
	
	    // Append the top panel scroller
	    $topPanelScrollerL = (0, _jquery2.default)("<div class='ui-state-default slick-top-panel-scroller' />").appendTo($paneTopL);
	    $topPanelScrollerR = (0, _jquery2.default)("<div class='ui-state-default slick-top-panel-scroller' />").appendTo($paneTopR);
	
	    $topPanelScroller = (0, _jquery2.default)().add($topPanelScrollerL).add($topPanelScrollerR);
	
	    // Append the top panel
	    $topPanelL = (0, _jquery2.default)("<div class='slick-top-panel' style='width:10000px' />").appendTo($topPanelScrollerL);
	    $topPanelR = (0, _jquery2.default)("<div class='slick-top-panel' style='width:10000px' />").appendTo($topPanelScrollerR);
	
	    $topPanel = (0, _jquery2.default)().add($topPanelL).add($topPanelR);
	
	    if (!options.showTopPanel) {
	      $topPanelScroller.hide();
	    }
	
	    if (!options.showHeaderRow) {
	      $headerRowScroller.hide();
	    }
	
	    // Append the viewport containers
	    $viewportTopL = (0, _jquery2.default)("<div class='slick-viewport slick-viewport-top slick-viewport-left' tabIndex='0' hideFocus />").appendTo($paneTopL);
	    $viewportTopR = (0, _jquery2.default)("<div class='slick-viewport slick-viewport-top slick-viewport-right' tabIndex='0' hideFocus />").appendTo($paneTopR);
	    $viewportBottomL = (0, _jquery2.default)("<div class='slick-viewport slick-viewport-bottom slick-viewport-left' tabIndex='0' hideFocus />").appendTo($paneBottomL);
	    $viewportBottomR = (0, _jquery2.default)("<div class='slick-viewport slick-viewport-bottom slick-viewport-right' tabIndex='0' hideFocus />").appendTo($paneBottomR);
	
	    // Cache the viewports
	    $viewport = (0, _jquery2.default)().add($viewportTopL).add($viewportTopR).add($viewportBottomL).add($viewportBottomR);
	
	    // Default the active viewport to the top left
	    $activeViewportNode = $viewportTopL;
	
	    // Append the canvas containers
	    $canvasTopL = (0, _jquery2.default)("<div class='grid-canvas grid-canvas-top grid-canvas-left' tabIndex='0' hideFocus />").appendTo($viewportTopL);
	    $canvasTopR = (0, _jquery2.default)("<div class='grid-canvas grid-canvas-top grid-canvas-right' tabIndex='0' hideFocus />").appendTo($viewportTopR);
	    $canvasBottomL = (0, _jquery2.default)("<div class='grid-canvas grid-canvas-bottom grid-canvas-left' tabIndex='0' hideFocus />").appendTo($viewportBottomL);
	    $canvasBottomR = (0, _jquery2.default)("<div class='grid-canvas grid-canvas-bottom grid-canvas-right' tabIndex='0' hideFocus />").appendTo($viewportBottomR);
	
	    // Cache the canvases
	    $canvas = (0, _jquery2.default)().add($canvasTopL).add($canvasTopR).add($canvasBottomL).add($canvasBottomR);
	
	    // Default the active canvas to the top left
	    $activeCanvasNode = $canvasTopL;
	
	    // footer Row
	    $footerRowScrollerR = (0, _jquery2.default)("<div class='ui-state-default slick-footerrow' />").appendTo($paneTopR);
	    $footerRowScrollerL = (0, _jquery2.default)("<div class='ui-state-default slick-footerrow' />").appendTo($paneTopL);
	
	    $footerRowScroller = (0, _jquery2.default)().add($footerRowScrollerL).add($footerRowScrollerR);
	
	    $footerRowSpacerL = (0, _jquery2.default)("<div style='display:block;height:1px;position:absolute;top:0;left:0;'></div>").css("width", getCanvasWidth() + scrollbarDimensions.width + "px").appendTo($footerRowScrollerL);
	    $footerRowSpacerR = (0, _jquery2.default)("<div style='display:block;height:1px;position:absolute;top:0;left:0;'></div>").css("width", getCanvasWidth() + scrollbarDimensions.width + "px").appendTo($footerRowScrollerR);
	
	    $footerRowL = (0, _jquery2.default)("<div class='slick-footerrow-columns slick-footerrow-columns-left' />").appendTo($footerRowScrollerL);
	    $footerRowR = (0, _jquery2.default)("<div class='slick-footerrow-columns slick-footerrow-columns-right' />").appendTo($footerRowScrollerR);
	
	    $footerRow = (0, _jquery2.default)().add($footerRowL).add($footerRowR);
	
	    if (!options.showFooterRow) {
	      $footerRowScroller.hide();
	    }
	
	    $focusSink2 = $focusSink.clone().appendTo($container);
	
	    if (!options.explicitInitialization) {
	      finishInitialization();
	    }
	  }
	
	  function finishInitialization() {
	    if (!initialized) {
	      initialized = true;
	
	      getViewportWidth();
	      getViewportHeight();
	
	      // header columns and cells may have different padding/border skewing width calculations (box-sizing, hello?)
	      // calculate the diff so we can set consistent sizes
	      measureCellPaddingAndBorder();
	
	      // for usability reasons, all text selection in SlickGrid is disabled
	      // with the exception of input and textarea elements (selection must
	      // be enabled there so that editors work as expected); note that
	      // selection in grid cells (grid body) is already unavailable in
	      // all browsers except IE
	      disableSelection($headers); // disable all text selection in header (including input and textarea)
	
	      if (!options.enableTextSelectionOnCells) {
	        // disable text selection in grid cells except in input and textarea elements
	        // (this is IE-specific, because selectstart event will only fire in IE)
	        $viewport.bind("selectstart.ui", function (event) {
	          return (0, _jquery2.default)(event.target).is("input,textarea");
	        });
	      }
	
	      setFrozenOptions();
	      setPaneVisibility();
	      setScroller();
	      setOverflow();
	
	      updateColumnCaches();
	      createColumnHeaders();
	      createColumnGroupHeaders();
	      createColumnFooter();
	      setupColumnSort();
	      createCssRules();
	      resizeCanvas();
	      bindAncestorScrollEvents();
	
	      $container.bind("resize.slickgrid", resizeCanvas);
	      $viewport.on("scroll", handleScroll);
	
	      if (_jquery2.default.fn.mousewheel && (options.frozenColumn > -1 || hasFrozenRows)) {
	        $viewport.on("mousewheel", handleMouseWheel);
	      }
	
	      $headerScroller.bind("contextmenu", handleHeaderContextMenu).bind("click", handleHeaderClick).delegate(".slick-header-column", "mouseenter", handleHeaderMouseEnter).delegate(".slick-header-column", "mouseleave", handleHeaderMouseLeave);
	      $headerRowScroller.bind("scroll", handleHeaderRowScroll);
	
	      $footerRowScroller.bind("scroll", handleFooterRowScroll);
	
	      $focusSink.add($focusSink2).bind("keydown", handleKeyDown);
	      $canvas.bind("keydown", handleKeyDown).bind("click", handleClick).bind("dblclick", handleDblClick).bind("contextmenu", handleContextMenu).delegate(".slick-cell", "mouseenter", handleMouseEnter).delegate(".slick-cell", "mouseleave", handleMouseLeave);
	
	      // legacy support for drag events
	      (0, _interact2.default)($canvas[0]).allowFrom('div.slick-cell').draggable({
	        onmove: handleDrag,
	        onstart: handleDragStart,
	        onend: handleDragEnd
	      }).styleCursor(false);
	
	      // Work around http://crbug.com/312427.
	      if (navigator.userAgent.toLowerCase().match(/webkit/) && navigator.userAgent.toLowerCase().match(/macintosh/)) {
	        $canvas.on("mousewheel", handleMouseWheel);
	      }
	    }
	  }
	
	  function hasFrozenColumns() {
	    return options.frozenColumn > -1;
	  }
	
	  function registerPlugin(plugin) {
	    plugins.unshift(plugin);
	    plugin.init(self);
	  }
	
	  function unregisterPlugin(plugin) {
	    for (var i = plugins.length; i >= 0; i--) {
	      if (plugins[i] === plugin) {
	        if (plugins[i].destroy) {
	          plugins[i].destroy();
	        }
	        plugins.splice(i, 1);
	        break;
	      }
	    }
	  }
	
	  function setSelectionModel(model) {
	    if (selectionModel) {
	      selectionModel.onSelectedRangesChanged.unsubscribe(handleSelectedRangesChanged);
	      if (selectionModel.destroy) {
	        selectionModel.destroy();
	      }
	    }
	
	    selectionModel = model;
	    if (selectionModel) {
	      selectionModel.init(self);
	      selectionModel.onSelectedRangesChanged.subscribe(handleSelectedRangesChanged);
	    }
	  }
	
	  function getSelectionModel() {
	    return selectionModel;
	  }
	
	  function getCanvasNode() {
	    return $canvas[0];
	  }
	
	  function getActiveCanvasNode(element) {
	    setActiveCanvasNode(element);
	
	    return $activeCanvasNode[0];
	  }
	
	  function getCanvases() {
	    return $canvas;
	  }
	
	  function setActiveCanvasNode(element) {
	    if (element) {
	      $activeCanvasNode = (0, _jquery2.default)(element.target).closest('.grid-canvas');
	    }
	  }
	
	  function getViewportNode() {
	    return $viewport[0];
	  }
	
	  function getActiveViewportNode(element) {
	    setActiveViewPortNode(element);
	
	    return $activeViewportNode[0];
	  }
	
	  function setActiveViewportNode(element) {
	    if (element) {
	      $activeViewportNode = (0, _jquery2.default)(element.target).closest('.slick-viewport');
	    }
	  }
	
	  function measureScrollbar() {
	    var $c = (0, _jquery2.default)("<div class='scrollbar-fix' style='position:absolute; top:-10000px; left:-10000px; width:100px; height:100px; overflow:scroll;'></div>").appendTo(document.body);
	    var dim = {
	      width: $c.width() - $c[0].clientWidth,
	      height: $c.height() - $c[0].clientHeight
	    };
	    $c.remove();
	    return dim;
	  }
	
	  function getHeadersWidth() {
	    headersWidth = headersWidthL = headersWidthR = 0;
	
	    for (var i = 0, ii = columns.length; i < ii; i++) {
	      var width = columns[i].width;
	
	      if (options.frozenColumn > -1 && i > options.frozenColumn) {
	        headersWidthR += width;
	      } else {
	        headersWidthL += width;
	      }
	    }
	
	    if (hasFrozenColumns()) {
	      headersWidthL = headersWidthL + 1000;
	
	      headersWidthR = Math.max(headersWidthR, viewportW) + headersWidthL;
	      headersWidthR += scrollbarDimensions.width;
	    } else {
	      headersWidthL += scrollbarDimensions.width;
	      headersWidthL = Math.max(headersWidthL, viewportW) + 1000;
	    }
	
	    headersWidth = headersWidthL + headersWidthR;
	  }
	
	  function getHeadersWidthL() {
	    headersWidthL = 0;
	
	    columns.forEach(function (column, i) {
	      if (!(options.frozenColumn > -1 && i > options.frozenColumn)) headersWidthL += column.width;
	    });
	
	    if (hasFrozenColumns()) {
	      headersWidthL += 1000;
	    } else {
	      headersWidthL += scrollbarDimensions.width;
	      headersWidthL = Math.max(headersWidthL, viewportW) + 1000;
	    }
	
	    return headersWidthL;
	  }
	
	  function getHeadersWidthR() {
	    headersWidthR = 0;
	
	    columns.forEach(function (column, i) {
	      if (options.frozenColumn > -1 && i > options.frozenColumn) headersWidthR += column.width;
	    });
	
	    if (hasFrozenColumns()) {
	      headersWidthR = Math.max(headersWidthR, viewportW) + getHeadersWidthL();
	      headersWidthR += scrollbarDimensions.width;
	    }
	
	    return headersWidthR;
	  }
	
	  function getCanvasWidth() {
	    var availableWidth = viewportHasVScroll ? viewportW - scrollbarDimensions.width : viewportW;
	
	    var i = columns.length;
	
	    canvasWidthL = canvasWidthR = 0;
	
	    while (i--) {
	      if (hasFrozenColumns() && i > options.frozenColumn) {
	        canvasWidthR += columns[i].width;
	      } else {
	        canvasWidthL += columns[i].width;
	      }
	    }
	
	    var totalRowWidth = canvasWidthL + canvasWidthR;
	
	    return options.fullWidthRows ? Math.max(totalRowWidth, availableWidth) : totalRowWidth;
	  }
	
	  function updateCanvasWidth(forceColumnWidthsUpdate) {
	    var oldCanvasWidth = canvasWidth;
	    var oldCanvasWidthL = canvasWidthL;
	    var oldCanvasWidthR = canvasWidthR;
	    var widthChanged;
	    canvasWidth = getCanvasWidth();
	
	    widthChanged = canvasWidth !== oldCanvasWidth || canvasWidthL !== oldCanvasWidthL || canvasWidthR !== oldCanvasWidthR;
	
	    if (widthChanged || hasFrozenColumns() || hasFrozenRows) {
	      $canvasTopL.width(canvasWidthL);
	
	      getHeadersWidth();
	
	      $headerL.width(headersWidthL);
	      $headerR.width(headersWidthR);
	
	      if (hasFrozenColumns()) {
	        $canvasTopR.width(canvasWidthR);
	
	        $paneHeaderL.width(canvasWidthL);
	        $paneHeaderR.css('left', canvasWidthL);
	        $paneHeaderR.css('width', viewportW - canvasWidthL);
	
	        $paneTopL.width(canvasWidthL);
	        $paneTopR.css('left', canvasWidthL);
	        $paneTopR.css('width', viewportW - canvasWidthL);
	
	        $headerRowScrollerL.width(canvasWidthL);
	        $headerRowScrollerR.width(viewportW - canvasWidthL);
	
	        $headerRowL.width(canvasWidthL);
	        $headerRowR.width(canvasWidthR);
	
	        $footerRowScrollerL.width(canvasWidthL);
	        $footerRowScrollerR.width(viewportW - canvasWidthL);
	
	        $footerRowL.width(canvasWidthL);
	        $footerRowR.width(canvasWidthR);
	
	        $viewportTopL.width(canvasWidthL);
	        $viewportTopR.width(viewportW - canvasWidthL);
	
	        if (hasFrozenRows) {
	          $paneBottomL.width(canvasWidthL);
	          $paneBottomR.css('left', canvasWidthL);
	
	          $viewportBottomL.width(canvasWidthL);
	          $viewportBottomR.width(viewportW - canvasWidthL);
	
	          $canvasBottomL.width(canvasWidthL);
	          $canvasBottomR.width(canvasWidthR);
	        }
	      } else {
	        $paneHeaderL.width('100%');
	
	        $paneTopL.width('100%');
	
	        $headerRowScrollerL.width('100%');
	
	        $headerRowL.width(canvasWidth);
	
	        $footerRowScrollerL.width('100%');
	
	        $footerRowL.width(canvasWidth);
	
	        $viewportTopL.width('100%');
	
	        if (hasFrozenRows) {
	          $viewportBottomL.width('100%');
	          $canvasBottomL.width(canvasWidthL);
	        }
	      }
	
	      viewportHasHScroll = canvasWidth > viewportW - scrollbarDimensions.width;
	    }
	
	    $headerRowSpacerL.width(canvasWidth + (viewportHasVScroll ? scrollbarDimensions.width : 0));
	    $headerRowSpacerR.width(canvasWidth + (viewportHasVScroll ? scrollbarDimensions.width : 0));
	
	    $footerRowSpacerL.width(canvasWidth + (viewportHasVScroll ? scrollbarDimensions.width : 0));
	    $footerRowSpacerR.width(canvasWidth + (viewportHasVScroll ? scrollbarDimensions.width : 0));
	
	    if (widthChanged || forceColumnWidthsUpdate) {
	      applyColumnWidths();
	    }
	  }
	
	  function disableSelection($target) {
	    if ($target && $target.jquery) {
	      $target.attr("unselectable", "on").css("MozUserSelect", "none").bind("selectstart.ui", function () {
	        return false;
	      }); // from jquery:ui.core.js 1.7.2
	    }
	  }
	
	  function getMaxSupportedCssHeight() {
	    var supportedHeight = 1000000;
	    // FF reports the height back but still renders blank after ~6M px
	    var testUpTo = navigator.userAgent.toLowerCase().match(/firefox/) ? 6000000 : 1000000000;
	    var div = (0, _jquery2.default)("<div style='display:none' />").appendTo(document.body);
	
	    while (true) {
	      var test = supportedHeight * 2;
	      div.css("height", test);
	      if (test > testUpTo || div.height() !== test) {
	        break;
	      } else {
	        supportedHeight = test;
	      }
	    }
	
	    div.remove();
	    return supportedHeight;
	  }
	
	  // TODO:  this is static.  need to handle page mutation.
	  function bindAncestorScrollEvents() {
	    var elem = hasFrozenRows && !options.frozenBottom ? $canvasBottomL[0] : $canvasTopL[0];
	    while ((elem = elem.parentNode) != document.body && elem != null) {
	      // bind to scroll containers only
	      if (elem == $viewportTopL[0] || elem.scrollWidth != elem.clientWidth || elem.scrollHeight != elem.clientHeight) {
	        var $elem = (0, _jquery2.default)(elem);
	        if (!$boundAncestors) {
	          $boundAncestors = $elem;
	        } else {
	          $boundAncestors = $boundAncestors.add($elem);
	        }
	        $elem.bind("scroll." + uid, handleActiveCellPositionChange);
	      }
	    }
	  }
	
	  function unbindAncestorScrollEvents() {
	    if (!$boundAncestors) {
	      return;
	    }
	    $boundAncestors.unbind("scroll." + uid);
	    $boundAncestors = null;
	  }
	
	  function updateColumnHeader(columnId, title, toolTip) {
	    if (!initialized) {
	      return;
	    }
	    var idx = getColumnIndex(columnId);
	    if (idx == null) {
	      return;
	    }
	
	    var columnDef = columns[idx];
	    var $header = $headers.children().eq(idx);
	    if ($header) {
	      if (title !== undefined) {
	        columns[idx].name = title;
	      }
	      if (toolTip !== undefined) {
	        columns[idx].toolTip = toolTip;
	      }
	
	      trigger(self.onBeforeHeaderCellDestroy, {
	        "node": $header[0],
	        "column": columnDef
	      });
	
	      $header.attr("title", toolTip || "").children().eq(0).html(title);
	
	      trigger(self.onHeaderCellRendered, {
	        "node": $header[0],
	        "column": columnDef
	      });
	    }
	  }
	
	  function getHeaderRow() {
	    return hasFrozenColumns() ? $headerRow : $headerRow[0];
	  }
	
	  function getHeaderRowColumn(columnId) {
	    var idx = getColumnIndex(columnId);
	
	    var $headerRowTarget;
	
	    if (hasFrozenColumns()) {
	      if (idx <= options.frozenColumn) {
	        $headerRowTarget = $headerRowL;
	      } else {
	        $headerRowTarget = $headerRowR;
	
	        idx -= options.frozenColumn + 1;
	      }
	    } else {
	      $headerRowTarget = $headerRowL;
	    }
	
	    var $header = $headerRowTarget.children().eq(idx);
	    return $header && $header[0];
	  }
	
	  function getFooterRow() {
	    return hasFrozenColumns() ? $footerRow : $footerRow[0];
	  }
	
	  function getFooterRowColumn(columnId) {
	    var idx = getColumnIndex(columnId);
	
	    var $footerRowTarget;
	
	    if (hasFrozenColumns()) {
	      if (idx <= options.frozenColumn) {
	        $footerRowTarget = $footerRowL;
	      } else {
	        $footerRowTarget = $footerRowR;
	
	        idx -= options.frozenColumn + 1;
	      }
	    } else {
	      $footerRowTarget = $footerRowL;
	    }
	
	    var $footer = $footerRowTarget.children().eq(idx);
	    return $footer && $footer[0];
	  }
	
	  function createColumnFooter() {
	    $footerRow.find(".slick-footerrow-column").each(function () {
	      var columnDef = (0, _jquery2.default)(this).data("column");
	      if (columnDef) {
	        trigger(self.onBeforeFooterRowCellDestroy, {
	          "node": this,
	          "column": columnDef
	        });
	      }
	    });
	
	    $footerRowL.empty();
	    $footerRowR.empty();
	
	    for (var i = 0; i < columns.length; i++) {
	      var m = columns[i];
	
	      var footerRowCell = (0, _jquery2.default)("<div class='ui-state-default slick-footerrow-column l" + i + " r" + i + "'></div>").data("column", m).addClass(hasFrozenColumns() && i <= options.frozenColumn ? 'frozen' : '').appendTo(hasFrozenColumns() && i > options.frozenColumn ? $footerRowR : $footerRowL);
	
	      trigger(self.onFooterRowCellRendered, {
	        "node": footerRowCell[0],
	        "column": m
	      });
	    }
	  }
	
	  function createColumnGroupHeaders() {
	    var columnsLength = 0;
	    var frozenColumnsValid = false;
	
	    if (!treeColumns.hasDepth()) return;
	
	    for (var index = 0; index < $groupHeadersL.length; index++) {
	
	      $groupHeadersL[index].empty();
	      $groupHeadersR[index].empty();
	
	      var groupColumns = treeColumns.getColumnsInDepth(index);
	
	      for (var indexGroup in groupColumns) {
	        var m = groupColumns[indexGroup];
	
	        columnsLength += m.extractColumns().length;
	
	        if (hasFrozenColumns() && index == 0 && columnsLength - 1 === options.frozenColumn) frozenColumnsValid = true;
	
	        (0, _jquery2.default)("<div class='ui-state-default slick-group-header-column' />").html("<span class='slick-column-name'>" + m.name + "</span>").attr("id", "" + uid + m.id).attr("title", m.toolTip || "").data("column", m).addClass(m.headerCssClass || "").addClass(hasFrozenColumns() && columnsLength - 1 <= options.frozenColumn ? 'frozen' : '').appendTo(hasFrozenColumns() && columnsLength - 1 > options.frozenColumn ? $groupHeadersR[index] : $groupHeadersL[index]);
	      }
	
	      if (hasFrozenColumns() && index == 0 && !frozenColumnsValid) {
	        $groupHeadersL[index].empty();
	        $groupHeadersR[index].empty();
	        alert("All columns of group should to be grouped!");
	        break;
	      }
	    }
	
	    applyColumnGroupHeaderWidths();
	  }
	
	  function createColumnHeaders() {
	    function onMouseEnter() {
	      (0, _jquery2.default)(this).addClass("ui-state-hover");
	    }
	
	    function onMouseLeave() {
	      (0, _jquery2.default)(this).removeClass("ui-state-hover");
	    }
	
	    $headers.find(".slick-header-column").each(function () {
	      var columnDef = (0, _jquery2.default)(this).data("column");
	      if (columnDef) {
	        trigger(self.onBeforeHeaderCellDestroy, {
	          "node": this,
	          "column": columnDef
	        });
	      }
	    });
	
	    $headerL.empty();
	    $headerR.empty();
	
	    getHeadersWidth();
	
	    $headerL.width(headersWidthL);
	    $headerR.width(headersWidthR);
	
	    $headerRow.find(".slick-headerrow-column").each(function () {
	      var columnDef = (0, _jquery2.default)(this).data("column");
	      if (columnDef) {
	        trigger(self.onBeforeHeaderRowCellDestroy, {
	          "node": this,
	          "column": columnDef
	        });
	      }
	    });
	
	    $headerRowL.empty();
	    $headerRowR.empty();
	
	    for (var i = 0; i < columns.length; i++) {
	      var m = columns[i];
	
	      var $headerTarget = hasFrozenColumns() ? i <= options.frozenColumn ? $headerL : $headerR : $headerL;
	      var $headerRowTarget = hasFrozenColumns() ? i <= options.frozenColumn ? $headerRowL : $headerRowR : $headerRowL;
	
	      var header = (0, _jquery2.default)("<div class='ui-state-default slick-header-column' />").html("<span class='slick-column-name'>" + m.name + "</span>").width(m.width - headerColumnWidthDiff).attr("id", "" + uid + m.id).attr("title", m.toolTip || "").data("column", m).addClass(m.headerCssClass || "").addClass(hasFrozenColumns() && i <= options.frozenColumn ? 'frozen' : '').appendTo($headerTarget);
	
	      if (options.enableColumnReorder || m.sortable) {
	        header.on('mouseenter', onMouseEnter).on('mouseleave', onMouseLeave);
	      }
	
	      if (m.sortable) {
	        header.addClass("slick-header-sortable");
	        header.append("<span class='slick-sort-indicator' />");
	      }
	
	      trigger(self.onHeaderCellRendered, {
	        "node": header[0],
	        "column": m
	      });
	
	      if (options.showHeaderRow) {
	        var headerRowCell = (0, _jquery2.default)("<div class='ui-state-default slick-headerrow-column l" + i + " r" + i + "'></div>").data("column", m).appendTo($headerRowTarget);
	
	        trigger(self.onHeaderRowCellRendered, {
	          "node": headerRowCell[0],
	          "column": m
	        });
	      }
	    }
	
	    setSortColumns(sortColumns);
	    setupColumnResize();
	    if (options.enableColumnReorder) {
	      setupColumnReorder();
	    }
	  }
	
	  function setupColumnSort() {
	    $headers.click(function (e) {
	      // temporary workaround for a bug in jQuery 1.7.1 (http://bugs.jquery.com/ticket/11328)
	      e.metaKey = e.metaKey || e.ctrlKey;
	
	      if ((0, _jquery2.default)(e.target).hasClass("slick-resizable-handle")) {
	        return;
	      }
	
	      var $col = (0, _jquery2.default)(e.target).closest(".slick-header-column");
	      if (!$col.length) {
	        return;
	      }
	
	      var column = $col.data("column");
	      if (column.sortable) {
	        if (!getEditorLock().commitCurrentEdit()) {
	          return;
	        }
	
	        var sortOpts = null;
	        var i = 0;
	        for (; i < sortColumns.length; i++) {
	          if (sortColumns[i].columnId == column.id) {
	            sortOpts = sortColumns[i];
	            sortOpts.sortAsc = !sortOpts.sortAsc;
	            break;
	          }
	        }
	
	        if (e.metaKey && options.multiColumnSort) {
	          if (sortOpts) {
	            sortColumns.splice(i, 1);
	          }
	        } else {
	          if (!e.shiftKey && !e.metaKey || !options.multiColumnSort) {
	            sortColumns = [];
	          }
	
	          if (!sortOpts) {
	            sortOpts = {
	              columnId: column.id,
	              sortAsc: column.defaultSortAsc
	            };
	            sortColumns.push(sortOpts);
	          } else if (sortColumns.length == 0) {
	            sortColumns.push(sortOpts);
	          }
	        }
	
	        setSortColumns(sortColumns);
	
	        if (!options.multiColumnSort) {
	          trigger(self.onSort, {
	            multiColumnSort: false,
	            sortCol: column,
	            sortAsc: sortOpts.sortAsc
	          }, e);
	        } else {
	          trigger(self.onSort, {
	            multiColumnSort: true,
	            sortCols: _jquery2.default.map(sortColumns, function (col) {
	              return {
	                sortCol: columns[getColumnIndex(col.columnId)],
	                sortAsc: col.sortAsc
	              };
	            })
	          }, e);
	        }
	      }
	    });
	  }
	
	  function currentPositionInHeader(id) {
	    var currentPosition = 0;
	    $headers.find('.slick-header-column').each(function (i) {
	      if (this.id == id) {
	        currentPosition = i;
	        return false;
	      }
	    });
	
	    return currentPosition;
	  }
	
	  function limitPositionInGroup(idColumn) {
	    var groupColumnOfPreviousPosition,
	        startLimit = 0,
	        endLimit = 0;
	
	    treeColumns.getColumnsInDepth($groupHeadersL.length - 1).some(function (groupColumn) {
	      startLimit = endLimit;
	      endLimit += groupColumn.columns.length;
	
	      groupColumn.columns.some(function (column) {
	
	        if (column.id === idColumn) groupColumnOfPreviousPosition = groupColumn;
	
	        return groupColumnOfPreviousPosition;
	      });
	
	      return groupColumnOfPreviousPosition;
	    });
	
	    endLimit--;
	
	    return {
	      start: startLimit,
	      end: endLimit,
	      group: groupColumnOfPreviousPosition
	    };
	  }
	
	  function remove(arr, elem) {
	    var index = arr.lastIndexOf(elem);
	    if (index > -1) {
	      arr.splice(index, 1);
	      remove(arr, elem);
	    }
	  }
	
	  function columnPositionValidInGroup($item) {
	    var currentPosition = currentPositionInHeader($item[0].id);
	    var limit = limitPositionInGroup($item.data('column').id);
	    var positionValid = limit.start <= currentPosition && currentPosition <= limit.end;
	
	    return {
	      limit: limit,
	      valid: positionValid,
	      message: positionValid ? '' : 'Column "'.concat($item.text(), '" can be reordered only within the "', limit.group.name, '" group!')
	    };
	  }
	
	  function setupColumnReorder() {
	    var x = 0;
	    var delta = 0;
	    var placeholder = document.createElement('div');
	
	    placeholder.className = 'interact-placeholder';
	
	    (0, _interact2.default)('.slick-header-column').ignoreFrom('.slick-resizable-handle').draggable({
	      inertia: true,
	      // keep the element within the area of it's parent
	      restrict: {
	        restriction: 'parent',
	        endOnly: true,
	        elementRect: { top: 0, left: 0, bottom: 0, right: 0 }
	      },
	      // enable autoScroll
	      autoScroll: true,
	      axis: 'x',
	      onstart: function onstart(event) {
	        x = 0;
	        delta = event.target.offsetWidth;
	
	        // get old order
	        $headers.find('.slick-header-column').each(function (index) {
	          (0, _jquery2.default)(this).data('index', index);
	        });
	
	        placeholder.style.height = event.target.offsetHeight + 'px';
	        placeholder.style.width = delta + 'px';
	
	        (0, _jquery2.default)(event.target).after(placeholder).css({
	          position: 'absolute',
	          zIndex: 1000,
	          marginLeft: (0, _jquery2.default)(event.target).position().left - 1000
	        });
	      },
	
	      onmove: function onmove(event) {
	        x += event.dx;
	        event.target.style.transform = 'translate3d(' + x + 'px, -3px, 100px)';
	        // event.target.style.marginLeft = x + 'px';
	      },
	
	      onend: function onend(event) {
	        x = 0;
	        delta = 0;
	
	        if (treeColumns.hasDepth()) {
	          var validPositionInGroup = columnPositionValidInGroup((0, _jquery2.default)(event.target));
	          var limit = validPositionInGroup.limit;
	
	          var cancel = !validPositionInGroup.valid;
	
	          if (cancel) alert(validPositionInGroup.message);
	        }
	
	        placeholder.parentNode.removeChild(placeholder);
	
	        if (cancel) {
	          event.target.style.transform = 'none';
	          setColumns(getColumns());
	          return;
	        }
	
	        (0, _jquery2.default)(event.target).css({
	          position: 'relative',
	          zIndex: '',
	          marginLeft: 0,
	          transform: 'none'
	        });
	
	        var newColumns = [];
	        $headers.find('.slick-header-column').each(function (index) {
	          newColumns.push(columns[(0, _jquery2.default)(this).data('index')]);
	          (0, _jquery2.default)(this).removeData('index');
	        });
	
	        setColumns(newColumns);
	
	        trigger(self.onColumnsReordered, { impactedColumns: getImpactedColumns(limit), grid: self });
	        setupColumnResize();
	      }
	    }).dropzone({
	      accept: '.slick-header-column',
	
	      ondragenter: function ondragenter(event) {
	        event.target.classList.add('interact-drop-active');
	        event.relatedTarget.classList.add('interact-can-drop');
	      },
	
	      ondragleave: function ondragleave(event) {
	        event.target.classList.remove('interact-drop-active');
	        event.relatedTarget.classList.remove('interact-can-drop');
	      },
	
	      ondrop: function ondrop(event) {
	        event.target.classList.remove('interact-drop-active');
	        event.relatedTarget.classList.remove('interact-can-drop');
	        (0, _jquery2.default)(event.target)[x > 0 ? 'after' : 'before'](event.relatedTarget);
	      }
	    }).styleCursor(false);
	  }
	
	  function getImpactedColumns(limit) {
	    var impactedColumns = [];
	
	    if (limit != undefined) {
	
	      for (var i = limit.start; i <= limit.end; i++) {
	        impactedColumns.push(columns[i]);
	      }
	    } else {
	
	      impactedColumns = columns;
	    }
	
	    return impactedColumns;
	  }
	
	  function setupColumnResize() {
	    var $col, j, c, pageX, columnElements, minPageX, maxPageX, firstResizable, lastResizable;
	    columnElements = $headers.children();
	    columnElements.find('.slick-resizable-handle').remove();
	    columnElements.each(function (i, e) {
	      if (columns[i].resizable) {
	        if (firstResizable === undefined) {
	          firstResizable = i;
	        }
	        lastResizable = i;
	      }
	    });
	    if (firstResizable === undefined) {
	      return;
	    }
	    columnElements.each(function (i, element) {
	      if (i < firstResizable || options.forceFitColumns && i >= lastResizable) {
	        return;
	      }
	      $col = (0, _jquery2.default)(element);
	
	      var $handle = (0, _jquery2.default)("<div class='slick-resizable-handle' />");
	      $handle.appendTo(element);
	
	      if ($col.data('resizable')) return;
	
	      var activeColumn = columns[i];
	      if (activeColumn.resizable) {
	        $col.data('resizable', true);
	        (0, _interact2.default)(element).resizable({
	          preserveAspectRatio: false,
	          edges: { left: true, right: true, bottom: false, top: false }
	        }).on('resizestart', function (event) {
	          if (!getEditorLock().commitCurrentEdit()) {
	            return false;
	          }
	          activeColumn.previousWidth = event.rect.width;
	          event.target.classList.add('slick-header-column-active');
	        }).on('resizemove', function (event) {
	          var x = event.dx;
	          var width = activeColumn.width += x;
	
	          if (activeColumn.minWidth > 0 && activeColumn.minWidth > width) width = activeColumn.minWidth;else if (activeColumn.maxWidth > 0 && activeColumn.maxWidth < width) width = activeColumn.maxWidth;
	
	          activeColumn.width = width;
	
	          if (options.forceFitColumns) {
	            autosizeColumns();
	          }
	          applyColumnHeaderWidths();
	          if (options.syncColumnCellResize) {
	            applyColumnWidths();
	          }
	        }).on('resizeend', function (event) {
	          event.target.classList.remove('slick-header-column-active');
	          if (treeColumns.hasDepth()) createColumnGroupHeaders();
	
	          invalidateAllRows();
	          updateCanvasWidth(true);
	          render();
	          trigger(self.onColumnsResized, { grid: self });
	        });
	      }
	    });
	  }
	
	  function getVBoxDelta($el) {
	    var p = ["borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom"];
	    var delta = 0;
	    _jquery2.default.each(p, function (n, val) {
	      delta += parseFloat($el.css(val)) || 0;
	    });
	    return delta;
	  }
	
	  function setFrozenOptions() {
	    options.frozenColumn = options.frozenColumn >= 0 && options.frozenColumn < columns.length ? parseInt(options.frozenColumn) : -1;
	
	    options.frozenRow = options.frozenRow >= 0 && options.frozenRow < numVisibleRows ? parseInt(options.frozenRow) : -1;
	
	    if (options.frozenRow > -1) {
	      hasFrozenRows = true;
	      frozenRowsHeight = options.frozenRow * options.rowHeight;
	
	      var dataLength = getDataLength() || this.data.length;
	
	      actualFrozenRow = options.frozenBottom ? dataLength - options.frozenRow : options.frozenRow;
	    } else {
	      hasFrozenRows = false;
	    }
	  }
	
	  function setPaneVisibility() {
	    if (hasFrozenColumns()) {
	      $paneHeaderR.show();
	      $paneTopR.show();
	
	      if (hasFrozenRows) {
	        $paneBottomL.show();
	        $paneBottomR.show();
	      } else {
	        $paneBottomR.hide();
	        $paneBottomL.hide();
	      }
	    } else {
	      $paneHeaderR.hide();
	      $paneTopR.hide();
	      $paneBottomR.hide();
	
	      if (hasFrozenRows) {
	        $paneBottomL.show();
	      } else {
	        $paneBottomR.hide();
	        $paneBottomL.hide();
	      }
	    }
	  }
	
	  function setOverflow() {
	    $viewportTopL.css({
	      'overflow-x': hasFrozenColumns() ? hasFrozenRows ? 'hidden' : 'scroll' : hasFrozenRows ? 'hidden' : 'auto',
	      'overflow-y': hasFrozenColumns() ? hasFrozenRows ? 'hidden' : 'hidden' : hasFrozenRows ? 'scroll' : 'auto'
	    });
	
	    $viewportTopR.css({
	      'overflow-x': hasFrozenColumns() ? hasFrozenRows ? 'hidden' : 'scroll' : hasFrozenRows ? 'hidden' : 'auto',
	      'overflow-y': hasFrozenColumns() ? hasFrozenRows ? 'scroll' : 'auto' : hasFrozenRows ? 'scroll' : 'auto'
	    });
	
	    $viewportBottomL.css({
	      'overflow-x': hasFrozenColumns() ? hasFrozenRows ? 'scroll' : 'auto' : hasFrozenRows ? 'auto' : 'auto',
	      'overflow-y': hasFrozenColumns() ? hasFrozenRows ? 'hidden' : 'hidden' : hasFrozenRows ? 'scroll' : 'auto'
	    });
	
	    $viewportBottomR.css({
	      'overflow-x': hasFrozenColumns() ? hasFrozenRows ? 'scroll' : 'auto' : hasFrozenRows ? 'auto' : 'auto',
	      'overflow-y': hasFrozenColumns() ? hasFrozenRows ? 'auto' : 'auto' : hasFrozenRows ? 'auto' : 'auto'
	    });
	  }
	
	  function setScroller() {
	    if (hasFrozenColumns()) {
	      $headerScrollContainer = $headerScrollerR;
	      $headerRowScrollContainer = $headerRowScrollerR;
	      $footerRowScrollContainer = $footerRowScrollerR;
	
	      if (hasFrozenRows) {
	        if (options.frozenBottom) {
	          $viewportScrollContainerX = $viewportBottomR;
	          $viewportScrollContainerY = $viewportTopR;
	        } else {
	          $viewportScrollContainerX = $viewportScrollContainerY = $viewportBottomR;
	        }
	      } else {
	        $viewportScrollContainerX = $viewportScrollContainerY = $viewportTopR;
	      }
	    } else {
	      $headerScrollContainer = $headerScrollerL;
	      $headerRowScrollContainer = $headerRowScrollerL;
	      $footerRowScrollContainer = $footerRowScrollerL;
	
	      if (hasFrozenRows) {
	        if (options.frozenBottom) {
	          $viewportScrollContainerX = $viewportBottomL;
	          $viewportScrollContainerY = $viewportTopL;
	        } else {
	          $viewportScrollContainerX = $viewportScrollContainerY = $viewportBottomL;
	        }
	      } else {
	        $viewportScrollContainerX = $viewportScrollContainerY = $viewportTopL;
	      }
	    }
	  }
	
	  function measureCellPaddingAndBorder() {
	    var el;
	    var h = ["borderLeftWidth", "borderRightWidth", "paddingLeft", "paddingRight"];
	    var v = ["borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom"];
	
	    el = (0, _jquery2.default)("<div class='ui-state-default slick-header-column' style='visibility:hidden'>-</div>").appendTo($headers);
	    headerColumnWidthDiff = headerColumnHeightDiff = 0;
	    if (el.css("box-sizing") != "border-box" && el.css("-moz-box-sizing") != "border-box" && el.css("-webkit-box-sizing") != "border-box") {
	      _jquery2.default.each(h, function (n, val) {
	        headerColumnWidthDiff += parseFloat(el.css(val)) || 0;
	      });
	      _jquery2.default.each(v, function (n, val) {
	        headerColumnHeightDiff += parseFloat(el.css(val)) || 0;
	      });
	    }
	    el.remove();
	
	    var r = (0, _jquery2.default)("<div class='slick-row' />").appendTo($canvas);
	    el = (0, _jquery2.default)("<div class='slick-cell' id='' style='visibility:hidden'>-</div>").appendTo(r);
	    cellWidthDiff = cellHeightDiff = 0;
	    if (el.css("box-sizing") != "border-box" && el.css("-moz-box-sizing") != "border-box" && el.css("-webkit-box-sizing") != "border-box") {
	      _jquery2.default.each(h, function (n, val) {
	        cellWidthDiff += parseFloat(el.css(val)) || 0;
	      });
	      _jquery2.default.each(v, function (n, val) {
	        cellHeightDiff += parseFloat(el.css(val)) || 0;
	      });
	    }
	    r.remove();
	
	    absoluteColumnMinWidth = Math.max(headerColumnWidthDiff, cellWidthDiff);
	  }
	
	  function createCssRules() {
	    $style = (0, _jquery2.default)("<style type='text/css' rel='stylesheet' />").appendTo((0, _jquery2.default)("head"));
	    var rowHeight = options.rowHeight - cellHeightDiff;
	    var rules = ["." + uid + " .slick-group-header-column { left: 1000px; }", "." + uid + " .slick-header-column { left: 1000px; }", "." + uid + " .slick-top-panel { height:" + options.topPanelHeight + "px; }", "." + uid + " .slick-headerrow-columns { height:" + options.headerRowHeight + "px; }", "." + uid + " .slick-cell { height:" + rowHeight + "px; }", "." + uid + " .slick-row { height:" + options.rowHeight + "px; }", "." + uid + " .slick-footerrow-columns { height:" + options.footerRowHeight + "px; }"];
	
	    for (var i = 0; i < columns.length; i++) {
	      rules.push("." + uid + " .l" + i + " { }");
	      rules.push("." + uid + " .r" + i + " { }");
	    }
	
	    if ($style[0].styleSheet) {
	      // IE
	      $style[0].styleSheet.cssText = rules.join(" ");
	    } else {
	      $style[0].appendChild(document.createTextNode(rules.join(" ")));
	    }
	  }
	
	  function getColumnCssRules(idx) {
	    if (!stylesheet) {
	      var sheets = document.styleSheets;
	      for (var i = 0; i < sheets.length; i++) {
	        if ((sheets[i].ownerNode || sheets[i].owningElement) == $style[0]) {
	          stylesheet = sheets[i];
	          break;
	        }
	      }
	
	      if (!stylesheet) {
	        throw new Error("Cannot find stylesheet.");
	      }
	
	      // find and cache column CSS rules
	      columnCssRulesL = [];
	      columnCssRulesR = [];
	      var cssRules = stylesheet.cssRules || stylesheet.rules;
	      var matches, columnIdx;
	      for (var i = 0; i < cssRules.length; i++) {
	        var selector = cssRules[i].selectorText;
	        if (matches = /\.l\d+/.exec(selector)) {
	          columnIdx = parseInt(matches[0].substr(2, matches[0].length - 2), 10);
	          columnCssRulesL[columnIdx] = cssRules[i];
	        } else if (matches = /\.r\d+/.exec(selector)) {
	          columnIdx = parseInt(matches[0].substr(2, matches[0].length - 2), 10);
	          columnCssRulesR[columnIdx] = cssRules[i];
	        }
	      }
	    }
	
	    return {
	      "left": columnCssRulesL[idx],
	      "right": columnCssRulesR[idx]
	    };
	  }
	
	  function removeCssRules() {
	    $style.remove();
	    stylesheet = null;
	  }
	
	  function destroy() {
	    getEditorLock().cancelCurrentEdit();
	
	    trigger(self.onBeforeDestroy, {});
	
	    var i = plugins.length;
	    while (i--) {
	      unregisterPlugin(plugins[i]);
	    }
	
	    unbindAncestorScrollEvents();
	    $container.unbind(".slickgrid");
	    removeCssRules();
	
	    $container.empty().removeClass(uid);
	  }
	
	  //////////////////////////////////////////////////////////////////////////////////////////////
	  // General
	
	  function trigger(evt, args, e) {
	    e = e || new _slick2.default.EventData();
	    args = args || {};
	    args.grid = self;
	    return evt.notify(args, e, self);
	  }
	
	  function getEditorLock() {
	    return options.editorLock;
	  }
	
	  function getEditController() {
	    return editController;
	  }
	
	  function getColumnIndex(id) {
	    return columnsById[id];
	  }
	
	  function autosizeColumns() {
	    var i,
	        c,
	        widths = [],
	        shrinkLeeway = 0,
	        total = 0,
	        prevTotal,
	        availWidth = viewportHasVScroll ? viewportW - scrollbarDimensions.width : viewportW;
	
	    for (i = 0; i < columns.length; i++) {
	      c = columns[i];
	      widths.push(c.width);
	      total += c.width;
	      if (c.resizable) {
	        shrinkLeeway += c.width - Math.max(c.minWidth, absoluteColumnMinWidth);
	      }
	    }
	
	    // shrink
	    prevTotal = total;
	    while (total > availWidth && shrinkLeeway) {
	      var shrinkProportion = (total - availWidth) / shrinkLeeway;
	      for (i = 0; i < columns.length && total > availWidth; i++) {
	        c = columns[i];
	        var width = widths[i];
	        if (!c.resizable || width <= c.minWidth || width <= absoluteColumnMinWidth) {
	          continue;
	        }
	        var absMinWidth = Math.max(c.minWidth, absoluteColumnMinWidth);
	        var shrinkSize = Math.floor(shrinkProportion * (width - absMinWidth)) || 1;
	        shrinkSize = Math.min(shrinkSize, width - absMinWidth);
	        total -= shrinkSize;
	        shrinkLeeway -= shrinkSize;
	        widths[i] -= shrinkSize;
	      }
	      if (prevTotal <= total) {
	        // avoid infinite loop
	        break;
	      }
	      prevTotal = total;
	    }
	
	    // grow
	    prevTotal = total;
	    while (total < availWidth) {
	      var growProportion = availWidth / total;
	      for (i = 0; i < columns.length && total < availWidth; i++) {
	        c = columns[i];
	        var currentWidth = widths[i];
	        var growSize;
	
	        if (!c.resizable || c.maxWidth <= currentWidth) {
	          growSize = 0;
	        } else {
	          growSize = Math.min(Math.floor(growProportion * currentWidth) - currentWidth, c.maxWidth - currentWidth || 1000000) || 1;
	        }
	        total += growSize;
	        widths[i] += growSize;
	      }
	      if (prevTotal >= total) {
	        // avoid infinite loop
	        break;
	      }
	      prevTotal = total;
	    }
	
	    var reRender = false;
	    for (i = 0; i < columns.length; i++) {
	      if (columns[i].rerenderOnResize && columns[i].width != widths[i]) {
	        reRender = true;
	      }
	      columns[i].width = widths[i];
	    }
	
	    applyColumnHeaderWidths();
	    applyColumnGroupHeaderWidths();
	    updateCanvasWidth(true);
	    if (reRender) {
	      invalidateAllRows();
	      render();
	    }
	  }
	
	  function applyColumnGroupHeaderWidths() {
	    if (!treeColumns.hasDepth()) return;
	
	    for (var depth = $groupHeadersL.length - 1; depth >= 0; depth--) {
	
	      var groupColumns = treeColumns.getColumnsInDepth(depth);
	
	      (0, _jquery2.default)().add($groupHeadersL[depth]).add($groupHeadersR[depth]).each(function (i) {
	        var $groupHeader = (0, _jquery2.default)(this),
	            currentColumnIndex = 0;
	
	        $groupHeader.width(i == 0 ? getHeadersWidthL() : getHeadersWidthR());
	
	        $groupHeader.children().each(function () {
	          var $groupHeaderColumn = (0, _jquery2.default)(this);
	
	          var m = (0, _jquery2.default)(this).data('column');
	
	          m.width = 0;
	
	          m.columns.forEach(function () {
	            var $headerColumn = $groupHeader.next().children(':eq(' + currentColumnIndex++ + ')');
	            m.width += $headerColumn.outerWidth();
	          });
	
	          $groupHeaderColumn.width(m.width - headerColumnWidthDiff);
	        });
	      });
	    }
	  }
	
	  function applyColumnHeaderWidths() {
	    if (!initialized) {
	      return;
	    }
	    var h;
	    for (var i = 0, headers = $headers.children(), ii = headers.length; i < ii; i++) {
	      h = (0, _jquery2.default)(headers[i]);
	      if (h.width() !== columns[i].width - headerColumnWidthDiff) {
	        h.width(columns[i].width - headerColumnWidthDiff);
	      }
	    }
	
	    updateColumnCaches();
	  }
	
	  function applyColumnWidths() {
	    var x = 0,
	        w,
	        rule;
	    for (var i = 0; i < columns.length; i++) {
	      w = columns[i].width;
	
	      rule = getColumnCssRules(i);
	      rule.left.style.left = x + "px";
	      rule.right.style.right = (options.frozenColumn != -1 && i > options.frozenColumn ? canvasWidthR : canvasWidthL) - x - w + "px";
	
	      // If this column is frozen, reset the css left value since the
	      // column starts in a new viewport.
	      if (options.frozenColumn == i) {
	        x = 0;
	      } else {
	        x += columns[i].width;
	      }
	    }
	  }
	
	  function setSortColumn(columnId, ascending) {
	    setSortColumns([{
	      columnId: columnId,
	      sortAsc: ascending
	    }]);
	  }
	
	  function setSortColumns(cols) {
	    sortColumns = cols;
	
	    var headerColumnEls = $headers.children();
	    headerColumnEls.removeClass("slick-header-column-sorted").find(".slick-sort-indicator").removeClass("slick-sort-indicator-asc slick-sort-indicator-desc");
	
	    _jquery2.default.each(sortColumns, function (i, col) {
	      if (col.sortAsc == null) {
	        col.sortAsc = true;
	      }
	      var columnIndex = getColumnIndex(col.columnId);
	      if (columnIndex != null) {
	        headerColumnEls.eq(columnIndex).addClass("slick-header-column-sorted").find(".slick-sort-indicator").addClass(col.sortAsc ? "slick-sort-indicator-asc" : "slick-sort-indicator-desc");
	      }
	    });
	  }
	
	  function getSortColumns() {
	    return sortColumns;
	  }
	
	  function handleSelectedRangesChanged(e, ranges) {
	    selectedRows = [];
	    var hash = {};
	    for (var i = 0; i < ranges.length; i++) {
	      for (var j = ranges[i].fromRow; j <= ranges[i].toRow; j++) {
	        if (!hash[j]) {
	          // prevent duplicates
	          selectedRows.push(j);
	          hash[j] = {};
	        }
	        for (var k = ranges[i].fromCell; k <= ranges[i].toCell; k++) {
	          if (canCellBeSelected(j, k)) {
	            hash[j][columns[k].id] = options.selectedCellCssClass;
	          }
	        }
	      }
	    }
	
	    setCellCssStyles(options.selectedCellCssClass, hash);
	
	    trigger(self.onSelectedRowsChanged, {
	      rows: getSelectedRows()
	    }, e);
	  }
	
	  function getColumns() {
	    return columns;
	  }
	
	  function updateColumnCaches() {
	    // Pre-calculate cell boundaries.
	    columnPosLeft = [];
	    columnPosRight = [];
	    var x = 0;
	    for (var i = 0, ii = columns.length; i < ii; i++) {
	      columnPosLeft[i] = x;
	      columnPosRight[i] = x + columns[i].width;
	
	      if (options.frozenColumn == i) {
	        x = 0;
	      } else {
	        x += columns[i].width;
	      }
	    }
	  }
	
	  function setColumns(columnDefinitions) {
	    var _treeColumns = new _slick2.default.TreeColumns(columnDefinitions);
	    if (_treeColumns.hasDepth()) {
	      treeColumns = _treeColumns;
	      columns = treeColumns.extractColumns();
	    } else {
	      columns = columnDefinitions;
	    }
	
	    columnsById = {};
	    for (var i = 0; i < columns.length; i++) {
	      var m = columns[i] = _jquery2.default.extend({}, columnDefaults, columns[i]);
	      columnsById[m.id] = i;
	      if (m.minWidth && m.width < m.minWidth) {
	        m.width = m.minWidth;
	      }
	      if (m.maxWidth && m.width > m.maxWidth) {
	        m.width = m.maxWidth;
	      }
	    }
	
	    updateColumnCaches();
	
	    if (initialized) {
	      setPaneVisibility();
	      setOverflow();
	
	      invalidateAllRows();
	      createColumnHeaders();
	      createColumnGroupHeaders();
	      createColumnFooter();
	      removeCssRules();
	      createCssRules();
	      resizeCanvas();
	      updateCanvasWidth();
	      applyColumnWidths();
	      handleScroll();
	    }
	  }
	
	  function getOptions() {
	    return options;
	  }
	
	  function setOptions(args) {
	    if (!getEditorLock().commitCurrentEdit()) {
	      return;
	    }
	
	    makeActiveCellNormal();
	
	    if (options.enableAddRow !== args.enableAddRow) {
	      invalidateRow(getDataLength());
	    }
	
	    options = _jquery2.default.extend(options, args);
	    validateAndEnforceOptions();
	
	    setFrozenOptions();
	    setScroller();
	    zombieRowNodeFromLastMouseWheelEvent = null;
	
	    setColumns(treeColumns.extractColumns());
	    render();
	  }
	
	  function validateAndEnforceOptions() {
	    if (options.autoHeight) {
	      options.leaveSpaceForNewRows = false;
	    }
	  }
	
	  function setData(newData, scrollToTop) {
	    data = newData;
	    invalidateAllRows();
	    updateRowCount();
	    if (scrollToTop) {
	      scrollTo(0);
	    }
	  }
	
	  function getData() {
	    return data;
	  }
	
	  function getDataLength() {
	    if (data.getLength) {
	      return data.getLength();
	    } else {
	      return data.length;
	    }
	  }
	
	  function getDataLengthIncludingAddNew() {
	    return getDataLength() + (options.enableAddRow ? 1 : 0);
	  }
	
	  function getDataItem(i) {
	    if (data.getItem) {
	      return data.getItem(i);
	    } else {
	      return data[i];
	    }
	  }
	
	  function getTopPanel() {
	    return $topPanel[0];
	  }
	
	  function setTopPanelVisibility(visible) {
	    if (options.showTopPanel != visible) {
	      options.showTopPanel = visible;
	      if (visible) {
	        $topPanelScroller.slideDown("fast", resizeCanvas);
	      } else {
	        $topPanelScroller.slideUp("fast", resizeCanvas);
	      }
	    }
	  }
	
	  function setHeaderRowVisibility(visible) {
	    if (options.showHeaderRow != visible) {
	      options.showHeaderRow = visible;
	      if (visible) {
	        $headerRowScroller.slideDown("fast", resizeCanvas);
	      } else {
	        $headerRowScroller.slideUp("fast", resizeCanvas);
	      }
	    }
	  }
	
	  function setFooterRowVisibility(visible) {
	    if (options.showFooterRow != visible) {
	      options.showFooterRow = visible;
	      if (visible) {
	        $footerRowScroller.fadeIn("fast", resizeCanvas);
	      } else {
	        $footerRowScroller.slideDown("fast", resizeCanvas);
	      }
	    }
	  }
	
	  function getContainerNode() {
	    return $container.get(0);
	  }
	
	  //////////////////////////////////////////////////////////////////////////////////////////////
	  // Rendering / Scrolling
	
	  function getRowTop(row) {
	    return options.rowHeight * row - offset;
	  }
	
	  function getRowFromPosition(y) {
	    return Math.floor((y + offset) / options.rowHeight);
	  }
	
	  function scrollTo(y) {
	    y = Math.max(y, 0);
	    y = Math.min(y, th - $viewportScrollContainerY.height() + (viewportHasHScroll || hasFrozenColumns() ? scrollbarDimensions.height : 0));
	
	    var oldOffset = offset;
	
	    page = Math.min(n - 1, Math.floor(y / ph));
	    offset = Math.round(page * cj);
	    var newScrollTop = y - offset;
	
	    if (offset != oldOffset) {
	      var range = getVisibleRange(newScrollTop);
	      cleanupRows(range);
	      updateRowPositions();
	    }
	
	    if (prevScrollTop != newScrollTop) {
	      vScrollDir = prevScrollTop + oldOffset < newScrollTop + offset ? 1 : -1;
	
	      lastRenderedScrollTop = scrollTop = prevScrollTop = newScrollTop;
	
	      if (hasFrozenColumns()) {
	        $viewportTopL[0].scrollTop = newScrollTop;
	      }
	
	      if (hasFrozenRows) {
	        $viewportBottomL[0].scrollTop = $viewportBottomR[0].scrollTop = newScrollTop;
	      }
	
	      $viewportScrollContainerY[0].scrollTop = newScrollTop;
	
	      trigger(self.onViewportChanged, {});
	    }
	  }
	
	  function defaultFormatter(row, cell, value, columnDef, dataContext) {
	    if (value == null) {
	      return "";
	    } else {
	      return (value + "").replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">");
	    }
	  }
	
	  function getFormatter(row, column) {
	    var rowMetadata = data.getItemMetadata && data.getItemMetadata(row);
	
	    // look up by id, then index
	    var columnOverrides = rowMetadata && rowMetadata.columns && (rowMetadata.columns[column.id] || rowMetadata.columns[getColumnIndex(column.id)]);
	
	    return columnOverrides && columnOverrides.formatter || rowMetadata && rowMetadata.formatter || column.formatter || options.formatterFactory && options.formatterFactory.getFormatter(column) || options.defaultFormatter;
	  }
	
	  function callFormatter(row, cell, value, m, item) {
	
	    var result;
	
	    // pass metadata to formatter
	    var metadata = data.getItemMetadata && data.getItemMetadata(row);
	    metadata = metadata && metadata.columns;
	
	    if (metadata) {
	      var columnData = metadata[m.id] || metadata[cell];
	      result = getFormatter(row, m)(row, cell, value, m, item, columnData);
	    } else {
	      result = getFormatter(row, m)(row, cell, value, m, item);
	    }
	
	    return result;
	  }
	
	  function getEditor(row, cell) {
	    var column = columns[cell];
	    var rowMetadata = data.getItemMetadata && data.getItemMetadata(row);
	    var columnMetadata = rowMetadata && rowMetadata.columns;
	
	    if (columnMetadata && columnMetadata[column.id] && columnMetadata[column.id].editor !== undefined) {
	      return columnMetadata[column.id].editor;
	    }
	    if (columnMetadata && columnMetadata[cell] && columnMetadata[cell].editor !== undefined) {
	      return columnMetadata[cell].editor;
	    }
	
	    return column.editor || options.editorFactory && options.editorFactory.getEditor(column);
	  }
	
	  function getDataItemValueForColumn(item, columnDef) {
	    if (options.dataItemColumnValueExtractor) {
	      return options.dataItemColumnValueExtractor(item, columnDef);
	    }
	    return item[columnDef.field];
	  }
	
	  function appendRowHtml(stringArrayL, stringArrayR, row, range, dataLength) {
	    var d = getDataItem(row);
	    var dataLoading = row < dataLength && !d;
	    var rowCss = "slick-row" + (hasFrozenRows && row < options.frozenRow ? ' frozen' : '') + (dataLoading ? " loading" : "") + (row === activeRow ? " active" : "") + (row % 2 == 1 ? " odd" : " even");
	
	    if (!d) {
	      rowCss += " " + options.addNewRowCssClass;
	    }
	
	    var metadata = data.getItemMetadata && data.getItemMetadata(row);
	
	    if (metadata && metadata.cssClasses) {
	      rowCss += " " + metadata.cssClasses;
	    }
	
	    var frozenRowOffset = getFrozenRowOffset(row);
	
	    var rowHtml = "<div class='ui-widget-content " + rowCss + "' style='top:" + (getRowTop(row) - frozenRowOffset) + "px'>";
	
	    stringArrayL.push(rowHtml);
	
	    if (hasFrozenColumns()) {
	      stringArrayR.push(rowHtml);
	    }
	
	    var colspan, m;
	    for (var i = 0, ii = columns.length; i < ii; i++) {
	      m = columns[i];
	      colspan = 1;
	      if (metadata && metadata.columns) {
	        var columnData = metadata.columns[m.id] || metadata.columns[i];
	        colspan = columnData && columnData.colspan || 1;
	        if (colspan === "*") {
	          colspan = ii - i;
	        }
	      }
	
	      // Do not render cells outside of the viewport.
	      if (columnPosRight[Math.min(ii - 1, i + colspan - 1)] > range.leftPx) {
	        if (columnPosLeft[i] > range.rightPx) {
	          // All columns to the right are outside the range.
	          break;
	        }
	
	        if (hasFrozenColumns() && i > options.frozenColumn) {
	          appendCellHtml(stringArrayR, row, i, colspan, d);
	        } else {
	          appendCellHtml(stringArrayL, row, i, colspan, d);
	        }
	      } else if (hasFrozenColumns() && i <= options.frozenColumn) {
	        appendCellHtml(stringArrayL, row, i, colspan, d);
	      }
	
	      if (colspan > 1) {
	        i += colspan - 1;
	      }
	    }
	
	    stringArrayL.push("</div>");
	
	    if (hasFrozenColumns()) {
	      stringArrayR.push("</div>");
	    }
	  }
	
	  function appendCellHtml(stringArray, row, cell, colspan, item) {
	    var m = columns[cell];
	    var cellCss = "slick-cell l" + cell + " r" + Math.min(columns.length - 1, cell + colspan - 1) + (m.cssClass ? " " + m.cssClass : "");
	
	    if (hasFrozenColumns() && cell <= options.frozenColumn) cellCss += ' frozen';
	
	    if (row === activeRow && cell === activeCell) cellCss += " active";
	
	    // TODO:  merge them together in the setter
	    for (var key in cellCssClasses) {
	      if (cellCssClasses[key][row] && cellCssClasses[key][row][m.id]) {
	        cellCss += " " + cellCssClasses[key][row][m.id];
	      }
	    }
	
	    stringArray.push("<div class='" + cellCss + "'>");
	
	    // if there is a corresponding row (if not, this is the Add New row or this data hasn't been loaded yet)
	    if (item) {
	      var value = getDataItemValueForColumn(item, m);
	      stringArray.push(callFormatter(row, cell, value, m, item));
	    }
	
	    stringArray.push("</div>");
	
	    rowsCache[row].cellRenderQueue.push(cell);
	    rowsCache[row].cellColSpans[cell] = colspan;
	  }
	
	  function cleanupRows(rangeToKeep) {
	    for (var i in rowsCache) {
	      var removeFrozenRow = true;
	
	      if (hasFrozenRows && (options.frozenBottom && i >= actualFrozenRow || // Frozen bottom rows
	      !options.frozenBottom && i <= actualFrozenRow // Frozen top rows
	      )) {
	        removeFrozenRow = false;
	      }
	
	      if ((i = parseInt(i, 10)) !== activeRow && (i < rangeToKeep.top || i > rangeToKeep.bottom) && removeFrozenRow) {
	        removeRowFromCache(i);
	      }
	    }
	  }
	
	  function invalidate() {
	    updateRowCount();
	    invalidateAllRows();
	    render();
	  }
	
	  function invalidateAllRows() {
	    if (currentEditor) {
	      makeActiveCellNormal();
	    }
	    for (var row in rowsCache) {
	      removeRowFromCache(row);
	    }
	  }
	
	  function removeRowFromCache(row) {
	    var cacheEntry = rowsCache[row];
	    if (!cacheEntry) {
	      return;
	    }
	
	    if (rowNodeFromLastMouseWheelEvent == cacheEntry.rowNode[0] || hasFrozenColumns() && rowNodeFromLastMouseWheelEvent == cacheEntry.rowNode[1]) {
	
	      cacheEntry.rowNode.hide();
	
	      zombieRowNodeFromLastMouseWheelEvent = cacheEntry.rowNode;
	    } else {
	
	      cacheEntry.rowNode.each(function () {
	        this.parentElement.removeChild(this);
	      });
	    }
	
	    delete rowsCache[row];
	    delete postProcessedRows[row];
	    renderedRows--;
	    counter_rows_removed++;
	  }
	
	  function invalidateRows(rows) {
	    var i, rl;
	    if (!rows || !rows.length) {
	      return;
	    }
	    vScrollDir = 0;
	    for (i = 0, rl = rows.length; i < rl; i++) {
	      if (currentEditor && activeRow === rows[i]) {
	        makeActiveCellNormal();
	      }
	      if (rowsCache[rows[i]]) {
	        removeRowFromCache(rows[i]);
	      }
	    }
	  }
	
	  function invalidateRow(row) {
	    invalidateRows([row]);
	  }
	
	  function updateCell(row, cell) {
	    var cellNode = getCellNode(row, cell);
	    if (!cellNode) {
	      return;
	    }
	
	    var m = columns[cell],
	        d = getDataItem(row);
	    if (currentEditor && activeRow === row && activeCell === cell) {
	      currentEditor.loadValue(d);
	    } else {
	      cellNode.innerHTML = d ? callFormatter(row, cell, getDataItemValueForColumn(d, m), m, d) : "";
	      invalidatePostProcessingResults(row);
	    }
	  }
	
	  function updateRow(row) {
	    var cacheEntry = rowsCache[row];
	    if (!cacheEntry) {
	      return;
	    }
	
	    ensureCellNodesInRowsCache(row);
	
	    var d = getDataItem(row);
	
	    for (var columnIdx in cacheEntry.cellNodesByColumnIdx) {
	      if (!cacheEntry.cellNodesByColumnIdx.hasOwnProperty(columnIdx)) {
	        continue;
	      }
	
	      columnIdx = columnIdx | 0;
	      var m = columns[columnIdx],
	          node = cacheEntry.cellNodesByColumnIdx[columnIdx][0];
	
	      if (row === activeRow && columnIdx === activeCell && currentEditor) {
	        currentEditor.loadValue(d);
	      } else if (d) {
	        node.innerHTML = callFormatter(row, columnIdx, getDataItemValueForColumn(d, m), m, d);
	      } else {
	        node.innerHTML = "";
	      }
	    }
	
	    invalidatePostProcessingResults(row);
	  }
	
	  function getViewportHeight() {
	    if (options.autoHeight) {
	      viewportH = options.rowHeight * getDataLengthIncludingAddNew() + (options.frozenColumn == -1 ? $headers.outerHeight() : 0);
	    } else {
	      topPanelH = options.showTopPanel ? options.topPanelHeight + getVBoxDelta($topPanelScroller) : 0;
	
	      headerRowH = options.showHeaderRow ? options.headerRowHeight + getVBoxDelta($headerRowScroller) : 0;
	
	      footerRowH = options.showFooterRow ? options.footerRowHeight + getVBoxDelta($footerRowScroller) : 0;
	
	      viewportH = parseFloat(_jquery2.default.css($container[0], "height", true)) - parseFloat(_jquery2.default.css($container[0], "paddingTop", true)) - parseFloat(_jquery2.default.css($container[0], "paddingBottom", true)) - parseFloat(_jquery2.default.css($headerScroller[0], "height")) - getVBoxDelta($headerScroller) - topPanelH - headerRowH - footerRowH;
	    }
	
	    numVisibleRows = Math.ceil(viewportH / options.rowHeight);
	  }
	
	  function getViewportWidth() {
	    viewportW = parseFloat(_jquery2.default.css($container[0], "width", true));
	  }
	
	  function resizeCanvas() {
	    if (!initialized) {
	      return;
	    }
	
	    paneTopH = 0;
	    paneBottomH = 0;
	    viewportTopH = 0;
	    viewportBottomH = 0;
	
	    getViewportWidth();
	    getViewportHeight();
	
	    // Account for Frozen Rows
	    if (hasFrozenRows) {
	      if (options.frozenBottom) {
	        paneTopH = viewportH - frozenRowsHeight - scrollbarDimensions.height;
	
	        paneBottomH = frozenRowsHeight + scrollbarDimensions.height;
	      } else {
	        paneTopH = frozenRowsHeight;
	        paneBottomH = viewportH - frozenRowsHeight;
	      }
	    } else {
	      paneTopH = viewportH;
	    }
	
	    // The top pane includes the top panel and the header row
	    paneTopH += topPanelH + headerRowH + footerRowH;
	
	    if (hasFrozenColumns() && options.autoHeight) {
	      paneTopH += scrollbarDimensions.height;
	    }
	
	    // The top viewport does not contain the top panel or header row
	    viewportTopH = paneTopH - topPanelH - headerRowH - footerRowH;
	
	    if (options.autoHeight) {
	      if (hasFrozenColumns()) {
	        $container.height(paneTopH + parseFloat(_jquery2.default.css($headerScrollerL[0], "height")));
	      }
	
	      $paneTopL.css('position', 'relative');
	    }
	
	    $paneTopL.css({
	      'top': $paneHeaderL.height(),
	      'height': paneTopH
	    });
	
	    var paneBottomTop = $paneTopL.position().top + paneTopH;
	
	    $viewportTopL.height(viewportTopH);
	
	    if (hasFrozenColumns()) {
	      $paneTopR.css({
	        'top': $paneHeaderL.height(),
	        'height': paneTopH
	      });
	
	      $viewportTopR.height(viewportTopH);
	
	      if (hasFrozenRows) {
	        $paneBottomL.css({
	          'top': paneBottomTop,
	          'height': paneBottomH
	        });
	
	        $paneBottomR.css({
	          'top': paneBottomTop,
	          'height': paneBottomH
	        });
	
	        $viewportBottomR.height(paneBottomH);
	      }
	    } else {
	      if (hasFrozenRows) {
	        $paneBottomL.css({
	          'width': '100%',
	          'height': paneBottomH
	        });
	
	        $paneBottomL.css('top', paneBottomTop);
	      }
	    }
	
	    if (hasFrozenRows) {
	      $viewportBottomL.height(paneBottomH);
	
	      if (options.frozenBottom) {
	        $canvasBottomL.height(frozenRowsHeight);
	
	        if (hasFrozenColumns()) {
	          $canvasBottomR.height(frozenRowsHeight);
	        }
	      } else {
	        $canvasTopL.height(frozenRowsHeight);
	
	        if (hasFrozenColumns()) {
	          $canvasTopR.height(frozenRowsHeight);
	        }
	      }
	    } else {
	      $viewportTopR.height(viewportTopH);
	    }
	
	    if (options.forceFitColumns) {
	      autosizeColumns();
	    }
	
	    updateRowCount();
	    handleScroll();
	    // Since the width has changed, force the render() to reevaluate virtually rendered cells.
	    lastRenderedScrollLeft = -1;
	    render();
	  }
	
	  function updateRowCount() {
	    if (!initialized) {
	      return;
	    }
	
	    var dataLengthIncludingAddNew = getDataLengthIncludingAddNew();
	    var numberOfRows = 0;
	    var oldH = hasFrozenRows && !options.frozenBottom ? $canvasBottomL.height() : $canvasTopL.height();
	
	    if (hasFrozenRows) {
	      var numberOfRows = getDataLength() - options.frozenRow;
	    } else {
	      var numberOfRows = dataLengthIncludingAddNew + (options.leaveSpaceForNewRows ? numVisibleRows - 1 : 0);
	    }
	
	    var tempViewportH = $viewportScrollContainerY.height();
	    var oldViewportHasVScroll = viewportHasVScroll;
	    // with autoHeight, we do not need to accommodate the vertical scroll bar
	    viewportHasVScroll = !options.autoHeight && numberOfRows * options.rowHeight > tempViewportH;
	
	    makeActiveCellNormal();
	
	    // remove the rows that are now outside of the data range
	    // this helps avoid redundant calls to .removeRow() when the size of the data decreased by thousands of rows
	    var l = dataLengthIncludingAddNew - 1;
	    for (var i in rowsCache) {
	      if (i >= l) {
	        removeRowFromCache(i);
	      }
	    }
	
	    th = Math.max(options.rowHeight * numberOfRows, tempViewportH - scrollbarDimensions.height);
	
	    if (activeCellNode && activeRow > l) {
	      resetActiveCell();
	    }
	
	    if (th < maxSupportedCssHeight) {
	      // just one page
	      h = ph = th;
	      n = 1;
	      cj = 0;
	    } else {
	      // break into pages
	      h = maxSupportedCssHeight;
	      ph = h / 100;
	      n = Math.floor(th / ph);
	      cj = (th - h) / (n - 1);
	    }
	
	    if (h !== oldH) {
	      if (hasFrozenRows && !options.frozenBottom) {
	        $canvasBottomL.css("height", h);
	
	        if (hasFrozenColumns()) {
	          $canvasBottomR.css("height", h);
	        }
	      } else {
	        $canvasTopL.css("height", h);
	        $canvasTopR.css("height", h);
	      }
	
	      scrollTop = $viewportScrollContainerY[0].scrollTop;
	    }
	
	    var oldScrollTopInRange = scrollTop + offset <= th - tempViewportH;
	
	    if (th == 0 || scrollTop == 0) {
	      page = offset = 0;
	    } else if (oldScrollTopInRange) {
	      // maintain virtual position
	      scrollTo(scrollTop + offset);
	    } else {
	      // scroll to bottom
	      scrollTo(th - tempViewportH);
	    }
	
	    if (h != oldH && options.autoHeight) {
	      resizeCanvas();
	    }
	
	    if (options.forceFitColumns && oldViewportHasVScroll != viewportHasVScroll) {
	      autosizeColumns();
	    }
	    updateCanvasWidth(false);
	  }
	
	  function getVisibleRange(viewportTop, viewportLeft) {
	    if (viewportTop == null) {
	      viewportTop = scrollTop;
	    }
	    if (viewportLeft == null) {
	      viewportLeft = scrollLeft;
	    }
	
	    return {
	      top: getRowFromPosition(viewportTop),
	      bottom: getRowFromPosition(viewportTop + viewportH) + 1,
	      leftPx: viewportLeft,
	      rightPx: viewportLeft + viewportW
	    };
	  }
	
	  function getRenderedRange(viewportTop, viewportLeft) {
	    var range = getVisibleRange(viewportTop, viewportLeft);
	    var buffer = Math.round(viewportH / options.rowHeight);
	    var minBuffer = 3;
	
	    if (vScrollDir == -1) {
	      range.top -= buffer;
	      range.bottom += minBuffer;
	    } else if (vScrollDir == 1) {
	      range.top -= minBuffer;
	      range.bottom += buffer;
	    } else {
	      range.top -= minBuffer;
	      range.bottom += minBuffer;
	    }
	
	    range.top = Math.max(0, range.top);
	    range.bottom = Math.min(getDataLengthIncludingAddNew() - 1, range.bottom);
	
	    range.leftPx -= viewportW;
	    range.rightPx += viewportW;
	
	    range.leftPx = Math.max(0, range.leftPx);
	    range.rightPx = Math.min(canvasWidth, range.rightPx);
	
	    return range;
	  }
	
	  function ensureCellNodesInRowsCache(row) {
	    var cacheEntry = rowsCache[row];
	    if (cacheEntry) {
	      if (cacheEntry.cellRenderQueue.length) {
	        var $lastNode = cacheEntry.rowNode.children().last();
	        while (cacheEntry.cellRenderQueue.length) {
	          var columnIdx = cacheEntry.cellRenderQueue.pop();
	
	          cacheEntry.cellNodesByColumnIdx[columnIdx] = $lastNode;
	          $lastNode = $lastNode.prev();
	
	          // Hack to retrieve the frozen columns because
	          if ($lastNode.length == 0) {
	            $lastNode = (0, _jquery2.default)(cacheEntry.rowNode[0]).children().last();
	          }
	        }
	      }
	    }
	  }
	
	  function cleanUpCells(range, row) {
	    // Ignore frozen rows
	    if (hasFrozenRows && (options.frozenBottom && row > actualFrozenRow || // Frozen bottom rows
	    row <= actualFrozenRow // Frozen top rows
	    )) {
	      return;
	    }
	
	    var totalCellsRemoved = 0;
	    var cacheEntry = rowsCache[row];
	
	    // Remove cells outside the range.
	    var cellsToRemove = [];
	    for (var i in cacheEntry.cellNodesByColumnIdx) {
	      // I really hate it when people mess with Array.prototype.
	      if (!cacheEntry.cellNodesByColumnIdx.hasOwnProperty(i)) {
	        continue;
	      }
	
	      // This is a string, so it needs to be cast back to a number.
	      i = i | 0;
	
	      // Ignore frozen columns
	      if (i <= options.frozenColumn) {
	        continue;
	      }
	
	      var colspan = cacheEntry.cellColSpans[i];
	      if (columnPosLeft[i] > range.rightPx || columnPosRight[Math.min(columns.length - 1, i + colspan - 1)] < range.leftPx) {
	        if (!(row == activeRow && i == activeCell)) {
	          cellsToRemove.push(i);
	        }
	      }
	    }
	
	    var cellToRemove;
	    while ((cellToRemove = cellsToRemove.pop()) != null) {
	      cacheEntry.cellNodesByColumnIdx[cellToRemove][0].parentElement.removeChild(cacheEntry.cellNodesByColumnIdx[cellToRemove][0]);
	      delete cacheEntry.cellColSpans[cellToRemove];
	      delete cacheEntry.cellNodesByColumnIdx[cellToRemove];
	      if (postProcessedRows[row]) {
	        delete postProcessedRows[row][cellToRemove];
	      }
	      totalCellsRemoved++;
	    }
	  }
	
	  function cleanUpAndRenderCells(range) {
	    var cacheEntry;
	    var stringArray = [];
	    var processedRows = [];
	    var cellsAdded;
	    var totalCellsAdded = 0;
	    var colspan;
	
	    for (var row = range.top, btm = range.bottom; row <= btm; row++) {
	      cacheEntry = rowsCache[row];
	      if (!cacheEntry) {
	        continue;
	      }
	
	      // cellRenderQueue populated in renderRows() needs to be cleared first
	      ensureCellNodesInRowsCache(row);
	
	      cleanUpCells(range, row);
	
	      // Render missing cells.
	      cellsAdded = 0;
	
	      var metadata = data.getItemMetadata && data.getItemMetadata(row);
	      metadata = metadata && metadata.columns;
	
	      var d = getDataItem(row);
	
	      // TODO:  shorten this loop (index? heuristics? binary search?)
	      for (var i = 0, ii = columns.length; i < ii; i++) {
	        // Cells to the right are outside the range.
	        if (columnPosLeft[i] > range.rightPx) {
	          break;
	        }
	
	        // Already rendered.
	        if ((colspan = cacheEntry.cellColSpans[i]) != null) {
	          i += colspan > 1 ? colspan - 1 : 0;
	          continue;
	        }
	
	        colspan = 1;
	        if (metadata) {
	          var columnData = metadata[columns[i].id] || metadata[i];
	          colspan = columnData && columnData.colspan || 1;
	          if (colspan === "*") {
	            colspan = ii - i;
	          }
	        }
	
	        if (columnPosRight[Math.min(ii - 1, i + colspan - 1)] > range.leftPx) {
	          appendCellHtml(stringArray, row, i, colspan, d);
	          cellsAdded++;
	        }
	
	        i += colspan > 1 ? colspan - 1 : 0;
	      }
	
	      if (cellsAdded) {
	        totalCellsAdded += cellsAdded;
	        processedRows.push(row);
	      }
	    }
	
	    if (!stringArray.length) {
	      return;
	    }
	
	    var x = document.createElement("div");
	    x.innerHTML = stringArray.join("");
	
	    var processedRow;
	    var $node;
	    while ((processedRow = processedRows.pop()) != null) {
	      cacheEntry = rowsCache[processedRow];
	      var columnIdx;
	      while ((columnIdx = cacheEntry.cellRenderQueue.pop()) != null) {
	        $node = (0, _jquery2.default)(x).children().last();
	
	        if (hasFrozenColumns() && columnIdx > options.frozenColumn) {
	          (0, _jquery2.default)(cacheEntry.rowNode[1]).append($node);
	        } else {
	          (0, _jquery2.default)(cacheEntry.rowNode[0]).append($node);
	        }
	
	        cacheEntry.cellNodesByColumnIdx[columnIdx] = $node;
	      }
	    }
	  }
	
	  function renderRows(range) {
	    var stringArrayL = [],
	        stringArrayR = [],
	        rows = [],
	        needToReselectCell = false,
	        dataLength = getDataLength();
	
	    for (var i = range.top, ii = range.bottom; i <= ii; i++) {
	      if (rowsCache[i] || hasFrozenRows && options.frozenBottom && i == getDataLength()) {
	        continue;
	      }
	      renderedRows++;
	      rows.push(i);
	
	      // Create an entry right away so that appendRowHtml() can
	      // start populatating it.
	      rowsCache[i] = {
	        "rowNode": null,
	
	        // ColSpans of rendered cells (by column idx).
	        // Can also be used for checking whether a cell has been rendered.
	        "cellColSpans": [],
	
	        // Cell nodes (by column idx).  Lazy-populated by ensureCellNodesInRowsCache().
	        "cellNodesByColumnIdx": [],
	
	        // Column indices of cell nodes that have been rendered, but not yet indexed in
	        // cellNodesByColumnIdx.  These are in the same order as cell nodes added at the
	        // end of the row.
	        "cellRenderQueue": []
	      };
	
	      appendRowHtml(stringArrayL, stringArrayR, i, range, dataLength);
	      if (activeCellNode && activeRow === i) {
	        needToReselectCell = true;
	      }
	      counter_rows_rendered++;
	    }
	
	    if (!rows.length) {
	      return;
	    }
	
	    var x = document.createElement("div"),
	        xRight = document.createElement("div");
	
	    x.innerHTML = stringArrayL.join("");
	    xRight.innerHTML = stringArrayR.join("");
	
	    for (var i = 0, ii = rows.length; i < ii; i++) {
	      if (hasFrozenRows && rows[i] >= actualFrozenRow) {
	        if (hasFrozenColumns()) {
	          rowsCache[rows[i]].rowNode = (0, _jquery2.default)().add((0, _jquery2.default)(x.firstChild).appendTo($canvasBottomL)).add((0, _jquery2.default)(xRight.firstChild).appendTo($canvasBottomR));
	        } else {
	          rowsCache[rows[i]].rowNode = (0, _jquery2.default)().add((0, _jquery2.default)(x.firstChild).appendTo($canvasBottomL));
	        }
	      } else if (hasFrozenColumns()) {
	        rowsCache[rows[i]].rowNode = (0, _jquery2.default)().add((0, _jquery2.default)(x.firstChild).appendTo($canvasTopL)).add((0, _jquery2.default)(xRight.firstChild).appendTo($canvasTopR));
	      } else {
	        rowsCache[rows[i]].rowNode = (0, _jquery2.default)().add((0, _jquery2.default)(x.firstChild).appendTo($canvasTopL));
	      }
	    }
	
	    if (needToReselectCell) {
	      activeCellNode = getCellNode(activeRow, activeCell);
	    }
	  }
	
	  function startPostProcessing() {
	    if (!options.enableAsyncPostRender) {
	      return;
	    }
	    clearTimeout(h_postrender);
	    h_postrender = setTimeout(asyncPostProcessRows, options.asyncPostRenderDelay);
	  }
	
	  function invalidatePostProcessingResults(row) {
	    delete postProcessedRows[row];
	    postProcessFromRow = Math.min(postProcessFromRow, row);
	    postProcessToRow = Math.max(postProcessToRow, row);
	    startPostProcessing();
	  }
	
	  function updateRowPositions() {
	    for (var row in rowsCache) {
	      rowsCache[row].rowNode.css('top', getRowTop(row) + "px");
	    }
	  }
	
	  function render() {
	    if (!initialized) {
	      return;
	    }
	    var visible = getVisibleRange();
	    var rendered = getRenderedRange();
	
	    // remove rows no longer in the viewport
	    cleanupRows(rendered);
	
	    // add new rows & missing cells in existing rows
	    if (lastRenderedScrollLeft != scrollLeft) {
	
	      if (hasFrozenRows) {
	
	        var renderedFrozenRows = _jquery2.default.extend(true, {}, rendered);
	
	        if (options.frozenBottom) {
	
	          renderedFrozenRows.top = actualFrozenRow;
	          renderedFrozenRows.bottom = getDataLength();
	        } else {
	
	          renderedFrozenRows.top = 0;
	          renderedFrozenRows.bottom = options.frozenRow;
	        }
	
	        cleanUpAndRenderCells(renderedFrozenRows);
	      }
	
	      cleanUpAndRenderCells(rendered);
	    }
	
	    // render missing rows
	    renderRows(rendered);
	
	    // Render frozen rows
	    if (hasFrozenRows) {
	      if (options.frozenBottom) {
	        renderRows({
	          top: actualFrozenRow,
	          bottom: getDataLength() - 1,
	          leftPx: rendered.leftPx,
	          rightPx: rendered.rightPx
	        });
	      } else {
	        renderRows({
	          top: 0,
	          bottom: options.frozenRow - 1,
	          leftPx: rendered.leftPx,
	          rightPx: rendered.rightPx
	        });
	      }
	    }
	
	    postProcessFromRow = visible.top;
	    postProcessToRow = Math.min(getDataLengthIncludingAddNew() - 1, visible.bottom);
	    startPostProcessing();
	
	    lastRenderedScrollTop = scrollTop;
	    lastRenderedScrollLeft = scrollLeft;
	    h_render = null;
	  }
	
	  function handleHeaderRowScroll() {
	    var scrollLeft = $headerRowScrollContainer[0].scrollLeft;
	    if (scrollLeft != $viewportScrollContainerX[0].scrollLeft) {
	      $viewportScrollContainerX[0].scrollLeft = scrollLeft;
	    }
	  }
	
	  function handleFooterRowScroll() {
	    var scrollLeft = $footerRowScrollContainer[0].scrollLeft;
	    if (scrollLeft != $viewportScrollContainerX[0].scrollLeft) {
	      $viewportScrollContainerX[0].scrollLeft = scrollLeft;
	    }
	  }
	
	  function handleMouseWheel(e, delta, deltaX, deltaY) {
	    var $rowNode = (0, _jquery2.default)(e.target).closest(".slick-row");
	    var rowNode = $rowNode[0];
	
	    if (rowNode != rowNodeFromLastMouseWheelEvent) {
	
	      var $gridCanvas = $rowNode.parents('.grid-canvas');
	      var left = $gridCanvas.hasClass('grid-canvas-left');
	
	      if (zombieRowNodeFromLastMouseWheelEvent && zombieRowNodeFromLastMouseWheelEvent[left ? 0 : 1] != rowNode) {
	        var zombieRow = zombieRowNodeFromLastMouseWheelEvent[left || zombieRowNodeFromLastMouseWheelEvent.length == 1 ? 0 : 1];
	        zombieRow.parentElement.removeChild(zombieRow);
	
	        zombieRowNodeFromLastMouseWheelEvent = null;
	      }
	
	      rowNodeFromLastMouseWheelEvent = rowNode;
	    }
	
	    scrollTop = Math.max(0, $viewportScrollContainerY[0].scrollTop - deltaY * options.rowHeight);
	    scrollLeft = $viewportScrollContainerX[0].scrollLeft + deltaX * 10;
	    var handled = _handleScroll(true);
	    if (handled) e.preventDefault();
	  }
	
	  function handleScroll() {
	    scrollTop = $viewportScrollContainerY[0].scrollTop;
	    scrollLeft = $viewportScrollContainerX[0].scrollLeft;
	    return _handleScroll(false);
	  }
	
	  function _handleScroll(isMouseWheel) {
	    var maxScrollDistanceY = $viewportScrollContainerY[0].scrollHeight - $viewportScrollContainerY[0].clientHeight;
	    var maxScrollDistanceX = $viewportScrollContainerY[0].scrollWidth - $viewportScrollContainerY[0].clientWidth;
	    var hasFrozenCols = hasFrozenColumns();
	
	    // Ceiling the max scroll values
	    if (scrollTop > maxScrollDistanceY) {
	      scrollTop = maxScrollDistanceY;
	    }
	    if (scrollLeft > maxScrollDistanceX) {
	      scrollLeft = maxScrollDistanceX;
	    }
	
	    var vScrollDist = Math.abs(scrollTop - prevScrollTop);
	    var hScrollDist = Math.abs(scrollLeft - prevScrollLeft);
	
	    if (hScrollDist) {
	      prevScrollLeft = scrollLeft;
	
	      $viewportScrollContainerX[0].scrollLeft = scrollLeft;
	      $headerScrollContainer[0].scrollLeft = scrollLeft;
	      $topPanelScroller[0].scrollLeft = scrollLeft;
	      $headerRowScrollContainer[0].scrollLeft = scrollLeft;
	      $footerRowScrollContainer[0].scrollLeft = scrollLeft;
	
	      if (hasFrozenCols) {
	        if (hasFrozenRows) {
	          $viewportTopR[0].scrollLeft = scrollLeft;
	        }
	      } else {
	        if (hasFrozenRows) {
	          $viewportTopL[0].scrollLeft = scrollLeft;
	        }
	      }
	    }
	
	    if (vScrollDist) {
	      vScrollDir = prevScrollTop < scrollTop ? 1 : -1;
	      prevScrollTop = scrollTop;
	
	      if (isMouseWheel) {
	        $viewportScrollContainerY[0].scrollTop = scrollTop;
	      }
	
	      if (hasFrozenCols) {
	        if (hasFrozenRows && !options.frozenBottom) {
	          $viewportBottomL[0].scrollTop = scrollTop;
	        } else {
	          $viewportTopL[0].scrollTop = scrollTop;
	        }
	      }
	
	      // switch virtual pages if needed
	      if (vScrollDist < viewportH) {
	        scrollTo(scrollTop + offset);
	      } else {
	        var oldOffset = offset;
	        if (h == viewportH) {
	          page = 0;
	        } else {
	          page = Math.min(n - 1, Math.floor(scrollTop * ((th - viewportH) / (h - viewportH)) * (1 / ph)));
	        }
	        offset = Math.round(page * cj);
	        if (oldOffset != offset) {
	          invalidateAllRows();
	        }
	      }
	    }
	
	    if (hScrollDist || vScrollDist) {
	      if (h_render) {
	        clearTimeout(h_render);
	      }
	
	      if (Math.abs(lastRenderedScrollTop - scrollTop) > 20 || Math.abs(lastRenderedScrollLeft - scrollLeft) > 20) {
	        if (options.forceSyncScrolling || Math.abs(lastRenderedScrollTop - scrollTop) < viewportH && Math.abs(lastRenderedScrollLeft - scrollLeft) < viewportW) {
	          render();
	        } else {
	          h_render = setTimeout(render, 50);
	        }
	
	        trigger(self.onViewportChanged, {});
	      }
	    }
	
	    trigger(self.onScroll, {
	      scrollLeft: scrollLeft,
	      scrollTop: scrollTop
	    });
	
	    if (hScrollDist || vScrollDist) return true;
	    return false;
	  }
	
	  function asyncPostProcessRows() {
	    var dataLength = getDataLength();
	    while (postProcessFromRow <= postProcessToRow) {
	      var row = vScrollDir >= 0 ? postProcessFromRow++ : postProcessToRow--;
	      var cacheEntry = rowsCache[row];
	      if (!cacheEntry || row >= dataLength) {
	        continue;
	      }
	
	      if (!postProcessedRows[row]) {
	        postProcessedRows[row] = {};
	      }
	
	      ensureCellNodesInRowsCache(row);
	      for (var columnIdx in cacheEntry.cellNodesByColumnIdx) {
	        if (!cacheEntry.cellNodesByColumnIdx.hasOwnProperty(columnIdx)) {
	          continue;
	        }
	
	        columnIdx = columnIdx | 0;
	
	        var m = columns[columnIdx];
	        if (m.asyncPostRender && !postProcessedRows[row][columnIdx]) {
	          var node = cacheEntry.cellNodesByColumnIdx[columnIdx];
	          if (node) {
	            m.asyncPostRender(node, row, getDataItem(row), m);
	          }
	          postProcessedRows[row][columnIdx] = true;
	        }
	      }
	
	      h_postrender = setTimeout(asyncPostProcessRows, options.asyncPostRenderDelay);
	      return;
	    }
	  }
	
	  function updateCellCssStylesOnRenderedRows(addedHash, removedHash) {
	    var node, columnId, addedRowHash, removedRowHash;
	    for (var row in rowsCache) {
	      removedRowHash = removedHash && removedHash[row];
	      addedRowHash = addedHash && addedHash[row];
	
	      if (removedRowHash) {
	        for (columnId in removedRowHash) {
	          if (!addedRowHash || removedRowHash[columnId] != addedRowHash[columnId]) {
	            node = getCellNode(row, getColumnIndex(columnId));
	            if (node) {
	              (0, _jquery2.default)(node).removeClass(removedRowHash[columnId]);
	            }
	          }
	        }
	      }
	
	      if (addedRowHash) {
	        for (columnId in addedRowHash) {
	          if (!removedRowHash || removedRowHash[columnId] != addedRowHash[columnId]) {
	            node = getCellNode(row, getColumnIndex(columnId));
	            if (node) {
	              (0, _jquery2.default)(node).addClass(addedRowHash[columnId]);
	            }
	          }
	        }
	      }
	    }
	  }
	
	  function addCellCssStyles(key, hash) {
	    if (cellCssClasses[key]) {
	      throw "addCellCssStyles: cell CSS hash with key '" + key + "' already exists.";
	    }
	
	    cellCssClasses[key] = hash;
	    updateCellCssStylesOnRenderedRows(hash, null);
	
	    trigger(self.onCellCssStylesChanged, {
	      "key": key,
	      "hash": hash
	    });
	  }
	
	  function removeCellCssStyles(key) {
	    if (!cellCssClasses[key]) {
	      return;
	    }
	
	    updateCellCssStylesOnRenderedRows(null, cellCssClasses[key]);
	    delete cellCssClasses[key];
	
	    trigger(self.onCellCssStylesChanged, {
	      "key": key,
	      "hash": null
	    });
	  }
	
	  function setCellCssStyles(key, hash) {
	    var prevHash = cellCssClasses[key];
	
	    cellCssClasses[key] = hash;
	    updateCellCssStylesOnRenderedRows(hash, prevHash);
	
	    trigger(self.onCellCssStylesChanged, {
	      "key": key,
	      "hash": hash
	    });
	  }
	
	  function getCellCssStyles(key) {
	    return cellCssClasses[key];
	  }
	
	  function flashCell(row, cell, speed) {
	    speed = speed || 100;
	    if (rowsCache[row]) {
	      var toggleCellClass = function toggleCellClass(times) {
	        if (!times) {
	          return;
	        }
	        setTimeout(function () {
	          $cell.queue(function () {
	            $cell.toggleClass(options.cellFlashingCssClass).dequeue();
	            toggleCellClass(times - 1);
	          });
	        }, speed);
	      };
	
	      var $cell = (0, _jquery2.default)(getCellNode(row, cell));
	
	      toggleCellClass(4);
	    }
	  }
	
	  //////////////////////////////////////////////////////////////////////////////////////////////
	  // Interactivity
	
	  function handleDragInit(e, dd) {
	    var cell = getCellFromEvent(e);
	    if (!cell || !cellExists(cell.row, cell.cell)) {
	      return false;
	    }
	
	    var retval = trigger(self.onDragInit, dd, e);
	    if (e.isImmediatePropagationStopped()) {
	      return retval;
	    }
	
	    // if nobody claims to be handling drag'n'drop by stopping immediate propagation,
	    // cancel out of it
	    return false;
	  }
	
	  function handleDragStart(interactEvent) {
	    var event = _jquery2.default.Event(interactEvent.originalEvent.type, interactEvent.originalEvent);
	    var cell = getCellFromEvent(event);
	    if (!cell || !cellExists(cell.row, cell.cell)) {
	      return false;
	    }
	
	    var retval = trigger(self.onDragStart, interactEvent, event);
	    if (event.isImmediatePropagationStopped()) {
	      return retval;
	    }
	
	    return false;
	  }
	
	  function handleDrag(interactEvent) {
	    var event = _jquery2.default.Event(interactEvent.originalEvent.type, interactEvent.originalEvent);
	    return trigger(self.onDrag, interactEvent, event);
	  }
	
	  function handleDragEnd(interactEvent) {
	    trigger(self.onDragEnd, interactEvent, _jquery2.default.Event('mousedown'));
	  }
	
	  function handleKeyDown(e) {
	    trigger(self.onKeyDown, {
	      row: activeRow,
	      cell: activeCell
	    }, e);
	    var handled = e.isImmediatePropagationStopped();
	
	    if (!handled) {
	      if (!e.shiftKey && !e.altKey && !e.ctrlKey) {
	        if (e.which == 27) {
	          if (!getEditorLock().isActive()) {
	            return; // no editing mode to cancel, allow bubbling and default processing (exit without cancelling the event)
	          }
	          cancelEditAndSetFocus();
	        } else if (e.which == 34) {
	          navigatePageDown();
	          handled = true;
	        } else if (e.which == 33) {
	          navigatePageUp();
	          handled = true;
	        } else if (e.which == 37) {
	          handled = navigateLeft();
	        } else if (e.which == 39) {
	          handled = navigateRight();
	        } else if (e.which == 38) {
	          handled = navigateUp();
	        } else if (e.which == 40) {
	          handled = navigateDown();
	        } else if (e.which == 9) {
	          handled = navigateNext();
	        } else if (e.which == 13) {
	          if (options.editable) {
	            if (currentEditor) {
	              // adding new row
	              if (activeRow === getDataLength()) {
	                navigateDown();
	              } else {
	                commitEditAndSetFocus();
	              }
	            } else {
	              if (getEditorLock().commitCurrentEdit()) {
	                makeActiveCellEditable();
	              }
	            }
	          }
	          handled = true;
	        }
	      } else if (e.which == 9 && e.shiftKey && !e.ctrlKey && !e.altKey) {
	        handled = navigatePrev();
	      }
	    }
	
	    if (handled) {
	      // the event has been handled so don't let parent element (bubbling/propagation) or browser (default) handle it
	      e.stopPropagation();
	      e.preventDefault();
	      try {
	        e.originalEvent.keyCode = 0; // prevent default behaviour for special keys in IE browsers (F3, F5, etc.)
	      }
	      // ignore exceptions - setting the original event's keycode throws access denied exception for "Ctrl"
	      // (hitting control key only, nothing else), "Shift" (maybe others)
	      catch (error) {}
	    }
	  }
	
	  function handleClick(e) {
	    if (!currentEditor) {
	      // if this click resulted in some cell child node getting focus,
	      // don't steal it back - keyboard events will still bubble up
	      // IE9+ seems to default DIVs to tabIndex=0 instead of -1, so check for cell clicks directly.
	      if (e.target != document.activeElement || (0, _jquery2.default)(e.target).hasClass("slick-cell")) {
	        setFocus();
	      }
	    }
	
	    var cell = getCellFromEvent(e);
	    if (!cell || currentEditor !== null && activeRow == cell.row && activeCell == cell.cell) {
	      return;
	    }
	
	    trigger(self.onClick, {
	      row: cell.row,
	      cell: cell.cell
	    }, e);
	    if (e.isImmediatePropagationStopped()) {
	      return;
	    }
	
	    if ((activeCell != cell.cell || activeRow != cell.row) && canCellBeActive(cell.row, cell.cell)) {
	      if (!getEditorLock().isActive() || getEditorLock().commitCurrentEdit()) {
	
	        scrollRowIntoView(cell.row, false);
	        setActiveCellInternal(getCellNode(cell.row, cell.cell));
	      }
	    }
	  }
	
	  function handleContextMenu(e) {
	    var $cell = (0, _jquery2.default)(e.target).closest(".slick-cell", $canvas);
	    if ($cell.length === 0) {
	      return;
	    }
	
	    // are we editing this cell?
	    if (activeCellNode === $cell[0] && currentEditor !== null) {
	      return;
	    }
	
	    trigger(self.onContextMenu, {}, e);
	  }
	
	  function handleDblClick(e) {
	    var cell = getCellFromEvent(e);
	    if (!cell || currentEditor !== null && activeRow == cell.row && activeCell == cell.cell) {
	      return;
	    }
	
	    trigger(self.onDblClick, {
	      row: cell.row,
	      cell: cell.cell
	    }, e);
	    if (e.isImmediatePropagationStopped()) {
	      return;
	    }
	
	    if (options.editable) {
	      gotoCell(cell.row, cell.cell, true);
	    }
	  }
	
	  function handleHeaderMouseEnter(e) {
	    trigger(self.onHeaderMouseEnter, {
	      "column": (0, _jquery2.default)(this).data("column")
	    }, e);
	  }
	
	  function handleHeaderMouseLeave(e) {
	    trigger(self.onHeaderMouseLeave, {
	      "column": (0, _jquery2.default)(this).data("column")
	    }, e);
	  }
	
	  function handleHeaderContextMenu(e) {
	    var $header = (0, _jquery2.default)(e.target).closest(".slick-header-column", ".slick-header-columns");
	    var column = $header && $header.data("column");
	    trigger(self.onHeaderContextMenu, {
	      column: column
	    }, e);
	  }
	
	  function handleHeaderClick(e) {
	    var $header = (0, _jquery2.default)(e.target).closest(".slick-header-column", ".slick-header-columns");
	    var column = $header && $header.data("column");
	    if (column) {
	      trigger(self.onHeaderClick, {
	        column: column
	      }, e);
	    }
	  }
	
	  function handleMouseEnter(e) {
	    trigger(self.onMouseEnter, {}, e);
	  }
	
	  function handleMouseLeave(e) {
	    trigger(self.onMouseLeave, {}, e);
	  }
	
	  function cellExists(row, cell) {
	    return !(row < 0 || row >= getDataLength() || cell < 0 || cell >= columns.length);
	  }
	
	  function getCellFromPoint(x, y) {
	    var row = getRowFromPosition(y);
	    var cell = 0;
	
	    var w = 0;
	    for (var i = 0; i < columns.length && w < x; i++) {
	      w += columns[i].width;
	      cell++;
	    }
	
	    if (cell < 0) {
	      cell = 0;
	    }
	
	    return {
	      row: row,
	      cell: cell - 1
	    };
	  }
	
	  function getCellFromNode(cellNode) {
	    // read column number from .l<columnNumber> CSS class
	    var cls = /l\d+/.exec(cellNode.className);
	    if (!cls) {
	      throw "getCellFromNode: cannot get cell - " + cellNode.className;
	    }
	    return parseInt(cls[0].substr(1, cls[0].length - 1), 10);
	  }
	
	  function getRowFromNode(rowNode) {
	    for (var row in rowsCache) {
	      for (var i in rowsCache[row].rowNode) {
	        if (rowsCache[row].rowNode[i] === rowNode) return row | 0;
	      }
	    }return null;
	  }
	
	  function getFrozenRowOffset(row) {
	    var offset = hasFrozenRows ? options.frozenBottom ? row >= actualFrozenRow ? h < viewportTopH ? actualFrozenRow * options.rowHeight : h : 0 : row >= actualFrozenRow ? frozenRowsHeight : 0 : 0;
	
	    return offset;
	  }
	
	  function getCellFromEvent(e) {
	    var row, cell;
	    var $cell = (0, _jquery2.default)(e.target).closest(".slick-cell", $canvas);
	    if (!$cell.length) {
	      return null;
	    }
	
	    row = getRowFromNode($cell[0].parentNode);
	
	    if (hasFrozenRows) {
	
	      var c = $cell.parents('.grid-canvas').offset();
	
	      var rowOffset = 0;
	      var isBottom = $cell.parents('.grid-canvas-bottom').length;
	
	      if (isBottom) {
	        rowOffset = options.frozenBottom ? $canvasTopL.height() : frozenRowsHeight;
	      }
	
	      row = getCellFromPoint(e.clientX - c.left, e.clientY - c.top + rowOffset + (0, _jquery2.default)(document).scrollTop()).row;
	    }
	
	    cell = getCellFromNode($cell[0]);
	
	    if (row == null || cell == null) {
	      return null;
	    } else {
	      return {
	        "row": row,
	        "cell": cell
	      };
	    }
	  }
	
	  function getCellNodeBox(row, cell) {
	    if (!cellExists(row, cell)) {
	      return null;
	    }
	
	    var frozenRowOffset = getFrozenRowOffset(row);
	
	    var y1 = getRowTop(row) - frozenRowOffset;
	    var y2 = y1 + options.rowHeight - 1;
	    var x1 = 0;
	    for (var i = 0; i < cell; i++) {
	      x1 += columns[i].width;
	
	      if (options.frozenColumn == i) {
	        x1 = 0;
	      }
	    }
	    var x2 = x1 + columns[cell].width;
	
	    return {
	      top: y1,
	      left: x1,
	      bottom: y2,
	      right: x2
	    };
	  }
	
	  //////////////////////////////////////////////////////////////////////////////////////////////
	  // Cell switching
	
	  function resetActiveCell() {
	    setActiveCellInternal(null, false);
	  }
	
	  function setFocus() {
	    if (tabbingDirection == -1) {
	      $focusSink[0].focus();
	    } else {
	      $focusSink2[0].focus();
	    }
	  }
	
	  function scrollCellIntoView(row, cell, doPaging) {
	    // Don't scroll to frozen cells
	    if (cell <= options.frozenColumn) {
	      return;
	    }
	
	    if (row < actualFrozenRow) {
	      scrollRowIntoView(row, doPaging);
	    }
	
	    var colspan = getColspan(row, cell);
	    var left = columnPosLeft[cell],
	        right = columnPosRight[cell + (colspan > 1 ? colspan - 1 : 0)],
	        scrollRight = scrollLeft + $viewportScrollContainerX.width();
	
	    if (left < scrollLeft) {
	      $viewportScrollContainerX.scrollLeft(left);
	      handleScroll();
	      render();
	    } else if (right > scrollRight) {
	      $viewportScrollContainerX.scrollLeft(Math.min(left, right - $viewportScrollContainerX[0].clientWidth));
	      handleScroll();
	      render();
	    }
	  }
	
	  function setActiveCellInternal(newCell, opt_editMode) {
	    if (activeCellNode !== null) {
	      makeActiveCellNormal();
	      (0, _jquery2.default)(activeCellNode).removeClass("active");
	      if (rowsCache[activeRow]) {
	        (0, _jquery2.default)(rowsCache[activeRow].rowNode).removeClass("active");
	      }
	    }
	
	    var activeCellChanged = activeCellNode !== newCell;
	    activeCellNode = newCell;
	
	    if (activeCellNode != null) {
	      var $activeCellNode = (0, _jquery2.default)(activeCellNode);
	      var $activeCellOffset = $activeCellNode.offset();
	
	      var rowOffset = Math.floor($activeCellNode.parents('.grid-canvas').offset().top);
	      var isBottom = $activeCellNode.parents('.grid-canvas-bottom').length;
	
	      if (hasFrozenRows && isBottom) {
	        rowOffset -= options.frozenBottom ? $canvasTopL.height() : frozenRowsHeight;
	      }
	
	      var cell = getCellFromPoint($activeCellOffset.left, Math.ceil($activeCellOffset.top) - rowOffset);
	
	      activeRow = cell.row;
	      activeCell = activePosX = activeCell = activePosX = getCellFromNode(activeCellNode[0]);
	
	      $activeCellNode.addClass("active");
	      if (rowsCache[activeRow]) {
	        (0, _jquery2.default)(rowsCache[activeRow].rowNode).addClass('active');
	      }
	
	      if (opt_editMode == null) {
	        opt_editMode = activeRow == getDataLength() || options.autoEdit;
	      }
	
	      if (options.editable && opt_editMode && isCellPotentiallyEditable(activeRow, activeCell)) {
	        clearTimeout(h_editorLoader);
	
	        if (options.asyncEditorLoading) {
	          h_editorLoader = setTimeout(function () {
	            makeActiveCellEditable();
	          }, options.asyncEditorLoadDelay);
	        } else {
	          makeActiveCellEditable();
	        }
	      }
	    } else {
	      activeRow = activeCell = null;
	    }
	
	    if (activeCellChanged) {
	      setTimeout(scrollActiveCellIntoView, 50);
	      trigger(self.onActiveCellChanged, getActiveCell());
	    }
	  }
	
	  function clearTextSelection() {
	    if (document.selection && document.selection.empty) {
	      try {
	        //IE fails here if selected element is not in dom
	        document.selection.empty();
	      } catch (e) {}
	    } else if (window.getSelection) {
	      var sel = window.getSelection();
	      if (sel && sel.removeAllRanges) {
	        sel.removeAllRanges();
	      }
	    }
	  }
	
	  function isCellPotentiallyEditable(row, cell) {
	    var dataLength = getDataLength();
	    // is the data for this row loaded?
	    if (row < dataLength && !getDataItem(row)) {
	      return false;
	    }
	
	    // are we in the Add New row?  can we create new from this cell?
	    if (columns[cell].cannotTriggerInsert && row >= dataLength) {
	      return false;
	    }
	
	    // does this cell have an editor?
	    if (!getEditor(row, cell)) {
	      return false;
	    }
	
	    return true;
	  }
	
	  function makeActiveCellNormal() {
	    if (!currentEditor) {
	      return;
	    }
	    trigger(self.onBeforeCellEditorDestroy, {
	      editor: currentEditor
	    });
	    currentEditor.destroy();
	    currentEditor = null;
	
	    if (activeCellNode) {
	      var d = getDataItem(activeRow);
	      (0, _jquery2.default)(activeCellNode).removeClass("editable invalid");
	      if (d) {
	        var column = columns[activeCell];
	        activeCellNode[0].innerHTML = callFormatter(activeRow, activeCell, getDataItemValueForColumn(d, column), column, d);
	        invalidatePostProcessingResults(activeRow);
	      }
	    }
	
	    // if there previously was text selected on a page (such as selected text in the edit cell just removed),
	    // IE can't set focus to anything else correctly
	    if (navigator.userAgent.toLowerCase().match(/msie/)) {
	      clearTextSelection();
	    }
	
	    getEditorLock().deactivate(editController);
	  }
	
	  function makeActiveCellEditable(editor) {
	    if (!activeCellNode) {
	      return;
	    }
	    if (!options.editable) {
	      throw "Grid : makeActiveCellEditable : should never get called when options.editable is false";
	    }
	
	    // cancel pending async call if there is one
	    clearTimeout(h_editorLoader);
	
	    if (!isCellPotentiallyEditable(activeRow, activeCell)) {
	      return;
	    }
	
	    var columnDef = columns[activeCell];
	    var item = getDataItem(activeRow);
	
	    if (trigger(self.onBeforeEditCell, {
	      row: activeRow,
	      cell: activeCell,
	      item: item,
	      column: columnDef
	    }) === false) {
	      setFocus();
	      return;
	    }
	
	    getEditorLock().activate(editController);
	    (0, _jquery2.default)(activeCellNode).addClass("editable");
	
	    // don't clear the cell if a custom editor is passed through
	    if (!editor) {
	      activeCellNode[0].innerHTML = "";
	    }
	
	    currentEditor = new (editor || getEditor(activeRow, activeCell))({
	      grid: self,
	      gridPosition: absBox($container[0]),
	      position: absBox(activeCellNode[0]),
	      container: activeCellNode,
	      column: columnDef,
	      item: item || {},
	      commitChanges: commitEditAndSetFocus,
	      cancelChanges: cancelEditAndSetFocus
	    });
	
	    if (item) {
	      currentEditor.loadValue(item);
	    }
	
	    serializedEditorValue = currentEditor.serializeValue();
	
	    if (currentEditor.position) {
	      handleActiveCellPositionChange();
	    }
	  }
	
	  function commitEditAndSetFocus() {
	    // if the commit fails, it would do so due to a validation error
	    // if so, do not steal the focus from the editor
	    if (getEditorLock().commitCurrentEdit()) {
	      setFocus();
	      if (options.autoEdit) {
	        navigateDown();
	      }
	    }
	  }
	
	  function cancelEditAndSetFocus() {
	    if (getEditorLock().cancelCurrentEdit()) {
	      setFocus();
	    }
	  }
	
	  function absBox(elem) {
	    var box = {
	      top: elem.offsetTop,
	      left: elem.offsetLeft,
	      bottom: 0,
	      right: 0,
	      width: (0, _jquery2.default)(elem).outerWidth(),
	      height: (0, _jquery2.default)(elem).outerHeight(),
	      visible: true
	    };
	    box.bottom = box.top + box.height;
	    box.right = box.left + box.width;
	
	    // walk up the tree
	    var offsetParent = elem.offsetParent;
	    while ((elem = elem.parentNode) != document.body) {
	      if (box.visible && elem.scrollHeight != elem.offsetHeight && (0, _jquery2.default)(elem).css("overflowY") != "visible") {
	        box.visible = box.bottom > elem.scrollTop && box.top < elem.scrollTop + elem.clientHeight;
	      }
	
	      if (box.visible && elem.scrollWidth != elem.offsetWidth && (0, _jquery2.default)(elem).css("overflowX") != "visible") {
	        box.visible = box.right > elem.scrollLeft && box.left < elem.scrollLeft + elem.clientWidth;
	      }
	
	      box.left -= elem.scrollLeft;
	      box.top -= elem.scrollTop;
	
	      if (elem === offsetParent) {
	        box.left += elem.offsetLeft;
	        box.top += elem.offsetTop;
	        offsetParent = elem.offsetParent;
	      }
	
	      box.bottom = box.top + box.height;
	      box.right = box.left + box.width;
	    }
	
	    return box;
	  }
	
	  function getActiveCellPosition() {
	    return absBox(activeCellNode[0]);
	  }
	
	  function getGridPosition() {
	    return absBox($container[0]);
	  }
	
	  function handleActiveCellPositionChange() {
	    if (!activeCellNode) {
	      return;
	    }
	
	    trigger(self.onActiveCellPositionChanged, {});
	
	    if (currentEditor) {
	      var cellBox = getActiveCellPosition();
	      if (currentEditor.show && currentEditor.hide) {
	        if (!cellBox.visible) {
	          currentEditor.hide();
	        } else {
	          currentEditor.show();
	        }
	      }
	
	      if (currentEditor.position) {
	        currentEditor.position(cellBox);
	      }
	    }
	  }
	
	  function getCellEditor() {
	    return currentEditor;
	  }
	
	  function getActiveCell() {
	    if (!activeCellNode) {
	      return null;
	    } else {
	      return {
	        row: activeRow,
	        cell: activeCell
	      };
	    }
	  }
	
	  function getActiveCellNode() {
	    return activeCellNode;
	  }
	
	  function scrollActiveCellIntoView() {
	    if (activeRow != null && activeCell != null) {
	      scrollCellIntoView(activeRow, activeCell);
	    }
	  }
	
	  function scrollRowIntoView(row, doPaging) {
	
	    if (!hasFrozenRows || !options.frozenBottom && row > actualFrozenRow - 1 || options.frozenBottom && row < actualFrozenRow - 1) {
	
	      var viewportScrollH = $viewportScrollContainerY.height();
	
	      var rowAtTop = row * options.rowHeight;
	      var rowAtBottom = (row + 1) * options.rowHeight - viewportScrollH + (viewportHasHScroll ? scrollbarDimensions.height : 0);
	
	      // need to page down?
	      if ((row + 1) * options.rowHeight > scrollTop + viewportScrollH + offset) {
	        scrollTo(doPaging ? rowAtTop : rowAtBottom);
	        render();
	      }
	      // or page up?
	      else if (row * options.rowHeight < scrollTop + offset) {
	          scrollTo(doPaging ? rowAtBottom : rowAtTop);
	          render();
	        }
	    }
	  }
	
	  function scrollRowToTop(row) {
	    scrollTo(row * options.rowHeight);
	    render();
	  }
	
	  function scrollPage(dir) {
	    var deltaRows = dir * numVisibleRows;
	    scrollTo((getRowFromPosition(scrollTop) + deltaRows) * options.rowHeight);
	    render();
	
	    if (options.enableCellNavigation && activeRow != null) {
	      var row = activeRow + deltaRows;
	      var dataLengthIncludingAddNew = getDataLengthIncludingAddNew();
	      if (row >= dataLengthIncludingAddNew) {
	        row = dataLengthIncludingAddNew - 1;
	      }
	      if (row < 0) {
	        row = 0;
	      }
	
	      var cell = 0,
	          prevCell = null;
	      var prevActivePosX = activePosX;
	      while (cell <= activePosX) {
	        if (canCellBeActive(row, cell)) {
	          prevCell = cell;
	        }
	        cell += getColspan(row, cell);
	      }
	
	      if (prevCell !== null) {
	        setActiveCellInternal(getCellNode(row, prevCell));
	        activePosX = prevActivePosX;
	      } else {
	        resetActiveCell();
	      }
	    }
	  }
	
	  function navigatePageDown() {
	    scrollPage(1);
	  }
	
	  function navigatePageUp() {
	    scrollPage(-1);
	  }
	
	  function getColspan(row, cell) {
	    var metadata = data.getItemMetadata && data.getItemMetadata(row);
	    if (!metadata || !metadata.columns) {
	      return 1;
	    }
	
	    var columnData = columns[cell] && (metadata.columns[columns[cell].id] || metadata.columns[cell]);
	    var colspan = columnData && columnData.colspan;
	    if (colspan === "*") {
	      colspan = columns.length - cell;
	    } else {
	      colspan = colspan || 1;
	    }
	
	    return colspan;
	  }
	
	  function findFirstFocusableCell(row) {
	    var cell = 0;
	    while (cell < columns.length) {
	      if (canCellBeActive(row, cell)) {
	        return cell;
	      }
	      cell += getColspan(row, cell);
	    }
	    return null;
	  }
	
	  function findLastFocusableCell(row) {
	    var cell = 0;
	    var lastFocusableCell = null;
	    while (cell < columns.length) {
	      if (canCellBeActive(row, cell)) {
	        lastFocusableCell = cell;
	      }
	      cell += getColspan(row, cell);
	    }
	    return lastFocusableCell;
	  }
	
	  function gotoRight(row, cell, posX) {
	    if (cell >= columns.length) {
	      return null;
	    }
	
	    do {
	      cell += getColspan(row, cell);
	    } while (cell < columns.length && !canCellBeActive(row, cell));
	
	    if (cell < columns.length) {
	      return {
	        "row": row,
	        "cell": cell,
	        "posX": cell
	      };
	    }
	    return null;
	  }
	
	  function gotoLeft(row, cell, posX) {
	    if (cell <= 0) {
	      return null;
	    }
	
	    var firstFocusableCell = findFirstFocusableCell(row);
	    if (firstFocusableCell === null || firstFocusableCell >= cell) {
	      return null;
	    }
	
	    var prev = {
	      "row": row,
	      "cell": firstFocusableCell,
	      "posX": firstFocusableCell
	    };
	    var pos;
	    while (true) {
	      pos = gotoRight(prev.row, prev.cell, prev.posX);
	      if (!pos) {
	        return null;
	      }
	      if (pos.cell >= cell) {
	        return prev;
	      }
	      prev = pos;
	    }
	  }
	
	  function gotoDown(row, cell, posX) {
	    var prevCell;
	    var dataLengthIncludingAddNew = getDataLengthIncludingAddNew();
	    while (true) {
	      if (++row >= dataLengthIncludingAddNew) {
	        return null;
	      }
	
	      prevCell = cell = 0;
	      while (cell <= posX) {
	        prevCell = cell;
	        cell += getColspan(row, cell);
	      }
	
	      if (canCellBeActive(row, prevCell)) {
	        return {
	          "row": row,
	          "cell": prevCell,
	          "posX": posX
	        };
	      }
	    }
	  }
	
	  function gotoUp(row, cell, posX) {
	    var prevCell;
	    while (true) {
	      if (--row < 0) {
	        return null;
	      }
	
	      prevCell = cell = 0;
	      while (cell <= posX) {
	        prevCell = cell;
	        cell += getColspan(row, cell);
	      }
	
	      if (canCellBeActive(row, prevCell)) {
	        return {
	          "row": row,
	          "cell": prevCell,
	          "posX": posX
	        };
	      }
	    }
	  }
	
	  function gotoNext(row, cell, posX) {
	    if (row == null && cell == null) {
	      row = cell = posX = 0;
	      if (canCellBeActive(row, cell)) {
	        return {
	          "row": row,
	          "cell": cell,
	          "posX": cell
	        };
	      }
	    }
	
	    var pos = gotoRight(row, cell, posX);
	    if (pos) {
	      return pos;
	    }
	
	    var firstFocusableCell = null;
	    var dataLengthIncludingAddNew = getDataLengthIncludingAddNew();
	    while (++row < dataLengthIncludingAddNew) {
	      firstFocusableCell = findFirstFocusableCell(row);
	      if (firstFocusableCell !== null) {
	        return {
	          "row": row,
	          "cell": firstFocusableCell,
	          "posX": firstFocusableCell
	        };
	      }
	    }
	    return null;
	  }
	
	  function gotoPrev(row, cell, posX) {
	    if (row == null && cell == null) {
	      row = getDataLengthIncludingAddNew() - 1;
	      cell = posX = columns.length - 1;
	      if (canCellBeActive(row, cell)) {
	        return {
	          "row": row,
	          "cell": cell,
	          "posX": cell
	        };
	      }
	    }
	
	    var pos;
	    var lastSelectableCell;
	    while (!pos) {
	      pos = gotoLeft(row, cell, posX);
	      if (pos) {
	        break;
	      }
	      if (--row < 0) {
	        return null;
	      }
	
	      cell = 0;
	      lastSelectableCell = findLastFocusableCell(row);
	      if (lastSelectableCell !== null) {
	        pos = {
	          "row": row,
	          "cell": lastSelectableCell,
	          "posX": lastSelectableCell
	        };
	      }
	    }
	    return pos;
	  }
	
	  function navigateRight() {
	    return navigate("right");
	  }
	
	  function navigateLeft() {
	    return navigate("left");
	  }
	
	  function navigateDown() {
	    return navigate("down");
	  }
	
	  function navigateUp() {
	    return navigate("up");
	  }
	
	  function navigateNext() {
	    return navigate("next");
	  }
	
	  function navigatePrev() {
	    return navigate("prev");
	  }
	
	  /**
	   * @param {string} dir Navigation direction.
	   * @return {boolean} Whether navigation resulted in a change of active cell.
	   */
	  function navigate(dir) {
	    if (!options.enableCellNavigation) {
	      return false;
	    }
	
	    if (!activeCellNode && dir != "prev" && dir != "next") {
	      return false;
	    }
	
	    if (!getEditorLock().commitCurrentEdit()) {
	      return true;
	    }
	    setFocus();
	
	    var tabbingDirections = {
	      "up": -1,
	      "down": 1,
	      "left": -1,
	      "right": 1,
	      "prev": -1,
	      "next": 1
	    };
	    tabbingDirection = tabbingDirections[dir];
	
	    var stepFunctions = {
	      "up": gotoUp,
	      "down": gotoDown,
	      "left": gotoLeft,
	      "right": gotoRight,
	      "prev": gotoPrev,
	      "next": gotoNext
	    };
	    var stepFn = stepFunctions[dir];
	    var pos = stepFn(activeRow, activeCell, activePosX);
	    if (pos) {
	      if (hasFrozenRows && options.frozenBottom & pos.row == getDataLength()) {
	        return;
	      }
	
	      var isAddNewRow = pos.row == getDataLength();
	
	      if (!options.frozenBottom && pos.row >= actualFrozenRow || options.frozenBottom && pos.row < actualFrozenRow) {
	        scrollCellIntoView(pos.row, pos.cell, !isAddNewRow);
	      }
	
	      setActiveCellInternal(getCellNode(pos.row, pos.cell));
	      activePosX = pos.posX;
	      return true;
	    } else {
	      setActiveCellInternal(getCellNode(activeRow, activeCell));
	      return false;
	    }
	  }
	
	  function getCellNode(row, cell) {
	    if (rowsCache[row]) {
	      ensureCellNodesInRowsCache(row);
	      return rowsCache[row].cellNodesByColumnIdx[cell];
	    }
	    return null;
	  }
	
	  function setActiveCell(row, cell) {
	    if (!initialized) {
	      return;
	    }
	    if (row > getDataLength() || row < 0 || cell >= columns.length || cell < 0) {
	      return;
	    }
	
	    if (!options.enableCellNavigation) {
	      return;
	    }
	
	    scrollCellIntoView(row, cell, false);
	    setActiveCellInternal(getCellNode(row, cell), false);
	  }
	
	  function canCellBeActive(row, cell) {
	    if (!options.enableCellNavigation || row >= getDataLengthIncludingAddNew() || row < 0 || cell >= columns.length || cell < 0) {
	      return false;
	    }
	
	    var rowMetadata = data.getItemMetadata && data.getItemMetadata(row);
	    if (rowMetadata && typeof rowMetadata.focusable === "boolean") {
	      return rowMetadata.focusable;
	    }
	
	    var columnMetadata = rowMetadata && rowMetadata.columns;
	    if (columnMetadata && columns[cell] && columnMetadata[columns[cell].id] && typeof columnMetadata[columns[cell].id].focusable === "boolean") {
	      return columnMetadata[columns[cell].id].focusable;
	    }
	    if (columnMetadata && columnMetadata[cell] && typeof columnMetadata[cell].focusable === "boolean") {
	      return columnMetadata[cell].focusable;
	    }
	
	    return columns[cell] && columns[cell].focusable;
	  }
	
	  function canCellBeSelected(row, cell) {
	    if (row >= getDataLength() || row < 0 || cell >= columns.length || cell < 0) {
	      return false;
	    }
	
	    var rowMetadata = data.getItemMetadata && data.getItemMetadata(row);
	    if (rowMetadata && typeof rowMetadata.selectable === "boolean") {
	      return rowMetadata.selectable;
	    }
	
	    var columnMetadata = rowMetadata && rowMetadata.columns && (rowMetadata.columns[columns[cell].id] || rowMetadata.columns[cell]);
	    if (columnMetadata && typeof columnMetadata.selectable === "boolean") {
	      return columnMetadata.selectable;
	    }
	
	    return columns[cell].selectable;
	  }
	
	  function gotoCell(row, cell, forceEdit) {
	    if (!initialized) {
	      return;
	    }
	    if (!canCellBeActive(row, cell)) {
	      return;
	    }
	
	    if (!getEditorLock().commitCurrentEdit()) {
	      return;
	    }
	
	    scrollCellIntoView(row, cell, false);
	
	    var newCell = getCellNode(row, cell);
	
	    // if selecting the 'add new' row, start editing right away
	    setActiveCellInternal(newCell, forceEdit || row === getDataLength() || options.autoEdit);
	
	    // if no editor was created, set the focus back on the grid
	    if (!currentEditor) {
	      setFocus();
	    }
	  }
	
	  //////////////////////////////////////////////////////////////////////////////////////////////
	  // IEditor implementation for the editor lock
	
	  function commitCurrentEdit() {
	    var item = getDataItem(activeRow);
	    var column = columns[activeCell];
	
	    if (currentEditor) {
	      if (currentEditor.isValueChanged()) {
	        var validationResults = currentEditor.validate();
	
	        if (validationResults.valid) {
	          if (activeRow < getDataLength()) {
	            var editCommand = {
	              row: activeRow,
	              cell: activeCell,
	              editor: currentEditor,
	              serializedValue: currentEditor.serializeValue(),
	              prevSerializedValue: serializedEditorValue,
	              execute: function execute() {
	                this.editor.applyValue(item, this.serializedValue);
	                updateRow(this.row);
	                trigger(self.onCellChange, {
	                  row: activeRow,
	                  cell: activeCell,
	                  item: item
	                });
	              },
	              undo: function undo() {
	                this.editor.applyValue(item, this.prevSerializedValue);
	                updateRow(this.row);
	                trigger(self.onCellChange, {
	                  row: activeRow,
	                  cell: activeCell,
	                  item: item
	                });
	              }
	            };
	
	            if (options.editCommandHandler) {
	              makeActiveCellNormal();
	              options.editCommandHandler(item, column, editCommand);
	            } else {
	              editCommand.execute();
	              makeActiveCellNormal();
	            }
	          } else {
	            var newItem = {};
	            currentEditor.applyValue(newItem, currentEditor.serializeValue());
	            makeActiveCellNormal();
	            trigger(self.onAddNewRow, {
	              item: newItem,
	              column: column
	            });
	          }
	
	          // check whether the lock has been re-acquired by event handlers
	          return !getEditorLock().isActive();
	        } else {
	          // Re-add the CSS class to trigger transitions, if any.
	          (0, _jquery2.default)(activeCellNode).removeClass("invalid");
	          (0, _jquery2.default)(activeCellNode).width(); // force layout
	          (0, _jquery2.default)(activeCellNode).addClass("invalid");
	
	          trigger(self.onValidationError, {
	            editor: currentEditor,
	            cellNode: activeCellNode,
	            validationResults: validationResults,
	            row: activeRow,
	            cell: activeCell,
	            column: column
	          });
	
	          currentEditor.focus();
	          return false;
	        }
	      }
	
	      makeActiveCellNormal();
	    }
	    return true;
	  }
	
	  function cancelCurrentEdit() {
	    makeActiveCellNormal();
	    return true;
	  }
	
	  function rowsToRanges(rows) {
	    var ranges = [];
	    var lastCell = columns.length - 1;
	    for (var i = 0; i < rows.length; i++) {
	      ranges.push(new _slick2.default.Range(rows[i], 0, rows[i], lastCell));
	    }
	    return ranges;
	  }
	
	  function getSelectedRows() {
	    if (!selectionModel) {
	      throw "Selection model is not set";
	    }
	    return selectedRows;
	  }
	
	  function setSelectedRows(rows) {
	    if (!selectionModel) {
	      throw "Selection model is not set";
	    }
	    selectionModel.setSelectedRanges(rowsToRanges(rows));
	  }
	
	  //////////////////////////////////////////////////////////////////////////////////////////////
	  // Debug
	
	  this.debug = function () {
	    var s = "";
	
	    s += "\n" + "counter_rows_rendered:  " + counter_rows_rendered;
	    s += "\n" + "counter_rows_removed:  " + counter_rows_removed;
	    s += "\n" + "renderedRows:  " + renderedRows;
	    s += "\n" + "numVisibleRows:  " + numVisibleRows;
	    s += "\n" + "maxSupportedCssHeight:  " + maxSupportedCssHeight;
	    s += "\n" + "n(umber of pages):  " + n;
	    s += "\n" + "(current) page:  " + page;
	    s += "\n" + "page height (ph):  " + ph;
	    s += "\n" + "vScrollDir:  " + vScrollDir;
	
	    alert(s);
	  };
	
	  // a debug helper to be able to access private members
	  this.eval = function (expr) {
	    return eval(expr);
	  };
	
	  //////////////////////////////////////////////////////////////////////////////////////////////
	  // Public API
	
	  _jquery2.default.extend(this, {
	    "slickGridVersion": "2.1",
	
	    // Events
	    "onScroll": new _slick2.default.Event(),
	    "onSort": new _slick2.default.Event(),
	    "onHeaderMouseEnter": new _slick2.default.Event(),
	    "onHeaderMouseLeave": new _slick2.default.Event(),
	    "onHeaderContextMenu": new _slick2.default.Event(),
	    "onHeaderClick": new _slick2.default.Event(),
	    "onHeaderCellRendered": new _slick2.default.Event(),
	    "onBeforeHeaderCellDestroy": new _slick2.default.Event(),
	    "onHeaderRowCellRendered": new _slick2.default.Event(),
	    "onFooterRowCellRendered": new _slick2.default.Event(),
	    "onBeforeHeaderRowCellDestroy": new _slick2.default.Event(),
	    "onBeforeFooterRowCellDestroy": new _slick2.default.Event(),
	    "onMouseEnter": new _slick2.default.Event(),
	    "onMouseLeave": new _slick2.default.Event(),
	    "onClick": new _slick2.default.Event(),
	    "onDblClick": new _slick2.default.Event(),
	    "onContextMenu": new _slick2.default.Event(),
	    "onKeyDown": new _slick2.default.Event(),
	    "onAddNewRow": new _slick2.default.Event(),
	    "onValidationError": new _slick2.default.Event(),
	    "onViewportChanged": new _slick2.default.Event(),
	    "onColumnsReordered": new _slick2.default.Event(),
	    "onColumnsResized": new _slick2.default.Event(),
	    "onCellChange": new _slick2.default.Event(),
	    "onBeforeEditCell": new _slick2.default.Event(),
	    "onBeforeCellEditorDestroy": new _slick2.default.Event(),
	    "onBeforeDestroy": new _slick2.default.Event(),
	    "onActiveCellChanged": new _slick2.default.Event(),
	    "onActiveCellPositionChanged": new _slick2.default.Event(),
	    "onDragInit": new _slick2.default.Event(),
	    "onDragStart": new _slick2.default.Event(),
	    "onDrag": new _slick2.default.Event(),
	    "onDragEnd": new _slick2.default.Event(),
	    "onSelectedRowsChanged": new _slick2.default.Event(),
	    "onCellCssStylesChanged": new _slick2.default.Event(),
	
	    // Methods
	    "registerPlugin": registerPlugin,
	    "unregisterPlugin": unregisterPlugin,
	    "getColumns": getColumns,
	    "setColumns": setColumns,
	    "getColumnIndex": getColumnIndex,
	    "updateColumnHeader": updateColumnHeader,
	    "setSortColumn": setSortColumn,
	    "setSortColumns": setSortColumns,
	    "getSortColumns": getSortColumns,
	    "autosizeColumns": autosizeColumns,
	    "getOptions": getOptions,
	    "setOptions": setOptions,
	    "getData": getData,
	    "getDataLength": getDataLength,
	    "getDataItem": getDataItem,
	    "setData": setData,
	    "getSelectionModel": getSelectionModel,
	    "setSelectionModel": setSelectionModel,
	    "getSelectedRows": getSelectedRows,
	    "setSelectedRows": setSelectedRows,
	    "getContainerNode": getContainerNode,
	
	    "render": render,
	    "invalidate": invalidate,
	    "invalidateRow": invalidateRow,
	    "invalidateRows": invalidateRows,
	    "invalidateAllRows": invalidateAllRows,
	    "updateCell": updateCell,
	    "updateRow": updateRow,
	    "getViewport": getVisibleRange,
	    "getRenderedRange": getRenderedRange,
	    "resizeCanvas": resizeCanvas,
	    "updateRowCount": updateRowCount,
	    "scrollRowIntoView": scrollRowIntoView,
	    "scrollRowToTop": scrollRowToTop,
	    "scrollCellIntoView": scrollCellIntoView,
	    "getCanvasNode": getCanvasNode,
	    "getCanvases": getCanvases,
	    "getActiveCanvasNode": getActiveCanvasNode,
	    "setActiveCanvasNode": setActiveCanvasNode,
	    "getViewportNode": getViewportNode,
	    "getActiveViewportNode": getActiveViewportNode,
	    "setActiveViewportNode": setActiveViewportNode,
	    "focus": setFocus,
	
	    "getCellFromPoint": getCellFromPoint,
	    "getCellFromEvent": getCellFromEvent,
	    "getActiveCell": getActiveCell,
	    "setActiveCell": setActiveCell,
	    "getActiveCellNode": getActiveCellNode,
	    "getActiveCellPosition": getActiveCellPosition,
	    "resetActiveCell": resetActiveCell,
	    "editActiveCell": makeActiveCellEditable,
	    "getCellEditor": getCellEditor,
	    "getCellNode": getCellNode,
	    "getCellNodeBox": getCellNodeBox,
	    "canCellBeSelected": canCellBeSelected,
	    "canCellBeActive": canCellBeActive,
	    "navigatePrev": navigatePrev,
	    "navigateNext": navigateNext,
	    "navigateUp": navigateUp,
	    "navigateDown": navigateDown,
	    "navigateLeft": navigateLeft,
	    "navigateRight": navigateRight,
	    "navigatePageUp": navigatePageUp,
	    "navigatePageDown": navigatePageDown,
	    "gotoCell": gotoCell,
	    "getTopPanel": getTopPanel,
	    "setTopPanelVisibility": setTopPanelVisibility,
	    "setHeaderRowVisibility": setHeaderRowVisibility,
	    "getHeaderRow": getHeaderRow,
	    "getHeaderRowColumn": getHeaderRowColumn,
	    "setFooterRowVisibility": setFooterRowVisibility,
	    "getFooterRow": getFooterRow,
	    "getFooterRowColumn": getFooterRowColumn,
	    "getGridPosition": getGridPosition,
	    "flashCell": flashCell,
	    "addCellCssStyles": addCellCssStyles,
	    "setCellCssStyles": setCellCssStyles,
	    "removeCellCssStyles": removeCellCssStyles,
	    "getCellCssStyles": getCellCssStyles,
	    "getFrozenRowOffset": getFrozenRowOffset,
	
	    "init": finishInitialization,
	    "destroy": destroy,
	
	    // IEditor implementation
	    "getEditorLock": getEditorLock,
	    "getEditController": getEditController
	  });
	
	  init();
	}

/***/ }),

/***/ 113:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _slick = __webpack_require__(7);
	
	var _slick2 = _interopRequireDefault(_slick);
	
	var _jquery = __webpack_require__(8);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _slick3 = __webpack_require__(117);
	
	var _slick4 = _interopRequireDefault(_slick3);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Aggregators = {
	  Avg: AvgAggregator,
	  Min: MinAggregator,
	  Max: MaxAggregator,
	  Sum: SumAggregator
	};
	
	var Data = {
	  DataView: DataView,
	  GroupMetaDataProvider: _slick4.default,
	  Aggregators: Aggregators
	};
	
	exports.default = Data;
	
	/** *
	 * A sample Model implementation.
	 * Provides a filtered view of the underlying data.
	 *
	 * Relies on the data item having an "id" property uniquely identifying it.
	 */
	
	function DataView(options) {
	  var self = this;
	
	  var defaults = {
	    groupItemMetadataProvider: null,
	    inlineFilters: false
	  };
	
	  // private
	  var idProperty = 'id'; // property holding a unique row id
	  var items = []; // data by index
	  var rows = []; // data by row
	  var idxById = {}; // indexes by id
	  var rowsById = null; // rows by id; lazy-calculated
	  var filter = null; // filter function
	  var updated = null; // updated item ids
	  var suspend = false; // suspends the recalculation
	  var sortAsc = true;
	  var fastSortField = void 0;
	  var sortComparer = void 0;
	  var refreshHints = {};
	  var prevRefreshHints = {};
	  var filterArgs = void 0;
	  var filteredItems = [];
	  var compiledFilter = void 0;
	  var compiledFilterWithCaching = void 0;
	  var filterCache = [];
	
	  // grouping
	  var groupingInfoDefaults = {
	    getter: null,
	    formatter: null,
	    comparer: function comparer(a, b) {
	      return a.value === b.value ? 0 : a.value > b.value ? 1 : -1;
	    },
	    predefinedValues: [],
	    aggregators: [],
	    aggregateEmpty: false,
	    aggregateCollapsed: false,
	    aggregateChildGroups: false,
	    collapsed: false,
	    displayTotalsRow: true,
	    lazyTotalsCalculation: false
	  };
	  var groupingInfos = [];
	  var groups = [];
	  var toggledGroupsByLevel = [];
	  var groupingDelimiter = ':|:';
	
	  var pagesize = 0;
	  var pagenum = 0;
	  var totalRows = 0;
	
	  // events
	  var onRowCountChanged = new _slick2.default.Event();
	  var onRowsChanged = new _slick2.default.Event();
	  var onPagingInfoChanged = new _slick2.default.Event();
	
	  options = _jquery2.default.extend(true, {}, defaults, options);
	
	  function beginUpdate() {
	    suspend = true;
	  }
	
	  function endUpdate() {
	    suspend = false;
	    refresh();
	  }
	
	  function setRefreshHints(hints) {
	    refreshHints = hints;
	  }
	
	  function setFilterArgs(args) {
	    filterArgs = args;
	  }
	
	  function updateIdxById(startingIndex) {
	    startingIndex = startingIndex || 0;
	    var id = void 0;
	    for (var i = startingIndex, l = items.length; i < l; i++) {
	      id = items[i][idProperty];
	      if (id === undefined) {
	        throw "Each data element must implement a unique 'id' property";
	      }
	      idxById[id] = i;
	    }
	  }
	
	  function ensureIdUniqueness() {
	    var id = void 0;
	    for (var i = 0, l = items.length; i < l; i++) {
	      id = items[i][idProperty];
	      if (id === undefined || idxById[id] !== i) {
	        throw "Each data element must implement a unique 'id' property";
	      }
	    }
	  }
	
	  function getItems() {
	    return items;
	  }
	
	  function setItems(data, objectIdProperty) {
	    if (objectIdProperty !== undefined) {
	      idProperty = objectIdProperty;
	    }
	    items = filteredItems = data;
	    idxById = {};
	    updateIdxById();
	    ensureIdUniqueness();
	    refresh();
	  }
	
	  function setPagingOptions(args) {
	    if (args.pageSize != undefined) {
	      pagesize = args.pageSize;
	      pagenum = pagesize ? Math.min(pagenum, Math.max(0, Math.ceil(totalRows / pagesize) - 1)) : 0;
	    }
	
	    if (args.pageNum != undefined) {
	      pagenum = Math.min(args.pageNum, Math.max(0, Math.ceil(totalRows / pagesize) - 1));
	    }
	
	    onPagingInfoChanged.notify(getPagingInfo(), null, self);
	
	    refresh();
	  }
	
	  function getPagingInfo() {
	    var totalPages = pagesize ? Math.max(1, Math.ceil(totalRows / pagesize)) : 1;
	    return { pageSize: pagesize, pageNum: pagenum, totalRows: totalRows, totalPages: totalPages, dataView: self };
	  }
	
	  function sort(comparer, ascending) {
	    sortAsc = ascending;
	    sortComparer = comparer;
	    fastSortField = null;
	    if (ascending === false) {
	      items.reverse();
	    }
	    items.sort(comparer);
	    if (ascending === false) {
	      items.reverse();
	    }
	    idxById = {};
	    updateIdxById();
	    refresh();
	  }
	
	  /** *
	   * Provides a workaround for the extremely slow sorting in IE.
	   * Does a [lexicographic] sort on a give column by temporarily overriding Object.prototype.toString
	   * to return the value of that field and then doing a native Array.sort().
	   */
	  function fastSort(field, ascending) {
	    sortAsc = ascending;
	    fastSortField = field;
	    sortComparer = null;
	    var oldToString = Object.prototype.toString;
	    Object.prototype.toString = typeof field == 'function' ? field : function () {
	      return this[field];
	    };
	    // an extra reversal for descending sort keeps the sort stable
	    // (assuming a stable native sort implementation, which isn't true in some cases)
	    if (ascending === false) {
	      items.reverse();
	    }
	    items.sort();
	    Object.prototype.toString = oldToString;
	    if (ascending === false) {
	      items.reverse();
	    }
	    idxById = {};
	    updateIdxById();
	    refresh();
	  }
	
	  function reSort() {
	    if (sortComparer) {
	      sort(sortComparer, sortAsc);
	    } else if (fastSortField) {
	      fastSort(fastSortField, sortAsc);
	    }
	  }
	
	  function setFilter(filterFn) {
	    filter = filterFn;
	    if (options.inlineFilters) {
	      compiledFilter = compileFilter();
	      compiledFilterWithCaching = compileFilterWithCaching();
	    }
	    refresh();
	  }
	
	  function getGrouping() {
	    return groupingInfos;
	  }
	
	  function setGrouping(groupingInfo) {
	    if (!options.groupItemMetadataProvider) {
	      options.groupItemMetadataProvider = new Data.GroupItemMetadataProvider();
	    }
	
	    groups = [];
	    toggledGroupsByLevel = [];
	    groupingInfo = groupingInfo || [];
	    groupingInfos = groupingInfo instanceof Array ? groupingInfo : [groupingInfo];
	
	    for (var i = 0; i < groupingInfos.length; i++) {
	      var gi = groupingInfos[i] = _jquery2.default.extend(true, {}, groupingInfoDefaults, groupingInfos[i]);
	      gi.getterIsAFn = typeof gi.getter === 'function';
	
	      // pre-compile accumulator loops
	      gi.compiledAccumulators = [];
	      var idx = gi.aggregators.length;
	      while (idx--) {
	        gi.compiledAccumulators[idx] = compileAccumulatorLoop(gi.aggregators[idx]);
	      }
	
	      toggledGroupsByLevel[i] = {};
	    }
	
	    refresh();
	  }
	
	  /**
	   * @deprecated Please use {@link setGrouping}.
	   */
	  function groupBy(valueGetter, valueFormatter, sortComparer) {
	    if (valueGetter == null) {
	      setGrouping([]);
	      return;
	    }
	
	    setGrouping({
	      getter: valueGetter,
	      formatter: valueFormatter,
	      comparer: sortComparer
	    });
	  }
	
	  /**
	   * @deprecated Please use {@link setGrouping}.
	   */
	  function setAggregators(groupAggregators, includeCollapsed) {
	    if (!groupingInfos.length) {
	      throw new Error('At least one grouping must be specified before calling setAggregators().');
	    }
	
	    groupingInfos[0].aggregators = groupAggregators;
	    groupingInfos[0].aggregateCollapsed = includeCollapsed;
	
	    setGrouping(groupingInfos);
	  }
	
	  function getItemByIdx(i) {
	    return items[i];
	  }
	
	  function getIdxById(id) {
	    return idxById[id];
	  }
	
	  function ensureRowsByIdCache() {
	    if (!rowsById) {
	      rowsById = {};
	      for (var i = 0, l = rows.length; i < l; i++) {
	        rowsById[rows[i][idProperty]] = i;
	      }
	    }
	  }
	
	  function getRowById(id) {
	    ensureRowsByIdCache();
	    return rowsById[id];
	  }
	
	  function getItemById(id) {
	    return items[idxById[id]];
	  }
	
	  function mapIdsToRows(idArray) {
	    var rows = [];
	    ensureRowsByIdCache();
	    for (var i = 0, l = idArray.length; i < l; i++) {
	      var row = rowsById[idArray[i]];
	      if (row != null) {
	        rows[rows.length] = row;
	      }
	    }
	    return rows;
	  }
	
	  function mapRowsToIds(rowArray) {
	    var ids = [];
	    for (var i = 0, l = rowArray.length; i < l; i++) {
	      if (rowArray[i] < rows.length) {
	        ids[ids.length] = rows[rowArray[i]][idProperty];
	      }
	    }
	    return ids;
	  }
	
	  function updateItem(id, item) {
	    if (idxById[id] === undefined || id !== item[idProperty]) {
	      throw 'Invalid or non-matching id';
	    }
	    items[idxById[id]] = item;
	    if (!updated) {
	      updated = {};
	    }
	    updated[id] = true;
	    refresh();
	  }
	
	  function insertItem(insertBefore, item) {
	    items.splice(insertBefore, 0, item);
	    updateIdxById(insertBefore);
	    refresh();
	  }
	
	  function addItem(item) {
	    items.push(item);
	    updateIdxById(items.length - 1);
	    refresh();
	  }
	
	  function deleteItem(id) {
	    var idx = idxById[id];
	    if (idx === undefined) {
	      throw 'Invalid id';
	    }
	    delete idxById[id];
	    items.splice(idx, 1);
	    updateIdxById(idx);
	    refresh();
	  }
	
	  function getLength() {
	    return rows.length;
	  }
	
	  function getItem(i) {
	    var item = rows[i];
	
	    // if this is a group row, make sure totals are calculated and update the title
	    if (item && item.__group && item.totals && !item.totals.initialized) {
	      var gi = groupingInfos[item.level];
	      if (!gi.displayTotalsRow) {
	        calculateTotals(item.totals);
	        item.title = gi.formatter ? gi.formatter(item) : item.value;
	      }
	    }
	    // if this is a totals row, make sure it's calculated
	    else if (item && item.__groupTotals && !item.initialized) {
	        calculateTotals(item);
	      }
	
	    return item;
	  }
	
	  function getItemMetadata(i) {
	    var item = rows[i];
	    if (item === undefined) {
	      return null;
	    }
	
	    // overrides for grouping rows
	    if (item.__group) {
	      return options.groupItemMetadataProvider.getGroupRowMetadata(item);
	    }
	
	    // overrides for totals rows
	    if (item.__groupTotals) {
	      return options.groupItemMetadataProvider.getTotalsRowMetadata(item);
	    }
	
	    return null;
	  }
	
	  function expandCollapseAllGroups(level, collapse) {
	    if (level == null) {
	      for (var i = 0; i < groupingInfos.length; i++) {
	        toggledGroupsByLevel[i] = {};
	        groupingInfos[i].collapsed = collapse;
	      }
	    } else {
	      toggledGroupsByLevel[level] = {};
	      groupingInfos[level].collapsed = collapse;
	    }
	    refresh();
	  }
	
	  /**
	   * @param level {Number} Optional level to collapse.  If not specified, applies to all levels.
	   */
	  function collapseAllGroups(level) {
	    expandCollapseAllGroups(level, true);
	  }
	
	  /**
	   * @param level {Number} Optional level to expand.  If not specified, applies to all levels.
	   */
	  function expandAllGroups(level) {
	    expandCollapseAllGroups(level, false);
	  }
	
	  function expandCollapseGroup(level, groupingKey, collapse) {
	    toggledGroupsByLevel[level][groupingKey] = groupingInfos[level].collapsed ^ collapse;
	    refresh();
	  }
	
	  /**
	   * @param letArgs Either a Slick.Group's "groupingKey" property, or a
	   *     letiable argument list of grouping values denoting a unique path to the row.  For
	   *     example, calling collapseGroup('high', '10%') will collapse the '10%' subgroup of
	   *     the 'high' group.
	   */
	  function collapseGroup(letArgs) {
	    var args = Array.prototype.slice.call(arguments);
	    var arg0 = args[0];
	    if (args.length == 1 && arg0.indexOf(groupingDelimiter) != -1) {
	      expandCollapseGroup(arg0.split(groupingDelimiter).length - 1, arg0, true);
	    } else {
	      expandCollapseGroup(args.length - 1, args.join(groupingDelimiter), true);
	    }
	  }
	
	  /**
	   * @param letArgs Either a Slick.Group's "groupingKey" property, or a
	   *     letiable argument list of grouping values denoting a unique path to the row.  For
	   *     example, calling expandGroup('high', '10%') will expand the '10%' subgroup of
	   *     the 'high' group.
	   */
	  function expandGroup(letArgs) {
	    var args = Array.prototype.slice.call(arguments);
	    var arg0 = args[0];
	    if (args.length == 1 && arg0.indexOf(groupingDelimiter) != -1) {
	      expandCollapseGroup(arg0.split(groupingDelimiter).length - 1, arg0, false);
	    } else {
	      expandCollapseGroup(args.length - 1, args.join(groupingDelimiter), false);
	    }
	  }
	
	  function getGroups() {
	    return groups;
	  }
	
	  function extractGroups(rows, parentGroup) {
	    var group = void 0;
	    var val = void 0;
	    var groups = [];
	    var groupsByVal = {};
	    var r = void 0;
	    var level = parentGroup ? parentGroup.level + 1 : 0;
	    var gi = groupingInfos[level];
	
	    for (var i = 0, l = gi.predefinedValues.length; i < l; i++) {
	      val = gi.predefinedValues[i];
	      group = groupsByVal[val];
	      if (!group) {
	        group = new _slick2.default.Group();
	        group.value = val;
	        group.level = level;
	        group.groupingKey = (parentGroup ? parentGroup.groupingKey + groupingDelimiter : '') + val;
	        groups[groups.length] = group;
	        groupsByVal[val] = group;
	      }
	    }
	
	    for (var _i = 0, _l = rows.length; _i < _l; _i++) {
	      r = rows[_i];
	      val = gi.getterIsAFn ? gi.getter(r) : r[gi.getter];
	      group = groupsByVal[val];
	      if (!group) {
	        group = new _slick2.default.Group();
	        group.value = val;
	        group.level = level;
	        group.groupingKey = (parentGroup ? parentGroup.groupingKey + groupingDelimiter : '') + val;
	        groups[groups.length] = group;
	        groupsByVal[val] = group;
	      }
	
	      group.rows[group.count++] = r;
	    }
	
	    if (level < groupingInfos.length - 1) {
	      for (var _i2 = 0; _i2 < groups.length; _i2++) {
	        group = groups[_i2];
	        group.groups = extractGroups(group.rows, group);
	      }
	    }
	
	    groups.sort(groupingInfos[level].comparer);
	
	    return groups;
	  }
	
	  function calculateTotals(totals) {
	    var group = totals.group;
	    var gi = groupingInfos[group.level];
	    var isLeafLevel = group.level == groupingInfos.length;
	    var agg = void 0,
	        idx = gi.aggregators.length;
	
	    if (!isLeafLevel && gi.aggregateChildGroups) {
	      // make sure all the subgroups are calculated
	      var i = group.groups.length;
	      while (i--) {
	        if (!group.groups[i].totals.initialized) {
	          calculateTotals(group.groups[i].totals);
	        }
	      }
	    }
	
	    while (idx--) {
	      agg = gi.aggregators[idx];
	      agg.init();
	      if (!isLeafLevel && gi.aggregateChildGroups) {
	        gi.compiledAccumulators[idx].call(agg, group.groups);
	      } else {
	        gi.compiledAccumulators[idx].call(agg, group.rows);
	      }
	      agg.storeResult(totals);
	    }
	    totals.initialized = true;
	  }
	
	  function addGroupTotals(group) {
	    var gi = groupingInfos[group.level];
	    var totals = new _slick2.default.GroupTotals();
	    totals.group = group;
	    group.totals = totals;
	    if (!gi.lazyTotalsCalculation) {
	      calculateTotals(totals);
	    }
	  }
	
	  function addTotals(groups, level) {
	    level = level || 0;
	    var gi = groupingInfos[level];
	    var groupCollapsed = gi.collapsed;
	    var toggledGroups = toggledGroupsByLevel[level];
	    var idx = groups.length,
	        g = void 0;
	    while (idx--) {
	      g = groups[idx];
	
	      if (g.collapsed && !gi.aggregateCollapsed) {
	        continue;
	      }
	
	      // Do a depth-first aggregation so that parent group aggregators can access subgroup totals.
	      if (g.groups) {
	        addTotals(g.groups, level + 1);
	      }
	
	      if (gi.aggregators.length && (gi.aggregateEmpty || g.rows.length || g.groups && g.groups.length)) {
	        addGroupTotals(g);
	      }
	
	      g.collapsed = groupCollapsed ^ toggledGroups[g.groupingKey];
	      g.title = gi.formatter ? gi.formatter(g) : g.value;
	    }
	  }
	
	  function flattenGroupedRows(groups, level) {
	    level = level || 0;
	    var gi = groupingInfos[level];
	    var groupedRows = [],
	        rows = void 0,
	        gl = 0,
	        g = void 0;
	    for (var i = 0, l = groups.length; i < l; i++) {
	      g = groups[i];
	      groupedRows[gl++] = g;
	
	      if (!g.collapsed) {
	        rows = g.groups ? flattenGroupedRows(g.groups, level + 1) : g.rows;
	        for (var j = 0, jj = rows.length; j < jj; j++) {
	          groupedRows[gl++] = rows[j];
	        }
	      }
	
	      if (g.totals && gi.displayTotalsRow && (!g.collapsed || gi.aggregateCollapsed)) {
	        groupedRows[gl++] = g.totals;
	      }
	    }
	    return groupedRows;
	  }
	
	  function getFunctionInfo(fn) {
	    var fnRegex = /^function[^(]*\(([^)]*)\)\s*{([\s\S]*)}$/;
	    var matches = fn.toString().match(fnRegex);
	    return {
	      params: matches[1].split(','),
	      body: matches[2]
	    };
	  }
	
	  function compileAccumulatorLoop(aggregator) {
	    var accumulatorInfo = getFunctionInfo(aggregator.accumulate);
	    var fn = new Function('_items', 'for (let ' + accumulatorInfo.params[0] + ', _i=0, _il=_items.length; _i<_il; _i++) {' + accumulatorInfo.params[0] + ' = _items[_i]; ' + accumulatorInfo.body + '}');
	    fn.displayName = 'compiledAccumulatorLoop';
	    return fn;
	  }
	
	  function compileFilter() {
	    var filterInfo = getFunctionInfo(filter);
	
	    var filterPath1 = '{ continue _coreloop; }$1';
	    var filterPath2 = '{ _retval[_idx++] = $item$; continue _coreloop; }$1';
	    // make some allowances for minification - there's only so far we can go with RegEx
	    var filterBody = filterInfo.body.replace(/return false\s*([;}]|\}|$)/gi, filterPath1).replace(/return!1([;}]|\}|$)/gi, filterPath1).replace(/return true\s*([;}]|\}|$)/gi, filterPath2).replace(/return!0([;}]|\}|$)/gi, filterPath2).replace(/return ([^;}]+?)\s*([;}]|$)/gi, '{ if ($1) { _retval[_idx++] = $item$; }; continue _coreloop; }$2');
	
	    // This preserves the function template code after JS compression,
	    // so that replace() commands still work as expected.
	    var tpl = [
	    // "function(_items, _args) { ",
	    'let _retval = [], _idx = 0; ', 'let $item$, $args$ = _args; ', '_coreloop: ', 'for (let _i = 0, _il = _items.length; _i < _il; _i++) { ', '$item$ = _items[_i]; ', '$filter$; ', '} ', 'return _retval; '
	    // "}"
	    ].join('');
	    tpl = tpl.replace(/\$filter\$/gi, filterBody);
	    tpl = tpl.replace(/\$item\$/gi, filterInfo.params[0]);
	    tpl = tpl.replace(/\$args\$/gi, filterInfo.params[1]);
	
	    var fn = new Function('_items,_args', tpl);
	    fn.displayName = 'compiledFilter';
	
	    return fn;
	  }
	
	  function compileFilterWithCaching() {
	    var filterInfo = getFunctionInfo(filter);
	
	    var filterPath1 = '{ continue _coreloop; }$1';
	    var filterPath2 = '{ _cache[_i] = true;_retval[_idx++] = $item$; continue _coreloop; }$1';
	    // make some allowances for minification - there's only so far we can go with RegEx
	    var filterBody = filterInfo.body.replace(/return false\s*([;}]|\}|$)/gi, filterPath1).replace(/return!1([;}]|\}|$)/gi, filterPath1).replace(/return true\s*([;}]|\}|$)/gi, filterPath2).replace(/return!0([;}]|\}|$)/gi, filterPath2).replace(/return ([^;}]+?)\s*([;}]|$)/gi, '{ if ((_cache[_i] = $1)) { _retval[_idx++] = $item$; }; continue _coreloop; }$2');
	
	    // This preserves the function template code after JS compression,
	    // so that replace() commands still work as expected.
	    var tpl = [
	    // "function(_items, _args, _cache) { ",
	    'let _retval = [], _idx = 0; ', 'let $item$, $args$ = _args; ', '_coreloop: ', 'for (let _i = 0, _il = _items.length; _i < _il; _i++) { ', '$item$ = _items[_i]; ', 'if (_cache[_i]) { ', '_retval[_idx++] = $item$; ', 'continue _coreloop; ', '} ', '$filter$; ', '} ', 'return _retval; '
	    // "}"
	    ].join('');
	    tpl = tpl.replace(/\$filter\$/gi, filterBody);
	    tpl = tpl.replace(/\$item\$/gi, filterInfo.params[0]);
	    tpl = tpl.replace(/\$args\$/gi, filterInfo.params[1]);
	
	    var fn = new Function('_items,_args,_cache', tpl);
	    fn.displayName = 'compiledFilterWithCaching';
	    return fn;
	  }
	
	  function uncompiledFilter(items, args) {
	    var retval = [],
	        idx = 0;
	
	    for (var i = 0, ii = items.length; i < ii; i++) {
	      if (filter(items[i], args)) {
	        retval[idx++] = items[i];
	      }
	    }
	
	    return retval;
	  }
	
	  function uncompiledFilterWithCaching(items, args, cache) {
	    var retval = [],
	        idx = 0,
	        item = void 0;
	
	    for (var i = 0, ii = items.length; i < ii; i++) {
	      item = items[i];
	      if (cache[i]) {
	        retval[idx++] = item;
	      } else if (filter(item, args)) {
	        retval[idx++] = item;
	        cache[i] = true;
	      }
	    }
	
	    return retval;
	  }
	
	  function getFilteredAndPagedItems(items) {
	    if (filter) {
	      var batchFilter = options.inlineFilters ? compiledFilter : uncompiledFilter;
	      var batchFilterWithCaching = options.inlineFilters ? compiledFilterWithCaching : uncompiledFilterWithCaching;
	
	      if (refreshHints.isFilterNarrowing) {
	        filteredItems = batchFilter(filteredItems, filterArgs);
	      } else if (refreshHints.isFilterExpanding) {
	        filteredItems = batchFilterWithCaching(items, filterArgs, filterCache);
	      } else if (!refreshHints.isFilterUnchanged) {
	        filteredItems = batchFilter(items, filterArgs);
	      }
	    } else {
	      // special case:  if not filtering and not paging, the resulting
	      // rows collection needs to be a copy so that changes due to sort
	      // can be caught
	      filteredItems = pagesize ? items : items.concat();
	    }
	
	    // get the current page
	    var paged = void 0;
	    if (pagesize) {
	      if (filteredItems.length < pagenum * pagesize) {
	        pagenum = Math.floor(filteredItems.length / pagesize);
	      }
	      paged = filteredItems.slice(pagesize * pagenum, pagesize * pagenum + pagesize);
	    } else {
	      paged = filteredItems;
	    }
	
	    return { totalRows: filteredItems.length, rows: paged };
	  }
	
	  function getRowDiffs(rows, newRows) {
	    var item = void 0,
	        r = void 0,
	        eitherIsNonData = void 0,
	        diff = [];
	    var from = 0,
	        to = newRows.length;
	
	    if (refreshHints && refreshHints.ignoreDiffsBefore) {
	      from = Math.max(0, Math.min(newRows.length, refreshHints.ignoreDiffsBefore));
	    }
	
	    if (refreshHints && refreshHints.ignoreDiffsAfter) {
	      to = Math.min(newRows.length, Math.max(0, refreshHints.ignoreDiffsAfter));
	    }
	
	    for (var i = from, rl = rows.length; i < to; i++) {
	      if (i >= rl) {
	        diff[diff.length] = i;
	      } else {
	        item = newRows[i];
	        r = rows[i];
	
	        if (groupingInfos.length && (eitherIsNonData = item.__nonDataRow || r.__nonDataRow) && item.__group !== r.__group || item.__group && !item.equals(r) || eitherIsNonData && (
	        // no good way to compare totals since they are arbitrary DTOs
	        // deep object comparison is pretty expensive
	        // always considering them 'dirty' seems easier for the time being
	        item.__groupTotals || r.__groupTotals) || item[idProperty] != r[idProperty] || updated && updated[item[idProperty]]) {
	          diff[diff.length] = i;
	        }
	      }
	    }
	    return diff;
	  }
	
	  function recalc(_items) {
	    rowsById = null;
	
	    if (refreshHints.isFilterNarrowing != prevRefreshHints.isFilterNarrowing || refreshHints.isFilterExpanding != prevRefreshHints.isFilterExpanding) {
	      filterCache = [];
	    }
	
	    var filteredItems = getFilteredAndPagedItems(_items);
	    totalRows = filteredItems.totalRows;
	    var newRows = filteredItems.rows;
	
	    groups = [];
	    if (groupingInfos.length) {
	      groups = extractGroups(newRows);
	      if (groups.length) {
	        addTotals(groups);
	        newRows = flattenGroupedRows(groups);
	      }
	    }
	
	    var diff = getRowDiffs(rows, newRows);
	
	    rows = newRows;
	
	    return diff;
	  }
	
	  function refresh() {
	    if (suspend) {
	      return;
	    }
	
	    var countBefore = rows.length;
	    var totalRowsBefore = totalRows;
	
	    var diff = recalc(items, filter); // pass as direct refs to avoid closure perf hit
	
	    // if the current page is no longer valid, go to last page and recalc
	    // we suffer a performance penalty here, but the main loop (recalc) remains highly optimized
	    if (pagesize && totalRows < pagenum * pagesize) {
	      pagenum = Math.max(0, Math.ceil(totalRows / pagesize) - 1);
	      diff = recalc(items, filter);
	    }
	
	    updated = null;
	    prevRefreshHints = refreshHints;
	    refreshHints = {};
	
	    if (totalRowsBefore !== totalRows) {
	      onPagingInfoChanged.notify(getPagingInfo(), null, self);
	    }
	    if (countBefore !== rows.length) {
	      onRowCountChanged.notify({ previous: countBefore, current: rows.length, dataView: self }, null, self);
	    }
	    if (diff.length > 0) {
	      onRowsChanged.notify({ rows: diff, dataView: self }, null, self);
	    }
	  }
	
	  /** *
	   * Wires the grid and the DataView together to keep row selection tied to item ids.
	   * This is useful since, without it, the grid only knows about rows, so if the items
	   * move around, the same rows stay selected instead of the selection moving along
	   * with the items.
	   *
	   * NOTE:  This doesn't work with cell selection model.
	   *
	   * @param grid {Slick.Grid} The grid to sync selection with.
	   * @param preserveHidden {Boolean} Whether to keep selected items that go out of the
	   *     view due to them getting filtered out.
	   * @param preserveHiddenOnSelectionChange {Boolean} Whether to keep selected items
	   *     that are currently out of the view (see preserveHidden) as selected when selection
	   *     changes.
	   * @return {Slick.Event} An event that notifies when an internal list of selected row ids
	   *     changes.  This is useful since, in combination with the above two options, it allows
	   *     access to the full list selected row ids, and not just the ones visible to the grid.
	   * @method syncGridSelection
	   */
	  function syncGridSelection(grid, preserveHidden, preserveHiddenOnSelectionChange) {
	    var self = this;
	    var inHandler = void 0;
	    var selectedRowIds = self.mapRowsToIds(grid.getSelectedRows());
	    var onSelectedRowIdsChanged = new _slick2.default.Event();
	
	    function setSelectedRowIds(rowIds) {
	      if (selectedRowIds.join(',') == rowIds.join(',')) {
	        return;
	      }
	
	      selectedRowIds = rowIds;
	
	      onSelectedRowIdsChanged.notify({
	        'grid': grid,
	        'ids': selectedRowIds,
	        'dataView': self
	      }, new _slick2.default.EventData(), self);
	    }
	
	    function update() {
	      if (selectedRowIds.length > 0) {
	        inHandler = true;
	        var selectedRows = self.mapIdsToRows(selectedRowIds);
	        if (!preserveHidden) {
	          setSelectedRowIds(self.mapRowsToIds(selectedRows));
	        }
	        grid.setSelectedRows(selectedRows);
	        inHandler = false;
	      }
	    }
	
	    grid.onSelectedRowsChanged.subscribe(function (e, args) {
	      if (inHandler) {
	        return;
	      }
	      var newSelectedRowIds = self.mapRowsToIds(grid.getSelectedRows());
	      if (!preserveHiddenOnSelectionChange || !grid.getOptions().multiSelect) {
	        setSelectedRowIds(newSelectedRowIds);
	      } else {
	        // keep the ones that are hidden
	        var existing = _jquery2.default.grep(selectedRowIds, function (id) {
	          return self.getRowById(id) === undefined;
	        });
	        // add the newly selected ones
	        setSelectedRowIds(existing.concat(newSelectedRowIds));
	      }
	    });
	
	    this.onRowsChanged.subscribe(update);
	
	    this.onRowCountChanged.subscribe(update);
	
	    return onSelectedRowIdsChanged;
	  }
	
	  function syncGridCellCssStyles(grid, key) {
	    var hashById = void 0;
	    var inHandler = void 0;
	
	    // since this method can be called after the cell styles have been set,
	    // get the existing ones right away
	    storeCellCssStyles(grid.getCellCssStyles(key));
	
	    function storeCellCssStyles(hash) {
	      hashById = {};
	      for (var row in hash) {
	        var id = rows[row][idProperty];
	        hashById[id] = hash[row];
	      }
	    }
	
	    function update() {
	      if (hashById) {
	        inHandler = true;
	        ensureRowsByIdCache();
	        var newHash = {};
	        for (var id in hashById) {
	          var row = rowsById[id];
	          if (row != undefined) {
	            newHash[row] = hashById[id];
	          }
	        }
	        grid.setCellCssStyles(key, newHash);
	        inHandler = false;
	      }
	    }
	
	    grid.onCellCssStylesChanged.subscribe(function (e, args) {
	      if (inHandler) {
	        return;
	      }
	      if (key != args.key) {
	        return;
	      }
	      if (args.hash) {
	        storeCellCssStyles(args.hash);
	      }
	    });
	
	    this.onRowsChanged.subscribe(update);
	
	    this.onRowCountChanged.subscribe(update);
	  }
	
	  _jquery2.default.extend(this, {
	    // methods
	    'beginUpdate': beginUpdate,
	    'endUpdate': endUpdate,
	    'setPagingOptions': setPagingOptions,
	    'getPagingInfo': getPagingInfo,
	    'getItems': getItems,
	    'setItems': setItems,
	    'setFilter': setFilter,
	    'sort': sort,
	    'fastSort': fastSort,
	    'reSort': reSort,
	    'setGrouping': setGrouping,
	    'getGrouping': getGrouping,
	    'groupBy': groupBy,
	    'setAggregators': setAggregators,
	    'collapseAllGroups': collapseAllGroups,
	    'expandAllGroups': expandAllGroups,
	    'collapseGroup': collapseGroup,
	    'expandGroup': expandGroup,
	    'getGroups': getGroups,
	    'getIdxById': getIdxById,
	    'getRowById': getRowById,
	    'getItemById': getItemById,
	    'getItemByIdx': getItemByIdx,
	    'mapRowsToIds': mapRowsToIds,
	    'mapIdsToRows': mapIdsToRows,
	    'setRefreshHints': setRefreshHints,
	    'setFilterArgs': setFilterArgs,
	    'refresh': refresh,
	    'updateItem': updateItem,
	    'insertItem': insertItem,
	    'addItem': addItem,
	    'deleteItem': deleteItem,
	    'syncGridSelection': syncGridSelection,
	    'syncGridCellCssStyles': syncGridCellCssStyles,
	
	    // data provider methods
	    'getLength': getLength,
	    'getItem': getItem,
	    'getItemMetadata': getItemMetadata,
	
	    // events
	    'onRowCountChanged': onRowCountChanged,
	    'onRowsChanged': onRowsChanged,
	    'onPagingInfoChanged': onPagingInfoChanged
	  });
	}
	
	function AvgAggregator(field) {
	  this.field_ = field;
	
	  this.init = function () {
	    this.count_ = 0;
	    this.nonNullCount_ = 0;
	    this.sum_ = 0;
	  };
	
	  this.accumulate = function (item) {
	    var val = item[this.field_];
	    this.count_++;
	    if (val != null && val !== '' && !isNaN(val)) {
	      this.nonNullCount_++;
	      this.sum_ += parseFloat(val);
	    }
	  };
	
	  this.storeResult = function (groupTotals) {
	    if (!groupTotals.avg) {
	      groupTotals.avg = {};
	    }
	    if (this.nonNullCount_ != 0) {
	      groupTotals.avg[this.field_] = this.sum_ / this.nonNullCount_;
	    }
	  };
	}
	
	function MinAggregator(field) {
	  this.field_ = field;
	
	  this.init = function () {
	    this.min_ = null;
	  };
	
	  this.accumulate = function (item) {
	    var val = item[this.field_];
	    if (val != null && val !== '' && !isNaN(val)) {
	      if (this.min_ == null || val < this.min_) {
	        this.min_ = val;
	      }
	    }
	  };
	
	  this.storeResult = function (groupTotals) {
	    if (!groupTotals.min) {
	      groupTotals.min = {};
	    }
	    groupTotals.min[this.field_] = this.min_;
	  };
	}
	
	function MaxAggregator(field) {
	  this.field_ = field;
	
	  this.init = function () {
	    this.max_ = null;
	  };
	
	  this.accumulate = function (item) {
	    var val = item[this.field_];
	    if (val != null && val !== '' && !isNaN(val)) {
	      if (this.max_ == null || val > this.max_) {
	        this.max_ = val;
	      }
	    }
	  };
	
	  this.storeResult = function (groupTotals) {
	    if (!groupTotals.max) {
	      groupTotals.max = {};
	    }
	    groupTotals.max[this.field_] = this.max_;
	  };
	}
	
	function SumAggregator(field) {
	  this.field_ = field;
	
	  this.init = function () {
	    this.sum_ = null;
	  };
	
	  this.accumulate = function (item) {
	    var val = item[this.field_];
	    if (val != null && val !== '' && !isNaN(val)) {
	      this.sum_ += parseFloat(val);
	    }
	  };
	
	  this.storeResult = function (groupTotals) {
	    if (!groupTotals.sum) {
	      groupTotals.sum = {};
	    }
	    groupTotals.sum[this.field_] = this.sum_;
	  };
	}

/***/ }),

/***/ 114:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _slick = __webpack_require__(7);
	
	var _slick2 = _interopRequireDefault(_slick);
	
	var _flatpickr = __webpack_require__(143);
	
	var _flatpickr2 = _interopRequireDefault(_flatpickr);
	
	var _jquery = __webpack_require__(8);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var keyCode = _slick2.default.keyCode;
	
	/** *
	 * Contains basic SlickGrid editors.
	 * @module Editors
	 * @namespace Slick
	 */
	
	//import 'flatpickr/dist/flatpickr.min.css';
	
	var Editors = {
	  Text: TextEditor,
	  Integer: IntegerEditor,
	  Float: FloatEditor,
	  Date: DateEditor,
	  YesNoSelect: YesNoSelectEditor,
	  Checkbox: CheckboxEditor,
	  LongText: LongTextEditor
	};
	
	_slick2.default.Editors = Editors;
	exports.default = Editors;
	
	
	function TextEditor(args) {
	  var $input = void 0;
	  var defaultValue = void 0;
	
	  this.init = function () {
	    $input = (0, _jquery2.default)("<INPUT type=text class='editor-text' />").appendTo(args.container).bind('keydown.nav', function (e) {
	      if (e.keyCode === keyCode.LEFT || e.keyCode === keyCode.RIGHT) {
	        e.stopImmediatePropagation();
	      }
	    }).focus().select();
	  };
	
	  this.destroy = function () {
	    $input.remove();
	  };
	
	  this.focus = function () {
	    $input.focus();
	  };
	
	  this.getValue = function () {
	    return $input.val();
	  };
	
	  this.setValue = function (val) {
	    $input.val(val);
	  };
	
	  this.loadValue = function (item) {
	    defaultValue = item[args.column.field] || '';
	    $input.val(defaultValue);
	    $input[0].defaultValue = defaultValue;
	    $input.select();
	  };
	
	  this.serializeValue = function () {
	    return $input.val();
	  };
	
	  this.applyValue = function (item, state) {
	    item[args.column.field] = state;
	  };
	
	  this.isValueChanged = function () {
	    return !($input.val() == '' && defaultValue == null) && $input.val() != defaultValue;
	  };
	
	  this.validate = function () {
	    var valid = true;
	    var msg = null;
	    if (args.column.validator) {
	      var validationResults = args.column.validator($input.val(), args);
	      valid = validationResults.valid;
	      msg = validationResults.msg;
	    }
	
	    return {
	      valid: true,
	      msg: null
	    };
	  };
	
	  this.init();
	}
	
	function IntegerEditor(args) {
	  var $input = void 0;
	  var defaultValue = void 0;
	
	  this.init = function () {
	    $input = (0, _jquery2.default)("<INPUT type=text class='editor-text' />");
	
	    $input.bind('keydown.nav', function (e) {
	      if (e.keyCode === keyCode.LEFT || e.keyCode === keyCode.RIGHT) {
	        e.stopImmediatePropagation();
	      }
	    });
	
	    $input.appendTo(args.container);
	    $input.focus().select();
	  };
	
	  this.destroy = function () {
	    $input.remove();
	  };
	
	  this.focus = function () {
	    $input.focus();
	  };
	
	  this.loadValue = function (item) {
	    defaultValue = item[args.column.field];
	    $input.val(defaultValue);
	    $input[0].defaultValue = defaultValue;
	    $input.select();
	  };
	
	  this.serializeValue = function () {
	    return parseInt($input.val(), 10) || 0;
	  };
	
	  this.applyValue = function (item, state) {
	    item[args.column.field] = state;
	  };
	
	  this.isValueChanged = function () {
	    return !($input.val() == '' && defaultValue == null) && $input.val() != defaultValue;
	  };
	
	  this.validate = function () {
	    if (isNaN($input.val())) {
	      return {
	        valid: false,
	        msg: 'Please enter a valid integer'
	      };
	    }
	
	    if (args.column.validator) {
	      var validationResults = args.column.validator($input.val());
	      if (!validationResults.valid) {
	        return validationResults;
	      }
	    }
	
	    return {
	      valid: true,
	      msg: null
	    };
	  };
	
	  this.init();
	}
	
	function FloatEditor(args) {
	  var $input = void 0;
	  var defaultValue = void 0;
	  var scope = this;
	
	  this.init = function () {
	    $input = (0, _jquery2.default)("<INPUT type=text class='editor-text' />");
	
	    $input.bind('keydown.nav', function (e) {
	      if (e.keyCode === keyCode.LEFT || e.keyCode === keyCode.RIGHT) {
	        e.stopImmediatePropagation();
	      }
	    });
	
	    $input.appendTo(args.container);
	    $input.focus().select();
	  };
	
	  this.destroy = function () {
	    $input.remove();
	  };
	
	  this.focus = function () {
	    $input.focus();
	  };
	
	  function getDecimalPlaces() {
	    // returns the number of fixed decimal places or null
	    var rtn = args.column.editorFixedDecimalPlaces;
	    if (typeof rtn == 'undefined') {
	      rtn = FloatEditor.DefaultDecimalPlaces;
	    }
	    return !rtn && rtn !== 0 ? null : rtn;
	  }
	
	  this.loadValue = function (item) {
	    defaultValue = item[args.column.field];
	
	    var decPlaces = getDecimalPlaces();
	    if (decPlaces !== null && (defaultValue || defaultValue === 0) && defaultValue.toFixed) {
	      defaultValue = defaultValue.toFixed(decPlaces);
	    }
	
	    $input.val(defaultValue);
	    $input[0].defaultValue = defaultValue;
	    $input.select();
	  };
	
	  this.serializeValue = function () {
	    var rtn = parseFloat($input.val()) || 0;
	
	    var decPlaces = getDecimalPlaces();
	    if (decPlaces !== null && (rtn || rtn === 0) && rtn.toFixed) {
	      rtn = parseFloat(rtn.toFixed(decPlaces));
	    }
	
	    return rtn;
	  };
	
	  this.applyValue = function (item, state) {
	    item[args.column.field] = state;
	  };
	
	  this.isValueChanged = function () {
	    return !($input.val() == '' && defaultValue == null) && $input.val() != defaultValue;
	  };
	
	  this.validate = function () {
	    if (isNaN($input.val())) {
	      return {
	        valid: false,
	        msg: 'Please enter a valid number'
	      };
	    }
	
	    if (args.column.validator) {
	      var validationResults = args.column.validator($input.val(), args);
	      if (!validationResults.valid) {
	        return validationResults;
	      }
	    }
	
	    return {
	      valid: true,
	      msg: null
	    };
	  };
	
	  this.init();
	}
	
	FloatEditor.DefaultDecimalPlaces = null;
	
	/**
	 * see https://chmln.github.io/flatpickr/#options - pass as column.options.date = {}
	 * @param args
	 * @constructor
	 */
	function DateEditor(args) {
	  var $input = void 0,
	      flatInstance = void 0,
	      defaultDate = void 0,
	      options = args.column.options && args.column.options.date ? args.column.options.date : {};
	
	  this.init = function () {
	    defaultDate = options.defaultDate = args.item[args.column.field];
	
	    $input = (0, _jquery2.default)('<input type=text data-default-date="' + defaultDate + '" class="editor-text" />');
	    $input.appendTo(args.container);
	    $input.focus().val(defaultDate).select();
	    flatInstance = (0, _flatpickr2.default)($input[0], options);
	  };
	
	  this.destroy = function () {
	    flatInstance.destroy();
	    $input.remove();
	  };
	
	  this.show = function () {
	    flatInstance.open();
	    flatInstance.positionCalendar();
	  };
	
	  this.hide = function () {
	    flatInstance.close();
	  };
	
	  this.position = function (position) {
	    //todo: fix how scrolling is affected
	    flatInstance.positionCalendar();
	  };
	
	  this.focus = function () {
	    $input.focus();
	  };
	
	  this.loadValue = function (item) {
	    defaultDate = item[args.column.field];
	    $input.val(defaultDate);
	    $input.select();
	  };
	
	  this.serializeValue = function () {
	    return $input.val();
	  };
	
	  this.applyValue = function (item, state) {
	    item[args.column.field] = state;
	  };
	
	  this.isValueChanged = function () {
	    return !($input.val() == '' && defaultDate == null) && $input.val() != defaultDate;
	  };
	
	  this.validate = function () {
	    if (args.column.validator) {
	      var validationResults = args.column.validator($input.val(), args);
	      if (!validationResults.valid) {
	        return validationResults;
	      }
	    }
	
	    return {
	      valid: true,
	      msg: null
	    };
	  };
	
	  this.init();
	}
	
	function YesNoSelectEditor(args) {
	  var $select = void 0;
	  var defaultValue = void 0;
	  var scope = this;
	
	  this.init = function () {
	    $select = (0, _jquery2.default)("<select tabIndex='0' class='editor-yesno'><option value='yes'>Yes</option><option value='no'>No</option></select>");
	    $select.appendTo(args.container);
	    $select.focus();
	  };
	
	  this.destroy = function () {
	    $select.remove();
	  };
	
	  this.focus = function () {
	    $select.focus();
	  };
	
	  this.loadValue = function (item) {
	    $select.val((defaultValue = item[args.column.field]) ? 'yes' : 'no');
	    $select.select();
	  };
	
	  this.serializeValue = function () {
	    return $select.val() == 'yes';
	  };
	
	  this.applyValue = function (item, state) {
	    item[args.column.field] = state;
	  };
	
	  this.isValueChanged = function () {
	    return $select.val() != defaultValue;
	  };
	
	  this.validate = function () {
	    var valid = true;
	    var msg = null;
	    if (args.column.validator) {
	      var validationResults = args.column.validator($select.val(), args);
	      valid = validationResults.valid;
	      msg = validationResults.msg;
	    }
	
	    return {
	      valid: true,
	      msg: null
	    };
	  };
	
	  this.init();
	}
	
	function CheckboxEditor(args) {
	  var $select = void 0;
	  var defaultValue = void 0;
	  var scope = this;
	
	  this.init = function () {
	    $select = (0, _jquery2.default)("<INPUT type=checkbox value='true' class='editor-checkbox' hideFocus>");
	    $select.appendTo(args.container);
	    $select.focus();
	  };
	
	  this.destroy = function () {
	    $select.remove();
	  };
	
	  this.focus = function () {
	    $select.focus();
	  };
	
	  this.loadValue = function (item) {
	    defaultValue = !!item[args.column.field];
	    if (defaultValue) {
	      $select.prop('checked', true);
	    } else {
	      $select.prop('checked', false);
	    }
	  };
	
	  this.serializeValue = function () {
	    return $select.prop('checked');
	  };
	
	  this.applyValue = function (item, state) {
	    item[args.column.field] = state;
	  };
	
	  this.isValueChanged = function () {
	    return this.serializeValue() !== defaultValue;
	  };
	
	  this.validate = function () {
	    var valid = true;
	    var msg = null;
	    if (args.column.validator) {
	      var validationResults = args.column.validator($select.val(), args);
	      valid = validationResults.valid;
	      msg = validationResults.msg;
	    }
	
	    return {
	      valid: true,
	      msg: null
	    };
	  };
	
	  this.init();
	}
	
	function PercentCompleteEditor(args) {
	  console.error('PercentCompleteEditor is derecated');
	}
	
	/*
	 * An example of a "detached" editor.
	 * The UI is added onto document BODY and .position(), .show() and .hide() are implemented.
	 * KeyDown events are also handled to provide handling for Tab, Shift-Tab, Esc and Ctrl-Enter.
	 */
	function LongTextEditor(args) {
	  var $input = void 0,
	      $wrapper = void 0;
	  var defaultValue = void 0;
	  var scope = this;
	
	  this.init = function () {
	    var $container = (0, _jquery2.default)('body');
	
	    $wrapper = (0, _jquery2.default)("<div class='slick-large-editor-text' />").appendTo($container);
	    $input = (0, _jquery2.default)("<textarea hidefocus rows=5 />").appendTo($wrapper);
	
	    (0, _jquery2.default)("<div><button>Save</button> <button>Cancel</button></div>").appendTo($wrapper);
	
	    $wrapper.find('button:first').bind('click', this.save);
	    $wrapper.find('button:last').bind('click', this.cancel);
	    $input.bind('keydown', this.handleKeyDown);
	
	    scope.position(args.position);
	    $input.focus().select();
	  };
	
	  this.handleKeyDown = function (e) {
	    if (e.which == keyCode.ENTER && e.ctrlKey) {
	      scope.save();
	    } else if (e.which == keyCode.ESCAPE) {
	      e.preventDefault();
	      scope.cancel();
	    } else if (e.which == keyCode.TAB && e.shiftKey) {
	      e.preventDefault();
	      args.grid.navigatePrev();
	    } else if (e.which == keyCode.TAB) {
	      e.preventDefault();
	      args.grid.navigateNext();
	    }
	  };
	
	  this.save = function () {
	    args.commitChanges();
	  };
	
	  this.cancel = function () {
	    $input.val(defaultValue);
	    args.cancelChanges();
	  };
	
	  this.hide = function () {
	    $wrapper.hide();
	  };
	
	  this.show = function () {
	    $wrapper.show();
	  };
	
	  this.position = function (position) {
	    $wrapper.css('top', position.top - 5).css('left', position.left - 5);
	  };
	
	  this.destroy = function () {
	    $wrapper.remove();
	  };
	
	  this.focus = function () {
	    $input.focus();
	  };
	
	  this.loadValue = function (item) {
	    $input.val(defaultValue = item[args.column.field]);
	    $input.select();
	  };
	
	  this.serializeValue = function () {
	    return $input.val();
	  };
	
	  this.applyValue = function (item, state) {
	    item[args.column.field] = state;
	  };
	
	  this.isValueChanged = function () {
	    return !($input.val() == '' && defaultValue == null) && $input.val() != defaultValue;
	  };
	
	  this.validate = function () {
	    var valid = true;
	    var msg = null;
	    if (args.column.validator) {
	      var validationResults = args.column.validator($select.val(), args);
	      valid = validationResults.valid;
	      msg = validationResults.msg;
	    }
	
	    return {
	      valid: true,
	      msg: null
	    };
	  };
	
	  this.init();
	}

/***/ }),

/***/ 115:
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	function PercentCompleteFormatter(row, cell, value, columnDef, dataContext) {
	  if (value == null || value === '') {
	    return '-';
	  } else if (value < 50) {
	    return '<span style=\'color:red;font-weight:bold;\'>' + value + '%</span>';
	  } else {
	    return '<span style=\'color:green\'>' + value + '%</span>';
	  }
	}
	
	function PercentCompleteBarFormatter(row, cell, value, columnDef, dataContext) {
	  if (value == null || value === '') {
	    return '';
	  }
	
	  var color = void 0;
	
	  if (value < 30) {
	    color = 'red';
	  } else if (value < 70) {
	    color = 'silver';
	  } else {
	    color = 'green';
	  }
	
	  return "<span class='percent-complete-bar' style='background:" + color + ';width:' + value + "%'></span>";
	}
	
	function YesNoFormatter(row, cell, value, columnDef, dataContext) {
	  return value ? 'Yes' : 'No';
	}
	
	function CheckmarkFormatter(row, cell, value, columnDef, dataContext) {
	  return value ? '✔' : '';
	}
	
	exports.default = {
	  PercentComplete: PercentCompleteFormatter,
	  PercentCompleteBar: PercentCompleteBarFormatter,
	  YesNo: YesNoFormatter,
	  Checkmark: CheckmarkFormatter
	};

/***/ }),

/***/ 116:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _jquery = __webpack_require__(8);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _interact = __webpack_require__(54);
	
	var _interact2 = _interopRequireDefault(_interact);
	
	var _slick = __webpack_require__(7);
	
	var _slick2 = _interopRequireDefault(_slick);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// Slick.Grid globals pretense
	_slick2.default.Grid = SlickGrid; /**
	                                   * @license
	                                   * (c) 2009-2013 Michael Leibman
	                                   * michael{dot}leibman{at}gmail{dot}com
	                                   * http://github.com/mleibman/slickgrid
	                                   *
	                                   * Distributed under MIT license.
	                                   * All rights reserved.
	                                   *
	                                   * SlickGrid v2.2
	                                   *
	                                   * NOTES:
	                                   *     Cell/row DOM manipulations are done directly bypassing jQuery's DOM manipulation methods.
	                                   *     This increases the speed dramatically, but can only be done safely because there are no event handlers
	                                   *     or data associated with any cell/row DOM nodes.  Cell editors must make sure they implement .destroy()
	                                   *     and do proper cleanup.
	                                   */
	
	exports.default = SlickGrid;
	
	// shared across all grids on the page
	
	var scrollbarDimensions;
	var maxSupportedCssHeight; // browser's breaking point
	
	// ////////////////////////////////////////////////////////////////////////////////////////////
	// SlickGrid class implementation (available as Slick.Grid)
	
	/**
	 * Creates a new instance of the grid.
	 * @class SlickGrid
	 * @constructor
	 * @param {Node}              container   Container node to create the grid in.
	 * @param {Array,Object}      data        An array of objects for databinding.
	 * @param {Array}             columns     An array of column definitions.
	 * @param {Object}            options     Grid options.
	 **/
	function SlickGrid(container, data, columns, options) {
	  // settings
	  var defaults = {
	    explicitInitialization: false,
	    rowHeight: 25,
	    defaultColumnWidth: 80,
	    enableAddRow: false,
	    leaveSpaceForNewRows: false,
	    editable: false,
	    autoEdit: true,
	    enableCellNavigation: true,
	    enableColumnReorder: true,
	    asyncEditorLoading: false,
	    asyncEditorLoadDelay: 100,
	    forceFitColumns: false,
	    enableAsyncPostRender: false,
	    asyncPostRenderDelay: 50,
	    enableAsyncPostRenderCleanup: false,
	    asyncPostRenderCleanupDelay: 40,
	    autoHeight: false,
	    editorLock: _slick2.default.GlobalEditorLock,
	    showHeaderRow: false,
	    headerRowHeight: 25,
	    createFooterRow: false,
	    showFooterRow: false,
	    footerRowHeight: 25,
	    showTopPanel: false,
	    topPanelHeight: 25,
	    formatterFactory: null,
	    editorFactory: null,
	    cellFlashingCssClass: 'flashing',
	    selectedCellCssClass: 'selected',
	    multiSelect: true,
	    enableTextSelectionOnCells: false,
	    dataItemColumnValueExtractor: null,
	    fullWidthRows: false,
	    multiColumnSort: false,
	    defaultFormatter: defaultFormatter,
	    forceSyncScrolling: false,
	    addNewRowCssClass: 'new-row'
	  };
	
	  var columnDefaults = {
	    name: '',
	    resizable: true,
	    sortable: false,
	    minWidth: 30,
	    rerenderOnResize: false,
	    headerCssClass: null,
	    defaultSortAsc: true,
	    focusable: true,
	    selectable: true
	  };
	
	  // scroller
	  var th; // virtual height
	  var h; // real scrollable height
	  var ph; // page height
	  var n; // number of pages
	  var cj; // "jumpiness" coefficient
	
	  var page = 0; // current page
	  var offset = 0; // current page offset
	  var vScrollDir = 1;
	
	  // private
	  var initialized = false;
	  var $container;
	  var uid = 'slickgrid_' + Math.round(1000000 * Math.random());
	  var self = this;
	  var $focusSink, $focusSink2;
	  var $headerScroller;
	  var $headers;
	  var $headerRow, $headerRowScroller, $headerRowSpacer;
	  var $footerRow, $footerRowScroller, $footerRowSpacer;
	  var $topPanelScroller;
	  var $topPanel;
	  var $viewport;
	  var $canvas;
	  var $style;
	  var $boundAncestors;
	  var stylesheet, columnCssRulesL, columnCssRulesR;
	  var viewportH, viewportW;
	  var canvasWidth;
	  var viewportHasHScroll, viewportHasVScroll;
	  var headerColumnWidthDiff = 0,
	      headerColumnHeightDiff = 0,
	      // border+padding
	  cellWidthDiff = 0,
	      cellHeightDiff = 0,
	      jQueryNewWidthBehaviour = false;
	  var absoluteColumnMinWidth;
	
	  var tabbingDirection = 1;
	  var activePosX;
	  var activeRow, activeCell;
	  var activeCellNode = null;
	  var currentEditor = null;
	  var serializedEditorValue;
	  var editController;
	
	  var rowsCache = {};
	  var renderedRows = 0;
	  var numVisibleRows;
	  var prevScrollTop = 0;
	  var scrollTop = 0;
	  var lastRenderedScrollTop = 0;
	  var lastRenderedScrollLeft = 0;
	  var prevScrollLeft = 0;
	  var scrollLeft = 0;
	
	  var selectionModel;
	  var selectedRows = [];
	
	  var plugins = [];
	  var cellCssClasses = {};
	
	  var columnsById = {};
	  var sortColumns = [];
	  var columnPosLeft = [];
	  var columnPosRight = [];
	
	  // async call handles
	  var h_editorLoader = null;
	  var h_render = null;
	  var h_postrender = null;
	  var h_postrenderCleanup = null;
	  var postProcessedRows = {};
	  var postProcessToRow = null;
	  var postProcessFromRow = null;
	  var postProcessedCleanupQueue = [];
	  var postProcessgroupId = 0;
	
	  // perf counters
	  var counter_rows_rendered = 0;
	  var counter_rows_removed = 0;
	
	  // These two variables work around a bug with inertial scrolling in Webkit/Blink on Mac.
	  // See http://crbug.com/312427.
	  var rowNodeFromLastMouseWheelEvent; // this node must not be deleted while inertial scrolling
	  var zombieRowNodeFromLastMouseWheelEvent; // node that was hidden instead of getting deleted
	  var zombieRowCacheFromLastMouseWheelEvent; // row cache for above node
	  var zombieRowPostProcessedFromLastMouseWheelEvent; // post processing references for above node
	
	  // store css attributes if display:none is active in container or parent
	  var cssShow = { position: 'absolute', visibility: 'hidden', display: 'block' };
	  var $hiddenParents;
	  var oldProps = [];
	
	  // ////////////////////////////////////////////////////////////////////////////////////////////
	  // Initialization
	
	  function init() {
	    $container = (0, _jquery2.default)(container);
	    if ($container.length < 1) {
	      throw new Error('SlickGrid requires a valid container, ' + container + ' does not exist in the DOM.');
	    }
	
	    cacheCssForHiddenInit();
	
	    // calculate these only once and share between grid instances
	    maxSupportedCssHeight = maxSupportedCssHeight || getMaxSupportedCssHeight();
	    scrollbarDimensions = scrollbarDimensions || measureScrollbar();
	
	    options = _jquery2.default.extend({}, defaults, options);
	    validateAndEnforceOptions();
	    columnDefaults.width = options.defaultColumnWidth;
	
	    columnsById = {};
	    for (var i = 0; i < columns.length; i++) {
	      var m = columns[i] = _jquery2.default.extend({}, columnDefaults, columns[i]);
	      columnsById[m.id] = i;
	      if (m.minWidth && m.width < m.minWidth) {
	        m.width = m.minWidth;
	      }
	      if (m.maxWidth && m.width > m.maxWidth) {
	        m.width = m.maxWidth;
	      }
	    }
	
	    editController = {
	      'commitCurrentEdit': commitCurrentEdit,
	      'cancelCurrentEdit': cancelCurrentEdit
	    };
	
	    $container.empty().css('overflow', 'hidden').css('outline', 0).addClass(uid).addClass('ui-widget');
	
	    // set up a positioning container if needed
	    if (!/relative|absolute|fixed/.test($container.css('position'))) {
	      $container.css('position', 'relative');
	    }
	
	    $focusSink = (0, _jquery2.default)("<div tabIndex='0' hideFocus style='position:fixed;width:0;height:0;top:0;left:0;outline:0;'></div>").appendTo($container);
	
	    $headerScroller = (0, _jquery2.default)("<div class='slick-header ui-state-default' style='overflow:hidden;position:relative;' />").appendTo($container);
	    $headers = (0, _jquery2.default)("<div class='slick-header-columns' />").appendTo($headerScroller);
	    $headers.width(getHeadersWidth());
	
	    $headerRowScroller = (0, _jquery2.default)("<div class='slick-headerrow ui-state-default' style='overflow:hidden;position:relative;' />").appendTo($container);
	    $headerRow = (0, _jquery2.default)("<div class='slick-headerrow-columns' />").appendTo($headerRowScroller);
	    $headerRowSpacer = (0, _jquery2.default)("<div style='display:block;height:1px;position:absolute;top:0;left:0;'></div>").css('width', getCanvasWidth() + scrollbarDimensions.width + 'px').appendTo($headerRowScroller);
	
	    $topPanelScroller = (0, _jquery2.default)("<div class='slick-top-panel-scroller ui-state-default' style='overflow:hidden;position:relative;' />").appendTo($container);
	    $topPanel = (0, _jquery2.default)("<div class='slick-top-panel' style='width:10000px' />").appendTo($topPanelScroller);
	
	    if (!options.showTopPanel) {
	      $topPanelScroller.hide();
	    }
	
	    if (!options.showHeaderRow) {
	      $headerRowScroller.hide();
	    }
	
	    $viewport = (0, _jquery2.default)("<div class='slick-viewport' style='width:100%;overflow:auto;outline:0;position:relative;;'>").appendTo($container);
	    $viewport.css('overflow-y', options.autoHeight ? 'hidden' : 'auto');
	
	    $canvas = (0, _jquery2.default)("<div class='grid-canvas' />").appendTo($viewport);
	
	    if (options.createFooterRow) {
	      $footerRowScroller = (0, _jquery2.default)("<div class='slick-footerrow ui-state-default' style='overflow:hidden;position:relative;' />").appendTo($container);
	      $footerRow = (0, _jquery2.default)("<div class='slick-footerrow-columns' />").appendTo($footerRowScroller);
	      $footerRowSpacer = (0, _jquery2.default)("<div style='display:block;height:1px;position:absolute;top:0;left:0;'></div>").css('width', getCanvasWidth() + scrollbarDimensions.width + 'px').appendTo($footerRowScroller);
	
	      if (!options.showFooterRow) {
	        $footerRowScroller.hide();
	      }
	    }
	
	    $focusSink2 = $focusSink.clone().appendTo($container);
	
	    if (!options.explicitInitialization) {
	      finishInitialization();
	    }
	  }
	
	  function finishInitialization() {
	    if (!initialized) {
	      initialized = true;
	
	      viewportW = parseFloat(_jquery2.default.css($container[0], 'width', true));
	
	      // header columns and cells may have different padding/border skewing width calculations (box-sizing, hello?)
	      // calculate the diff so we can set consistent sizes
	      measureCellPaddingAndBorder();
	
	      // for usability reasons, all text selection in SlickGrid is disabled
	      // with the exception of input and textarea elements (selection must
	      // be enabled there so that editors work as expected); note that
	      // selection in grid cells (grid body) is already unavailable in
	      // all browsers except IE
	      disableSelection($headers); // disable all text selection in header (including input and textarea)
	
	      if (!options.enableTextSelectionOnCells) {
	        // disable text selection in grid cells except in input and textarea elements
	        // (this is IE-specific, because selectstart event will only fire in IE)
	        $viewport.bind('selectstart.ui', function (event) {
	          return (0, _jquery2.default)(event.target).is('input,textarea');
	        });
	      }
	
	      updateColumnCaches();
	      createColumnHeaders();
	      setupColumnSort();
	      createCssRules();
	      resizeCanvas();
	      bindAncestorScrollEvents();
	
	      $container.bind('resize.slickgrid', resizeCanvas);
	      $viewport
	      // .bind("click", handleClick)
	      .bind('scroll', handleScroll);
	      $headerScroller.bind('contextmenu', handleHeaderContextMenu).bind('click', handleHeaderClick).delegate('.slick-header-column', 'mouseenter', handleHeaderMouseEnter).delegate('.slick-header-column', 'mouseleave', handleHeaderMouseLeave);
	      $headerRowScroller.bind('scroll', handleHeaderRowScroll);
	
	      if (options.createFooterRow) {
	        $footerRowScroller.bind('scroll', handleFooterRowScroll);
	      }
	
	      $focusSink.add($focusSink2).bind('keydown', handleKeyDown);
	      $canvas.bind('keydown', handleKeyDown).bind('click', handleClick).bind('dblclick', handleDblClick).bind('contextmenu', handleContextMenu).delegate('.slick-cell', 'mouseenter', handleMouseEnter).delegate('.slick-cell', 'mouseleave', handleMouseLeave);
	
	      // legacy support for drag events
	      (0, _interact2.default)($canvas[0]).allowFrom('div.slick-cell').draggable({
	        onmove: handleDrag,
	        onstart: handleDragStart,
	        onend: handleDragEnd
	      }).styleCursor(false);
	
	      // Work around http://crbug.com/312427.
	      if (navigator.userAgent.toLowerCase().match(/webkit/) && navigator.userAgent.toLowerCase().match(/macintosh/)) {
	        $canvas.bind('mousewheel', handleMouseWheel);
	      }
	      restoreCssFromHiddenInit();
	    }
	  }
	
	  function cacheCssForHiddenInit() {
	    // handle display:none on container or container parents
	    $hiddenParents = $container.parents().addBack().not(':visible');
	    $hiddenParents.each(function () {
	      var old = {};
	      for (var name in cssShow) {
	        old[name] = this.style[name];
	        this.style[name] = cssShow[name];
	      }
	      oldProps.push(old);
	    });
	  }
	
	  function restoreCssFromHiddenInit() {
	    // finish handle display:none on container or container parents
	    // - put values back the way they were
	    $hiddenParents.each(function (i) {
	      var old = oldProps[i];
	      for (var name in cssShow) {
	        this.style[name] = old[name];
	      }
	    });
	  }
	
	  function registerPlugin(plugin) {
	    plugins.unshift(plugin);
	    plugin.init(self);
	  }
	
	  function unregisterPlugin(plugin) {
	    for (var i = plugins.length; i >= 0; i--) {
	      if (plugins[i] === plugin) {
	        if (plugins[i].destroy) {
	          plugins[i].destroy();
	        }
	        plugins.splice(i, 1);
	        break;
	      }
	    }
	  }
	
	  function setSelectionModel(model) {
	    if (selectionModel) {
	      selectionModel.onSelectedRangesChanged.unsubscribe(handleSelectedRangesChanged);
	      if (selectionModel.destroy) {
	        selectionModel.destroy();
	      }
	    }
	
	    selectionModel = model;
	    if (selectionModel) {
	      selectionModel.init(self);
	      selectionModel.onSelectedRangesChanged.subscribe(handleSelectedRangesChanged);
	    }
	  }
	
	  function getSelectionModel() {
	    return selectionModel;
	  }
	
	  function getCanvasNode() {
	    return $canvas[0];
	  }
	
	  function measureScrollbar() {
	    var $c = (0, _jquery2.default)("<div style='position:absolute; top:-10000px; left:-10000px; width:100px; height:100px; overflow:scroll;'></div>").appendTo('body');
	    var dim = {
	      width: $c.width() - $c[0].clientWidth,
	      height: $c.height() - $c[0].clientHeight
	    };
	    $c.remove();
	    return dim;
	  }
	
	  function getHeadersWidth() {
	    var headersWidth = 0;
	    for (var i = 0, ii = columns.length; i < ii; i++) {
	      var width = columns[i].width;
	      headersWidth += width;
	    }
	    headersWidth += scrollbarDimensions.width;
	    return Math.max(headersWidth, viewportW) + 1000;
	  }
	
	  function getCanvasWidth() {
	    var availableWidth = viewportHasVScroll ? viewportW - scrollbarDimensions.width : viewportW;
	    var rowWidth = 0;
	    var i = columns.length;
	    while (i--) {
	      rowWidth += columns[i].width;
	    }
	    return options.fullWidthRows ? Math.max(rowWidth, availableWidth) : rowWidth;
	  }
	
	  function updateCanvasWidth(forceColumnWidthsUpdate) {
	    var oldCanvasWidth = canvasWidth;
	    canvasWidth = getCanvasWidth();
	
	    if (canvasWidth != oldCanvasWidth) {
	      $canvas.width(canvasWidth);
	      $headerRow.width(canvasWidth);
	      if (options.createFooterRow) {
	        $footerRow.width(canvasWidth);
	      }
	      $headers.width(getHeadersWidth());
	      viewportHasHScroll = canvasWidth > viewportW - scrollbarDimensions.width;
	    }
	
	    var w = canvasWidth + (viewportHasVScroll ? scrollbarDimensions.width : 0);
	    $headerRowSpacer.width(w);
	    if (options.createFooterRow) {
	      $footerRowSpacer.width(w);
	    }
	
	    if (canvasWidth != oldCanvasWidth || forceColumnWidthsUpdate) {
	      applyColumnWidths();
	    }
	  }
	
	  function disableSelection($target) {
	    if ($target && $target.jquery) {
	      $target.attr('unselectable', 'on').css('MozUserSelect', 'none').bind('selectstart.ui', function () {
	        return false;
	      }); // from jquery:ui.core.js 1.7.2
	    }
	  }
	
	  function getMaxSupportedCssHeight() {
	    var supportedHeight = 1000000;
	    // FF reports the height back but still renders blank after ~6M px
	    var testUpTo = navigator.userAgent.toLowerCase().match(/firefox/) ? 6000000 : 1000000000;
	    var div = (0, _jquery2.default)("<div style='display:none' />").appendTo(document.body);
	
	    while (true) {
	      var test = supportedHeight * 2;
	      div.css('height', test);
	      if (test > testUpTo || div.height() !== test) {
	        break;
	      } else {
	        supportedHeight = test;
	      }
	    }
	
	    div.remove();
	    return supportedHeight;
	  }
	
	  // TODO:  this is static.  need to handle page mutation.
	  function bindAncestorScrollEvents() {
	    var elem = $canvas[0];
	    while ((elem = elem.parentNode) != document.body && elem != null) {
	      // bind to scroll containers only
	      if (elem == $viewport[0] || elem.scrollWidth != elem.clientWidth || elem.scrollHeight != elem.clientHeight) {
	        var $elem = (0, _jquery2.default)(elem);
	        if (!$boundAncestors) {
	          $boundAncestors = $elem;
	        } else {
	          $boundAncestors = $boundAncestors.add($elem);
	        }
	        $elem.bind('scroll.' + uid, handleActiveCellPositionChange);
	      }
	    }
	  }
	
	  function unbindAncestorScrollEvents() {
	    if (!$boundAncestors) {
	      return;
	    }
	    $boundAncestors.unbind('scroll.' + uid);
	    $boundAncestors = null;
	  }
	
	  function updateColumnHeader(columnId, title, toolTip) {
	    if (!initialized) {
	      return;
	    }
	    var idx = getColumnIndex(columnId);
	    if (idx == null) {
	      return;
	    }
	
	    var columnDef = columns[idx];
	    var $header = $headers.children().eq(idx);
	    if ($header) {
	      if (title !== undefined) {
	        columns[idx].name = title;
	      }
	      if (toolTip !== undefined) {
	        columns[idx].toolTip = toolTip;
	      }
	
	      trigger(self.onBeforeHeaderCellDestroy, {
	        'node': $header[0],
	        'column': columnDef,
	        'grid': self
	      });
	
	      $header.attr('title', toolTip || '').children().eq(0).html(title);
	
	      trigger(self.onHeaderCellRendered, {
	        'node': $header[0],
	        'column': columnDef,
	        'grid': self
	      });
	    }
	  }
	
	  function getHeaderRow() {
	    return $headerRow[0];
	  }
	
	  function getFooterRow() {
	    return $footerRow[0];
	  }
	
	  function getHeaderRowColumn(columnId) {
	    var idx = getColumnIndex(columnId);
	    var $header = $headerRow.children().eq(idx);
	    return $header && $header[0];
	  }
	
	  function getFooterRowColumn(columnId) {
	    var idx = getColumnIndex(columnId);
	    var $footer = $footerRow.children().eq(idx);
	    return $footer && $footer[0];
	  }
	
	  function createColumnHeaders() {
	    function onMouseEnter() {
	      (0, _jquery2.default)(this).addClass('ui-state-hover');
	    }
	
	    function onMouseLeave() {
	      (0, _jquery2.default)(this).removeClass('ui-state-hover');
	    }
	
	    $headers.find('.slick-header-column').each(function () {
	      var columnDef = (0, _jquery2.default)(this).data('column');
	      if (columnDef) {
	        trigger(self.onBeforeHeaderCellDestroy, {
	          'node': this,
	          'column': columnDef,
	          'grid': self
	        });
	      }
	    });
	    $headers.empty();
	    $headers.width(getHeadersWidth());
	
	    $headerRow.find('.slick-headerrow-column').each(function () {
	      var columnDef = (0, _jquery2.default)(this).data('column');
	      if (columnDef) {
	        trigger(self.onBeforeHeaderRowCellDestroy, {
	          'node': this,
	          'column': columnDef,
	          'grid': self
	        });
	      }
	    });
	    $headerRow.empty();
	
	    if (options.createFooterRow) {
	      $footerRow.find('.slick-footerrow-column').each(function () {
	        var columnDef = (0, _jquery2.default)(this).data('column');
	        if (columnDef) {
	          trigger(self.onBeforeFooterRowCellDestroy, {
	            'node': this,
	            'column': columnDef
	          });
	        }
	      });
	      $footerRow.empty();
	    }
	
	    for (var i = 0; i < columns.length; i++) {
	      var m = columns[i];
	
	      var header = (0, _jquery2.default)("<div class='ui-state-default slick-header-column' />").html("<span class='slick-column-name'>" + m.name + '</span>').width(m.width - headerColumnWidthDiff).attr('id', '' + uid + m.id).attr('title', m.toolTip || '').data('column', m).addClass(m.headerCssClass || '').appendTo($headers);
	
	      if (options.enableColumnReorder || m.sortable) {
	        header.on('mouseenter', onMouseEnter).on('mouseleave', onMouseLeave);
	      }
	
	      if (m.sortable) {
	        header.addClass('slick-header-sortable');
	        header.append("<span class='slick-sort-indicator' />");
	      }
	
	      trigger(self.onHeaderCellRendered, {
	        'node': header[0],
	        'column': m,
	        'grid': self
	      });
	
	      if (options.showHeaderRow) {
	        var headerRowCell = (0, _jquery2.default)("<div class='ui-state-default slick-headerrow-column l" + i + ' r' + i + "'></div>").data('column', m).appendTo($headerRow);
	
	        trigger(self.onHeaderRowCellRendered, {
	          'node': headerRowCell[0],
	          'column': m,
	          'grid': self
	        });
	      }
	      if (options.createFooterRow && options.showFooterRow) {
	        var footerRowCell = (0, _jquery2.default)("<div class='ui-state-default slick-footerrow-column l" + i + ' r' + i + "'></div>").data('column', m).appendTo($footerRow);
	
	        trigger(self.onFooterRowCellRendered, {
	          'node': footerRowCell[0],
	          'column': m
	        });
	      }
	    }
	
	    setSortColumns(sortColumns);
	    setupColumnResize();
	    if (options.enableColumnReorder) {
	      setupColumnReorder();
	    }
	  }
	
	  function setupColumnSort() {
	    $headers.click(function (e) {
	      // temporary workaround for a bug in jQuery 1.7.1 (http://bugs.jquery.com/ticket/11328)
	      e.metaKey = e.metaKey || e.ctrlKey;
	
	      if ((0, _jquery2.default)(e.target).hasClass('slick-resizable-handle')) {
	        return;
	      }
	
	      var $col = (0, _jquery2.default)(e.target).closest('.slick-header-column');
	      if (!$col.length) {
	        return;
	      }
	
	      var column = $col.data('column');
	      if (column.sortable) {
	        if (!getEditorLock().commitCurrentEdit()) {
	          return;
	        }
	
	        var sortOpts = null;
	        var i = 0;
	        for (; i < sortColumns.length; i++) {
	          if (sortColumns[i].columnId == column.id) {
	            sortOpts = sortColumns[i];
	            sortOpts.sortAsc = !sortOpts.sortAsc;
	            break;
	          }
	        }
	
	        if (e.metaKey && options.multiColumnSort) {
	          if (sortOpts) {
	            sortColumns.splice(i, 1);
	          }
	        } else {
	          if (!e.shiftKey && !e.metaKey || !options.multiColumnSort) {
	            sortColumns = [];
	          }
	
	          if (!sortOpts) {
	            sortOpts = { columnId: column.id, sortAsc: column.defaultSortAsc };
	            sortColumns.push(sortOpts);
	          } else if (sortColumns.length == 0) {
	            sortColumns.push(sortOpts);
	          }
	        }
	
	        setSortColumns(sortColumns);
	
	        if (!options.multiColumnSort) {
	          trigger(self.onSort, {
	            multiColumnSort: false,
	            sortCol: column,
	            sortAsc: sortOpts.sortAsc,
	            grid: self
	          }, e);
	        } else {
	          trigger(self.onSort, {
	            multiColumnSort: true,
	            sortCols: _jquery2.default.map(sortColumns, function (col) {
	              return { sortCol: columns[getColumnIndex(col.columnId)], sortAsc: col.sortAsc };
	            }),
	            grid: self
	          }, e);
	        }
	      }
	    });
	  }
	
	  /**
	   * Refactored to use interactjs
	   */
	  function setupColumnReorder() {
	    var x = 0;
	    var delta = 0;
	    var placeholder = document.createElement('div');
	
	    placeholder.className = 'interact-placeholder';
	
	    (0, _interact2.default)('.slick-header-column').ignoreFrom('.slick-resizable-handle').draggable({
	      inertia: true,
	      // keep the element within the area of it's parent
	      restrict: {
	        restriction: 'parent',
	        endOnly: true,
	        elementRect: { top: 0, left: 0, bottom: 0, right: 0 }
	      },
	      // enable autoScroll
	      autoScroll: true,
	      axis: 'x',
	      onstart: function onstart(event) {
	        x = 0;
	        delta = event.target.offsetWidth;
	
	        // get old order
	        $headers.find('.slick-header-column').each(function (index) {
	          (0, _jquery2.default)(this).data('index', index);
	        });
	
	        placeholder.style.height = event.target.offsetHeight + 'px';
	        placeholder.style.width = delta + 'px';
	
	        (0, _jquery2.default)(event.target).after(placeholder).css({
	          position: 'absolute',
	          zIndex: 1000,
	          marginLeft: (0, _jquery2.default)(event.target).position().left
	        });
	      },
	
	      onmove: function onmove(event) {
	        x += event.dx;
	        event.target.style.transform = 'translate3d(' + x + 'px, -3px, 100px)';
	        // event.target.style.marginLeft = x + 'px';
	      },
	
	      onend: function onend(event) {
	        x = 0;
	        delta = 0;
	        (0, _jquery2.default)(event.target).css({
	          position: 'relative',
	          zIndex: '',
	          marginLeft: 0,
	          transform: 'none'
	        });
	
	        placeholder.parentNode.removeChild(placeholder);
	        var newColumns = [];
	
	        $headers.find('.slick-header-column').each(function (index) {
	          newColumns.push(columns[(0, _jquery2.default)(this).data('index')]);
	          (0, _jquery2.default)(this).removeData('index');
	        });
	
	        setColumns(newColumns);
	        trigger(self.onColumnsReordered, { grid: self });
	        setupColumnResize();
	      }
	    }).dropzone({
	      accept: '.slick-header-column',
	
	      ondragenter: function ondragenter(event) {
	        event.target.classList.add('interact-drop-active');
	        event.relatedTarget.classList.add('interact-can-drop');
	      },
	
	      ondragleave: function ondragleave(event) {
	        event.target.classList.remove('interact-drop-active');
	        event.relatedTarget.classList.remove('interact-can-drop');
	      },
	
	      ondrop: function ondrop(event) {
	        event.target.classList.remove('interact-drop-active');
	        event.relatedTarget.classList.remove('interact-can-drop');
	        (0, _jquery2.default)(event.target)[x > 0 ? 'after' : 'before'](event.relatedTarget);
	      }
	    }).styleCursor(false);
	  }
	
	  function setupColumnResize() {
	    var $col, j, c, pageX, columnElements, minPageX, maxPageX, firstResizable, lastResizable;
	    columnElements = $headers.children();
	    columnElements.find('.slick-resizable-handle').remove();
	    columnElements.each(function (i, e) {
	      if (columns[i].resizable) {
	        if (firstResizable === undefined) {
	          firstResizable = i;
	        }
	        lastResizable = i;
	      }
	    });
	    if (firstResizable === undefined) {
	      return;
	    }
	    columnElements.each(function (i, element) {
	      if (i < firstResizable || options.forceFitColumns && i >= lastResizable) {
	        return;
	      }
	      $col = (0, _jquery2.default)(element);
	
	      var $handle = (0, _jquery2.default)("<div class='slick-resizable-handle' />");
	      $handle.appendTo(element);
	
	      if ($col.data('resizable')) return;
	
	      var activeColumn = columns[i];
	      if (activeColumn.resizable) {
	        $col.data('resizable', true);
	        (0, _interact2.default)(element).resizable({
	          preserveAspectRatio: false,
	          edges: { left: true, right: true, bottom: false, top: false }
	        }).on('resizestart', function (event) {
	          if (!getEditorLock().commitCurrentEdit()) {
	            return false;
	          }
	          activeColumn.previousWidth = event.rect.width;
	          event.target.classList.add('slick-header-column-active');
	        }).on('resizemove', function (event) {
	          var x = event.dx;
	          var width = activeColumn.width += x;
	
	          if (activeColumn.minWidth > 0 && activeColumn.minWidth > width) width = activeColumn.minWidth;else if (activeColumn.maxWidth > 0 && activeColumn.maxWidth < width) width = activeColumn.maxWidth;
	
	          activeColumn.width = width;
	
	          if (options.forceFitColumns) {
	            autosizeColumns();
	          }
	          applyColumnHeaderWidths();
	          if (options.syncColumnCellResize) {
	            applyColumnWidths();
	          }
	        }).on('resizeend', function (event) {
	          event.target.classList.remove('slick-header-column-active');
	          invalidateAllRows();
	          updateCanvasWidth(true);
	          render();
	          trigger(self.onColumnsResized, { grid: self });
	        });
	      }
	    });
	  }
	
	  function getVBoxDelta($el) {
	    var p = ['borderTopWidth', 'borderBottomWidth', 'paddingTop', 'paddingBottom'];
	    var delta = 0;
	    _jquery2.default.each(p, function (n, val) {
	      delta += parseFloat($el.css(val)) || 0;
	    });
	    return delta;
	  }
	
	  function measureCellPaddingAndBorder() {
	    var el;
	    var h = ['borderLeftWidth', 'borderRightWidth', 'paddingLeft', 'paddingRight'];
	    var v = ['borderTopWidth', 'borderBottomWidth', 'paddingTop', 'paddingBottom'];
	
	    // jquery prior to version 1.8 handles .width setter/getter as a direct css write/read
	    // jquery 1.8 changed .width to read the true inner element width if box-sizing is set to border-box, and introduced a setter for .outerWidth
	    // so for equivalent functionality, prior to 1.8 use .width, and after use .outerWidth
	    var verArray = _jquery2.default.fn.jquery.split('.');
	    jQueryNewWidthBehaviour = verArray[0] == 1 && verArray[1] >= 8 || verArray[0] >= 2;
	
	    el = (0, _jquery2.default)("<div class='ui-state-default slick-header-column' style='visibility:hidden'>-</div>").appendTo($headers);
	    headerColumnWidthDiff = headerColumnHeightDiff = 0;
	    if (el.css('box-sizing') != 'border-box' && el.css('-moz-box-sizing') != 'border-box' && el.css('-webkit-box-sizing') != 'border-box') {
	      _jquery2.default.each(h, function (n, val) {
	        headerColumnWidthDiff += parseFloat(el.css(val)) || 0;
	      });
	      _jquery2.default.each(v, function (n, val) {
	        headerColumnHeightDiff += parseFloat(el.css(val)) || 0;
	      });
	    }
	    el.remove();
	
	    var r = (0, _jquery2.default)("<div class='slick-row' />").appendTo($canvas);
	    el = (0, _jquery2.default)("<div class='slick-cell' id='' style='visibility:hidden'>-</div>").appendTo(r);
	    cellWidthDiff = cellHeightDiff = 0;
	    if (el.css('box-sizing') != 'border-box' && el.css('-moz-box-sizing') != 'border-box' && el.css('-webkit-box-sizing') != 'border-box') {
	      _jquery2.default.each(h, function (n, val) {
	        cellWidthDiff += parseFloat(el.css(val)) || 0;
	      });
	      _jquery2.default.each(v, function (n, val) {
	        cellHeightDiff += parseFloat(el.css(val)) || 0;
	      });
	    }
	    r.remove();
	
	    absoluteColumnMinWidth = Math.max(headerColumnWidthDiff, cellWidthDiff);
	  }
	
	  function createCssRules() {
	    $style = (0, _jquery2.default)("<style type='text/css' rel='stylesheet' />").appendTo((0, _jquery2.default)('head'));
	    var rowHeight = options.rowHeight - cellHeightDiff;
	    var rules = ['.' + uid + ' .slick-header-column { left: 0; }', '.' + uid + ' .slick-top-panel { height:' + options.topPanelHeight + 'px; }', '.' + uid + ' .slick-headerrow-columns { height:' + options.headerRowHeight + 'px; }', '.' + uid + ' .slick-footerrow-columns { height:' + options.footerRowHeight + 'px; }', '.' + uid + ' .slick-cell { height:' + rowHeight + 'px; }', '.' + uid + ' .slick-row { height:' + options.rowHeight + 'px; }'];
	
	    for (var i = 0; i < columns.length; i++) {
	      rules.push('.' + uid + ' .l' + i + ' { }');
	      rules.push('.' + uid + ' .r' + i + ' { }');
	    }
	
	    if ($style[0].styleSheet) {
	      // IE
	      $style[0].styleSheet.cssText = rules.join(' ');
	    } else {
	      $style[0].appendChild(document.createTextNode(rules.join(' ')));
	    }
	  }
	
	  function getColumnCssRules(idx) {
	    if (!stylesheet) {
	      var sheets = document.styleSheets;
	      for (var i = 0; i < sheets.length; i++) {
	        if ((sheets[i].ownerNode || sheets[i].owningElement) == $style[0]) {
	          stylesheet = sheets[i];
	          break;
	        }
	      }
	
	      if (!stylesheet) {
	        throw new Error('Cannot find stylesheet.');
	      }
	
	      // find and cache column CSS rules
	      columnCssRulesL = [];
	      columnCssRulesR = [];
	      var cssRules = stylesheet.cssRules || stylesheet.rules;
	      var matches, columnIdx;
	      for (var i = 0; i < cssRules.length; i++) {
	        var selector = cssRules[i].selectorText;
	        if (matches = /\.l\d+/.exec(selector)) {
	          columnIdx = parseInt(matches[0].substr(2, matches[0].length - 2), 10);
	          columnCssRulesL[columnIdx] = cssRules[i];
	        } else if (matches = /\.r\d+/.exec(selector)) {
	          columnIdx = parseInt(matches[0].substr(2, matches[0].length - 2), 10);
	          columnCssRulesR[columnIdx] = cssRules[i];
	        }
	      }
	    }
	
	    return {
	      'left': columnCssRulesL[idx],
	      'right': columnCssRulesR[idx]
	    };
	  }
	
	  function removeCssRules() {
	    $style.remove();
	    stylesheet = null;
	  }
	
	  function destroy() {
	    getEditorLock().cancelCurrentEdit();
	
	    trigger(self.onBeforeDestroy, { grid: self });
	
	    var i = plugins.length;
	    while (i--) {
	      unregisterPlugin(plugins[i]);
	    }
	
	    unbindAncestorScrollEvents();
	    $container.unbind('.slickgrid');
	    removeCssRules();
	
	    $container.empty().removeClass(uid);
	  }
	
	  // ////////////////////////////////////////////////////////////////////////////////////////////
	  // General
	
	  function trigger(evt, args, e) {
	    e = e || new _slick2.default.EventData();
	    args = args || {};
	    args.grid = self;
	    return evt.notify(args, e, self);
	  }
	
	  function getEditorLock() {
	    return options.editorLock;
	  }
	
	  function getEditController() {
	    return editController;
	  }
	
	  function getColumnIndex(id) {
	    return columnsById[id];
	  }
	
	  function autosizeColumns() {
	    var i,
	        c,
	        widths = [],
	        shrinkLeeway = 0,
	        total = 0,
	        prevTotal,
	        availWidth = viewportHasVScroll ? viewportW - scrollbarDimensions.width : viewportW;
	
	    for (i = 0; i < columns.length; i++) {
	      c = columns[i];
	      widths.push(c.width);
	      total += c.width;
	      if (c.resizable) {
	        shrinkLeeway += c.width - Math.max(c.minWidth, absoluteColumnMinWidth);
	      }
	    }
	
	    // shrink
	    prevTotal = total;
	    while (total > availWidth && shrinkLeeway) {
	      var shrinkProportion = (total - availWidth) / shrinkLeeway;
	      for (i = 0; i < columns.length && total > availWidth; i++) {
	        c = columns[i];
	        var width = widths[i];
	        if (!c.resizable || width <= c.minWidth || width <= absoluteColumnMinWidth) {
	          continue;
	        }
	        var absMinWidth = Math.max(c.minWidth, absoluteColumnMinWidth);
	        var shrinkSize = Math.floor(shrinkProportion * (width - absMinWidth)) || 1;
	        shrinkSize = Math.min(shrinkSize, width - absMinWidth);
	        total -= shrinkSize;
	        shrinkLeeway -= shrinkSize;
	        widths[i] -= shrinkSize;
	      }
	      if (prevTotal <= total) {
	        // avoid infinite loop
	        break;
	      }
	      prevTotal = total;
	    }
	
	    // grow
	    prevTotal = total;
	    while (total < availWidth) {
	      var growProportion = availWidth / total;
	      for (i = 0; i < columns.length && total < availWidth; i++) {
	        c = columns[i];
	        var currentWidth = widths[i];
	        var growSize;
	
	        if (!c.resizable || c.maxWidth <= currentWidth) {
	          growSize = 0;
	        } else {
	          growSize = Math.min(Math.floor(growProportion * currentWidth) - currentWidth, c.maxWidth - currentWidth || 1000000) || 1;
	        }
	        total += growSize;
	        widths[i] += total <= availWidth ? growSize : 0;
	      }
	      if (prevTotal >= total) {
	        // avoid infinite loop
	        break;
	      }
	      prevTotal = total;
	    }
	
	    var reRender = false;
	    for (i = 0; i < columns.length; i++) {
	      if (columns[i].rerenderOnResize && columns[i].width != widths[i]) {
	        reRender = true;
	      }
	      columns[i].width = widths[i];
	    }
	
	    applyColumnHeaderWidths();
	    updateCanvasWidth(true);
	    if (reRender) {
	      invalidateAllRows();
	      render();
	    }
	  }
	
	  function applyColumnHeaderWidths() {
	    if (!initialized) {
	      return;
	    }
	    var h;
	    for (var i = 0, headers = $headers.children('[id]'), ii = headers.length; i < ii; i++) {
	      h = (0, _jquery2.default)(headers[i]);
	      if (jQueryNewWidthBehaviour) {
	        if (h.outerWidth() !== columns[i].width) {
	          h.outerWidth(columns[i].width);
	        }
	      } else {
	        if (h.width() !== columns[i].width - headerColumnWidthDiff) {
	          h.width(columns[i].width - headerColumnWidthDiff);
	        }
	      }
	    }
	
	    updateColumnCaches();
	  }
	
	  function applyColumnWidths() {
	    var x = 0,
	        w,
	        rule;
	    for (var i = 0; i < columns.length; i++) {
	      w = columns[i].width;
	
	      rule = getColumnCssRules(i);
	      rule.left.style.left = x + 'px';
	      rule.right.style.right = canvasWidth - x - w + 'px';
	
	      x += columns[i].width;
	    }
	  }
	
	  function setSortColumn(columnId, ascending) {
	    setSortColumns([{ columnId: columnId, sortAsc: ascending }]);
	  }
	
	  function setSortColumns(cols) {
	    sortColumns = cols;
	
	    var headerColumnEls = $headers.children();
	    headerColumnEls.removeClass('slick-header-column-sorted').find('.slick-sort-indicator').removeClass('slick-sort-indicator-asc slick-sort-indicator-desc');
	
	    _jquery2.default.each(sortColumns, function (i, col) {
	      if (col.sortAsc == null) {
	        col.sortAsc = true;
	      }
	      var columnIndex = getColumnIndex(col.columnId);
	      if (columnIndex != null) {
	        headerColumnEls.eq(columnIndex).addClass('slick-header-column-sorted').find('.slick-sort-indicator').addClass(col.sortAsc ? 'slick-sort-indicator-asc' : 'slick-sort-indicator-desc');
	      }
	    });
	  }
	
	  function getSortColumns() {
	    return sortColumns;
	  }
	
	  function handleSelectedRangesChanged(e, ranges) {
	    selectedRows = [];
	    var hash = {};
	    for (var i = 0; i < ranges.length; i++) {
	      for (var j = ranges[i].fromRow; j <= ranges[i].toRow; j++) {
	        if (!hash[j]) {
	          // prevent duplicates
	          selectedRows.push(j);
	          hash[j] = {};
	        }
	        for (var k = ranges[i].fromCell; k <= ranges[i].toCell; k++) {
	          if (canCellBeSelected(j, k)) {
	            hash[j][columns[k].id] = options.selectedCellCssClass;
	          }
	        }
	      }
	    }
	
	    setCellCssStyles(options.selectedCellCssClass, hash);
	
	    trigger(self.onSelectedRowsChanged, { rows: getSelectedRows(), grid: self }, e);
	  }
	
	  function getColumns() {
	    return columns;
	  }
	
	  function updateColumnCaches() {
	    // Pre-calculate cell boundaries.
	    columnPosLeft = [];
	    columnPosRight = [];
	    var x = 0;
	    for (var i = 0, ii = columns.length; i < ii; i++) {
	      columnPosLeft[i] = x;
	      columnPosRight[i] = x + columns[i].width;
	      x += columns[i].width;
	    }
	  }
	
	  function setColumns(columnDefinitions) {
	    columns = columnDefinitions;
	
	    columnsById = {};
	    for (var i = 0; i < columns.length; i++) {
	      var m = columns[i] = _jquery2.default.extend({}, columnDefaults, columns[i]);
	      columnsById[m.id] = i;
	      if (m.minWidth && m.width < m.minWidth) {
	        m.width = m.minWidth;
	      }
	      if (m.maxWidth && m.width > m.maxWidth) {
	        m.width = m.maxWidth;
	      }
	    }
	
	    updateColumnCaches();
	
	    if (initialized) {
	      invalidateAllRows();
	      createColumnHeaders();
	      removeCssRules();
	      createCssRules();
	      resizeCanvas();
	      applyColumnWidths();
	      handleScroll();
	    }
	  }
	
	  function getOptions() {
	    return options;
	  }
	
	  function setOptions(args) {
	    if (!getEditorLock().commitCurrentEdit()) {
	      return;
	    }
	
	    makeActiveCellNormal();
	
	    if (options.enableAddRow !== args.enableAddRow) {
	      invalidateRow(getDataLength());
	    }
	
	    options = _jquery2.default.extend(options, args);
	    validateAndEnforceOptions();
	
	    $viewport.css('overflow-y', options.autoHeight ? 'hidden' : 'auto');
	    render();
	  }
	
	  function validateAndEnforceOptions() {
	    if (options.autoHeight) {
	      options.leaveSpaceForNewRows = false;
	    }
	  }
	
	  function setData(newData, scrollToTop) {
	    data = newData;
	    invalidateAllRows();
	    updateRowCount();
	    if (scrollToTop) {
	      scrollTo(0);
	    }
	  }
	
	  function getData() {
	    return data;
	  }
	
	  function getDataLength() {
	    if (data.getLength) {
	      return data.getLength();
	    } else {
	      return data.length;
	    }
	  }
	
	  function getDataLengthIncludingAddNew() {
	    return getDataLength() + (options.enableAddRow ? 1 : 0);
	  }
	
	  function getDataItem(i) {
	    if (data.getItem) {
	      return data.getItem(i);
	    } else {
	      return data[i];
	    }
	  }
	
	  function getTopPanel() {
	    return $topPanel[0];
	  }
	
	  function setTopPanelVisibility(visible) {
	    if (options.showTopPanel != visible) {
	      options.showTopPanel = visible;
	      if (visible) {
	        $topPanelScroller.slideDown('fast', resizeCanvas);
	      } else {
	        $topPanelScroller.slideUp('fast', resizeCanvas);
	      }
	    }
	  }
	
	  function setHeaderRowVisibility(visible) {
	    if (options.showHeaderRow != visible) {
	      options.showHeaderRow = visible;
	      if (visible) {
	        $headerRowScroller.slideDown('fast', resizeCanvas);
	      } else {
	        $headerRowScroller.slideUp('fast', resizeCanvas);
	      }
	    }
	  }
	
	  function setFooterRowVisibility(visible) {
	    if (options.showFooterRow != visible) {
	      options.showFooterRow = visible;
	      if (visible) {
	        $footerRowScroller.slideDown('fast', resizeCanvas);
	      } else {
	        $footerRowScroller.slideUp('fast', resizeCanvas);
	      }
	    }
	  }
	
	  function getContainerNode() {
	    return $container.get(0);
	  }
	
	  // ////////////////////////////////////////////////////////////////////////////////////////////
	  // Rendering / Scrolling
	
	  function getRowTop(row) {
	    return options.rowHeight * row - offset;
	  }
	
	  function getRowFromPosition(y) {
	    return Math.floor((y + offset) / options.rowHeight);
	  }
	
	  function scrollTo(y) {
	    y = Math.max(y, 0);
	    y = Math.min(y, th - viewportH + (viewportHasHScroll ? scrollbarDimensions.height : 0));
	
	    var oldOffset = offset;
	
	    page = Math.min(n - 1, Math.floor(y / ph));
	    offset = Math.round(page * cj);
	    var newScrollTop = y - offset;
	
	    if (offset != oldOffset) {
	      var range = getVisibleRange(newScrollTop);
	      cleanupRows(range);
	      updateRowPositions();
	    }
	
	    if (prevScrollTop != newScrollTop) {
	      vScrollDir = prevScrollTop + oldOffset < newScrollTop + offset ? 1 : -1;
	      $viewport[0].scrollTop = lastRenderedScrollTop = scrollTop = prevScrollTop = newScrollTop;
	
	      trigger(self.onViewportChanged, { grid: self });
	    }
	  }
	
	  function defaultFormatter(row, cell, value, columnDef, dataContext) {
	    if (value == null) {
	      return '';
	    } else {
	      return (value + '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	    }
	  }
	
	  function getFormatter(row, column) {
	    var rowMetadata = data.getItemMetadata && data.getItemMetadata(row);
	
	    // look up by id, then index
	    var columnOverrides = rowMetadata && rowMetadata.columns && (rowMetadata.columns[column.id] || rowMetadata.columns[getColumnIndex(column.id)]);
	
	    return columnOverrides && columnOverrides.formatter || rowMetadata && rowMetadata.formatter || column.formatter || options.formatterFactory && options.formatterFactory.getFormatter(column) || options.defaultFormatter;
	  }
	
	  function getEditor(row, cell) {
	    var column = columns[cell];
	    var rowMetadata = data.getItemMetadata && data.getItemMetadata(row);
	    var columnMetadata = rowMetadata && rowMetadata.columns;
	
	    if (columnMetadata && columnMetadata[column.id] && columnMetadata[column.id].editor !== undefined) {
	      return columnMetadata[column.id].editor;
	    }
	    if (columnMetadata && columnMetadata[cell] && columnMetadata[cell].editor !== undefined) {
	      return columnMetadata[cell].editor;
	    }
	
	    return column.editor || options.editorFactory && options.editorFactory.getEditor(column);
	  }
	
	  function getDataItemValueForColumn(item, columnDef) {
	    if (options.dataItemColumnValueExtractor) {
	      return options.dataItemColumnValueExtractor(item, columnDef);
	    }
	    return item[columnDef.field];
	  }
	
	  function appendRowHtml(stringArray, row, range, dataLength) {
	    var d = getDataItem(row);
	    var dataLoading = row < dataLength && !d;
	    var rowCss = 'slick-row' + (dataLoading ? ' loading' : '') + (row === activeRow ? ' active' : '') + (row % 2 == 1 ? ' odd' : ' even');
	
	    if (!d) {
	      rowCss += ' ' + options.addNewRowCssClass;
	    }
	
	    var metadata = data.getItemMetadata && data.getItemMetadata(row);
	
	    if (metadata && metadata.cssClasses) {
	      rowCss += ' ' + metadata.cssClasses;
	    }
	
	    stringArray.push("<div class='ui-widget-content " + rowCss + "' style='top:" + getRowTop(row) + "px'>");
	
	    var colspan, m;
	    for (var i = 0, ii = columns.length; i < ii; i++) {
	      m = columns[i];
	      colspan = 1;
	      if (metadata && metadata.columns) {
	        var columnData = metadata.columns[m.id] || metadata.columns[i];
	        colspan = columnData && columnData.colspan || 1;
	        if (colspan === '*') {
	          colspan = ii - i;
	        }
	      }
	
	      // Do not render cells outside of the viewport.
	      if (columnPosRight[Math.min(ii - 1, i + colspan - 1)] > range.leftPx) {
	        if (columnPosLeft[i] > range.rightPx) {
	          // All columns to the right are outside the range.
	          break;
	        }
	
	        appendCellHtml(stringArray, row, i, colspan, d);
	      }
	
	      if (colspan > 1) {
	        i += colspan - 1;
	      }
	    }
	
	    stringArray.push('</div>');
	  }
	
	  function appendCellHtml(stringArray, row, cell, colspan, item) {
	    // stringArray: stringBuilder containing the HTML parts
	    // row, cell: row and column index
	    // colspan: HTML colspan
	    // item: grid data for row
	
	    var m = columns[cell];
	    var cellCss = 'slick-cell l' + cell + ' r' + Math.min(columns.length - 1, cell + colspan - 1) + (m.cssClass ? ' ' + m.cssClass : '');
	    if (row === activeRow && cell === activeCell) {
	      cellCss += ' active';
	    }
	
	    // TODO:  merge them together in the setter
	    for (var key in cellCssClasses) {
	      if (cellCssClasses[key][row] && cellCssClasses[key][row][m.id]) {
	        cellCss += ' ' + cellCssClasses[key][row][m.id];
	      }
	    }
	
	    stringArray.push("<div class='" + cellCss + "'>");
	
	    // if there is a corresponding row (if not, this is the Add New row or this data hasn't been loaded yet)
	    if (item) {
	      var value = getDataItemValueForColumn(item, m);
	      stringArray.push(getFormatter(row, m)(row, cell, value, m, item));
	    }
	
	    stringArray.push('</div>');
	
	    rowsCache[row].cellRenderQueue.push(cell);
	    rowsCache[row].cellColSpans[cell] = colspan;
	  }
	
	  function cleanupRows(rangeToKeep) {
	    for (var i in rowsCache) {
	      if ((i = parseInt(i, 10)) !== activeRow && (i < rangeToKeep.top || i > rangeToKeep.bottom)) {
	        removeRowFromCache(i);
	      }
	    }
	    if (options.enableAsyncPostRenderCleanup) {
	      startPostProcessingCleanup();
	    }
	  }
	
	  function invalidate() {
	    updateRowCount();
	    invalidateAllRows();
	    render();
	  }
	
	  function invalidateAllRows() {
	    if (currentEditor) {
	      makeActiveCellNormal();
	    }
	    for (var row in rowsCache) {
	      removeRowFromCache(row);
	    }
	    if (options.enableAsyncPostRenderCleanup) {
	      startPostProcessingCleanup();
	    }
	  }
	
	  function queuePostProcessedRowForCleanup(cacheEntry, postProcessedRow, rowIdx) {
	    postProcessgroupId++;
	
	    // store and detach node for later async cleanup
	    for (var columnIdx in postProcessedRow) {
	      if (postProcessedRow.hasOwnProperty(columnIdx)) {
	        postProcessedCleanupQueue.push({
	          actionType: 'C',
	          groupId: postProcessgroupId,
	          node: cacheEntry.cellNodesByColumnIdx[columnIdx | 0],
	          columnIdx: columnIdx | 0,
	          rowIdx: rowIdx
	        });
	      }
	    }
	    postProcessedCleanupQueue.push({
	      actionType: 'R',
	      groupId: postProcessgroupId,
	      node: cacheEntry.rowNode
	    });
	    (0, _jquery2.default)(cacheEntry.rowNode).detach();
	  }
	
	  function queuePostProcessedCellForCleanup(cellnode, columnIdx, rowIdx) {
	    postProcessedCleanupQueue.push({
	      actionType: 'C',
	      groupId: postProcessgroupId,
	      node: cellnode,
	      columnIdx: columnIdx,
	      rowIdx: rowIdx
	    });
	    (0, _jquery2.default)(cellnode).detach();
	  }
	
	  function removeRowFromCache(row) {
	    var cacheEntry = rowsCache[row];
	    if (!cacheEntry) {
	      return;
	    }
	
	    if (rowNodeFromLastMouseWheelEvent === cacheEntry.rowNode) {
	      cacheEntry.rowNode.style.display = 'none';
	      zombieRowNodeFromLastMouseWheelEvent = rowNodeFromLastMouseWheelEvent;
	      zombieRowCacheFromLastMouseWheelEvent = cacheEntry;
	      zombieRowPostProcessedFromLastMouseWheelEvent = postProcessedRows[row];
	      // ignore post processing cleanup in this case - it will be dealt with later
	    } else {
	      if (options.enableAsyncPostRenderCleanup && postProcessedRows[row]) {
	        queuePostProcessedRowForCleanup(cacheEntry, postProcessedRows[row], row);
	      } else {
	        $canvas[0].removeChild(cacheEntry.rowNode);
	      }
	    }
	
	    delete rowsCache[row];
	    delete postProcessedRows[row];
	    renderedRows--;
	    counter_rows_removed++;
	  }
	
	  function invalidateRows(rows) {
	    var i, rl;
	    if (!rows || !rows.length) {
	      return;
	    }
	    vScrollDir = 0;
	    for (i = 0, rl = rows.length; i < rl; i++) {
	      if (currentEditor && activeRow === rows[i]) {
	        makeActiveCellNormal();
	      }
	      if (rowsCache[rows[i]]) {
	        removeRowFromCache(rows[i]);
	      }
	    }
	    if (options.enableAsyncPostRenderCleanup) {
	      startPostProcessingCleanup();
	    }
	  }
	
	  function invalidateRow(row) {
	    invalidateRows([row]);
	  }
	
	  function updateCell(row, cell) {
	    var cellNode = getCellNode(row, cell);
	    if (!cellNode) {
	      return;
	    }
	
	    var m = columns[cell],
	        d = getDataItem(row);
	    if (currentEditor && activeRow === row && activeCell === cell) {
	      currentEditor.loadValue(d);
	    } else {
	      cellNode.innerHTML = d ? getFormatter(row, m)(row, cell, getDataItemValueForColumn(d, m), m, d) : '';
	      invalidatePostProcessingResults(row);
	    }
	  }
	
	  function updateRow(row) {
	    var cacheEntry = rowsCache[row];
	    if (!cacheEntry) {
	      return;
	    }
	
	    ensureCellNodesInRowsCache(row);
	
	    var d = getDataItem(row);
	
	    for (var columnIdx in cacheEntry.cellNodesByColumnIdx) {
	      if (!cacheEntry.cellNodesByColumnIdx.hasOwnProperty(columnIdx)) {
	        continue;
	      }
	
	      columnIdx = columnIdx | 0;
	      var m = columns[columnIdx],
	          node = cacheEntry.cellNodesByColumnIdx[columnIdx];
	
	      if (row === activeRow && columnIdx === activeCell && currentEditor) {
	        currentEditor.loadValue(d);
	      } else if (d) {
	        node.innerHTML = getFormatter(row, m)(row, columnIdx, getDataItemValueForColumn(d, m), m, d);
	      } else {
	        node.innerHTML = '';
	      }
	    }
	
	    invalidatePostProcessingResults(row);
	  }
	
	  function getViewportHeight() {
	    return parseFloat(_jquery2.default.css($container[0], 'height', true)) - parseFloat(_jquery2.default.css($container[0], 'paddingTop', true)) - parseFloat(_jquery2.default.css($container[0], 'paddingBottom', true)) - parseFloat(_jquery2.default.css($headerScroller[0], 'height')) - getVBoxDelta($headerScroller) - (options.showTopPanel ? options.topPanelHeight + getVBoxDelta($topPanelScroller) : 0) - (options.showHeaderRow ? options.headerRowHeight + getVBoxDelta($headerRowScroller) : 0) - (options.createFooterRow && options.showFooterRow ? options.footerRowHeight + getVBoxDelta($footerRowScroller) : 0);
	  }
	
	  function resizeCanvas() {
	    if (!initialized) {
	      return;
	    }
	    if (options.autoHeight) {
	      viewportH = options.rowHeight * getDataLengthIncludingAddNew();
	    } else {
	      viewportH = getViewportHeight();
	    }
	
	    numVisibleRows = Math.ceil(viewportH / options.rowHeight);
	    viewportW = parseFloat(_jquery2.default.css($container[0], 'width', true));
	    if (!options.autoHeight) {
	      $viewport.height(viewportH);
	    }
	
	    if (options.forceFitColumns) {
	      autosizeColumns();
	    }
	
	    updateRowCount();
	    handleScroll();
	    // Since the width has changed, force the render() to reevaluate virtually rendered cells.
	    lastRenderedScrollLeft = -1;
	    render();
	  }
	
	  function updateRowCount() {
	    if (!initialized) {
	      return;
	    }
	
	    var dataLengthIncludingAddNew = getDataLengthIncludingAddNew();
	    var numberOfRows = dataLengthIncludingAddNew + (options.leaveSpaceForNewRows ? numVisibleRows - 1 : 0);
	
	    var oldViewportHasVScroll = viewportHasVScroll;
	    // with autoHeight, we do not need to accommodate the vertical scroll bar
	    viewportHasVScroll = !options.autoHeight && numberOfRows * options.rowHeight > viewportH;
	    viewportHasHScroll = canvasWidth > viewportW - scrollbarDimensions.width;
	
	    makeActiveCellNormal();
	
	    // remove the rows that are now outside of the data range
	    // this helps avoid redundant calls to .removeRow() when the size of the data decreased by thousands of rows
	    var l = dataLengthIncludingAddNew - 1;
	    for (var i in rowsCache) {
	      if (i > l) {
	        removeRowFromCache(i);
	      }
	    }
	    if (options.enableAsyncPostRenderCleanup) {
	      startPostProcessingCleanup();
	    }
	
	    if (activeCellNode && activeRow > l) {
	      resetActiveCell();
	    }
	
	    var oldH = h;
	    th = Math.max(options.rowHeight * numberOfRows, viewportH - scrollbarDimensions.height);
	    if (th < maxSupportedCssHeight) {
	      // just one page
	      h = ph = th;
	      n = 1;
	      cj = 0;
	    } else {
	      // break into pages
	      h = maxSupportedCssHeight;
	      ph = h / 100;
	      n = Math.floor(th / ph);
	      cj = (th - h) / (n - 1);
	    }
	
	    if (h !== oldH) {
	      $canvas.css('height', h);
	      scrollTop = $viewport[0].scrollTop;
	    }
	
	    var oldScrollTopInRange = scrollTop + offset <= th - viewportH;
	
	    if (th == 0 || scrollTop == 0) {
	      page = offset = 0;
	    } else if (oldScrollTopInRange) {
	      // maintain virtual position
	      scrollTo(scrollTop + offset);
	    } else {
	      // scroll to bottom
	      scrollTo(th - viewportH);
	    }
	
	    if (h != oldH && options.autoHeight) {
	      resizeCanvas();
	    }
	
	    if (options.forceFitColumns && oldViewportHasVScroll != viewportHasVScroll) {
	      autosizeColumns();
	    }
	    updateCanvasWidth(false);
	  }
	
	  function getVisibleRange(viewportTop, viewportLeft) {
	    if (viewportTop == null) {
	      viewportTop = scrollTop;
	    }
	    if (viewportLeft == null) {
	      viewportLeft = scrollLeft;
	    }
	
	    return {
	      top: getRowFromPosition(viewportTop),
	      bottom: getRowFromPosition(viewportTop + viewportH) + 1,
	      leftPx: viewportLeft,
	      rightPx: viewportLeft + viewportW
	    };
	  }
	
	  function getRenderedRange(viewportTop, viewportLeft) {
	    var range = getVisibleRange(viewportTop, viewportLeft);
	    var buffer = Math.round(viewportH / options.rowHeight);
	    var minBuffer = 3;
	
	    if (vScrollDir == -1) {
	      range.top -= buffer;
	      range.bottom += minBuffer;
	    } else if (vScrollDir == 1) {
	      range.top -= minBuffer;
	      range.bottom += buffer;
	    } else {
	      range.top -= minBuffer;
	      range.bottom += minBuffer;
	    }
	
	    range.top = Math.max(0, range.top);
	    range.bottom = Math.min(getDataLengthIncludingAddNew() - 1, range.bottom);
	
	    range.leftPx -= viewportW;
	    range.rightPx += viewportW;
	
	    range.leftPx = Math.max(0, range.leftPx);
	    range.rightPx = Math.min(canvasWidth, range.rightPx);
	
	    return range;
	  }
	
	  function ensureCellNodesInRowsCache(row) {
	    var cacheEntry = rowsCache[row];
	    if (cacheEntry) {
	      if (cacheEntry.cellRenderQueue.length) {
	        var lastChild = cacheEntry.rowNode.lastChild;
	        while (cacheEntry.cellRenderQueue.length) {
	          var columnIdx = cacheEntry.cellRenderQueue.pop();
	          cacheEntry.cellNodesByColumnIdx[columnIdx] = lastChild;
	          lastChild = lastChild.previousSibling;
	        }
	      }
	    }
	  }
	
	  function cleanUpCells(range, row) {
	    var totalCellsRemoved = 0;
	    var cacheEntry = rowsCache[row];
	
	    // Remove cells outside the range.
	    var cellsToRemove = [];
	    for (var i in cacheEntry.cellNodesByColumnIdx) {
	      // I really hate it when people mess with Array.prototype.
	      if (!cacheEntry.cellNodesByColumnIdx.hasOwnProperty(i)) {
	        continue;
	      }
	
	      // This is a string, so it needs to be cast back to a number.
	      i = i | 0;
	
	      var colspan = cacheEntry.cellColSpans[i];
	      if (columnPosLeft[i] > range.rightPx || columnPosRight[Math.min(columns.length - 1, i + colspan - 1)] < range.leftPx) {
	        if (!(row == activeRow && i == activeCell)) {
	          cellsToRemove.push(i);
	        }
	      }
	    }
	
	    var cellToRemove, node;
	    postProcessgroupId++;
	    while ((cellToRemove = cellsToRemove.pop()) != null) {
	      node = cacheEntry.cellNodesByColumnIdx[cellToRemove];
	      if (options.enableAsyncPostRenderCleanup && postProcessedRows[row] && postProcessedRows[row][cellToRemove]) {
	        queuePostProcessedCellForCleanup(node, cellToRemove, row);
	      } else {
	        cacheEntry.rowNode.removeChild(node);
	      }
	
	      delete cacheEntry.cellColSpans[cellToRemove];
	      delete cacheEntry.cellNodesByColumnIdx[cellToRemove];
	      if (postProcessedRows[row]) {
	        delete postProcessedRows[row][cellToRemove];
	      }
	      totalCellsRemoved++;
	    }
	  }
	
	  function cleanUpAndRenderCells(range) {
	    var cacheEntry;
	    var stringArray = [];
	    var processedRows = [];
	    var cellsAdded;
	    var totalCellsAdded = 0;
	    var colspan;
	
	    for (var row = range.top, btm = range.bottom; row <= btm; row++) {
	      cacheEntry = rowsCache[row];
	      if (!cacheEntry) {
	        continue;
	      }
	
	      // cellRenderQueue populated in renderRows() needs to be cleared first
	      ensureCellNodesInRowsCache(row);
	
	      cleanUpCells(range, row);
	
	      // Render missing cells.
	      cellsAdded = 0;
	
	      var metadata = data.getItemMetadata && data.getItemMetadata(row);
	      metadata = metadata && metadata.columns;
	
	      var d = getDataItem(row);
	
	      // TODO:  shorten this loop (index? heuristics? binary search?)
	      for (var i = 0, ii = columns.length; i < ii; i++) {
	        // Cells to the right are outside the range.
	        if (columnPosLeft[i] > range.rightPx) {
	          break;
	        }
	
	        // Already rendered.
	        if ((colspan = cacheEntry.cellColSpans[i]) != null) {
	          i += colspan > 1 ? colspan - 1 : 0;
	          continue;
	        }
	
	        colspan = 1;
	        if (metadata) {
	          var columnData = metadata[columns[i].id] || metadata[i];
	          colspan = columnData && columnData.colspan || 1;
	          if (colspan === '*') {
	            colspan = ii - i;
	          }
	        }
	
	        if (columnPosRight[Math.min(ii - 1, i + colspan - 1)] > range.leftPx) {
	          appendCellHtml(stringArray, row, i, colspan, d);
	          cellsAdded++;
	        }
	
	        i += colspan > 1 ? colspan - 1 : 0;
	      }
	
	      if (cellsAdded) {
	        totalCellsAdded += cellsAdded;
	        processedRows.push(row);
	      }
	    }
	
	    if (!stringArray.length) {
	      return;
	    }
	
	    var x = document.createElement('div');
	    x.innerHTML = stringArray.join('');
	
	    var processedRow;
	    var node;
	    while ((processedRow = processedRows.pop()) != null) {
	      cacheEntry = rowsCache[processedRow];
	      var columnIdx;
	      while ((columnIdx = cacheEntry.cellRenderQueue.pop()) != null) {
	        node = x.lastChild;
	        cacheEntry.rowNode.appendChild(node);
	        cacheEntry.cellNodesByColumnIdx[columnIdx] = node;
	      }
	    }
	  }
	
	  function renderRows(range) {
	    var parentNode = $canvas[0],
	        stringArray = [],
	        rows = [],
	        needToReselectCell = false,
	        dataLength = getDataLength();
	
	    for (var i = range.top, ii = range.bottom; i <= ii; i++) {
	      if (rowsCache[i]) {
	        continue;
	      }
	      renderedRows++;
	      rows.push(i);
	
	      // Create an entry right away so that appendRowHtml() can
	      // start populatating it.
	      rowsCache[i] = {
	        'rowNode': null,
	
	        // ColSpans of rendered cells (by column idx).
	        // Can also be used for checking whether a cell has been rendered.
	        'cellColSpans': [],
	
	        // Cell nodes (by column idx).  Lazy-populated by ensureCellNodesInRowsCache().
	        'cellNodesByColumnIdx': [],
	
	        // Column indices of cell nodes that have been rendered, but not yet indexed in
	        // cellNodesByColumnIdx.  These are in the same order as cell nodes added at the
	        // end of the row.
	        'cellRenderQueue': []
	      };
	
	      appendRowHtml(stringArray, i, range, dataLength);
	      if (activeCellNode && activeRow === i) {
	        needToReselectCell = true;
	      }
	      counter_rows_rendered++;
	    }
	
	    if (!rows.length) {
	      return;
	    }
	
	    var x = document.createElement('div');
	    x.innerHTML = stringArray.join('');
	
	    for (var i = 0, ii = rows.length; i < ii; i++) {
	      rowsCache[rows[i]].rowNode = parentNode.appendChild(x.firstChild);
	    }
	
	    if (needToReselectCell) {
	      activeCellNode = getCellNode(activeRow, activeCell);
	    }
	  }
	
	  function startPostProcessing() {
	    if (!options.enableAsyncPostRender) {
	      return;
	    }
	    clearTimeout(h_postrender);
	    h_postrender = setTimeout(asyncPostProcessRows, options.asyncPostRenderDelay);
	  }
	
	  function startPostProcessingCleanup() {
	    if (!options.enableAsyncPostRenderCleanup) {
	      return;
	    }
	    clearTimeout(h_postrenderCleanup);
	    h_postrenderCleanup = setTimeout(asyncPostProcessCleanupRows, options.asyncPostRenderCleanupDelay);
	  }
	
	  function invalidatePostProcessingResults(row) {
	    // change status of columns to be re-rendered
	    for (var columnIdx in postProcessedRows[row]) {
	      if (postProcessedRows[row].hasOwnProperty(columnIdx)) {
	        postProcessedRows[row][columnIdx] = 'C';
	      }
	    }
	    postProcessFromRow = Math.min(postProcessFromRow, row);
	    postProcessToRow = Math.max(postProcessToRow, row);
	    startPostProcessing();
	  }
	
	  function updateRowPositions() {
	    for (var row in rowsCache) {
	      rowsCache[row].rowNode.style.top = getRowTop(row) + 'px';
	    }
	  }
	
	  function render() {
	    if (!initialized) {
	      return;
	    }
	    var visible = getVisibleRange();
	    var rendered = getRenderedRange();
	
	    // remove rows no longer in the viewport
	    cleanupRows(rendered);
	
	    // add new rows & missing cells in existing rows
	    if (lastRenderedScrollLeft != scrollLeft) {
	      cleanUpAndRenderCells(rendered);
	    }
	
	    // render missing rows
	    renderRows(rendered);
	
	    postProcessFromRow = visible.top;
	    postProcessToRow = Math.min(getDataLengthIncludingAddNew() - 1, visible.bottom);
	    startPostProcessing();
	
	    lastRenderedScrollTop = scrollTop;
	    lastRenderedScrollLeft = scrollLeft;
	    h_render = null;
	  }
	
	  function handleHeaderRowScroll() {
	    var scrollLeft = $headerRowScroller[0].scrollLeft;
	    if (scrollLeft != $viewport[0].scrollLeft) {
	      $viewport[0].scrollLeft = scrollLeft;
	    }
	  }
	
	  function handleFooterRowScroll() {
	    var scrollLeft = $footerRowScroller[0].scrollLeft;
	    if (scrollLeft != $viewport[0].scrollLeft) {
	      $viewport[0].scrollLeft = scrollLeft;
	    }
	  }
	
	  function handleScroll() {
	    scrollTop = $viewport[0].scrollTop;
	    scrollLeft = $viewport[0].scrollLeft;
	    var vScrollDist = Math.abs(scrollTop - prevScrollTop);
	    var hScrollDist = Math.abs(scrollLeft - prevScrollLeft);
	
	    if (hScrollDist) {
	      prevScrollLeft = scrollLeft;
	      $headerScroller[0].scrollLeft = scrollLeft;
	      $topPanelScroller[0].scrollLeft = scrollLeft;
	      $headerRowScroller[0].scrollLeft = scrollLeft;
	      if (options.createFooterRow) {
	        $footerRowScroller[0].scrollLeft = scrollLeft;
	      }
	    }
	
	    if (vScrollDist) {
	      vScrollDir = prevScrollTop < scrollTop ? 1 : -1;
	      prevScrollTop = scrollTop;
	
	      // switch virtual pages if needed
	      if (vScrollDist < viewportH) {
	        scrollTo(scrollTop + offset);
	      } else {
	        var oldOffset = offset;
	        if (h == viewportH) {
	          page = 0;
	        } else {
	          page = Math.min(n - 1, Math.floor(scrollTop * ((th - viewportH) / (h - viewportH)) * (1 / ph)));
	        }
	        offset = Math.round(page * cj);
	        if (oldOffset != offset) {
	          invalidateAllRows();
	        }
	      }
	    }
	
	    if (hScrollDist || vScrollDist) {
	      if (h_render) {
	        clearTimeout(h_render);
	      }
	
	      if (Math.abs(lastRenderedScrollTop - scrollTop) > 20 || Math.abs(lastRenderedScrollLeft - scrollLeft) > 20) {
	        if (options.forceSyncScrolling || Math.abs(lastRenderedScrollTop - scrollTop) < viewportH && Math.abs(lastRenderedScrollLeft - scrollLeft) < viewportW) {
	          render();
	        } else {
	          h_render = setTimeout(render, 50);
	        }
	
	        trigger(self.onViewportChanged, { grid: self });
	      }
	    }
	
	    trigger(self.onScroll, { scrollLeft: scrollLeft, scrollTop: scrollTop, grid: self });
	  }
	
	  function asyncPostProcessRows() {
	    var dataLength = getDataLength();
	    while (postProcessFromRow <= postProcessToRow) {
	      var row = vScrollDir >= 0 ? postProcessFromRow++ : postProcessToRow--;
	      var cacheEntry = rowsCache[row];
	      if (!cacheEntry || row >= dataLength) {
	        continue;
	      }
	
	      if (!postProcessedRows[row]) {
	        postProcessedRows[row] = {};
	      }
	
	      ensureCellNodesInRowsCache(row);
	      for (var columnIdx in cacheEntry.cellNodesByColumnIdx) {
	        if (!cacheEntry.cellNodesByColumnIdx.hasOwnProperty(columnIdx)) {
	          continue;
	        }
	
	        columnIdx = columnIdx | 0;
	
	        var m = columns[columnIdx];
	        var processedStatus = postProcessedRows[row][columnIdx]; // C=cleanup and re-render, R=rendered
	        if (m.asyncPostRender && processedStatus !== 'R') {
	          var node = cacheEntry.cellNodesByColumnIdx[columnIdx];
	          if (node) {
	            m.asyncPostRender(node, row, getDataItem(row), m, processedStatus === 'C');
	          }
	          postProcessedRows[row][columnIdx] = 'R';
	        }
	      }
	
	      h_postrender = setTimeout(asyncPostProcessRows, options.asyncPostRenderDelay);
	      return;
	    }
	  }
	
	  function asyncPostProcessCleanupRows() {
	    if (postProcessedCleanupQueue.length > 0) {
	      var groupId = postProcessedCleanupQueue[0].groupId;
	
	      // loop through all queue members with this groupID
	      while (postProcessedCleanupQueue.length > 0 && postProcessedCleanupQueue[0].groupId == groupId) {
	        var entry = postProcessedCleanupQueue.shift();
	        if (entry.actionType == 'R') {
	          (0, _jquery2.default)(entry.node).remove();
	        }
	        if (entry.actionType == 'C') {
	          var column = columns[entry.columnIdx];
	          if (column.asyncPostRenderCleanup && entry.node) {
	            // cleanup must also remove element
	            column.asyncPostRenderCleanup(entry.node, entry.rowIdx, column);
	          }
	        }
	      }
	
	      // call this function again after the specified delay
	      h_postrenderCleanup = setTimeout(asyncPostProcessCleanupRows, options.asyncPostRenderCleanupDelay);
	    }
	  }
	
	  function updateCellCssStylesOnRenderedRows(addedHash, removedHash) {
	    var node, columnId, addedRowHash, removedRowHash;
	    for (var row in rowsCache) {
	      removedRowHash = removedHash && removedHash[row];
	      addedRowHash = addedHash && addedHash[row];
	
	      if (removedRowHash) {
	        for (columnId in removedRowHash) {
	          if (!addedRowHash || removedRowHash[columnId] != addedRowHash[columnId]) {
	            node = getCellNode(row, getColumnIndex(columnId));
	            if (node) {
	              (0, _jquery2.default)(node).removeClass(removedRowHash[columnId]);
	            }
	          }
	        }
	      }
	
	      if (addedRowHash) {
	        for (columnId in addedRowHash) {
	          if (!removedRowHash || removedRowHash[columnId] != addedRowHash[columnId]) {
	            node = getCellNode(row, getColumnIndex(columnId));
	            if (node) {
	              (0, _jquery2.default)(node).addClass(addedRowHash[columnId]);
	            }
	          }
	        }
	      }
	    }
	  }
	
	  function addCellCssStyles(key, hash) {
	    if (cellCssClasses[key]) {
	      throw "addCellCssStyles: cell CSS hash with key '" + key + "' already exists.";
	    }
	
	    cellCssClasses[key] = hash;
	    updateCellCssStylesOnRenderedRows(hash, null);
	
	    trigger(self.onCellCssStylesChanged, { 'key': key, 'hash': hash, 'grid': self });
	  }
	
	  function removeCellCssStyles(key) {
	    if (!cellCssClasses[key]) {
	      return;
	    }
	
	    updateCellCssStylesOnRenderedRows(null, cellCssClasses[key]);
	    delete cellCssClasses[key];
	
	    trigger(self.onCellCssStylesChanged, { 'key': key, 'hash': null, 'grid': self });
	  }
	
	  function setCellCssStyles(key, hash) {
	    var prevHash = cellCssClasses[key];
	
	    cellCssClasses[key] = hash;
	    updateCellCssStylesOnRenderedRows(hash, prevHash);
	
	    trigger(self.onCellCssStylesChanged, { 'key': key, 'hash': hash, 'grid': self });
	  }
	
	  function getCellCssStyles(key) {
	    return cellCssClasses[key];
	  }
	
	  function flashCell(row, cell, speed) {
	    speed = speed || 100;
	    if (rowsCache[row]) {
	      var toggleCellClass = function toggleCellClass(times) {
	        if (!times) {
	          return;
	        }
	        setTimeout(function () {
	          $cell.queue(function () {
	            $cell.toggleClass(options.cellFlashingCssClass).dequeue();
	            toggleCellClass(times - 1);
	          });
	        }, speed);
	      };
	
	      var $cell = (0, _jquery2.default)(getCellNode(row, cell));
	
	      toggleCellClass(4);
	    }
	  }
	
	  // ////////////////////////////////////////////////////////////////////////////////////////////
	  // Interactivity
	
	  function handleMouseWheel(e) {
	    var rowNode = (0, _jquery2.default)(e.target).closest('.slick-row')[0];
	    if (rowNode != rowNodeFromLastMouseWheelEvent) {
	      if (zombieRowNodeFromLastMouseWheelEvent && zombieRowNodeFromLastMouseWheelEvent != rowNode) {
	        if (options.enableAsyncPostRenderCleanup && zombieRowPostProcessedFromLastMouseWheelEvent) {
	          queuePostProcessedRowForCleanup(zombieRowCacheFromLastMouseWheelEvent, zombieRowPostProcessedFromLastMouseWheelEvent);
	        } else {
	          $canvas[0].removeChild(zombieRowNodeFromLastMouseWheelEvent);
	        }
	        zombieRowNodeFromLastMouseWheelEvent = null;
	        zombieRowCacheFromLastMouseWheelEvent = null;
	        zombieRowPostProcessedFromLastMouseWheelEvent = null;
	
	        if (options.enableAsyncPostRenderCleanup) {
	          startPostProcessingCleanup();
	        }
	      }
	      rowNodeFromLastMouseWheelEvent = rowNode;
	    }
	  }
	
	  function handleDragStart(interactEvent) {
	    var event = _jquery2.default.Event(interactEvent.originalEvent.type, interactEvent.originalEvent);
	    var cell = getCellFromEvent(event);
	    if (!cell || !cellExists(cell.row, cell.cell)) {
	      return false;
	    }
	
	    var retval = trigger(self.onDragStart, interactEvent, event);
	    if (event.isImmediatePropagationStopped()) {
	      return retval;
	    }
	
	    return false;
	  }
	
	  function handleDrag(interactEvent) {
	    var event = _jquery2.default.Event(interactEvent.originalEvent.type, interactEvent.originalEvent);
	    return trigger(self.onDrag, interactEvent, event);
	  }
	
	  function handleDragEnd(interactEvent) {
	    trigger(self.onDragEnd, interactEvent, _jquery2.default.Event('mousedown'));
	  }
	
	  function handleKeyDown(e) {
	    trigger(self.onKeyDown, { row: activeRow, cell: activeCell, grid: self }, e);
	    var handled = e.isImmediatePropagationStopped();
	    var keyCode = _slick2.default.keyCode;
	
	    if (!handled) {
	      if (!e.shiftKey && !e.altKey && !e.ctrlKey) {
	        // editor may specify an array of keys to bubble
	        if (options.editable && currentEditor && currentEditor.keyCaptureList) {
	          if (currentEditor.keyCaptureList.indexOf(e.which) > -1) {
	            return;
	          }
	        }
	        if (e.which == keyCode.ESCAPE) {
	          if (!getEditorLock().isActive()) {
	            return; // no editing mode to cancel, allow bubbling and default processing (exit without cancelling the event)
	          }
	          cancelEditAndSetFocus();
	        } else if (e.which == keyCode.PAGE_DOWN) {
	          navigatePageDown();
	          handled = true;
	        } else if (e.which == keyCode.PAGE_UP) {
	          navigatePageUp();
	          handled = true;
	        } else if (e.which == keyCode.LEFT) {
	          handled = navigateLeft();
	        } else if (e.which == keyCode.RIGHT) {
	          handled = navigateRight();
	        } else if (e.which == keyCode.UP) {
	          handled = navigateUp();
	        } else if (e.which == keyCode.DOWN) {
	          handled = navigateDown();
	        } else if (e.which == keyCode.TAB) {
	          handled = navigateNext();
	        } else if (e.which == keyCode.ENTER) {
	          if (options.editable) {
	            if (currentEditor) {
	              // adding new row
	              if (activeRow === getDataLength()) {
	                navigateDown();
	              } else {
	                commitEditAndSetFocus();
	              }
	            } else {
	              if (getEditorLock().commitCurrentEdit()) {
	                makeActiveCellEditable();
	              }
	            }
	          }
	          handled = true;
	        }
	      } else if (e.which == keyCode.TAB && e.shiftKey && !e.ctrlKey && !e.altKey) {
	        handled = navigatePrev();
	      }
	    }
	
	    if (handled) {
	      // the event has been handled so don't let parent element (bubbling/propagation) or browser (default) handle it
	      e.stopPropagation();
	      e.preventDefault();
	      try {
	        e.originalEvent.keyCode = 0; // prevent default behaviour for special keys in IE browsers (F3, F5, etc.)
	      }
	      // ignore exceptions - setting the original event's keycode throws access denied exception for "Ctrl"
	      // (hitting control key only, nothing else), "Shift" (maybe others)
	      catch (error) {}
	    }
	  }
	
	  function handleClick(e) {
	    if (!currentEditor) {
	      // if this click resulted in some cell child node getting focus,
	      // don't steal it back - keyboard events will still bubble up
	      // IE9+ seems to default DIVs to tabIndex=0 instead of -1, so check for cell clicks directly.
	      if (e.target != document.activeElement || (0, _jquery2.default)(e.target).hasClass('slick-cell')) {
	        setFocus();
	      }
	    }
	
	    var cell = getCellFromEvent(e);
	    if (!cell || currentEditor !== null && activeRow == cell.row && activeCell == cell.cell) {
	      return;
	    }
	
	    trigger(self.onClick, { row: cell.row, cell: cell.cell, grid: self }, e);
	    if (e.isImmediatePropagationStopped()) {
	      return;
	    }
	
	    if ((activeCell != cell.cell || activeRow != cell.row) && canCellBeActive(cell.row, cell.cell)) {
	      if (!getEditorLock().isActive() || getEditorLock().commitCurrentEdit()) {
	        scrollRowIntoView(cell.row, false);
	        setActiveCellInternal(getCellNode(cell.row, cell.cell));
	      }
	    }
	  }
	
	  function handleContextMenu(e) {
	    var $cell = (0, _jquery2.default)(e.target).closest('.slick-cell', $canvas);
	    if ($cell.length === 0) {
	      return;
	    }
	
	    // are we editing this cell?
	    if (activeCellNode === $cell[0] && currentEditor !== null) {
	      return;
	    }
	
	    trigger(self.onContextMenu, { grid: self }, e);
	  }
	
	  function handleDblClick(e) {
	    var cell = getCellFromEvent(e);
	    if (!cell || currentEditor !== null && activeRow == cell.row && activeCell == cell.cell) {
	      return;
	    }
	
	    trigger(self.onDblClick, { row: cell.row, cell: cell.cell, grid: self }, e);
	    if (e.isImmediatePropagationStopped()) {
	      return;
	    }
	
	    if (options.editable) {
	      gotoCell(cell.row, cell.cell, true);
	    }
	  }
	
	  function handleHeaderMouseEnter(e) {
	    trigger(self.onHeaderMouseEnter, {
	      'column': (0, _jquery2.default)(this).data('column'),
	      'grid': self
	    }, e);
	  }
	
	  function handleHeaderMouseLeave(e) {
	    trigger(self.onHeaderMouseLeave, {
	      'column': (0, _jquery2.default)(this).data('column'),
	      'grid': self
	    }, e);
	  }
	
	  function handleHeaderContextMenu(e) {
	    var $header = (0, _jquery2.default)(e.target).closest('.slick-header-column', '.slick-header-columns');
	    var column = $header && $header.data('column');
	    trigger(self.onHeaderContextMenu, { column: column, grid: self }, e);
	  }
	
	  function handleHeaderClick(e) {
	    var $header = (0, _jquery2.default)(e.target).closest('.slick-header-column', '.slick-header-columns');
	    var column = $header && $header.data('column');
	    if (column) {
	      trigger(self.onHeaderClick, { column: column, grid: self }, e);
	    }
	  }
	
	  function handleMouseEnter(e) {
	    trigger(self.onMouseEnter, { grid: self }, e);
	  }
	
	  function handleMouseLeave(e) {
	    trigger(self.onMouseLeave, { grid: self }, e);
	  }
	
	  function cellExists(row, cell) {
	    return !(row < 0 || row >= getDataLength() || cell < 0 || cell >= columns.length);
	  }
	
	  function getCellFromPoint(x, y) {
	    var row = getRowFromPosition(y);
	    var cell = 0;
	
	    var w = 0;
	    for (var i = 0; i < columns.length && w < x; i++) {
	      w += columns[i].width;
	      cell++;
	    }
	
	    if (cell < 0) {
	      cell = 0;
	    }
	
	    return { row: row, cell: cell - 1 };
	  }
	
	  function getCellFromNode(cellNode) {
	    // read column number from .l<columnNumber> CSS class
	    var cls = /l\d+/.exec(cellNode.className);
	    if (!cls) {
	      throw 'getCellFromNode: cannot get cell - ' + cellNode.className;
	    }
	    return parseInt(cls[0].substr(1, cls[0].length - 1), 10);
	  }
	
	  function getRowFromNode(rowNode) {
	    for (var row in rowsCache) {
	      if (rowsCache[row].rowNode === rowNode) {
	        return row | 0;
	      }
	    }
	
	    return null;
	  }
	
	  function getCellFromEvent(e) {
	    var $cell = (0, _jquery2.default)(e.target).closest('.slick-cell', $canvas);
	    if (!$cell.length) {
	      return null;
	    }
	
	    var row = getRowFromNode($cell[0].parentNode);
	    var cell = getCellFromNode($cell[0]);
	
	    if (row == null || cell == null) {
	      return null;
	    } else {
	      return {
	        'row': row,
	        'cell': cell
	      };
	    }
	  }
	
	  function getCellNodeBox(row, cell) {
	    if (!cellExists(row, cell)) {
	      return null;
	    }
	
	    var y1 = getRowTop(row);
	    var y2 = y1 + options.rowHeight - 1;
	    var x1 = 0;
	    for (var i = 0; i < cell; i++) {
	      x1 += columns[i].width;
	    }
	    var x2 = x1 + columns[cell].width;
	
	    return {
	      top: y1,
	      left: x1,
	      bottom: y2,
	      right: x2
	    };
	  }
	
	  // ////////////////////////////////////////////////////////////////////////////////////////////
	  // Cell switching
	
	  function resetActiveCell() {
	    setActiveCellInternal(null, false);
	  }
	
	  function setFocus() {
	    if (tabbingDirection == -1) {
	      $focusSink[0].focus();
	    } else {
	      $focusSink2[0].focus();
	    }
	  }
	
	  function scrollCellIntoView(row, cell, doPaging) {
	    scrollRowIntoView(row, doPaging);
	
	    var colspan = getColspan(row, cell);
	    var left = columnPosLeft[cell],
	        right = columnPosRight[cell + (colspan > 1 ? colspan - 1 : 0)],
	        scrollRight = scrollLeft + viewportW;
	
	    if (left < scrollLeft) {
	      $viewport.scrollLeft(left);
	      handleScroll();
	      render();
	    } else if (right > scrollRight) {
	      $viewport.scrollLeft(Math.min(left, right - $viewport[0].clientWidth));
	      handleScroll();
	      render();
	    }
	  }
	
	  function setActiveCellInternal(newCell, opt_editMode) {
	    if (activeCellNode !== null) {
	      makeActiveCellNormal();
	      (0, _jquery2.default)(activeCellNode).removeClass('active');
	      if (rowsCache[activeRow]) {
	        (0, _jquery2.default)(rowsCache[activeRow].rowNode).removeClass('active');
	      }
	    }
	
	    var activeCellChanged = activeCellNode !== newCell;
	    activeCellNode = newCell;
	
	    if (activeCellNode != null) {
	      activeRow = getRowFromNode(activeCellNode.parentNode);
	      activeCell = activePosX = getCellFromNode(activeCellNode);
	
	      if (opt_editMode == null) {
	        opt_editMode = activeRow == getDataLength() || options.autoEdit;
	      }
	
	      (0, _jquery2.default)(activeCellNode).addClass('active');
	      (0, _jquery2.default)(rowsCache[activeRow].rowNode).addClass('active');
	
	      if (options.editable && opt_editMode && isCellPotentiallyEditable(activeRow, activeCell)) {
	        clearTimeout(h_editorLoader);
	
	        if (options.asyncEditorLoading) {
	          h_editorLoader = setTimeout(function () {
	            makeActiveCellEditable();
	          }, options.asyncEditorLoadDelay);
	        } else {
	          makeActiveCellEditable();
	        }
	      }
	    } else {
	      activeRow = activeCell = null;
	    }
	
	    if (activeCellChanged) {
	      trigger(self.onActiveCellChanged, getActiveCell());
	    }
	  }
	
	  function clearTextSelection() {
	    if (document.selection && document.selection.empty) {
	      try {
	        // IE fails here if selected element is not in dom
	        document.selection.empty();
	      } catch (e) {}
	    } else if (window.getSelection) {
	      var sel = window.getSelection();
	      if (sel && sel.removeAllRanges) {
	        sel.removeAllRanges();
	      }
	    }
	  }
	
	  function isCellPotentiallyEditable(row, cell) {
	    var dataLength = getDataLength();
	    // is the data for this row loaded?
	    if (row < dataLength && !getDataItem(row)) {
	      return false;
	    }
	
	    // are we in the Add New row?  can we create new from this cell?
	    if (columns[cell].cannotTriggerInsert && row >= dataLength) {
	      return false;
	    }
	
	    // does this cell have an editor?
	    if (!getEditor(row, cell)) {
	      return false;
	    }
	
	    return true;
	  }
	
	  function makeActiveCellNormal() {
	    if (!currentEditor) {
	      return;
	    }
	    trigger(self.onBeforeCellEditorDestroy, { editor: currentEditor, grid: self });
	    currentEditor.destroy();
	    currentEditor = null;
	
	    if (activeCellNode) {
	      var d = getDataItem(activeRow);
	      (0, _jquery2.default)(activeCellNode).removeClass('editable invalid');
	      if (d) {
	        var column = columns[activeCell];
	        var formatter = getFormatter(activeRow, column);
	        activeCellNode.innerHTML = formatter(activeRow, activeCell, getDataItemValueForColumn(d, column), column, d, self);
	        invalidatePostProcessingResults(activeRow);
	      }
	    }
	
	    // if there previously was text selected on a page (such as selected text in the edit cell just removed),
	    // IE can't set focus to anything else correctly
	    if (navigator.userAgent.toLowerCase().match(/msie/)) {
	      clearTextSelection();
	    }
	
	    getEditorLock().deactivate(editController);
	  }
	
	  function makeActiveCellEditable(editor) {
	    if (!activeCellNode) {
	      return;
	    }
	    if (!options.editable) {
	      throw 'Grid : makeActiveCellEditable : should never get called when options.editable is false';
	    }
	
	    // cancel pending async call if there is one
	    clearTimeout(h_editorLoader);
	
	    if (!isCellPotentiallyEditable(activeRow, activeCell)) {
	      return;
	    }
	
	    var columnDef = columns[activeCell];
	    var item = getDataItem(activeRow);
	
	    if (trigger(self.onBeforeEditCell, {
	      row: activeRow,
	      cell: activeCell,
	      item: item,
	      column: columnDef,
	      grid: self
	    }) === false) {
	      setFocus();
	      return;
	    }
	
	    getEditorLock().activate(editController);
	    (0, _jquery2.default)(activeCellNode).addClass('editable');
	
	    var useEditor = editor || getEditor(activeRow, activeCell);
	
	    // don't clear the cell if a custom editor is passed through
	    if (!editor && !useEditor.suppressClearOnEdit) {
	      activeCellNode.innerHTML = '';
	    }
	
	    currentEditor = new useEditor({
	      grid: self,
	      gridPosition: absBox($container[0]),
	      position: absBox(activeCellNode),
	      container: activeCellNode,
	      column: columnDef,
	      item: item || {},
	      commitChanges: commitEditAndSetFocus,
	      cancelChanges: cancelEditAndSetFocus
	    });
	
	    if (item) {
	      currentEditor.loadValue(item);
	    }
	
	    serializedEditorValue = currentEditor.serializeValue();
	
	    if (currentEditor.position) {
	      handleActiveCellPositionChange();
	    }
	  }
	
	  function commitEditAndSetFocus() {
	    // if the commit fails, it would do so due to a validation error
	    // if so, do not steal the focus from the editor
	    if (getEditorLock().commitCurrentEdit()) {
	      setFocus();
	      if (options.autoEdit) {
	        navigateDown();
	      }
	    }
	  }
	
	  function cancelEditAndSetFocus() {
	    if (getEditorLock().cancelCurrentEdit()) {
	      setFocus();
	    }
	  }
	
	  function absBox(elem) {
	    var box = {
	      top: elem.offsetTop,
	      left: elem.offsetLeft,
	      bottom: 0,
	      right: 0,
	      width: (0, _jquery2.default)(elem).outerWidth(),
	      height: (0, _jquery2.default)(elem).outerHeight(),
	      visible: true
	    };
	    box.bottom = box.top + box.height;
	    box.right = box.left + box.width;
	
	    // walk up the tree
	    var offsetParent = elem.offsetParent;
	    while ((elem = elem.parentNode) != document.body) {
	      if (elem == null) break;
	
	      if (box.visible && elem.scrollHeight != elem.offsetHeight && (0, _jquery2.default)(elem).css('overflowY') != 'visible') {
	        box.visible = box.bottom > elem.scrollTop && box.top < elem.scrollTop + elem.clientHeight;
	      }
	
	      if (box.visible && elem.scrollWidth != elem.offsetWidth && (0, _jquery2.default)(elem).css('overflowX') != 'visible') {
	        box.visible = box.right > elem.scrollLeft && box.left < elem.scrollLeft + elem.clientWidth;
	      }
	
	      box.left -= elem.scrollLeft;
	      box.top -= elem.scrollTop;
	
	      if (elem === offsetParent) {
	        box.left += elem.offsetLeft;
	        box.top += elem.offsetTop;
	        offsetParent = elem.offsetParent;
	      }
	
	      box.bottom = box.top + box.height;
	      box.right = box.left + box.width;
	    }
	
	    return box;
	  }
	
	  function getActiveCellPosition() {
	    return absBox(activeCellNode);
	  }
	
	  function getGridPosition() {
	    return absBox($container[0]);
	  }
	
	  function handleActiveCellPositionChange() {
	    if (!activeCellNode) {
	      return;
	    }
	
	    trigger(self.onActiveCellPositionChanged, { grid: self });
	
	    if (currentEditor) {
	      var cellBox = getActiveCellPosition();
	      if (currentEditor.show && currentEditor.hide) {
	        if (!cellBox.visible) {
	          currentEditor.hide();
	        } else {
	          currentEditor.show();
	        }
	      }
	
	      if (currentEditor.position) {
	        currentEditor.position(cellBox);
	      }
	    }
	  }
	
	  function getCellEditor() {
	    return currentEditor;
	  }
	
	  function getActiveCell() {
	    if (!activeCellNode) {
	      return null;
	    } else {
	      return { row: activeRow, cell: activeCell, grid: self };
	    }
	  }
	
	  function getActiveCellNode() {
	    return activeCellNode;
	  }
	
	  function scrollRowIntoView(row, doPaging) {
	    var rowAtTop = row * options.rowHeight;
	    var rowAtBottom = (row + 1) * options.rowHeight - viewportH + (viewportHasHScroll ? scrollbarDimensions.height : 0);
	
	    // need to page down?
	    if ((row + 1) * options.rowHeight > scrollTop + viewportH + offset) {
	      scrollTo(doPaging ? rowAtTop : rowAtBottom);
	      render();
	    }
	    // or page up?
	    else if (row * options.rowHeight < scrollTop + offset) {
	        scrollTo(doPaging ? rowAtBottom : rowAtTop);
	        render();
	      }
	  }
	
	  function scrollRowToTop(row) {
	    scrollTo(row * options.rowHeight);
	    render();
	  }
	
	  function scrollPage(dir) {
	    var deltaRows = dir * numVisibleRows;
	    scrollTo((getRowFromPosition(scrollTop) + deltaRows) * options.rowHeight);
	    render();
	
	    if (options.enableCellNavigation && activeRow != null) {
	      var row = activeRow + deltaRows;
	      var dataLengthIncludingAddNew = getDataLengthIncludingAddNew();
	      if (row >= dataLengthIncludingAddNew) {
	        row = dataLengthIncludingAddNew - 1;
	      }
	      if (row < 0) {
	        row = 0;
	      }
	
	      var cell = 0,
	          prevCell = null;
	      var prevActivePosX = activePosX;
	      while (cell <= activePosX) {
	        if (canCellBeActive(row, cell)) {
	          prevCell = cell;
	        }
	        cell += getColspan(row, cell);
	      }
	
	      if (prevCell !== null) {
	        setActiveCellInternal(getCellNode(row, prevCell));
	        activePosX = prevActivePosX;
	      } else {
	        resetActiveCell();
	      }
	    }
	  }
	
	  function navigatePageDown() {
	    scrollPage(1);
	  }
	
	  function navigatePageUp() {
	    scrollPage(-1);
	  }
	
	  function getColspan(row, cell) {
	    var metadata = data.getItemMetadata && data.getItemMetadata(row);
	    if (!metadata || !metadata.columns) {
	      return 1;
	    }
	
	    var columnData = metadata.columns[columns[cell].id] || metadata.columns[cell];
	    var colspan = columnData && columnData.colspan;
	    if (colspan === '*') {
	      colspan = columns.length - cell;
	    } else {
	      colspan = colspan || 1;
	    }
	
	    return colspan;
	  }
	
	  function findFirstFocusableCell(row) {
	    var cell = 0;
	    while (cell < columns.length) {
	      if (canCellBeActive(row, cell)) {
	        return cell;
	      }
	      cell += getColspan(row, cell);
	    }
	    return null;
	  }
	
	  function findLastFocusableCell(row) {
	    var cell = 0;
	    var lastFocusableCell = null;
	    while (cell < columns.length) {
	      if (canCellBeActive(row, cell)) {
	        lastFocusableCell = cell;
	      }
	      cell += getColspan(row, cell);
	    }
	    return lastFocusableCell;
	  }
	
	  function gotoRight(row, cell, posX) {
	    if (cell >= columns.length) {
	      return null;
	    }
	
	    do {
	      cell += getColspan(row, cell);
	    } while (cell < columns.length && !canCellBeActive(row, cell));
	
	    if (cell < columns.length) {
	      return {
	        'row': row,
	        'cell': cell,
	        'posX': cell
	      };
	    }
	    return null;
	  }
	
	  function gotoLeft(row, cell, posX) {
	    if (cell <= 0) {
	      return null;
	    }
	
	    var firstFocusableCell = findFirstFocusableCell(row);
	    if (firstFocusableCell === null || firstFocusableCell >= cell) {
	      return null;
	    }
	
	    var prev = {
	      'row': row,
	      'cell': firstFocusableCell,
	      'posX': firstFocusableCell
	    };
	    var pos;
	    while (true) {
	      pos = gotoRight(prev.row, prev.cell, prev.posX);
	      if (!pos) {
	        return null;
	      }
	      if (pos.cell >= cell) {
	        return prev;
	      }
	      prev = pos;
	    }
	  }
	
	  function gotoDown(row, cell, posX) {
	    var prevCell;
	    var dataLengthIncludingAddNew = getDataLengthIncludingAddNew();
	    while (true) {
	      if (++row >= dataLengthIncludingAddNew) {
	        return null;
	      }
	
	      prevCell = cell = 0;
	      while (cell <= posX) {
	        prevCell = cell;
	        cell += getColspan(row, cell);
	      }
	
	      if (canCellBeActive(row, prevCell)) {
	        return {
	          'row': row,
	          'cell': prevCell,
	          'posX': posX
	        };
	      }
	    }
	  }
	
	  function gotoUp(row, cell, posX) {
	    var prevCell;
	    while (true) {
	      if (--row < 0) {
	        return null;
	      }
	
	      prevCell = cell = 0;
	      while (cell <= posX) {
	        prevCell = cell;
	        cell += getColspan(row, cell);
	      }
	
	      if (canCellBeActive(row, prevCell)) {
	        return {
	          'row': row,
	          'cell': prevCell,
	          'posX': posX
	        };
	      }
	    }
	  }
	
	  function gotoNext(row, cell, posX) {
	    if (row == null && cell == null) {
	      row = cell = posX = 0;
	      if (canCellBeActive(row, cell)) {
	        return {
	          'row': row,
	          'cell': cell,
	          'posX': cell
	        };
	      }
	    }
	
	    var pos = gotoRight(row, cell, posX);
	    if (pos) {
	      return pos;
	    }
	
	    var firstFocusableCell = null;
	    var dataLengthIncludingAddNew = getDataLengthIncludingAddNew();
	    while (++row < dataLengthIncludingAddNew) {
	      firstFocusableCell = findFirstFocusableCell(row);
	      if (firstFocusableCell !== null) {
	        return {
	          'row': row,
	          'cell': firstFocusableCell,
	          'posX': firstFocusableCell
	        };
	      }
	    }
	    return null;
	  }
	
	  function gotoPrev(row, cell, posX) {
	    if (row == null && cell == null) {
	      row = getDataLengthIncludingAddNew() - 1;
	      cell = posX = columns.length - 1;
	      if (canCellBeActive(row, cell)) {
	        return {
	          'row': row,
	          'cell': cell,
	          'posX': cell
	        };
	      }
	    }
	
	    var pos;
	    var lastSelectableCell;
	    while (!pos) {
	      pos = gotoLeft(row, cell, posX);
	      if (pos) {
	        break;
	      }
	      if (--row < 0) {
	        return null;
	      }
	
	      cell = 0;
	      lastSelectableCell = findLastFocusableCell(row);
	      if (lastSelectableCell !== null) {
	        pos = {
	          'row': row,
	          'cell': lastSelectableCell,
	          'posX': lastSelectableCell
	        };
	      }
	    }
	    return pos;
	  }
	
	  function navigateRight() {
	    return navigate('right');
	  }
	
	  function navigateLeft() {
	    return navigate('left');
	  }
	
	  function navigateDown() {
	    return navigate('down');
	  }
	
	  function navigateUp() {
	    return navigate('up');
	  }
	
	  function navigateNext() {
	    return navigate('next');
	  }
	
	  function navigatePrev() {
	    return navigate('prev');
	  }
	
	  /**
	   * @param {string} dir Navigation direction.
	   * @return {boolean} Whether navigation resulted in a change of active cell.
	   */
	  function navigate(dir) {
	    if (!options.enableCellNavigation) {
	      return false;
	    }
	
	    if (!activeCellNode && dir != 'prev' && dir != 'next') {
	      return false;
	    }
	
	    if (!getEditorLock().commitCurrentEdit()) {
	      return true;
	    }
	    setFocus();
	
	    var tabbingDirections = {
	      'up': -1,
	      'down': 1,
	      'left': -1,
	      'right': 1,
	      'prev': -1,
	      'next': 1
	    };
	    tabbingDirection = tabbingDirections[dir];
	
	    var stepFunctions = {
	      'up': gotoUp,
	      'down': gotoDown,
	      'left': gotoLeft,
	      'right': gotoRight,
	      'prev': gotoPrev,
	      'next': gotoNext
	    };
	    var stepFn = stepFunctions[dir];
	    var pos = stepFn(activeRow, activeCell, activePosX);
	    if (pos) {
	      var isAddNewRow = pos.row == getDataLength();
	      scrollCellIntoView(pos.row, pos.cell, !isAddNewRow);
	      setActiveCellInternal(getCellNode(pos.row, pos.cell));
	      activePosX = pos.posX;
	      return true;
	    } else {
	      setActiveCellInternal(getCellNode(activeRow, activeCell));
	      return false;
	    }
	  }
	
	  function getCellNode(row, cell) {
	    if (rowsCache[row]) {
	      ensureCellNodesInRowsCache(row);
	      return rowsCache[row].cellNodesByColumnIdx[cell];
	    }
	    return null;
	  }
	
	  function setActiveCell(row, cell) {
	    if (!initialized) {
	      return;
	    }
	    if (row > getDataLength() || row < 0 || cell >= columns.length || cell < 0) {
	      return;
	    }
	
	    if (!options.enableCellNavigation) {
	      return;
	    }
	
	    scrollCellIntoView(row, cell, false);
	    setActiveCellInternal(getCellNode(row, cell), false);
	  }
	
	  function canCellBeActive(row, cell) {
	    if (!options.enableCellNavigation || row >= getDataLengthIncludingAddNew() || row < 0 || cell >= columns.length || cell < 0) {
	      return false;
	    }
	
	    var rowMetadata = data.getItemMetadata && data.getItemMetadata(row);
	    if (rowMetadata && typeof rowMetadata.focusable === 'boolean') {
	      return rowMetadata.focusable;
	    }
	
	    var columnMetadata = rowMetadata && rowMetadata.columns;
	    if (columnMetadata && columnMetadata[columns[cell].id] && typeof columnMetadata[columns[cell].id].focusable === 'boolean') {
	      return columnMetadata[columns[cell].id].focusable;
	    }
	    if (columnMetadata && columnMetadata[cell] && typeof columnMetadata[cell].focusable === 'boolean') {
	      return columnMetadata[cell].focusable;
	    }
	
	    return columns[cell].focusable;
	  }
	
	  function canCellBeSelected(row, cell) {
	    if (row >= getDataLength() || row < 0 || cell >= columns.length || cell < 0) {
	      return false;
	    }
	
	    var rowMetadata = data.getItemMetadata && data.getItemMetadata(row);
	    if (rowMetadata && typeof rowMetadata.selectable === 'boolean') {
	      return rowMetadata.selectable;
	    }
	
	    var columnMetadata = rowMetadata && rowMetadata.columns && (rowMetadata.columns[columns[cell].id] || rowMetadata.columns[cell]);
	    if (columnMetadata && typeof columnMetadata.selectable === 'boolean') {
	      return columnMetadata.selectable;
	    }
	
	    return columns[cell].selectable;
	  }
	
	  function gotoCell(row, cell, forceEdit) {
	    if (!initialized) {
	      return;
	    }
	    if (!canCellBeActive(row, cell)) {
	      return;
	    }
	
	    if (!getEditorLock().commitCurrentEdit()) {
	      return;
	    }
	
	    scrollCellIntoView(row, cell, false);
	
	    var newCell = getCellNode(row, cell);
	
	    // if selecting the 'add new' row, start editing right away
	    setActiveCellInternal(newCell, forceEdit || row === getDataLength() || options.autoEdit);
	
	    // if no editor was created, set the focus back on the grid
	    if (!currentEditor) {
	      setFocus();
	    }
	  }
	
	  // ////////////////////////////////////////////////////////////////////////////////////////////
	  // IEditor implementation for the editor lock
	
	  function commitCurrentEdit() {
	    var item = getDataItem(activeRow);
	    var column = columns[activeCell];
	
	    if (currentEditor) {
	      if (currentEditor.isValueChanged()) {
	        var validationResults = currentEditor.validate();
	
	        if (validationResults.valid) {
	          if (activeRow < getDataLength()) {
	            var editCommand = {
	              row: activeRow,
	              cell: activeCell,
	              editor: currentEditor,
	              serializedValue: currentEditor.serializeValue(),
	              prevSerializedValue: serializedEditorValue,
	              execute: function execute() {
	                this.editor.applyValue(item, this.serializedValue);
	                updateRow(this.row);
	                trigger(self.onCellChange, {
	                  row: activeRow,
	                  cell: activeCell,
	                  item: item,
	                  grid: self
	                });
	              },
	              undo: function undo() {
	                this.editor.applyValue(item, this.prevSerializedValue);
	                updateRow(this.row);
	                trigger(self.onCellChange, {
	                  row: activeRow,
	                  cell: activeCell,
	                  item: item,
	                  grid: self
	                });
	              }
	            };
	
	            if (options.editCommandHandler) {
	              makeActiveCellNormal();
	              options.editCommandHandler(item, column, editCommand);
	            } else {
	              editCommand.execute();
	              makeActiveCellNormal();
	            }
	          } else {
	            var newItem = {};
	            currentEditor.applyValue(newItem, currentEditor.serializeValue());
	            makeActiveCellNormal();
	            trigger(self.onAddNewRow, { item: newItem, column: column, grid: self });
	          }
	
	          // check whether the lock has been re-acquired by event handlers
	          return !getEditorLock().isActive();
	        } else {
	          // Re-add the CSS class to trigger transitions, if any.
	          (0, _jquery2.default)(activeCellNode).removeClass('invalid');
	          (0, _jquery2.default)(activeCellNode).width(); // force layout
	          (0, _jquery2.default)(activeCellNode).addClass('invalid');
	
	          trigger(self.onValidationError, {
	            editor: currentEditor,
	            cellNode: activeCellNode,
	            validationResults: validationResults,
	            row: activeRow,
	            cell: activeCell,
	            column: column,
	            grid: self
	          });
	
	          currentEditor.focus();
	          return false;
	        }
	      }
	
	      makeActiveCellNormal();
	    }
	    return true;
	  }
	
	  function cancelCurrentEdit() {
	    makeActiveCellNormal();
	    return true;
	  }
	
	  function rowsToRanges(rows) {
	    var ranges = [];
	    var lastCell = columns.length - 1;
	    for (var i = 0; i < rows.length; i++) {
	      ranges.push(new _slick2.default.Range(rows[i], 0, rows[i], lastCell));
	    }
	    return ranges;
	  }
	
	  function getSelectedRows() {
	    if (!selectionModel) {
	      throw 'Selection model is not set';
	    }
	    return selectedRows;
	  }
	
	  function setSelectedRows(rows) {
	    if (!selectionModel) {
	      throw 'Selection model is not set';
	    }
	    selectionModel.setSelectedRanges(rowsToRanges(rows));
	  }
	
	  // ////////////////////////////////////////////////////////////////////////////////////////////
	  // Debug
	
	  this.debug = function () {
	    var s = '';
	
	    s += '\n' + 'counter_rows_rendered:  ' + counter_rows_rendered;
	    s += '\n' + 'counter_rows_removed:  ' + counter_rows_removed;
	    s += '\n' + 'renderedRows:  ' + renderedRows;
	    s += '\n' + 'numVisibleRows:  ' + numVisibleRows;
	    s += '\n' + 'maxSupportedCssHeight:  ' + maxSupportedCssHeight;
	    s += '\n' + 'n(umber of pages):  ' + n;
	    s += '\n' + '(current) page:  ' + page;
	    s += '\n' + 'page height (ph):  ' + ph;
	    s += '\n' + 'vScrollDir:  ' + vScrollDir;
	
	    alert(s);
	  };
	
	  // a debug helper to be able to access private members
	  this.eval = function (expr) {
	    return eval(expr);
	  };
	
	  // ////////////////////////////////////////////////////////////////////////////////////////////
	  // Public API
	
	  _jquery2.default.extend(this, {
	    'slickGridVersion': '2.2.4',
	
	    // Events
	    'onScroll': new _slick2.default.Event(),
	    'onSort': new _slick2.default.Event(),
	    'onHeaderMouseEnter': new _slick2.default.Event(),
	    'onHeaderMouseLeave': new _slick2.default.Event(),
	    'onHeaderContextMenu': new _slick2.default.Event(),
	    'onHeaderClick': new _slick2.default.Event(),
	    'onHeaderCellRendered': new _slick2.default.Event(),
	    'onBeforeHeaderCellDestroy': new _slick2.default.Event(),
	    'onHeaderRowCellRendered': new _slick2.default.Event(),
	    'onFooterRowCellRendered': new _slick2.default.Event(),
	    'onBeforeHeaderRowCellDestroy': new _slick2.default.Event(),
	    'onBeforeFooterRowCellDestroy': new _slick2.default.Event(),
	    'onMouseEnter': new _slick2.default.Event(),
	    'onMouseLeave': new _slick2.default.Event(),
	    'onClick': new _slick2.default.Event(),
	    'onDblClick': new _slick2.default.Event(),
	    'onContextMenu': new _slick2.default.Event(),
	    'onKeyDown': new _slick2.default.Event(),
	    'onAddNewRow': new _slick2.default.Event(),
	    'onValidationError': new _slick2.default.Event(),
	    'onViewportChanged': new _slick2.default.Event(),
	    'onColumnsReordered': new _slick2.default.Event(),
	    'onColumnsResized': new _slick2.default.Event(),
	    'onCellChange': new _slick2.default.Event(),
	    'onBeforeEditCell': new _slick2.default.Event(),
	    'onBeforeCellEditorDestroy': new _slick2.default.Event(),
	    'onBeforeDestroy': new _slick2.default.Event(),
	    'onActiveCellChanged': new _slick2.default.Event(),
	    'onActiveCellPositionChanged': new _slick2.default.Event(),
	    'onDragInit': new _slick2.default.Event(),
	    'onDragStart': new _slick2.default.Event(),
	    'onDrag': new _slick2.default.Event(),
	    'onDragEnd': new _slick2.default.Event(),
	    'onSelectedRowsChanged': new _slick2.default.Event(),
	    'onCellCssStylesChanged': new _slick2.default.Event(),
	
	    // Methods
	    'registerPlugin': registerPlugin,
	    'unregisterPlugin': unregisterPlugin,
	    'getColumns': getColumns,
	    'setColumns': setColumns,
	    'getColumnIndex': getColumnIndex,
	    'updateColumnHeader': updateColumnHeader,
	    'setSortColumn': setSortColumn,
	    'setSortColumns': setSortColumns,
	    'getSortColumns': getSortColumns,
	    'autosizeColumns': autosizeColumns,
	    'getOptions': getOptions,
	    'setOptions': setOptions,
	    'getData': getData,
	    'getDataLength': getDataLength,
	    'getDataItem': getDataItem,
	    'setData': setData,
	    'getSelectionModel': getSelectionModel,
	    'setSelectionModel': setSelectionModel,
	    'getSelectedRows': getSelectedRows,
	    'setSelectedRows': setSelectedRows,
	    'getContainerNode': getContainerNode,
	
	    'render': render,
	    'invalidate': invalidate,
	    'invalidateRow': invalidateRow,
	    'invalidateRows': invalidateRows,
	    'invalidateAllRows': invalidateAllRows,
	    'updateCell': updateCell,
	    'updateRow': updateRow,
	    'getViewport': getVisibleRange,
	    'getRenderedRange': getRenderedRange,
	    'resizeCanvas': resizeCanvas,
	    'updateRowCount': updateRowCount,
	    'scrollRowIntoView': scrollRowIntoView,
	    'scrollRowToTop': scrollRowToTop,
	    'scrollCellIntoView': scrollCellIntoView,
	    'getCanvasNode': getCanvasNode,
	    'focus': setFocus,
	
	    'getCellFromPoint': getCellFromPoint,
	    'getCellFromEvent': getCellFromEvent,
	    'getActiveCell': getActiveCell,
	    'setActiveCell': setActiveCell,
	    'getActiveCellNode': getActiveCellNode,
	    'getActiveCellPosition': getActiveCellPosition,
	    'resetActiveCell': resetActiveCell,
	    'editActiveCell': makeActiveCellEditable,
	    'getCellEditor': getCellEditor,
	    'getCellNode': getCellNode,
	    'getCellNodeBox': getCellNodeBox,
	    'canCellBeSelected': canCellBeSelected,
	    'canCellBeActive': canCellBeActive,
	    'navigatePrev': navigatePrev,
	    'navigateNext': navigateNext,
	    'navigateUp': navigateUp,
	    'navigateDown': navigateDown,
	    'navigateLeft': navigateLeft,
	    'navigateRight': navigateRight,
	    'navigatePageUp': navigatePageUp,
	    'navigatePageDown': navigatePageDown,
	    'gotoCell': gotoCell,
	    'getTopPanel': getTopPanel,
	    'setTopPanelVisibility': setTopPanelVisibility,
	    'setHeaderRowVisibility': setHeaderRowVisibility,
	    'getHeaderRow': getHeaderRow,
	    'getHeaderRowColumn': getHeaderRowColumn,
	    'setFooterRowVisibility': setFooterRowVisibility,
	    'getFooterRow': getFooterRow,
	    'getFooterRowColumn': getFooterRowColumn,
	    'getGridPosition': getGridPosition,
	    'flashCell': flashCell,
	    'addCellCssStyles': addCellCssStyles,
	    'setCellCssStyles': setCellCssStyles,
	    'removeCellCssStyles': removeCellCssStyles,
	    'getCellCssStyles': getCellCssStyles,
	
	    'init': finishInitialization,
	    'destroy': destroy,
	
	    // IEditor implementation
	    'getEditorLock': getEditorLock,
	    'getEditController': getEditController
	  });
	
	  init();
	}

/***/ }),

/***/ 117:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _jquery = __webpack_require__(8);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _slick = __webpack_require__(7);
	
	var _slick2 = _interopRequireDefault(_slick);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = GroupItemMetadataProvider;
	
	/***
	 * Provides item metadata for group (Slick.Group) and totals (Slick.Totals) rows produced by the DataView.
	 * This metadata overrides the default behavior and formatting of those rows so that they appear and function
	 * correctly when processed by the grid.
	 *
	 * This class also acts as a grid plugin providing event handlers to expand & collapse groups.
	 * If "grid.registerPlugin(...)" is not called, expand & collapse will not work.
	 *
	 * @class GroupItemMetadataProvider
	 * @module Data
	 * @namespace Slick.Data
	 * @constructor
	 * @param options
	 */
	
	function GroupItemMetadataProvider(options) {
	  var _grid = void 0;
	  var _defaults = {
	    groupCssClass: "slick-group",
	    groupTitleCssClass: "slick-group-title",
	    totalsCssClass: "slick-group-totals",
	    groupFocusable: true,
	    totalsFocusable: false,
	    toggleCssClass: "slick-group-toggle",
	    toggleExpandedCssClass: "expanded",
	    toggleCollapsedCssClass: "collapsed",
	    enableExpandCollapse: true,
	    groupFormatter: defaultGroupCellFormatter,
	    totalsFormatter: defaultTotalsCellFormatter
	  };
	
	  options = _jquery2.default.extend(true, {}, _defaults, options);
	
	  function defaultGroupCellFormatter(row, cell, value, columnDef, item) {
	    if (!options.enableExpandCollapse) {
	      return item.title;
	    }
	
	    var indentation = item.level * 15 + "px";
	
	    return "<span class='" + options.toggleCssClass + " " + (item.collapsed ? options.toggleCollapsedCssClass : options.toggleExpandedCssClass) + "' style='margin-left:" + indentation + "'>" + "</span>" + "<span class='" + options.groupTitleCssClass + "' level='" + item.level + "'>" + item.title + "</span>";
	  }
	
	  function defaultTotalsCellFormatter(row, cell, value, columnDef, item) {
	    return columnDef.groupTotalsFormatter && columnDef.groupTotalsFormatter(item, columnDef) || "";
	  }
	
	  function init(grid) {
	    _grid = grid;
	    _grid.onClick.subscribe(handleGridClick);
	    _grid.onKeyDown.subscribe(handleGridKeyDown);
	  }
	
	  function destroy() {
	    if (_grid) {
	      _grid.onClick.unsubscribe(handleGridClick);
	      _grid.onKeyDown.unsubscribe(handleGridKeyDown);
	    }
	  }
	
	  function handleGridClick(e, args) {
	    var item = this.getDataItem(args.row);
	    if (item && item instanceof _slick2.default.Group && (0, _jquery2.default)(e.target).hasClass(options.toggleCssClass)) {
	      var range = _grid.getRenderedRange();
	      this.getData().setRefreshHints({
	        ignoreDiffsBefore: range.top,
	        ignoreDiffsAfter: range.bottom + 1
	      });
	
	      if (item.collapsed) {
	        this.getData().expandGroup(item.groupingKey);
	      } else {
	        this.getData().collapseGroup(item.groupingKey);
	      }
	
	      e.stopImmediatePropagation();
	      e.preventDefault();
	    }
	  }
	
	  // TODO:  add -/+ handling
	  function handleGridKeyDown(e) {
	    if (options.enableExpandCollapse && e.which == _slick2.default.keyCode.SPACE) {
	      var activeCell = this.getActiveCell();
	      if (activeCell) {
	        var item = this.getDataItem(activeCell.row);
	        if (item && item instanceof _slick2.default.Group) {
	          var range = _grid.getRenderedRange();
	          this.getData().setRefreshHints({
	            ignoreDiffsBefore: range.top,
	            ignoreDiffsAfter: range.bottom + 1
	          });
	
	          if (item.collapsed) {
	            this.getData().expandGroup(item.groupingKey);
	          } else {
	            this.getData().collapseGroup(item.groupingKey);
	          }
	
	          e.stopImmediatePropagation();
	          e.preventDefault();
	        }
	      }
	    }
	  }
	
	  function getGroupRowMetadata(item) {
	    return {
	      selectable: false,
	      focusable: options.groupFocusable,
	      cssClasses: options.groupCssClass,
	      columns: {
	        0: {
	          colspan: "*",
	          formatter: options.groupFormatter,
	          editor: null
	        }
	      }
	    };
	  }
	
	  function getTotalsRowMetadata(item) {
	    return {
	      selectable: false,
	      focusable: options.totalsFocusable,
	      cssClasses: options.totalsCssClass,
	      formatter: options.totalsFormatter,
	      editor: null
	    };
	  }
	
	  return {
	    init: init,
	    destroy: destroy,
	    getGroupRowMetadata: getGroupRowMetadata,
	    getTotalsRowMetadata: getTotalsRowMetadata
	  };
	}

/***/ }),

/***/ 118:
/***/ (function(module, exports) {

	'use strict'
	
	exports.byteLength = byteLength
	exports.toByteArray = toByteArray
	exports.fromByteArray = fromByteArray
	
	var lookup = []
	var revLookup = []
	var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array
	
	var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
	for (var i = 0, len = code.length; i < len; ++i) {
	  lookup[i] = code[i]
	  revLookup[code.charCodeAt(i)] = i
	}
	
	// Support decoding URL-safe base64 strings, as Node.js does.
	// See: https://en.wikipedia.org/wiki/Base64#URL_applications
	revLookup['-'.charCodeAt(0)] = 62
	revLookup['_'.charCodeAt(0)] = 63
	
	function placeHoldersCount (b64) {
	  var len = b64.length
	  if (len % 4 > 0) {
	    throw new Error('Invalid string. Length must be a multiple of 4')
	  }
	
	  // the number of equal signs (place holders)
	  // if there are two placeholders, than the two characters before it
	  // represent one byte
	  // if there is only one, then the three characters before it represent 2 bytes
	  // this is just a cheap hack to not do indexOf twice
	  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
	}
	
	function byteLength (b64) {
	  // base64 is 4/3 + up to two characters of the original data
	  return (b64.length * 3 / 4) - placeHoldersCount(b64)
	}
	
	function toByteArray (b64) {
	  var i, l, tmp, placeHolders, arr
	  var len = b64.length
	  placeHolders = placeHoldersCount(b64)
	
	  arr = new Arr((len * 3 / 4) - placeHolders)
	
	  // if there are placeholders, only get up to the last complete 4 chars
	  l = placeHolders > 0 ? len - 4 : len
	
	  var L = 0
	
	  for (i = 0; i < l; i += 4) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
	    arr[L++] = (tmp >> 16) & 0xFF
	    arr[L++] = (tmp >> 8) & 0xFF
	    arr[L++] = tmp & 0xFF
	  }
	
	  if (placeHolders === 2) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
	    arr[L++] = tmp & 0xFF
	  } else if (placeHolders === 1) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
	    arr[L++] = (tmp >> 8) & 0xFF
	    arr[L++] = tmp & 0xFF
	  }
	
	  return arr
	}
	
	function tripletToBase64 (num) {
	  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
	}
	
	function encodeChunk (uint8, start, end) {
	  var tmp
	  var output = []
	  for (var i = start; i < end; i += 3) {
	    tmp = ((uint8[i] << 16) & 0xFF0000) + ((uint8[i + 1] << 8) & 0xFF00) + (uint8[i + 2] & 0xFF)
	    output.push(tripletToBase64(tmp))
	  }
	  return output.join('')
	}
	
	function fromByteArray (uint8) {
	  var tmp
	  var len = uint8.length
	  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
	  var output = ''
	  var parts = []
	  var maxChunkLength = 16383 // must be multiple of 3
	
	  // go through the array every three bytes, we'll deal with trailing stuff later
	  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
	    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
	  }
	
	  // pad the end with zeros, but make sure to not forget the extra bytes
	  if (extraBytes === 1) {
	    tmp = uint8[len - 1]
	    output += lookup[tmp >> 2]
	    output += lookup[(tmp << 4) & 0x3F]
	    output += '=='
	  } else if (extraBytes === 2) {
	    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
	    output += lookup[tmp >> 10]
	    output += lookup[(tmp >> 4) & 0x3F]
	    output += lookup[(tmp << 2) & 0x3F]
	    output += '='
	  }
	
	  parts.push(output)
	
	  return parts.join('')
	}


/***/ }),

/***/ 119:
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	/* eslint-disable no-proto */
	
	'use strict'
	
	var base64 = __webpack_require__(118)
	var ieee754 = __webpack_require__(144)
	var isArray = __webpack_require__(145)
	
	exports.Buffer = Buffer
	exports.SlowBuffer = SlowBuffer
	exports.INSPECT_MAX_BYTES = 50
	
	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.
	
	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
	  ? global.TYPED_ARRAY_SUPPORT
	  : typedArraySupport()
	
	/*
	 * Export kMaxLength after typed array support is determined.
	 */
	exports.kMaxLength = kMaxLength()
	
	function typedArraySupport () {
	  try {
	    var arr = new Uint8Array(1)
	    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
	    return arr.foo() === 42 && // typed array instances can be augmented
	        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
	  } catch (e) {
	    return false
	  }
	}
	
	function kMaxLength () {
	  return Buffer.TYPED_ARRAY_SUPPORT
	    ? 0x7fffffff
	    : 0x3fffffff
	}
	
	function createBuffer (that, length) {
	  if (kMaxLength() < length) {
	    throw new RangeError('Invalid typed array length')
	  }
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = new Uint8Array(length)
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    if (that === null) {
	      that = new Buffer(length)
	    }
	    that.length = length
	  }
	
	  return that
	}
	
	/**
	 * The Buffer constructor returns instances of `Uint8Array` that have their
	 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
	 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
	 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
	 * returns a single octet.
	 *
	 * The `Uint8Array` prototype remains unmodified.
	 */
	
	function Buffer (arg, encodingOrOffset, length) {
	  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
	    return new Buffer(arg, encodingOrOffset, length)
	  }
	
	  // Common case.
	  if (typeof arg === 'number') {
	    if (typeof encodingOrOffset === 'string') {
	      throw new Error(
	        'If encoding is specified then the first argument must be a string'
	      )
	    }
	    return allocUnsafe(this, arg)
	  }
	  return from(this, arg, encodingOrOffset, length)
	}
	
	Buffer.poolSize = 8192 // not used by this implementation
	
	// TODO: Legacy, not needed anymore. Remove in next major version.
	Buffer._augment = function (arr) {
	  arr.__proto__ = Buffer.prototype
	  return arr
	}
	
	function from (that, value, encodingOrOffset, length) {
	  if (typeof value === 'number') {
	    throw new TypeError('"value" argument must not be a number')
	  }
	
	  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
	    return fromArrayBuffer(that, value, encodingOrOffset, length)
	  }
	
	  if (typeof value === 'string') {
	    return fromString(that, value, encodingOrOffset)
	  }
	
	  return fromObject(that, value)
	}
	
	/**
	 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
	 * if value is a number.
	 * Buffer.from(str[, encoding])
	 * Buffer.from(array)
	 * Buffer.from(buffer)
	 * Buffer.from(arrayBuffer[, byteOffset[, length]])
	 **/
	Buffer.from = function (value, encodingOrOffset, length) {
	  return from(null, value, encodingOrOffset, length)
	}
	
	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype
	  Buffer.__proto__ = Uint8Array
	  if (typeof Symbol !== 'undefined' && Symbol.species &&
	      Buffer[Symbol.species] === Buffer) {
	    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
	    Object.defineProperty(Buffer, Symbol.species, {
	      value: null,
	      configurable: true
	    })
	  }
	}
	
	function assertSize (size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('"size" argument must be a number')
	  } else if (size < 0) {
	    throw new RangeError('"size" argument must not be negative')
	  }
	}
	
	function alloc (that, size, fill, encoding) {
	  assertSize(size)
	  if (size <= 0) {
	    return createBuffer(that, size)
	  }
	  if (fill !== undefined) {
	    // Only pay attention to encoding if it's a string. This
	    // prevents accidentally sending in a number that would
	    // be interpretted as a start offset.
	    return typeof encoding === 'string'
	      ? createBuffer(that, size).fill(fill, encoding)
	      : createBuffer(that, size).fill(fill)
	  }
	  return createBuffer(that, size)
	}
	
	/**
	 * Creates a new filled Buffer instance.
	 * alloc(size[, fill[, encoding]])
	 **/
	Buffer.alloc = function (size, fill, encoding) {
	  return alloc(null, size, fill, encoding)
	}
	
	function allocUnsafe (that, size) {
	  assertSize(size)
	  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < size; ++i) {
	      that[i] = 0
	    }
	  }
	  return that
	}
	
	/**
	 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
	 * */
	Buffer.allocUnsafe = function (size) {
	  return allocUnsafe(null, size)
	}
	/**
	 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
	 */
	Buffer.allocUnsafeSlow = function (size) {
	  return allocUnsafe(null, size)
	}
	
	function fromString (that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') {
	    encoding = 'utf8'
	  }
	
	  if (!Buffer.isEncoding(encoding)) {
	    throw new TypeError('"encoding" must be a valid string encoding')
	  }
	
	  var length = byteLength(string, encoding) | 0
	  that = createBuffer(that, length)
	
	  var actual = that.write(string, encoding)
	
	  if (actual !== length) {
	    // Writing a hex string, for example, that contains invalid characters will
	    // cause everything after the first invalid character to be ignored. (e.g.
	    // 'abxxcd' will be treated as 'ab')
	    that = that.slice(0, actual)
	  }
	
	  return that
	}
	
	function fromArrayLike (that, array) {
	  var length = array.length < 0 ? 0 : checked(array.length) | 0
	  that = createBuffer(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}
	
	function fromArrayBuffer (that, array, byteOffset, length) {
	  array.byteLength // this throws if `array` is not a valid ArrayBuffer
	
	  if (byteOffset < 0 || array.byteLength < byteOffset) {
	    throw new RangeError('\'offset\' is out of bounds')
	  }
	
	  if (array.byteLength < byteOffset + (length || 0)) {
	    throw new RangeError('\'length\' is out of bounds')
	  }
	
	  if (byteOffset === undefined && length === undefined) {
	    array = new Uint8Array(array)
	  } else if (length === undefined) {
	    array = new Uint8Array(array, byteOffset)
	  } else {
	    array = new Uint8Array(array, byteOffset, length)
	  }
	
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = array
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromArrayLike(that, array)
	  }
	  return that
	}
	
	function fromObject (that, obj) {
	  if (Buffer.isBuffer(obj)) {
	    var len = checked(obj.length) | 0
	    that = createBuffer(that, len)
	
	    if (that.length === 0) {
	      return that
	    }
	
	    obj.copy(that, 0, 0, len)
	    return that
	  }
	
	  if (obj) {
	    if ((typeof ArrayBuffer !== 'undefined' &&
	        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
	      if (typeof obj.length !== 'number' || isnan(obj.length)) {
	        return createBuffer(that, 0)
	      }
	      return fromArrayLike(that, obj)
	    }
	
	    if (obj.type === 'Buffer' && isArray(obj.data)) {
	      return fromArrayLike(that, obj.data)
	    }
	  }
	
	  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
	}
	
	function checked (length) {
	  // Note: cannot use `length < kMaxLength()` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
	  }
	  return length | 0
	}
	
	function SlowBuffer (length) {
	  if (+length != length) { // eslint-disable-line eqeqeq
	    length = 0
	  }
	  return Buffer.alloc(+length)
	}
	
	Buffer.isBuffer = function isBuffer (b) {
	  return !!(b != null && b._isBuffer)
	}
	
	Buffer.compare = function compare (a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers')
	  }
	
	  if (a === b) return 0
	
	  var x = a.length
	  var y = b.length
	
	  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
	    if (a[i] !== b[i]) {
	      x = a[i]
	      y = b[i]
	      break
	    }
	  }
	
	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}
	
	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'latin1':
	    case 'binary':
	    case 'base64':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	}
	
	Buffer.concat = function concat (list, length) {
	  if (!isArray(list)) {
	    throw new TypeError('"list" argument must be an Array of Buffers')
	  }
	
	  if (list.length === 0) {
	    return Buffer.alloc(0)
	  }
	
	  var i
	  if (length === undefined) {
	    length = 0
	    for (i = 0; i < list.length; ++i) {
	      length += list[i].length
	    }
	  }
	
	  var buffer = Buffer.allocUnsafe(length)
	  var pos = 0
	  for (i = 0; i < list.length; ++i) {
	    var buf = list[i]
	    if (!Buffer.isBuffer(buf)) {
	      throw new TypeError('"list" argument must be an Array of Buffers')
	    }
	    buf.copy(buffer, pos)
	    pos += buf.length
	  }
	  return buffer
	}
	
	function byteLength (string, encoding) {
	  if (Buffer.isBuffer(string)) {
	    return string.length
	  }
	  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
	      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
	    return string.byteLength
	  }
	  if (typeof string !== 'string') {
	    string = '' + string
	  }
	
	  var len = string.length
	  if (len === 0) return 0
	
	  // Use a for loop to avoid recursion
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'latin1':
	      case 'binary':
	        return len
	      case 'utf8':
	      case 'utf-8':
	      case undefined:
	        return utf8ToBytes(string).length
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2
	      case 'hex':
	        return len >>> 1
	      case 'base64':
	        return base64ToBytes(string).length
	      default:
	        if (loweredCase) return utf8ToBytes(string).length // assume utf8
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	Buffer.byteLength = byteLength
	
	function slowToString (encoding, start, end) {
	  var loweredCase = false
	
	  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
	  // property of a typed array.
	
	  // This behaves neither like String nor Uint8Array in that we set start/end
	  // to their upper/lower bounds if the value passed is out of range.
	  // undefined is handled specially as per ECMA-262 6th Edition,
	  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
	  if (start === undefined || start < 0) {
	    start = 0
	  }
	  // Return early if start > this.length. Done here to prevent potential uint32
	  // coercion fail below.
	  if (start > this.length) {
	    return ''
	  }
	
	  if (end === undefined || end > this.length) {
	    end = this.length
	  }
	
	  if (end <= 0) {
	    return ''
	  }
	
	  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
	  end >>>= 0
	  start >>>= 0
	
	  if (end <= start) {
	    return ''
	  }
	
	  if (!encoding) encoding = 'utf8'
	
	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)
	
	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)
	
	      case 'ascii':
	        return asciiSlice(this, start, end)
	
	      case 'latin1':
	      case 'binary':
	        return latin1Slice(this, start, end)
	
	      case 'base64':
	        return base64Slice(this, start, end)
	
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)
	
	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	
	// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
	// Buffer instances.
	Buffer.prototype._isBuffer = true
	
	function swap (b, n, m) {
	  var i = b[n]
	  b[n] = b[m]
	  b[m] = i
	}
	
	Buffer.prototype.swap16 = function swap16 () {
	  var len = this.length
	  if (len % 2 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 16-bits')
	  }
	  for (var i = 0; i < len; i += 2) {
	    swap(this, i, i + 1)
	  }
	  return this
	}
	
	Buffer.prototype.swap32 = function swap32 () {
	  var len = this.length
	  if (len % 4 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 32-bits')
	  }
	  for (var i = 0; i < len; i += 4) {
	    swap(this, i, i + 3)
	    swap(this, i + 1, i + 2)
	  }
	  return this
	}
	
	Buffer.prototype.swap64 = function swap64 () {
	  var len = this.length
	  if (len % 8 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 64-bits')
	  }
	  for (var i = 0; i < len; i += 8) {
	    swap(this, i, i + 7)
	    swap(this, i + 1, i + 6)
	    swap(this, i + 2, i + 5)
	    swap(this, i + 3, i + 4)
	  }
	  return this
	}
	
	Buffer.prototype.toString = function toString () {
	  var length = this.length | 0
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	}
	
	Buffer.prototype.equals = function equals (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	}
	
	Buffer.prototype.inspect = function inspect () {
	  var str = ''
	  var max = exports.INSPECT_MAX_BYTES
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
	    if (this.length > max) str += ' ... '
	  }
	  return '<Buffer ' + str + '>'
	}
	
	Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
	  if (!Buffer.isBuffer(target)) {
	    throw new TypeError('Argument must be a Buffer')
	  }
	
	  if (start === undefined) {
	    start = 0
	  }
	  if (end === undefined) {
	    end = target ? target.length : 0
	  }
	  if (thisStart === undefined) {
	    thisStart = 0
	  }
	  if (thisEnd === undefined) {
	    thisEnd = this.length
	  }
	
	  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
	    throw new RangeError('out of range index')
	  }
	
	  if (thisStart >= thisEnd && start >= end) {
	    return 0
	  }
	  if (thisStart >= thisEnd) {
	    return -1
	  }
	  if (start >= end) {
	    return 1
	  }
	
	  start >>>= 0
	  end >>>= 0
	  thisStart >>>= 0
	  thisEnd >>>= 0
	
	  if (this === target) return 0
	
	  var x = thisEnd - thisStart
	  var y = end - start
	  var len = Math.min(x, y)
	
	  var thisCopy = this.slice(thisStart, thisEnd)
	  var targetCopy = target.slice(start, end)
	
	  for (var i = 0; i < len; ++i) {
	    if (thisCopy[i] !== targetCopy[i]) {
	      x = thisCopy[i]
	      y = targetCopy[i]
	      break
	    }
	  }
	
	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}
	
	// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
	// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
	//
	// Arguments:
	// - buffer - a Buffer to search
	// - val - a string, Buffer, or number
	// - byteOffset - an index into `buffer`; will be clamped to an int32
	// - encoding - an optional encoding, relevant is val is a string
	// - dir - true for indexOf, false for lastIndexOf
	function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
	  // Empty buffer means no match
	  if (buffer.length === 0) return -1
	
	  // Normalize byteOffset
	  if (typeof byteOffset === 'string') {
	    encoding = byteOffset
	    byteOffset = 0
	  } else if (byteOffset > 0x7fffffff) {
	    byteOffset = 0x7fffffff
	  } else if (byteOffset < -0x80000000) {
	    byteOffset = -0x80000000
	  }
	  byteOffset = +byteOffset  // Coerce to Number.
	  if (isNaN(byteOffset)) {
	    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
	    byteOffset = dir ? 0 : (buffer.length - 1)
	  }
	
	  // Normalize byteOffset: negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
	  if (byteOffset >= buffer.length) {
	    if (dir) return -1
	    else byteOffset = buffer.length - 1
	  } else if (byteOffset < 0) {
	    if (dir) byteOffset = 0
	    else return -1
	  }
	
	  // Normalize val
	  if (typeof val === 'string') {
	    val = Buffer.from(val, encoding)
	  }
	
	  // Finally, search either indexOf (if dir is true) or lastIndexOf
	  if (Buffer.isBuffer(val)) {
	    // Special case: looking for empty string/buffer always fails
	    if (val.length === 0) {
	      return -1
	    }
	    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
	  } else if (typeof val === 'number') {
	    val = val & 0xFF // Search for a byte value [0-255]
	    if (Buffer.TYPED_ARRAY_SUPPORT &&
	        typeof Uint8Array.prototype.indexOf === 'function') {
	      if (dir) {
	        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
	      } else {
	        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
	      }
	    }
	    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
	  }
	
	  throw new TypeError('val must be string, number or Buffer')
	}
	
	function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
	  var indexSize = 1
	  var arrLength = arr.length
	  var valLength = val.length
	
	  if (encoding !== undefined) {
	    encoding = String(encoding).toLowerCase()
	    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
	        encoding === 'utf16le' || encoding === 'utf-16le') {
	      if (arr.length < 2 || val.length < 2) {
	        return -1
	      }
	      indexSize = 2
	      arrLength /= 2
	      valLength /= 2
	      byteOffset /= 2
	    }
	  }
	
	  function read (buf, i) {
	    if (indexSize === 1) {
	      return buf[i]
	    } else {
	      return buf.readUInt16BE(i * indexSize)
	    }
	  }
	
	  var i
	  if (dir) {
	    var foundIndex = -1
	    for (i = byteOffset; i < arrLength; i++) {
	      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
	        if (foundIndex === -1) foundIndex = i
	        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
	      } else {
	        if (foundIndex !== -1) i -= i - foundIndex
	        foundIndex = -1
	      }
	    }
	  } else {
	    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
	    for (i = byteOffset; i >= 0; i--) {
	      var found = true
	      for (var j = 0; j < valLength; j++) {
	        if (read(arr, i + j) !== read(val, j)) {
	          found = false
	          break
	        }
	      }
	      if (found) return i
	    }
	  }
	
	  return -1
	}
	
	Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
	  return this.indexOf(val, byteOffset, encoding) !== -1
	}
	
	Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
	}
	
	Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
	}
	
	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0
	  var remaining = buf.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }
	
	  // must be an even number of digits
	  var strLen = string.length
	  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')
	
	  if (length > strLen / 2) {
	    length = strLen / 2
	  }
	  for (var i = 0; i < length; ++i) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16)
	    if (isNaN(parsed)) return i
	    buf[offset + i] = parsed
	  }
	  return i
	}
	
	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}
	
	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}
	
	function latin1Write (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}
	
	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}
	
	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}
	
	Buffer.prototype.write = function write (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8'
	    length = this.length
	    offset = 0
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset
	    length = this.length
	    offset = 0
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset | 0
	    if (isFinite(length)) {
	      length = length | 0
	      if (encoding === undefined) encoding = 'utf8'
	    } else {
	      encoding = length
	      length = undefined
	    }
	  // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    throw new Error(
	      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
	    )
	  }
	
	  var remaining = this.length - offset
	  if (length === undefined || length > remaining) length = remaining
	
	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('Attempt to write outside buffer bounds')
	  }
	
	  if (!encoding) encoding = 'utf8'
	
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)
	
	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)
	
	      case 'ascii':
	        return asciiWrite(this, string, offset, length)
	
	      case 'latin1':
	      case 'binary':
	        return latin1Write(this, string, offset, length)
	
	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)
	
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)
	
	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	
	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	}
	
	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf)
	  } else {
	    return base64.fromByteArray(buf.slice(start, end))
	  }
	}
	
	function utf8Slice (buf, start, end) {
	  end = Math.min(buf.length, end)
	  var res = []
	
	  var i = start
	  while (i < end) {
	    var firstByte = buf[i]
	    var codePoint = null
	    var bytesPerSequence = (firstByte > 0xEF) ? 4
	      : (firstByte > 0xDF) ? 3
	      : (firstByte > 0xBF) ? 2
	      : 1
	
	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint
	
	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte
	          }
	          break
	        case 2:
	          secondByte = buf[i + 1]
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 3:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 4:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          fourthByte = buf[i + 3]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint
	            }
	          }
	      }
	    }
	
	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD
	      bytesPerSequence = 1
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
	      codePoint = 0xDC00 | codePoint & 0x3FF
	    }
	
	    res.push(codePoint)
	    i += bytesPerSequence
	  }
	
	  return decodeCodePointsArray(res)
	}
	
	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000
	
	function decodeCodePointsArray (codePoints) {
	  var len = codePoints.length
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	  }
	
	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = ''
	  var i = 0
	  while (i < len) {
	    res += String.fromCharCode.apply(
	      String,
	      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
	    )
	  }
	  return res
	}
	
	function asciiSlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)
	
	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i] & 0x7F)
	  }
	  return ret
	}
	
	function latin1Slice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)
	
	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i])
	  }
	  return ret
	}
	
	function hexSlice (buf, start, end) {
	  var len = buf.length
	
	  if (!start || start < 0) start = 0
	  if (!end || end < 0 || end > len) end = len
	
	  var out = ''
	  for (var i = start; i < end; ++i) {
	    out += toHex(buf[i])
	  }
	  return out
	}
	
	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end)
	  var res = ''
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
	  }
	  return res
	}
	
	Buffer.prototype.slice = function slice (start, end) {
	  var len = this.length
	  start = ~~start
	  end = end === undefined ? len : ~~end
	
	  if (start < 0) {
	    start += len
	    if (start < 0) start = 0
	  } else if (start > len) {
	    start = len
	  }
	
	  if (end < 0) {
	    end += len
	    if (end < 0) end = 0
	  } else if (end > len) {
	    end = len
	  }
	
	  if (end < start) end = start
	
	  var newBuf
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = this.subarray(start, end)
	    newBuf.__proto__ = Buffer.prototype
	  } else {
	    var sliceLen = end - start
	    newBuf = new Buffer(sliceLen, undefined)
	    for (var i = 0; i < sliceLen; ++i) {
	      newBuf[i] = this[i + start]
	    }
	  }
	
	  return newBuf
	}
	
	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}
	
	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	
	  return val
	}
	
	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length)
	  }
	
	  var val = this[offset + --byteLength]
	  var mul = 1
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul
	  }
	
	  return val
	}
	
	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  return this[offset]
	}
	
	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return this[offset] | (this[offset + 1] << 8)
	}
	
	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return (this[offset] << 8) | this[offset + 1]
	}
	
	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	}
	
	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	}
	
	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	  mul *= 0x80
	
	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)
	
	  return val
	}
	
	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var i = byteLength
	  var mul = 1
	  var val = this[offset + --i]
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul
	  }
	  mul *= 0x80
	
	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)
	
	  return val
	}
	
	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	}
	
	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset] | (this[offset + 1] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}
	
	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset + 1] | (this[offset] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}
	
	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	}
	
	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	}
	
	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, true, 23, 4)
	}
	
	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, false, 23, 4)
	}
	
	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, true, 52, 8)
	}
	
	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, false, 52, 8)
	}
	
	function checkInt (buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	}
	
	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1
	    checkInt(this, value, offset, byteLength, maxBytes, 0)
	  }
	
	  var mul = 1
	  var i = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1
	    checkInt(this, value, offset, byteLength, maxBytes, 0)
	  }
	
	  var i = byteLength - 1
	  var mul = 1
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  this[offset] = (value & 0xff)
	  return offset + 1
	}
	
	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8
	  }
	}
	
	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}
	
	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
	  }
	}
	
	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 1] = (value >>> 8)
	    this[offset] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)
	
	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }
	
	  var i = 0
	  var mul = 1
	  var sub = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
	      sub = 1
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)
	
	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }
	
	  var i = byteLength - 1
	  var mul = 1
	  var sub = 0
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
	      sub = 1
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  if (value < 0) value = 0xff + value + 1
	  this[offset] = (value & 0xff)
	  return offset + 1
	}
	
	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 3] = (value >>> 24)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (value < 0) value = 0xffffffff + value + 1
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}
	
	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	  if (offset < 0) throw new RangeError('Index out of range')
	}
	
	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 23, 4)
	  return offset + 4
	}
	
	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	}
	
	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	}
	
	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 52, 8)
	  return offset + 8
	}
	
	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	}
	
	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	}
	
	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!start) start = 0
	  if (!end && end !== 0) end = this.length
	  if (targetStart >= target.length) targetStart = target.length
	  if (!targetStart) targetStart = 0
	  if (end > 0 && end < start) end = start
	
	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0
	
	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')
	
	  // Are we oob?
	  if (end > this.length) end = this.length
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start
	  }
	
	  var len = end - start
	  var i
	
	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; --i) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; ++i) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else {
	    Uint8Array.prototype.set.call(
	      target,
	      this.subarray(start, start + len),
	      targetStart
	    )
	  }
	
	  return len
	}
	
	// Usage:
	//    buffer.fill(number[, offset[, end]])
	//    buffer.fill(buffer[, offset[, end]])
	//    buffer.fill(string[, offset[, end]][, encoding])
	Buffer.prototype.fill = function fill (val, start, end, encoding) {
	  // Handle string cases:
	  if (typeof val === 'string') {
	    if (typeof start === 'string') {
	      encoding = start
	      start = 0
	      end = this.length
	    } else if (typeof end === 'string') {
	      encoding = end
	      end = this.length
	    }
	    if (val.length === 1) {
	      var code = val.charCodeAt(0)
	      if (code < 256) {
	        val = code
	      }
	    }
	    if (encoding !== undefined && typeof encoding !== 'string') {
	      throw new TypeError('encoding must be a string')
	    }
	    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
	      throw new TypeError('Unknown encoding: ' + encoding)
	    }
	  } else if (typeof val === 'number') {
	    val = val & 255
	  }
	
	  // Invalid ranges are not set to a default, so can range check early.
	  if (start < 0 || this.length < start || this.length < end) {
	    throw new RangeError('Out of range index')
	  }
	
	  if (end <= start) {
	    return this
	  }
	
	  start = start >>> 0
	  end = end === undefined ? this.length : end >>> 0
	
	  if (!val) val = 0
	
	  var i
	  if (typeof val === 'number') {
	    for (i = start; i < end; ++i) {
	      this[i] = val
	    }
	  } else {
	    var bytes = Buffer.isBuffer(val)
	      ? val
	      : utf8ToBytes(new Buffer(val, encoding).toString())
	    var len = bytes.length
	    for (i = 0; i < end - start; ++i) {
	      this[i + start] = bytes[i % len]
	    }
	  }
	
	  return this
	}
	
	// HELPER FUNCTIONS
	// ================
	
	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g
	
	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '='
	  }
	  return str
	}
	
	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}
	
	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}
	
	function utf8ToBytes (string, units) {
	  units = units || Infinity
	  var codePoint
	  var length = string.length
	  var leadSurrogate = null
	  var bytes = []
	
	  for (var i = 0; i < length; ++i) {
	    codePoint = string.charCodeAt(i)
	
	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        }
	
	        // valid lead
	        leadSurrogate = codePoint
	
	        continue
	      }
	
	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	        leadSurrogate = codePoint
	        continue
	      }
	
	      // valid surrogate pair
	      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	    }
	
	    leadSurrogate = null
	
	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint)
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }
	
	  return bytes
	}
	
	function asciiToBytes (str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; ++i) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF)
	  }
	  return byteArray
	}
	
	function utf16leToBytes (str, units) {
	  var c, hi, lo
	  var byteArray = []
	  for (var i = 0; i < str.length; ++i) {
	    if ((units -= 2) < 0) break
	
	    c = str.charCodeAt(i)
	    hi = c >> 8
	    lo = c % 256
	    byteArray.push(lo)
	    byteArray.push(hi)
	  }
	
	  return byteArray
	}
	
	function base64ToBytes (str) {
	  return base64.toByteArray(base64clean(str))
	}
	
	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; ++i) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i]
	  }
	  return i
	}
	
	function isnan (val) {
	  return val !== val // eslint-disable-line no-self-compare
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),

/***/ 121:
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(55)(undefined);
	// imports
	
	
	// module
	exports.push([module.id, ".flatpickr-input,.flatpickr-wrapper input{z-index:1;cursor:pointer}.flatpickr-wrapper{position:absolute;display:none}.flatpickr-wrapper.inline,.flatpickr-wrapper.inline .flatpickr-calendar,.flatpickr-wrapper.static{position:relative}.flatpickr-wrapper.static .flatpickr-calendar{position:absolute}.flatpickr-wrapper.inline,.flatpickr-wrapper.open{display:inline-block}.flatpickr-wrapper.inline .flatpickr-calendar,.flatpickr-wrapper.open .flatpickr-calendar{z-index:99999;visibility:visible}.flatpickr-calendar{background:#fff;border:1px solid #ddd;font-size:90%;border-radius:3px;position:absolute;top:100%;left:0;visibility:hidden;width:256px}.flatpickr-calendar.hasWeeks{width:288px}.flatpickr-calendar.hasWeeks .flatpickr-weekdays span{width:12.5%}.flatpickr-calendar:after,.flatpickr-calendar:before{position:absolute;display:block;pointer-events:none;border:solid transparent;content:'';height:0;width:0;left:22px}.flatpickr-calendar:before{border-width:5px;margin:0 -5px}.flatpickr-calendar:after{border-width:4px;margin:0 -4px}.flatpickr-calendar.arrowTop:after,.flatpickr-calendar.arrowTop:before{bottom:100%}.flatpickr-calendar.arrowTop:before{border-bottom-color:#ddd}.flatpickr-calendar.arrowTop:after{border-bottom-color:#fff}.flatpickr-calendar.arrowBottom:after,.flatpickr-calendar.arrowBottom:before{top:100%}.flatpickr-calendar.arrowBottom:before{border-top-color:#ddd}.flatpickr-calendar.arrowBottom:after{border-top-color:#fff}.flatpickr-month{background:0 0;color:#000;padding:4px 5px 2px;text-align:center;position:relative}.flatpickr-next-month,.flatpickr-prev-month{text-decoration:none;cursor:pointer;position:absolute;top:.5rem}.flatpickr-next-month i,.flatpickr-prev-month i{position:relative}.flatpickr-next-month:hover,.flatpickr-prev-month:hover{color:#f99595}.flatpickr-prev-month{float:left;left:.5rem}.flatpickr-next-month{float:right;right:.5rem}.flatpickr-current-month{font-size:135%;font-weight:300;color:rgba(0,0,0,.7);display:inline-block}.flatpickr-current-month .cur_month{font-weight:700;color:#000}.flatpickr-current-month .cur_year{background:0 0;box-sizing:border-box;color:inherit;cursor:default;padding:0 0 0 2px;margin:0;width:3.15em;display:inline;font-size:inherit;font-weight:300;line-height:inherit;height:initial;border:0}.flatpickr-current-month .cur_year:hover{background:rgba(0,0,0,.05)}.flatpickr-weekdays{font-size:90%;background:0 0;padding:2px 0 4px;text-align:center}.flatpickr-weekdays span{opacity:.54;text-align:center;display:inline-block;width:14.28%;font-weight:700}.flatpickr-weeks{width:32px;float:left}.flatpickr-days{padding-top:1px;outline:0}.flatpickr-days span,.flatpickr-weeks span{background:0 0;border:1px solid transparent;border-radius:150px;box-sizing:border-box;color:#393939;cursor:pointer;display:inline-block;font-weight:300;width:34px;height:34px;line-height:33px;margin:0 1px 1px;text-align:center}.flatpickr-days span.disabled,.flatpickr-days span.disabled:hover,.flatpickr-days span.nextMonthDay,.flatpickr-days span.prevMonthDay,.flatpickr-weeks span.disabled,.flatpickr-weeks span.disabled:hover,.flatpickr-weeks span.nextMonthDay,.flatpickr-weeks span.prevMonthDay{color:rgba(57,57,57,.3);background:0 0;border-color:transparent;cursor:default}.flatpickr-days span.nextMonthDay:focus,.flatpickr-days span.nextMonthDay:hover,.flatpickr-days span.prevMonthDay:focus,.flatpickr-days span.prevMonthDay:hover,.flatpickr-days span:focus,.flatpickr-days span:hover,.flatpickr-weeks span.nextMonthDay:focus,.flatpickr-weeks span.nextMonthDay:hover,.flatpickr-weeks span.prevMonthDay:focus,.flatpickr-weeks span.prevMonthDay:hover,.flatpickr-weeks span:focus,.flatpickr-weeks span:hover{cursor:pointer;outline:0;background:#e6e6e6;border-color:#e6e6e6}.flatpickr-days span.today,.flatpickr-weeks span.today{border-color:#f99595}.flatpickr-days span.today:focus,.flatpickr-days span.today:hover,.flatpickr-weeks span.today:focus,.flatpickr-weeks span.today:hover{border-color:#f99595;background:#f99595;color:#fff}.flatpickr-days span.selected,.flatpickr-days span.selected:focus,.flatpickr-days span.selected:hover,.flatpickr-weeks span.selected,.flatpickr-weeks span.selected:focus,.flatpickr-weeks span.selected:hover{background:#446cb3;color:#fff;border-color:#446cb3}.flatpickr-am-pm,.flatpickr-time input[type=number],.flatpickr-time-separator{height:38px;display:inline-block;line-height:38px;color:#393939}.flatpickr-time{overflow:auto;text-align:center;border-top:0;outline:0}.flatpickr-time input[type=number]{background:0 0;-webkit-appearance:none;-moz-appearance:textfield;box-shadow:none;border:0;border-radius:0;width:33%;min-width:33%;text-align:center;margin:0;padding:0;cursor:pointer;font-weight:700}.flatpickr-am-pm:focus,.flatpickr-am-pm:hover,.flatpickr-time input[type=number]:focus,.flatpickr-time input[type=number]:hover{background:#f0f0f0}.flatpickr-time input[type=number].flatpickr-minute{width:26%;font-weight:300}.flatpickr-time input[type=number].flatpickr-second{font-weight:300}.flatpickr-time input[type=number]:focus{outline:0;border:0}.flatpickr-time.has-seconds input[type=number]{width:25%;min-width:25%}.flatpickr-days+.flatpickr-time{border-top:1px solid #ddd}.flatpickr-am-pm{outline:0;width:21%;padding:0 2%;cursor:pointer;text-align:left;font-weight:300}@media all and (-ms-high-contrast:none){.flatpickr-month{padding:0}}", ""]);
	
	// exports


/***/ }),

/***/ 122:
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(55)(undefined);
	// imports
	exports.i(__webpack_require__(121), "");
	
	// module
	exports.push([module.id, "/*\n * IMPORTANT:\n * In order to preserve the uniform grid appearance, all cell styles need to have padding, margin and border sizes.\n * No built-in (selected, editable, highlight, flashing, invalid, loading, :focus) or user-specified CSS\n * classes should alter those!\n */\n.slickgrid-container {\n  overflow: hidden;\n  outline: 0;\n  position: relative;\n  box-sizing: content-box;\n}\n.slickgrid-container .slick-group-header-columns {\n  position: relative;\n  white-space: nowrap;\n  cursor: default;\n  overflow: hidden;\n}\n.slickgrid-container .slick-group-header {\n  width: 100%;\n  overflow: hidden;\n  border-left: 0px;\n}\n.slickgrid-container .slick-group-header-column.ui-state-default {\n  position: relative;\n  display: inline-block;\n  overflow: hidden;\n  -o-text-overflow: ellipsis;\n  text-overflow: ellipsis;\n  height: 16px;\n  line-height: 16px;\n  margin: 0;\n  padding: 4px;\n  border: 1px solid #D6D7D6;\n  order-left: 0px;\n  border-top: 0px;\n  border-bottom: 0px;\n  float: left;\n}\n.slickgrid-container .slick-viewport,\n.slickgrid-container .slick-top-panel-scroller,\n.slickgrid-container .slick-header,\n.slickgrid-container .slick-headerrow,\n.slickgrid-container .slick-footerrow {\n  position: relative;\n  width: 100%;\n  border: 1px solid #D6D7D6;\n  border-right-color: transparent;\n  border-bottom-color: transparent;\n  border-right-width: 0;\n  border-bottom-width: 0;\n  margin: 0;\n  outline: 0;\n}\n.slickgrid-container .slick-viewport {\n  overflow: auto;\n}\n.slickgrid-container .slick-viewport.slickgrid-container .slick-viewport::-webkit-scrollbar {\n  -webkit-appearance: none;\n}\n.slickgrid-container .slick-viewport.slickgrid-container .slick-viewport::-webkit-scrollbar-thumb {\n  border-radius: 4px;\n  border: 2px solid white;\n  /* should match background, can't be transparent */\n  background-color: rgba(0, 0, 0, 0.5);\n}\n.slickgrid-container .slick-header,\n.slickgrid-container .slick-headerrow,\n.slickgrid-container .slick-footerrow {\n  overflow: hidden;\n}\n.slickgrid-container .slick-headerrow {\n  border-top-color: transparent;\n  border-top-width: 0;\n}\n.slickgrid-container .slick-top-panel,\n.slickgrid-container .slick-header-columns,\n.slickgrid-container .slick-headerrow-columns,\n.slickgrid-container .slick-footerrow-columns {\n  position: relative;\n  white-space: nowrap;\n  cursor: default;\n  overflow: hidden;\n  margin: 0;\n  padding: 0;\n  border: 0;\n  outline: 0;\n}\n.slickgrid-container .slick-cell,\n.slickgrid-container .slick-header-column,\n.slickgrid-container .slick-headerrow-column,\n.slickgrid-container .slick-footerrow-column {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  border: 1px solid #D6D7D6;\n  border-top-color: transparent;\n  border-left-color: transparent;\n  border-top-width: 0;\n  border-left-width: 0;\n  margin: 0;\n  padding: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  vertical-align: middle;\n  z-index: 1;\n  white-space: nowrap;\n  cursor: default;\n}\n.slickgrid-container .slick-cell.slick-header-is-leaf,\n.slickgrid-container .slick-header-column.slick-header-is-leaf,\n.slickgrid-container .slick-headerrow-column.slick-header-is-leaf,\n.slickgrid-container .slick-footerrow-column.slick-header-is-leaf {\n  border-bottom-color: transparent;\n  border-bottom-width: 0;\n}\n.slickgrid-container .slick-header-column.ui-state-default {\n  position: relative;\n  display: inline-block;\n  box-sizing: content-box !important;\n  overflow: hidden;\n  -o-text-overflow: ellipsis;\n  text-overflow: ellipsis;\n  height: 16px;\n  line-height: 16px;\n  margin: 0;\n  padding: 4px;\n  border-right: 1px solid #D6D7D6;\n  border-left: 0px !important;\n  border-top: 0px !important;\n  border-bottom: 0px !important;\n  float: left;\n}\n.slickgrid-container .slick-cell {\n  box-sizing: border-box;\n  border-style: solid;\n  padding: 1px 2px 1px 2px;\n}\n.slickgrid-container .slick-header-column {\n  padding: 4px 4px 4px 4px;\n}\n.slickgrid-container .grid-canvas {\n  position: relative;\n  outline: 0;\n}\n.slickgrid-container .slick-row {\n  position: absolute;\n  border: 0;\n  width: 100%;\n}\n.slickgrid-container .slick-header-column-sorted {\n  font-style: italic;\n}\n.slickgrid-container .slick-sort-indicator {\n  display: inline-block;\n  width: 8px;\n  height: 5px;\n  margin-left: 4px;\n  margin-top: 6px;\n  position: absolute;\n  left: 0;\n}\n.slickgrid-container .slick-sort-indicator-desc {\n  background: url(" + __webpack_require__(142) + ");\n}\n.slickgrid-container .slick-sort-indicator-asc {\n  background: url(" + __webpack_require__(141) + ");\n}\n.slickgrid-container .slick-header-sortable .slick-column-name {\n  margin-left: 10px;\n}\n.slickgrid-container .slick-header.ui-state-default {\n  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);\n}\n.slickgrid-container .slick-column-name {\n  text-overflow: ellipsis;\n}\n.slickgrid-container .slick-resizable-handle {\n  position: absolute;\n  font-size: 0.1px;\n  display: block;\n  cursor: col-resize;\n  width: 4px;\n  right: 0;\n  top: 0;\n  height: 100%;\n}\n.slickgrid-container .slick-resizable-handle-hover {\n  background-color: #ccc;\n}\n.slickgrid-container .slick-sortable-placeholder {\n  background: silver;\n}\n.slickgrid-container .slick-group-toggle {\n  display: inline-block;\n}\n.slickgrid-container .slick-cell.highlighted {\n  background: lightskyblue;\n  background: rgba(0, 0, 255, 0.2);\n  transition: all 0.5s;\n}\n.slickgrid-container .slick-cell.flashing {\n  border: 1px solid red !important;\n}\n.slickgrid-container .slick-cell.editable {\n  z-index: 11;\n  overflow: visible;\n  background: white;\n  border-color: black;\n  border-style: solid;\n}\n.slickgrid-container .slick-cell:focus {\n  outline: none;\n}\n.slickgrid-container .slick-reorder-proxy {\n  display: inline-block;\n  background: blue;\n  opacity: 0.15;\n  cursor: move;\n}\n.slickgrid-container .slick-reorder-guide {\n  display: inline-block;\n  height: 2px;\n  background: blue;\n  opacity: 0.7;\n}\n.slickgrid-container .slick-selection {\n  z-index: 10;\n  position: absolute;\n  border: 2px dashed black;\n}\n.slickgrid-container .slick-pane {\n  position: absolute;\n  outline: 0;\n  overflow: hidden;\n  width: 100%;\n}\n.flatpickr-wrapper {\n  z-index: 10000;\n}\n.interact-placeholder {\n  background: red !important;\n  display: inline-block;\n  float: left;\n  transform: translate(0px, -100%);\n}\n.interact-drop-active {\n  box-shadow: inset 0 0 8px rgba(7, 67, 128, 0.5);\n}\n.interact-can-drop {\n  opacity: .9;\n}\n.scrollbar-fix::-webkit-scrollbar {\n  -webkit-appearance: none;\n}\n/*\n * IMPORTANT:\n * In order to preserve the uniform grid appearance, all cell styles need to have padding, margin and border sizes.\n * No built-in (selected, editable, highlight, flashing, invalid, loading, :focus) or user-specified CSS\n * classes should alter those!\n */\n.slickgrid-container .slick-header-columns,\n.slickgrid-container .slick-header-column {\n  background: #F7F7F6;\n}\n.slickgrid-container .slick-header-columns {\n  border-bottom: 1px solid #D6D7D6;\n}\n.slickgrid-container .slick-header-column {\n  border-right: 1px solid #D6D7D6;\n  border-bottom: 1px solid #D6D7D6;\n}\n.slickgrid-container .slick-header-column:hover {\n  background: #f2f2f1;\n}\n.slickgrid-container .slick-header-column-active {\n  background: #ebebe9 !important;\n}\n.slickgrid-container .slick-headerrow {\n  background: #F7F7F6;\n}\n.slickgrid-container .slick-headerrow-column {\n  background: #fafafa;\n  border-bottom: 0;\n}\n.slickgrid-container .grid-canvas {\n  background: white;\n}\n.slickgrid-container .slick-row {\n  background: white;\n  border: 0;\n  line-height: 20px;\n}\n.slickgrid-container .slick-row .slick-cell {\n  background: white;\n  padding-top: 4px;\n  padding-bottom: 4px;\n  padding-left: 4px;\n  padding-right: 4px;\n  box-sizing: border-box;\n}\n.slickgrid-container .slick-row .slick-cell.invalid {\n  border-color: red;\n  -moz-animation-duration: 0.2s;\n  -webkit-animation-duration: 0.2s;\n  -moz-animation-name: slickgrid-invalid-hilite;\n  -webkit-animation-name: slickgrid-invalid-hilite;\n}\n.slickgrid-container .slick-row .slick-cell.selected {\n  background-color: #f2f2f2;\n}\n.slickgrid-container .slick-row .slick-cell.active {\n  border-color: rgba(0, 0, 0, 0.3);\n  border-style: solid;\n  border-width: 1px;\n  padding-top: 2px;\n  padding-left: 3px;\n}\n.slickgrid-container .slick-row .slick-cell.active input.editor-text {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  border: 0;\n  margin: 0;\n  background: transparent;\n  padding: 2px 3px 2px 3px;\n  transform: translate(-3px, -2px);\n}\n.slickgrid-container .slick-row.odd .slick-cell {\n  background: #fafafa;\n}\n.slickgrid-container .slick-row.odd .slick-cell.selected {\n  background-color: #f2f2f2;\n}\n.slickgrid-container .slick-row.active-row .slick-cell {\n  background-color: #e2fffd;\n}\n.slickgrid-container .slick-row.active-row .slick-cell.selected {\n  background-color: #f2f2f2;\n}\n.slickgrid-container .slick-row.active-row.odd .slick-cell {\n  background-color: #e2fffd;\n}\n.slickgrid-container .slick-row.active-row.odd .slick-cell.selected {\n  background-color: green;\n}\n.slickgrid-container .slick-row.loading {\n  opacity: 0.5;\n}\n.slickgrid-container .slick-group {\n  border-bottom: 2px solid silver;\n}\n.slickgrid-container .slick-group-toggle {\n  width: 9px;\n  height: 9px;\n  margin-right: 5px;\n}\n.slickgrid-container .slick-group-toggle.expanded {\n  background: url(" + __webpack_require__(137) + ") no-repeat center center;\n}\n.slickgrid-container .slick-group-toggle.collapsed {\n  background: url(" + __webpack_require__(139) + ") no-repeat center center;\n}\n.slickgrid-container .slick-group-totals {\n  color: gray;\n  background: white;\n}\n.slickgrid-container .slick-sortable-placeholder {\n  background: silver !important;\n}\n@-moz-keyframes slickgrid-invalid-hilite {\n  from {\n    box-shadow: 0 0 6px red;\n  }\n  to {\n    box-shadow: none;\n  }\n}\n@-webkit-keyframes slickgrid-invalid-hilite {\n  from {\n    box-shadow: 0 0 6px red;\n  }\n  to {\n    box-shadow: none;\n  }\n}\n.slickgrid-container .slick-header-menubutton {\n  background-position: center center;\n  background-repeat: no-repeat;\n  border-left: thin ridge silver;\n  cursor: pointer;\n  display: inline-block;\n  position: absolute;\n}\n.slickgrid-container .slick-header-menu {\n  background: none repeat scroll 0 0 white;\n  border: 1px solid #BFBDBD;\n  min-width: 175px;\n  padding: 4px;\n  z-index: 100000;\n  cursor: default;\n  display: inline-block;\n  margin: 0;\n  position: absolute;\n}\n.slickgrid-container .slick-header-menu button {\n  border: 1px solid #BFBDBD;\n  background-color: white;\n  width: 45px;\n  padding: 4px;\n  margin: 4px 4px 4px 0;\n}\n.slickgrid-container .slick-header-menu .filter {\n  border: 1px solid #BFBDBD;\n  font-size: 8pt;\n  height: 400px;\n  margin-top: 6px;\n  overflow: scroll;\n  padding: 4px;\n  white-space: nowrap;\n  width: 200px;\n}\n.slickgrid-container .slick-header-menu .textfilter > label {\n  display: inline-block;\n  margin-left: 5px;\n  margin-right: 10px;\n}\n.slickgrid-container .slick-header-menu .textfilter > input[type=text] {\n  width: 70%;\n}\n.slickgrid-container label {\n  display: block;\n  margin-bottom: 5px;\n}\n.slickgrid-container .slick-header-menuitem {\n  border: 1px solid transparent;\n  padding: 2px 4px;\n  cursor: pointer;\n  list-style: none outside none;\n  margin: 0;\n}\n.slickgrid-container .slick-header-menuicon {\n  background-position: center center;\n  background-repeat: no-repeat;\n  display: inline-block;\n  height: 16px;\n  margin-right: 4px;\n  vertical-align: middle;\n  width: 16px;\n}\n.slickgrid-container .slick-header-menucontent {\n  display: inline-block;\n  vertical-align: middle;\n}\n.slickgrid-container .slick-header-menuitem:hover {\n  border-color: #BFBDBD;\n}\n.slickgrid-container .header-overlay,\n.slickgrid-container .cell-overlay,\n.slickgrid-container .selection-cell-overlay {\n  display: block;\n  position: absolute;\n  z-index: 999;\n}\n.slickgrid-container .slick-cell > .editor-select {\n  position: absolute;\n  left: 0;\n  right: 0;\n  width: auto;\n  top: 0;\n  bottom: 0;\n  max-width: 100%;\n  min-width: 0;\n  margin: 0;\n}\n.slickgrid-container .slick-range-decorator {\n  z-index: 100;\n  pointer-events: none;\n  background: transparent;\n  border: none;\n  outline: black;\n}\ndiv.slick-large-editor-text {\n  z-index: 10000;\n  position: absolute;\n  background: #ffffff;\n  padding: 5px;\n  border: 1px solid rgba(0, 0, 0, 0.5);\n  box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.3);\n}\ndiv.slick-large-editor-text textarea {\n  backround: transparent;\n  width: 250px;\n  height: 80px;\n  border: 0;\n  outline: 0;\n}\ndiv.slick-large-editor-text div {\n  text-align: right;\n}\ndiv.slick-large-editor-text div button {\n  background-color: #e6e6e6;\n  border: 1px solid #D6D7D6;\n  cursor: pointer;\n  justify-content: center;\n  padding-left: 0.75em;\n  padding-right: 0.75em;\n  text-align: center;\n  white-space: nowrap;\n}\n.container {\n  margin-top: 20px;\n}\n#myGrid {\n  background: white;\n  outline: 0;\n  border: 1px solid #D6D7D6;\n}\n.grid-header label {\n  display: inline-block;\n  font-weight: bold;\n  margin: auto auto auto 6px;\n}\n.grid-header .ui-icon {\n  margin: 4px 4px auto 6px;\n  background-color: transparent;\n  border-color: transparent;\n}\n.grid-header .ui-icon.ui-state-hover {\n  background-color: white;\n}\n.grid-header #txtSearch {\n  margin: 0 4px 0 4px;\n  padding: 2px 2px;\n  -moz-border-radius: 2px;\n  -webkit-border-radius: 2px;\n  border: 1px solid silver;\n}\n.options-panel {\n  -moz-border-radius: 6px;\n  -webkit-border-radius: 6px;\n  border: 1px solid silver;\n  background: #f0f0f0;\n  padding: 4px;\n  margin-bottom: 20px;\n  width: 320px;\n  position: absolute;\n  top: 0px;\n  left: 650px;\n}\n/* Individual cell styles */\n.slick-cell.task-name {\n  font-weight: bold;\n  text-align: right;\n}\n.slick-cell.task-percent {\n  text-align: right;\n}\n.slick-cell.cell-move-handle {\n  font-weight: bold;\n  text-align: right;\n  border-right: solid gray;\n  background: #efefef;\n  cursor: move;\n}\n.cell-move-handle:hover {\n  background: #b6b9bd;\n}\n.slick-row.selected .cell-move-handle {\n  background: #D5DC8D;\n}\n.slick-row .cell-actions {\n  text-align: left;\n}\n.slick-row.complete {\n  background-color: #DFD;\n  color: #555;\n}\n.percent-complete-bar {\n  display: inline-block;\n  height: 6px;\n  -moz-border-radius: 3px;\n  -webkit-border-radius: 3px;\n}\n/* Slick.Editors.Text, Slick.Editors.Date */\n.ui-datepicker-trigger {\n  margin-top: 2px;\n  padding: 0;\n  vertical-align: top;\n}\n/* Slick.Editors.PercentComplete */\ninput.editor-percentcomplete {\n  width: 100%;\n  height: 100%;\n  border: 0;\n  margin: 0;\n  background: transparent;\n  outline: 0;\n  padding: 0;\n  float: left;\n}\n.editor-percentcomplete-picker {\n  position: relative;\n  display: inline-block;\n  width: 16px;\n  height: 100%;\n  background: url(" + __webpack_require__(140) + ") no-repeat center center;\n  overflow: visible;\n  z-index: 1000;\n  float: right;\n}\n.editor-percentcomplete-helper {\n  border: 0 solid gray;\n  position: absolute;\n  top: -2px;\n  left: -9px;\n  background: url(" + __webpack_require__(138) + ") no-repeat top left;\n  padding-left: 9px;\n  width: 120px;\n  height: 140px;\n  display: none;\n  overflow: visible;\n}\n.editor-percentcomplete-wrapper {\n  background: beige;\n  padding: 20px 8px;\n  width: 100%;\n  height: 98px;\n  border: 1px solid gray;\n  border-left: 0;\n}\n.editor-percentcomplete-buttons {\n  float: right;\n}\n.editor-percentcomplete-buttons button {\n  width: 80px;\n}\n.editor-percentcomplete-slider {\n  float: left;\n}\n.editor-percentcomplete-picker:hover .editor-percentcomplete-helper {\n  display: block;\n}\n.editor-percentcomplete-helper:hover {\n  display: block;\n}\n/* Slick.Editors.YesNoSelect */\nselect.editor-yesno {\n  width: 100%;\n  margin: 0;\n  vertical-align: middle;\n}\n/* Slick.Editors.Checkbox */\ninput.editor-checkbox {\n  margin: 0;\n  height: 100%;\n  padding: 0;\n  border: 0;\n}\n.frozen {\n  background: #eeeeee;\n}\n", ""]);
	
	// exports


/***/ }),

/***/ 137:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/_/slickgrid-es6/images/collapse.gif";

/***/ }),

/***/ 138:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/_/slickgrid-es6/images/editor-helper-bg.gif";

/***/ }),

/***/ 139:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/_/slickgrid-es6/images/expand.gif";

/***/ }),

/***/ 140:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/_/slickgrid-es6/images/pencil.gif";

/***/ }),

/***/ 141:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/_/slickgrid-es6/images/sort-asc.png";

/***/ }),

/***/ 142:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "images/_/slickgrid-es6/images/sort-desc.png";

/***/ }),

/***/ 143:
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var flatpickr = function flatpickr(selector, config) {
		var elements = void 0;
	
		var createInstance = function createInstance(element) {
			if (element._flatpickr) {
				element._flatpickr.destroy();
			}
	
			element._flatpickr = new flatpickr.init(element, config);
			return element._flatpickr;
		};
	
		if (selector.nodeName) {
			return createInstance(selector);
		}
		/*
	 Utilize the performance of native getters if applicable
	 https://jsperf.com/getelementsbyclassname-vs-queryselectorall/18
	 https://jsperf.com/jquery-vs-javascript-performance-comparison/22
	 */
		else if (/^#[a-zA-Z0-9\-_]*$/.test(selector)) {
				return createInstance(document.getElementById(selector.slice(1)));
			} else if (/^\.[a-zA-Z0-9\-_]*$/.test(selector)) {
				elements = document.getElementsByClassName(selector.slice(1));
			} else {
				elements = document.querySelectorAll(selector);
			}
	
		var instances = [];
	
		for (var i = 0; i < elements.length; i++) {
			instances.push(createInstance(elements[i]));
		}
	
		if (instances.length === 1) {
			return instances[0];
		}
	
		return {
			calendars: instances,
			byID: function byID(id) {
				return document.getElementById(id)._flatpickr;
			}
		};
	};
	
	/**
	 * @constructor
	 */
	flatpickr.init = function (element, instanceConfig) {
		function createElement(tag, className, content) {
			var newElement = document.createElement(tag);
	
			if (content) {
				newElement.textContent = content;
			}
	
			if (className) {
				newElement.className = className;
			}
	
			return newElement;
		}
	
		var debounce = function debounce(func, wait, immediate) {
			var timeout = void 0;
			return function () {
				for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
					args[_key] = arguments[_key];
				}
	
				var context = this;
	
				var later = function later() {
					timeout = null;
					if (!immediate) {
						func.apply(context, args);
					}
				};
	
				clearTimeout(timeout);
				timeout = setTimeout(later, wait);
				if (immediate && !timeout) {
					func.apply(context, args);
				}
			};
		};
	
		// functions
		var self = this;
		var parseConfig = void 0,
		    init = void 0,
		    wrap = void 0,
		    uDate = void 0,
		    equalDates = void 0,
		    pad = void 0,
		    monthToStr = void 0,
		    isEnabled = void 0,
		    buildMonthNavigation = void 0,
		    buildWeekdays = void 0,
		    buildCalendar = void 0,
		    buildDays = void 0,
		    buildWeeks = void 0,
		    buildTime = void 0,
		    timeWrapper = void 0,
		    yearScroll = void 0,
		    updateValue = void 0,
		    amPMToggle = void 0,
		    onKeyDown = void 0,
		    onResize = void 0,
		    updateNavigationCurrentMonth = void 0,
		    handleYearChange = void 0,
		    changeMonth = void 0,
		    getDaysinMonth = void 0,
		    documentClick = void 0,
		    selectDate = void 0,
		    getRandomCalendarIdStr = void 0,
		    bind = void 0,
		    triggerChange = void 0;
	
		// elements & variables
		var calendarContainer = void 0,
		    weekdayContainer = void 0,
		    timeContainer = void 0,
		    navigationCurrentMonth = void 0,
		    monthsNav = void 0,
		    prevMonthNav = void 0,
		    currentYearElement = void 0,
		    currentMonthElement = void 0,
		    nextMonthNav = void 0,
		    calendar = void 0,
		    weekNumbers = void 0,
		    now = new Date(),
		    wrapperElement = void 0,
		    clickEvt = void 0;
	
		self.formats = {
			// weekday name, short, e.g. Thu
			D: function D() {
				return self.l10n.weekdays.shorthand[self.formats.w()];
			},
	
			// full month name e.g. January
			F: function F() {
				return monthToStr(self.formats.n() - 1, false);
			},
	
			// hours with leading zero e.g. 03
			H: function H() {
				return pad(self.selectedDateObj.getHours());
			},
	
			// day (1-30) with ordinal suffix e.g. 1st, 2nd
			J: function J() {
				return self.formats.j() + self.l10n.ordinal(self.formats.j());
			},
	
			// AM/PM
			K: function K() {
				return self.selectedDateObj.getHours() > 11 ? "PM" : "AM";
			},
	
			// shorthand month e.g. Jan, Sep, Oct, etc
			M: function M() {
				return monthToStr(self.formats.n() - 1, true);
			},
	
			// seconds 00-59
			S: function S() {
				return pad(self.selectedDateObj.getSeconds());
			},
	
			// unix timestamp
			U: function U() {
				return self.selectedDateObj.getTime() / 1000;
			},
	
			// full year e.g. 2016
			Y: function Y() {
				return self.selectedDateObj.getFullYear();
			},
	
			// day in month, padded (01-30)
			d: function d() {
				return pad(self.formats.j());
			},
	
			// hour from 1-12 (am/pm)
			h: function h() {
				return self.selectedDateObj.getHours() % 12 ? self.selectedDateObj.getHours() % 12 : 12;
			},
	
			// minutes, padded with leading zero e.g. 09
			i: function i() {
				return pad(self.selectedDateObj.getMinutes());
			},
	
			// day in month (1-30)
			j: function j() {
				return self.selectedDateObj.getDate();
			},
	
			// weekday name, full, e.g. Thursday
			l: function l() {
				return self.l10n.weekdays.longhand[self.formats.w()];
			},
	
			// padded month number (01-12)
			m: function m() {
				return pad(self.formats.n());
			},
	
			// the month number (1-12)
			n: function n() {
				return self.selectedDateObj.getMonth() + 1;
			},
	
			// seconds 0-59
			s: function s() {
				return self.selectedDateObj.getSeconds();
			},
	
			// number of the day of the week
			w: function w() {
				return self.selectedDateObj.getDay();
			},
	
			// last two digits of year e.g. 16 for 2016
			y: function y() {
				return String(self.formats.Y()).substring(2);
			}
		};
	
		self.defaultConfig = {
			/* if true, dates will be parsed, formatted, and displayed in UTC.
	  preloading date strings w/ timezones is recommended but not necessary */
			utc: false,
	
			// wrap: see https://chmln.github.io/flatpickr/#strap
			wrap: false,
	
			// enables week numbers
			weekNumbers: false,
	
			allowInput: false,
	
			/*
	  	clicking on input opens the date(time)picker.
	  	disable if you wish to open the calendar manually with .open()
	  */
			clickOpens: true,
	
			// display time picker in 24 hour mode
			time_24hr: false,
	
			// enables the time picker functionality
			enableTime: false,
	
			// noCalendar: true will hide the calendar. use for a time picker along w/ enableTime
			noCalendar: false,
	
			// more date format chars at https://chmln.github.io/flatpickr/#dateformat
			dateFormat: "Y-m-d",
	
			// altInput - see https://chmln.github.io/flatpickr/#altinput
			altInput: false,
	
			// the created altInput element will have this class.
			altInputClass: "",
	
			// same as dateFormat, but for altInput
			altFormat: "F j, Y", // defaults to e.g. June 10, 2016
	
			// defaultDate - either a datestring or a date object. used for datetimepicker"s initial value
			defaultDate: null,
	
			// the minimum date that user can pick (inclusive)
			minDate: null,
	
			// the maximum date that user can pick (inclusive)
			maxDate: null,
	
			// dateparser that transforms a given string to a date object
			parseDate: null,
	
			// see https://chmln.github.io/flatpickr/#disable
			enable: [],
	
			// see https://chmln.github.io/flatpickr/#disable
			disable: [],
	
			// display the short version of month names - e.g. Sep instead of September
			shorthandCurrentMonth: false,
	
			// displays calendar inline. see https://chmln.github.io/flatpickr/#inline-calendar
			inline: false,
	
			// position calendar inside wrapper and next to the input element
			// leave at false unless you know what you"re doing
			static: false,
	
			// code for previous/next icons. this is where you put your custom icon code e.g. fontawesome
			prevArrow: "&lt;",
			nextArrow: "&gt;",
	
			// enables seconds in the time picker
			enableSeconds: false,
	
			// step size used when scrolling/incrementing the hour element
			hourIncrement: 1,
	
			// step size used when scrolling/incrementing the minute element
			minuteIncrement: 5,
	
			// onChange callback when user selects a date or time
			onChange: null, // function (dateObj, dateStr) {}
	
			// called every time calendar is opened
			onOpen: null, // function (dateObj, dateStr) {}
	
			// called every time calendar is closed
			onClose: null, // function (dateObj, dateStr) {}
	
			onValueUpdate: null
		};
	
		init = function init() {
			instanceConfig = instanceConfig || {};
	
			self.element = element;
	
			parseConfig();
	
			self.input = self.config.wrap ? element.querySelector("[data-input]") : element;
			self.input.classList.add("flatpickr-input");
	
			if (self.config.defaultDate) {
				self.config.defaultDate = uDate(self.config.defaultDate);
			}
	
			if (self.input.value || self.config.defaultDate) {
				self.selectedDateObj = uDate(self.config.defaultDate || self.input.value);
			}
	
			wrap();
			buildCalendar();
			bind();
	
			self.uDate = uDate;
			self.jumpToDate();
			updateValue();
		};
	
		parseConfig = function parseConfig() {
			self.config = {};
	
			Object.keys(self.defaultConfig).forEach(function (key) {
				if (instanceConfig.hasOwnProperty(key)) {
					self.config[key] = instanceConfig[key];
				} else if (self.element.dataset && self.element.dataset.hasOwnProperty(key.toLowerCase())) {
					self.config[key] = self.element.dataset[key.toLowerCase()];
				} else if (!self.element.dataset && self.element.hasAttribute("data-" + key)) {
					self.config[key] = self.element.getAttribute("data-" + key);
				} else {
					self.config[key] = flatpickr.init.prototype.defaultConfig[key] || self.defaultConfig[key];
				}
	
				if (typeof self.defaultConfig[key] === "boolean") {
					self.config[key] = self.config[key] === true || self.config[key] === "" || self.config[key] === "true";
				}
	
				if (key === "enableTime" && self.config[key]) {
					self.defaultConfig.dateFormat = !self.config.time_24hr ? "Y-m-d h:i K" : "Y-m-d H:i";
					self.defaultConfig.altFormat = !self.config.time_24hr ? "F j Y, h:i K" : "F j, Y H:i";
				} else if (key === "noCalendar" && self.config[key]) {
					self.defaultConfig.dateFormat = "h:i K";
					self.defaultConfig.altFormat = "h:i K";
				}
			});
		};
	
		getRandomCalendarIdStr = function getRandomCalendarIdStr() {
			var randNum = void 0,
			    idStr = void 0;
			do {
				randNum = Math.round(Math.random() * Math.pow(10, 10));
				idStr = "flatpickr-" + randNum;
			} while (document.getElementById(idStr) !== null);
	
			return idStr;
		};
	
		uDate = function uDate(date, timeless) {
			timeless = timeless || false;
	
			if (date === "today") {
				date = new Date();
				timeless = true;
			} else if (typeof date === "string") {
				date = date.trim();
	
				if (self.config.parseDate) {
					date = self.config.parseDate(date);
				} else if (/^\d\d\d\d\-\d{1,2}\-\d\d$/.test(date)) {
					// this utc datestring gets parsed, but incorrectly by Date.parse
					date = new Date(date.replace(/(\d)-(\d)/g, "$1/$2"));
				} else if (Date.parse(date)) {
					date = new Date(date);
				} else if (/^\d\d\d\d\-\d\d\-\d\d/.test(date)) {
					// disable special utc datestring
					date = new Date(date.replace(/(\d)-(\d)/g, "$1/$2"));
				} else if (/^(\d?\d):(\d\d)/.test(date)) {
					// time-only picker
					var matches = date.match(/^(\d?\d):(\d\d)(:(\d\d))?/),
					    seconds = matches[4] !== undefined ? matches[4] : 0;
	
					date = new Date();
					date.setHours(matches[1], matches[2], seconds, 0);
				} else {
					console.error("flatpickr: invalid date string " + date);
					console.info(self.element);
				}
			}
	
			if (!(date instanceof Date) || !date.getTime()) {
				return null;
			}
	
			if (self.config.utc && !date.fp_isUTC) {
				date = date.fp_toUTC();
			}
	
			if (timeless) {
				date.setHours(0, 0, 0, 0);
			}
	
			return date;
		};
	
		equalDates = function equalDates(date1, date2) {
			return date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
		};
	
		wrap = function wrap() {
			wrapperElement = createElement("div", "flatpickr-wrapper");
	
			if (self.config.inline || self.config.static) {
				// Wrap input and place calendar underneath
				self.element.parentNode.insertBefore(wrapperElement, self.element);
				wrapperElement.appendChild(self.element);
	
				wrapperElement.classList.add(self.config.inline ? "inline" : "static");
			} else {
				// Insert at bottom of BODY tag to display outside
				// of relative positioned elements with css "overflow: hidden;"
				// property set.
				document.body.appendChild(wrapperElement);
			}
	
			if (self.config.altInput) {
				// replicate self.element
				self.altInput = createElement(self.input.nodeName, self.config.altInputClass + " flatpickr-input");
				self.altInput.placeholder = self.input.placeholder;
				self.altInput.type = "text";
	
				self.input.type = "hidden";
				self.input.parentNode.insertBefore(self.altInput, self.input.nextSibling);
			}
		};
	
		getDaysinMonth = function getDaysinMonth() {
			var month = arguments.length <= 0 || arguments[0] === undefined ? self.currentMonth : arguments[0];
	
			var yr = self.currentYear;
	
			if (month === 1 && (yr % 4 === 0 && yr % 100 !== 0 || yr % 400 === 0)) {
				return 29;
			}
	
			return self.l10n.daysInMonth[month];
		};
	
		updateValue = function updateValue(e) {
			if (self.config.noCalendar && !self.selectedDateObj) {
				// picking time only and method triggered from picker
				self.selectedDateObj = new Date();
			} else if (!self.selectedDateObj) {
				return;
			}
	
			if (e) {
				e.target.blur();
			}
	
			var timeHasChanged = void 0;
	
			if (self.config.enableTime) {
				var previousTimestamp = self.selectedDateObj.getTime();
	
				// update time
				var hours = parseInt(self.hourElement.value, 10) || 0,
				    seconds = void 0;
	
				var minutes = (60 + (parseInt(self.minuteElement.value, 10) || 0)) % 60;
	
				if (self.config.enableSeconds) {
					seconds = (60 + parseInt(self.secondElement.value, 10) || 0) % 60;
				}
	
				if (!self.config.time_24hr) {
					// the real number of hours for the date object
					hours = hours % 12 + 12 * (self.amPM.innerHTML === "PM");
				}
	
				self.selectedDateObj.setHours(hours, minutes, seconds === undefined ? self.selectedDateObj.getSeconds() : seconds);
	
				self.hourElement.value = pad(!self.config.time_24hr ? (12 + hours) % 12 + 12 * (hours % 12 === 0) : hours);
				self.minuteElement.value = pad(minutes);
	
				if (seconds !== undefined) {
					self.secondElement.value = pad(seconds);
				}
	
				timeHasChanged = self.selectedDateObj.getTime() !== previousTimestamp;
			}
	
			self.input.value = self.formatDate(self.config.dateFormat);
	
			if (self.altInput) {
				self.altInput.value = self.formatDate(self.config.altFormat);
			}
	
			if (e && (timeHasChanged || e.target.classList.contains("flatpickr-day"))) {
				triggerChange();
			}
	
			if (self.config.onValueUpdate) {
				self.config.onValueUpdate(self.selectedDateObj, self.input.value, self);
			}
		};
	
		pad = function pad(num) {
			return ("0" + num).slice(-2);
		};
	
		self.formatDate = function (dateFormat) {
			var formattedDate = "";
			var formatPieces = dateFormat.split("");
	
			for (var i = 0; i < formatPieces.length; i++) {
				var c = formatPieces[i];
				if (self.formats.hasOwnProperty(c) && formatPieces[i - 1] !== "\\") {
					formattedDate += self.formats[c]();
				} else if (c !== "\\") {
					formattedDate += c;
				}
			}
	
			return formattedDate;
		};
	
		monthToStr = function monthToStr(date, shorthand) {
			if (shorthand || self.config.shorthandCurrentMonth) {
				return self.l10n.months.shorthand[date];
			}
	
			return self.l10n.months.longhand[date];
		};
	
		isEnabled = function isEnabled(dateToCheck) {
			if (self.config.minDate && dateToCheck < self.config.minDate || self.config.maxDate && dateToCheck > self.config.maxDate) {
				return false;
			}
	
			dateToCheck = uDate(dateToCheck, true); // timeless
	
			var bool = self.config.enable.length > 0,
			    array = bool ? self.config.enable : self.config.disable;
	
			var d = void 0;
	
			for (var i = 0; i < array.length; i++) {
				d = array[i];
	
				if (d instanceof Function && d(dateToCheck)) {
					// disabled by function
					return bool;
				} else if ( // disabled weekday
				typeof d === "string" && /^wkd/.test(d) && dateToCheck.getDay() === (parseInt(d.slice(-1), 10) + self.l10n.firstDayOfWeek - 1) % 7) {
					return bool;
				} else if ((d instanceof Date || typeof d === "string" && !/^wkd/.test(d)) && uDate(d, true).getTime() === dateToCheck.getTime()) {
					// disabled by date string
					return bool;
				} else if ( // disabled by range
				(typeof d === "undefined" ? "undefined" : _typeof(d)) === "object" && d.hasOwnProperty("from") && dateToCheck >= uDate(d.from) && dateToCheck <= uDate(d.to)) {
					return bool;
				}
			}
	
			return !bool;
		};
	
		yearScroll = function yearScroll(event) {
			event.preventDefault();
	
			var delta = Math.max(-1, Math.min(1, event.wheelDelta || -event.deltaY));
			self.currentYear = event.target.value = parseInt(event.target.value, 10) + delta;
			self.redraw();
		};
	
		timeWrapper = function timeWrapper(e) {
			e.preventDefault();
	
			var min = parseInt(e.target.min, 10),
			    max = parseInt(e.target.max, 10),
			    step = parseInt(e.target.step, 10),
			    value = parseInt(e.target.value, 10);
	
			var newValue = value;
	
			if (e.type === "wheel") {
				newValue = value + step * Math.max(-1, Math.min(1, e.wheelDelta || -e.deltaY));
			}
	
			if (newValue <= min) {
				newValue = max - step;
			} else if (newValue >= max) {
				newValue = min + step;
			}
	
			e.target.value = pad(newValue);
		};
	
		updateNavigationCurrentMonth = function updateNavigationCurrentMonth() {
			currentMonthElement.textContent = monthToStr(self.currentMonth) + " ";
			currentYearElement.value = self.currentYear;
		};
	
		handleYearChange = function handleYearChange() {
			if (self.currentMonth < 0 || self.currentMonth > 11) {
				self.currentYear += self.currentMonth % 11;
				self.currentMonth = (self.currentMonth + 12) % 12;
			}
		};
	
		documentClick = function documentClick(e) {
			var isCalendarElement = wrapperElement.contains(e.relatedTarget || e.target),
			    isInput = self.element.contains(e.relatedTarget || e.target) || e.relatedTarget || e.target === self.altInput;
	
			if (self.isOpen && !isCalendarElement && !isInput) {
				self.close();
			}
		};
	
		changeMonth = function changeMonth(offset) {
			self.currentMonth += offset;
	
			handleYearChange();
			updateNavigationCurrentMonth();
			buildDays();
			(self.config.noCalendar ? timeContainer : calendar).focus();
		};
	
		selectDate = function selectDate(e) {
			e.preventDefault();
			e.stopPropagation();
	
			if (self.config.allowInput && e.target === (self.altInput || self.input) && e.which === 13) {
				self.setDate((self.altInput || self.input).value);
				self.redraw();
			} else if (e.target.classList.contains("flatpickr-day")) {
				var isPrevMonthDay = e.target.classList.contains("prevMonthDay"),
				    isNextMonthDay = e.target.classList.contains("nextMonthDay"),
				    monthNum = self.currentMonth - isPrevMonthDay + isNextMonthDay;
	
				if (isPrevMonthDay || isNextMonthDay) {
					changeMonth(+isNextMonthDay - isPrevMonthDay);
				}
	
				self.selectedDateObj = new Date(self.currentYear, monthNum, e.target.innerHTML);
	
				updateValue(e);
				buildDays();
	
				if (!self.config.enableTime) {
					self.close();
				}
			}
		};
	
		buildCalendar = function buildCalendar() {
			calendarContainer = createElement("div", "flatpickr-calendar");
			calendarContainer.id = getRandomCalendarIdStr();
	
			calendar = createElement("div", "flatpickr-days");
			calendar.tabIndex = -1;
	
			if (!self.config.noCalendar) {
				buildMonthNavigation();
				buildWeekdays();
	
				if (self.config.weekNumbers) {
					buildWeeks();
				}
	
				buildDays();
	
				calendarContainer.appendChild(calendar);
			}
	
			wrapperElement.appendChild(calendarContainer);
	
			if (self.config.enableTime) {
				buildTime();
			}
		};
	
		buildMonthNavigation = function buildMonthNavigation() {
			monthsNav = createElement("div", "flatpickr-month");
	
			prevMonthNav = createElement("span", "flatpickr-prev-month");
			prevMonthNav.innerHTML = self.config.prevArrow;
	
			currentMonthElement = createElement("span", "cur_month");
	
			currentYearElement = createElement("input", "cur_year");
			currentYearElement.type = "number";
			currentYearElement.title = self.l10n.scrollTitle;
	
			nextMonthNav = createElement("span", "flatpickr-next-month");
			nextMonthNav.innerHTML = self.config.nextArrow;
	
			navigationCurrentMonth = createElement("span", "flatpickr-current-month");
			navigationCurrentMonth.appendChild(currentMonthElement);
			navigationCurrentMonth.appendChild(currentYearElement);
	
			monthsNav.appendChild(prevMonthNav);
			monthsNav.appendChild(navigationCurrentMonth);
			monthsNav.appendChild(nextMonthNav);
	
			calendarContainer.appendChild(monthsNav);
			updateNavigationCurrentMonth();
		};
	
		buildWeekdays = function buildWeekdays() {
			weekdayContainer = createElement("div", "flatpickr-weekdays");
			var firstDayOfWeek = self.l10n.firstDayOfWeek;
	
			var weekdays = self.l10n.weekdays.shorthand.slice();
	
			if (firstDayOfWeek > 0 && firstDayOfWeek < weekdays.length) {
				weekdays = [].concat(weekdays.splice(firstDayOfWeek, weekdays.length), weekdays.splice(0, firstDayOfWeek));
			}
	
			if (self.config.weekNumbers) {
				weekdayContainer.innerHTML = "<span>" + self.l10n.weekAbbreviation + "</span>";
			}
	
			weekdayContainer.innerHTML += "<span>" + weekdays.join("</span><span>") + "</span>";
	
			calendarContainer.appendChild(weekdayContainer);
		};
	
		buildWeeks = function buildWeeks() {
			calendarContainer.classList.add("hasWeeks");
	
			weekNumbers = createElement("div", "flatpickr-weeks");
			calendarContainer.appendChild(weekNumbers);
		};
	
		buildDays = function buildDays() {
			var firstOfMonth = (new Date(self.currentYear, self.currentMonth, 1).getDay() - self.l10n.firstDayOfWeek + 7) % 7,
			    daysInMonth = getDaysinMonth(),
			    prevMonthDays = getDaysinMonth((self.currentMonth - 1 + 12) % 12),
			    days = document.createDocumentFragment();
	
			var dayNumber = prevMonthDays + 1 - firstOfMonth,
			    currentDate = void 0,
			    dateIsDisabled = void 0;
	
			if (self.config.weekNumbers) {
				weekNumbers.innerHTML = "";
			}
	
			calendar.innerHTML = "";
	
			self.config.minDate = uDate(self.config.minDate, true);
			self.config.maxDate = uDate(self.config.maxDate, true);
	
			// prepend days from the ending of previous month
			for (; dayNumber <= prevMonthDays; dayNumber++) {
				var curDate = new Date(self.currentYear, self.currentMonth - 1, dayNumber, 0, 0, 0, 0, 0),
				    dateIsEnabled = isEnabled(curDate),
				    dayElem = createElement("span", dateIsEnabled ? "flatpickr-day prevMonthDay" : "disabled", dayNumber);
	
				if (dateIsEnabled) {
					dayElem.tabIndex = 0;
				}
	
				days.appendChild(dayElem);
			}
	
			// Start at 1 since there is no 0th day
			for (dayNumber = 1; dayNumber <= daysInMonth; dayNumber++) {
				currentDate = new Date(self.currentYear, self.currentMonth, dayNumber, 0, 0, 0, 0, 0);
	
				if (self.config.weekNumbers && dayNumber % 7 === 1) {
					weekNumbers.appendChild(createElement("span", "disabled flatpickr-day", currentDate.fp_getWeek()));
				}
	
				dateIsDisabled = !isEnabled(currentDate);
	
				var dayElement = createElement("span", dateIsDisabled ? "disabled" : "flatpickr-day", dayNumber);
	
				if (!dateIsDisabled) {
					dayElement.tabIndex = 0;
	
					if (equalDates(currentDate, now)) {
						dayElement.classList.add("today");
					}
	
					if (self.selectedDateObj && equalDates(currentDate, self.selectedDateObj)) {
						dayElement.classList.add("selected");
					}
				}
	
				days.appendChild(dayElement);
			}
	
			// append days from the next month
			for (var dayNum = daysInMonth + 1; dayNum <= 42 - firstOfMonth; dayNum++) {
				var _curDate = new Date(self.currentYear, self.currentMonth + 1, dayNum % daysInMonth, 0, 0, 0, 0, 0),
				    _dateIsEnabled = isEnabled(_curDate),
				    _dayElement = createElement("span", _dateIsEnabled ? "nextMonthDay flatpickr-day" : "disabled", dayNum % daysInMonth);
	
				if (self.config.weekNumbers && dayNum % 7 === 1) {
					weekNumbers.appendChild(createElement("span", "disabled", _curDate.fp_getWeek()));
				}
	
				if (_dateIsEnabled) {
					_dayElement.tabIndex = 0;
				}
	
				days.appendChild(_dayElement);
			}
	
			calendar.appendChild(days);
		};
	
		buildTime = function buildTime() {
			timeContainer = createElement("div", "flatpickr-time");
			timeContainer.tabIndex = -1;
			var separator = createElement("span", "flatpickr-time-separator", ":");
	
			self.hourElement = createElement("input", "flatpickr-hour");
			self.minuteElement = createElement("input", "flatpickr-minute");
	
			self.hourElement.tabIndex = self.minuteElement.tabIndex = 0;
			self.hourElement.type = self.minuteElement.type = "number";
	
			self.hourElement.value = self.selectedDateObj ? pad(self.selectedDateObj.getHours()) : 12;
	
			self.minuteElement.value = self.selectedDateObj ? pad(self.selectedDateObj.getMinutes()) : "00";
	
			self.hourElement.step = self.config.hourIncrement;
			self.minuteElement.step = self.config.minuteIncrement;
	
			self.hourElement.min = -self.config.time_24hr;
			self.hourElement.max = self.config.time_24hr ? 24 : 13;
	
			self.minuteElement.min = -self.minuteElement.step;
			self.minuteElement.max = 60;
	
			self.hourElement.title = self.minuteElement.title = self.l10n.scrollTitle;
	
			timeContainer.appendChild(self.hourElement);
			timeContainer.appendChild(separator);
			timeContainer.appendChild(self.minuteElement);
	
			if (self.config.enableSeconds) {
				timeContainer.classList.add("has-seconds");
	
				self.secondElement = createElement("input", "flatpickr-second");
				self.secondElement.type = "number";
				self.secondElement.value = self.selectedDateObj ? pad(self.selectedDateObj.getSeconds()) : "00";
	
				self.secondElement.step = self.minuteElement.step;
				self.secondElement.min = self.minuteElement.min;
				self.secondElement.max = self.minuteElement.max;
	
				timeContainer.appendChild(createElement("span", "flatpickr-time-separator", ":"));
				timeContainer.appendChild(self.secondElement);
			}
	
			if (!self.config.time_24hr) {
				// add self.amPM if appropriate
				self.amPM = createElement("span", "flatpickr-am-pm", ["AM", "PM"][self.hourElement.value > 11 | 0]);
				self.amPM.title = self.l10n.toggleTitle;
				self.amPM.tabIndex = 0;
				timeContainer.appendChild(self.amPM);
			}
	
			calendarContainer.appendChild(timeContainer);
		};
	
		bind = function bind() {
			document.addEventListener("keydown", onKeyDown);
			window.addEventListener("resize", onResize);
	
			if (self.config.clickOpens) {
				(self.altInput || self.input).addEventListener("click", self.open);
				(self.altInput || self.input).addEventListener("focus", self.open);
			}
	
			if (self.config.wrap && self.element.querySelector("[data-open]")) {
				self.element.querySelector("[data-open]").addEventListener("click", self.open);
			}
	
			if (self.config.wrap && self.element.querySelector("[data-close]")) {
				self.element.querySelector("[data-close]").addEventListener("click", self.close);
			}
	
			if (self.config.wrap && self.element.querySelector("[data-toggle]")) {
				self.element.querySelector("[data-toggle]").addEventListener("click", self.toggle);
			}
	
			if (self.config.wrap && self.element.querySelector("[data-clear]")) {
				self.element.querySelector("[data-clear]").addEventListener("click", self.clear);
			}
	
			if (!self.config.noCalendar) {
				prevMonthNav.addEventListener("click", function () {
					changeMonth(-1);
				});
	
				nextMonthNav.addEventListener("click", function () {
					changeMonth(1);
				});
	
				currentYearElement.addEventListener("wheel", yearScroll);
				currentYearElement.addEventListener("focus", currentYearElement.select);
	
				currentYearElement.addEventListener("input", function (event) {
					self.currentYear = parseInt(event.target.value, 10);
					self.redraw();
				});
	
				calendar.addEventListener("click", selectDate);
			}
	
			document.addEventListener("click", documentClick, true);
			document.addEventListener("focus", documentClick, true);
	
			if (self.config.enableTime) {
				self.hourElement.addEventListener("wheel", timeWrapper);
				self.minuteElement.addEventListener("wheel", timeWrapper);
	
				self.hourElement.addEventListener("input", timeWrapper);
				self.minuteElement.addEventListener("input", timeWrapper);
	
				self.hourElement.addEventListener("mouseout", updateValue);
				self.minuteElement.addEventListener("mouseout", updateValue);
	
				self.hourElement.addEventListener("change", updateValue);
				self.minuteElement.addEventListener("change", updateValue);
	
				self.hourElement.addEventListener("focus", self.hourElement.select);
				self.minuteElement.addEventListener("focus", self.minuteElement.select);
	
				if (self.config.enableSeconds) {
					self.secondElement.addEventListener("wheel", timeWrapper);
					self.secondElement.addEventListener("input", timeWrapper);
					self.secondElement.addEventListener("mouseout", updateValue);
					self.secondElement.addEventListener("change", updateValue);
					self.secondElement.addEventListener("focus", self.secondElement.select);
				}
	
				if (!self.config.time_24hr) {
					self.amPM.addEventListener("click", amPMToggle);
	
					self.amPM.addEventListener("wheel", amPMToggle);
					self.amPM.addEventListener("mouseout", updateValue);
	
					self.amPM.addEventListener("keydown", function (e) {
						if (e.which === 38 || e.which === 40) {
							amPMToggle(e);
						}
					});
				}
			}
	
			if (document.createEvent) {
				clickEvt = document.createEvent("MouseEvent");
				// without all these args ms edge spergs out
				clickEvt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			} else {
				clickEvt = new MouseEvent("click", {
					view: window,
					bubbles: true,
					cancelable: true
				});
			}
		};
	
		self.open = function () {
			if (self.isOpen || (self.altInput || self.input).disabled || self.config.inline) {
				return;
			} else if (!self.config.static) {
				self.positionCalendar();
			}
	
			self.isOpen = true;
	
			wrapperElement.classList.add("open");
	
			if (!self.config.allowInput) {
				(self.altInput || self.input).blur();
				(self.config.noCalendar ? timeContainer : calendar).focus();
			}
	
			(self.altInput || self.input).classList.add("active");
	
			if (self.config.onOpen) {
				self.config.onOpen(self.selectedDateObj, self.input.value, self);
			}
		};
	
		// For calendars inserted in BODY (as opposed to inline wrapper)
		// it"s necessary to properly calculate top/left position.
		self.positionCalendar = function () {
			var calendarHeight = calendarContainer.offsetHeight,
			    input = self.altInput || self.input,
			    inputBounds = input.getBoundingClientRect(),
			    distanceFromBottom = window.innerHeight - inputBounds.bottom + input.offsetHeight;
	
			var top = void 0,
			    left = window.pageXOffset + inputBounds.left;
	
			if (distanceFromBottom < calendarHeight) {
				top = window.pageYOffset - calendarHeight + inputBounds.top - 2;
				calendarContainer.classList.remove("arrowTop");
				calendarContainer.classList.add("arrowBottom");
			} else {
				top = window.pageYOffset + input.offsetHeight + inputBounds.top + 2;
				calendarContainer.classList.remove("arrowBottom");
				calendarContainer.classList.add("arrowTop");
			}
	
			wrapperElement.style.top = top + "px";
			wrapperElement.style.left = left + "px";
		};
	
		self.toggle = function () {
			if (self.isOpen) {
				self.close();
			} else {
				self.open();
			}
		};
	
		self.close = function () {
			self.isOpen = false;
			wrapperElement.classList.remove("open");
			(self.altInput || self.input).classList.remove("active");
	
			if (self.config.onClose) {
				self.config.onClose(self.selectedDateObj, self.input.value, self);
			}
		};
	
		self.clear = function () {
			self.input.value = "";
	
			if (self.altInput) {
				self.altInput.value = "";
			}
	
			self.selectedDateObj = null;
	
			triggerChange();
			self.jumpToDate();
		};
	
		triggerChange = function triggerChange() {
			self.input.dispatchEvent(clickEvt);
	
			if (self.config.onChange) {
				self.config.onChange(self.selectedDateObj, self.input.value, self);
			}
		};
	
		self.destroy = function () {
			document.removeEventListener("click", documentClick, false);
	
			if (self.altInput) {
				self.altInput.parentNode.removeChild(self.altInput);
			}
	
			if (self.config.inline) {
				var parent = self.element.parentNode,
				    removedElement = parent.removeChild(self.element);
	
				parent.removeChild(calendarContainer);
				parent.parentNode.replaceChild(removedElement, parent);
			} else {
				document.getElementsByTagName("body")[0].removeChild(wrapperElement);
			}
		};
	
		self.redraw = function () {
			if (self.config.noCalendar) {
				return;
			}
	
			updateNavigationCurrentMonth();
			buildDays();
		};
	
		self.jumpToDate = function (jumpDate) {
			jumpDate = uDate(jumpDate || self.selectedDateObj || self.config.defaultDate || self.config.minDate || now);
	
			self.currentYear = jumpDate.getFullYear();
			self.currentMonth = jumpDate.getMonth();
			self.redraw();
		};
	
		self.setDate = function (date, triggerChangeEvent) {
			date = uDate(date);
	
			if (date instanceof Date && date.getTime()) {
				self.selectedDateObj = uDate(date);
				self.jumpToDate(self.selectedDateObj);
				updateValue();
	
				if (triggerChangeEvent) {
					triggerChange();
				}
			}
		};
	
		self.setTime = function (hour, minute, triggerChangeEvent) {
			if (!self.selectedDateObj) {
				return;
			}
	
			self.hourElement.value = parseInt(hour, 10) % 24;
			self.minuteElement.value = parseInt(minute || 0, 10) % 60;
	
			if (!self.config.time_24hr) {
				self.amPM.innerHTML = hour > 11 ? "PM" : "AM";
			}
	
			updateValue();
	
			if (triggerChangeEvent) {
				triggerChange();
			}
		};
	
		self.set = function (key, value) {
			if (key in self.config) {
				self.config[key] = value;
				self.jumpToDate();
			}
		};
	
		amPMToggle = function amPMToggle(e) {
			e.preventDefault();
			self.amPM.textContent = ["AM", "PM"][self.amPM.innerHTML === "AM" | 0];
		};
	
		onKeyDown = function onKeyDown(e) {
			if (!self.isOpen || self.config.enableTime && timeContainer.contains(e.target)) {
				return;
			}
	
			switch (e.which) {
				case 13:
					selectDate(e);
					break;
	
				case 27:
					self.close();
					break;
	
				case 37:
					changeMonth(-1);
					break;
	
				case 38:
					e.preventDefault();
					self.currentYear++;
					self.redraw();
					break;
	
				case 39:
					changeMonth(1);
					break;
	
				case 40:
					e.preventDefault();
					self.currentYear--;
					self.redraw();
					break;
	
				default:
					break;
			}
		};
	
		onResize = debounce(function () {
			if (self.isOpen && !self.config.inline && !self.config.static) {
				self.positionCalendar();
			}
		}, 300);
	
		try {
			init();
		} catch (error) {
			// skip and carry on
			console.error(error);
			console.info(self.element);
		}
	
		return self;
	};
	
	flatpickr.init.prototype = {
	
		defaultConfig: {},
	
		l10n: {
			weekdays: {
				shorthand: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
				longhand: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
			},
			months: {
				shorthand: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
				longhand: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
			},
			daysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
			firstDayOfWeek: 0,
			ordinal: function ordinal(nth) {
				var s = nth % 100;
				if (s > 3 && s < 21) return "th";
				switch (s % 10) {
					case 1:
						return "st";
					case 2:
						return "nd";
					case 3:
						return "rd";
					default:
						return "th";
				}
			},
			weekAbbreviation: "Wk",
			scrollTitle: "Scroll to increment",
			toggleTitle: "Click to toggle"
		}
	
	};
	
	Date.prototype.fp_incr = function (days) {
		return new Date(this.getFullYear(), this.getMonth(), this.getDate() + parseInt(days, 10));
	};
	
	Date.prototype.fp_isUTC = false;
	Date.prototype.fp_toUTC = function () {
		var newDate = new Date(this.getTime() + this.getTimezoneOffset() * 60000);
		newDate.fp_isUTC = true;
	
		return newDate;
	};
	
	Date.prototype.fp_getWeek = function () {
		var date = new Date(this.getTime());
		date.setHours(0, 0, 0, 0);
	
		// Thursday in current week decides the year.
		date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
		// January 4 is always in week 1.
		var week1 = new Date(date.getFullYear(), 0, 4);
		// Adjust to Thursday in week 1 and count number of weeks from date to week1.
		return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
	};
	
	// classList polyfill
	if (!("classList" in document.documentElement) && Object.defineProperty && typeof HTMLElement !== "undefined") {
		Object.defineProperty(HTMLElement.prototype, "classList", {
			get: function get() {
				var selfElements = this;
				function update(fn) {
					return function (value) {
						var classes = selfElements.className.split(/\s+/);
						var index = classes.indexOf(value);
	
						fn(classes, index, value);
						selfElements.className = classes.join(" ");
					};
				}
	
				var ret = {
					add: update(function (classes, index, value) {
						return ~index || classes.push(value);
					}),
					remove: update(function (classes, index) {
						return ~index && classes.splice(index, 1);
					}),
					toggle: update(function (classes, index, value) {
						if (~index) {
							classes.splice(index, 1);
						} else {
							classes.push(value);
						}
					}),
					contains: function contains(value) {
						return !! ~selfElements.className.split(/\s+/).indexOf(value);
					}
				};
	
				return ret;
			}
		});
	}
	
	if (true) {
		module.exports = flatpickr;
	}

/***/ }),

/***/ 144:
/***/ (function(module, exports) {

	exports.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var nBits = -7
	  var i = isLE ? (nBytes - 1) : 0
	  var d = isLE ? -1 : 1
	  var s = buffer[offset + i]
	
	  i += d
	
	  e = s & ((1 << (-nBits)) - 1)
	  s >>= (-nBits)
	  nBits += eLen
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}
	
	  m = e & ((1 << (-nBits)) - 1)
	  e >>= (-nBits)
	  nBits += mLen
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}
	
	  if (e === 0) {
	    e = 1 - eBias
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen)
	    e = e - eBias
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	}
	
	exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
	  var i = isLE ? 0 : (nBytes - 1)
	  var d = isLE ? 1 : -1
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0
	
	  value = Math.abs(value)
	
	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0
	    e = eMax
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2)
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--
	      c *= 2
	    }
	    if (e + eBias >= 1) {
	      value += rt / c
	    } else {
	      value += rt * Math.pow(2, 1 - eBias)
	    }
	    if (value * c >= 2) {
	      e++
	      c /= 2
	    }
	
	    if (e + eBias >= eMax) {
	      m = 0
	      e = eMax
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen)
	      e = e + eBias
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
	      e = 0
	    }
	  }
	
	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}
	
	  e = (e << mLen) | m
	  eLen += mLen
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}
	
	  buffer[offset + i - d] |= s * 128
	}


/***/ }),

/***/ 145:
/***/ (function(module, exports) {

	var toString = {}.toString;
	
	module.exports = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};


/***/ }),

/***/ 231:
/***/ (function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }),

/***/ 232:
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(122);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(231)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/less-loader/lib/loader.js!./examples.less", function() {
				var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/less-loader/lib/loader.js!./examples.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ })

});
//# sourceMappingURL=examples.js.map