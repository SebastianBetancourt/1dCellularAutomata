const AUTOMATON_LENGTH = 100;
const ITERATIONS = 100;

const ALIVE = 1;
const ALIVE_COLOR = 51; // Black
const DEAD = 0;
const DEAD_COLOR = 201; // White

let updateRules = {
  "000": DEAD, // if my left neighbor is DEAD, i'm DEAD, and my right neighbor is DEAD, then i'll be DEAD
  "001": ALIVE, // if my left neighbor is DEAD, i'm DEAD, and my right neighbor is ALIVE, then i'll be ALIVE
  "010": ALIVE,
  "011": ALIVE,
  "100": DEAD,
  "101": ALIVE,
  "110": ALIVE,
  "111": DEAD,
};

const CELL_SIZE = 6; // side size in pixels
const CELL_MARGIN = 1;
const STATE_MARGIN = 1;
const INITIAL_STATE_DRAW_POSITION = { x: 10, y: 20 };
const SIMULATION_DRAW_POSITION = { x: 10, y: 40 };

const initialState = new Array(AUTOMATON_LENGTH).fill(0);
let grid = new Array(ITERATIONS);

let stateToDraw;

function setup() {
  createCanvas(1500, 1500);
  initialState[50] = ALIVE;
  stateToDraw = 0;
  runSimulation();
}

function draw() {
  background(220);

  drawAutomataAt(
    initialState,
    INITIAL_STATE_DRAW_POSITION.x,
    INITIAL_STATE_DRAW_POSITION.y
  );

  drawAutomataUpTo(stateToDraw);
  if (stateToDraw < ITERATIONS) {
    stateToDraw += 1;
  }
}

function reset() {
  stateToDraw = 0;
  runSimulation();
}

function drawAutomataUpTo(i) {
  for (let u = 0; u < i; u++) {
    drawAutomataAt(
      grid[u],
      SIMULATION_DRAW_POSITION.x,
      SIMULATION_DRAW_POSITION.y + u * (CELL_SIZE + STATE_MARGIN)
    );
  }
}

function drawAutomataAt(automaton, x, y) {
  let headPosition = x;
  for (let cell of automaton) {
    if (cell == ALIVE) fill(ALIVE_COLOR);
    else if (cell == DEAD) fill(DEAD_COLOR);
    square(x + headPosition, y, CELL_SIZE);
    headPosition += CELL_SIZE + CELL_MARGIN;
  }
}

function updateAutomatonOnce(automaton) {
  const newState = new Array(AUTOMATON_LENGTH);
  for (let i = 1; i < AUTOMATON_LENGTH - 1; i++) {
    key = "" + automaton[i - 1] + automaton[i] + automaton[i + 1];
    console.log(key);
    newState[i] = updateRules[key];
  }

  // handle special first and last cells
  newState[0] = updateRules["0" + automaton[0] + automaton[1]];
  newState[AUTOMATON_LENGTH - 1] =
    updateRules[
      "" +
        automaton[AUTOMATON_LENGTH - 2] +
        automaton[AUTOMATON_LENGTH - 1] +
        "0"
    ];

  return newState;
}

function runSimulation() {
  grid[0] = initialState;
  for (let i = 1; i < ITERATIONS; i++) {
    grid[i] = updateAutomatonOnce(grid[i - 1]);
  }
}

function printAutomatonToConsole(automaton) {
  console.log(automaton.reduce((str, c) => str + c, ""));
}

function mouseClicked() {
  // initial state manipulation
  const cellAndMargin = CELL_SIZE + CELL_MARGIN;
  const END_OF_INITIAL_STATE =
    INITIAL_STATE_DRAW_POSITION.x +
    AUTOMATON_LENGTH * cellAndMargin +
    cellAndMargin;
  if (
    mouseX > INITIAL_STATE_DRAW_POSITION.x &&
    mouseX < END_OF_INITIAL_STATE &&
    mouseY > INITIAL_STATE_DRAW_POSITION.y &&
    mouseY < INITIAL_STATE_DRAW_POSITION.y + cellAndMargin
  ) {
    clickedCell =
      floor((mouseX - INITIAL_STATE_DRAW_POSITION.x) / cellAndMargin) - 1;
    initialState[clickedCell] =
      initialState[clickedCell] == ALIVE ? DEAD : ALIVE;

    reset();
  }
}
