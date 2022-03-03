class Router {
    constructor(routes, el) {
        this.routes = routes;
        this.el = el;
        window.onhashchange = this.hashChanged.bind(this);
        this.hashChanged();
    }

    async hashChanged(ev) {
        if (window.location.hash.length > 0) {
            let pageName = window.location.hash.substring(1);
            if (pageName.includes("?")) {
                let fragments = pageName.split("?")
                this.show(fragments[0])
            } else {
                this.show(pageName);
            }
        } else if (this.routes["#default"]) {
            this.show("#default");
        }
    }

    async show(pageName) {
        const page = this.routes[pageName];
        await page.load();
        this.el.innerHTML = "";
        page.show(this.el);
    }
}
