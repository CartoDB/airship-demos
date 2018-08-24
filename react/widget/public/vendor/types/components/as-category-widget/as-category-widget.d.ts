import '../../stencil.core';
import { EventEmitter } from '../../stencil.core';
/**
 * Category Widget
 *
 * @export
 * @class CategoryWidget
 */
export declare class CategoryWidget {
    /**
     * Array of categories to display in the widget.
     * Each category should include a `name` and a `value`.
     * You can also override the bar color for each category with `color`.
     *
     * @type {object[]}
     * @memberof CategoryWidget
     */
    categories: object[];
    /**
     * Default color to draw the bars. Default value is `#47DB99`.
     *
     * @type {string}
     * @memberof CategoryWidget
     */
    defaultBarColor: string;
    /**
     * Description text of the widget
     *
     * @type {string}
     * @memberof CategoryWidget
     */
    description: string;
    /**
     * Heading text of the widget
     *
     * @type {string}
     * @memberof CategoryWidget
     */
    heading: string;
    /**
     * If truthy, it'll show a button to clear selected categories when there are any. Default value is `false`.
     *
     * @type {boolean}
     * @memberof CategoryWidget
     */
    showClearButton: boolean;
    /**
     * If truthy, it'll render the heading and component's description. Default value is `true`.
     *
     * @type {boolean}
     * @memberof CategoryWidget
     */
    showHeader: boolean;
    /**
     * If truthy, we'll use the sum of all categories' value to render the bar percentage.
     * By default, we use the maximum category value to render the bar percentage.
     *
     * @type {boolean}
     * @memberof CategoryWidget
     */
    useTotalPercentage: boolean;
    /**
     * The number of visible categories without aggregation.
     *
     * @type {number}
     * @memberof CategoryWidget
     */
    visibleCategories: number;
    /**
     * Fired when selected categories changed or selected categories are cleared.
     *
     * @event categoriesSelected
     * @type {EventEmitter<string[]>}
     * @memberof CategoryWidget
     */
    categoriesSelected: EventEmitter<string[]>;
    private selectedCategories;
    /**
     * Get current selected categories
     *
     * @returns
     * @memberof CategoryWidget
     */
    getSelectedCategories(): string[];
    /**
     * Clear current selected categories
     *
     * @returns
     * @memberof CategoryWidget
     */
    clearSelection(): void;
    render(): JSX.Element[];
    private _renderHeader;
    private _renderCategoryList;
    private _renderCategories;
    private _renderCategory;
    private _renderOtherCategory;
    private _renderFooter;
    private _isSelected;
    private _toggleCategory;
    private _onCategoriesChanged;
    private _getVisibleCategoriesMaximumValue;
    private _getCategoriesTotalValue;
    private _getBarColor;
    private _parseCategories;
    private _getVisibleCategories;
}
export interface Category {
    name: string;
    value: number;
    color?: string;
}
export interface CategoryOptions {
    maximumValue: number;
    isOther?: boolean;
}
