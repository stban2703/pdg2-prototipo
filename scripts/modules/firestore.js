import { firebase } from "./firebase.js";
import {
    getFirestore, collection, doc, addDoc, setDoc, updateDoc, query, getDoc, getDocs, where, deleteDoc
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";
import { deleteFile, submitFile } from "./storage.js";
import { hideLoader, showLoader } from "../utils/loader.js";
import { getInitialNoteList } from "../notes.js";

const firestore = getFirestore(firebase)
export const firestoreDb = firestore

// Note functions
export async function createNote(uid, name, week, category, subject, textNote, file, fileType, description) {
    const usernoteRef = doc(collection(firestore, "notes"))
    const newNote = {
        id: usernoteRef.id,
        userId: uid,
        name: name,
        week: parseInt(week),
        subject: subject,
        category: category,
        textNote: textNote,
        fileReference: "",
        fileType: fileType,
        descriptionText: description,
        period: "2022-1",
        date: Date.now()
    }

    await setDoc(usernoteRef, newNote).then(() => {
        if (file != null) {
            submitFile(file, usernoteRef.id)
        } else {
            updateFileReference(usernoteRef.id, null)
        }
    }).catch((error) => {
        hideLoader()
        console.log(error)
    });

}

export async function updateFileReference(noteId, fileUrl) {
    const usernoteRef = doc(firestore, "notes", noteId)
    await updateDoc(usernoteRef, {
        fileReference: fileUrl
    }).then(() => {
        hideLoader()
        window.location = "index.html#notes"
    })
}

export async function updateNoteCategory(userId, noteId, currentValue, newValue) {
    if (currentValue != newValue) {
        showLoader()
        const usernoteRef = doc(firestore, "notes", noteId)
        await updateDoc(usernoteRef, {
            category: newValue
        }).then(() => {
            //hideLoader()
            getInitialNoteList(userId)
        })
    }
}

export async function getNotes(uid) {
    const q = query(collection(firestore, "notes"), where("userId", "==", "" + uid))
    const querySnapshot = await getDocs(q);
    const noteList = querySnapshot.docs.map(doc => doc.data());
    hideLoader()
    return noteList
}

export async function getNoteDetails(id) {
    const noteRef = doc(firestore, "notes", id)
    const docSnap = await getDoc(noteRef)
    if (docSnap.exists()) {
        const note = docSnap.data()
        //console.log("Document data:", docSnap.data());
        return note
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        return null
    }
}

export async function deleteNote(userId, noteId, type) {
    await deleteDoc(doc(firestore, "notes", noteId)).then(() => {
        if (type != "text") {
            console.log(noteId)
            deleteFile(userId, noteId)
        } else {
            hideLoader()
            getInitialNoteList(userId)
        }
    }).catch(error => {
        console.log(error)
    });
}

// Meetings functions
export async function createMeeting(name, date, time, duration, mode, place, platform, url, group) {
    const meetingRef = doc(collection(firestore, "meetings"))

    const newMeeting = {
        id: meetingRef.id,
        name: name,
        date: date,
        time: time,
        duration: duration,
        mode: mode,
        place: place,
        platform: platform,
        url: url,
        //status: date < Date.now() ? "finished" : "pending",
        group: group,
        totalParticipants: ["Maria Juliana Ortiz", "Carlos Ramirez", "Wilson Lopez", "Jennifer Velez", "Roberto Martinez"],
        confirmedParticipants: [],
        minutesId: ""
    }
    await setDoc(meetingRef, newMeeting).then(() => {
        hideLoader()
        window.location = "index.html#meetinglist"
    }).catch((error) => {
        console.log(error)
    });
}

export async function getMeetingDetails(id) {
    const meetingRef = doc(firestore, "meetings", id)
    const docSnap = await getDoc(meetingRef)
    if (docSnap.exists()) {
        const meeting = docSnap.data()
        //console.log("Document data:", docSnap.data());
        return meeting
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        return null
    }
}

export async function getMeetings() {
    const q = query(collection(firestore, "meetings"))
    const querySnapshot = await getDocs(q);
    let meetingList = []
    querySnapshot.forEach((doc) => {
        const meeting = doc.data()
        meeting.id = doc.id
        meetingList.push(meeting)
    })
    return meetingList
}

export async function updateMeetingAssistants(id, value) {
    const meetingRef = doc(firestore, "meetings", id);

    await updateDoc(meetingRef, {
        confirmedParticipants: value
    }).then(() => {
        console.log("Meeting updated")
    }).catch(e => {
        console.log(e)
    });
}

export async function updateMeetingMinutesReference(id, meetingMinutesId) {
    const meetingRef = doc(firestore, "meetings", id)
    await updateDoc(meetingRef, {
        minutesId: meetingMinutesId
    }).then(() => {
        console.log("Link de acta actualizado")
        hideLoader()
        window.location = "index.html#meetingminutesdetails?" + meetingMinutesId
    })
}

export async function createMeeingMinutes(summary, assistants, agreements, meetingId) {
    const minutesRef = doc(collection(firestore, "minutes"))
    const newMinutes = {
        id: minutesRef.id,
        summary: summary,
        assistants: assistants,
        agreements: agreements,
        meetingId: meetingId
    }
    await setDoc(minutesRef, newMinutes).then(() => {
        updateMeetingMinutesReference(meetingId, minutesRef.id)
    }).catch((error) => {
        hideLoader()
        console.log(error)
    });
}

export async function getMeetingMinutes(id) {
    const minutesRef = doc(firestore, "minutes", id)
    const docSnap = await getDoc(minutesRef)
    if (docSnap.exists()) {
        const meetingMinutes = docSnap.data()
        //console.log("Document data:", docSnap.data());
        return meetingMinutes
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        return null
    }
}

//Memo functions
export async function getSubjectMemo(subjectId, currentPeriod) {
    const q = query(collection(firestore, `memos/periods/${currentPeriod}/${subjectId}/questions`))
    const querySnapshot = await getDocs(q);
    const memoQuestions = querySnapshot.docs.map(doc => doc.data());
    return memoQuestions
}

export async function getMemoTemplate(targetPath) {
    const q = query(collection(firestore, `memos/template/questions`))
    const querySnapshot = await getDocs(q);
    let templateQuestions = []

    querySnapshot.docs.forEach((doc) => {
        let newQuestion = doc.data()
        newQuestion.id = doc.id
        templateQuestions.push(newQuestion)
    })

    await createNewMemoQuestions(templateQuestions, targetPath).then(() => {
        console.log("Subido")
    }).catch((error) => {
        console.log(error)
    });

}

async function createNewMemoQuestions(templateQuestions, path) {
    await templateQuestions.forEach(async q => {
        await setDoc(doc(firestore, path, "" + q.id), q);
    })
}

export async function getMemoQuestion(currentPeriod, subjectId, id) {
    const questionRef = doc(firestore, `memos/periods/${currentPeriod}/${subjectId}/questions`, id)
    const docSnap = await getDoc(questionRef)
    if (docSnap.exists()) {
        const question = docSnap.data()
        //console.log("Document data:", docSnap.data());
        return question
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        return null
    }
}

export async function createMemoAnswer(currentPeriod, questionId, subjectId, answerValue, currentIndex, justification) {
    const answerRef = doc(collection(firestore, `memos/answers/answers`));
    console.log(answerRef.id)
    const newAnswer = {
        id: answerRef.id,
        answerValue: answerValue,
        period: currentPeriod,
        questionId: questionId,
        subjectId: subjectId,
        justification: justification
    }

    await setDoc(answerRef, newAnswer).then(() => {
        updateQuestionAnswerReference(currentPeriod, questionId, subjectId, answerRef.id, currentIndex)
    }).catch((error) => {
        hideLoader()
        console.log(error)
    });
}

async function updateQuestionAnswerReference(currentPeriod, questionId, subjectId, answerId, currentIndex) {
    const questionRef = doc(firestore, `memos/periods/${currentPeriod}/${subjectId}/questions`, questionId)
    await updateDoc(questionRef, {
        answerId: answerId
    }).then(() => {
        //hideLoader()
        console.log("Referencia actualizada")
        if (currentIndex !== 12) {
            getNextMemmoQuestion(currentPeriod, subjectId, currentIndex)
        }
    })
}

export async function updateAnswerValue(answerId, answerValue, currentPeriod, subjectId, currentIndex, justification) {
    const answerRef = doc(firestore, "memos/answers/answers", answerId)
    await updateDoc(answerRef, {
        answerValue: answerValue,
        justification: justification
    }).then(() => {
        //hideLoader()
        console.log("Respuesta actualizada")
        if (currentIndex !== 12) {
            getNextMemmoQuestion(currentPeriod, subjectId, currentIndex)
        }
    })
}

export async function getNextMemmoQuestion(currentPeriod, subjectId, currentIndex) {
    if (currentIndex + 1 == 13 || currentIndex == 12) {
        hideLoader()
        window.location = `index.html#memosections?${subjectId}`
    } else {
        const q = query(collection(firestore, `memos/periods/${currentPeriod}/${subjectId}/questions`), where("index", "==", "" + (currentIndex + 1)))
        const querySnapshot = await getDocs(q);
        const nextQuestion = querySnapshot.docs.map(doc => doc.data())[0];
        hideLoader()
        if (currentIndex == 3) {
            window.location = `index.html#memoquestion?${currentPeriod}_${subjectId}_${nextQuestion.id}_info`
        } else window.location = `index.html#memoquestion?${currentPeriod}_${subjectId}_${nextQuestion.id}`
    }
}

export async function getPreviousMemoQuestion(currentPeriod, subjectId, currentIndex) {
    if (currentIndex > 1) {
        if (currentIndex === 10) {
            const q8 = query(collection(firestore, `memos/answers/answers`), where("questionId", "==", `jvLjdfeVkm6JnQMgrO6C`), where("subjectId", "==", subjectId))
            const querySnapshot = await getDocs(q8);
            const q8Answer = querySnapshot.docs.map(doc => doc.data())[0];
            const q8AnswerValue = q8Answer.answerValue[0]

            if (q8AnswerValue === "No") {
                const q = query(collection(firestore, `memos/periods/${currentPeriod}/${subjectId}/questions`), where("index", "==", "" + (currentIndex - 2)))
                const querySnapshot = await getDocs(q);
                const previosQuestion = querySnapshot.docs.map(doc => doc.data())[0];
                hideLoader()
                window.location = `index.html#memoquestion?${currentPeriod}_${subjectId}_${previosQuestion.id}`

            } else {
                const q = query(collection(firestore, `memos/periods/${currentPeriod}/${subjectId}/questions`), where("index", "==", "" + (currentIndex - 1)))
                const querySnapshot = await getDocs(q);
                const previosQuestion = querySnapshot.docs.map(doc => doc.data())[0];
                hideLoader()
                window.location = `index.html#memoquestion?${currentPeriod}_${subjectId}_${previosQuestion.id}`
            }

        } else {
            const q = query(collection(firestore, `memos/periods/${currentPeriod}/${subjectId}/questions`), where("index", "==", "" + (currentIndex - 1)))
            const querySnapshot = await getDocs(q);
            const previosQuestion = querySnapshot.docs.map(doc => doc.data())[0];
            hideLoader()
            window.location = `index.html#memoquestion?${currentPeriod}_${subjectId}_${previosQuestion.id}`
        }

    } else if (currentIndex === 1) {
        hideLoader()
        window.location = `index.html#memosections?${subjectId}`
    }
}

export async function getOptionsFromAnswers(targetQuestionId, subjectId, period) {
    const q = query(collection(firestore, `memos/answers/answers`), where("questionId", "==", `${targetQuestionId}`), where("subjectId", "==", subjectId))
    const querySnapshot = await getDocs(q);
    const answerList = querySnapshot.docs.map(doc => doc.data());
    const currentPeriodAnswer = answerList.filter((e) => {
        return e.period === period
    })
    const options = currentPeriodAnswer[0].answerValue
    return options
}

export async function getJustificationAnswers(targetQuestionId, subjectId, period) {
    const q = query(collection(firestore, `memos/answers/answers`), where("questionId", "==", `${targetQuestionId}`), where("subjectId", "==", subjectId))
    const querySnapshot = await getDocs(q);
    const answerList = querySnapshot.docs.map(doc => doc.data());
    const currentPeriodAnswer = answerList.filter((e) => {
        return e.period === period
    })
    const justification = currentPeriodAnswer[0].justification
    return justification
}


// Improve actions functions
export async function getImproveActions(questionId, subjectId, period) {
    const q = query(collection(firestore, `memos/answers/answers`), where("questionId", "==", `${questionId}`), where("subjectId", "==", subjectId))
    const querySnapshot = await getDocs(q);
    const answer = querySnapshot.docs.map(doc => doc.data());
    const filteredActionList = answer.filter((e) => {
        return e.period === period
    })
    return filteredActionList[0].answerValue
}

// User functions
export const createUser = async function (uid, name, lastname, email, role) {
    const userRef = doc(firestore, 'users', uid);
    const newUser = {
        id: uid,
        name: name,
        lastname: lastname,
        email: email,
        role: role
    }
    await setDoc(userRef, newUser).then(() => {
        localStorage.setItem('currentuser', JSON.stringify(newUser))
        hideLoader()
        window.location = 'index.html'
    }).catch((error) => {
        hideLoader()
        console.log(error)
    });
}

export const getUserFromDb = async function (uid) {
    const userRef = doc(firestore, "users", uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
        const user = docSnap.data()
        localStorage.setItem('currentuser', JSON.stringify(user))
        //hideLoader()
        //window.location = 'index.html'
        console.log("Document data: " + user.name + ", " + user.role);
    } else {
        console.log("No existe este usuario");
    }
}

export async function getUserSubjects(teacherId) {
    const q = query(collection(firestore, "subjects"), where("teacherId", "==", "" + teacherId))
    const querySnapshot = await getDocs(q);
    const subjectList = querySnapshot.docs.map(doc => doc.data());
    localStorage.setItem('subjectList', JSON.stringify(subjectList))
    hideLoader()
    window.location = 'index.html'
    //return subjectList
}

// Test functions
export const submitTestMemoQuestion = async function (questionObject) {
    const memoquestionRef = doc(collection(firestore, "memos/template/questions"))
    //index, section, sectionIndex, subsection, subsectionIndex, type, justification, options
    let newQuestion
    switch (questionObject.type) {
        case "scale":
            newQuestion = {
                index: questionObject.index,
                section: questionObject.section,
                sectionIndex: questionObject.sectionIndex,
                subsection: questionObject.subsection,
                subsectionIndex: questionObject.subsectionIndex,
                question: questionObject.question,
                type: questionObject.type,
                scalemin: questionObject.scalemin,
                scalemax: questionObject.scalemax,
                scalemintag: questionObject.scalemintag,
                scalemaxtag: questionObject.scalemaxtag,
                justification: questionObject.justification.length > 0 ? questionObject.justification : null
            }
            break;
        case "matrix":
            newQuestion = {
                index: questionObject.index,
                section: questionObject.section,
                sectionIndex: questionObject.sectionIndex,
                subsection: questionObject.subsection,
                subsectionIndex: questionObject.subsectionIndex,
                question: questionObject.question,
                type: questionObject.type,
                matrixrows: questionObject.matrixrows,
                matrixcolumnmin: questionObject.matrixcolumnmin,
                matrixcolumnmax: questionObject.matrixcolumnmax,
                matrixcolumnmintag: questionObject.matrixcolumnmintag,
                matrixcolumnmaxtag: questionObject.matrixcolumnmaxtag,
                justification: questionObject.justification.length > 0 ? questionObject.justification : null
            }
            break;
        case "parragraph":
            newQuestion = {
                index: questionObject.index,
                section: questionObject.section,
                sectionIndex: questionObject.sectionIndex,
                subsection: questionObject.subsection,
                subsectionIndex: questionObject.subsectionIndex,
                question: questionObject.question,
                type: questionObject.type,
                justification: questionObject.justification.length > 0 ? questionObject.justification : null
            }
            break;

        case "improveactions":
            newQuestion = {
                index: questionObject.index,
                section: questionObject.section,
                sectionIndex: questionObject.sectionIndex,
                subsection: questionObject.subsection,
                subsectionIndex: questionObject.subsectionIndex,
                question: questionObject.question,
                type: questionObject.type,
                justification: questionObject.justification.length > 0 ? questionObject.justification : null
            }
            break

        default:
            newQuestion = {
                index: questionObject.index,
                section: questionObject.section,
                sectionIndex: questionObject.sectionIndex,
                subsection: questionObject.subsection,
                subsectionIndex: questionObject.subsectionIndex,
                question: questionObject.question,
                type: questionObject.type,
                options: questionObject.options,
                justification: questionObject.justification.length > 0 ? questionObject.justification : null
            }
            break
    }

    await setDoc(memoquestionRef, newQuestion).then(() => {
        hideLoader()
        console.log("Exito")
    }).catch((error) => {
        hideLoader()
        console.log(error)
    });
}