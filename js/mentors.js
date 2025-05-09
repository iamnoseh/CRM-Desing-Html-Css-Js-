/**
 * CRM System - Функциональность страницы менторов
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Mentors page initialized');
    
    // Скрытие загрузчика страницы
    setTimeout(function() {
        const loader = document.querySelector('.page-loader');
        if (loader) {
            loader.style.opacity = 0;
            setTimeout(() => loader.style.display = 'none', 500);
        }
    }, 1000);
    
    // Настройка боковой панели
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebarToggleCollapsed = document.querySelector('.sidebar-toggle-collapsed');
    
    // Функция для переключения состояния боковой панели
    function toggleSidebar() {
        document.body.classList.toggle('sidebar-collapsed');
        
        // Сохраняем состояние в localStorage
        const isCollapsed = document.body.classList.contains('sidebar-collapsed');
        localStorage.setItem('sidebar-collapsed', isCollapsed);
        console.log('Sidebar toggled, collapsed:', isCollapsed);
        
        // Обработка overlay для мобильных устройств
        const overlay = document.querySelector('.sidebar-overlay');
        if (overlay) {
            if (isCollapsed) {
                overlay.classList.remove('active');
                setTimeout(() => {
                    overlay.style.display = 'none';
                }, 300);
            } else {
                overlay.style.display = 'block';
                setTimeout(() => {
                    overlay.classList.add('active');
                }, 10);
            }
        }
        
        // Добавляем дополнительную анимацию для плавного перехода
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.style.transition = 'all 0.3s ease-in-out';
            
            if (isCollapsed) {
                sidebar.classList.add('hidden');
            } else {
                sidebar.classList.remove('hidden');
            }
        }
    }
    
    // Обработчик для кнопки сворачивания внутри боковой панели
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
    
    // Обработчик для кнопки разворачивания, которая появляется при свернутой панели
    if (sidebarToggleCollapsed) {
        sidebarToggleCollapsed.addEventListener('click', toggleSidebar);
    }
    
    // Восстанавливаем состояние боковой панели из localStorage
    const savedCollapsedState = localStorage.getItem('sidebar-collapsed');
    if (savedCollapsedState === 'true') {
        document.body.classList.add('sidebar-collapsed');
    }
    
    // Добавляем обработчик клика на overlay для закрытия сайдбара
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) {
        overlay.addEventListener('click', function() {
            if (!document.body.classList.contains('sidebar-collapsed')) {
                toggleSidebar();
            }
        });
    }
    
    // Автоматически скрывать сайдбар на мобильных устройствах
    function checkMobileView() {
        if (window.innerWidth < 992 && !document.body.classList.contains('sidebar-collapsed')) {
            document.body.classList.add('sidebar-collapsed');
        }
    }
    
    // Проверяем при загрузке и при изменении размера окна
    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    
    // Функционал фильтров
    // Обработка открытия модального окна расширенных фильтров
    const advancedFilterBtn = document.getElementById('advanced-filter-btn');
    const advancedFilterModal = document.getElementById('advanced-filter-modal');
    const closeModalButtons = document.querySelectorAll('.modal-close, .modal-cancel');

    if (advancedFilterBtn && advancedFilterModal) {
        advancedFilterBtn.addEventListener('click', function() {
            advancedFilterModal.classList.add('open');
        });
        
        // Закрытие модального окна
        closeModalButtons.forEach(button => {
            button.addEventListener('click', function() {
                const modal = this.closest('.modal');
                if (modal) {
                    modal.classList.remove('open');
                }
            });
        });
    }
    
    // Обработка быстрых фильтров
    const statusFilter = document.getElementById('status-filter');
    const specializationFilter = document.getElementById('specialization-filter');
    const mentorSearch = document.getElementById('mentor-search');
    
    // Обработка модальных фильтров
    const modalFilterStatus = document.getElementById('filter-status');
    const modalFilterSpecialization = document.getElementById('filter-specialization');
    const modalFilterExperienceMin = document.getElementById('filter-experience-min');
    const modalFilterExperienceMax = document.getElementById('filter-experience-max');
    const modalFilterRatingMin = document.getElementById('filter-rating-min');
    const applyFilterBtn = document.getElementById('apply-filter');
    const resetFilterBtn = document.querySelector('.reset-filter');
    
    // Функция фильтрации менторов
    function filterMentors() {
        const mentors = document.querySelectorAll('.mentor-row');
        const statusValue = statusFilter.value;
        const specializationValue = specializationFilter.value;
        const searchValue = mentorSearch.value.toLowerCase();
        
        // Дополнительные фильтры из модального окна
        const expMin = modalFilterExperienceMin && modalFilterExperienceMin.value ? parseInt(modalFilterExperienceMin.value) : 0;
        const expMax = modalFilterExperienceMax && modalFilterExperienceMax.value ? parseInt(modalFilterExperienceMax.value) : 100;
        const ratingMin = modalFilterRatingMin && modalFilterRatingMin.value ? parseFloat(modalFilterRatingMin.value) : 0;
        
        mentors.forEach(mentor => {
            const mentorStatus = mentor.querySelector('.status');
            const mentorName = mentor.querySelector('.mentor-info .name');
            const mentorSpecialization = mentor.querySelector('td:nth-child(4)');
            const mentorExperience = mentor.querySelector('td:nth-child(5)').textContent;
            const mentorRating = parseFloat(mentor.querySelector('.rating span').textContent);
            
            // Парсим опыт (например, "5 лет" -> 5)
            const experienceYears = parseInt(mentorExperience);
            
            // Проверка условий фильтрации
            const matchesStatus = statusValue === 'all' || (mentorStatus && mentorStatus.classList.contains(statusValue));
            const matchesSpecialization = specializationValue === 'all' || (mentorSpecialization && mentorSpecialization.textContent.toLowerCase().includes(specializationValue.toLowerCase()));
            const matchesSearch = !searchValue || (mentorName && mentorName.textContent.toLowerCase().includes(searchValue));
            const matchesExperience = experienceYears >= expMin && experienceYears <= expMax;
            const matchesRating = mentorRating >= ratingMin;
            
            if (matchesStatus && matchesSpecialization && matchesSearch && matchesExperience && matchesRating) {
                mentor.style.display = '';
            } else {
                mentor.style.display = 'none';
            }
        });
        
        // Обновляем счетчик отображаемых менторов
        updateMentorCount();
    }
    
    // Функция обновления счетчика менторов
    function updateMentorCount() {
        const visibleMentors = Array.from(document.querySelectorAll('.mentor-row')).filter(m => m.style.display !== 'none').length;
        const totalMentors = document.querySelectorAll('.mentor-row').length;
        const showingEntries = document.querySelector('.showing-entries');
        
        if (showingEntries) {
            showingEntries.textContent = `Показано ${visibleMentors} из ${totalMentors} менторов`;
        }
    }
    
    // Добавляем обработчики событий для фильтров
    if (statusFilter) {
        statusFilter.addEventListener('change', filterMentors);
    }
    
    if (specializationFilter) {
        specializationFilter.addEventListener('change', filterMentors);
    }
    
    if (mentorSearch) {
        mentorSearch.addEventListener('input', filterMentors);
    }
    
    // Применение и сброс расширенных фильтров
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', function() {
            // Синхронизируем селекты с модальными фильтрами
            if (statusFilter && modalFilterStatus) {
                statusFilter.value = modalFilterStatus.value;
            }
            if (specializationFilter && modalFilterSpecialization) {
                specializationFilter.value = modalFilterSpecialization.value;
            }
            
            // Применяем фильтры
            filterMentors();
            
            // Закрываем модальное окно
            advancedFilterModal.classList.remove('open');
        });
    }
    
    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', function() {
            // Сбрасываем все фильтры
            if (statusFilter) statusFilter.value = 'all';
            if (specializationFilter) specializationFilter.value = 'all';
            if (mentorSearch) mentorSearch.value = '';
            
            if (modalFilterStatus) modalFilterStatus.value = 'all';
            if (modalFilterSpecialization) modalFilterSpecialization.value = 'all';
            if (modalFilterExperienceMin) modalFilterExperienceMin.value = '';
            if (modalFilterExperienceMax) modalFilterExperienceMax.value = '';
            if (modalFilterRatingMin) modalFilterRatingMin.value = '';
            
            // Применяем сброшенные фильтры
            filterMentors();
        });
    }
    
    // Инициализируем счетчик менторов при загрузке
    updateMentorCount();
    
    // Добавление обработчиков для пунктов меню в боковой панели
    const sidebarMenuItems = document.querySelectorAll('.sidebar-menu ul li a');
    sidebarMenuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Если ссылка не ведет никуда (#), предотвращаем переход
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
            }
            
            // Удаляем класс active у всех пунктов
            sidebarMenuItems.forEach(menuItem => {
                menuItem.parentElement.classList.remove('active');
            });
            
            // Добавляем класс active текущему пункту
            this.parentElement.classList.add('active');
            
            // Если мобильная версия, закрываем меню
            if (window.innerWidth < 992) {
                document.body.classList.add('sidebar-collapsed');
            }
        });
    });
    
    // Модальное окно добавления/редактирования ментора
    const addMentorBtn = document.querySelector('.add-mentor-btn');
    const mentorModal = document.getElementById('mentor-modal');
    const mentorForm = document.getElementById('mentor-form');
    const saveMentorBtn = document.getElementById('save-mentor');
    
    // Открытие модального окна для добавления ментора
    if (addMentorBtn && mentorModal) {
        addMentorBtn.addEventListener('click', function() {
            // Сбрасываем форму и устанавливаем заголовок
            mentorForm.reset();
            document.getElementById('modal-title').textContent = 'Добавить нового ментора';
            mentorModal.classList.add('open');
        });
    }
    
    // Обработка кнопок редактирования
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const mentorId = this.getAttribute('data-id');
            const mentorRow = this.closest('tr');
            
            // Заполняем форму данными выбранного ментора
            document.getElementById('mentor-id').value = mentorId;
            document.getElementById('mentor-name').value = mentorRow.querySelector('.name').textContent;
            document.getElementById('mentor-specialization').value = mentorRow.querySelector('.specialization').textContent.includes('Frontend') ? 'frontend' :
                                                              mentorRow.querySelector('.specialization').textContent.includes('Backend') ? 'backend' :
                                                              mentorRow.querySelector('.specialization').textContent.includes('UI/UX') ? 'design' : 'marketing';
            
            // Устанавливаем статус
            const statusText = mentorRow.querySelector('.status').textContent.toLowerCase();
            document.getElementById('mentor-status').value = statusText.includes('активный') ? 'active' :
                                                             statusText.includes('неактивный') ? 'inactive' : 'vacation';
            
            // Опыт (парсим из текста, например "5 лет" -> 5)
            const experienceText = mentorRow.querySelector('td:nth-child(5)').textContent;
            const experienceYears = parseInt(experienceText);
            document.getElementById('mentor-experience').value = experienceYears;
            
            // Устанавливаем некоторые примерные данные (в реальном приложении эти данные бы загружались с сервера)
            document.getElementById('mentor-email').value = `${mentorId.toLowerCase()}@example.com`;
            document.getElementById('mentor-phone').value = '+7 (900) 123-45-67';
            document.getElementById('mentor-rate').value = Math.floor(Math.random() * 50) + 20; // Случайная ставка от 20 до 70
            document.getElementById('mentor-bio').value = `Опытный специалист в области ${mentorRow.querySelector('.specialization').textContent}. Работает с нами ${experienceYears} лет.`;
            
            // Меняем заголовок модального окна
            document.getElementById('modal-title').textContent = 'Редактировать ментора';
            
            // Открываем модальное окно
            mentorModal.classList.add('open');
        });
    });
    
    // Обработка кнопок удаления
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const mentorId = this.getAttribute('data-id');
            const mentorName = this.closest('tr').querySelector('.name').textContent;
            
            if (confirm(`Вы уверены, что хотите удалить ментора ${mentorName} (${mentorId})?`)) {
                // В реальном приложении здесь был бы AJAX-запрос на удаление
                this.closest('tr').remove();
                
                // Обновляем счетчик менторов
                updateMentorCount();
                
                // Показываем уведомление об успешном удалении
                alert(`Ментор ${mentorName} успешно удален`);
            }
        });
    });
    
    // Сохранение данных ментора
    if (saveMentorBtn && mentorForm) {
        saveMentorBtn.addEventListener('click', function() {
            // Проверяем валидность формы
            if (mentorForm.checkValidity()) {
                // В реальном приложении здесь был бы AJAX-запрос для сохранения данных
                
                // Закрываем модальное окно
                mentorModal.classList.remove('open');
                
                // Показываем уведомление об успешном сохранении
                alert('Данные ментора успешно сохранены');
            } else {
                // Запускаем нативную валидацию формы
                mentorForm.reportValidity();
            }
        });
    }
    
    // Обработка загрузки фото ментора
    const fileInput = document.getElementById('mentor-photo');
    const fileName = document.getElementById('file-name');
    
    if (fileInput && fileName) {
        fileInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                fileName.textContent = this.files[0].name;
                
                // Предпросмотр изображения
                const reader = new FileReader();
                reader.onload = function(e) {
                    // Создаем предпросмотр изображения
                    const previewContainer = document.querySelector('.file-upload');
                    let previewImg = previewContainer.querySelector('.preview-img');
                    
                    if (!previewImg) {
                        previewImg = document.createElement('div');
                        previewImg.className = 'preview-img';
                        previewImg.style.width = '60px';
                        previewImg.style.height = '60px';
                        previewImg.style.borderRadius = '50%';
                        previewImg.style.backgroundSize = 'cover';
                        previewImg.style.backgroundPosition = 'center';
                        previewImg.style.marginLeft = '10px';
                        previewContainer.appendChild(previewImg);
                    }
                    
                    previewImg.style.backgroundImage = `url(${e.target.result})`;
                };
                
                reader.readAsDataURL(this.files[0]);
            }
        });
        
        // Клик по области загрузки открывает диалог выбора файла
        const uploadArea = document.querySelector('.upload-area');
        if (uploadArea) {
            uploadArea.addEventListener('click', function() {
                fileInput.click();
            });
        }
    }
    
    // Обработка выбора всех менторов
    const selectAllCheckbox = document.getElementById('select-all');
    const mentorCheckboxes = document.querySelectorAll('.select-mentor');
    
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            mentorCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }
    
    // Обновление состояния "выбрать все" при изменении отдельных чекбоксов
    mentorCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const allChecked = Array.from(mentorCheckboxes).every(cb => cb.checked);
            const someChecked = Array.from(mentorCheckboxes).some(cb => cb.checked);
            
            selectAllCheckbox.checked = allChecked;
            selectAllCheckbox.indeterminate = someChecked && !allChecked;
        });
    });
    
    // Обработка кнопки обновления данных
    const refreshBtn = document.querySelector('.refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            // Имитация обновления данных
            this.classList.add('rotating');
            
            setTimeout(() => {
                this.classList.remove('rotating');
                alert('Данные обновлены');
            }, 1000);
        });
    }
    
    // Добавляем стиль вращения для кнопки обновления
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .rotating {
            animation: rotate 1s linear infinite;
        }
    `;
    document.head.appendChild(style);
});
