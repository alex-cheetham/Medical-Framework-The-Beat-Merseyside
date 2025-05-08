window.addEventListener('message', function(event) {
    const data = event.data;

    if (data.action === 'openUI') {
        const injuryList = document.getElementById('injury-list');
        injuryList.innerHTML = '';

        for (const [part, injuries] of Object.entries(data.injuries)) {
            const li = document.createElement('li');
            li.textContent = `${part}: ${injuries.join(', ')}`;
            injuryList.appendChild(li);
        }

        document.getElementById('injury-display').style.display = 'block';
    }

    if (data.action === 'updateInjuries') {
        // Update injuries logic
    }
});

document.getElementById('close-btn').addEventListener('click', function() {
    fetch(`https://${GetParentResourceName()}/closeUI`, {
        method: 'POST',
    });
    document.getElementById('injury-display').style.display = 'none';
});