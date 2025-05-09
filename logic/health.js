// logic/health.js

export const injuryState = {
  health: 100,
  pulse: 80,
  bp: "120/80",
  o2: 98,
  injuries: []
};

export const injuryEffects = {
  "Small Cut": 5,
  "Deep Cut": 15,
  "Gunshot": 30,
  "Fracture": 20,
  "Burn": 10,
  "Unconscious": 0,
  "Bleeding": 10
};

/**
 * Applies an injury to a player.
 * @param {string} limb - The body part affected
 * @param {string} type - The injury type
 */
export function applyInjury(limb, type) {
  const damage = injuryEffects[type] || 0;
  injuryState.health = Math.max(0, injuryState.health - damage);
  injuryState.injuries.push({ limb, type });

  if (injuryState.health <= 0) {
    // Trigger an event for death state handling in client.lua or elsewhere
    if (typeof emit !== "undefined") {
      emit("medical:playerDied");
    } else {
      console.warn("Player has died (emit fallback).");
    }
  }
}

/**
 * Resets the injury state
 */
export function resetInjuries() {
  injuryState.health = 100;
  injuryState.injuries = [];
}

/**
 * Get a summary of current injuries
 */
export function getInjurySummary() {
  return injuryState.injuries.map(i => `${i.limb}: ${i.type}`).join(", ");
}

/**
 * Returns true if the player is considered critical
 */
export function isCritical() {
  return injuryState.health <= 30 || injuryState.injuries.some(i => i.type === "Bleeding");
}
