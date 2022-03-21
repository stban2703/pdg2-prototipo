import { firebase } from "./firebase.js";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-storage.js";
import { updateFileReference } from "./firestore.js";
import { hideLoader } from "../utils/loader.js";

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
        // File deleted successfully
        alert("Nota eliminada")
    }).catch(error => {
        console.log(error)
    });
}