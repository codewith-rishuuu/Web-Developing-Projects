document.addEventListener("DOMContentLoaded", () => {
  const questions = document.querySelectorAll(".faq-question");

  questions.forEach((question) => {
    question.addEventListener("click", () => {
      const item = question.closest(".faq-item");
      item.classList.toggle("active");
    });
  });
});