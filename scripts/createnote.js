import { checkAuthState, logOut } from "./modules/auth.js";
import { submitNote } from "./modules/firestore.js";
import { submitTestFile } from "./modules/storage.js";

let ls = window.localStorage;
let localUser = JSON.parse(ls.getItem('currentuser'))
let currentUser = localUser
if (currentUser != null || currentSignedInUser() != null) {

} else {
    window.location = "login.html"
}

const filetype = location.search.replace("?", "");
const createNoteFiles = document.querySelector(".createNote__files")
const textFileSection = createNoteFiles.querySelector(".textfile")
const videoFileSection = createNoteFiles.querySelector(".videofile")
const noteForm = document.querySelector('.noteForm')

switch (filetype) {
    case "text":
        textFileSection.classList.remove("hidden")
        break;
    case "video":
        videoFileSection.classList.remove("hidden")
        break;
}

noteForm.addEventListener('submit', function (event) {
    event.preventDefault()
    const name = noteForm.name.value
    const week = noteForm.week.value
    const categorie = noteForm.categorie.value
    const subject = noteForm.subject.value
    if (videoFileSection) {
        const file = noteForm.file.files[0]
        submitNote(currentUser.id, name, week, categorie, subject, file)
    }
})


const recordAudioButton = document.querySelector(".recordAudio")
const stopAudioButton = document.querySelector(".stopAudio")

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    console.log('getUserMedia supported.');
    navigator.mediaDevices.getUserMedia(
        // constraints - only audio needed for this app
        {
            audio: true
        })

        // Success callback
        .then(function (stream) {
            const mediaRecorder = new MediaRecorder(stream);
            recordAudioButton.addEventListener("click", () => {
                mediaRecorder.start()
                console.log(mediaRecorder.state);
                console.log("Grabando audio")
            })
            
            let chunks = [];
            mediaRecorder.ondataavailable = function (e) {
                chunks.push(e.data);
            }

            stopAudioButton.addEventListener('click', () => {
                mediaRecorder.stop();
                console.log("Audio detenido")
            })

            mediaRecorder.onstop = function (e) {
                const blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
                console.log(mediaRecorder.state);
                console.log(blob)
                chunks = [];
                submitTestFile(blob, "notadeaudioprueba")
            }
        })

        // Error callback
        .catch(function (err) {
            console.log('The following getUserMedia error occurred: ' + err);
        }
        );
} else {
    console.log('getUserMedia not supported on your browser!');
}

