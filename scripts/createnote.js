import { createNote } from "./modules/firestore.js";

let audioNote = null

export function submitNote(currentUser) {
    const createNoteForm = document.querySelector('.createnote-form')
    if (createNoteForm) {
        const selectFileTypeButtons = document.querySelectorAll('.file-type-button')
        const addFileTypes = document.querySelectorAll(".createnote-form__addFile")

        let selectedFileType = 0
        selectFileTypeButtons.forEach((e, i) => {
            e.addEventListener('click', () => {
                selectedFileType = i
                selectFileTypeButtons.forEach((e, i) => {
                    if (i == selectedFileType) {
                        e.classList.add("file-type-button--selected")
                        addFileTypes[i].classList.remove("hidden")
                    } else {
                        e.classList.remove("file-type-button--selected")
                        addFileTypes[i].classList.add("hidden")
                    }
                })
            })
        })

        // File input change
        const fileInput = createNoteForm.fileNote
        const fileTitle = document.querySelector(".submit-file-input__title")
        fileInput.addEventListener('change', function () {
            if (fileInput.files.length > 0) {
                //console.log(fileInput.files[0].name)
                fileTitle.innerText = fileInput.files[0].name
            } else {
                fileTitle.innerText = "No se ha subido un archivo"
            }
        })

        createNoteForm.addEventListener('submit', function (event) {
            event.preventDefault()
            const name = createNoteForm.name.value
            const week = createNoteForm.week.value
            const categorie = createNoteForm.category.value
            const subject = createNoteForm.subject.value
            const textNote = createNoteForm.textnote.value
            const fileNote = createNoteForm.fileNote.files[0]
            console.log(name + ", " + week + ", " + categorie + ", " + subject)

            switch (selectedFileType) {
                case 0:
                    if (textNote != "") {
                        createNote(currentUser.id, name, week, categorie, subject, textNote, null)
                    }
                    break;
                case 1:
                    if (audioNote != null) {
                        createNote(currentUser.id, name, week, categorie, subject, null, audioNote)
                    }
                    break;
                case 2:
                    if (fileNote != null) {
                        createNote(currentUser.id, name, week, categorie, subject, null, fileNote)
                    }
                    break;
            }
        })


        // Audio functions
        const recordAudioButton = document.querySelector(".recordAudioBtn")
        const stopAudioButton = document.querySelector(".stopAudioBtn")

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia(
                // constraints - only audio needed for this app
                {
                    audio: true,
                })
                //Success callback
                .then(function (stream) {
                    const mediaRecorder = new MediaRecorder(stream);
                    recordAudioButton.addEventListener("click", () => {
                        mediaRecorder.start()
                        console.log(mediaRecorder.state);
                        recordAudioButton.classList.add("hidden")
                        stopAudioButton.classList.remove("hidden")
                    })

                    let chunks = [];
                    mediaRecorder.ondataavailable = function (e) {
                        chunks.push(e.data);
                    }

                    stopAudioButton.addEventListener('click', () => {
                        mediaRecorder.stop();
                    })

                    mediaRecorder.onstop = function (e) {
                        const blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
                        audioNote = blob
                        console.log(mediaRecorder.state);
                        console.log(audioNote)
                        chunks = [];
                        recordAudioButton.classList.remove("hidden")
                        stopAudioButton.classList.add("hidden")
                        //submitTestFile(blob, "notadeaudioprueba")
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
    }
}   