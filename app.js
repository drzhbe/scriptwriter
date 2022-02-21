console.log(`
Todo:
1. When the current page doesn't have any more space, create a new one.
2. Export to PDF. Consider browser's print option.
https://www.smashingmagazine.com/2015/01/designing-for-print-with-css/
https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=Hello%20world&choe=UTF-8
3. Collaborative editing.
`);

const init = () => {
  // Prevent default browser's tab action.
  document.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
    }
  });
  document.addEventListener("keyup", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      setElementNextMode(getActiveElement());
    }
  });
  document.addEventListener("paste", (e) => {
    const text = e.clipboardData.getData("text");
    console.log("### text pasted", text);
  });

  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((m) => {
      console.log("@ m", m);
      m.addedNodes.forEach((node) => {
        if (node.nodeName === "DIV") {
          setElementNextMode(node, true);
        }
      });
    });
  });
  const documentElement = document.querySelector(".document");
  mutationObserver.observe(documentElement, {
    childList: true,
    subtree: true,
  });
};

init();

// ---

const getActiveElement = () => {
  const activeElement = document.getSelection().getRangeAt(0).endContainer;
  return activeElement.nodeName === "#text"
    ? activeElement.parentElement
    : activeElement;
};

const MODES = {
  Action: 0,
  Character: 1,
  Dialog: 2,
  Parentheses: 3,
};
const modes = ["action", "character", "dialog", "parentheses"];
const nextMode = (mode) => {
  const next = mode + 1;
  return next > MODES.Parentheses ? 0 : next;
};
const newLineMode = (mode) => {
  switch (mode) {
    case MODES.Action:
      return mode;
    case MODES.Character:
      return MODES.Dialog;
    case MODES.Dialog:
      return MODES.Action;
    case MODES.Parentheses:
      return MODES.Dialog;
    default:
      throw new Error(`newLineMode: not implemented for mode ${mode}`);
  }
};

const setElementNextMode = (element, newLine) => {
  const fn = newLine ? newLineMode : nextMode;
  const mode = element.classList[0] || MODES.Action;
  element.classList.replace(mode, modes[fn(modes.indexOf(mode))]);
};
