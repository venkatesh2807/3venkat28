const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// Helper to generate a random array of given size
function randomArray(size) {
    return Array.from({ length: size }, () => Math.floor(Math.random() * 10000));
}

// Brute force method to find max and min
function findMaxMinBruteForce(arr) {
    let max = arr[0];
    let min = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) max = arr[i];
        if (arr[i] < min) min = arr[i];
    }
    return { max, min };
}

// Divide-and-conquer method to find max and min
function findMaxMinDivideAndConquer(arr, low, high) {
    if (low === high) {
        return { max: arr[low], min: arr[low] };
    }
    if (high === low + 1) {
        return {
            max: Math.max(arr[low], arr[high]),
            min: Math.min(arr[low], arr[high]),
        };
    }
    const mid = Math.floor((low + high) / 2);
    const left = findMaxMinDivideAndConquer(arr, low, mid);
    const right = findMaxMinDivideAndConquer(arr, mid + 1, high);
    return {
        max: Math.max(left.max, right.max),
        min: Math.min(left.min, right.min),
    };
}

app.post("/compare", (req, res) => {
    const { sizes } = req.body;
    const results = [];

    sizes.forEach(size => {
        const arr = randomArray(size);

        // Brute force
        const startBrute = Date.now();
        const bruteResult = findMaxMinBruteForce(arr);
        const bruteTime = Date.now() - startBrute;

        // Divide and conquer
        const startDivide = Date.now();
        const divideResult = findMaxMinDivideAndConquer(arr, 0, arr.length - 1);
        const divideTime = Date.now() - startDivide;

        results.push({
            size,
            bruteForce: { ...bruteResult, time: bruteTime, complexity: "O(n)" },
            divideAndConquer: { ...divideResult, time: divideTime, complexity: "O(n)" },
        });
    });

    res.json({ results });
});

// const PORT = 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

module.exports = app;
