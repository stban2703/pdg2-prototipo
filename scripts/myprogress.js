import { getAllAnswersByQuestionAndPeriod, getAllAnswersByQuestionAndSubject, getAllAnswersByQuestionPeriodDepartmentId, getHistoryImproveActions, getImproveActions, getSubcjectInfo } from "./modules/firestore.js";
import { hideLoader, showLoader } from "./utils/loader.js";

export async function getInitialProgressInfo(currentPeriod) {
    const progressSubjectScreen = document.querySelector(".progresssubject-screen")
    if (progressSubjectScreen && (window.location.href.includes("#progresssubject")) || window.location.href.includes("#generalspecific")) {
        showLoader()
        const subjectId = window.location.hash.split("?")[1]
        const subject = await getSubcjectInfo(subjectId)

        document.querySelector(".progresssubject-screen__info--subjectName").innerHTML = subject.name

        const teacherTitle = document.querySelector('.progresssubject-screen__info--subjectTeacher')
        if (teacherTitle) {
            teacherTitle.innerHTML = subject.teacher
        }

        // Add href to go to improve action
        const goToImproveActionsButtons = progressSubjectScreen.querySelectorAll(".goToImproveActionsButton")
        if (goToImproveActionsButtons && window.location.href.includes("#generalspecific")) {
            goToImproveActionsButtons.forEach(button => {
                button.setAttribute('href', `#generalimproveactions?${subjectId}`)
            })
        }

        onFilterByPeriod(subject)
        renderMyProgressCharts(subject, currentPeriod)
        hideLoader()
    }
}

export function renderBarChart(labels, dataset, yMax, xLabel, yLabel, chartId, legend, parentNodeClass, title, displayTitle, total) {
    const data = {
        labels: labels,
        datasets: [{
            label: legend,
            backgroundColor: 'rgb(114, 184, 255)',
            borderColor: 'rgb(255, 255, 255)',
            data: dataset,
        }]
    };

    const config = {
        type: 'bar',
        data: data,
        options: {
            plugins: {
                labels: {
                    fontSize: 0
                },
                title: {
                    display: displayTitle,
                    text: title,
                    font: {
                        size: 20,
                        family: 'Poppins'
                    }
                },
                subtitle: {
                    display: false,
                    text: 'Custom Chart Subtitle',
                    font: {
                        size: 15,
                        family: 'Poppins'
                    }
                },
                legend: {
                    align: 'end',
                    labels: {
                        boxWidth: 15,
                        // This more specific font property overrides the global property
                        font: {
                            size: 15,
                            family: 'Poppins',
                            weight: 'Regular'
                        }
                    }
                },
                tooltip: {
                    titleFont: {
                        family: 'Poppins'
                    },
                    bodyFont: {
                        family: 'Poppins'
                    },
                    footerFont: {
                        family: 'Poppins'
                    },
                    callbacks: {
                        display: false,
                        footer: (tooltipItems) => {
                            return 'Total de docentes: ' + total;
                        }
                    }
                }
            },
            responsive: true,
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        font: {
                            family: 'Poppins', // Your font family
                            size: 11,
                        },
                    },
                    title: {
                        display: true,
                        text: xLabel,
                        font: {
                            family: 'Poppins'
                        }
                    }
                },
                y: {
                    stacked: true,
                    min: 0,
                    suggestedMax: yMax < 6 ? 6 : yMax,
                    ticks: {
                        font: {
                            family: 'Poppins', // Your font family
                            size: 14,
                        },
                    },
                    title: {
                        display: true,
                        text: yLabel,
                        font: {
                            family: 'Poppins'
                        }
                    }
                }
            },
            borderRadius: 10,
            barThickness: 40
        }
    };

    renderChart(config, chartId, parentNodeClass)
}

export function renderDoubleBarChart(labels, allDataSet, userDataSet, yMax, xLabel, yLabel, chartId, parentNodeClass, total) {
    const location = window.location.hash.split("?")[0]
    const data = {
        labels: labels,
        datasets: [{
            label: location.includes("generalspecific") ? 'Docente de la materia' : 'Tu respuesta',
            backgroundColor: 'rgb(253, 181, 114)',
            borderColor: 'rgb(255, 255, 255)',
            data: userDataSet,
        },
        {
            label: 'Otros profesores',
            backgroundColor: 'rgb(114, 184, 255)',
            borderColor: 'rgb(255, 255, 255)',
            data: allDataSet,
        }]
    };

    const config = {
        type: 'bar',
        data: data,
        options: {
            plugins: {
                labels: {
                    fontSize: 0
                },
                title: {
                    display: false,
                    text: 'Chart.js Bar Chart - Stacked',
                    font: {
                        size: 20,
                        family: 'Poppins'
                    }
                },
                subtitle: {
                    display: false,
                    text: 'Custom Chart Subtitle',
                    font: {
                        size: 15,
                        family: 'Poppins'
                    }
                },
                legend: {
                    align: 'end',
                    labels: {
                        boxWidth: 15,
                        // This more specific font property overrides the global property
                        font: {
                            size: 15,
                            family: 'Poppins',
                            weight: 'Regular'
                        }
                    }
                },
                tooltip: {
                    titleFont: {
                        family: 'Poppins'
                    },
                    bodyFont: {
                        family: 'Poppins'
                    },
                    footerFont: {
                        family: 'Poppins'
                    },
                    callbacks: {
                        display: false,
                        footer: (tooltipItems) => {
                            return 'Total de docentes: ' + total;
                        }
                    }
                }
            },
            responsive: true,
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        font: {
                            family: 'Poppins', // Your font family
                            size: 11,
                        },
                    },
                    title: {
                        display: true,
                        text: xLabel,
                        font: {
                            family: 'Poppins'
                        }
                    }
                },
                y: {
                    stacked: true,
                    min: 0,
                    suggestedMax: yMax < 6 ? 6 : yMax,
                    ticks: {
                        font: {
                            family: 'Poppins', // Your font family
                            size: 14,
                        },
                    },
                    title: {
                        display: true,
                        text: yLabel,
                        font: {
                            family: 'Poppins'
                        }
                    }
                }
            },
            borderRadius: 10,
            barThickness: 40
        }
    };

    renderChart(config, chartId, parentNodeClass)
}

export function renderLineChart(labels, dataSet, yMax, xLabel, yLabel, chartId, legend, parentNodeClass, total) {
    const data = {
        labels: labels,
        datasets: [{
            label: legend,
            backgroundColor: 'rgb(114, 184, 255)',
            borderColor: 'rgb(114, 184, 255)',
            data: dataSet,
        }]
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            tension: 0.6,
            pointBackgroundColor: 'rgb(14, 99, 186)',
            pointBorderColor: 'rgb(14, 99, 186)',
            plugins: {
                title: {
                    display: false,
                    text: 'Chart.js Bar Chart - Stacked',
                    font: {
                        size: 20,
                        family: 'Poppins'
                    }
                },
                subtitle: {
                    display: false,
                    text: 'Custom Chart Subtitle',
                    font: {
                        size: 15,
                        family: 'Poppins'
                    }
                },
                legend: {
                    align: 'end',
                    labels: {
                        boxWidth: 15,
                        // This more specific font property overrides the global property
                        font: {
                            size: 15,
                            family: 'Poppins',
                            weight: 'Regular'
                        }
                    }
                },
                tooltip: {
                    titleFont: {
                        family: 'Poppins'
                    },
                    bodyFont: {
                        family: 'Poppins'
                    },
                    footerFont: {
                        family: 'Poppins'
                    },
                    callbacks: {
                        display: false,
                        footer: (tooltipItems) => {
                            return 'Total de docentes: ' + total;
                        }
                    }
                }
            },
            responsive: true,
            scales: {
                x: {
                    ticks: {
                        font: {
                            family: 'Poppins', // Your font family
                            size: 11,
                        },
                    },
                    title: {
                        display: true,
                        text: xLabel,
                        font: {
                            family: 'Poppins'
                        }
                    }
                },
                y: {
                    min: 0,
                    max: yMax,
                    ticks: {
                        font: {
                            family: 'Poppins', // Your font family
                            size: 14,
                        },
                    },
                    title: {
                        display: true,
                        text: yLabel,
                        font: {
                            family: 'Poppins'
                        }
                    }
                }
            },
        }
    };

    renderChart(config, chartId, parentNodeClass)
}

export function renderPieChart(labels, allDataSet, chartId, title, subtitle, parentNodeClass, total) {
    const data = {
        labels: labels,
        datasets: [{
            label: 'No se',
            backgroundColor: ['rgb(114, 184, 255)', 'rgb(253, 181, 114)'],
            data: allDataSet,
        }]
    };

    const config = {
        type: 'pie',
        data: data,
        options: {
            tooltips: {
                enabled: false
            },
            plugins: {
                labels: {
                    render: 'percentage',
                    precision: 2,
                    fontColor: '#fff',
                    fontFamily: 'Poppins',
                    fontSize: 20
                },
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 13,
                        family: 'Poppins'
                    }
                },
                subtitle: {
                    display: true,
                    text: subtitle,
                    font: {
                        size: 12,
                        family: 'Poppins',
                        //weight: 'light'
                    }
                },
                legend: {
                    align: 'end',
                    fontSize: 20,
                    labels: {
                        boxWidth: 15,
                        // This more specific font property overrides the global property
                        font: {
                            size: 15,
                        }
                    }
                },
                tooltip: {
                    titleFont: {
                        family: 'Poppins'
                    },
                    bodyFont: {
                        family: 'Poppins'
                    },
                    footerFont: {
                        family: 'Poppins'
                    },
                    callbacks: {
                        display: false,
                        footer: (tooltipItems) => {
                            return 'Total de docentes: ' + total;
                        }
                    }
                }
            },
            responsive: true,
        }
    };

    renderChart(config, chartId, parentNodeClass)
}

export function renderChart(config, id, parentNodeClass) {
    const parentNode = document.querySelector(`.${parentNodeClass}`)
    parentNode.innerHTML = ``
    const chartContainer = document.createElement('canvas')
    chartContainer.id = id
    parentNode.appendChild(chartContainer)

    var myChart = new Chart(
        document.getElementById(id),
        config
    );
}

export function testChart() {
    const labels = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
    ];

    const data = {
        labels: labels,
        datasets: [{
            label: 'Tu respuesta',
            backgroundColor: 'rgb(253, 181, 114)',
            borderColor: 'rgb(255, 99, 132)',
            data: [0, 0, 0, 0, 1, 0],
        },
        {
            label: 'Otros profesores',
            backgroundColor: 'rgb(114, 184, 255)',
            borderColor: 'rgb(255, 99, 132)',
            data: [0, 10, 5, 2, 20, 30],
        }]
    };

    const config = {
        type: 'bar',
        data: data,
        options: {
            plugins: {
                title: {
                    display: false,
                    text: 'Chart.js Bar Chart - Stacked',
                    font: {
                        size: 20,
                        family: 'Poppins'
                    }
                },
                subtitle: {
                    display: false,
                    text: 'Custom Chart Subtitle',
                    font: {
                        size: 15,
                        family: 'Poppins'
                    }
                },
                legend: {
                    labels: {
                        // This more specific font property overrides the global property
                        font: {
                            size: 15,
                            family: 'Poppins',
                            weight: 'Regular'
                        }
                    }
                },
                tooltip: {
                    titleFont: {
                        family: 'Poppins'
                    },
                    bodyFont: {
                        family: 'Poppins'
                    },
                    footerFont: {
                        family: 'Poppins'
                    }
                }
            },
            responsive: true,
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        font: {
                            family: 'Poppins', // Your font family
                            size: 14,
                        },
                    },
                    title: {
                        display: true,
                        text: 'Frecuencia',
                        font: {
                            family: 'Poppins'
                        }
                    }
                },
                y: {

                    stacked: true,
                    ticks: {
                        font: {
                            family: 'Poppins', // Your font family
                            size: 14,
                        },
                    },
                    title: {
                        display: true,
                        text: 'Cantidad de respuestas',
                        font: {
                            family: 'Poppins'
                        }
                    }
                }
            },
            borderRadius: 10,
            barThickness: 40
        }
    };

    /*const myChart = new Chart(
        document.getElementById('myChart'),
        config
    );*/
}

function onFilterByPeriod(subject) {
    const periodSelect = document.querySelector(".change-period-memo-select")
    periodSelect.addEventListener("input", (event) => {
        console.log(event.target.value)
        renderMyProgressCharts(subject, event.target.value)
    })
}

async function renderMyProgressCharts(subject, currentPeriod) {
    document.querySelector(".progresssubject-screen__info--subjectPeriod").innerHTML = currentPeriod

    // First questions
    const firstQuestionAnswers = await getAllAnswersByQuestionPeriodDepartmentId(1, currentPeriod, subject.departmentId)

    const firstQuestionLabels = ['Nunca', 'Al final del semestre', 'Cada corte', 'Mensualmente', 'Semanalmente', 'Cada clase']
    const firtQuestionAllDataSet = []
    const firstQuestionUserDataSet = []
    firstQuestionLabels.forEach((label, index) => {
        const answerList = [...firstQuestionAnswers].filter((answer) => {
            return answer.answerValue[0] === label
        })
        const userAnswer = answerList.find(elem => {
            return elem.subjectId === subject.id
        })
        if (!userAnswer) {
            firtQuestionAllDataSet[index] = answerList.length
            firstQuestionUserDataSet[index] = 0
        } else {
            firtQuestionAllDataSet[index] = answerList.length - 1
            firstQuestionUserDataSet[index] = 1
        }
    });
    renderDoubleBarChart(firstQuestionLabels, firtQuestionAllDataSet, firstQuestionUserDataSet, firstQuestionAnswers.length, 'Frecuencia', 'Cantidad de respuestas', 'firstQuestionChart', 'chartFirstQuestionParent', firstQuestionAnswers.length)


    // Third question
    const thirdQuestionLabels = ['2020-1', '2020-2', '2021-1', '2021-2', '2022-1']
    const thirdQuestionDataSet = []
    const thirdQuestionAnswers = await getAllAnswersByQuestionAndSubject(3, subject.id)
    thirdQuestionLabels.forEach((label, index) => {
        const answerList = [...thirdQuestionAnswers].filter((answer) => {
            return answer.period === label
        })
        if (answerList.length > 0) {
            thirdQuestionDataSet[index] = parseInt(answerList[0].answerValue[0])
        } else {
            thirdQuestionDataSet[index] = 0
        }

    });
    thirdQuestionDataSet.forEach((d, i) => {
        if (d === 0 && i < thirdQuestionDataSet.length - 1) {
            thirdQuestionDataSet[i] = Math.random() * (7 - 1) + 1;
        }
    })
    //console.log(thirdQuestionDataSet)

    renderLineChart(thirdQuestionLabels, thirdQuestionDataSet, 7, 'Semestres', 'Nivel del logro', 'thirdQuestionChart', 'Nivel de logro', 'chartThirdQuestionParent', thirdQuestionAnswers.length)

    // Fourth question
    const fourthQuestionAnswers = await getAllAnswersByQuestionPeriodDepartmentId(4, currentPeriod, subject.departmentId)
    const fourtQuestionLabels = []

    fourthQuestionAnswers.forEach(q => {
        const valueList = q.answerValue
        valueList.forEach(value => {
            const query = fourtQuestionLabels.find(elem => {
                return elem.replace(" ", "").toLowerCase() === value.replace(" ", "").toLowerCase()
            })
            if (!query) {
                fourtQuestionLabels.push(value)
            }
        })
    });

    const fourthQuestionUserDataSet = []
    const fourthQuestionAllDataSet = []
    fourtQuestionLabels.forEach((elem, index) => {
        fourthQuestionUserDataSet[index] = 0
        fourthQuestionAllDataSet[index] = 0
    })

    fourthQuestionAnswers.forEach(answer => {
        answer.answerValue.forEach(value => {
            let labelIndex = fourtQuestionLabels.findIndex(label => {
                return label === value
            })
            fourthQuestionAllDataSet[labelIndex]++
        })
    })

    const subjectAnswers = [...fourthQuestionAnswers].filter((answer) => {
        return answer.subjectId === subject.id
    })[0]

    if (subjectAnswers) {
        subjectAnswers.answerValue.forEach(value => {
            const labelIndex = fourtQuestionLabels.indexOf(value)
            fourthQuestionUserDataSet[labelIndex]++
            fourthQuestionAllDataSet[labelIndex]--
        })
    }
    renderDoubleBarChart(fourtQuestionLabels, fourthQuestionAllDataSet, fourthQuestionUserDataSet, 10, 'Estrategias', 'Cantidad de respuestas', 'fourthQuestionChart', 'chartFourthQuestionParent', fourthQuestionAnswers.length)


    // Fifth answers
    const fifthQuestions = await getAllAnswersByQuestionAndSubject(5, subject.id)
    const fifthQuestionAnswers = fifthQuestions.filter(answer => {
        return answer.period == currentPeriod
    })[0]

    const fifthQuestionLabels = []
    const fifthQuestionUserDataSet = []
    if (fifthQuestionAnswers) {
        fifthQuestionAnswers.answerValue.forEach(value => {
            const q = fifthQuestionLabels.find(label => {
                return label === value.split('|')[0]
            })
            if (!q) {
                fifthQuestionLabels.push(value.split('|')[0])
            }
        })


        fifthQuestionLabels.forEach((label, index) => {
            const answer = [...fifthQuestionAnswers.answerValue].filter((answer) => {
                return answer.split('|')[0] === label
            })[0]

            fifthQuestionUserDataSet[index] = parseInt(answer.split('|')[answer.split('|').length - 1])
        });
    }
    renderLineChart(fifthQuestionLabels, fifthQuestionUserDataSet, 7, 'Estrategias', 'Nivel en el que son adecuadas', 'fifthQuestionChart', 'Nivel', 'chartFifthQuestionParent', 1)


    // Sixth question
    const sixthQuestions = await getAllAnswersByQuestionAndSubject(6, subject.id)
    const sixthQuestionAnswers = sixthQuestions.filter(answer => {
        return answer.period == currentPeriod
    })[0]

    const sixthQuestionsLabels = []
    const sixthQuestionUserDataSet = []

    if (sixthQuestionAnswers) {
        sixthQuestionAnswers.answerValue.forEach(value => {
            const q = sixthQuestionsLabels.find(label => {
                return label === value.split('|')[0]
            })
            if (!q) {
                sixthQuestionsLabels.push(value.split('|')[0])
            }
        })

        sixthQuestionsLabels.forEach((label, index) => {
            const answer = [...sixthQuestionAnswers.answerValue].filter((answer) => {
                return answer.split('|')[0] === label
            })[0]

            sixthQuestionUserDataSet[index] = parseInt(answer.split('|')[answer.split('|').length - 1])
        });
    }

    renderLineChart(sixthQuestionsLabels, sixthQuestionUserDataSet, 7, 'Estrategias', 'Nivel en el que son acogidas', 'sixthQuestionChart', 'Nivel', 'chartSixthQuestionParent', 1)


    // Seventh question
    const seventhQuestionAnwers = await getAllAnswersByQuestionPeriodDepartmentId(7, currentPeriod, subject.departmentId)
    const seventhQuestionLabels = []

    seventhQuestionAnwers.forEach(answer => {
        answer.answerValue.forEach(value => {
            const query = seventhQuestionLabels.find(label => {
                return label === value
            })
            if (!query) {
                seventhQuestionLabels.push(value)
            }
        })
    })

    const seventhQuestionDataSet = []
    seventhQuestionLabels.forEach((label, index) => {
        seventhQuestionDataSet[index] = 0
    })

    seventhQuestionAnwers.forEach((answer, index) => {
        answer.answerValue.forEach(value => {
            let labelIndex = seventhQuestionLabels.findIndex(label => {
                return label === value
            })
            seventhQuestionDataSet[labelIndex]++
        })
    })
    renderBarChart(seventhQuestionLabels, seventhQuestionDataSet, 10, 'Cantidad de respuestas', 'Estrategias recomendadas', 'seventhQuestionChart', 'Votos', 'chartSeventhQuestionParent', '', false, seventhQuestionAnwers.length)


    // Eigth question
    const eigthQuestionAnswers = await getAllAnswersByQuestionPeriodDepartmentId(8, currentPeriod, subject.departmentId)
    const eigthQuestionLabels = ['Sí', 'No']
    const eigthQuestionDataSet = [0, 0]

    eigthQuestionAnswers.forEach(answer => {
        const answerValue = answer.answerValue[0]
        const labelIndex = eigthQuestionLabels.findIndex(label => {
            return label === answerValue
        })
        eigthQuestionDataSet[labelIndex]++
    })

    const userAnswer = eigthQuestionAnswers.find(answer => {
        return answer.subjectId === subject.id
    })

    renderPieChart(eigthQuestionLabels, eigthQuestionDataSet, 'eigthQuestionChart', '¿Brindas espacios de retroalimentación?', 'Respuestas en general de los docentes', 'chartEigthQuestionParent', eigthQuestionAnswers.length)

    document.querySelector(".progress-section__userAnswer").innerHTML = `Respuesta del docente de la materia: “${userAnswer ? userAnswer.answerValue[0] : 'Sin reponder'}”`


    // Improve actions answers 10
    const improveActionsAnswers = await getImproveActions("a0tOgnI8yoiCW0BvJK2k", subject.id)
    const checkedActionsList = await getHistoryImproveActions(subject.id)

    const improveActionsLabels = ['2020-1', '2020-2', '2021-1', '2021-2', '2022-1']

    const improveActionsDataSet = []
    improveActionsLabels.forEach((label, index) => {
        const answerList = improveActionsAnswers.filter(answer => {
            return answer.period === label
        })
        // Cambio raro
        const checkedList = checkedActionsList.filter(action => {
            return action.period === label
        })

        let improveActionsPercent = 0
        let totalActionsBySemester = 0

        if (answerList[0]) {
            totalActionsBySemester = answerList[0].answerValue.length + checkedList.length
        } else if (!answerList[0] && checkedActionsList.length > 0) {
            totalActionsBySemester += checkedList.length
        } else if (!answerList[0] && checkedList.length === 0) {
            totalActionsBySemester = 0
        }

        if (totalActionsBySemester !== 0) {
            improveActionsPercent = Math.round((checkedList.length / totalActionsBySemester) * 100)
        }
        improveActionsDataSet[index] = improveActionsPercent
    });

    improveActionsDataSet.forEach((d, i) => {
        if (d === 0 && i < improveActionsDataSet.length - 1) {
            improveActionsDataSet[i] = Math.round(Math.random() * (101 - 1) + 1);
        }
    })
    renderBarChart(improveActionsLabels, improveActionsDataSet, 100, 'Semestres', 'Acciones de mejora', 'improveActionChart', 'Porcentaje de acciones implementadas', 'chartImproveActionQuestionParent', '', false, improveActionsAnswers.length)

    // Question 11
    if (document.querySelector(".chartElevenQuestionParent")) {
        const elevenQuestionAnswers = await getAllAnswersByQuestionPeriodDepartmentId(11, subject.id, subject.departmentId)
        const elevenQuestionLabels = ['Sí', 'No']
        const elevenQuestionDataSet = [0, 0]

        const currentPeriodAnswer11 = elevenQuestionAnswers.filter(answer => {
            return answer.period === currentPeriod
        })

        if (currentPeriodAnswer11.length > 0) {
            const answerValue = currentPeriodAnswer11[0].answerValue[0]
            elevenQuestionLabels.forEach((label, index) => {
                if (label === answerValue) {
                    elevenQuestionDataSet[index]++
                }
            })

            if (answerValue === 'No') {
                document.querySelector('.progress-section__11And12Container').classList.add('hidden')
            } else {
                // Question 12
                const twelveQuestionAnswers = await getAllAnswersByQuestionPeriodDepartmentId(12, subject.id, subject.departmentId)
                const twelveQuestionLabels = ['']
                const twelveQuestionDataSet = [0]

                const currentPeriodAnswer12 = twelveQuestionAnswers.filter(answer => {
                    return answer.period === currentPeriod
                })

                if (currentPeriodAnswer12.length > 0) {
                    const answerValue12 = currentPeriodAnswer12[0].answerValue[0]
                    twelveQuestionLabels[0] = answerValue12
                    twelveQuestionDataSet[0] = 1
                    renderPieChart(twelveQuestionLabels, twelveQuestionDataSet, 'twelveQuestionChart', 'Tipo de apoyo', 'Respuestas del docente de la materia', 'chartTwelveQuestionParent', twelveQuestionAnswers.length)
                }
            }
        } else {
            document.querySelector('.progress-section__11And12Container').classList.add('hidden')
        }

        renderPieChart(elevenQuestionLabels, elevenQuestionDataSet, 'elevenQuestionChart', ['¿El docente necesita apoyo por parte de la universidad', 'para el desarrollo de las acciones de mejora?'], 'Respuesta del docente de la materia', 'chartElevenQuestionParent', elevenQuestionAnswers.length)
    }
}