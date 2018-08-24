import { max } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { brushX } from 'd3-brush';
import { scaleLinear } from 'd3-scale';
import { event as d3event, select } from 'd3-selection';
import 'd3-transition';
import readableNumber from '../../utils/readable-number';
import { shadeOrBlend } from '../../utils/styles';
const CUSTOM_HANDLE_SIZE = 15;
const DEFAULT_BAR_COLOR = '#1785FB';
const DEFAULT_SELECTED_BAR_COLOR = '#47DB99';
const WIDTH = 205;
const HEIGHT = 125;
const BARS_SEPARATION = 1;
const MARGIN = {
    BOTTOM: 15,
    LEFT: 30,
    RIGHT: 3,
    TOP: 15,
};
const CUSTOM_HANDLE_Y_COORD = HEIGHT + MARGIN.TOP - (CUSTOM_HANDLE_SIZE / 2);
/**
 * Histogram Widget
 *
 * @export
 * @class HistogramWidget
 */
export class HistogramWidget {
    constructor() {
        /**
         * Toggles displaying title and description
         *
         * @type {boolean}
         * @memberof HistogramWidget
         */
        this.showHeader = true;
        /**
         * Histogram data to be displayed
         *
         * @type {HistogramData[]}
         * @memberof HistogramWidget
         */
        this.data = [];
        /**
         * Override color for the histogram bars
         *
         * @type {string}
         * @memberof HistogramWidget
         */
        this.color = DEFAULT_BAR_COLOR;
        /**
         * Override color for the selected histogram bars
         *
         * @type {string}
         * @memberof HistogramWidget
         */
        this.selectedColor = DEFAULT_SELECTED_BAR_COLOR;
        /**
         * Function that formats the tooltip. Receives HistogramData and outputs a string
         *
         * @type {(HistogramData) => string}
         * @memberof HistogramWidget
         */
        this.tooltipFormatter = this.defaultFormatter;
        this.selection = null;
    }
    /**
     * Default formatting function. Makes the value a readable number and
     * converts it into a string. Useful to compose with your own formatting
     * function.
     *
     * @memberof HistogramWidget
     */
    defaultFormatter(data) {
        return `${readableNumber(data.value)}`;
    }
    /**
     * Returns the current selection
     *
     * @returns {number[]}
     * @memberof HistogramWidget
     */
    getSelection() {
        return this.selection;
    }
    /**
     * Programmatically set the selection. It will be adjusted to the buckets
     * present in {@link data}. To clear see {@link clearSelection} or call with null
     *
     * @param {number[] | null} values
     * @memberof HistogramWidget
     */
    setSelection(values) {
        this._setSelection(values);
    }
    /**
     * Clears the Histogram selection
     *
     * @memberof HistogramWidget
     */
    clearSelection() {
        this._setSelection(null);
    }
    onDataChanged() {
        this._updateAxes();
        this._renderBars();
        if (this.selection === null) {
            return;
        }
        if (this._selectionInData(this.selection)) {
            this._setSelection(this.selection);
        }
        else {
            this.clearSelection();
        }
    }
    onColorChanged() {
        this._renderBars();
    }
    componentDidLoad() {
        // This is probably not necessary for production, but HMR causes this method
        // to be called on each file change
        this.container.selectAll('*').remove();
        this._renderGraph();
    }
    render() {
        return [
            this._renderHeader(),
            h("svg", { ref: (ref) => this.container = select(ref), viewBox: '0 0 248 160' }),
            this._renderClearBtn(),
            this._renderTooltip()
        ];
    }
    _renderGraph() {
        this._renderYAxis();
        this._renderXAxis();
        this.barsContainer = this.container
            .append('g')
            .attr('transform', `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);
        this.brush = brushX()
            .handleSize(BARS_SEPARATION + 4)
            .extent([[MARGIN.LEFT, MARGIN.TOP], [WIDTH + MARGIN.LEFT, HEIGHT + MARGIN.TOP]])
            .on('brush', this._onBrush.bind(this));
        this.brushArea = this.container
            .append('g')
            .attr('class', 'brush')
            .call(this.brush);
        this.brushArea.on('mousemove', () => {
            const evt = d3event;
            const { clientX, clientY } = evt;
            let anyHovered = false;
            this.barsContainer.selectAll('rect')
                .each((data, i, nodes) => {
                const selected = this._isSelected(data);
                const nodeSelection = select(nodes[i]);
                const node = nodes[i];
                const bb = node.getBoundingClientRect();
                const isInsideBB = bb.left <= clientX &&
                    clientX <= bb.right &&
                    bb.top <= clientY &&
                    clientY <= bb.bottom;
                if (isInsideBB) {
                    nodeSelection.style('fill', shadeOrBlend(-0.16, selected ? this.selectedColor : this.color));
                    this.tooltip = this.tooltipFormatter(data);
                    this._showTooltip(evt);
                    anyHovered = true;
                }
                else {
                    nodeSelection.style('fill', selected ? this.selectedColor : this.color);
                }
            });
            if (!anyHovered) {
                this.tooltip = null;
            }
        })
            .on('mouseout', () => {
            this.tooltip = null;
            this.barsContainer.selectAll('rect')
                .style('fill', (data) => this._isSelected(data) ? this.selectedColor : this.color);
        });
        this.customHandlers = this.brushArea.selectAll('.handle--custom')
            .data([{ type: 'w' }, { type: 'e' }])
            .enter().append('rect')
            .style('opacity', 0)
            .attr('class', 'handle--custom')
            .attr('fill', this.selectedColor)
            .attr('cursor', 'ew-resize')
            .attr('width', CUSTOM_HANDLE_SIZE)
            .attr('height', CUSTOM_HANDLE_SIZE)
            .attr('rx', '100')
            .attr('ry', '100');
        this.bottomLine = this.brushArea.append('line')
            .attr('class', 'bottomline')
            .attr('stroke', this.selectedColor)
            .attr('stroke-width', 4)
            .attr('y1', HEIGHT + MARGIN.TOP)
            .attr('y2', HEIGHT + MARGIN.TOP)
            .style('opacity', 0)
            .attr('pointer-events', 'none');
        this._renderBars();
        this._cleanAxes();
    }
    _adjustSelection(values) {
        if (values === null) {
            return null;
        }
        return [this._adjustSelectionFor(values[0], 'start'),
            this._adjustSelectionFor(values[1], 'end')];
    }
    _adjustSelectionFor(value, fieldName) {
        if (value <= this.data[0].start) {
            return this.data[0][fieldName];
        }
        if (value >= this.data[this.data.length - 1].end) {
            return this.data[this.data.length - 1][fieldName];
        }
        for (const iterator of this.data) {
            const breakPoint = iterator.start + Math.floor((iterator.end - iterator.start) / 2);
            if (value >= iterator.start && value < breakPoint) {
                return iterator.start;
            }
            else if (value >= breakPoint && value < iterator.end) {
                return iterator.end;
            }
        }
    }
    _hideCustomHandlers() {
        this.customHandlers.style('opacity', 0);
        this.bottomLine.style('opacity', 0);
    }
    _onBrush() {
        const evt = d3event; // I can't cast this properly :(
        if (evt.selection === null) {
            this._hideCustomHandlers();
            return;
        }
        // I don't know why this happens
        if (!evt.sourceEvent || evt.sourceEvent.type === 'brush') {
            return;
        }
        // Convert to our data's domain
        const d0 = evt.selection
            .map((e) => Math.round(this.xScale.invert(e - MARGIN.LEFT)));
        this._setSelection(d0);
    }
    _setSelection(selection) {
        const adjustedSelection = this._adjustSelection(selection);
        if (adjustedSelection !== null && (adjustedSelection[0] === adjustedSelection[1])) {
            return;
        }
        this.selection = adjustedSelection;
        this.selectionChanged.emit(this.selection);
        this._updateHandles(adjustedSelection);
    }
    _selectionInData(selection) {
        const inData = selection.map((selectionValue) => {
            return this.data.some((value) => selectionValue >= value.start && selectionValue <= value.end);
        });
        // True if any of the selection values is inside the data
        // Using inData.every(e => e) would be more restrictive
        return inData.some((e) => e);
    }
    _isSelected(data) {
        if (this.selection === null) {
            return false;
        }
        return data.start >= this.selection[0] && data.end <= this.selection[1];
    }
    _updateHandles(values) {
        if (values === null) {
            this.barsContainer.selectAll('rect').style('fill', this.color);
            this.brushArea.call(this.brush.move, null);
            return;
        }
        // Convert back to space coordinates
        const valuesSpace = values.map(this.xScale).map((e) => e + MARGIN.LEFT);
        this.brushArea.call(this.brush.move, valuesSpace);
        this.customHandlers
            .style('opacity', 1)
            .attr('transform', (_d, i) => `translate(${valuesSpace[i] - (CUSTOM_HANDLE_SIZE / 2)},${CUSTOM_HANDLE_Y_COORD})`);
        this.bottomLine
            .style('opacity', 1)
            .attr('x1', valuesSpace[0])
            .attr('x2', valuesSpace[1]);
        this.barsContainer.selectAll('.bar')
            .style('fill', (_d, i) => {
            const d = this.data[i];
            return (values[0] <= d.start && d.end <= values[1]) ? this.selectedColor : this.color;
        });
    }
    _renderYAxis() {
        const data = this.data;
        // -- Y Axis
        this.yScale = scaleLinear()
            .range([HEIGHT, 0])
            .domain([0, max(data, (d) => d.value)])
            .nice();
        this.yAxis = axisLeft(this.yScale)
            .tickSize(-WIDTH)
            .ticks(5)
            .tickPadding(10);
        this.yAxisSelection = this.container
            .append('g')
            .attr('class', 'yAxis')
            .attr('transform', `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)
            .call(this.yAxis);
    }
    _renderXAxis() {
        const data = this.data;
        const { start } = data.length > 0 ? data[0] : { start: 0 };
        const { end } = data.length > 0 ? data[data.length - 1] : { end: 0 };
        this.xScale = scaleLinear()
            .domain([start, end])
            .range([0, WIDTH]);
        this.xAxis = axisBottom(this.xScale)
            .tickSize(-WIDTH)
            .ticks(3)
            .tickPadding(10);
        this.xAxisSelection = this.container
            .append('g')
            .attr('class', 'xAxis')
            .attr('transform', `translate(${MARGIN.LEFT}, ${HEIGHT + MARGIN.BOTTOM})`)
            .call(this.xAxis);
    }
    _renderBars() {
        const data = this.data;
        const barWidth = data.length === 0 ? WIDTH : WIDTH / data.length;
        // -- Draw bars
        this.bars = this.barsContainer
            .selectAll('rect')
            .data(data);
        // -- Exit
        this.bars.exit().remove();
        // -- Enter
        this.bars
            .enter()
            .append('rect')
            .merge(this.bars)
            .attr('class', 'bar')
            .attr('y', HEIGHT)
            .attr('x', (_d, index) => index * barWidth)
            .attr('width', () => Math.max(0, barWidth - BARS_SEPARATION))
            .attr('height', 0)
            .style('fill', this.color)
            .transition()
            .delay(200)
            .attr('y', (d) => this.yScale(d.value))
            .attr('height', (d) => HEIGHT - this.yScale(d.value));
        // -- Update
        this.bars
            .attr('y', (d) => this.yScale(d.value))
            .attr('height', (d) => HEIGHT - this.yScale(d.value));
    }
    _getTooltipPosition(mouseX, mouseY) {
        const OFFSET = 25;
        let x = mouseX;
        let y = mouseY;
        const viewportBoundaries = {
            bottom: window.innerHeight + window.pageYOffset,
            right: window.innerWidth + window.pageXOffset,
        };
        const tooltipContainerBoundingRect = this.tooltipElement.getBoundingClientRect();
        const tooltipBoundaries = {
            bottom: mouseY + tooltipContainerBoundingRect.height,
            right: mouseX + tooltipContainerBoundingRect.width,
        };
        if (viewportBoundaries.right < tooltipBoundaries.right) {
            x = mouseX - tooltipContainerBoundingRect.width;
        }
        if (viewportBoundaries.bottom < tooltipBoundaries.bottom) {
            y = mouseY - tooltipContainerBoundingRect.height - OFFSET;
        }
        return [x, y];
    }
    _showTooltip(event) {
        if (!this.tooltipElement) {
            return;
        }
        const [x, y] = this._getTooltipPosition(event.layerX, event.layerY);
        select(this.tooltipElement)
            .style('opacity', '1')
            .style('left', `${x + 10}px`)
            .style('top', `${y + 20}px`);
    }
    _cleanAxes() {
        this.yAxisSelection.select('.domain').remove();
        this.xAxisSelection.select('.domain').remove();
        this.xAxisSelection.selectAll('line').remove();
    }
    _updateAxes() {
        const data = this.data;
        const { start } = data[0];
        const { end } = data[data.length - 1];
        // -- Update scales
        this.yScale
            .domain([0, max(data, (d) => d.value)])
            .nice();
        this.xScale
            .domain([start, end]);
        // -- Update axes
        this.xAxisSelection
            .call(this.xAxis);
        this.yAxisSelection
            .call(this.yAxis);
        this._cleanAxes();
    }
    _renderHeader() {
        if (!this.showHeader) {
            return;
        }
        return [
            h("h3", { class: 'as-histogram-widget__header' }, this.heading),
            h("p", { class: 'as-histogram-widget__description' }, this.description),
        ];
    }
    _renderTooltip() {
        if (this.tooltip === null) {
            return;
        }
        return (h("span", { ref: (ref) => this.tooltipElement = ref, role: 'tooltip', class: 'as-histogram-widget__tooltip' }, this.tooltip));
    }
    _renderClearBtn() {
        if (!this.showClear) {
            return;
        }
        return (h("button", { onClick: () => this._setSelection(null) }, "Clear selection"));
    }
    static get is() { return "as-histogram-widget"; }
    static get properties() { return {
        "clearSelection": {
            "method": true
        },
        "color": {
            "type": String,
            "attr": "color",
            "watchCallbacks": ["onColorChanged"]
        },
        "colorRange": {
            "type": "Any",
            "attr": "color-range"
        },
        "data": {
            "type": "Any",
            "attr": "data",
            "watchCallbacks": ["onDataChanged"]
        },
        "defaultFormatter": {
            "method": true
        },
        "description": {
            "type": String,
            "attr": "description"
        },
        "getSelection": {
            "method": true
        },
        "heading": {
            "type": String,
            "attr": "heading"
        },
        "selectedColor": {
            "type": String,
            "attr": "selected-color"
        },
        "setSelection": {
            "method": true
        },
        "showClear": {
            "type": Boolean,
            "attr": "show-clear"
        },
        "showHeader": {
            "type": Boolean,
            "attr": "show-header"
        },
        "tooltip": {
            "state": true
        },
        "tooltipFormatter": {
            "type": "Any",
            "attr": "tooltip-formatter"
        }
    }; }
    static get events() { return [{
            "name": "selectionChanged",
            "method": "selectionChanged",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return "/**style-placeholder:as-histogram-widget:**/"; }
}
