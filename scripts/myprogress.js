import { getAllAnswersByQuestionAndPeriod } from "./modules/firestore.js";
import { getSubjectFromId } from "./utils/getters.js";

export async function getInitialProgressInfo(userSubjects) {
    const progressSubjectScreen = document.querySelector(".progresssubject-screen")
    if (progressSubjectScreen && window.location.href.includes("#progresssubject")) {
        const subjectId = window.location.hash.split("?")[1]
        const subject = getSubjectFromId(subjectId, userSubjects)

        document.querySelector(".progresssubject-screen__info--subjectName").innerHTML = subject.name
        document.querySelector(".progresssubject-screen__info--subjectPeriod").innerHTML = subject.memoPeriod

        const firstQuestionAnswers = await getAllAnswersByQuestionAndPeriod(1, subject.memoPeriod)

        const labels = []
        firstQuestionAnswers.forEach(q => {
            const value = q.answerValue[0]
            const query = labels.find(elem => {
                return elem === value
            })
            if(!query) {
                labels.push(value)
            }
        });

        renderBarChart(labels)
    }
}

function renderBarChart(labels) {
    /*const labels = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
    ];*/

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