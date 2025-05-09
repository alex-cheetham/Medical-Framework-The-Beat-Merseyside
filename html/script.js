const injuryState = {
  health: 100,
  pulse: 0,
  bp: "0/0",
  o2: 0,
  injuries: []
};

const defibState = {
  isCharged: false,
  chargeLevel: 0
};

function updateHealthBar(value) {
  const bar = document.getElementById("health-bar-fill");
  const hud = document.getElementById("health-hud");

  if (!bar || !hud) return;

  // Show the health bar when health changes
  hud.style.display = "block";
  bar.style.width = `${value}%`;

  if (value > 60) {
    bar.style.backgroundColor = "limegreen";
  } else if (value > 30) {
    bar.style.backgroundColor = "orange";
  } else {
    bar.style.backgroundColor = "red";
  }
}

function renderInjuries() {
  const container = document.querySelector(".injury-list");
  if (!container) return;

  container.innerHTML = "";
  injuryState.injuries.forEach(injury => {
    const div = document.createElement("div");
    div.className = "injury-item";
    div.textContent = `${injury.limb}: ${injury.type}`;
    container.appendChild(div);
  });
}

function renderVitals() {
  const vitalsContainer = document.querySelector(".vitals");
  if (!vitalsContainer) return;

  vitalsContainer.innerHTML = `
    <div class="vital-item">Health: ${injuryState.health}%</div>
    <div class="vital-item">Pulse: ${injuryState.pulse} BPM</div>
    <div class="vital-item">BP: ${injuryState.bp}</div>
    <div class="vital-item">O2: ${injuryState.o2}%</div>
  `;
}

function getHealthStatus() {
  if (injuryState.health <= 0) return "Deceased";
  if (injuryState.pulse < 40 || injuryState.o2 < 80) return "Critical";
  const bleeding = injuryState.injuries.find(i => i.type === "Bleeding");
  return bleeding ? "Unstable" : "Stable";
}

function renderPatientStatus() {
  const patientInfo = document.querySelector(".patient-info");
  if (!patientInfo) return;

  patientInfo.innerHTML = `
    Name: John Doe<br>
    ID: 10123<br>
    Status: ${getHealthStatus()}
  `;
}

function renderUI() {
  renderInjuries();
  renderVitals();
  renderPatientStatus();
}

function closeTablet() {
  document.getElementById("nui-wrapper").style.display = "none";
  fetch(`https://${GetParentResourceName()}/closeTablet`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  });
}

window.addEventListener("message", function(event) {
  if (event.data.type === "openTablet") {
    document.getElementById("login-screen").style.display = "flex";
  }

  if (event.data.type === "updateHealth") {
    injuryState.health = event.data.health;
    updateHealthBar(injuryState.health);
    renderVitals();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("login-button").addEventListener("click", () => {
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("nui-wrapper").style.display = "flex";
  });

  document.querySelectorAll(".action-button").forEach(button => {
    button.addEventListener("click", () => {
      const item = button.textContent;
      fetch(`https://${GetParentResourceName()}/useItem`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item })
      });
    });
  });

  document.querySelectorAll(".defib-button").forEach(button => {
    const label = button.textContent;
    if (label === "Charge") {
      button.addEventListener("click", openChargeModal);
    } else if (label === "Analyze") {
      fetch(`https://${GetParentResourceName()}/defibAction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: label })
      });
    }
  });

  const shockButton = document.getElementById("shock-button");
  if (shockButton) {
    shockButton.addEventListener("click", () => {
      if (!defibState.isCharged) {
        alert("Defib is not charged!");
        return;
      }

      fetch(`https://${GetParentResourceName()}/defibShock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ joules: defibState.chargeLevel })
      });

      defibState.isCharged = false;
      defibState.chargeLevel = 0;
      closeShockModal();
      triggerScreenFlicker();
    });
  }
});

// Add an event listener to close the tablet when Escape key is pressed
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && document.getElementById("nui-wrapper").style.display !== "none") {
    closeTablet();
  }
});

function openTab(tabName) {
  document.querySelectorAll(".tab-content").forEach(tab => {
    tab.style.display = "none";
  });
  document.getElementById(tabName).style.display = "block";
}

function openChargeModal() {
  document.getElementById("charge-modal").style.display = "flex";
}

function closeChargeModal() {
  document.getElementById("charge-modal").style.display = "none";
}

function openShockModal() {
  const modal = document.getElementById("shock-modal");
  const content = modal.querySelector(".modal-content");
  content.classList.add("pulse-once");
  modal.style.display = "flex";

  setTimeout(() => {
    content.classList.remove("pulse-once");
  }, 1000);
}

function closeShockModal() {
  document.getElementById("shock-modal").style.display = "none";
}

function confirmCharge() {
  const joules = parseInt(document.getElementById("charge-input").value);
  const progress = document.getElementById("charge-progress");
  const fill = document.getElementById("charge-fill");

  if (isNaN(joules) || joules < 1 || joules > 360) {
    alert("Please enter a valid number between 1 and 360.");
    return;
  }

  fill.style.width = "0%";
  progress.style.display = "block";

  setTimeout(() => {
    fill.style.width = "100%";
  }, 10);

  setTimeout(() => {
    defibState.chargeLevel = joules;
    defibState.isCharged = true;

    progress.style.display = "none";
    closeChargeModal();
    openShockModal();
  }, 3000);
}

function triggerScreenFlicker() {
  const overlay = document.getElementById("flicker-overlay");
  overlay.style.animation = "screen-flicker 0.3s ease-in-out";
  overlay.style.display = "block";

  setTimeout(() => {
    overlay.style.display = "none";
    overlay.style.animation = "none";
  }, 300);
}

// Patient Button Logic
function openPatientMenu() {
  // Simulate player selection
  setTimeout(() => {
    document.getElementById("patient-button-container").innerHTML = `
      <button class="tab-button" onclick="requestPatientDetails()">Request Patient Details</button>
    `;
  }, 500);
}

function requestPatientDetails() {
  alert("Request sent to patient for medical data.");
}
