import { createNote } from "./modules/firestore.js";

let audioNote = null
let audioURL = null

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


        // Recorder audio functions
        const recordAudioButton = document.querySelector(".recordAudioBtn")
        const stopAudioButton = document.querySelector(".stopAudioBtn")
        const playAudioBtn = document.querySelector(".audio-pre-button")
        const audioPlayer = document.querySelector(".audio-player");
        playAudioBtn.addEventListener('click', () => {
            audioPlayer.play()
        })

        let mediaRecorder = null

        selectFileTypeButtons[1].addEventListener('click', () => {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia(
                    // constraints - only audio needed for this app
                    {
                        audio: true,
                    })
                    //Success callback
                    .then(function (stream) {
                        if (!mediaRecorder) {
                            mediaRecorder = new MediaRecorder(stream);
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
        })

        recordAudioButton.addEventListener("click", () => {
            if (mediaRecorder) {
                mediaRecorder.start()
                console.log(mediaRecorder.state);
                recordAudioButton.classList.add("hidden")
                stopAudioButton.classList.remove("hidden")
                let chunks = [];
                mediaRecorder.ondataavailable = function (e) {
                    chunks.push(e.data);
                }

                mediaRecorder.onstop = function (e) {
                    const blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
                    audioNote = blob
                    audioURL = window.URL.createObjectURL(audioNote);
                    audioPlayer.src = audioURL
                    playAudioBtn.classList.remove("hidden")

                    console.log(mediaRecorder.state);
                    console.log(audioNote)

                    chunks = [];
                    recordAudioButton.classList.remove("hidden")
                    stopAudioButton.classList.add("hidden")
                }
            }
        })

        stopAudioButton.addEventListener('click', () => {
            if (mediaRecorder) {
                mediaRecorder.stop();
            }
        })

        selectFileTypeButtons[0].addEventListener('click', () => {
            stopRecorder()
        })

        selectFileTypeButtons[2].addEventListener('click', () => {
            stopRecorder()
        })

        // Detener recorder si se cambia de pantalla
        window.addEventListener("hashchange", function () {
            stopRecorder()
        }, false)

        function stopRecorder() {
            if (mediaRecorder) {
                mediaRecorder.stream.getAudioTracks().forEach(function (track) { track.stop(); });
            }
            mediaRecorder = null
        }

        // Create a note
        createNoteForm.addEventListener('submit', function (event) {
            event.preventDefault()
            const name = createNoteForm.name.value
            const week = createNoteForm.week.value
            const categorie = createNoteForm.category.value
            const subject = createNoteForm.subject.value
            const textNote = createNoteForm.textnote.value
            const fileNote = createNoteForm.fileNote.files[0]
            if (mediaRecorder) {
                if (mediaRecorder.state == "recording") {
                    console.log("Debes detener la grabación")
                } else {
                    stopRecorder()
                    switch (selectedFileType) {
                        case 0:
                            if (textNote != "") {
                                createNote(currentUser.id, name, week, categorie, subject, textNote, null, "text")
                            }
                            break;
                        case 1:
                            if (audioNote != null) {
                                createNote(currentUser.id, name, week, categorie, subject, null, audioNote, "audio")
                            }
                            break;
                        case 2:
                            if (fileNote != null) {
                                if (fileNote.type.includes("video")) {
                                    createNote(currentUser.id, name, week, categorie, subject, null, fileNote, "video")
                                } else {
                                    createNote(currentUser.id, name, week, categorie, subject, null, fileNote, "image")
                                }
                            }
                            break;
                    }
                }
            } else {
                switch (selectedFileType) {
                    case 0:
                        if (textNote != "") {
                            createNote(currentUser.id, name, week, categorie, subject, textNote, null, "text")
                        }
                        break;
                    case 1:
                        if (audioNote != null) {
                            createNote(currentUser.id, name, week, categorie, subject, null, audioNote, "audio")
                        }
                        break;
                    case 2:
                        if (fileNote != null) {
                            if (fileNote.type.includes("video")) {
                                createNote(currentUser.id, name, week, categorie, subject, null, fileNote, "video")
                            } else {
                                createNote(currentUser.id, name, week, categorie, subject, null, fileNote, "image")
                            }
                        }
                        break;
                }
            }
        })
    }
}