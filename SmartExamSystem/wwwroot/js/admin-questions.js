const API_URL =
    window.location.hostname === "localhost"
        ? "https://localhost:7121/api"
        : "https://smartexamsystem-v1-1.onrender.com/api";

let allQuestions = [];

async function loadQuestions() {

    try {

        const response =
            await fetch(`${API_URL}/Question`);

        console.log("Status:", response.status);

        allQuestions =
            await response.json();

        console.log(allQuestions);

        renderQuestions(allQuestions);

    }
    catch (err) {
        console.error(err);
    }
}

function renderQuestions(questions) {

    const table =
        document.getElementById("questionTable");

    table.innerHTML = "";

    questions.forEach(q => {

        table.innerHTML += `
        <tr>
            <td>${q.id}</td>
            <td>${q.questionText}</td>
            <td>${q.correctAnswer}</td>
            <td>${q.examId}</td>
            <td>
                <button class="btn btn-danger btn-sm"
                    onclick="deleteQuestion(${q.id})">
                    Delete
                </button>
            </td>
        </tr>`;
    });
}

async function deleteQuestion(id) {

    if (!confirm("Delete this question?"))
        return;

    const token = localStorage.getItem("token");

    console.log("TOKEN:", token);

    const response =
        await fetch(`${API_URL}/Question/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

    const result =
        await response.text();

    alert(result);

    loadQuestions();
}

document.getElementById("searchBox")
    .addEventListener("keyup", function () {

        const value =
            this.value.toLowerCase();

        const filtered =
            allQuestions.filter(x =>
                x.questionText.toLowerCase().includes(value));

        renderQuestions(filtered);
    });

loadQuestions();