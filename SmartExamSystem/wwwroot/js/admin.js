const API_URL = "https://localhost:7121/api";
// ================= ADMIN CHECK =================

window.onload = function () {

    const role = localStorage.getItem("role");

    if (role !== "Admin") {
        alert("Access Denied");
        window.location.href = "login.html";
        return;
    }

    loadExams();
};

// ================= SECTION NAVIGATION =================

function showSection(id) {

    document.querySelectorAll(".hidden-section")
        .forEach(section => {
            section.style.display = "none";
        });

    document.getElementById(id).style.display = "block";
}

// ================= CREATE EXAM =================

async function createExam() {

    const token = localStorage.getItem("token");

    try {

        const response = await fetch(`${API_URL}/Exam`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                title: document.getElementById("title").value,
                description: document.getElementById("description").value,
                duration: parseInt(document.getElementById("duration").value)
            })
        });

        const result = await response.text();

        alert(result);

        document.getElementById("title").value = "";
        document.getElementById("description").value = "";
        document.getElementById("duration").value = "";

        loadExams();
        showSection("dashboard");

    } catch (error) {

        console.error(error);
        alert("Failed To Create Exam");
    }
}

// ================= ADD QUESTION =================

async function addQuestion() {

    const token = localStorage.getItem("token");

    try {

        const response = await fetch(`${API_URL}/Question/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                questionText: document.getElementById("questionText").value,
                optionA: document.getElementById("optionA").value,
                optionB: document.getElementById("optionB").value,
                optionC: document.getElementById("optionC").value,
                optionD: document.getElementById("optionD").value,
                correctAnswer: document.getElementById("correctAnswer").value,
                examId: parseInt(document.getElementById("examId").value)
            })
        });

        const result = await response.text();

        alert(result);

        document.getElementById("questionText").value = "";
        document.getElementById("optionA").value = "";
        document.getElementById("optionB").value = "";
        document.getElementById("optionC").value = "";
        document.getElementById("optionD").value = "";
        document.getElementById("correctAnswer").value = "";
        document.getElementById("examId").value = "";

    } catch (error) {

        console.error(error);
        alert("Failed To Add Question");
    }
}

// ================= LOAD EXAMS =================

async function loadExams() {

    try {

        const response = await fetch(`${API_URL}/Exam`);

        const exams = await response.json();

        document.getElementById("examCount").innerText = exams.length;

        let html = "";

        exams.forEach(exam => {

            html += `
            <div class="card mb-3 p-3">
                <h4>${exam.title}</h4>
                <p>${exam.description}</p>
                <p><strong>Duration:</strong> ${exam.duration} Minutes</p>
                <button class="btn btn-danger"
                    onclick="deleteExam(${exam.id})">
                    Delete
                </button>
            </div>
            `;
        });

        document.getElementById("examList").innerHTML = html;

    } catch (error) {

        console.error(error);
    }
}

// ================= DELETE EXAM =================

async function deleteExam(id) {

    const token = localStorage.getItem("token");

    if (!confirm("Delete this exam permanently?"))
        return;

    try {

        const response = await fetch(`${API_URL}/Exam/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        alert(await response.text());

        loadExams();

    } catch (error) {

        console.error(error);
        alert("Delete Failed");
    }
}

// ================= LOGOUT =================

function logout() {

    localStorage.clear();

    window.location.href = "login.html";
}

// ================= IMPORT EXCEL =================

async function uploadExcel() {


    const token = localStorage.getItem("token");

    const file = document.getElementById("excelFile").files[0];

    if (!file) {
        alert("Please select an Excel file");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/Question/import`, {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token
        },
        body: formData
    });

    alert(await response.text());
}