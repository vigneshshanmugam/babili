"use strict";

module.exports = function({ types: t }) {
  return {
    name: "transform-regexp-constructors",
    visitor: {
      NewExpression(path) {
        if (!t.isIdentifier(path.node.callee, {name: "RegExp"})) {
          return;
        }
        const evaluatedArgs = path.get("arguments")
                                  .map((a) => a.evaluate());
        if (!evaluatedArgs.every((a) => a.confident === true &&
            typeof a.value === "string")) {
          return;
        }
        const pattern = (evaluatedArgs.length >= 1 &&
                          evaluatedArgs[0].value !== "") ?
                        evaluatedArgs[0].value :
                        "(?:)";
        const flags = evaluatedArgs.length >= 2 ?
                      evaluatedArgs[1].value :
                      "";
        path.replaceWith(t.regExpLiteral(pattern, flags));
      }
    },
  };
};
