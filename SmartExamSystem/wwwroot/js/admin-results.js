const API_URL =
    window.location.hostname === "localhost"
        ? "https://localhost:7121/api"
        : "https://smartexamsystem-v1-1.onrender.com/api";

async function loadResults() {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/Result/all`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const results = await response.json();

    const table = document.getElementById("resultsTable");

    table.innerHTML = "";

    results.forEach(r => {

        table.innerHTML += `
        <tr>
            <td>${r.studentName}</td>
            <td>${r.studentEmail}</td>
            <td>${r.examTitle}</td>
            <td>${r.score}</td>
            <td>${r.status}</td>
            <td>${new Date(r.submittedAt).toLocaleString()}</td>
        </tr>`;
    });
}

loadResults();