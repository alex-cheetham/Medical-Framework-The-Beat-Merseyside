-- Server-side script for the Medical Framework

local playerInjuries = {}

-- Command to assign injuries
RegisterCommand('giveinjury', function(source, args, rawCommand)
    local target = tonumber(args[1])
    local part = args[2]
    local type = args[3]

    if target and part and type then
        TriggerClientEvent('medical:applyInjury', target, part, type)
        print(string.format("Injury applied: %s to %s - %s", GetPlayerName(target), part, type))
    else
        print("Usage: /giveinjury [playerID] [bodyPart] [injuryType]")
    end
end)

-- Auto-respawn system
Citizen.CreateThread(function()
    while true do
        Citizen.Wait(1000) -- Check every second
        for playerId, injuries in pairs(playerInjuries) do
            -- Logic for auto-respawn
        end
    end
end)