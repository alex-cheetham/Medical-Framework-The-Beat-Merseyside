fx_version 'cerulean'
game 'gta5'

author 'alex-cheetham'
description 'Medical Framework for The Beat: Merseyside'
version '1.0.0'

-- Client scripts
client_scripts {
    'client/main.lua',
}

-- Server scripts
server_scripts {
    'server/main.lua',
}

-- Shared scripts
shared_scripts {
    'shared/config.lua',
}

-- UI files
ui_page 'client/injury_ui/index.html'

files {
    'client/injury_ui/index.html',
    'client/injury_ui/style.css',
    'client/injury_ui/script.js'
}