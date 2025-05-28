// Тестовый скрипт для проверки функциональности переключения между формами
document.addEventListener('DOMContentLoaded', function() {
  console.log('Test script loaded');
  
  // Проверяем, работает ли переключение формы
  document.querySelectorAll('.switch-btn').forEach(btn => {
    console.log('Found switch button:', btn);
    btn.onclick = function(e) {
      e.preventDefault();
      console.log('Switch button clicked directly via test script');
      
      const authCard = document.querySelector('.auth-card');
      const targetForm = this.getAttribute('data-switch');
      
      if (targetForm === 'register') {
        console.log('Switching to register from test script');
        authCard.classList.add('show-register');
      } else {
        console.log('Switching to login from test script');
        authCard.classList.remove('show-register');
      }
    };
  });
});
