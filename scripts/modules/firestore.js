import { firebase } from "./firebase.js";
import {
    getFirestore,
    collection,
    doc,
    addDoc,
    setDoc,
    query,
    getDoc,
    getDocs,
    where
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";

const firestore = getFirestore(firebase)

export const createUser = async function (uid, name, email, role) {
    try {
        const userRef = doc(firestore, 'users', uid);
        await setDoc(userRef, {
            id: uid,
            name: name,
            email: email,
            role: role
        }).then().catch((error) => {
            console.log(error)
        });
    } catch (e) {
        console.log(e)
    }
}

export const getUserFromDb = async function (uid) {
    const userRef = doc(firestore, "users", uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
        const user = docSnap.data()
        console.log("Document data: " + user.name + ", " + user.role);
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }

    /*const q = query(collection(firebase, "users"))
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        
        //console.log(doc.id, " => ", doc.data());
    });*/
    //console.log(userList.length)
}