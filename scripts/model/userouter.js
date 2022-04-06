const router = new Router(
    {
        home: new Layout(new Page("home.html")),
        notes: new Layout(new Page("notes.html")),
        notesdetails: new Layout(new Page("notesdetails.html")),
        createnotes: new Layout(new Page("createnotes.html")),
        memointro: new Layout(new Page("memointro.html")),
        memoedit: new Layout(new Page("memoedit.html")),
        meetinglist: new Layout(new Page("meetinglist.html")),
        meetingdetails: new Layout(new Page("meetingdetails.html")),
        createmeeting: new Layout(new Page("createmeeting.html")),
        createmeetingminutes: new Layout(new Page("createmeetingminutes.html")),
        meetingminutesdetails: new Layout(new Page("meetingminutesdetails.html")),
        memosectionedit: new Layout(new Page("memosectionedit.html")),
        memoselectsubject: new Layout(new Page("memoselectsubject.html")),
        memosections: new Layout(new Page("memosections.html")),
        "#default": new Page("home.html"),
    },
    document.querySelector(".page-content")
);
