const router = new Router(
    {
        home: new Layout(new Page("home.html")),
        notes: new Layout(new Page("notes.html")),
        notesdetails: new Layout(new Page("notesdetails.html")),
        createnotes: new Layout(new Page("createnotes.html")),
        memointro: new Layout(new Page("memointro.html")),
        meetinglist: new Layout(new Page("meetinglist.html")),
        meetingdetails: new Layout(new Page("meetingdetails.html")),
        createmeeting: new Layout(new Page("createmeeting.html")),
        "#default": new Page("home.html"),
    },
    document.querySelector(".page-content")
);
