import { elements } from "../core/elements.js";
import { state } from "../core/state.js";
import { helpers } from "../core/helpers.js";
import { render } from "../render/render.js";

// Task Events
elements.addTaskBtn.addEventListener("click", () => {
  const text = elements.taskInput.value.trim();
  if (!text) return;

  const newTask = {
    text,
    category: elements.categoryInput.value || null,
    description: elements.descriptionInput.value.trim() || null,
    deadline: elements.deadlineInput.value || null,
    completed: false,
    createdAt: new Date().toISOString()
  };

  state.tasks.push(newTask);
  helpers.save();
  render.tasks();
  
  elements.taskInput.value = "";
  elements.descriptionInput.value = "";
  elements.deadlineInput.value = "";
  elements.taskInput.focus();
  
  if (state.showExtraFields) render.toggleExtraFields();
});

elements.taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") elements.addTaskBtn.click();
});

// Extra Fields Toggle Event
elements.toggleExtraBtn.addEventListener("click", render.toggleExtraFields);

// Sort Event
elements.sortSelect.addEventListener("change", () => render.tasks());

// Category Events
elements.addCategoryBtn.addEventListener("click", () => {
  render.toggleCategoryModal(true);
});

elements.cancelCategoryBtn.addEventListener("click", () => {
  render.toggleCategoryModal(false);
  requestAnimationFrame(() => {
    elements.newCategoryInput.focus();
  });
});

elements.saveCategoryBtn.addEventListener("click", () => {
  const categoryName = elements.newCategoryInput.value.trim();
  if (!categoryName) return;

  const newCategory = {
    label: categoryName,
    value: categoryName.toLowerCase().replace(/[^\w\-]+/g, '-'),
    color: helpers.getRandomColor()
  };

  if (!state.categories.some(c => c.value === newCategory.value)) {
    state.categories.push(newCategory);
    helpers.save();
    render.categories();
    render.toggleCategoryModal(false);
  }
});

elements.newCategoryInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") elements.saveCategoryBtn.click();
});