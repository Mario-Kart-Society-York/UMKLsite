import { setupDB, isDBLoaded, runSQL } from './database.js';

const teamBoxFormatHTML = `
    <button href="#" class="{{className}} teamBox">
        <div class="positionBox">
            <div class="team-position">{{position}}</div>
            <div class="team-points">{{points}} PTS</div>
        </div>
        <hr>
        <div class="{{className}} team">
            <span>{{teamName}}</span>
            <img onload="this.style.opacity=1" src="{{logoSrc}}" alt="{{teamName}} team logo" class="team-logo">
        </div>
        <hr>
        <div class="Institution">{{institution}}</div>
    </button>
`;

const JSTeamBox = document.getElementById("JSTeamBox")
const styleSheet = document.createElement("style");

function generateTeamBox(team) {
    team.logo_src = `assets/team_emblems/${team.team_name.toUpperCase()}.png`
    team.class_name = team.team_name.replace(/\s+/g, '')

    console.log(team.team_color)

    let teamBoxStyle="button.teamBox.{{className}}:hover,button.teamBox.{{className}}:focus{border: 0px solid {{teamColor}};outline: 4px solid {{teamColor}};}.team.{{className}}{border-left: 8px solid {{teamColor}};}"
    .replaceAll("{{className}}", team.class_name)
    .replaceAll("{{teamColor}}", team.team_color)

    styleSheet.innerText += teamBoxStyle;

    let tempTeamBox = teamBoxFormatHTML
        .replace("{{position}}", team.team_id) // TODO: placeholder
        .replace("{{points}}", team.team_id) // TODO: placeholder
        .replaceAll("{{teamName}}", team.team_name)
        .replace("{{institution}}", team.team_full_name)
        .replaceAll("{{className}}", team.class_name)
        .replace("{{logoSrc}}", team.logo_src);

    JSTeamBox.innerHTML += tempTeamBox;
}

function generateTeamBoxes(teamData) {
    JSTeamBox.innerHTML = ""
    console.info("Generating teamdata boxes")
    teamData.forEach(team => {
        generateTeamBox(team)
    });
    document.head.appendChild(styleSheet);
    console.info("Done teamdata boxes")
}

document.addEventListener("DOMContentLoaded", () => {
    waitForDBToInit()
});

async function waitForDBToInit() {
    let dbLoaded = await isDBLoaded();
    console.log(dbLoaded ? "Database loaded" : "Database is loading...");
    if (!dbLoaded) {
        setTimeout(waitForDBToInit, 100); // Check again after 1 second
    } else {
        dbDoneLoading()
    }
}

async function dbDoneLoading() {
    let data = await runSQL("SELECT * FROM TEAM")
    generateTeamBoxes(data)
}