/**
 *  Since we use css and font loaders we can import style and icons like this.
 *   - https://github.com/webpack-contrib/css-loader (for css files)
 *   - https://github.com/webpack-contrib/url-loader (for the fonts)
 */ 
import '@carto/airship-style';
import '@carto/airship-icons';

/**
 * In order to use the web components the following code is required
 */
import { defineCustomElements } from '@carto/airship-components';
defineCustomElements(window);