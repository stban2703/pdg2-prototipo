const router = new Router(
    {
        home: new Layout(new Page("home.html")),
        notes: new Layout(new Page("notes.html")),
        createnotes: new Layout(new Page("createnotes.html")),
        "#default": new Page("home.html"),
    },
    document.querySelector(".page-content")
);
