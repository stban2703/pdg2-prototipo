const router = new Router(
    {
        home: new Layout(new Page("home.html")),
        notes: new Layout(new Page("notes.html")),
        createnotes: new Layout(new Page("createnotes.html")),
        memointro: new Layout(new Page("memointro.html")),
        meetinglist: new Layout(new Page("meetinglist.html")),
        meetingdetails: new Layout(new Page("meetingdetails.html")),
        "#default": new Page("home.html"),
    },
    document.querySelector(".page-content")
);
