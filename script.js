const starters = {
  arcade: {
    mission: "Build an arcade for aliens",
    description: "Give space travelers a place to play. Invent a heading, change the background, and add your own style.",
    heading: "Level up your day.",
    paragraph: "Welcome to Pixel Arcade! Grab a friend, discover a new game, and chase your next high score.",
    background: "#172554",
    color: "#f0f9ff"
  },
  rescue: {
    mission: "Open a rescue for superhero pets",
    description: "Even super pets need a home base. Invent a heading, change the background, and give your rescue a heroic style.",
    heading: "Small paws. Big love.",
    paragraph: "Meet your new best friend at Happy Paws Rescue. Every pet deserves a cozy home and a fresh start.",
    background: "#dcfce7",
    color: "#14532d"
  },
  truck: {
    mission: "Launch a taco truck on Mars",
    description: "Feed the hungriest explorers in the galaxy. Invent a heading, change the background, and make your truck stand out.",
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
const mascot = document.getElementById("mascot");
const font = document.getElementById("font");
const pattern = document.getElementById("pattern");
const preview = document.getElementById("preview");
const changeStatus = document.getElementById("change-status");
const confetti = document.getElementById("confetti");
const fonts = {
  modern: "system-ui, sans-serif",
  retro: "'Courier New', monospace",
  storybook: "Georgia, serif"
};
const patterns = {
  none: { image: "none", size: "auto" },
  dots: { image: "radial-gradient(#88888833 2px, transparent 2px)", size: "20px 20px" },
  stripes: { image: "repeating-linear-gradient(45deg, #88888822 0 10px, transparent 10px 20px)", size: "auto" },
  grid: { image: "linear-gradient(#88888833 1px, transparent 1px), linear-gradient(90deg, #88888833 1px, transparent 1px)", size: "24px 24px" }
};
let selectedStarter = "arcade";
let celebrated = false;
let celebrationTimer;

function celebrate() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const colors = ["#791d3c", "#176aab", "#f0b429", "#2a8767"];
  for (let index = 0; index < 24; index += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.setProperty("--left", `${Math.random() * 100}%`);
    piece.style.setProperty("--delay", `${Math.random() * 0.3}s`);
    piece.style.setProperty("--piece-color", colors[index % colors.length]);
    confetti.append(piece);
  }
  celebrationTimer = window.setTimeout(() => confetti.replaceChildren(), 2300);
}

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
  preview.style.fontFamily = fonts[font.value];
  preview.style.backgroundImage = patterns[pattern.value].image;
  preview.style.backgroundSize = patterns[pattern.value].size;
  const previewMascot = document.getElementById("preview-mascot");
  previewMascot.textContent = mascot.value;
  previewMascot.hidden = mascot.value === "";
  document.getElementById("background-value").value = background.value;
  document.getElementById("text-color-value").value = textColor.value;

  showCode("html-code", [
    ["", "<body>"],
    ...(mascot.value ? [["mascot", `  <p class="mascot">${escapeHTML(mascot.value)}</p>`]] : []),
    ["heading", `  <h1>${escapeHTML(heading.value)}</h1>`],
    ["paragraph", `  <p>${escapeHTML(paragraph.value)}</p>`],
    ["", "</body>"]
  ], activeLine);

  showCode("css-code", [
    ["", "body {"],
    ["background", `  background-color: ${background.value};`],
    ["color", `  color: ${textColor.value};`],
    ["font", `  font-family: ${fonts[font.value]};`],
    ["pattern", `  background-image: ${patterns[pattern.value].image};`],
    ["pattern", `  background-size: ${patterns[pattern.value].size};`],
    ["", "  margin: 0;"],
    ["", "  padding: 32px;"],
    ["", "}"],
    ["", "h1 { font-size: 32px; line-height: 1.2; margin: 0 0 16px; }"],
    ["", "p { font-size: 18px; line-height: 1.6; margin: 0; }"],
    ...(mascot.value ? [["", ".mascot { font-size: 48px; margin: 0 0 16px; }"]] : []),
    ["", "h1, p {"],
    ["", "  white-space: pre-wrap;"],
    ["", "  overflow-wrap: anywhere;"],
    ["", "}"]
  ], activeLine);

  const headingChanged = heading.value.trim() !== "" && heading.value !== starters[selectedStarter].heading;
  const backgroundChanged = background.value !== starters[selectedStarter].background;
  const styleChanged = mascot.value !== "" || font.value !== "modern" || pattern.value !== "none";
  updateTask("heading-task", headingChanged);
  updateTask("background-task", backgroundChanged);
  updateTask("style-task", styleChanged);
  const completed = Number(headingChanged) + Number(backgroundChanged) + Number(styleChanged);
  const progress = document.getElementById("mission-progress");
  progress.value = completed;
  progress.textContent = `${completed} of 3`;
  document.getElementById("progress-count").textContent = `${completed} / 3`;
  document.getElementById("creator-badge").hidden = completed !== 3;
  document.getElementById("challenge-status").textContent = completed === 3
    ? "Mission complete! You earned the Website Creator badge. Words and emojis are HTML; colors, fonts, and patterns are CSS."
    : `${completed} of 3 complete. Words and emojis are HTML. Colors, fonts, and patterns are CSS. Keep creating!`;
  if (completed === 3 && !celebrated) {
    celebrated = true;
    celebrate();
  }
}

function loadStarter(name) {
  selectedStarter = name;
  const starter = starters[name];
  heading.value = starter.heading;
  paragraph.value = starter.paragraph;
  background.value = starter.background;
  textColor.value = starter.color;
  mascot.value = "";
  font.value = "modern";
  pattern.value = "none";
  celebrated = false;
  window.clearTimeout(celebrationTimer);
  confetti.replaceChildren();
  document.getElementById("mission-title").textContent = starter.mission;
  document.getElementById("mission-description").textContent = starter.description;
  render();
}

const edits = [
  [heading, "heading", "HTML → <h1>: your page heading."],
  [paragraph, "paragraph", "HTML → <p>: your paragraph."],
  [background, "background", "CSS → background-color: your background."],
  [textColor, "color", "CSS → color: your text color."],
  [mascot, "mascot", "HTML → <p>: your emoji mascot."],
  [font, "font", "CSS → font-family: your font vibe."],
  [pattern, "pattern", "CSS → background-image and background-size: your pattern."]
];

edits.forEach(([control, line, message]) => {
  control.addEventListener(control.tagName === "SELECT" ? "change" : "input", () => {
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
