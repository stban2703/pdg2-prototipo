import { createNote } from "./modules/firestore.js";

export function submitNote() {
    const createNoteForm = document.querySelector('.createnote-form')
    if (createNoteForm) {
        createNoteForm.addEventListener('submit', function (event) {
            event.preventDefault()
            const name = createNoteForm.name.value
            const week = createNoteForm.week.value
            const categorie = createNoteForm.category.value
            const subject = createNoteForm.subject.value
            const textnote = createNoteForm.textnote.value
            const fileNote = createNoteForm.fileNote.value
            console.log(name + ", " + week + ", " + categorie + ", " + subject)
            if (textnote != "") {

            } else if (fileNote != null) {

            }
            /*if (videoFileSection) {
                const file = createNoteForm.file.files[0]
                createNote(currentUser.id, name, week, categorie, subject, file)
            }*/
        })
    }
}

/*const recordAudioButton = document.querySelector(".recordAudioBtn")
const stopAudioButton = document.querySelector(".stopAudioBtn")

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
}*/

