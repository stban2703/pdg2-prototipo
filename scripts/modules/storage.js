import { firebase } from "./firebase.js";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-storage.js";
import { updateFileReference } from "./firestore.js";
import { hideLoader } from "../utils/loader.js";
import { getInitialNoteList } from "../notes.js";
import { userInfo } from "../main.js";

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

export function deleteFile(id) {
    const fileRef = ref(storage, id);
    deleteObject(fileRef).then(() => {
        hideLoader()
        getInitialNoteList(userInfo.id)
    }).catch(error => {
        hideLoader()
        console.log(error)
    });
}