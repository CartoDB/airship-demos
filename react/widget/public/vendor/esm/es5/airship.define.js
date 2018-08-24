// airship: Custom Elements Define Library, ES Module/ES5 Target
import { defineCustomElement } from './airship.core.js';
import {
  ApplicationContent,
  CategoryWidget,
  HistogramWidget,
  Infowindow,
  RangeSlider,
  RangeSliderBar,
  RangeSliderThumb,
  Toolbar,
  ToolbarItem
} from './airship.components.js';

export function defineCustomElements(window, opts) {
  defineCustomElement(window, [
    ApplicationContent,
    CategoryWidget,
    HistogramWidget,
    Infowindow,
    RangeSlider,
    RangeSliderBar,
    RangeSliderThumb,
    Toolbar,
    ToolbarItem
  ], opts);
}