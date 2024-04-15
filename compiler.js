const { lexer } = require("./lexer.js");
const fs = require("fs");

async function compiler(file) {
  const lexed = await lexer(fs.readFileSync(file, 'utf-8'));

  let tokens = [];

  let js = [];

  lexed.forEach((element) => {
    tokens.push(element.value);
  });

  tokens.forEach((token) => {
    if (token == "cnv") js.push("var");
    else if (token == "cncv") js.push("const");
    else if (token == "#") js.push(";");
    else if (token == "XS.log") js.push("XS.log");
    else if (token == "log") js.push("console.log");
    else if (token == "fnc") js.push("function");
    else if (token == "web") js.push("document");
    else if (token == "orIs") js.push("||");
    else if (token == "andIs") js.push("&&");
    else if (token == "when") js.push("if");
    else if (token == "else") js.push("else");
    else if (token == "isEqualTo") js.push("==");
    else if (token == "greaterThan") js.push(">");
    else if (token == "lessThan") js.push("<");
    else if (token == "goUp") js.push("++");
    else if (token == "goDown") js.push("--");
    else if (token == "oc") js.push("/*");
    else if (token == "cc") js.push("*/");
    else if (token == "xsStartWeb") js.push("import { XS } from 'https://cdn.jsdelivr.net/npm/xenith-script@latest/xs-start/main.js';");
    else if (token == "xsStart") js.push("const { XS } = require('https://cdn.jsdelivr.net/npm/xenith-script@latest/xs-start/main.js');");
    else js.push(token);
    // else if (token == "") js.push("");
  });

  js = js.join(" ");

  const splitedName = file.split('.');
  splitedName[splitedName.length - 1] = 'js';
  const jsFileName = splitedName.join('.');

  fs.writeFileSync(jsFileName, js);
  // console.log(js);
}

exports.compiler = compiler;