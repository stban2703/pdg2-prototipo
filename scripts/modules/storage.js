import { firebase } from "./firebase.js";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-storage.js";
import { updateFileReference } from "./firestore.js";
import { hideLoader } from "../utils/loader.js";
import { getInitialNoteList } from "../notes.js";

const storage = getStorage()

export function submitFile(file, id) {
    const noteRef = ref(storage, id);
    uploadBytes(noteRef, file).then((snapshot) => {
        console.log('Nota creada');
        getDownloadURL(noteRef).then((url) => {
            updateFileReference(id, url)
        })
    }).catch(error => {
        hideLoader()
        console.log(error)
    });
}

export function deleteFile(userId, fileId) {
    const fileRef = ref(storage, fileId);
    deleteObject(fileRef).then(() => {
        hideLoader()
        getInitialNoteList(userId)
    }).catch(error => {
        hideLoader()
        console.log(error)
    });
}