const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");

const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const validator = require("node-email-validation");
const clear = require("clear");
const chalk = require("chalk");
const figlet = require("figlet");
const isValidPhoneNumber = require("libphonenumber-js/core");
const data = require("./lib/metadata.custom.json");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const roles = require('./lib/role.json');
const render = require("./src/page-template.js");



// TODO: Write Code to gather information about the development team members, and render the HTML file.

/*-- Global Variables --*/
const employees = []; 
let count = 0;

const counter = () => {
    //count = startNumber;
    count++
    return count
}

const setConsole = () => {
    clear();
    console.log(chalk.yellowBright(figlet.textSync('Team Profile Generator', {horizontalLayout: "full"})));
}

const verifyOfficeNumber = officeNumber => {
    if (isValidPhoneNumber( officeNumber , "GB", data)){
        return true;
    }
    return 'Invalid Phone Number';
}

const verifyGitHub = async github => {
    await axios.get(`https://api.github.com/users/${github}`)
          .catch(function (error) {
            if (error.response.data.message === 'Not Found'){
            //console.log("Not Found")
            return 'Invalid github';
            }
            //console.log("Oukka user")
            return true;
            })
}

    
const verifyEmail = email => {
    if (!validator.is_email_valid(email)) {
        return 'Invalid email';
    }
    return true;
};

/*-- Generate HMTL document and quit --*/
const generateHTML = (fileName, data) => {
    const text = render(data);

    if (!fs.existsSync(OUTPUT_DIR))
    {
        fs.mkdirSync(OUTPUT_DIR)
    }

    fs.writeFile(fileName, text, (err) =>
        err ? console.error(err) : console.log(`\n The generated page can be found at ${outputPath}`)
    );
};

/*-- function to create another employee or create the HTML and quit --*/
const anotherEmployeeOrCreateHTML = async() => {

    const anotherEmployee = await inquirer.prompt([
        {
          type: "confirm",
          message: `Do you want to add another Employee or create the document?:`,
          name: "again",
        },
      ]);
    if(anotherEmployee.again) {
        setConsole();
        getRole();
    } else {
        generateHTML(outputPath, employees)
    }
};

/*-- function create new instance and add to employees array --*/
const generateEmployee = (employee,response) => {

    switch (employee) {
      case "manager":
        const manager = new Manager(response);
        employees.push(manager);
        break;
      case "engineer":
        const engineer = new Engineer(response);
        employees.push(engineer);
        break;
      case "intern":
        const intern = new Intern(response);
        employees.push(intern);
        break;
      default:
        break;
    }
    anotherEmployeeOrCreateHTML();
}


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
    getUserInput(getRole.role.toLowerCase());
}

const getUserInput = employee => {

    //question array
    const Qs = [
        {
            type: 'input',
            message: `What is the ${employee}'s Name? `,
            name: 'name',
        },
        {
            type: 'input',
            message: `What is their employee id? `,
            name: 'id',
            default: counter()
            //validate: (id) => {return checkUnique(id)}
        },
        {
            type: 'input',
            message: `What is their Email Address? `,
            name: 'email',
            validate: (email) => {return verifyEmail(email)}
        },
        {
            type: 'input',
            message: `What is their Office Number? `,
            name: 'officeNumber',
            when: () => {return employee === 'manager'},
            validate: (officeNumber) => {return verifyOfficeNumber(officeNumber)}
        },
        {
            type: 'input',
            message: `What is their Github username? `,
            name: 'github',
            when: () => {return employee === 'engineer'},
            //validate: (github) => {return verifyGitHub(github)}
        },
        {
            type: 'input',
            message: `What is their School Name? `,
            name: 'school',
            when: () => {return employee === 'intern'}
        },
    ];

    /*-- Call generateEmployee with params employee, response --*/
    inquirer.prompt(Qs).then((response) => {
        //console.log(employee, response)
        generateEmployee(employee,response)
    });
};


/*-- Initiate program --*/

const init = () => {
    setConsole();
    getRole();
      
}

init();
