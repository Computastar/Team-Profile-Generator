const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./src/page-template.js");

const roles = require('./lib/role.json');

// TODO: Write Code to gather information about the development team members, and render the HTML file.

/*-- Global Variables --*/
const employee = [];

/* function to prompt for role or quit */
const getRole = async() => {

    const result = [];

    
    for (role of roles.roles)
    {
         result.push(role.role)
    }

    result.push("End Program")

    const getRole = await inquirer.prompt([
    {
        type: 'list',
        message: `What role would you like to add? `,
        name: 'role',
        choices: result
    },
]);

if (getRole.role === "End Program")
{
    return
}
//askAndCreate(getRole.role.toLowerCase());
}


/*-- Initiate program --*/

const init = () => {
    getRole();
}

init();
