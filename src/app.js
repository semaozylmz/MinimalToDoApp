const elements = {
    taskInput: document.getElementById("taskInput"),
    categoryInput: document.getElementById("categoryInput"),
    addTaskBtn: document.getElementById("addTaskBtn"),
    taskList: document.getElementById("taskList"),
    deadlineInput: document.getElementById("deadlineInput"),
    descriptionInput: document.getElementById("descriptionInput"),
    filterBtns: document.getElementById("filterBtns"),
    sortSelect: document.getElementById("sortSelect"),
    extraFields: document.getElementById("extraFields"),
    toggleExtraBtn: document.getElementById("toggleExtraBtn"),
    toggleExtraText: document.getElementById("toggleExtraText"),
    addCategoryBtn: document.getElementById("addCategoryBtn"),
    categoryModal: document.getElementById("categoryModal"),
    newCategoryInput: document.getElementById("newCategoryInput"),
    cancelCategoryBtn: document.getElementById("cancelCategoryBtn"),
    saveCategoryBtn: document.getElementById("saveCategoryBtn")
  };

  // State
  let state = {
    categories: JSON.parse(localStorage.getItem("categories")) || [
      { label: "Work", value: "work", color: "bg-blue-100 text-blue-800" },
      { label: "Personal", value: "personal", color: "bg-green-100 text-green-800" },
      { label: "Urgent", value: "urgent", color: "bg-red-100 text-red-800" }
    ],
    tasks: JSON.parse(localStorage.getItem("tasks")) || [],
    showExtraFields: false
  };

  // Helpers
  const helpers = {
    save: () => {
      localStorage.setItem("categories", JSON.stringify(state.categories));
      localStorage.setItem("tasks", JSON.stringify(state.tasks));
    },
    
    formatDate: (dateString) => {
      if (!dateString) return "";
      const options = { weekday: 'short', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    },
    
    animateElement: (element, animation) => {
      element.classList.add(`animate__${animation}`);
      element.addEventListener('animationend', () => {
        element.classList.remove(`animate__${animation}`);
      }, { once: true });
    },
    
    showConfirmation: (message, callback) => {
      const modal = document.createElement("div");
      modal.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";
      modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-sm w-full animate__animated animate__fadeIn">
          <p class="mb-4">${message}</p>
          <div class="flex justify-end space-x-2">
            <button class="cancel-btn px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
            <button class="confirm-btn px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      modal.querySelector(".cancel-btn").addEventListener("click", () => {
        helpers.animateElement(modal.querySelector("div"), "fadeOut");
        setTimeout(() => modal.remove(), 300);
      });
      
      modal.querySelector(".confirm-btn").addEventListener("click", () => {
        callback();
        helpers.animateElement(modal.querySelector("div"), "fadeOut");
        setTimeout(() => modal.remove(), 300);
      });
    },
    
    getRandomColor: () => {
      const colors = [
        "bg-red-200 text-red-800",
        "bg-orange-200 text-orange-800",
        "bg-yellow-200 text-yellow-800",
        "bg-lime-200 text-lime-800",
        "bg-emerald-200 text-emerald-800",
        "bg-cyan-200 text-cyan-800",
        "bg-blue-200 text-blue-800",
        "bg-violet-200 text-violet-800",
        "bg-pink-200 text-pink-800",
        
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }
  };

  // Render Functions
  const render = {
    categories: () => {
      elements.categoryInput.innerHTML = "";
      elements.filterBtns.innerHTML = "";

      // Varsayılan, seçilemeyen kategori seçeneği
      const defaultOption = document.createElement("option");
      defaultOption.value = "";             // boş değer
      defaultOption.textContent = "Select category";
      defaultOption.disabled = true;        // seçilemez
      defaultOption.selected = true;        // varsayılan seçili
      elements.categoryInput.appendChild(defaultOption);

      const allBtn = document.createElement("button");
      allBtn.textContent = "All";
      allBtn.className = "text-xs px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-all";
      allBtn.addEventListener("click", () => render.tasks());
      elements.filterBtns.appendChild(allBtn);

      // Categories
      state.categories.forEach(cat => {
        // Select option
        const option = document.createElement("option");
        option.value = cat.value;
        option.textContent = cat.label;
        elements.categoryInput.appendChild(option);

        // Category button with delete
        const btnContainer = document.createElement("div");
        btnContainer.className = "inline-flex items-center ml-1";
        
        // Category button
        const btn = document.createElement("button");
        btn.className = `text-xs px-3 py-1 rounded-full ${cat.color} hover:opacity-80 transition-all`;
        btn.textContent = cat.label;
        btn.addEventListener("click", () => render.tasks(cat.value));
        
        // Delete button
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
      elements.extraFields.classList.toggle("hidden");
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

  // Event Listeners
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

  elements.toggleExtraBtn.addEventListener("click", render.toggleExtraFields);
  elements.sortSelect.addEventListener("change", () => render.tasks());

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

  render.categories();
  render.tasks();

const darkModeToggle = document.getElementById("darkModeToggle");
const darkIcon = document.getElementById("darkIcon");
const lightIcon = document.getElementById("lightIcon");

darkModeToggle.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
  const isDark = document.documentElement.classList.contains("dark");
  localStorage.setItem("darkMode", isDark);
  
  if (isDark) {
    darkIcon.classList.remove("hidden");
    lightIcon.classList.add("hidden");
  } else {
    darkIcon.classList.add("hidden");
    lightIcon.classList.remove("hidden");
  }
});

if (localStorage.getItem("darkMode") === "true") {
  document.documentElement.classList.add("dark");
  darkIcon.classList.remove("hidden");
  lightIcon.classList.add("hidden");
} else {
  document.documentElement.classList.remove("dark");
  darkIcon.classList.add("hidden");
  lightIcon.classList.remove("hidden");
}