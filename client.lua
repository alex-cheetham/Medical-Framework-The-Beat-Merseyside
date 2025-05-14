
local playerInjuries = {}
local vitalsData = {}
local tickRate = 5000 -- update every 5 seconds

-- Simulate vitals changes over time
function calculateVitals(playerId)
    local injuryCount = playerInjuries[playerId] and #playerInjuries[playerId] or 0
    local health = GetEntityHealth(GetPlayerPed(-1))

    if not vitalsData[playerId] then
        vitalsData[playerId] = {
            heartRate = 75,
            bloodPressure = "120/80",
            spo2 = 98,
            respRate = 16,
            rhythm = "Normal"
        }
    end

    local vitals = vitalsData[playerId]

    if health <= 0 then
        vitals.heartRate = 0
        vitals.bloodPressure = "0/0"
        vitals.spo2 = 0
        vitals.respRate = 0
        vitals.rhythm = "Flatline"
    elseif injuryCount > 0 then
        vitals.heartRate = math.max(vitals.heartRate - 1, 30)
        vitals.respRate = math.max(vitals.respRate - 1, 8)
        vitals.spo2 = math.max(vitals.spo2 - 1, 75)
        vitals.bloodPressure = "100/65"
        vitals.rhythm = "Irregular"
    else
        vitals.heartRate = math.min(vitals.heartRate + 1, 75)
        vitals.respRate = math.min(vitals.respRate + 1, 16)
        vitals.spo2 = math.min(vitals.spo2 + 1, 98)
        vitals.bloodPressure = "120/80"
        vitals.rhythm = "Normal"
    end

    return vitals
end

function sendVitalsToUI()
    local id = GetPlayerServerId(PlayerId())
    local vitals = calculateVitals(id)
    SendNUIMessage({ action = "updateVitals", vitals = vitals })
end

CreateThread(function()
    while true do
        Wait(tickRate)
        sendVitalsToUI()
    end
end)

RegisterNetEvent("medical:applyInjury", function(playerId, limb, type)
    if not playerInjuries[playerId] then playerInjuries[playerId] = {} end
    table.insert(playerInjuries[playerId], { limb = limb, type = type })

    local injuries = {}
    for _, i in ipairs(playerInjuries[playerId]) do
        table.insert(injuries, i.limb .. ": " .. i.type)
    end

    SendNUIMessage({ action = "updateInjuries", injuries = injuries })
end)

RegisterNUICallback("applyTreatment", function(data, cb)
    local id = GetPlayerServerId(PlayerId())
    local category = data.category or ""
    local name = data.name or ""

    if not playerInjuries[id] or #playerInjuries[id] == 0 then
        cb({ success = false, message = "No injuries to treat." })
        return
    end

    -- Simulated treatment logic
    local treated = false
    if category == "Medication" and name:find("Paracetamol") then
        treated = true
    elseif category == "Bandage" and name:find("Gauze") then
        treated = true
    elseif category == "Infusion" and name:find("Saline") then
        treated = true
    else
        treated = true
    end

    if treated then
        table.remove(playerInjuries[id], 1)
        cb({ success = true, message = "Treatment applied." })
    else
        cb({ success = false, message = "Treatment had no effect." })
    end
end)

RegisterNUICallback("shockPlayer", function(_, cb)
    local id = GetPlayerServerId(PlayerId())
    local vitals = vitalsData[id]
    if vitals and vitals.heartRate == 0 then
        vitalsData[id] = {
            heartRate = 60,
            bloodPressure = "95/65",
            spo2 = 90,
            respRate = 14,
            rhythm = "Post-Shock Rhythm"
        }
        SendNUIMessage({ action = "updateVitals", vitals = vitalsData[id] })
        cb({ success = true, message = "Shock successful." })
    else
        cb({ success = false, message = "Shock not required." })
    end
end)

RegisterCommand("opentablet", function()
    SendNUIMessage({ type = "openTablet" })
    SetNuiFocus(true, true)
end)

RegisterNUICallback("applyTestInjury", function(_, cb)
    local id = GetPlayerServerId(PlayerId())
    local limbs = { "Left Arm", "Right Leg", "Torso", "Head" }
    local types = { "Gunshot", "Burn", "Fracture", "Laceration" }
    local limb = limbs[math.random(#limbs)]
    local typ = types[math.random(#types)]
    TriggerEvent("medical:applyInjury", id, limb, typ)
    cb({ success = true, message = "Test injury applied." })
end)

RegisterNUICallback("selectPlayer", function(data, cb)
    local id = tonumber(data.id)
    local injuries = {}
    if playerInjuries[id] then
        for _, i in ipairs(playerInjuries[id]) do
            table.insert(injuries, i.limb .. ": " .. i.type)
        end
    end
    cb({ injuries = injuries })
end)

RegisterNUICallback("getPlayers", function(_, cb)
    local players = {}
    for _, playerId in ipairs(GetActivePlayers()) do
        local ped = GetPlayerPed(playerId)
        local name = GetPlayerName(playerId)
        local health = GetEntityHealth(ped)
        table.insert(players, {
            id = GetPlayerServerId(playerId),
            name = name,
            health = health
        })
    end
    cb({ players = players })
end)
