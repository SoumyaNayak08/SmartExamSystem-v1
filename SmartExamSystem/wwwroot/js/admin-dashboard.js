const API_URL =
    window.location.hostname === "localhost"
        ? "https://localhost:7121/api"
        : "https://smartexamsystem-v1-1.onrender.com/api";

async function loadResults() {

    const response =
        await fetch(`${API_URL}/Result`);

    const results =
        await response.json();

    const table =
        document.getElementById("resultTable");

    table.innerHTML = "";

    results.forEach(r => {

        table.innerHTML += `
        <tr>
            <td>${r.userId}</td>
            <td>${r.examId}</td>
            <td>${r.score}</td>
            <td>${r.examDate}</td>
        </tr>`;
    });
}   

loadResults();