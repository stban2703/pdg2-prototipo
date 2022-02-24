const router = new Router(
    {
        home: new Layout(new Page("home.html")),
        notes: new Layout(new Page("notes.html")),
        "#default": new Page("home.html"),
    },
    document.querySelector(".page-content")
);
