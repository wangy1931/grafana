define([
    'd3',
    './d3.tip'
], function(d3, d3Tip) {
    'use strict';
    var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
    
    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
    
    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var RelationshipGraph = function () {
    
        /**
         * @param {d3.selection} selection The ID of the element containing the graph.
         * @param {Object} userConfig Configuration for graph.
         * @constructor
         */
    
        function RelationshipGraph(selection) {
            var userConfig = arguments.length <= 1 || arguments[1] === undefined ? { showTooltips: true, maxChildCount: 0, thresholds: [] } : arguments[1];
    
            _classCallCheck(this, RelationshipGraph);
    
            // Verify that the user config contains the thresholds.
            if (!userConfig.thresholds) {
                userConfig.thresholds = [];
            } else if (_typeof(userConfig.thresholds) !== 'object') {
                throw 'Thresholds must be an Object.';
            }
    
            if (userConfig.onClick !== undefined) {
                this.parentPointer = userConfig.onClick.parent !== undefined;
                this.childPointer = userConfig.onClick.child !== undefined;
            } else {
                this.parentPointer = false;
                this.childPointer = false;
            }
    
            var defaultOnClick = { parent: RelationshipGraph.noop, child: RelationshipGraph.noop };
    
            /**
             * Contains the configuration for the graph.
             *
             * @type {{blockSize: number, selection: d3.selection, showTooltips: boolean, maxChildCount: number,
             * onClick: (RelationshipGraph.noop|*), showKeys: (*|boolean), thresholds: Array,
             * colors: (*|Array|boolean|string[]), transitionTime: (*|number),
             * truncate: (RelationshipGraph.truncate|*|number)}}
             */
            this.configuration = {
                blockSize: userConfig.blockSize || 24, // The block size for each child.
                selection: selection, // The ID for the graph.
                showTooltips: userConfig.showTooltips, // Whether or not to show the tooltips on hover.
                maxChildCount: userConfig.maxChildCount || 0, // The maximum amount of children to show per row.
                onClick: userConfig.onClick || defaultOnClick, // The callback function to call.
                showKeys: userConfig.showKeys, // Whether or not to show the keys in the tooltip.
                thresholds: userConfig.thresholds, // Thresholds to determine the colors of the child blocks with.
                colors: userConfig.colors || RelationshipGraph.getColors(), // Colors to use for blocks.
                transitionTime: userConfig.transitionTime || 1500, // Time for a transition to start and complete.
                truncate: userConfig.truncate || 0, // Maximum length of a parent label. Use 0 to turn off truncation.
                sortFunction: userConfig.sortFunction || RelationshipGraph.sortJson, // A custom sort function
                valueKeyName: userConfig.valueKeyName, // Set a custom key in the tooltip.
                spacing: userConfig.spacing || 1 // pixels between child nodes.
            };
    
            // Make sure that the colors are in the correct format.
            for (var i = 0; i < this.configuration.colors.length; i++) {
                var color = this.configuration.colors[i];
    
                if (color.indexOf('#') < 0 && typeof color === 'string' && color.length === 6 && !isNaN(parseInt(color, 16))) {
                    color = '#' + color;
                    this.configuration.colors[i] = color;
                }
            }
    
            // TODO: Find a better way to handles these.
            if (this.configuration.showTooltips === undefined) {
                this.configuration.showTooltips = true;
            }
    
            if (this.configuration.showKeys === undefined) {
                this.configuration.showKeys = true;
            }
    
            if (this.configuration.keyValueName === undefined) {
                this.configuration.keyValueName = 'value';
            }
    
            // If the threshold array is made up of numbers, make sure that it is sorted.
            if (this.configuration.thresholds.length && typeof this.configuration.thresholds[0] == 'number') {
                this.configuration.thresholds.sort(function (a, b) {
                    return a - b;
                });
            }
    
            /**
             * Used for measuring text widths.
             * @type {Element}
             */
            this.measurementDiv = document.createElement('div');
            this.measurementDiv.className = 'relationshipGraph-measurement';
            document.body.appendChild(this.measurementDiv);
    
            /**
             * Used for caching measurements.
             * @type {{}}
             */
            this.measuredCache = {};
    
            /**
             * Represents the current data that is shown by the graph.
             * @type {Array}
             */
            this.representation = [];
    
            /**
             * The _spacing (in pixels) between child nodes.
             * @type {number}
             */
            this._spacing = this.configuration.spacing;
    
            /**
             * Used to determine whether or not d3 V3 or V4 is being used.
             *
             * @type {boolean}
             * @private
             */
            this._d3V4 = !!this.configuration.selection._groups;

            /**
             * Function to create the tooltip.
             *
             * @param {RelationshipGraph} self The RelationshipGraph instance.
             * @returns {function} the tip object.
             */
            var createTooltip = function createTooltip(self) {
                var hiddenKeys = ['_PRIVATE_', 'PARENT', 'PARENTCOLOR', 'SETNODECOLOR', 'SETNODESTROKECOLOR'],
                    showKeys = self.configuration.showKeys;
    
                return d3Tip().attr('class', 'relationshipGraph-tip').offset([-8, -10]).html(function (obj) {
                    var keys = Object.keys(obj),
                        table = document.createElement('table'),
                        count = keys.length,
                        rows = [];
    
                    // Loop through the keys in the object and only show values self are not in the hiddenKeys array.
                    while (count--) {
                        var element = keys[count],
                            upperCaseKey = element.toUpperCase();
    
                        if (!RelationshipGraph.contains(hiddenKeys, upperCaseKey) && !upperCaseKey.startsWith('__')) {
                            var row = document.createElement('tr'),
                                key = showKeys ? document.createElement('td') : null,
                                value = document.createElement('td');
    
                            if (showKeys) {
                                key.innerHTML = element.charAt(0).toUpperCase() + element.substring(1);
                                row.appendChild(key);
                            }
    
                            if (upperCaseKey == 'VALUE' && !self.configuration.valueKeyName) {
                                continue;
                            }
    
                            value.innerHTML = obj[element];
                            value.style.fontWeight = 'normal';
    
                            row.appendChild(value);
                            rows.push(row);
                        }
                    }
    
                    var rowCount = rows.length;
    
                    while (rowCount--) {
                        table.appendChild(rows[rowCount]);
                    }
    
                    return table.outerHTML;
                });
            };
    
            if (this.configuration.showTooltips) {
                this.tooltip = createTooltip(this);
                this.tooltip.direction('n');
            } else {
                this.tooltip = null;
            }
    
            // Check if this selection already has a graph.
            this.svg = this.configuration.selection.select('svg').select('g');
    
            if (this.svg.empty()) {
                // Create the svg element that will contain the graph.
                this.svg = this.configuration.selection.append('svg').attr('width', '500').attr('height', '500').attr('style', 'display: block').append('g').attr('transform', 'translate(10, 0)');
            }
    
            this.graph = this;
        }
    
        /**
         * Generate the basic set of colors.
         *
         * @returns {string[]} List of HEX colors.
         * @private
         */
    
    
        _createClass(RelationshipGraph, [{
            key: 'getId',

            /**
             * Return the ID of the selection.
             *
             * @returns {string} The ID of the selection.
             * @private
             */
            value: function getId() {
                var selection = this.configuration.selection,
                    parent = this._d3V4 ? selection._groups[0][0] : selection[0][0];
    
                return parent.id;
            }
        }, {
            key: 'getPixelLength',

            /**
             * Returns the pixel length of the string based on the font size.
             *
             * @param {string} str The string to get the length of.
             * @returns {Number} The pixel length of the string.
             * @public
             */
            value: function getPixelLength(str) {
                if (RelationshipGraph.containsKey(this.measuredCache, str)) {
                    return this.measuredCache[str];
                }
    
                var text = document.createTextNode(str);
                this.measurementDiv.appendChild(text);
    
                var width = this.measurementDiv.offsetWidth;
                this.measurementDiv.removeChild(text);
    
                this.measuredCache[str] = width;
    
                return width;
            }
        }, {
            key: 'assignIndexAndRow',

            /**
             * Assign the index and row to each of the children in the Array of Objects.
             *
             * @param json {Array} The array of Objects to loop through.
             * @param parentSizes {Object} The parent sizes determined.
             * @param parents {Array} The parent label names.
             * @returns {Array} Object containing the longest width, the calculated max children per row, and the maximum amount
             *  of rows.
             */
            value: function assignIndexAndRow(json, parentSizes, parents) {
                // Determine the longest parent name to calculate how far from the left the child blocks should start.
                var longest = '';
                var parentNames = Object.keys(parentSizes);
                var i = void 0;
                var index = 0;
                var row = 0;
                var previousParent = '';
                var parentLength = parents.length;
                var configuration = this.configuration;
                var blockSize = configuration.blockSize;
                var selection = configuration.selection;
    
    
                for (i = 0; i < parentLength; i++) {
                    var current = parents[i] + ' ( ' + parentSizes[parentNames[i]] + ') ';
    
                    if (current.length > longest.length) {
                        longest = current;
                    }
                }
    
                // Calculate the row and column for each child block.
                var longestWidth = this.getPixelLength(longest);
                var parentDiv = this._d3V4 ? selection._groups[0][0] : selection[0][0];
                var calculatedMaxChildren = configuration.maxChildCount === 0 ? Math.floor((parentDiv.parentElement.clientWidth - blockSize - longestWidth) / blockSize) : configuration.maxChildCount;
                var jsonLength = json.length;
                var thresholds = configuration.thresholds;
    
    
                for (i = 0; i < jsonLength; i++) {
                    var element = json[i];
                    var parent = element.parent;
    
    
                    if (previousParent !== null && previousParent !== parent) {
                        element.__row = row + 1;
                        element.__index = 1;
    
                        index = 2;
                        row++;
                    } else {
                        if (index === calculatedMaxChildren + 1) {
                            index = 1;
                            row++;
                        }
    
                        element.__row = row;
                        element.__index = index;
    
                        index++;
                    }
    
                    previousParent = parent;
    
                    if (thresholds.length === 0) {
                        element.__color = 0;
                    } else {
                        // Figure out the color based on the threshold.
                        var value = void 0,
                            compare = void 0;
    
                        if (typeof thresholds[0] === 'string') {
                            value = element.value;
                            compare = RelationshipGraph.stringCompare;
                        } else {
                            var elementValue = element.value;
    
                            value = typeof elementValue == 'number' ? elementValue : parseFloat(elementValue.replace(/[^0-9-.]+/g, ''));
    
                            compare = RelationshipGraph.numericCompare;
                        }
    
                        var thresholdIndex = compare(value, thresholds);
    
                        element.__color = thresholdIndex === -1 ? 0 : thresholdIndex;
                        element.__colorValue = this.configuration.colors[element.__color % this.configuration.colors.length];
                    }
    
                    // Add the interaction methods
                    /**
                     * Set the color of the node. This method gets the object lazily and is only gets the object from the DOM
                     * once.
                     *
                     * @param {String} color The new color of the node to set.
                     */
                    element.setNodeColor = function (color) {
                        if (!this.__node) {
                            this.__node = document.getElementById(this.__id);
                        }
    
                        if (this.__node) {
                            this.__node.style.fill = color;
                        }
                    };
    
                    /**
                     * Set the color of the node's stroke. This method gets the object lazily and is only gets the object from
                     * the DOM once.
                     *
                     * @param {String} color The color to set the stroke to. Set this to a falsy value to remove the stroke.
                     */
                    element.setNodeStrokeColor = function (color) {
                        if (!this.__node) {
                            this.__node = document.getElementById(this.__id);
                        }
    
                        if (this.__node) {
                            this.__node.style.strokeWidth = color ? '1px' : 0;
                            this.__node.style.stroke = color ? color : '';
                        }
                    };
    
                    element.__id = this.getId() + '-child-node' + element.__row + '-' + element.__index;
                }
    
                return [longestWidth, calculatedMaxChildren, row];
            }
        }, {
            key: 'createParents',
    
    
            /**
             * Creates the parent labels.
             *
             * @param {d3.selection} parentNodes The parentNodes.
             * @param {Object} parentSizes The child count for each parent.
             * @param {number} longestWidth The longest width of a parent node.
             * @param {number} calculatedMaxChildren The maximum amount of children nodes per row.
             * @private
             */
            value: function createParents(parentNodes, parentSizes, longestWidth, calculatedMaxChildren) {
                var parentSizesKeys = Object.keys(parentSizes),
                    _this = this;
    
                parentNodes.enter().append('text').text(function (obj, index) {
                    return obj + ' (' + parentSizes[parentSizesKeys[index]] + ')';
                }).attr('x', function (obj, index) {
                    var width = _this.getPixelLength(obj + ' (' + parentSizes[parentSizesKeys[index]] + ')');
                    return longestWidth - width;
                }).attr('y', function (obj, index) {
                    if (index === 0) {
                        return 0;
                    }
    
                    /**
                     * Determine the Y coordinate by determining the Y coordinate of all of the parents before. This
                     * has to be calculated completely because it is an update and can occur anywhere.
                     */
                    var previousParentSize = 0,
                        i = index - 1;
    
                    while (i > -1) {
                        previousParentSize += Math.ceil(parentSizes[parentSizesKeys[i]] / calculatedMaxChildren) * calculatedMaxChildren;
                        i--;
                    }
    
                    return Math.ceil(previousParentSize / calculatedMaxChildren) * _this.configuration.blockSize + _this._spacing * index;
                }).style('text-anchor', 'start').style('fill', function (obj) {
                    return obj.parentColor !== undefined ? _this.configuration.colors[obj.parentColor] : '#000000';
                }).style('cursor', this.parentPointer ? 'pointer' : 'default').attr('class', 'relationshipGraph-Text').attr('transform', 'translate(-6, ' + _this.configuration.blockSize / 1.5 + ')')
                .on('click', function (obj) {
                    _this.configuration.onClick.parent(obj);
                });
            }
        }, {
            key: 'updateParents',

            /**
             * Updates the existing parent nodes with new data.
             *
             * @param {d3.selection} parentNodes The parentNodes.
             * @param {Object} parentSizes The child count for each parent.
             * @param {number} longestWidth The longest width of a parent node.
             * @param {number} calculatedMaxChildren The maxiumum amount of children nodes per row.
             * @private
             */
            value: function updateParents(parentNodes, parentSizes, longestWidth, calculatedMaxChildren) {
                var parentSizesKeys = Object.keys(parentSizes),
                    _this = this;
    
                // noinspection JSUnresolvedFunction
                parentNodes.text(function (obj, index) {
                    return obj + ' (' + parentSizes[parentSizesKeys[index]] + ')';
                }).attr('x', function (obj, index) {
                    var width = _this.getPixelLength(obj + ' (' + parentSizes[parentSizesKeys[index]] + ')');
                    return longestWidth - width;
                }).attr('y', function (obj, index) {
                    if (index === 0) {
                        return 0;
                    }
    
                    /**
                     * Determine the Y coordinate by determining the Y coordinate of all of the parents before. This
                     * has to be calculated completely because it is an update and can occur anywhere.
                     */
                    var previousParentSize = 0,
                        i = index - 1;
    
                    while (i > -1) {
                        previousParentSize += Math.ceil(parentSizes[parentSizesKeys[i]] / calculatedMaxChildren) * calculatedMaxChildren;
                        i--;
                    }
    
                    return Math.ceil(previousParentSize / calculatedMaxChildren) * _this.configuration.blockSize + _this._spacing * index;
                }).style('fill', function (obj) {
                    return obj.parentColor !== undefined ? _this.configuration.colors[obj.parentColor] : '#000000';
                }).style('cursor', _this.parentPointer ? 'pointer' : 'default');
            }
        }, {
            key: 'createChildren',

            /**
             * Creates new children nodes.
             *
             * @param {d3.selection} childrenNodes The children nodes.
             * @param {number} longestWidth The longest width of a parent node.
             * @private
             */
            value: function createChildren(childrenNodes, longestWidth) {
                var _this = this;
    
                childrenNodes.enter().append('rect').attr('id', function (obj) {
                    return obj.__id;
                }).attr('x', function (obj) {
                    return longestWidth + (obj.__index - 1) * _this.configuration.blockSize + 5 + (_this._spacing * obj.__index - 1);
                }).attr('y', function (obj) {
                    return (obj.__row - 1) * _this.configuration.blockSize + (_this._spacing * obj.__row - 1);
                }).attr('rx', 4).attr('ry', 4).attr('class', 'relationshipGraph-block').attr('width', _this.configuration.blockSize).attr('height', _this.configuration.blockSize).style('fill', function (obj) {
                    return obj.__colorValue;
                }).style('cursor', _this.childPointer ? 'pointer' : 'default').on('mouseover', _this.tooltip ? _this.tooltip.show : RelationshipGraph.noop).on('mouseout', _this.tooltip ? _this.tooltip.hide : RelationshipGraph.noop)
                .on('click', function (obj) {
                    _this.tooltip.hide();
                    _this.configuration.onClick.child(obj);
                });
            }
        }, {
            key: 'updateChildren',

            /**
             * Updates the existing children nodes with new data.
             *
             * @param {d3.selection} childrenNodes The children nodes.
             * @param {number} longestWidth The longest width of a parent node.
             * @private
             */
            value: function updateChildren(childrenNodes, longestWidth) {
                var blockSize = this.configuration.blockSize;
                var _this = this;
    
                // noinspection JSUnresolvedFunction
                childrenNodes.transition(this.configuration.transitionTime).attr('id', function (obj) {
                    return obj.__id;
                }).attr('x', function (obj) {
                    return longestWidth + (obj.__index - 1) * blockSize + 5 + (_this._spacing * obj.__index - 1);
                }).attr('y', function (obj) {
                    return (obj.__row - 1) * blockSize + (_this._spacing * obj.__row - 1);
                }).style('fill', function (obj) {
                    return obj.__colorValue;
                });
            }
        }, {
            key: 'removeNodes',

            /**
             * Removes nodes that no longer exist.
             *
             * @param {d3.selection} nodes The nodes.
             * @private
             */
            value: function removeNodes(nodes) {
                // noinspection JSUnresolvedFunction
                nodes.exit().transition(this.configuration.transitionTime).remove();
            }
        }, {
            key: 'data',

            /**
             * Generate the graph.
             *
             * @param {Array} json The array of JSON to feed to the graph.
             * @return {RelationshipGraph} The RelationshipGraph object to keep d3's chaining functionality.
             * @public
             */
            value: function data(json) {
                var _this = this;

                if (!json.toString()) {
                    this.svg.html('');

                    this.svg.append('text').text('暂无数据')
                    .attr('x', 4).attr('y', 0)
                    .style('text-anchor', 'start')
                    .attr('class', 'relationshipGraph-Text')
                    .attr('transform', 'translate(-6, ' + _this.configuration.blockSize / 1.5 + ')');
                } else if (RelationshipGraph.verifyJson(json)) {
                    var parents = [];
                    var parentSizes = {};
                    var configuration = this.configuration;


                    var row = 0,
                        parent = void 0,
                        i = void 0,
                        maxWidth = void 0,
                        maxHeight = void 0,
                        calculatedMaxChildren = 0,
                        longestWidth = 0;
    
                    // Ensure that the JSON is sorted by parent.
                    configuration.sortFunction(json);
    
                    this.representation = json;
    
                    /**
                     * Loop through all of the childrenNodes in the JSON array and determine the amount of childrenNodes per
                     * parent. This will also calculate the row and index for each block and truncate the parent names to 25
                     * characters.
                     */
                    var jsonLength = json.length;
    
                    for (i = 0; i < jsonLength; i++) {
                        parent = json[i].parent;
    
                        if (RelationshipGraph.containsKey(parentSizes, parent)) {
                            parentSizes[parent]++;
                        } else {
                            parentSizes[parent] = 1;
                            parents.push(RelationshipGraph.truncate(parent, configuration.truncate));
                        }
                    }
    
                    /**
                     * Assign the indexes and rows to each child. This method also calculates the maximum amount of children
                     * per row, the longest row width, and how many rows there are.
                     */
    
    
                    // Set the max width and height.
    
                    var _assignIndexAndRow = this.assignIndexAndRow(json, parentSizes, parents);
    
                    var _assignIndexAndRow2 = _slicedToArray(_assignIndexAndRow, 3);
    
                    longestWidth = _assignIndexAndRow2[0];
                    calculatedMaxChildren = _assignIndexAndRow2[1];
                    row = _assignIndexAndRow2[2];
                    maxHeight = row * configuration.blockSize;
                    maxWidth = longestWidth + calculatedMaxChildren * configuration.blockSize;
    
                    // Account for the added _spacing.
                    maxWidth += this._spacing * calculatedMaxChildren;
    
                    for (i = 0; i < row; i++) {
                        maxHeight += this._spacing * i;
                    }
    
                    // Select all of the parent nodes.
                    var parentNodes = this.svg.selectAll('.relationshipGraph-Text').data(parents);
    
                    // Add new parent nodes.
                    this.createParents(parentNodes, parentSizes, longestWidth, calculatedMaxChildren);
    
                    // Update existing parent nodes.
                    this.updateParents(parentNodes, parentSizes, longestWidth, calculatedMaxChildren);
    
                    // Remove deleted parent nodes.
                    this.removeNodes(parentNodes);
    
                    // Select all of the children nodes.
                    var childrenNodes = this.svg.selectAll('.relationshipGraph-block').data(json);
    
                    // Add new child nodes.
                    this.createChildren(childrenNodes, longestWidth);
    
                    // Update existing child nodes.
                    this.updateChildren(childrenNodes, longestWidth);
    
                    // Delete removed child nodes.
                    this.removeNodes(childrenNodes);
    
                    if (this.configuration.showTooltips) {
                        d3.select('.d3-tip').remove();
                        this.svg.call(this.tooltip);
                    }
    
                    this.configuration.selection.select('svg').attr('width', Math.abs(maxWidth + 15)).attr('height', Math.abs(maxHeight + 15));
                }
    
                return this;
            }
        }, {
            key: 'search',

            /**
             * Searches through the representation and returns the child nodes that match the search query.
             *
             * @param {object} query The partial object match to search for.
             * @returns {Array} An array with the objects that matched the partial query or an empty array if none are found.
             */
            value: function search(query) {
                var results = [],
                    queryKeys = Object.keys(query),
                    queryKeysLength = queryKeys.length;
    
                if (this.representation && query) {
                    var length = this.representation.length;
    
                    for (var i = 0; i < length; i++) {
                        var currentObject = this.representation[i];
    
                        var isMatch = false;
    
                        for (var j = 0; j < queryKeysLength; j++) {
                            var queryVal = query[queryKeys[j]];
    
                            if (!(isMatch = currentObject[queryKeys[j]] == queryVal)) {
                                break;
                            }
                        }
    
                        if (isMatch) {
                            results.push(currentObject);
                        }
                    }
                }
    
                return results;
            }
        }], [{
            key: 'getColors',
            value: function getColors() {
                return ['#c4f1be', '#a2c3a4', '#869d96', '#525b76', '#201e50', '#485447', '#5b7f77', '#6474ad', '#b9c6cb', '#c0d6c1', '#754668', '#587d71', '#4daa57', '#b5dda4', '#f9eccc', '#0e7c7b', '#17bebb', '#d4f4dd', '#d62246', '#4b1d3f', '#cf4799', '#c42583', '#731451', '#f3d1bf', '#c77745'];
            }
        }, {
            key: 'containsKey',

            /**
             * Checks if the object contains the key.
             *
             * @param {object} obj The object to check in.
             * @param {string} key They key to check for.
             * @returns {boolean} Whether or not the object contains the key.
             * @private
             */
            value: function containsKey(obj, key) {
                return Object.keys(obj).indexOf(key) > -1;
            }
        }, {
            key: 'contains',

            /**
             * Checks whether or not the key is in the array.
             *
             * @param {*[]} arr The array to check in.
             * @param {string} key The key to check for.
             * @returns {boolean} Whether or not the key exists in the array.
             * @private
             */
            value: function contains(arr, key) {
                return arr.indexOf(key) > -1;
            }
        }, {
            key: 'truncate',

            /**
             * Truncate a string to 25 characters plus an ellipses.
             *
             * @param {string} str The string to truncate.
             * @param {number} cap The number to cap the string at before it gets truncated.
             * @returns {string} The string truncated (if necessary).
             * @private
             */
            value: function truncate(str, cap) {
                if (!cap || !str) {
                    return str;
                }
    
                return str.length > cap ? str.substring(0, cap) + '...' : str;
            }
        }, {
            key: 'isArray',

            /**
             * Determines if the array passed in is an Array object.
             *
             * @param arr {Array} The array object to check.
             * @returns {boolean} Whether or not the array is actually an array object.
             */
            value: function isArray(arr) {
                return Object.prototype.toString.call(arr) == '[object Array]';
            }
        }, {
            key: 'noop',

            /**
             * Noop function.
             *
             * @private
             */
            value: function noop() {}    
        }, {
            key: 'sortJson',

            /**
             * Sorts the array of JSON by parent name. This method is case insensitive.
             *
             * @param json {Array} The Array to be sorted.
             */
            value: function sortJson(json) {
                json.sort(function (child1, child2) {
                    var parent1 = child1.parent.toLowerCase(),
                        parent2 = child2.parent.toLowerCase();
    
                    return parent1 > parent2 ? 1 : parent1 < parent2 ? -1 : 0;
                });
            }
        }, {
            key: 'stringCompare',

            /**
             * Go through all of the thresholds and find the one that is equal to the value.
             *
             * @param {String} value The value from the JSON.
             * @param {Array} thresholds The thresholds from the JSON.
             * @returns {number} The index of the threshold that is equal to the value or -1 if the value doesn't equal any
             *  thresholds.
             * @private
             */
            value: function stringCompare(value, thresholds) {
                if (typeof value !== 'string') {
                    throw 'Cannot make value comparison between a string and a ' + (typeof value === 'undefined' ? 'undefined' : _typeof(value)) + '.';
                }
    
                if (!thresholds || !thresholds.length) {
                    throw 'Cannot find correct threshold because there are no thresholds.';
                }
    
                var thresholdsLength = thresholds.length;
    
                for (var i = 0; i < thresholdsLength; i++) {
                    if (value == thresholds[i]) {
                        return i;
                    }
                }
    
                return -1;
            }
        }, {
            key: 'numericCompare',

            /**
             * Go through all of the thresholds and find the smallest number that is greater than the value.
             *
             * @param {number} value The value from the JSON.
             * @param {Array} thresholds The thresholds from the JSON.
             * @returns {number} The index of the threshold that is the smallest number that is greater than the value or -1 if
             *  the value isn't between any thresholds.
             * @private
             */
            value: function numericCompare(value, thresholds) {
                if (typeof value !== 'number') {
                    throw 'Cannot make value comparison between a number and a ' + (typeof value === 'undefined' ? 'undefined' : _typeof(value)) + '.';
                }
    
                if (!thresholds || !thresholds.length) {
                    throw 'Cannot find correct threshold because there are no thresholds.';
                }
    
                var length = thresholds.length;
    
                for (var i = 0; i < length; i++) {
                    if (value <= thresholds[i]) {
                        return i;
                    }
                }
    
                return -1;
            }
        }, {
            key: 'verifyJson',

            /**
             * Verify that the JSON passed in is correct.
             *
             * @param json {Array} The array of JSON objects to verify.
             */
            value: function verifyJson(json) {
                if (!RelationshipGraph.isArray(json) || json.length < 0 || _typeof(json[0]) !== 'object') {
                    throw 'JSON has to be an Array of JavaScript objects that is not empty.';
                }
    
                var length = json.length;
    
                while (length--) {
                    var element = json[length];
                    var keys = Object.keys(element);
                    var keyLength = keys.length;
                    var parentColor = element.parentColor;
    
    
                    if (element.parent === undefined) {
                        throw 'Child does not have a parent.';
                    } else if (parentColor !== undefined && (parentColor > 4 || parentColor < 0)) {
                        throw 'Parent color is unsupported.';
                    }
    
                    while (keyLength--) {
                        if (keys[keyLength].toUpperCase() == 'VALUE') {
                            if (keys[keyLength] != 'value') {
                                json[length].value = json[length][keys[keyLength]];
                                delete json[length][keys[keyLength]];
                            }
                            break;
                        }
                    }
                }
    
                return true;
            }
        }]);
    
        return RelationshipGraph;
    }();
    
    /**
     * Add a relationshipGraph function to d3 that returns a RelationshipGraph object.
     */
    d3.relationshipGraph = function () {
        'use strict';
    
        return RelationshipGraph.extend.apply(RelationshipGraph, arguments);
    };
    
    /**
     * Add relationshipGraph to selection.
     *
     * @param {Object} userConfig Configuration for graph.
     * @return {Object} Returns a new RelationshipGraph object.
     */
    d3.selection.prototype.relationshipGraph = function (userConfig) {
        'use strict';
    
        return new RelationshipGraph(this, userConfig);
    };
});