export const helpers = {
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