/**
 * CRM System - Функциональность страницы входа и регистрации
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    
    // Кэшируем элементы DOM
    const authCard = document.querySelector('.auth-card');
    const switchButtons = document.querySelectorAll('.switch-btn');
    const passwordToggles = document.querySelectorAll('.password-toggle');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginWelcome = document.querySelector('.login-welcome');
    const registerWelcome = document.querySelector('.register-welcome');
    
    // Инициализация первичных состояний
    loginWelcome.classList.add('active');
    
    console.log('Switch buttons found:', switchButtons.length);
    
    // Обработка переключения между формами (логин/регистрация)
    switchButtons.forEach(button => {
        console.log('Adding click event to button:', button.textContent);
        
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Switch button clicked');
            
            const targetForm = this.getAttribute('data-switch');
            console.log('Target form:', targetForm);
            
            if (targetForm === 'register') {
                console.log('Switching to register form');
                authCard.classList.add('show-register');
                loginWelcome.classList.remove('active');
                registerWelcome.classList.add('active');
            } else {
                console.log('Switching to login form');
                authCard.classList.remove('show-register');
                registerWelcome.classList.remove('active');
                loginWelcome.classList.add('active');
            }
        });
    });
    
    // Добавление обработчика для мобильного режима
    document.querySelector('.mobile-switch a').addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Mobile switch clicked');
        const targetForm = this.getAttribute('data-switch');
        
        if (targetForm === 'register') {
            authCard.classList.add('show-register');
            loginWelcome.classList.remove('active');
            registerWelcome.classList.add('active');
        } else {
            authCard.classList.remove('show-register');
            registerWelcome.classList.remove('active');
            loginWelcome.classList.add('active');
        }
    });
    
    // Обработка переключения видимости пароля
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const passwordField = document.getElementById(targetId);
            
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                this.innerHTML = '<i class="fas fa-eye-slash"></i>';
            } else {
                passwordField.type = 'password';
                this.innerHTML = '<i class="fas fa-eye"></i>';
            }
        });
    });
    
    // Обработка отправки формы входа
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        // Здесь вы можете добавить валидацию или отправку данных на сервер
        console.log('Попытка входа:', { username, password });
        
        // Имитация процесса входа
        simulateLogin();
    });
    
    // Обработка отправки формы регистрации
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        
        // Проверка совпадения паролей
        if (password !== confirmPassword) {
            showError('Пароли не совпадают');
            return;
        }
        
        // Здесь вы можете добавить валидацию или отправку данных на сервер
        console.log('Попытка регистрации:', { username, email, password });
        
        // Имитация процесса регистрации
        simulateRegistration();
    });
    
    // Функция для имитации процесса входа
    function simulateLogin() {
        const loginBtn = loginForm.querySelector('.auth-btn');
        const originalText = loginBtn.innerHTML;
        
        // Показываем состояние загрузки
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Вход...';
        loginBtn.disabled = true;
        
        // Имитируем задержку запроса
        setTimeout(() => {
            // Возвращаем кнопку в исходное состояние
            loginBtn.innerHTML = originalText;
            loginBtn.disabled = false;
            
            // Переход на страницу dashboard
            window.location.href = 'dashboard.html';
        }, 2000);
    }
    
    // Функция для имитации процесса регистрации
    function simulateRegistration() {
        const registerBtn = registerForm.querySelector('.auth-btn');
        const originalText = registerBtn.innerHTML;
        
        // Показываем состояние загрузки
        registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Регистрация...';
        registerBtn.disabled = true;
        
        // Имитируем задержку запроса
        setTimeout(() => {
            // Успешная регистрация
            registerBtn.innerHTML = '<i class="fas fa-check"></i> Зарегистрировано!';
            registerBtn.style.backgroundColor = 'var(--secondary-color)';
            
            // После успешной регистрации показываем форму входа
            setTimeout(() => {
                // Возвращаем кнопку в исходное состояние
                registerBtn.innerHTML = originalText;
                registerBtn.disabled = false;
                registerBtn.style.backgroundColor = '';
                
                // Переключаемся на форму входа
                authCard.classList.remove('show-register');
                registerWelcome.classList.remove('active');
                loginWelcome.classList.add('active');
                
                // Показываем уведомление в форме входа
                showSuccess('Регистрация успешна! Теперь вы можете войти в систему.');
            }, 1500);
        }, 2000);
    }
    
    // Функция для отображения ошибки
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-error';
        errorDiv.textContent = message;
        
        // Добавляем стили для уведомления
        errorDiv.style.backgroundColor = '#f8d7da';
        errorDiv.style.color = '#721c24';
        errorDiv.style.padding = '10px';
        errorDiv.style.borderRadius = '5px';
        errorDiv.style.marginBottom = '15px';
        errorDiv.style.fontSize = '14px';
        
        // Для форм логина и регистрации
        if (authCard.classList.contains('show-register')) {
            registerForm.insertBefore(errorDiv, registerForm.firstChild);
        } else {
            loginForm.insertBefore(errorDiv, loginForm.firstChild);
        }
        
        // Удаляем уведомление через 3 секунды
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }
    
    // Функция для отображения успешного сообщения
    function showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success';
        successDiv.textContent = message;
        
        // Добавляем стили для уведомления
        successDiv.style.backgroundColor = '#d4edda';
        successDiv.style.color = '#155724';
        successDiv.style.padding = '10px';
        successDiv.style.borderRadius = '5px';
        successDiv.style.marginBottom = '15px';
        successDiv.style.fontSize = '14px';
        
        // Добавляем в форму логина
        loginForm.insertBefore(successDiv, loginForm.firstChild);
        
        // Удаляем уведомление через 3 секунды
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }
    
    // Добавляем анимированные декоративные элементы на фон
    addBackgroundElements();
});

/**
 * Функция для создания анимированных декоративных элементов на фоне
 */
function addBackgroundElements() {
    const authContainer = document.querySelector('.auth-container');
    
    // Создаем декоративные точки
    for (let i = 0; i < 20; i++) {
        const dot = document.createElement('div');
        dot.className = 'bg-decoration';
        
        // Случайные размеры и позиции
        const size = Math.random() * 6 + 2; // от 2px до 8px
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const opacity = Math.random() * 0.5 + 0.1; // от 0.1 до 0.6
        
        // Применяем стили
        dot.style.position = 'absolute';
        dot.style.width = `${size}px`;
        dot.style.height = `${size}px`;
        dot.style.left = `${posX}%`;
        dot.style.top = `${posY}%`;
        dot.style.opacity = opacity;
        dot.style.backgroundColor = i % 2 ? 'var(--primary-light)' : 'var(--secondary-light)';
        dot.style.borderRadius = '50%';
        dot.style.zIndex = '0';
        
        // Добавляем анимацию пульсации
        const animDuration = 3 + Math.random() * 4; // от 3 до 7 секунд
        dot.style.animation = `pulse ${animDuration}s infinite alternate ease-in-out`;
        dot.style.animationDelay = `${Math.random() * 2}s`;
        
        authContainer.appendChild(dot);
    }
    
    // Добавляем стили для анимации в head
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); opacity: var(--start-opacity); }
            100% { transform: scale(1.5); opacity: calc(var(--start-opacity) * 0.5); }
        }
        .bg-decoration {
            --start-opacity: attr(style opacity);
        }
    `;
    document.head.appendChild(style);
}
