export let state = {
  categories: JSON.parse(localStorage.getItem("categories")) || [
    { label: "Work", value: "work", color: "bg-blue-100 text-blue-800" },
    { label: "Personal", value: "personal", color: "bg-green-100 text-green-800" },
    { label: "Urgent", value: "urgent", color: "bg-red-100 text-red-800" }
  ],
  tasks: JSON.parse(localStorage.getItem("tasks")) || [],
  showExtraFields: false
};