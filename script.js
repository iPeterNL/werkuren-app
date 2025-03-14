document.addEventListener("DOMContentLoaded", () => {
    const weeksContainer = document.getElementById("weeksContainer");
    const addWeekBtn = document.getElementById("addWeek");
    const exportPDFBtn = document.getElementById("exportPDF");
    let weekCount = 0;

    function addWeek() {
        weekCount++;
        const weekDiv = document.createElement("div");
        weekDiv.className = "week";
        weekDiv.innerHTML = `
            <h2>Week <span class="weekNumber">${getISOWeekNumber()}</span></h2>
            <table>
                <thead>
                    <tr>
                        <th>Dag</th><th>Datum</th><th>Begintijd</th><th>Eindtijd</th><th>Pauze</th><th>Gewerkte uren</th>
                    </tr>
                </thead>
                <tbody>
                    ${generateWeekRows()}
                </tbody>
            </table>
            <p><strong>Totaal gewerkte uren: <span class="totalHours">0</span></strong></p>
            <button class="clearWeek">🧹 Invoer Wissen</button>
            ${weekCount > 1 ? '<button class="removeWeek">❌ Verwijder Week</button>' : ''}
        `;

        weeksContainer.appendChild(weekDiv);
        setupEventListeners(weekDiv);
    }

    function generateWeekRows() {
        const days = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag"];
        return days.map((day, index) => `
            <tr>
                <td>${day}</td>
                <td><input type="date" class="date" ${index === 0 ? '' : 'disabled'}></td>
                <td><input type="time" class="startTime"></td>
                <td><input type="time" class="endTime"></td>
                <td>
                    <select class="break">
                        <option value="0">Nee</option>
                        <option value="30">Ja</option>
                    </select>
                </td>
                <td class="hours">0</td>
            </tr>
        `).join('');
    }

    function setupEventListeners(weekDiv) {
        const dateInputs = weekDiv.querySelectorAll(".date");
        dateInputs[0].addEventListener("change", function () {
            const startDate = new Date(this.value);
            if (isNaN(startDate)) {
                alert("Kies een maandag als startdatum!");
                return;
            }
            for (let i = 1; i < dateInputs.length; i++) {
                let nextDate = new Date(startDate);
                nextDate.setDate(startDate.getDate() + i);
                dateInputs[i].value = nextDate.toISOString().split("T")[0];
            }
        });

        weekDiv.querySelector(".clearWeek").addEventListener("click", () => {
            weekDiv.querySelectorAll("input, select").forEach(el => el.value = "");
        });

        const removeBtn = weekDiv.querySelector(".removeWeek");
        if (removeBtn) {
            removeBtn.addEventListener("click", () => {
                weekDiv.remove();
            });
        }

        weekDiv.querySelectorAll(".startTime, .endTime, .break").forEach(el => {
            el.addEventListener("input", updateWorkedHours);
        });
    }

    function updateWorkedHours() {
        const row = this.closest("tr");
        const startTime = row.querySelector(".startTime").value;
        const endTime = row.querySelector(".endTime").value;
        const breakTime = parseInt(row.querySelector(".break").value);

        if (startTime && endTime) {
            let workedHours = (new Date(`1970-01-01T${endTime}`) - new Date(`1970-01-01T${startTime}`)) / 3600000;
            workedHours = Math.max(0, workedHours - (breakTime / 60));
            row.querySelector(".hours").textContent = workedHours.toFixed(2);
        }
    }

    function getISOWeekNumber() {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 4);
        const day = Math.floor((now - start) / (24 * 60 * 60 * 1000));
        return Math.ceil((day + start.getDay() + 1) / 7);
    }

    addWeekBtn.addEventListener("click", addWeek);
    exportPDFBtn.addEventListener("click", () => alert("PDF-export volgt nog!"));
    addWeek();
});
