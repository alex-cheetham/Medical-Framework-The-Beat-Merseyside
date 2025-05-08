-- Configuration for the Medical Framework

Config = {}

-- Injury types and their effects
Config.Injuries = {
    ["head"] = {"bleeding", "concussion", "trauma"},
    ["chest"] = {"fracture", "gunshot", "internal bleeding"},
    ["arms"] = {"fracture", "abrasions"},
    ["legs"] = {"fracture", "burns"},
}

-- Items for treatment
Config.Items = {
    "Bandage",
    "Tourniquet",
    "QuikClot",
    "IV Fluids",
    "Oxygen",
    "EpiPen"
}

-- Timer for auto-respawn
Config.RespawnTimer = 180 -- 3 minutes