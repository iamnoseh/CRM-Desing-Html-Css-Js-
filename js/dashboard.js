// Инициализация скриптов при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
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

    // Настройка Chart.js
    Chart.defaults.font.family = "'Poppins', sans-serif";
    Chart.defaults.font.size = 13;
    Chart.defaults.color = '#6c757d';
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(33, 37, 41, 0.8)';
    Chart.defaults.plugins.tooltip.padding = 10;
    Chart.defaults.plugins.tooltip.cornerRadius = 6;
    Chart.defaults.plugins.tooltip.titleFont = { size: 14, weight: 'bold' };
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    
    // Создание малых трендовых графиков для статистических карточек
    createSmallTrendCharts();
    
    // Создание основных диаграмм
    createMainCharts();
    
    // Обработчик переключения периодов
    setupPeriodSelectors();
    
    // Обработчик переключения видов диаграмм
    setupChartViewSelectors();
});

// Создание малых трендовых графиков
function createSmallTrendCharts() {
    // Данные для малых графиков
    const trendData = {
        students: [2510, 2580, 2640, 2720, 2790, 2845],
        revenue: [42000, 45200, 47500, 48900, 50300, 52100],
        groups: [128, 132, 135, 139, 142, 145],
        payments: [82, 84, 85, 87, 88.5, 89.5]
    };
    
    // Опции для малых графиков
    const smallChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { 
            legend: { display: false },
            tooltip: { enabled: false }
        },
        scales: {
            x: { display: false },
            y: { display: false }
        },
        elements: {
            line: { tension: 0.4, borderWidth: 2 },
            point: { radius: 0 }
        }
    };
    
    // Создание графика тренда студентов
    if (document.getElementById('studentTrendSmall')) {
        new Chart(document.getElementById('studentTrendSmall'), {
            type: 'line',
            data: {
                labels: ['Дек', 'Янв', 'Фев', 'Мар', 'Апр', 'Май'],
                datasets: [{
                    data: trendData.students,
                    borderColor: '#4361ee',
                    backgroundColor: 'rgba(67, 97, 238, 0.1)',
                    fill: true
                }]
            },
            options: smallChartOptions
        });
    }
    
    // Создание графика дохода
    if (document.getElementById('revenueTrendChart')) {
        new Chart(document.getElementById('revenueTrendChart'), {
            type: 'line',
            data: {
                labels: ['Дек', 'Янв', 'Фев', 'Мар', 'Апр', 'Май'],
                datasets: [{
                    data: trendData.revenue,
                    borderColor: '#4cc9f0',
                    backgroundColor: 'rgba(76, 201, 240, 0.1)',
                    fill: true
                }]
            },
            options: smallChartOptions
        });
    }
    
    // Создание графика групп
    if (document.getElementById('groupsTrendChart')) {
        new Chart(document.getElementById('groupsTrendChart'), {
            type: 'line',
            data: {
                labels: ['Дек', 'Янв', 'Фев', 'Мар', 'Апр', 'Май'],
                datasets: [{
                    data: trendData.groups,
                    borderColor: '#7209b7',
                    backgroundColor: 'rgba(114, 9, 183, 0.1)',
                    fill: true
                }]
            },
            options: smallChartOptions
        });
    }
    
    // Создание графика оплат
    if (document.getElementById('paymentsTrendChart')) {
        new Chart(document.getElementById('paymentsTrendChart'), {
            type: 'line',
            data: {
                labels: ['Дек', 'Янв', 'Фев', 'Мар', 'Апр', 'Май'],
                datasets: [{
                    data: trendData.payments,
                    borderColor: '#f72585',
                    backgroundColor: 'rgba(247, 37, 133, 0.1)',
                    fill: true
                }]
            },
            options: smallChartOptions
        });
    }
}

// Создание основных диаграмм
function createMainCharts() {
    // 1. График дохода по центрам
    createCenterIncomeChart();
    
    // 2. График распределения студентов
    createStudentsDistributionChart();
    
    // 3. График посещаемости
    createAttendanceChart();
    
    // 4. График статуса оплат
    createPaymentsStatusChart();
    
    // 5. График распределения групп по центрам
    createGroupsDistributionChart();
    
    // 6. График активности студентов
    createStudentActivityChart();
}

// График дохода по центрам
function createCenterIncomeChart() {
    const ctx = document.getElementById('centerIncomeChart');
    if (!ctx) return;
    
    const centerNames = ['Центр 1', 'Центр 2', 'Центр 3', 'Центр 4', 'Центр 5'];
    
    const data = {
        labels: ['Декабрь', 'Январь', 'Февраль', 'Март', 'Апрель', 'Май'],
        datasets: [
            {
                label: 'Центр 1',
                data: [12500, 13200, 14800, 15300, 16200, 17500],
                borderColor: '#4361ee',
                backgroundColor: 'rgba(67, 97, 238, 0.1)',
                tension: 0.4,
                fill: false,
                borderWidth: 3
            },
            {
                label: 'Центр 2',
                data: [10200, 11000, 11500, 12300, 13100, 14200],
                borderColor: '#3a0ca3',
                backgroundColor: 'rgba(58, 12, 163, 0.1)',
                tension: 0.4,
                fill: false,
                borderWidth: 3
            },
            {
                label: 'Центр 3',
                data: [8500, 9000, 9500, 10200, 11000, 11800],
                borderColor: '#4cc9f0',
                backgroundColor: 'rgba(76, 201, 240, 0.1)',
                tension: 0.4,
                fill: false,
                borderWidth: 3
            },
            {
                label: 'Центр 4',
                data: [5800, 6200, 6700, 7100, 7500, 8100],
                borderColor: '#f72585',
                backgroundColor: 'rgba(247, 37, 133, 0.1)',
                tension: 0.4,
                fill: false,
                borderWidth: 3
            },
            {
                label: 'Центр 5',
                data: [3000, 3200, 3500, 3800, 4050, 4500],
                borderColor: '#7209b7',
                backgroundColor: 'rgba(114, 9, 183, 0.1)',
                tension: 0.4,
                fill: false,
                borderWidth: 3
            }
        ]
    };
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return context.dataset.label + ': $' + context.raw.toLocaleString();
                    }
                }
            },
            legend: {
                position: 'top',
                align: 'end'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return '$' + value.toLocaleString();
                    }
                },
                grid: {
                    drawBorder: false,
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };
    
    new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });
}

// График распределения студентов
function createStudentsDistributionChart() {
    const ctx = document.getElementById('studentsDistributionChart');
    if (!ctx) return;
    
    const data = {
        labels: ['Программирование', 'Дизайн', 'Маркетинг', 'Иностранные языки', 'Бизнес', 'Другое'],
        datasets: [{
            data: [30, 22, 18, 15, 10, 5],
            backgroundColor: [
                '#4361ee', '#3a0ca3', '#4cc9f0', 
                '#f72585', '#7209b7', '#560bad'
            ],
            borderWidth: 0,
            hoverOffset: 15
        }]
    };
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    boxWidth: 15,
                    padding: 15
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return context.label + ': ' + context.formattedValue + '%';
                    }
                }
            }
        },
        animation: {
            animateScale: true,
            animateRotate: true
        }
    };
    
    new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: options
    });
}

// График посещаемости занятий
function createAttendanceChart() {
    const ctx = document.getElementById('attendanceChart');
    if (!ctx) return;
    
    const data = {
        labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
        datasets: [
            {
                label: 'Посетили',
                data: [92, 88, 90, 85, 80, 95, 98],
                backgroundColor: '#4cc9f0',
                borderRadius: 6,
                barThickness: 12
            },
            {
                label: 'Пропустили',
                data: [8, 12, 10, 15, 20, 5, 2],
                backgroundColor: '#f72585',
                borderRadius: 6,
                barThickness: 12
            }
        ]
    };
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                align: 'end'
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return context.dataset.label + ': ' + context.raw + '%';
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    callback: function(value) {
                        return value + '%';
                    }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            }
        }
    };
    
    new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });
}

// График статуса оплат
function createPaymentsStatusChart() {
    const ctx = document.getElementById('paymentsStatusChart');
    if (!ctx) return;
    
    const data = {
        labels: ['Оплачено', 'Ожидание оплаты', 'Просрочено'],
        datasets: [{
            data: [89.5, 7.5, 3],
            backgroundColor: [
                '#4cc9f0',
                '#ffd166',
                '#f72585'
            ],
            borderWidth: 0,
            hoverOffset: 10
        }]
    };
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom'
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return context.label + ': ' + context.formattedValue + '%';
                    }
                }
            }
        }
    };
    
    new Chart(ctx, {
        type: 'pie',
        data: data,
        options: options
    });
}

// График распределения групп по центрам
function createGroupsDistributionChart() {
    const ctx = document.getElementById('groupsDistributionChart');
    if (!ctx) return;
    
    const data = {
        labels: ['Центр 1', 'Центр 2', 'Центр 3', 'Центр 4', 'Центр 5'],
        datasets: [{
            axis: 'y',
            data: [42, 35, 28, 21, 19],
            fill: false,
            backgroundColor: [
                '#4361ee',
                '#3a0ca3',
                '#4cc9f0',
                '#f72585',
                '#7209b7'
            ],
            borderWidth: 0,
            borderRadius: 6,
            barThickness: 20
        }]
    };
    
    const options = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return context.label + ': ' + context.formattedValue + ' групп';
                    }
                }
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            y: {
                grid: {
                    display: false
                }
            }
        }
    };
    
    new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });
}

// График активности студентов
function createStudentActivityChart() {
    const ctx = document.getElementById('studentActivityChart');
    if (!ctx) return;
    
    const data = {
        labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
        datasets: [{
            label: 'Активность',
            data: [65, 78, 72, 83, 92, 55, 40],
            fill: true,
            backgroundColor: 'rgba(114, 9, 183, 0.1)',
            borderColor: '#7209b7',
            tension: 0.4,
            pointRadius: 6,
            pointBackgroundColor: '#7209b7',
            pointBorderColor: 'white',
            pointBorderWidth: 2,
            pointHoverRadius: 8,
            pointHoverBorderWidth: 3
        }]
    };
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return 'Активность: ' + context.formattedValue + '%';
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    callback: function(value) {
                        return value + '%';
                    }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };
    
    new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });
}

// Обработчик переключения периодов
function setupPeriodSelectors() {
    const periodButtons = document.querySelectorAll('.period-btn');
    periodButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const parent = this.closest('.chart-actions').querySelector('.period-selector');
            parent.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Здесь можно добавить логику для обновления данных графика
        });
    });
}

// Обработчик переключения видов диаграмм
function setupChartViewSelectors() {
    const viewButtons = document.querySelectorAll('.chart-view-btn');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const parent = this.closest('.chart-actions').querySelector('.chart-view-options');
            parent.querySelectorAll('.chart-view-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Здесь можно добавить логику для изменения типа графика
        });
    });
}