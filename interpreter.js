const fs = require('fs');
const path = require('path');

function isSkippable(str) {
    str = str.trim() ?? ' ';
    return str == '\t' || str == ' ';
}

function isInt(str) {
    str = str.trim() ?? ' ';
    return str.toLowerCase() == str.toUpperCase();
}

function remove(environment, variable) {
    delete environment[variable];
}

function isString(argument) {
    return (argument.startsWith("'") && argument.endsWith("'") || argument.startsWith('"') && argument.endsWith('"'));
}


function extractContent(argument) {
    return argument.slice(1, -1).trim();
}

let environment = {};
let functions = {};

function interpreter(filePath) {
    const code = fs.readFileSync(filePath, 'utf-8')
    // Teile den Code in einzelne Zeilen auf
    let lines = code.split('\n');

    // Gehe jede Zeile des Codes durch
    lines.forEach(line => {
        if (line === '') return;

        let commandEndIndex = line.indexOf(' ');
        let command = (commandEndIndex === -1) ? line : line.slice(0, commandEndIndex);
        let args = (commandEndIndex === -1) ? [] : [line.slice(commandEndIndex + 1)];

        // Überprüfe den Befehl und führe entsprechende Aktionen aus
        if (isSkippable(command)) {
            return;
        } else if (command == 'log') {
            if (isString(extractContent(args[0]))) {
                console.log(extractContent(extractContent(args[0])));
            } else if (isInt(extractContent(args[0]))) {
                console.log(eval(extractContent(args[0])));
            } else {
                console.log(environment[extractContent(args[0])]);
            }
        } else if (command == 'cnv') {
            const variable = args[0];
            const value = args[2];
            if (isString(value)) {
                environment[variable.trim()] = extractContent(value.trim());
            } else {
                environment[variable.trim()] = eval(value);
            }
        } else if (command == 'rv') {
            const variable = extractContent(args[0]);
            remove(environment, variable);
        } else if (command == 'rf') {
            const functionn = extractContent(args[0]);
            remove(functions, functionn);
        } else if (command == '@import') {
            if (isString(extractContent(args[0]))) {
                if (extractContent(args[0]) == 'XS') {
                    interpreter('./XS/main.xs');
                } else {
                    if (extractContent(args[0]).startsWith('https://') || extractContent(args[0]).startsWith('http://')) {
                        interpreter(fs.readFileSync(extractContent(extractContent(args[0])), 'utf-8'));
                    } else {
                        let url = path.resolve(path.dirname(filePath), extractContent(extractContent(args[0])));
                        console.log('Importing');
                        interpreter(url);
                        console.log('Importing Finished');
                    }
                }
            } else {
                if (extractContent(extractContent(args[0])) == 'XS') {
                    interpreter('./XS/main.xs');
                } else {
                    if (extractContent(extractContent(args[0])).startsWith('https://') ||
                        extractContent(extractContent(args[0])).startsWith('http://')) {
                        interpreter(extractContent(args[0]));
                    } else {
                        let url = path.resolve(path.dirname(filePath), extractContent(args[0]));
                        console.log('Importing');
                        interpreter(url);
                        console.log('Importing Finished');
                    }
                }
            }
        } else if (command === 'fnc') {
            // Wenn der Befehl "fnc" ist
            const functionName = args[0];
            const parameterList = extractContent(args.slice(1, args.indexOf('{')).join(' '));
            const functionBodyStartIndex = lines.indexOf(line) + 1;
            let functionBodyEndIndex = functionBodyStartIndex;
            let openBrackets = 0;
            while (functionBodyEndIndex < lines.length) {
                let nextLine = lines[functionBodyEndIndex].trim();
                if (nextLine.includes('{')) {
                    openBrackets++;
                }
                if (nextLine.includes('}')) {
                    openBrackets--;
                }
                if (openBrackets === 0) {
                    break;
                }
                functionBodyEndIndex++;
            }
            const functionBody = lines.slice(functionBodyStartIndex, functionBodyEndIndex).join('\n').trim();
            functions[functionName] = {
                parameters: parameterList.split(',').map(param => param.trim()),
                body: functionBody
            };
        } else if (functions.hasOwnProperty(command)) {
            // Wenn der Befehl eine Funktion ist
            const { parameters, body } = functions[command];
            const functionArguments = extractContent(args[0]);
            const functionEnvironment = {};
            parameters.forEach((param, index) => {
                functionEnvironment[param] = functionArguments[index];
            });
            interpreter(body);
        }
        // else if (command == 'cncv') {
        //     const variable = args[0];
        //     const value = args[2];
        //     Object.defineProperty(environment, variable, {
        //         value: value,
        //         writable: false
        //     });
        // }
    });

    console.log(environment);
    console.log(functions);
}

interpreter('test/test.xs');
