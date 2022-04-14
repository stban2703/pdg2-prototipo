import { getAllAnswersByQuestionAndPeriod, getAllAnswersByQuestionAndSubject } from "./modules/firestore.js";
import { getSubjectFromId } from "./utils/getters.js";

export async function getInitialProgressInfo(userSubjects) {
    const progressSubjectScreen = document.querySelector(".progresssubject-screen")
    if (progressSubjectScreen && window.location.href.includes("#progresssubject")) {
        const subjectId = window.location.hash.split("?")[1]
        const subject = getSubjectFromId(subjectId, userSubjects)

        document.querySelector(".progresssubject-screen__info--subjectName").innerHTML = subject.name
        document.querySelector(".progresssubject-screen__info--subjectPeriod").innerHTML = subject.memoPeriod


        // First questions
        const firstQuestionAnswers = await getAllAnswersByQuestionAndPeriod(1, subject.memoPeriod)
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
        renderBarChart(firstQuestionLabels, firtQuestionAllDataSet, firstQuestionUserDataSet, firstQuestionAnswers.length, 'Frecuencia', 'Cantidad de respuestas')


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
        renderUserLineChart(thirdQuestionLabels, thirdQuestionDataSet, 7)

        // Fourth question
        const fourthQuestionAnswers = await getAllAnswersByQuestionAndPeriod(4, subject.memoPeriod)
        //console.log(fourthQuestionAnswers)
    }
}

function renderBarChart(labels, allDataSet, userDataSet, yMax, xLabel, yLabel) {
    const data = {
        labels: labels,
        datasets: [{
            label: 'Tu respuesta',
            backgroundColor: 'rgb(253, 181, 114)',
            borderColor: 'rgb(255, 99, 132)',
            data: userDataSet,
        },
        {
            label: 'Otros profesores',
            backgroundColor: 'rgb(114, 184, 255)',
            borderColor: 'rgb(255, 99, 132)',
            data: allDataSet,
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
                    max: yMax < 6 ? 6 : yMax,
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

    renderChart(config, "firstQuestionChart")
}


function renderUserLineChart(labels, userDataSet, yMax) {
    const data = {
        labels: labels,
        datasets: [{
            label: 'Nivel alcanzado',
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
                        text: 'Semestres',
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
                        text: 'Nivel de logro',
                        font: {
                            family: 'Poppins'
                        }
                    }
                }
            },
        }
    };

    renderChart(config, "thirdQuestionChart")

    /*firstQuestionAnswers.forEach(q => {
            const value = q.answerValue[0]
            const query = labels.find(elem => {
                return elem === value
            })
            if (!query) {
                labels.push(value)
            }
        });*/

    /*const groups = firstQuestionAnswers.reduce((groups, item) => ({
        ...groups,
        [item.answerValue[0]]: [...(groups[item.answerValue[0]] || []), item]
    }), {});

    const keys = Object.keys(groups);

    keys.forEach((key, index) => {
        console.log(groups[key].length)
    })
    /*groups.forEach(elem => {
        console.log(elem.length)
    })*/
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