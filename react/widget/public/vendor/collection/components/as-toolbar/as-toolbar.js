export class Toolbar {
    render() {
        return (h("header", null,
            h("nav", { class: 'as-toolbar-main' },
                h("slot", null)),
            this._generateTabs()));
    }
    _generateTabs() {
        // const sidebarLeft = document.querySelector('as-sidebar--left');
        // const sidebarRight = document.querySelector('as-sidebar--right');
        // const bottomBar = document.querySelector('.as-map-wrapper .as-bottom-bar');
        return (h("nav", { class: 'as-toolbar-tabs' },
            h("span", { onClick: this._showTab0, class: 'as-toolbar-tabs__item' }, "LEFT "),
            h("span", { onClick: this._showTab1, class: 'as-toolbar-tabs__item as-toolbar-tabs__item--active' }, "MAP"),
            h("span", { onClick: this._showTab2, class: 'as-toolbar-tabs__item' }, "RIGHT"),
            h("span", { onClick: this._showTab3, class: 'as-toolbar-tabs__item' }, "BOTTOM ")));
    }
    _showTab0(event) {
        document.querySelector('.as-sidebar.as-sidebar--left').classList.add('as-sidebar--left--visible');
        document.querySelector('.as-sidebar.as-sidebar--right').classList.remove('as-sidebar--right--visible');
        document.querySelector('.as-bottom-bar').classList.remove('as-bottom-bar--visible');
        document.querySelector('.as-toolbar-tabs .as-toolbar-tabs__item--active')
            .classList.remove('as-toolbar-tabs__item--active');
        event.target.classList.add('as-toolbar-tabs__item--active');
    }
    _showTab1(event) {
        document.querySelector('.as-sidebar.as-sidebar--left').classList.remove('as-sidebar--left--visible');
        document.querySelector('.as-sidebar.as-sidebar--right').classList.remove('as-sidebar--right--visible');
        document.querySelector('.as-bottom-bar').classList.remove('as-bottom-bar--visible');
        document.querySelector('.as-toolbar-tabs .as-toolbar-tabs__item--active')
            .classList.remove('as-toolbar-tabs__item--active');
        event.target.classList.add('as-toolbar-tabs__item--active');
    }
    _showTab2(event) {
        document.querySelector('.as-sidebar.as-sidebar--right').classList.add('as-sidebar--right--visible');
        document.querySelector('.as-sidebar.as-sidebar--left').classList.remove('as-sidebar--left--visible');
        document.querySelector('.as-bottom-bar').classList.remove('as-bottom-bar--visible');
        document.querySelector('.as-toolbar-tabs .as-toolbar-tabs__item--active').classList.remove('as-toolbar-tabs__item--active');
        event.target.classList.add('as-toolbar-tabs__item--active');
    }
    _showTab3(event) {
        document.querySelector('.as-sidebar.as-sidebar--right').classList.remove('as-sidebar--right--visible');
        document.querySelector('.as-sidebar.as-sidebar--left').classList.remove('as-sidebar--left--visible');
        document.querySelector('.as-bottom-bar').classList.add('as-bottom-bar--visible');
        document.querySelector('.as-toolbar-tabs .as-toolbar-tabs__item--active')
            .classList.remove('as-toolbar-tabs__item--active');
        event.target.classList.add('as-toolbar-tabs__item--active');
    }
    static get is() { return "as-toolbar"; }
}
