// cnv x = 45 + ( foo * bar )#

enum TokenType {
  Number,
  Indentifier,
  Equals,
  OpenParen,
  CloseParen,
  BinaryOperator,
  OpenBracket,
  CloseBracket,
  End,
  Dot,
  String,
  OpenSquareBracket,
  CloseSquareBracket,
  Comma,
  At,
  Colon,
}

enum Keywords {
  Cnv,
  Log,
  Cncv,
  Fnc,
  Web,
  Or,
  And,
  DoubleEqual,
  When,
  For,
  Greater,
  Less,
  GoUp,
  GoDown,
  Else,
  OpenComment,
  CloseComment,
}

const KEYWORDS: Record<string, Keywords> = {
  cnv: Keywords.Cnv,
  log: Keywords.Log,
  cncv: Keywords.Cncv,
  fnc: Keywords.Fnc,
  web: Keywords.Web,
  or: Keywords.Or,
  and: Keywords.And,
  is: Keywords.DoubleEqual,
  for: Keywords.For,
  greater: Keywords.Greater,
  less: Keywords.Less,
  goUp: Keywords.GoUp,
  goDown: Keywords.GoDown,
  when: Keywords.When,
  else: Keywords.Else,
  oc: Keywords.OpenComment,
  cc: Keywords.CloseComment,
};

interface Token {
  value: string;
  type: TokenType;
}

function token(value = "", type: TokenType) {
  return { value, type };
}

function isalpha(str: string) {
  return str.toUpperCase() != str.toLowerCase();
}

function isint(str: string) {
  const c = str.charCodeAt(0);
  const bounds = ["0".charCodeAt(0), "9".charCodeAt(0)];

  return c >= bounds[0] && c <= bounds[1];
}

function isskippable(str: string) {
  return str == " " || str == "\n" || str == "\t";
}

function tokenize(source: string): Token[] {
  const tokens = new Array<Token>();
  const src = source.split("");

  while (src.length > 0) {
    if (src[0] == "(") {
      tokens.push(token(src.shift(), TokenType.OpenParen));
    } else if (src[0] == ")") {
      tokens.push(token(src.shift(), TokenType.CloseParen));
    } else if (src[0] == ".") {
      tokens.push(token(src.shift(), TokenType.Dot));
    } else if (src[0] == "{") {
      tokens.push(token(src.shift(), TokenType.OpenBracket));
    } else if (src[0] == "}") {
      tokens.push(token(src.shift(), TokenType.CloseBracket));
    } else if (src[0] == "@") {
      tokens.push(token(src.shift(), TokenType.At));
    } else if (src[0] == ":") {
      tokens.push(token(src.shift(), TokenType.Colon));
    } else if (
      src[0] == "+" ||
      src[0] == "-" ||
      src[0] == "*" ||
      src[0] == "/"
    ) {
      tokens.push(token(src.shift(), TokenType.BinaryOperator));
    } else if (src[0] == "=") {
      tokens.push(token(src.shift(), TokenType.Equals));
    } else if (src[0] == "#") {
      tokens.push(token(src.shift(), TokenType.End));
    } else if (src[0] == "'") {
      tokens.push(token(src.shift(), TokenType.String));
    } else if (src[0] == "[") {
      tokens.push(token(src.shift(), TokenType.OpenSquareBracket));
    } else if (src[0] == "]") {
      tokens.push(token(src.shift(), TokenType.CloseSquareBracket));
    } else if (src[0] == ",") {
      tokens.push(token(src.shift(), TokenType.Comma));
    } else {
      // Handle MultiChar tokens
      if (isint(src[0])) {
        // Build number
        let num = "";
        while (src.length > 0 && isint(src[0])) {
          num += src.shift();
        }

        tokens.push(token(num, TokenType.Number));
      } else if (isalpha(src[0])) {
        // Build indentifier
        let ident = "";
        while (src.length > 0 && isalpha(src[0])) {
          ident += src.shift();
        }

        const reserved = KEYWORDS[ident];
        if (reserved == undefined) {
          tokens.push(token(ident, TokenType.Indentifier));
        } else {
          tokens.push(token(ident, reserved));
        }
      } else if (isskippable(src[0])) {
        src.shift();
      } else {
        src.shift();
      }
    }
  }

  return tokens;
}

export async function lexer(sourcecode: string) {
  let lexed = [];

  for (const token of tokenize(sourcecode)) {
    lexed.push(token);
  }

  return lexed;
}
