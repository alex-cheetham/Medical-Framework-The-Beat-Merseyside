RegisterNetEvent("medical:updateHealth", function(health)
    SendNUIMessage({
        type = "updateHealth",
        health = health
    })
end)

RegisterNetEvent("medical:death", function(deadPlayer)
    print("Player " .. deadPlayer .. " has died.")
end)

-- Optional: open tablet UI manually (for testing)
RegisterCommand("opentablet", function()
    SendNUIMessage({
        type = "openTablet"
    })
    SetNuiFocus(true, true)
end, false)

RegisterNUICallback("closeTablet", function(_, cb)
    SetNuiFocus(false, false)
    cb({})
end)

RegisterNetEvent("medical:updateHealth", function(health)
    -- Check if the health is valid (should be between 0 and 100 ideally)
    if health >= 0 and health <= 100 then
        -- Send updated health to the NUI for updating the health bar
        SendNUIMessage({
            type = "updateHealth",
            health = health
        })
    end
end)

-- Optional: You can use this command for testing directly on the client
RegisterCommand("applyDamage", function()
    TriggerServerEvent("applyDamage", 10)  -- Apply 10 damage
end, false)
