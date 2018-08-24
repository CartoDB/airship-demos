import readableNumber from '../../utils/readable-number';
import { shadeOrBlend } from '../../utils/styles';
const OTHER_CATEGORY_COLOR = '#747474';
const OTHER_CATEGORY_NAME = 'Other';
const DEFAULT_BAR_COLOR = '#47DB99';
/**
 * Category Widget
 *
 * @export
 * @class CategoryWidget
 */
export class CategoryWidget {
    constructor() {
        /**
         * Array of categories to display in the widget.
         * Each category should include a `name` and a `value`.
         * You can also override the bar color for each category with `color`.
         *
         * @type {object[]}
         * @memberof CategoryWidget
         */
        this.categories = [];
        /**
         * Default color to draw the bars. Default value is `#47DB99`.
         *
         * @type {string}
         * @memberof CategoryWidget
         */
        this.defaultBarColor = DEFAULT_BAR_COLOR;
        /**
         * If truthy, it'll show a button to clear selected categories when there are any. Default value is `false`.
         *
         * @type {boolean}
         * @memberof CategoryWidget
         */
        this.showClearButton = false;
        /**
         * If truthy, it'll render the heading and component's description. Default value is `true`.
         *
         * @type {boolean}
         * @memberof CategoryWidget
         */
        this.showHeader = true;
        /**
         * If truthy, we'll use the sum of all categories' value to render the bar percentage.
         * By default, we use the maximum category value to render the bar percentage.
         *
         * @type {boolean}
         * @memberof CategoryWidget
         */
        this.useTotalPercentage = false;
        /**
         * The number of visible categories without aggregation.
         *
         * @type {number}
         * @memberof CategoryWidget
         */
        this.visibleCategories = Infinity;
        this.selectedCategories = [];
    }
    /**
     * Get current selected categories
     *
     * @returns
     * @memberof CategoryWidget
     */
    getSelectedCategories() {
        return this.selectedCategories;
    }
    /**
     * Clear current selected categories
     *
     * @returns
     * @memberof CategoryWidget
     */
    clearSelection() {
        if (!this.selectedCategories.length) {
            return;
        }
        this.selectedCategories = [];
        this._onCategoriesChanged();
    }
    render() {
        return [
            this._renderHeader(),
            this._renderCategoryList(),
            this._renderFooter()
        ];
    }
    _renderHeader() {
        if (!this.showHeader) {
            return;
        }
        return [
            h("h2", { class: 'as-category-widget__heading' }, this.heading),
            h("p", { class: 'as-category-widget__description as-body' }, this.description),
        ];
    }
    _renderCategoryList() {
        return h("ul", { class: 'as-category-widget__list' }, this._renderCategories());
    }
    _renderCategories() {
        const moreCategoriesThanVisible = this.categories.length > this.visibleCategories;
        const { categories, otherCategory } = this._parseCategories();
        let otherCategoryTemplate;
        const categoriesToRender = categories.slice(0, this.visibleCategories);
        const maximumValue = this.useTotalPercentage
            ? this._getCategoriesTotalValue(this.categories)
            : this._getVisibleCategoriesMaximumValue();
        if (otherCategory || moreCategoriesThanVisible) {
            otherCategoryTemplate = this._renderOtherCategory(otherCategory, { maximumValue });
        }
        return [
            categoriesToRender.map((category) => this._renderCategory(category, { maximumValue })),
            otherCategoryTemplate
        ];
    }
    _renderCategory(category, options) {
        const { isOther, maximumValue } = options;
        const isSelected = this._isSelected(category.name);
        const isAnyCategorySelected = this.selectedCategories.length > 0;
        const barColor = this._getBarColor(category.color || this.defaultBarColor, { isSelected, isOther });
        const progressStyles = {
            backgroundColor: barColor,
            width: `${(category.value / maximumValue) * 100}%`
        };
        const cssClasses = {
            'as-category-widget__category': true,
            'as-category-widget__category--not-selected': isAnyCategorySelected && (!isSelected || isOther),
            'as-category-widget__category--other': isOther,
            'as-category-widget__category--selected': isSelected
        };
        return (h("li", { class: cssClasses, onClick: () => this._toggleCategory(category) },
            h("p", { class: 'as-category-widget__info as-body' },
                h("div", { class: 'as-category-widget__title' }, category.name),
                readableNumber(category.value)),
            h("div", { class: 'as-category-widget__bar' },
                h("div", { class: 'as-category-widget__bar-value', style: progressStyles }))));
    }
    _renderOtherCategory(category, options) {
        const categoryData = category || {
            name: 'Other',
            value: this._getCategoriesTotalValue(this.categories.slice(this.visibleCategories, this.categories.length))
        };
        return this._renderCategory(categoryData, { maximumValue: options.maximumValue, isOther: true });
    }
    _renderFooter() {
        const selectedCount = this.selectedCategories.length;
        return (h("footer", { class: 'as-category-widget__footer' },
            h("div", { class: 'as-category-widget__count as-body' },
                selectedCount || 'All',
                " selected"),
            this.showClearButton && (h("button", { class: 'as-btn as-btn--primary as-btn--s as-category-widget__clear', disabled: !selectedCount, onClick: () => this.clearSelection() }, "Clear selection"))));
    }
    _isSelected(categoryName) {
        return this.selectedCategories.includes(categoryName);
    }
    _toggleCategory(category) {
        this.selectedCategories = this._isSelected(category.name)
            ? this.selectedCategories.filter((currentCategory) => currentCategory !== category.name)
            : [...this.selectedCategories, category.name];
        this._onCategoriesChanged();
    }
    _onCategoriesChanged() {
        this.categoriesSelected.emit(this.selectedCategories);
    }
    _getVisibleCategoriesMaximumValue() {
        return this._getVisibleCategories().reduce((maximum, currentCategory) => currentCategory.value > maximum ? currentCategory.value : maximum, 0);
    }
    _getCategoriesTotalValue(categories) {
        return categories.reduce((sum, currentCategory) => currentCategory.value + sum, 0);
    }
    _getBarColor(color, options = {}) {
        if (options.isOther) {
            return OTHER_CATEGORY_COLOR;
        }
        if (options.isSelected) {
            return shadeOrBlend(-0.16, color);
        }
        return color;
    }
    _parseCategories() {
        const otherCategory = this.categories.find((category) => category.name === OTHER_CATEGORY_NAME);
        if (otherCategory) {
            const categories = this.categories
                .filter((category) => category.name !== otherCategory.name);
            return { categories, otherCategory };
        }
        return { categories: this.categories };
    }
    _getVisibleCategories() {
        return this.categories.slice(0, this.visibleCategories);
    }
    static get is() { return "as-category-widget"; }
    static get properties() { return {
        "categories": {
            "type": "Any",
            "attr": "categories"
        },
        "clearSelection": {
            "method": true
        },
        "defaultBarColor": {
            "type": String,
            "attr": "default-bar-color"
        },
        "description": {
            "type": String,
            "attr": "description"
        },
        "getSelectedCategories": {
            "method": true
        },
        "heading": {
            "type": String,
            "attr": "heading"
        },
        "selectedCategories": {
            "state": true
        },
        "showClearButton": {
            "type": Boolean,
            "attr": "show-clear-button"
        },
        "showHeader": {
            "type": Boolean,
            "attr": "show-header"
        },
        "useTotalPercentage": {
            "type": Boolean,
            "attr": "use-total-percentage"
        },
        "visibleCategories": {
            "type": Number,
            "attr": "visible-categories"
        }
    }; }
    static get events() { return [{
            "name": "categoriesSelected",
            "method": "categoriesSelected",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return "/**style-placeholder:as-category-widget:**/"; }
}
