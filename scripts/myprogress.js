import { getAllAnswersByQuestionAndPeriod, getAllAnswersByQuestionAndSubject, getHistoryImproveActions, getImproveActions } from "./modules/firestore.js";
import { getSubjectFromId } from "./utils/getters.js";
import { hideLoader, showLoader } from "./utils/loader.js";

export async function getInitialProgressInfo(userSubjects, currentPeriod) {
    const progressSubjectScreen = document.querySelector(".progresssubject-screen")
    if (progressSubjectScreen && window.location.href.includes("#progresssubject")) {
        showLoader()
        const subjectId = window.location.hash.split("?")[1]
        const subject = getSubjectFromId(subjectId, userSubjects)

        document.querySelector(".progresssubject-screen__info--subjectName").innerHTML = subject.name
        document.querySelector(".progresssubject-screen__info--subjectPeriod").innerHTML = currentPeriod


        // First questions
        const firstQuestionAnswers = await getAllAnswersByQuestionAndPeriod(1, currentPeriod)
        const firstQuestionLabels = ['Nunca', 'Al final del semestre', 'Cada corte', 'Mensualmente', 'Semanalmente', 'Cada clase']
        const firtQuestionAllDataSet = []
        const firstQuestionUserDataSet = []
        firstQuestionLabels.forEach((label, index) => {
            const answerList = [...firstQuestionAnswers].filter((answer) => {
                return answer.answerValue[0] === label
            })
            const userAnswer = answerList.find(elem => {
                return elem.subjectId === subjectId
            })
            if (!userAnswer) {
                firtQuestionAllDataSet[index] = answerList.length
                firstQuestionUserDataSet[index] = 0
            } else {
                firtQuestionAllDataSet[index] = answerList.length - 1
                firstQuestionUserDataSet[index] = 1
            }
        });
        renderDoubleBarChart(firstQuestionLabels, firtQuestionAllDataSet, firstQuestionUserDataSet, firstQuestionAnswers.length, 'Frecuencia', 'Cantidad de respuestas', 'firstQuestionChart')


        // Third question
        const thirdQuestionLabels = ['2020-1', '2020-2', '2021-1', '2021-2', '2022-1']
        const thirdQuestionDataSet = []
        const thirdQuestionAnswers = await getAllAnswersByQuestionAndSubject(3, subjectId)
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
        renderUserLineChart(thirdQuestionLabels, thirdQuestionDataSet, 7, 'Semestres', 'Nivel del logro', 'thirdQuestionChart', 'Nivel de logro')

        // Fourth question
        const fourthQuestionAnswers = await getAllAnswersByQuestionAndPeriod(4, currentPeriod)
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
            return answer.subjectId === subjectId
        })[0].answerValue

        subjectAnswers.forEach(value => {
            const labelIndex = fourtQuestionLabels.indexOf(value)
            fourthQuestionUserDataSet[labelIndex]++
            fourthQuestionAllDataSet[labelIndex]--
        })
        renderDoubleBarChart(fourtQuestionLabels, fourthQuestionAllDataSet, fourthQuestionUserDataSet, 10, 'Estrategias', 'Cantidad de respuestas', 'fourthQuestionChart')


        // Fifth answers
        const fifthQuestions = await getAllAnswersByQuestionAndSubject(5, subjectId)
        const fifthQuestionAnswers = fifthQuestions.filter(answer => {
            return answer.period == currentPeriod
        })[0].answerValue

        const fifthQuestionLabels = []
        fifthQuestionAnswers.forEach(value => {
            const q = fifthQuestionLabels.find(label => {
                return label === value.split('|')[0]
            })
            if (!q) {
                fifthQuestionLabels.push(value.split('|')[0])
            }
        })

        const fifthQuestionUserDataSet = []
        fifthQuestionLabels.forEach((label, index) => {
            const answer = [...fifthQuestionAnswers].filter((answer) => {
                return answer.split('|')[0] === label
            })[0]

            fifthQuestionUserDataSet[index] = parseInt(answer.split('|')[answer.split('|').length - 1])
        });

        renderUserLineChart(fifthQuestionLabels, fifthQuestionUserDataSet, 7, 'Estrategias', 'Nivel en el que son adecuadas', 'fifthQuestionChart', 'Nivel')


        // Sixth question
        const sixthQuestions = await getAllAnswersByQuestionAndSubject(6, subjectId)
        const sixthQuestionAnswers = sixthQuestions.filter(answer => {
            return answer.period == currentPeriod
        })[0].answerValue

        const sixthQuestionsLabels = []
        sixthQuestionAnswers.forEach(value => {
            const q = sixthQuestionsLabels.find(label => {
                return label === value.split('|')[0]
            })
            if (!q) {
                sixthQuestionsLabels.push(value.split('|')[0])
            }
        })

        const sixthQuestionUserDataSet = []
        sixthQuestionsLabels.forEach((label, index) => {
            const answer = [...sixthQuestionAnswers].filter((answer) => {
                return answer.split('|')[0] === label
            })[0]

            sixthQuestionUserDataSet[index] = parseInt(answer.split('|')[answer.split('|').length - 1])
        });

        renderUserLineChart(sixthQuestionsLabels, sixthQuestionUserDataSet, 7, 'Estrategias', 'Nivel en el que son acogidas', 'sixthQuestionChart', 'Nivel')


        // Seventh question
        const seventhQuestionAnwers = await getAllAnswersByQuestionAndPeriod(7, currentPeriod)
        const seventhQuestionLabels = []

        seventhQuestionAnwers.forEach(answer => {
            answer.answerValue.forEach(value => {
                console.log(value)
                const query = seventhQuestionLabels.find(label => {
                    return label === value
                })
                if(!query) {
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
        renderBarChart(seventhQuestionLabels, seventhQuestionDataSet, 10, 'Cantidad de respuestas', 'Estrategias recomendadas', 'seventhQuestionChart', 'Votos')
        

        // Eigth question
        const eigthQuestionAnswers = await getAllAnswersByQuestionAndPeriod(8, currentPeriod)
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
            return answer.subjectId === subjectId
        })

        renderPieChart(eigthQuestionLabels, eigthQuestionDataSet, "No", 'eightQuestionChart')
        document.querySelector(".progress-section__userAnswer").innerHTML = `Respuesta del docente de la materia: “${userAnswer.answerValue[0]}”`
        hideLoader()


        // Improve actions answers 10
        const improveActionsAnswers = await getImproveActions("a0tOgnI8yoiCW0BvJK2k", subjectId)
        const checkedActionsList = await getHistoryImproveActions(subjectId)

        const improveActionsLabels = ['2020-1', '2020-2', '2021-1', '2021-2', '2022-1']

        const improveActionsDataSet = []
        improveActionsLabels.forEach((label, index) => {
            const answerList = improveActionsAnswers.filter(answer => {
                return answer.period === label
            })
            const checkedList = improveActionsAnswers.filter(action => {
                return action.period === label
            })

            let improveActionsPercent = 0
            let totalActionsBySemester = 0

            if (answerList[0]) {
                totalActionsBySemester = answerList[0].answerValue.length + checkedList.length
            } else if(!answerList[0] && checkedActionsList.length > 0) {
                totalActionsBySemester += checkedList.length
            } else if(!answerList[0] && checkedList.length === 0){
                totalActionsBySemester = 0
            }

            if(totalActionsBySemester !== 0) {
                improveActionsPercent = Math.round((checkedList.length / totalActionsBySemester) * 100)
            }
            improveActionsDataSet[index] = improveActionsPercent
        });
       
        renderBarChart(improveActionsLabels, improveActionsDataSet, 100, 'Semestres', 'Tus acciones de mejora', 'improveActionChart', 'Porcentaje de acciones implementadas')
    }
}

function renderBarChart(labels, dataset, yMax, xLabel, yLabel, chartId, legend) {
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

    renderChart(config, chartId)
}

function renderDoubleBarChart(labels, allDataSet, userDataSet, yMax, xLabel, yLabel, chartId) {
    const data = {
        labels: labels,
        datasets: [{
            label: 'Tu respuesta',
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

    renderChart(config, chartId)
}

function renderUserLineChart(labels, userDataSet, yMax, xLabel, yLabel, chartId, legend) {
    const data = {
        labels: labels,
        datasets: [{
            label: legend,
            backgroundColor: 'rgb(114, 184, 255)',
            borderColor: 'rgb(114, 184, 255)',
            data: userDataSet,
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

    renderChart(config, chartId)
}

function renderPieChart(labels, allDataSet, userAnswer, chartId) {
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
                    text: '¿Brindas espacios de retroalimentación?',
                    font: {
                        size: 14,
                        family: 'Poppins'
                    }
                },
                subtitle: {
                    display: true,
                    text: 'Respuestas en general de los docentes',
                    font: {
                        size: 14,
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
                    }
                }
            },
            responsive: true,
        }
    };

    renderChart(config, chartId)
}

function renderChart(config, id) {
    const myChart = new Chart(
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