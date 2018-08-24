export class ToolbarItem {
    render() {
        return (h("span", { class: 'as-toolbar-main__item' },
            h("img", { src: this.src, alt: this.text }),
            h("p", null, this.text)));
    }
    static get is() { return "as-toolbar-item"; }
    static get properties() { return {
        "src": {
            "type": String,
            "attr": "src"
        },
        "text": {
            "type": String,
            "attr": "text"
        }
    }; }
}
