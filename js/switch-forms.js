// Простой и надежный скрипт для переключения между формами
document.addEventListener('DOMContentLoaded', function() {
    console.log('Switch forms script loaded');
    
    // Непосредственное добавление обработчиков на кнопки переключения
    var switchButtons = document.querySelectorAll('.switch-btn');
    var authCard = document.querySelector('.auth-card');
    
    // Функция переключения на форму регистрации
    function showRegisterForm() {
        console.log('Showing register form');
        authCard.classList.add('show-register');
        
        // Принудительная установка стилей для гарантии переключения
        document.querySelector('.register-form').style.display = 'block';
        document.querySelector('.register-form').style.opacity = '1';
        document.querySelector('.register-form').style.zIndex = '2';
        document.querySelector('.register-form').style.position = 'relative';
        
        document.querySelector('.login-form').style.display = 'none';
        document.querySelector('.login-form').style.opacity = '0';
    }
    
    // Функция переключения на форму входа
    function showLoginForm() {
        console.log('Showing login form');
        authCard.classList.remove('show-register');
        
        // Принудительная установка стилей для гарантии переключения
        document.querySelector('.login-form').style.display = 'block';
        document.querySelector('.login-form').style.opacity = '1';
        document.querySelector('.login-form').style.zIndex = '2';
        document.querySelector('.login-form').style.position = 'relative';
        
        document.querySelector('.register-form').style.display = 'none';
        document.querySelector('.register-form').style.opacity = '0';
    }
    
    // Добавление обработчиков на все кнопки переключения
    switchButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            var target = this.getAttribute('data-switch');
            if (target === 'register') {
                showRegisterForm();
            } else {
                showLoginForm();
            }
        });
    });
    
    // Дополнительно: прямое назначение обработчиков на кнопки через атрибуты onclick
    document.querySelector('.btn[data-switch="register"]').onclick = showRegisterForm;
    document.querySelector('.mobile-switch a[data-switch="register"]').onclick = showRegisterForm;
    document.querySelector('.mobile-switch a[data-switch="login"]').onclick = showLoginForm;
});
