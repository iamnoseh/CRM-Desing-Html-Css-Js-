/**
 * CRM System - Функциональность страницы студентов
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Students page initialized');
    
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
    
    // Обработчик для кнопки выхода
    const logoutButton = document.querySelector('.sidebar-footer a');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            // Можно добавить дополнительные действия при выходе
            console.log('Выход из системы');
        });
    }
    
    // Модальное окно
    const modal = document.getElementById('student-modal');
    const addStudentBtn = document.getElementById('add-student');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelBtn = document.getElementById('cancel-student');
    const saveBtn = document.getElementById('save-student');
    const studentForm = document.getElementById('student-form');
    const actionBtns = document.querySelectorAll('.action-btn');
    
    // Открыть модальное окно для добавления студента
    if (addStudentBtn) {
        addStudentBtn.addEventListener('click', function() {
            openModal('add');
        });
    }
    
    // Закрыть модальное окно
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }
    
    // Обработка событий кнопок действий (просмотр, редактирование, удаление)
    actionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.querySelector('i').className;
            const row = this.closest('tr');
            const studentId = row.querySelector('td:nth-child(2)').textContent;
            const studentName = row.querySelector('.student-info .name').textContent;
            
            if (action.includes('fa-eye')) {
                // Просмотр студента
                console.log('View student:', studentId, studentName);
            } else if (action.includes('fa-edit')) {
                // Редактирование студента
                console.log('Edit student:', studentId, studentName);
                openModal('edit', row);
            } else if (action.includes('fa-trash')) {
                // Удаление студента
                if (confirm(`Вы уверены, что хотите удалить студента ${studentName}?`)) {
                    console.log('Delete student:', studentId, studentName);
                    row.remove(); // Для демонстрации
                }
            }
        });
    });
    
    // При клике вне модального окна закрыть его
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Обработка формы
    if (saveBtn && studentForm) {
        saveBtn.addEventListener('click', function() {
            // Проверка валидации формы
            if (studentForm.checkValidity()) {
                const formData = new FormData(studentForm);
                const studentData = {};
                
                formData.forEach((value, key) => {
                    studentData[key] = value;
                });
                
                console.log('Student data:', studentData);
                
                // Здесь можно добавить AJAX-запрос для сохранения данных
                
                // Для демонстрации добавим новую строку в таблицу
                if (modal.dataset.mode === 'add') {
                    addStudentToTable(studentData);
                } else {
                    updateStudentInTable(modal.dataset.studentId, studentData);
                }
                
                closeModal();
                studentForm.reset();
            } else {
                studentForm.reportValidity();
            }
        });
    }
    
    // Обработка загрузки файла
    const fileInput = document.getElementById('student-photo');
    const fileName = document.querySelector('.file-name');
    
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
                        previewImg.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                        previewContainer.appendChild(previewImg);
                    }
                    
                    previewImg.style.backgroundImage = `url(${e.target.result})`;
                };
                reader.readAsDataURL(this.files[0]);
            } else {
                fileName.textContent = 'Файл не выбран';
                const previewImg = document.querySelector('.preview-img');
                if (previewImg) {
                    previewImg.remove();
                }
            }
        });
    }
    
    // Добавляем мобильное определение
    function isMobile() {
        return window.innerWidth < 768;
    }
    
    // Проверяем, если мобильное устройство, добавляем класс mobile
    if (isMobile()) {
        document.body.classList.add('mobile-view');
    }
    
    // Обрабатываем изменение размера окна
    window.addEventListener('resize', function() {
        if (isMobile()) {
            document.body.classList.add('mobile-view');
        } else {
            document.body.classList.remove('mobile-view');
        }
    });
    
    // Выбор всех чекбоксов
    const selectAll = document.querySelector('.select-all');
    const selectItems = document.querySelectorAll('.select-item');
    
    if (selectAll) {
        selectAll.addEventListener('change', function() {
            selectItems.forEach(item => {
                item.checked = this.checked;
            });
        });
    }
    
    // Обновление состояния "выбрать все" при изменении отдельных чекбоксов
    selectItems.forEach(item => {
        item.addEventListener('change', function() {
            const allChecked = Array.from(selectItems).every(checkbox => checkbox.checked);
            const someChecked = Array.from(selectItems).some(checkbox => checkbox.checked);
            
            if (selectAll) {
                selectAll.checked = allChecked;
                selectAll.indeterminate = someChecked && !allChecked;
            }
        });
    });
    
    // Функции
    
    // Открыть модальное окно
    function openModal(mode, row = null) {
        const modalTitle = modal.querySelector('.modal-header h2');
        modal.classList.add('open');
        modal.dataset.mode = mode;
        
        if (mode === 'add') {
            modalTitle.textContent = 'Добавить студента';
            studentForm.reset();
        } else if (mode === 'edit') {
            modalTitle.textContent = 'Редактировать студента';
            
            // Получить данные студента из строки таблицы
            const studentId = row.querySelector('td:nth-child(2)').textContent;
            const studentName = row.querySelector('.student-info .name').textContent;
            const parts = studentName.split(' ');
            const firstName = parts[0];
            const lastName = parts.length > 1 ? parts[1] : '';
            const course = row.querySelector('.student-info .course').textContent;
            const group = row.querySelector('td:nth-child(4)').textContent;
            const email = row.querySelector('td:nth-child(5)').textContent;
            const phone = row.querySelector('td:nth-child(6)').textContent;
            const balance = row.querySelector('td:nth-child(7)').textContent.replace('$', '');
            const status = row.querySelector('.status').textContent.toLowerCase();
            
            // Заполнить форму данными
            document.getElementById('first-name').value = firstName;
            document.getElementById('last-name').value = lastName;
            document.getElementById('email').value = email;
            document.getElementById('phone').value = phone;
            document.getElementById('group').value = group;
            document.getElementById('course').value = getCourseValue(course);
            document.getElementById('balance').value = balance;
            document.getElementById('status').value = getStatusValue(status);
            
            modal.dataset.studentId = studentId;
        }
    }
    
    // Закрыть модальное окно
    function closeModal() {
        modal.classList.remove('open');
    }
    
    // Конвертировать текст курса в значение для select
    function getCourseValue(courseText) {
        const courseMap = {
            'программирование': 'programming',
            'дизайн': 'design',
            'маркетинг': 'marketing',
            'иностранные языки': 'languages',
            'бизнес': 'business'
        };
        
        return courseMap[courseText.toLowerCase()] || '';
    }
    
    // Конвертировать текст статуса в значение для select
    function getStatusValue(statusText) {
        statusText = statusText.trim().toLowerCase();
        if (statusText === 'активный') return 'active';
        if (statusText === 'неактивный') return 'inactive';
        if (statusText === 'должник') return 'overdue';
        return 'active';
    }
    
    // Добавить студента в таблицу
    function addStudentToTable(data) {
        const tableBody = document.querySelector('.table tbody');
        if (!tableBody) return;
        
        // Генерируем ID для нового студента
        const newId = '#ST-' + (1000 + Math.floor(Math.random() * 9000));
        
        // Создаем новую строку
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>
                <input type="checkbox" class="select-item">
            </td>
            <td>${newId}</td>
            <td>
                <div class="student-info">
                    <img src="assets/default-avatar.jpg" alt="Student">
                    <div>
                        <p class="name">${data['first-name']} ${data['last-name']}</p>
                        <p class="course">${getCourseDisplayName(data.course)}</p>
                    </div>
                </div>
            </td>
            <td>${data.group}</td>
            <td>${data.email}</td>
            <td>${data.phone}</td>
            <td class="balance ${getBalanceClass(data.balance)}">$${parseFloat(data.balance).toFixed(2)}</td>
            <td><span class="status ${data.status}">${getStatusDisplayName(data.status)}</span></td>
            <td>${getCurrentDate()}</td>
            <td>
                <div class="actions">
                    <button class="action-btn"><i class="fas fa-eye"></i></button>
                    <button class="action-btn"><i class="fas fa-edit"></i></button>
                    <button class="action-btn"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;
        
        // Добавляем строку в таблицу
        tableBody.prepend(newRow);
        
        // Добавляем обработчики для новых кнопок
        const newButtons = newRow.querySelectorAll('.action-btn');
        newButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const action = this.querySelector('i').className;
                const row = this.closest('tr');
                const studentId = row.querySelector('td:nth-child(2)').textContent;
                const studentName = row.querySelector('.student-info .name').textContent;
                
                if (action.includes('fa-eye')) {
                    console.log('View student:', studentId, studentName);
                } else if (action.includes('fa-edit')) {
                    openModal('edit', row);
                } else if (action.includes('fa-trash')) {
                    if (confirm(`Вы уверены, что хотите удалить студента ${studentName}?`)) {
                        console.log('Delete student:', studentId, studentName);
                        row.remove();
                    }
                }
            });
        });
        
        // Обновляем отображение количества записей
        updateRecordsCount();
    }
    
    // Обновить данные студента в таблице
    function updateStudentInTable(studentId, data) {
        const rows = document.querySelectorAll('.table tbody tr');
        
        for (const row of rows) {
            const id = row.querySelector('td:nth-child(2)').textContent;
            
            if (id === studentId) {
                // Обновляем данные в строке
                row.querySelector('.student-info .name').textContent = `${data['first-name']} ${data['last-name']}`;
                row.querySelector('.student-info .course').textContent = getCourseDisplayName(data.course);
                row.querySelector('td:nth-child(4)').textContent = data.group;
                row.querySelector('td:nth-child(5)').textContent = data.email;
                row.querySelector('td:nth-child(6)').textContent = data.phone;
                
                const balanceCell = row.querySelector('td:nth-child(7)');
                balanceCell.textContent = `$${parseFloat(data.balance).toFixed(2)}`;
                balanceCell.className = `balance ${getBalanceClass(data.balance)}`;
                
                const statusSpan = row.querySelector('.status');
                statusSpan.textContent = getStatusDisplayName(data.status);
                statusSpan.className = `status ${data.status}`;
                
                break;
            }
        }
    }
    
    // Получить отображаемое имя курса по значению
    function getCourseDisplayName(courseValue) {
        const courseMap = {
            'programming': 'Программирование',
            'design': 'Дизайн',
            'marketing': 'Маркетинг',
            'languages': 'Иностранные языки',
            'business': 'Бизнес'
        };
        
        return courseMap[courseValue] || courseValue;
    }
    
    // Получить отображаемое имя статуса по значению
    function getStatusDisplayName(statusValue) {
        const statusMap = {
            'active': 'Активный',
            'inactive': 'Неактивный',
            'overdue': 'Должник'
        };
        
        return statusMap[statusValue] || statusValue;
    }
    
    // Получить класс баланса
    function getBalanceClass(balance) {
        const value = parseFloat(balance);
        if (value > 0) return 'positive';
        if (value < 0) return 'negative';
        return 'neutral';
    }
    
    // Получить текущую дату в формате ДД.ММ.ГГГГ
    function getCurrentDate() {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        
        return `${day}.${month}.${year}`;
    }
    
    // Обновить отображение количества записей
    function updateRecordsCount() {
        const countElement = document.querySelector('.showing-entries');
        const rows = document.querySelectorAll('.table tbody tr');
        
        if (countElement) {
            countElement.textContent = `Показано 1-${rows.length} из ${2845 + rows.length - 5} записей`;
        }
    }
});
