const API_URL =
    window.location.hostname === "localhost"
        ? "https://localhost:7121/api"
        : "https://smartexamsystem-v1-1.onrender.com/api";

async function loadExams() {

    const response =
        await fetch(`${API_URL}/Exam`);

    const exams =
        await response.json();

    const examList =
        document.getElementById("examList");

    examList.innerHTML = "";

    exams.forEach(exam => {

        examList.innerHTML += `
        <div class="col-md-4 mb-4">

            <div class="card-custom p-4">

                <h3>${exam.title}</h3>

                <p>${exam.description}</p>

                <p>
                    ⏱ Duration:
                    ${exam.duration} Minutes
                </p>

                <button
                    class="btn btn-primary"
                    onclick="startExam(${exam.id})">

                    Start Exam

                </button>

            </div>

        </div>`;
    });
}

function startExam(examId) {

    localStorage.setItem("examId", examId);

    window.location.href =
        "exam.html";
}

loadExams();