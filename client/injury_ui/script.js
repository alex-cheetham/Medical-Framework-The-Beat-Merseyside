document.addEventListener('DOMContentLoaded', function () {
    // Get references to DOM elements
    const injuryDisplay = document.getElementById('injury-display');
    const modal = document.getElementById('player-modal');
    const closeButton = document.getElementById('close-btn');
    const modalCloseButton = document.getElementById('close-modal-btn');
    const patientButton = document.getElementById('select-patient-btn');

    // Log missing elements for debugging
    if (!injuryDisplay) console.error("Missing element: injury-display");
    if (!modal) console.error("Missing element: player-modal");
    if (!closeButton) console.error("Missing element: close-btn");
    if (!modalCloseButton) console.error("Missing element: close-modal-btn");
    if (!patientButton) console.error("Missing element: select-patient-btn");

    // Ensure all elements exist before adding event listeners
    if (!injuryDisplay || !modal || !closeButton || !modalCloseButton || !patientButton) {
        console.error("One or more required elements are missing in the DOM.");
        return;
    }

    // Function to close the menu
    function closeMenu() {
        if (injuryDisplay) injuryDisplay.style.display = 'none'; // Hide the injury display
        if (modal) modal.style.display = 'none'; // Hide the player selection modal
        document.body.style.backgroundColor = 'black'; // Ensure background stays black
    }

    // Add event listeners to buttons
    closeButton.addEventListener('click', closeMenu);
    modalCloseButton.addEventListener('click', closeMenu);
    patientButton.addEventListener('click', () => {
        if (modal) modal.style.display = 'flex'; // Show the modal
    });

    // Listen for the Escape key to close the menu
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            closeMenu();
        }
    });

    // Simulate fetching active players for the modal
    window.addEventListener('message', function (event) {
        const data = event.data;

        if (data.action === 'updatePlayers') {
            const playerList = document.getElementById('player-list');
            if (!playerList) {
                console.error("Player list element is missing.");
                return;
            }

            playerList.innerHTML = ''; // Clear existing list
            data.players.forEach(player => {
                const li = document.createElement('li');
                li.textContent = player.name;
                li.dataset.id = player.id;
                li.addEventListener('click', () => selectPlayer(player.id, player.name));
                playerList.appendChild(li);
            });
        }
    });

    function selectPlayer(id, name) {
        alert(`Selected Player: ${name}`);
        closeMenu(); // Close modal after selection
    }
});