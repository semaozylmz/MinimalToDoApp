import { elements } from "./core/elements.js";
import { state } from "./core/state.js";
import { render } from "./render/render.js";
import "./events/listeners.js";

// Initial Render
render.categories();
render.tasks();