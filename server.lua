 
local playerHealth = {}

RegisterNetEvent("medical:applyInjury", function(limb, type, damage)
    local src = source
    playerHealth[src] = (playerHealth[src] or 100) - damage

    if playerHealth[src] < 0 then playerHealth[src] = 0 end

    TriggerClientEvent("medical:updateHealth", src, playerHealth[src])

    if playerHealth[src] <= 0 then
        TriggerClientEvent("medical:death", -1, src)
    end
end)

RegisterCommand("reviveall", function()
    for src, _ in pairs(playerHealth) do
        playerHealth[src] = 100
        TriggerClientEvent("medical:updateHealth", src, 100)
    end
end, true)

RegisterCommand("applyDamage", function(source, args)
    local damageAmount = tonumber(args[1]) or 10  -- Default damage of 10 if not specified
    local ped = GetPlayerPed(source)  -- Get the player's ped
    local currentHealth = GetEntityHealth(ped)  -- Get the current health of the player

    -- Apply the damage
    local newHealth = currentHealth - damageAmount
    if newHealth < 0 then
        newHealth = 0  -- Ensure health doesn't go below 0
    end

    -- Set the new health on the player
    SetEntityHealth(ped, newHealth)

    -- Trigger client event to update the health UI with the new health value
    TriggerClientEvent("medical:updateHealth", source, newHealth)
end, false)
