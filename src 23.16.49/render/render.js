import { elements } from "../core/elements.js";
import { state } from "../core/state.js";
import { helpers } from "../core/helpers.js";

export const render = {
  categories: () => {
    elements.categoryInput.innerHTML = "";
    elements.filterBtns.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select category";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    elements.categoryInput.appendChild(defaultOption);

    const allBtn = document.createElement("button");
    allBtn.textContent = "All";
    allBtn.className = "text-xs px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-all";
    allBtn.addEventListener("click", () => render.tasks());
    elements.filterBtns.appendChild(allBtn);

    state.categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.value;
      option.textContent = cat.label;
      elements.categoryInput.appendChild(option);

      const btnContainer = document.createElement("div");
      btnContainer.className = "inline-flex items-center ml-1";
      
      const btn = document.createElement("button");
      btn.className = `text-xs px-3 py-1 rounded-full ${cat.color} hover:opacity-80 transition-all`;
      btn.textContent = cat.label;
      btn.addEventListener("click", () => render.tasks(cat.value));
      
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "ml-1 text-gray-400 hover:text-red-500 transition-all";
      deleteBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      `;
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        helpers.showConfirmation(`Delete category "${cat.label}" and all its tasks?`, () => {
          state.tasks = state.tasks.filter(task => task.category !== cat.value);
          state.categories = state.categories.filter(c => c.value !== cat.value);
          helpers.save();
          render.categories();
          render.tasks();
        });
      });
      
      btnContainer.appendChild(btn);
      btnContainer.appendChild(deleteBtn);
      elements.filterBtns.appendChild(btnContainer);
    });
  },

  tasks: (filter = null) => {
    elements.taskList.innerHTML = "";

    let sortedTasks = [...state.tasks].filter(t => !filter || t.category === filter);

    switch (elements.sortSelect.value) {
      case "added-desc": sortedTasks.reverse(); break;
      case "added-asc": break;
      case "date-asc":
        sortedTasks.sort((a, b) => new Date(a.deadline || "9999-12-31") - new Date(b.deadline || "9999-12-31"));
        break;
      case "date-desc":
        sortedTasks.sort((a, b) => new Date(b.deadline || "0001-01-01") - new Date(a.deadline || "0001-01-01"));
        break;
    }

    if (sortedTasks.length === 0) {
      const emptyMsg = document.createElement("div");
      emptyMsg.className = "text-center text-gray-400 py-8";
      emptyMsg.textContent = filter ? `No tasks in this category` : "No tasks yet";
      elements.taskList.appendChild(emptyMsg);
      return;
    }

    sortedTasks.forEach(task => {
      const category = state.categories.find(c => c.value === task.category) || {};
      const li = document.createElement("li");
      li.className = `rounded-lg p-4 shadow-lg hover:shadow-xl transition-all animate__animated animate__fadeIn ${category.color || 'bg-gray-100'}`;

      li.innerHTML = `
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <div class="flex items-center">
              <span class="task-text ${task.completed ? 'line-through text-gray-400' : ''}">${task.text}</span>
              ${task.category ? `<span class="text-xs px-2 py-1 rounded-full ${category.color || 'bg-gray-100'} ml-2">${category.label || task.category}</span>` : ''}
            </div>
            ${task.description ? `<p class="text-sm text-gray-500 mt-1">${task.description}</p>` : ''}
            ${task.deadline ? `<p class="text-xs text-gray-400 mt-2">⏰ ${helpers.formatDate(task.deadline)}</p>` : ''}
          </div>
          <button class="delete-btn text-gray-300 hover:text-red-400 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      `;
      
      li.querySelector(".delete-btn").addEventListener("click", () => {
        state.tasks = state.tasks.filter(t => t !== task);
        helpers.save();
        helpers.animateElement(li, "fadeOut");
        setTimeout(() => render.tasks(filter), 300);
      });
      
      li.querySelector(".task-text").addEventListener("click", (e) => {
        if (e.target.tagName !== 'BUTTON') {
          task.completed = !task.completed;
          helpers.save();
          e.target.classList.toggle("line-through");
          e.target.classList.toggle("text-gray-400");
        }
      });
      
      elements.taskList.appendChild(li);
    });
  },

  toggleExtraFields: () => {
    state.showExtraFields = !state.showExtraFields;
    if (state.showExtraFields) {
      elements.extraFields.classList.remove("hidden");
    } else {
      elements.extraFields.classList.add("hidden");
    }
    elements.toggleExtraText.textContent = state.showExtraFields ? "− Hide details" : "+ Add details";
  },

  toggleCategoryModal: (show = true) => {
    if (show) {
      elements.categoryModal.classList.remove("hidden");
      elements.categoryModal.classList.add("flex");
      elements.newCategoryInput.value = "";
      elements.newCategoryInput.focus();
    } else {
      elements.categoryModal.classList.remove("flex");
      elements.categoryModal.classList.add("hidden");
    }
  }
};