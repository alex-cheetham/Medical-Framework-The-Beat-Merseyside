
// Clear UI on tablet close or reset
function clearPatientDisplay() {
    const patientInfo = document.querySelector(".patient-info");
    const injuryInfo = document.querySelector(".injury-info");
    const vitals = document.querySelector("#defib .defib-vitals");

    if (patientInfo) {
        patientInfo.innerHTML = `<em>No patient selected.</em>`;
    }
    if (injuryInfo) {
        injuryInfo.innerHTML = `<strong>Injuries:</strong><br /><em>None</em>`;
    }
    if (vitals) {
        vitals.innerHTML = `
            <p><strong>Heart Rate:</strong> <em>—</em></p>
            <p><strong>Blood Pressure:</strong> <em>—</em></p>
            <p><strong>SPO2:</strong> <em>—</em></p>
            <p><strong>Resp Rate:</strong> <em>—</em></p>
            <p><strong>Heart Rhythm:</strong> <em>—</em></p>
        `;
    }
}

// Handle tablet open and updates
window.addEventListener("message", function(event) {
    const data = event.data;

    if (data.type === "openTablet") {
        document.getElementById("nui-wrapper").style.display = "block";
        document.getElementById("login-screen").style.display = "block";
        initTreatmentHooks();
    }

    if (data.action === "updateInjuries") {
        const injurySection = document.querySelector(".injury-info");
        if (injurySection) {
            const list = data.injuries || [];
            injurySection.innerHTML = "<strong>Injuries:</strong><br>" + list.join("<br>");
        }
    }

    if (data.action === "updateVitals") {
        const vitals = data.vitals || {};
        document.querySelector("#defib .defib-vitals").innerHTML = `
            <p><strong>Heart Rate:</strong> ${vitals.heartRate || 'N/A'} BPM</p>
            <p><strong>Blood Pressure:</strong> ${vitals.bloodPressure || 'N/A'}</p>
            <p><strong>SPO2:</strong> ${vitals.spo2 || 'N/A'}%</p>
            <p><strong>Resp Rate:</strong> ${vitals.respRate || 'N/A'}</p>
            <p><strong>Heart Rhythm:</strong> ${vitals.rhythm || 'N/A'}</p>
        `;
    }
});

function openPatientMenu() {
    fetch(`https://${GetParentResourceName()}/getPlayers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    })
    .then(res => res.json())
    .then(data => {
        const list = data.players || [];
        const container = document.getElementById("patient-list");
        if (!container) return console.error("Missing #patient-list element.");

        container.innerHTML = "";

        if (list.length === 0) {
            container.innerHTML = "<div>No active players found.</div>";
        }

        list.forEach(player => {
            const btn = document.createElement("button");
            btn.className = "patient-button";
            btn.innerText = `ID: ${player.id} - ${player.name}`;
            btn.onclick = () => {
                const status =
                    player.health <= 0 ? "Unconscious" :
                    player.health <= 30 ? "Critical" : "Stable";

                const patientInfo = document.querySelector(".patient-info");
                if (patientInfo) {
                    patientInfo.innerHTML = `Name: ${player.name}<br />
ID: ${player.id}<br />
Status: ${status}`;
                }

                fetch(`https://${GetParentResourceName()}/selectPlayer`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: player.id })
                })
                .then(res => res.json())
                .then(response => {
                    const injuryList = response.injuries || [];
                    const injurySection = document.querySelector(".injury-info");
                    if (injurySection) {
                        injurySection.innerHTML = "<strong>Injuries:</strong><br>" + injuryList.join("<br>");
                    }
                });

                document.getElementById("patient-menu").style.display = "none";
            };
            container.appendChild(btn);
        });

        document.getElementById("patient-menu").style.display = "block";
    });
}

function openTab(tabId) {
    const tabs = document.querySelectorAll(".tab-content");
    tabs.forEach(tab => tab.style.display = "none");

    const active = document.getElementById(tabId);
    if (active) {
        active.style.display = "block";

        if (tabId === "defib") {
            const shockBtn = document.getElementById("shock-button");
            if (shockBtn && !shockBtn.dataset.hooked) {
                shockBtn.addEventListener("click", () => {
                    fetch(`https://${GetParentResourceName()}/shockPlayer`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({})
                    })
                    .then(res => res.json())
                    .then(data => {
                        alert(data.message);
                    });
                });
                shockBtn.dataset.hooked = "true";
            }
        }
    }
}

function addTestInjury() {
    fetch(`https://${GetParentResourceName()}/applyTestInjury`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    });
}

function applyTreatment(category, name) {
    fetch(`https://${GetParentResourceName()}/applyTreatment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: category, name: name })
    });
}

function initTreatmentHooks() {
    document.querySelectorAll(".med-button").forEach(btn => {
        btn.onclick = () => applyTreatment("Medication", btn.innerText.trim());
    });
    document.querySelectorAll(".bandage-button").forEach(btn => {
        btn.onclick = () => applyTreatment("Bandage", btn.innerText.trim());
    });
    document.querySelectorAll(".infusion-button").forEach(btn => {
        btn.onclick = () => applyTreatment("Infusion", btn.innerText.trim());
    });
}

document.getElementById("login-button").addEventListener("click", () => {
    document.getElementById("login-screen").style.display = "none";
});
