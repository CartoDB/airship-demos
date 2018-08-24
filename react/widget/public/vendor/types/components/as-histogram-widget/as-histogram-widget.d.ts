import '../../stencil.core';
import 'd3-transition';
/**
 * Histogram Widget
 *
 * @export
 * @class HistogramWidget
 */
export declare class HistogramWidget {
    /**
     * Title of the widget to be displayed
     *
     * @type {string}
     * @memberof HistogramWidget
     */
    heading: string;
    /**
     * Description of the widget to be displayed
     *
     * @type {string}
     * @memberof HistogramWidget
     */
    description: string;
    /**
     * Toggles displaying title and description
     *
     * @type {boolean}
     * @memberof HistogramWidget
     */
    showHeader: boolean;
    /**
     * Display a clear button that clears the histogram selection.
     *
     * @type {boolean}
     * @memberof HistogramWidget
     */
    showClear: boolean;
    /**
     * Histogram data to be displayed
     *
     * @type {HistogramData[]}
     * @memberof HistogramWidget
     */
    data: HistogramData[];
    /**
     * Override color for the histogram bars
     *
     * @type {string}
     * @memberof HistogramWidget
     */
    color: string;
    /**
     * Override color for the selected histogram bars
     *
     * @type {string}
     * @memberof HistogramWidget
     */
    selectedColor: string;
    /**
     * Color range for histogram data
     *
     * @type {HistogramColorRange[]}
     * @memberof HistogramWidget
     */
    colorRange: HistogramColorRange[];
    /**
     * Function that formats the tooltip. Receives HistogramData and outputs a string
     *
     * @type {(HistogramData) => string}
     * @memberof HistogramWidget
     */
    tooltipFormatter: (value: HistogramData) => string;
    /**
     * Fired when user update or clear the widget selection.
     *
     * @type {EventEmitter<number[]>}
     * @memberof HistogramWidget
     */
    private selectionChanged;
    private tooltip;
    private container;
    private tooltipElement;
    private xScale;
    private yScale;
    private yAxis;
    private xAxis;
    private yAxisSelection;
    private xAxisSelection;
    private barsContainer;
    private bars;
    private brush;
    private brushArea;
    private customHandlers;
    private bottomLine;
    private selection;
    /**
     * Default formatting function. Makes the value a readable number and
     * converts it into a string. Useful to compose with your own formatting
     * function.
     *
     * @memberof HistogramWidget
     */
    defaultFormatter(data: HistogramData): string;
    /**
     * Returns the current selection
     *
     * @returns {number[]}
     * @memberof HistogramWidget
     */
    getSelection(): number[];
    /**
     * Programmatically set the selection. It will be adjusted to the buckets
     * present in {@link data}. To clear see {@link clearSelection} or call with null
     *
     * @param {number[] | null} values
     * @memberof HistogramWidget
     */
    setSelection(values: number[] | null): void;
    /**
     * Clears the Histogram selection
     *
     * @memberof HistogramWidget
     */
    clearSelection(): void;
    onDataChanged(): void;
    onColorChanged(): void;
    componentDidLoad(): void;
    render(): JSX.Element[];
    private _renderGraph;
    private _adjustSelection;
    private _adjustSelectionFor;
    private _hideCustomHandlers;
    private _onBrush;
    private _setSelection;
    private _selectionInData;
    private _isSelected;
    private _updateHandles;
    private _renderYAxis;
    private _renderXAxis;
    private _renderBars;
    private _getTooltipPosition;
    private _showTooltip;
    private _cleanAxes;
    private _updateAxes;
    private _renderHeader;
    private _renderTooltip;
    private _renderClearBtn;
}
export interface HistogramData {
    start: number;
    end: number;
    value: number;
}
export interface HistogramColorRange {
    min: number;
    max: number;
    color: string;
}
