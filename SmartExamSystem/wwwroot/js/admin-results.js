const API_URL =
    window.location.hostname === "localhost"
        ? "https://localhost:7121/api"
        : "https://smartexamsystem-v1-1.onrender.com/api";

async function loadResults() {

    try {

        const token =
            localStorage.getItem("token");

        const response =
            await fetch(`${API_URL}/Result/all`, {
                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }
            });

        if (!response.ok) {

            alert("Failed to load results");

            return;
        }

        const results =
            await response.json();

        const table =
            document.getElementById("resultTable");

        table.innerHTML = "";

        results.forEach(r => {

            table.innerHTML += `
            <tr>
                <td>${r.id}</td>
                <td>${r.userId}</td>
                <td>${r.examId}</td>
                <td>${r.score}</td>
                <td>${r.status}</td>
                <td>${r.submittedAt}</td>
            </tr>`;
        });

    }
    catch (err) {

        console.error(err);

        alert("Error loading results");
    }
}

loadResults();