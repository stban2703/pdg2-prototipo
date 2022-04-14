import { getAllAnswersByQuestionAndPeriod } from "./modules/firestore.js";
import { getSubjectFromId } from "./utils/getters.js";

export async function getInitialProgressInfo(userId, userSubjects) {
    const progressSubjectScreen = document.querySelector(".progresssubject-screen")
    if (progressSubjectScreen && window.location.href.includes("#progresssubject")) {
        const subjectId = window.location.hash.split("?")[1]
        const subject = getSubjectFromId(subjectId, userSubjects)

        document.querySelector(".progresssubject-screen__info--subjectName").innerHTML = subject.name
        document.querySelector(".progresssubject-screen__info--subjectPeriod").innerHTML = subject.memoPeriod

        const firstQuestionAnswers = await getAllAnswersByQuestionAndPeriod(1, subject.memoPeriod)

        const labels = ['Nunca', 'Al final del semestre', 'Cada corte', 'Mensualmente', 'Semanalmente', 'Cada clase']

        const allDataSet = []
        const userDataSet = []

        labels.forEach((label, index) => {
            const answerList = [...firstQuestionAnswers].filter((answer) => {
                return answer.answerValue[0] === label
            })
            const userAnswer = answerList.find(elem => {
                return elem.subjectId === subjectId
            })
            if (!userAnswer) {
                allDataSet[index] = answerList.length
                userDataSet[index] = 0
            } else {
                allDataSet[index] = answerList.length - 1
                userDataSet[index] = 1
            }
        });

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
        renderBarChart(labels, allDataSet, userDataSet, firstQuestionAnswers.length)
    }
}

function renderBarChart(labels, allDataSet, userDataSet, yMax) {
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
                        text: 'Frecuencia',
                        font: {
                            family: 'Poppins'
                        }
                    }
                },
                y: {
                    stacked: true,
                    min: 0,
                    max: yMax < 6 ? 6: yMax,
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

    renderChart(config, "firstQuestionChart")
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