let baseLink = ""
let linkRoute = ""
let tabRoute = ""

function checkLocationLink() {
    let link = window.location.href;
    if (!link.includes("#")) {
        baseLink = link + "#"
        window.location.href = baseLink;
    } else {
        let linkSegments = []
        linkSegments = link.split("#")
        baseLink = linkSegments[0] + "#"
        linkRoute = linkSegments[1]
        tabRoute = ""

        if (linkRoute.includes("gallery")) {
            let localRoute = linkRoute.split("/")
            linkRoute = "/" + localRoute[1]

            if (localRoute[2]) {
                tabRoute = localRoute[2]
            }
        }
    }
}

function router() {
    checkLocationLink()
    if (linkRoute == "") {
        redirect("/home")
    } else if (linkRoute == "/home") {
        homeScreen()
    } else if (linkRoute.includes("/gallery")) {
        galleryScreen()
    }
}

function redirect(url) {
    window.location.href = baseLink + url
}

function refresh() {
    router()
}

window.onhashchange = function () {
    router()
}

router()