/*
    A script that gets the team colors from the database and displays them on the page,
    this is used on the team creation guidelines page to show the current team colors.
*/

import { isDBLoaded, runSQL } from './database.js';

const currentTeamColors = document.getElementById("currentTeamColors");
let startTime;

document.addEventListener("DOMContentLoaded", async () => {
    startTime = performance.now();
    await waitForDBToInit();
    await loadTeamColors();
});

async function waitForDBToInit() {
    while (!(await isDBLoaded())) {
        console.debug(`%cgetteamcolors.js %c> %cDatabase is loading...`, "color:#fc52ff", "color:#fff", "color:#fda6ff");
        await new Promise(resolve => setTimeout(resolve, 20));
    }
    console.debug(`%cgetteamcolors.js %c> %cDatabase loaded`, "color:#fc52ff", "color:#fff", "color:#fda6ff");
}

async function loadTeamColors() {
    console.debug(`%cgetteamcolors.js %c> %cGetting team colors...`, "color:#fc52ff", "color:#fff", "color:#fda6ff");
    const teamColors = await runSQL("SELECT team_name, team_color FROM team");

    teamColors.forEach(({ team_name: name, team_color: color }) => {
        const colorDiv = document.createElement("div");
        colorDiv.className = "color-box";
        colorDiv.style.backgroundColor = color;
        colorDiv.title = name;
        colorDiv.style.cursor = "pointer";
        colorDiv.addEventListener("click", () => {
            document.dispatchEvent(new CustomEvent('changeDiscordRoleColor', { detail: { color } }));
        });
        currentTeamColors.appendChild(colorDiv);
    });

    console.debug(`%cgetteamcolors.js %c> %cGenerated team colors in ${(performance.now() - startTime).toFixed(2)}ms`, "color:#fc52ff", "color:#fff", "color:#fda6ff");
}
