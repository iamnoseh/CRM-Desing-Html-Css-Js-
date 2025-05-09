document.addEventListener('DOMContentLoaded', function() {
    // Скрытие загрузчика страницы
    setTimeout(function() {
        const loader = document.querySelector('.page-loader');
        if (loader) {
            loader.style.opacity = 0;
            setTimeout(() => {
                loader.style.display = 'none';
            }, 300);
        }
    }, 300);

    // Обработка боковой панели
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebarToggleCollapsed = document.querySelector('.sidebar-toggle-collapsed');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    const mainContent = document.querySelector('.main-content');
    
    // Проверяем сохраненное состояние боковой панели и применяем его на больших экранах
    const sidebarState = localStorage.getItem('sidebarState');
    if (sidebarState === 'collapsed' && window.innerWidth >= 992) {
        sidebar.classList.add('collapsed');
        mainContent.classList.add('sidebar-collapsed');
    }
    
    // Настройка интерфейса для мобильных устройств
    function setupMobileInterface() {
        if (window.innerWidth < 992) {
            // На мобильных устройствах
            if (sidebarToggleCollapsed) {
                sidebarToggleCollapsed.style.display = 'flex';
            }
            mainContent.classList.remove('sidebar-collapsed');
            sidebar.classList.remove('collapsed');
        } else {
            // На десктопе
            if (sidebarToggleCollapsed) {
                sidebarToggleCollapsed.style.display = 'none';
            }
            sidebar.classList.remove('mobile-open');
            sidebarOverlay.classList.remove('active');
            
            // Восстанавливаем сохраненное состояние
            if (sidebarState === 'collapsed') {
                sidebar.classList.add('collapsed');
                mainContent.classList.add('sidebar-collapsed');
            }
        }
    }
    
    // Начальная настройка
    setupMobileInterface();
    
    // Перенастройка при изменении размера окна
    window.addEventListener('resize', setupMobileInterface);
    
    // Функция для переключения состояния боковой панели
    function toggleSidebar() {
        if (window.innerWidth < 992) {
            // На мобильных устройствах
            sidebar.classList.toggle('mobile-open');
            sidebarOverlay.classList.toggle('active');
            
            // Дополнительно блокируем прокрутку страницы
            if (sidebar.classList.contains('mobile-open')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        } else {
            // На десктопе
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('sidebar-collapsed');
            
            // Сохраняем состояние в localStorage
            if (sidebar.classList.contains('collapsed')) {
                localStorage.setItem('sidebarState', 'collapsed');
            } else {
                localStorage.setItem('sidebarState', 'expanded');
            }
        }
    }
    
    // Обработчик кнопки в шапке сайдбара
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
    
    // Обработчик кнопки для мобильных устройств
    if (sidebarToggleCollapsed) {
        sidebarToggleCollapsed.addEventListener('click', toggleSidebar);
    }
    
    // Закрытие панели при клике на оверлей
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', function() {
            sidebar.classList.remove('mobile-open');
            sidebarOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Обработка модальных окон
    const modals = document.querySelectorAll('.modal');
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    const addCourseBtn = document.querySelector('.add-course-btn');
    const courseModal = document.getElementById('course-modal');
    const filterModal = document.getElementById('filter-modal');
    const advancedFilterBtn = document.getElementById('advanced-filter-btn');
    
    // Функция для открытия модального окна
    function openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Блокируем прокрутку страницы
    }
    
    // Функция для закрытия модального окна
    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Восстанавливаем прокрутку страницы
    }
    
    // Открытие модального окна для добавления курса
    if (addCourseBtn) {
        addCourseBtn.addEventListener('click', function() {
            // Сбрасываем форму при открытии модального окна
            document.getElementById('course-form').reset();
            document.getElementById('course-id').value = '';
            document.getElementById('modal-title').textContent = 'Добавить курс';
            document.querySelector('.file-name').textContent = 'Файл не выбран';
            openModal(courseModal);
        });
    }
    
    // Открытие модального окна расширенных фильтров
    if (advancedFilterBtn) {
        advancedFilterBtn.addEventListener('click', function() {
            openModal(filterModal);
        });
    }
    
    // Закрытие модальных окон при клике на крестик
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Закрытие модальных окон при клике вне окна
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });
    
    // Обработка кнопки отмены в модальном окне курса
    const cancelCourseBtn = document.getElementById('cancel-course');
    if (cancelCourseBtn) {
        cancelCourseBtn.addEventListener('click', function() {
            closeModal(courseModal);
        });
    }
    
    // Обработка загрузки файла
    const fileInput = document.getElementById('course-image');
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            const fileName = this.files[0] ? this.files[0].name : 'Файл не выбран';
            document.querySelector('.file-name').textContent = fileName;
        });
    }

    // Переключение между видами отображения курсов
    const viewButtons = document.querySelectorAll('.view-btn');
    const viewContainers = document.querySelectorAll('.view-container');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const viewType = this.getAttribute('data-view');
            
            // Убираем активный класс со всех кнопок
            viewButtons.forEach(btn => btn.classList.remove('active'));
            
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            
            // Скрываем все контейнеры
            viewContainers.forEach(container => container.classList.remove('active'));
            
            // Показываем соответствующий контейнер
            document.getElementById(`${viewType}-view`).classList.add('active');
            
            // Сохраняем вид отображения в localStorage
            localStorage.setItem('coursesViewType', viewType);
        });
    });
    
    // Восстанавливаем сохраненный вид отображения
    const savedViewType = localStorage.getItem('coursesViewType');
    if (savedViewType) {
        const viewBtn = document.querySelector(`.view-btn[data-view="${savedViewType}"]`);
        if (viewBtn) {
            viewBtn.click();
        }
    }

    // Действия с кнопками редактирования/удаления
    const editButtons = document.querySelectorAll('.edit-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');
    
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            alert('Функциональность редактирования курса будет добавлена позже');
        });
    });
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (confirm('Вы уверены, что хотите удалить этот курс?')) {
                alert('Курс был бы удален (демо)');
            }
        });
    });
});
