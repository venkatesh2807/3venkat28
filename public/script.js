document.getElementById("sizeForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const sizes = document.getElementById("sizes").value.split(",").map(Number);

    if (sizes.some(isNaN)) {
        alert("Please enter valid numbers.");
        return;
    }

    // try {
    //     const response = await fetch("https://3venkat28.vercel.app/", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({ sizes }),
    //     });

    //     const { results } = await response.json();
    //     openChartModal(results);
    // } catch (error) {
    //     console.error("Error:", error);
    // }

    fetch("https://3venkat28.vercel.app/api", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ sizes }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(({ results }) => {
            openChartModal(results);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
});

function openChartModal(results) {
    const modal = document.getElementById("chartModal");
    const span = document.querySelector(".close");
    const complexitiesContainer = document.getElementById("complexities");
    complexitiesContainer.innerHTML = "";

    const sizes = [];
    const bruteTimes = [];
    const divideTimes = [];

    // Add complexities and max/min values
    results.forEach(result => {
        sizes.push(result.size);
        bruteTimes.push(result.bruteForce.time);
        divideTimes.push(result.divideAndConquer.time);

        const p = document.createElement("p");
        p.textContent = `Size ${result.size}: Brute Force (Max: ${result.bruteForce.max}, Min: ${result.bruteForce.min}, Time: ${result.bruteForce.time}ms, Complexity: ${result.bruteForce.complexity}), Divide and Conquer (Max: ${result.divideAndConquer.max}, Min: ${result.divideAndConquer.min}, Time: ${result.divideAndConquer.time}ms, Complexity: ${result.divideAndConquer.complexity})`;
        complexitiesContainer.appendChild(p);
    });

    // Render chart
    const ctx = document.getElementById("comparisonChart").getContext("2d");
    new Chart(ctx, {
        type: "line",
        data: {
            labels: sizes,
            datasets: [
                {
                    label: "With Divide and Conquer",
                    data: divideTimes,
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 2,
                    fill: false,
                },
                {
                    label: "Without Divide and Conquer",
                    data: bruteTimes,
                    borderColor: "rgba(255, 99, 132, 1)",
                    borderWidth: 2,
                    fill: false,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "top",
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Array Size",
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: "Execution Time (ms)",
                    },
                },
            },
        },
    });

    // Show modal
    modal.style.display = "block";

    // Close modal
    span.onclick = function () {
        modal.style.display = "none";
    };

    // Close modal when clicking outside of it
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
}
