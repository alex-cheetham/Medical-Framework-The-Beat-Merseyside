-- Client-side script for the Medical Framework

local playerInjuries = {}

-- Function to apply an injury
RegisterNetEvent('medical:applyInjury')
AddEventHandler('medical:applyInjury', function(part, type)
    if not playerInjuries[part] then
        playerInjuries[part] = {}
    end
    table.insert(playerInjuries[part], type)
    SendNUIMessage({
        action = "updateInjuries",
        injuries = playerInjuries
    })
end)

-- Function to display UI
RegisterCommand('showinjuries', function()
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = "openUI",
        injuries = playerInjuries
    })
end)

-- Close UI
RegisterNUICallback('closeUI', function()
    SetNuiFocus(false, false)
end)
