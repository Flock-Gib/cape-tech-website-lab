const starters = {
  arcade: {
    heading: "Level up your day.",
    paragraph: "Welcome to Pixel Arcade! Grab a friend, discover a new game, and chase your next high score.",
    background: "#172554",
    color: "#f0f9ff"
  },
  rescue: {
    heading: "Small paws. Big love.",
    paragraph: "Meet your new best friend at Happy Paws Rescue. Every pet deserves a cozy home and a fresh start.",
    background: "#dcfce7",
    color: "#14532d"
  },
  truck: {
    heading: "Good tacos. Great tides.",
    paragraph: "Follow the flavor to Coastal Taco Truck! Fresh tacos, sunny smiles, and a little taste of the coast.",
    background: "#ffedd5",
    color: "#7c2d12"
  }
};

const heading = document.getElementById("heading");
const paragraph = document.getElementById("paragraph");
const background = document.getElementById("background");
const textColor = document.getElementById("text-color");
const preview = document.getElementById("preview");
const changeStatus = document.getElementById("change-status");
let selectedStarter = "arcade";

function escapeHTML(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function showCode(containerId, lines, activeLine) {
  const container = document.getElementById(containerId);
  container.replaceChildren();
  lines.forEach(([key, text], index) => {
    const line = document.createElement("span");
    line.className = "code-line";
    if (key === activeLine) {
      line.classList.add("active");
      line.setAttribute("aria-label", "Latest change");
    }
    line.textContent = text;
    container.append(line);
    if (index < lines.length - 1) container.append(document.createTextNode("\n"));
  });
}

function updateTask(id, complete) {
  const task = document.getElementById(id);
  task.classList.toggle("complete", complete);
  task.querySelector(".task-marker").textContent = complete ? "✓" : "○";
  task.querySelector(".task-state").textContent = complete ? "Done" : "Not yet";
}

function render(activeLine) {
  document.getElementById("preview-heading").textContent = heading.value;
  document.getElementById("preview-paragraph").textContent = paragraph.value;
  preview.style.backgroundColor = background.value;
  preview.style.color = textColor.value;
  document.getElementById("background-value").value = background.value;
  document.getElementById("text-color-value").value = textColor.value;

  showCode("html-code", [
    ["", "<body>"],
    ["heading", `  <h1>${escapeHTML(heading.value)}</h1>`],
    ["paragraph", `  <p>${escapeHTML(paragraph.value)}</p>`],
    ["", "</body>"]
  ], activeLine);

  showCode("css-code", [
    ["", "body {"],
    ["background", `  background-color: ${background.value};`],
    ["color", `  color: ${textColor.value};`],
    ["", "  font-family: system-ui, sans-serif;"],
    ["", "  margin: 0;"],
    ["", "  padding: 32px;"],
    ["", "}"],
    ["", "h1 { font-size: 32px; line-height: 1.2; margin: 0 0 16px; }"],
    ["", "p { font-size: 18px; line-height: 1.6; margin: 0; }"],
    ["", "h1, p {"],
    ["", "  white-space: pre-wrap;"],
    ["", "  overflow-wrap: anywhere;"],
    ["", "}"]
  ], activeLine);

  const headingChanged = heading.value.trim() !== "" && heading.value !== starters[selectedStarter].heading;
  const backgroundChanged = background.value !== starters[selectedStarter].background;
  updateTask("heading-task", headingChanged);
  updateTask("background-task", backgroundChanged);
  document.getElementById("challenge-status").textContent = headingChanged && backgroundChanged
    ? "You did it! The heading is HTML (what’s on the page). The background is CSS (how it looks)."
    : "Two small edits. You’ve got this!";
}

function loadStarter(name) {
  selectedStarter = name;
  const starter = starters[name];
  heading.value = starter.heading;
  paragraph.value = starter.paragraph;
  background.value = starter.background;
  textColor.value = starter.color;
  render();
}

const edits = [
  [heading, "heading", "HTML → <h1>: your page heading."],
  [paragraph, "paragraph", "HTML → <p>: your paragraph."],
  [background, "background", "CSS → background-color: your background."],
  [textColor, "color", "CSS → color: your text color."]
];

edits.forEach(([control, line, message]) => {
  control.addEventListener("input", () => {
    render(line);
    changeStatus.textContent = message;
  });
});

document.querySelectorAll('input[name="starter"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    loadStarter(radio.value);
    changeStatus.textContent = "Starter loaded. Make a change to find it in the code.";
  });
});

document.getElementById("reset").addEventListener("click", () => {
  const firstStarter = document.querySelector('input[name="starter"][value="arcade"]');
  firstStarter.checked = true;
  loadStarter("arcade");
  changeStatus.textContent = "Fresh start! Pick a page and make it yours.";
  firstStarter.focus();
});

loadStarter("arcade");
