const API_URL =
    window.location.hostname === "localhost"
        ? "https://localhost:7121/api"
        : "https://smartexamsystem-v1-1.onrender.com/api";
// ================= REGISTER =================

async function register() {

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

        const response = await fetch(
            `${API_URL}/Auth/register`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    role: "Student"
                })
            });

        const result = await response.text();

        if (!response.ok) {
            alert(result);
            return;
        }

        alert(result);

        window.location.href = "login.html";
    }
    catch (error) {

        console.error(error);
        alert("Cannot connect to API");
    }
}

// ================= LOGIN =================

async function login() {
    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;

    try {

        const response =
            await fetch(
                `${API_URL}/Auth/login`, 
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                });

        if (!response.ok) {
            console.log("Status:", response.status);
            console.log(await response.text());
            alert("Invalid Credentials");
            return;
        }

        const data =
            await response.json();

        localStorage.setItem(
            "token",
            data.token
        );

        const payload =
            JSON.parse(
                atob(
                    data.token.split('.')[1]
                )
            );

        const role =
            payload[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ];
        alert("Role = " + role);


        const userId =
            payload["UserId"];

        localStorage.setItem(
            "role",
            role
        );

        localStorage.setItem(
            "userId",
            userId
        );

        console.log("Role:", role);

        if (role === "Admin") {

            console.log("Redirecting to admin-dashboard.html");

            window.location.href = "admin-dashboard.html";

        } else {

            console.log("Redirecting to dashboard.html");

            window.location.href = "dashboard.html";
        }
    }
    catch (error) {

        console.error(error);

        alert("Cannot Connect To API");
    }
}

// ================= LOGOUT =================

function logout() {

    localStorage.clear();

    window.location.href =
        "login.html";
}

// ================= STUDENT CHECK =================

function checkStudent() {

    const role =
        localStorage.getItem("role");

    if (role !== "Student") {

        alert("Access Denied");

        window.location.href =
            "login.html";
    }
}

// ================= LOAD EXAMS =================

async function loadExams() {

    try {

        const response =
            await fetch(`${API_URL}/Exam`);

        const exams =
            await response.json();

        let html = "";

        exams.forEach(exam => {

            html += `
            <div class="exam-card">

                <h3>📘 ${exam.title}</h3>

                <p>${exam.description}</p>

                <p>
                    ⏳ Duration:
                    ${exam.duration} Minutes
                </p>

                <button
                    class="btn btn-primary"
                    onclick="startExam(${exam.id})">

                    Start Exam

                </button>

            </div>
            `;
        });

        const examList =
            document.getElementById("examList");

        if (examList) {

            examList.innerHTML = html;
        }

    }
    catch (error) {

        console.error(error);

        alert("Failed To Load Exams");
    }
}

// ================= START EXAM =================

function startExam(examId) {

    localStorage.setItem(
        "examId",
        examId
    );

    window.location.href =
        "exam.html";
}

// ================= LOAD QUESTIONS =================

async function loadQuestions() {

    const examId =
        localStorage.getItem("examId");

    try {

        const response =
            await fetch(
                `${API_URL}/Question/exam/${examId}`
            );

        const questions =
            await response.json();

        let html = "";

        questions.forEach(q => {

            html += `

            <div class="question-box">

                <h5>Question ${q.id}</h5>

                <h4>${q.questionText}</h4>

                <label>
                    <input type="radio"
                           name="${q.id}"
                           value="${q.optionA}">
                    ${q.optionA}
                </label>

                <label>
                    <input type="radio"
                           name="${q.id}"
                           value="${q.optionB}">
                    ${q.optionB}
                </label>

                <label>
                    <input type="radio"
                           name="${q.id}"
                           value="${q.optionC}">
                    ${q.optionC}
                </label>

                <label>
                    <input type="radio"
                           name="${q.id}"
                           value="${q.optionD}">
                    ${q.optionD}
                </label>

            </div>

            `;
        });

        document.getElementById("questions")
            .innerHTML = html;
    }
    catch (error) {

        console.error(error);
    }
}

// ================= SUBMIT EXAM =================

async function submitExam() {

    const examId =
        parseInt(
            localStorage.getItem(
                "examId"
            )
        );

    const userId =
        parseInt(
            localStorage.getItem(
                "userId"
            )
        );

    const token =
        localStorage.getItem(
            "token"
        );

    const answers = [];

    document
        .querySelectorAll(
            "input[type='radio']:checked"
        )
        .forEach(option => {

            answers.push({

                questionId:
                    parseInt(option.name),

                selectedOption:
                    option.value
            });
        });

    try {

        const response =
            await fetch(
                `${API_URL}/Result/submit`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            "Bearer " + token
                    },

                    body: JSON.stringify({

                        userId,
                        examId,
                        answers
                    })
                });

        const result =
            await response.json();

        localStorage.setItem(
            "score",
            result.score
        );

        localStorage.setItem(
            "percentage",
            result.percentage
        );

        localStorage.setItem(
            "status",
            result.status
        );

        window.location.href =
            "result.html";
    }
    catch (error) {

        console.error(error);

        alert(
            "Failed To Submit Exam"
        );
    }
}

// ================= RESULT PAGE =================

function loadResult() {

    const score =
        localStorage.getItem("score");

    const percentage =
        localStorage.getItem("percentage");

    const status =
        localStorage.getItem("status");

    const badgeClass =
        status === "Pass"
            ? "pass"
            : "fail";

    document
        .getElementById("resultContainer")
        .innerHTML = `

        <h2>
            Score: ${score}
        </h2>

        <h3 class="mt-3">
            Percentage: ${percentage}%
        </h3>

        <h2 class="${badgeClass} mt-4">
            ${status}
        </h2>

        `;
}


// ================= TIMER =================

let timerInterval;

async function startTimer() {

    try {

        const examId =
            localStorage.getItem("examId");

        const response =
            await fetch(
                `${API_URL}/Exam/${examId}`
            );

        const exam =
            await response.json();

        let minutes =
            exam.duration;

        let seconds = 0;

        timerInterval =
            setInterval(() => {

                if (
                    minutes === 0 &&
                    seconds === 0
                ) {

                    clearInterval(
                        timerInterval
                    );

                    alert(
                        "Time Up! Exam Submitted."
                    );

                    submitExam();

                    return;
                }

                if (seconds === 0) {

                    minutes--;
                    seconds = 59;
                }
                else {

                    seconds--;
                }

                const timerElement =
                    document.getElementById(
                        "timer"
                    );

                if (timerElement) {

                    timerElement.innerText =
                        `${minutes}:${seconds
                            .toString()
                            .padStart(2, '0')}`;
                }

            }, 1000);
    }
    catch (error) {

        console.error(error);
    }
}

function animateCounter(id, target) {

    const element =
        document.getElementById(id);

    if (!element)
        return;

    let count = 0;

    const increment =
        Math.ceil(target / 50);

    const interval =
        setInterval(() => {

            count += increment;

            if (count >= target) {

                count = target;

                clearInterval(interval);
            }

            element.innerText = count;

        }, 20);
}
