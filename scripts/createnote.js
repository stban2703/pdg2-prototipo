import { userInfo, userSubjects } from "./main.js";
import { createNote } from "./modules/firestore.js";
import { showLoader } from "./utils/loader.js";

let audioNote = null
let audioURL = null

export function submitNote(currentUser) {
    const createNoteForm = document.querySelector('.createnote-form')
    if (createNoteForm) {

        const subjectSelect = createNoteForm.subject
        const createNoteFormSubmitButton = createNoteForm.querySelector(".createnote-form__submitBtn")

        userSubjects.forEach(e => {
            const subjectOption = document.createElement('option')
            subjectOption.value = e.name
            subjectOption.innerHTML = e.name
            subjectSelect.appendChild(subjectOption)
        })

        const selectFileTypeButtons = document.querySelectorAll('.file-type-button')
        const addFileTypes = document.querySelectorAll(".createnote-form__addFile")
        const descrptionTextSection = document.querySelector(".description-text")

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
                if (selectedFileType == 2) {
                    descrptionTextSection.classList.remove("hidden")
                } else {
                    descrptionTextSection.classList.add("hidden")
                }
            })
        })

        // File input change
        const fileInput = createNoteForm.fileNote
        const fileLabel = document.querySelector(".submit-file-input__label")
        const seudoInputBtn = document.querySelector(".seudoInputButton")
        const fileInputEmptyIcon = document.querySelector(".submit-file-input__icon--empty")
        const fileInputLoadedIcon = document.querySelector(".submit-file-input__icon--loaded")

        seudoInputBtn.addEventListener('click', () => {
            fileInput.click()
        })

        fileInput.addEventListener('change', function () {
            if (fileInput.files.length > 0) {
                //console.log(fileInput.files[0].name)
                fileLabel.innerText = fileInput.files[0].name
                fileLabel.classList.add("submit-file-input__label--loaded")
                fileInputEmptyIcon.classList.add("hidden")
                fileInputLoadedIcon.classList.remove("hidden")
            } else {
                fileLabel.innerText = "Arrastra y suelta el archivo"
                fileLabel.classList.remove("submit-file-input__label--loaded")
                fileInputEmptyIcon.classList.remove("hidden")
                fileInputLoadedIcon.classList.add("hidden")
            }
        })


        // Recorder audio functions
        const recordAudioButton = document.querySelector(".recordAudioBtn")
        const stopAudioButton = document.querySelector(".stopAudioBtn")
        const listenAudioButton = document.querySelector(".listen-audio-button")
        const loadingRecordAudioBtn = document.querySelector(".loadingRecordAudioBtn")
        const recordAudioAgainButton = document.querySelector(".record-audio-again-button")
        const recordAudioLoadingNumber = document.querySelector(".record-audio-button__number")
        const audioTimer = document.querySelector(".createnote-form__timer")
        const audioPlayerContainer = document.querySelector(".audio-player-container")

        /*playAudio.addEventListener('click', () => {
            audioPlayer.play()
        })*/

        let mediaRecorder = null

        listenAudioButton.addEventListener('click', () => {
            recordAudioButton.classList.add('hidden')                
            audioTimer.classList.add('hidden')
            audioPlayerContainer.classList.remove("hidden")
            listenAudioButton.classList.add('hidden')
            recordAudioAgainButton.classList.remove('hidden')
        })

        recordAudioAgainButton.addEventListener('click', () => {
            recordAudioButton.classList.remove('hidden')
            recordAudioAgainButton.classList.add('hidden')
            recordAudioButton.click()
        })

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
            let timeInterval

            if (mediaRecorder) {
                let counter = 3
                audioPlayerContainer.innerHTML = ``
                audioPlayerContainer.classList.add("hidden")
                createNoteFormSubmitButton.classList.add('hidden')
                recordAudioButton.classList.add("hidden")
                loadingRecordAudioBtn.classList.remove("hidden")
                listenAudioButton.classList.add("hidden")
                audioTimer.innerHTML = '00:00'
                audioTimer.classList.add("hidden")

                let chunks = [];

                let countdownInterval = setInterval(() => {
                    counter--
                    recordAudioLoadingNumber.innerText = counter
                    if (counter < 1) {
                        console.log(counter)
                        clearInterval(countdownInterval)
                    }
                }, 1000)

                let newTimeOut = setTimeout(() => {
                    mediaRecorder.start()
                    console.log(mediaRecorder.state);
                    recordAudioButton.classList.add("hidden")
                    loadingRecordAudioBtn.classList.add("hidden")
                    stopAudioButton.classList.remove("hidden")
                    audioTimer.classList.remove("hidden")

                    let timerSeconds = 0
                    let timerMinutes = 0;

                    timeInterval = setInterval(() => {
                        timerSeconds++

                        if (timerSeconds > 59) {
                            timerMinutes++
                            timerSeconds = 0;
                        }

                        let timerDisplay = `${timerMinutes < 10 ? '0' + timerMinutes : timerMinutes}:${timerSeconds < 10 ? '0' + timerSeconds : timerSeconds}`
                        audioTimer.innerHTML = timerDisplay

                    }, 1000)

                    mediaRecorder.ondataavailable = function (e) {
                        chunks.push(e.data);
                    }
                }, 3000)

                mediaRecorder.onstop = function (e) {
                    const blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
                    audioNote = blob
                    audioURL = window.URL.createObjectURL(audioNote);

                    const audioPlayer = document.createElement('audio')
                    audioPlayer.classList.add('audio-player')
                    audioPlayer.src = audioURL
                    audioPlayer.controls = true
                    audioPlayer.preload = "auto"
                    audioPlayerContainer.appendChild(audioPlayer)
                    createNoteFormSubmitButton.classList.remove('hidden')
    
                    console.log(mediaRecorder.state);
                    console.log(audioNote)

                    counter = 3
                    recordAudioLoadingNumber.innerText = counter
                    chunks = [];
                    clearInterval(timeInterval)
                    recordAudioButton.querySelector(".record-icon-img").src = "./images/repeataudioicon.svg"
                    recordAudioButton.classList.remove("hidden")
                    stopAudioButton.classList.add("hidden")
                    listenAudioButton.classList.remove("hidden")
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
            const descriptionText = createNoteForm.descriptionText.value

            if (mediaRecorder) {
                if (mediaRecorder.state == "recording") {
                    console.log("Debes detener la grabación")
                } else {
                    stopRecorder()
                    setNoteAndCreate(selectedFileType, currentUser.id, name, week, categorie, subject, textNote, fileNote, audioNote, descriptionText)
                }
            } else {
                setNoteAndCreate(selectedFileType, currentUser.id, name, week, categorie, subject, textNote, fileNote, audioNote, descriptionText)
            }
        })
    }
}

function setNoteAndCreate(selectedFileType, userId, name, week, categorie, subject, textNote, fileNote, audioNote, description) {
    switch (selectedFileType) {
        case 0:
            if (textNote != "") {
                showLoader()
                createNote(userId, name, week, categorie, subject, textNote, null, "text", "")
            }
            break;
        case 1:
            if (audioNote != null) {
                showLoader()
                createNote(userId, name, week, categorie, subject, null, audioNote, "audio", "")
            }
            break;
        case 2:
            if (fileNote != null) {
                if (fileNote.type.includes("video")) {
                    showLoader()
                    createNote(userId, name, week, categorie, subject, null, fileNote, "video", description)
                } else {
                    showLoader()
                    createNote(userId, name, week, categorie, subject, null, fileNote, "image", description)
                }
            }
            break;
    }
}