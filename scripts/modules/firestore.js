import { firebase } from "./firebase.js";
import {
    getFirestore, collection, doc, addDoc, setDoc, updateDoc, query, getDoc, getDocs, where, deleteDoc, onSnapshot
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";
import { deleteFile, submitFile } from "./storage.js";
import { hideLoader, showLoader } from "../utils/loader.js";
import { getInitialNoteList } from "../notes.js";
import { submitUserAccomplishment } from "../accomplishment.js";
import { setLocalStorage } from "../utils/ls.js";

const firestore = getFirestore(firebase)
export const firestoreDb = firestore

// Get current period
export async function getCurrentPeriod() {
    const periodRef = doc(firestore, "memos", "template")
    const docSnap = await getDoc(periodRef)
    if (docSnap.exists()) {
        const period = docSnap.data()
        setLocalStorage('currentPeriod', JSON.stringify(period.period))
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}

// Notifications
export async function createNotification(userId, date, time, group, type, meetingId) {
    const notificationRef = doc(collection(firestore, `users/${userId}/notifications`))
    const newNotification = {
        id: notificationRef.id,
        type: type,
        group: group,
        date: date,
        time: time,
        status: 'unread'
    }

    if (type === "meeting") {
        newNotification.meetingId = meetingId
    }

    await setDoc(notificationRef, newNotification).then(() => {

    }).catch((error) => {
        console.log(error)
    });

}

export async function sendNotifications(teacherList, date, time, group, type, meetingId) {
    for (let index = 0; index < teacherList.length; index++) {
        const teacher = teacherList[index];
        if (teacher.id) {
            await createNotification(teacher.id, date, time, group, type, meetingId)
        }
    }
    hideLoader()
    window.location = "index.html#meetinglist"
}

export async function updateNotificationStatus(userId, notificationID, status) {
    const userNotificationRef = doc(firestore, `users/${userId}/notifications`, notificationID)
    await updateDoc(userNotificationRef, {
        status: status
    }).then(() => {

    })
}

// General function
export async function getDepartmentInfo(departmentId) {
    const departmentRef = doc(firestore, "departments", departmentId)
    const docSnap = await getDoc(departmentRef)
    if (docSnap.exists()) {
        const department = docSnap.data()
        //console.log("Document data:", docSnap.data());
        return department
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        return null
    }
}

export async function getDepartments() {
    const q = query(collection(firestore, "departments"))
    const querySnapshot = await getDocs(q);
    const departmentList = querySnapshot.docs.map(doc => doc.data());
    return departmentList
}

export async function getDepartmentCareers(departmentId) {
    const q = query(collection(firestore, "careers"), where("departmentId", "==", "" + departmentId))
    const querySnapshot = await getDocs(q);
    const careerList = querySnapshot.docs.map(doc => doc.data());
    hideLoader()
    return careerList
}

export async function getCareerInfo(careerId) {
    const careerRef = doc(firestore, "careers", careerId)
    const docSnap = await getDoc(careerRef)
    if (docSnap.exists()) {
        const career = docSnap.data()
        //console.log("Document data:", docSnap.data());
        return career
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        return null
    }
}

export async function getCareerSubjects(careerId) {
    const q = query(collection(firestore, "subjects"), where("careerId", "==", "" + careerId))
    const querySnapshot = await getDocs(q);
    const careerList = querySnapshot.docs.map(doc => doc.data());
    hideLoader()
    return careerList
}

export async function getGroupSubjects(groupId) {
    const q = query(collection(firestore, "subjects"), where("groupId", "==", "" + groupId))
    const querySnapshot = await getDocs(q);
    const subjectList = querySnapshot.docs.map(doc => doc.data());
    hideLoader()
    return subjectList
}

export async function getGroups() {
    const q = query(collection(firestore, "groups"))
    const querySnapshot = await getDocs(q);
    const groups = querySnapshot.docs.map(doc => doc.data());
    return groups
}

export async function getCareerByGroup(groupName) {
    const q = query(collection(firestore, "careers"), where("groups", "array-contains", groupName))
    const querySnapshot = await getDocs(q);
    const career = querySnapshot.docs.map(doc => doc.data());
    return career[0]
}

export async function getSubjectsByView(viewKey, viewId) {
    const q = query(collection(firestore, "subjects"), where(viewKey, "==", "" + viewId))
    const querySnapshot = await getDocs(q);
    const subjectList = querySnapshot.docs.map(doc => doc.data());
    return subjectList
}

export async function getSubjectsByDepartmentId(departmentId) {
    const q = query(collection(firestore, "subjects"), where("departmentId", "==", "" + departmentId))
    const querySnapshot = await getDocs(q);
    const subjectList = querySnapshot.docs.map(doc => doc.data());
    return subjectList
}

export async function getSubcjectInfo(subjectId) {
    const subjectRef = doc(firestore, "subjects", subjectId)
    const docSnap = await getDoc(subjectRef)
    if (docSnap.exists()) {
        const subject = docSnap.data()
        //console.log("Document data:", docSnap.data());
        return subject
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        return null
    }
}

// Sin usar
export async function getTeachersByGroupName(groupName) {
    const q = query(collection(firestore, "users"), where("groups", "array-contains", "" + groupName))
    const querySnapshot = await getDocs(q);
    const teachersList = querySnapshot.docs.map(doc => doc.data());
    return teachersList
}

// Improve actions
export async function createImproveActionComment(subjectId, period, userInfo, comment) {
    const commentRef = doc(collection(firestore, "improveactionscomments"))
    const newComment = {
        id: commentRef.id,
        principalId: userInfo.id,
        principalName: userInfo.name + " " + userInfo.lastname,
        subjectId: subjectId,
        period: period,
        comment: comment,
        date: Date.now()
    }

    await setDoc(commentRef, newComment).then(() => {
        hideLoader()
        window.location.reload()
    }).catch((error) => {
        hideLoader()
        console.log(error)
    });
}

export async function getImproveActionComment(subjectId, currentPeriod) {
    const q = query(collection(firestore, "improveactionscomments"), where("subjectId", "==", "" + subjectId), where("period", "==", currentPeriod))
    const querySnapshot = await getDocs(q);
    const commentsLiST = querySnapshot.docs.map(doc => doc.data());
    hideLoader()
    return commentsLiST
}

export async function getAllAnswersByQuestion(questionIndex) {
    const q = query(collection(firestore, "memos/answers/answers"), where("questionIndex", "==", questionIndex))
    const querySnapshot = await getDocs(q);
    const answerList = querySnapshot.docs.map(doc => doc.data());
    return answerList
}

export async function getAllAnswersByViewTypeAndPeriod(viewKey, viewId, currentPeriod) {
    const q = query(collection(firestore, "memos/answers/answers"), where(`${viewKey}Id`, "==", "" + viewId), where("period", "==", "" + currentPeriod))
    const querySnapshot = await getDocs(q);
    const answerList = querySnapshot.docs.map(doc => doc.data());
    return answerList
}

export async function getAllAnswersByViewTypeAndQuestion(viewKey, viewId, questionIndex) {
    const q = query(collection(firestore, "memos/answers/answers"), where(`${viewKey}Id`, "==", "" + viewId), where("questionIndex", "==", questionIndex))
    const querySnapshot = await getDocs(q);
    const answerList = querySnapshot.docs.map(doc => doc.data());
    return answerList
}

// Accomplishment functions
export async function getGroupInfo(groupId) {
    const groupsRef = doc(firestore, "groups", groupId)
    const docSnap = await getDoc(groupsRef)
    if (docSnap.exists()) {
        const group = docSnap.data()
        //console.log("Document data:", docSnap.data());
        return group
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        return null
    }
}

export async function getTeacherById(id) {
    const teacherId = doc(firestore, "users", id)
    const docSnap = await getDoc(teacherId)
    if (docSnap.exists()) {
        const teacher = docSnap.data()
        //console.log("Document data:", docSnap.data());
        return teacher
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        return null
    }
}

export async function updateTeacherAccomplishment(teacherId, percent) {
    const teacherRef = doc(firestore, "users", teacherId)
    await updateDoc(teacherRef, {
        accomplishment: percent
    }).then(() => {
        hideLoader()
    })
}

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
export async function createMeeting(name, date, time, duration, mode, place, platform, url, group, careerInfo, departmentInfo, teacherList) {
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
        totalParticipants: teacherList,
        confirmedParticipants: [],
        minutesId: "",
        career: careerInfo.name,
        department: departmentInfo.name
    }
    await setDoc(meetingRef, newMeeting).then(() => {
        //hideLoader()
        //window.location = "index.html#meetinglist"
        sendNotifications(teacherList, date, time, group, "meeting", meetingRef.id)
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
        //window.location.reload()
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

export async function createMemoAnswer(currentPeriod, questionId, subjectInfo, answerValue, currentIndex, justification) {
    const answerRef = doc(collection(firestore, `memos/answers/answers`));
    const newAnswer = {
        id: answerRef.id,
        answerValue: answerValue,
        period: currentPeriod,
        questionId: questionId,
        subjectId: subjectInfo.id,
        justification: justification,
        questionIndex: currentIndex,
        departmentId: subjectInfo.departmentId,
        careerId: subjectInfo.careerId,
        groupId: subjectInfo.groupId
    }

    await setDoc(answerRef, newAnswer).then(() => {
        updateQuestionAnswerReference(currentPeriod, questionId, subjectInfo, answerRef.id, currentIndex, answerValue)
    }).catch((error) => {
        hideLoader()
        console.log(error)
    });
}

async function updateQuestionAnswerReference(currentPeriod, questionId, subjectInfo, answerId, currentIndex, answerValue) {
    const questionRef = doc(firestore, `memos/periods/${currentPeriod}/${subjectInfo.id}/questions`, questionId)
    await updateDoc(questionRef, {
        answerId: answerId
    }).then(() => {
        //hideLoader()
        console.log("Referencia actualizada")
        let ls = window.localStorage;
        let localSubjects = JSON.parse(ls.getItem('subjectList'))
        submitUserAccomplishment(localSubjects, currentPeriod)

        if (currentIndex === 8 && answerValue[0] === "No") {
            getNextMemmoQuestion(currentPeriod, subjectInfo, currentIndex, answerValue)
        } else if (currentIndex !== 12) {
            if (currentIndex === 11 && answerValue[0] === "Sí") {
                getNextMemmoQuestion(currentPeriod, subjectInfo, currentIndex, answerValue)
            } else if (currentIndex === 11 && answerValue[0] === "No") {
                getNextMemmoQuestion(currentPeriod, subjectInfo, currentIndex, answerValue)
            } else {
                getNextMemmoQuestion(currentPeriod, subjectInfo, currentIndex, answerValue)

            }
        }
    })
}

export async function updateAnswerValue(answerId, answerValue, currentPeriod, subjectInfo, currentIndex, justification) {
    const answerRef = doc(firestore, "memos/answers/answers", answerId)
    await updateDoc(answerRef, {
        answerValue: answerValue,
        justification: justification
    }).then(() => {
        //hideLoader()
        let ls = window.localStorage;
        let localSubjects = JSON.parse(ls.getItem('subjectList'))
        submitUserAccomplishment(localSubjects, currentPeriod)

        console.log("Respuesta actualizada")
        if (currentIndex === 8 && answerValue[0] === "No") {
            getNextMemmoQuestion(currentPeriod, subjectInfo, currentIndex, answerValue)
        } else if (currentIndex !== 12) {
            if (currentIndex === 11 && answerValue[0] === "Sí") {
                getNextMemmoQuestion(currentPeriod, subjectInfo, currentIndex, answerValue)
            } else if (currentIndex === 11 && answerValue[0] === "No") {
                getNextMemmoQuestion(currentPeriod, subjectInfo, currentIndex, answerValue)
            } else {
                getNextMemmoQuestion(currentPeriod, subjectInfo, currentIndex, answerValue)

            }
        }
    })
}

export async function getNextMemmoQuestion(currentPeriod, subjectInfo, currentIndex, answerValue) {
    const q = query(collection(firestore, `memos/periods/${currentPeriod}/${subjectInfo.id}/questions`), where("index", "==", "" + (currentIndex + 1)))

    const querySnapshot = await getDocs(q);
    const nextQuestion = querySnapshot.docs.map(doc => doc.data())[0];
    //console.log(nextQuestion)

    hideLoader()
    if (currentIndex == 3) {
        window.location = `index.html#memoquestion?${currentPeriod}_${subjectInfo.id}_${nextQuestion.id}_info`
    } else if (currentIndex === 8 && answerValue[0] === "No") {
        if (nextQuestion.answerId && nextQuestion.answerId.length > 0) {
            updateAnswerValue(nextQuestion.answerId, [""], currentPeriod, subjectInfo, currentIndex + 1, null)
        } else {
            createMemoAnswer(currentPeriod, "WEI1TIuPkuZH8mRdzq9Y", subjectInfo, [""], currentIndex + 1, null)
        }
    } else if (currentIndex === 11 && answerValue[0] === "No") {
        if (nextQuestion.answerId && nextQuestion.answerId.length > 0) {
            updateAnswerValue(nextQuestion.answerId, [""], currentPeriod, subjectInfo, currentIndex + 1, null)
        } else {
            createMemoAnswer(currentPeriod, "fBxBrSNyWs9xKqG3B6kQ", subjectInfo, [""], currentIndex + 1, null)
        }
    } else {
        window.location = `index.html#memoquestion?${currentPeriod}_${subjectInfo.id}_${nextQuestion.id}`
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
    if (answerList.length > 0) {
        const options = currentPeriodAnswer[0].answerValue
        return options
    } else {
        return []
    }
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

export async function getAllAnswersByQuestionAndSubject(questionIndex, subjectId) {
    const q = query(collection(firestore, `memos/answers/answers`), where("questionIndex", "==", questionIndex), where("subjectId", "==", subjectId))
    const querySnapshot = await getDocs(q);
    const answerList = querySnapshot.docs.map(doc => doc.data());
    return answerList
}

export async function getAllAnswersBySubjectAndPeriod(subjectId, period) {
    const q = query(collection(firestore, `memos/answers/answers`), where("subjectId", "==", subjectId), where("period", "==", period))
    const querySnapshot = await getDocs(q);
    const answerList = querySnapshot.docs.map(doc => doc.data());
    return answerList
}

export async function getAllAnswersByQuestionAndPeriod(questionIndex, period) {
    const q = query(collection(firestore, `memos/answers/answers`), where("questionIndex", "==", questionIndex), where("period", "==", period))
    const querySnapshot = await getDocs(q);
    const answerList = querySnapshot.docs.map(doc => doc.data());
    return answerList
}

export async function getAllAnswersByPeriod(period) {
    const q = query(collection(firestore, `memos/answers/answers`), where("period", "==", period))
    const querySnapshot = await getDocs(q);
    const answerList = querySnapshot.docs.map(doc => doc.data());
    return answerList
}

// Improve actions functions
export async function getImproveActions(questionId, subjectId) {
    const q = query(collection(firestore, `memos/answers/answers`), where("questionId", "==", `${questionId}`), where("subjectId", "==", subjectId))
    const querySnapshot = await getDocs(q);
    const answer = querySnapshot.docs.map(doc => doc.data());
    return answer
}

export async function getHistoryImproveActions(subjectId) {
    const q = query(collection(firestore, `memos/checkedimproveactions/checkedimproveactions`), where("subjectId", "==", subjectId))
    const querySnapshot = await getDocs(q);
    const history = querySnapshot.docs.map(doc => doc.data());
    return history
}

export async function updateImproveActions(answerId, newValue) {
    const answerRef = doc(firestore, "memos/answers/answers", answerId)
    await updateDoc(answerRef, {
        answerValue: newValue,
    }).then(() => {
        hideLoader()
        window.location.reload()
    })
}

export async function submitCheckedImproveAction(questionId, answerId, subjectId, period, name, description, updateList) {
    const checkImproveActionRef = doc(collection(firestore, "memos/checkedimproveactions/checkedimproveactions"))
    const newCheckedAction = {
        id: checkImproveActionRef.id,
        questionId: questionId,
        subjectId: subjectId,
        period: period,
        name: name,
        description: description,
        date: Date.now()
    }

    await setDoc(checkImproveActionRef, newCheckedAction).then(() => {
        updateImproveActions(answerId, updateList)
    }).catch((error) => {
        hideLoader()
        console.log(error)
    });
}

// User functions
export const createUser = async function (uid, name, lastname, email, role) {
    const userRef = doc(firestore, 'users', uid);
    const newUser = {
        id: uid,
        name: name,
        lastname: lastname,
        email: email,
        role: [role],
        leaderGroup: "",
        accomplishment: 0
    }
    await setDoc(userRef, newUser).then(() => {
        setLocalStorage('currentuser', JSON.stringify(newUser))
        getCurrentPeriod()
        getUserSubjects(uid)
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
        setLocalStorage('currentuser', JSON.stringify(user))
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
    setLocalStorage('subjectList', JSON.stringify(subjectList))
    hideLoader()
    
    let ls = window.localStorage;
    let localUser = JSON.parse(ls.getItem('currentuser'))

    if(localUser.role.length > 1) {
        console.log("Multiple roles detected")
        window.location = 'role.html'
    } else {
        setLocalStorage('role', JSON.stringify(localUser.role[0]))
        window.location = 'index.html'
    }
    //window.location = 'index.html'
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

export async function submitTestSubject() {
    const subjectRef = doc(collection(firestore, "subjects"))

    const subject = {
        career: "Ingeniería en sistemas",
        careerId: "uxskEpCmz3V8MzSL0t0F",
        department: "Tecnologías de Información y Comunicaciones",
        departmentId: "MAVz6dkETWG7cb0MM4Of",
        group: "Programación",
        groupId: "9oJ4SBaMk6mp1dE53PNj",
        id: subjectRef.id,
        name: "Programación web",
        teacher: "Juan Jose Gonzales",
        teacherId: "dYQEjiQcQDQoBPCTkpVATCBjPi22"
    }

    await setDoc(subjectRef, subject).then(() => {
        console.log("Materia subida")
        console.log(subject.id)
    }).catch((error) => {
        console.log(error)
    });

}