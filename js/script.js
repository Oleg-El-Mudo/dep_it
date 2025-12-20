document.addEventListener('DOMContentLoaded', function() {
    // 1. Сначала объявляем ВСЕ переменные
    const questionsTextarea = document.getElementById('questions');
    const studentsCountInput = document.getElementById('studentsCount');
    const questionsPerTicketInput = document.getElementById('questionsPerTicket');
    const generateBtn = document.getElementById('generateBtn');
    const exportBtn = document.getElementById('exportBtn');
    const slotMachine = document.getElementById('slotMachine');
    const currentTicketContainer = document.getElementById('currentTicketContainer');
    const resultsContainer = document.getElementById('resultsContainer');
    const notification = document.getElementById('notification');
    const totalQuestionsSpan = document.getElementById('totalQuestions');
    const generatedTicketsSpan = document.getElementById('generatedTickets');
    const uniqueQuestionsSpan = document.getElementById('uniqueQuestions');
    const currentTicketSpan = document.getElementById('currentTicket');
    const totalTicketsSpan = document.getElementById('totalTickets');
    const progressFill = document.getElementById('progressFill');
    const currentTicketSection = document.getElementById('currentTicketSection');
    const themeSelect = document.getElementById('theme-select');
    const snowContainer = document.getElementById('snow-container');
    const newyearTheme = document.getElementById('newyear-theme');
    
    // Новые переменные для режима "теория+практика"
    const modeSelect = document.getElementById('modeSelect');
    const practiceContainer = document.getElementById('practiceContainer');
    const tasksCountInput = document.getElementById('tasksCount');
    const tasksPerTicketInput = document.getElementById('tasksPerTicket');
    const generateTasksBtn = document.getElementById('generateTasksBtn');
    const tasksInputContainer = document.getElementById('tasksInputContainer');
    
    let slots = [];
    let isGenerating = false;
    let generatedTickets = [];
    let tasks = []; // Массив для хранения задач

    // 2. Функция для создания снежинок
    function createSnowflakes() {
        if (!snowContainer) return;
        
        snowContainer.innerHTML = '';
        
        for (let i = 0; i < 50; i++) {
            const snowflake = document.createElement('div');
            snowflake.classList.add('snowflake');
            
            const size = Math.random() * 3 + 2;
            snowflake.style.width = `${size}px`;
            snowflake.style.height = `${size}px`;
            snowflake.style.left = `${Math.random() * 100}%`;
            snowflake.style.animationDelay = `${Math.random() * 5}s`;
            
            const duration = Math.random() * 10 + 5;
            snowflake.style.animationDuration = `${duration}s`;
            snowflake.style.opacity = Math.random() * 0.5 + 0.3;
            
            snowContainer.appendChild(snowflake);
        }
    }

    // 3. Функция для переключения темы
    function switchTheme(theme) {
        const body = document.body;
        
        body.classList.remove('newyear-theme');
        
        if (newyearTheme) {
            newyearTheme.disabled = true;
        }
        
        if (snowContainer) {
            snowContainer.style.display = 'none';
        }
        
        switch (theme) {
            case 'casino':
                break;
                
            case 'newyear':
                body.classList.add('newyear-theme');
                if (newyearTheme) {
                    newyearTheme.disabled = false;
                }
                if (snowContainer) {
                    snowContainer.style.display = 'block';
                    createSnowflakes();
                }
                break;
                
            case 'halloween':
                showNotification('Тема Хэллоуин скоро будет доступна!', 'info');
                break;
        }
        
        localStorage.setItem('selectedTheme', theme);
    }

    // 4. Функция для переключения режимов
    function switchMode(mode) {
        const isPracticeMode = mode === 'theory_practice';
        
        practiceContainer.style.display = isPracticeMode ? 'block' : 'none';
        
        questionsTextarea.placeholder = isPracticeMode 
            ? 'Введите теоретические вопросы здесь...' 
            : 'Введите вопросы здесь...';
        
        if (!isPracticeMode) {
            tasksCountInput.value = 0;
            tasksPerTicketInput.value = 0;
            tasksInputContainer.innerHTML = '';
            tasks = [];
            tasksPerTicketInput.disabled = true;
        }
        
        localStorage.setItem('selectedMode', mode);
    }

    // 5. УНИВЕРСАЛЬНАЯ функция для показа уведомлений
    function showNotification(message, type = 'success') {
        if (!notification) return;
        
        notification.textContent = message;
        notification.className = 'notification';
        
        const isNewYearTheme = document.body.classList.contains('newyear-theme');
        
        if (type === 'error') {
            notification.style.background = isNewYearTheme ? 'var(--ny-red, #c62828)' : 'var(--casino-red, #c62828)';
        } else if (type === 'info') {
            notification.style.background = isNewYearTheme ? 'var(--ny-blue, #1565c0)' : 'var(--casino-blue, #1565c0)';
        } else {
            notification.style.background = isNewYearTheme ? 'var(--ny-green, #1b5e20)' : 'var(--casino-green, #2e7d32)';
        }
        
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // 6. Функции управления видимостью текущего билета
    function showCurrentTicketSection() {
        currentTicketSection.classList.remove('hidden');
    }
    
    function hideCurrentTicketSection() {
        currentTicketSection.classList.add('hidden');
    }
    
    // 7. Функции для работы с вопросами
    function getQuestionsList() {
        return questionsTextarea.value
            .split('\n')
            .map(q => q.trim())
            .filter(q => q.length > 0);
    }
    
    function updateStats() {
        const questions = getQuestionsList();
        totalQuestionsSpan.textContent = questions.length;
    }
    
    // 8. Функции для работы с задачами
    function getTasksList() {
        const taskElements = tasksInputContainer.querySelectorAll('textarea');
        const tasksList = [];
        
        taskElements.forEach(textarea => {
            const task = textarea.value.trim();
            if (task.length > 0) {
                tasksList.push(task);
            }
        });
        
        return tasksList;
    }
    
    // 9. Функции для работы со слотами
    function createSlots(count) {
        slotMachine.innerHTML = '';
        slots = [];
        
        for (let i = 0; i < count; i++) {
            const slot = document.createElement('div');
            slot.className = 'slot';
            
            const reel = document.createElement('div');
            reel.className = 'slot-reel';
            reel.id = `reel-${i}`;
            
            const center = document.createElement('div');
            center.className = 'slot-center';
            
            slot.appendChild(reel);
            slot.appendChild(center);
            slotMachine.appendChild(slot);
            
            slots.push({
                element: reel,
                position: 0,
                spinning: false
            });
        }
    }
    
    function fillSlotReel(slotIndex, items) {
        const reel = slots[slotIndex].element;
        reel.innerHTML = '';
        
        const extendedItems = [...items, ...items, ...items];
        
        extendedItems.forEach((item, index) => {
            const slotItem = document.createElement('div');
            slotItem.className = 'slot-item';
            slotItem.textContent = item;
            slotItem.dataset.index = index % items.length;
            reel.appendChild(slotItem);
        });
        
        slots[slotIndex].position = items.length * 140;
        reel.style.transform = `translateY(-${slots[slotIndex].position}px)`;
    }
    
    function spinSlot(slotIndex, targetIndex, duration, callback) {
        const slot = slots[slotIndex];
        const itemHeight = 140;
        
        const targetPosition = targetIndex * itemHeight;
        
        slot.spinning = true;
        
        const startTime = Date.now();
        const startPosition = slot.position;
        
        function animate() {
            if (!slot.spinning) return;
            
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOut = 1 - Math.pow(1 - progress, 4);
            
            const newPosition = startPosition + (targetPosition - startPosition) * easeOut;
            slot.position = newPosition;
            slot.element.style.transform = `translateY(-${newPosition}px)`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                slot.spinning = false;
                if (callback) callback();
            }
        }
        
        animate();
    }
    
    function spinAllSlots(indices, duration, callback) {
        let completed = 0;
        const total = slots.length;
        
        indices.forEach((index, slotIndex) => {
            spinSlot(slotIndex, index, duration, () => {
                completed++;
                if (completed === total && callback) {
                    callback();
                }
            });
        });
    }
    
    // 10. Функция генерации билетов
    function generateTickets(questions, tasks, studentsCount, questionsPerTicket, tasksPerTicket) {
        const tickets = [];
        const totalQuestions = questions.length;
        const totalTasks = tasks.length;
        
        const questionsRangeSize = Math.ceil(totalQuestions / questionsPerTicket);
        
        for (let i = 0; i < studentsCount; i++) {
            // Генерация теоретических вопросов
            const ticketQuestions = [];
            
            for (let j = 0; j < questionsPerTicket; j++) {
                const rangeStart = j * questionsRangeSize;
                let rangeEnd = (j + 1) * questionsRangeSize;
                
                if (rangeEnd > totalQuestions) {
                    rangeEnd = totalQuestions;
                }
                
                if (rangeStart >= rangeEnd) {
                    const availableQuestions = questions.filter(q => !ticketQuestions.includes(q));
                    if (availableQuestions.length > 0) {
                        const randomIndex = Math.floor(Math.random() * availableQuestions.length);
                        ticketQuestions.push(availableQuestions[randomIndex]);
                    } else {
                        const randomIndex = Math.floor(Math.random() * questions.length);
                        ticketQuestions.push(questions[randomIndex]);
                    }
                    continue;
                }
                
                const rangeQuestions = questions.slice(rangeStart, rangeEnd);
                const availableRangeQuestions = rangeQuestions.filter(q => !ticketQuestions.includes(q));
                
                let selectedQuestion;
                if (availableRangeQuestions.length > 0) {
                    const randomIndex = Math.floor(Math.random() * availableRangeQuestions.length);
                    selectedQuestion = availableRangeQuestions[randomIndex];
                } else {
                    const randomIndex = Math.floor(Math.random() * rangeQuestions.length);
                    selectedQuestion = rangeQuestions[randomIndex];
                }
                
                ticketQuestions.push(selectedQuestion);
            }
            
            // Генерация практических задач
            const ticketTasks = [];
            
            if (tasksPerTicket > 0 && totalTasks > 0) {
                const availableTasks = [...tasks];
                
                for (let j = 0; j < tasksPerTicket; j++) {
                    if (availableTasks.length === 0) break;
                    
                    const randomIndex = Math.floor(Math.random() * availableTasks.length);
                    const selectedTask = availableTasks[randomIndex];
                    
                    ticketTasks.push(selectedTask);
                    availableTasks.splice(randomIndex, 1);
                }
            }
            
            // Проверка уникальности билета
            const ticketKey = [
                ...ticketQuestions.sort(),
                ...ticketTasks.sort()
            ].join('|');
            
            const isUnique = !tickets.some(t => t.key === ticketKey);
            
            if (isUnique) {
                tickets.push({
                    id: i + 1,
                    questions: ticketQuestions,
                    tasks: ticketTasks,
                    key: ticketKey
                });
            } else {
                i--;
                
                if (i < -100) {
                    console.warn('Не удалось сгенерировать уникальные билеты.');
                    break;
                }
            }
        }
        
        return tickets;
    }
    
    // 11. Функции отображения билетов
    function displayTicket(ticket, isFinal = false) {
        let html = `
            <div class="ticket-header">
                <span class="ticket-title">Билет №${ticket.id}</span>
            </div>
        `;
        
        if (ticket.questions.length > 0) {
            html += `
                <div class="ticket-section">
                    <h3 class="section-subtitle">Теоретические вопросы:</h3>
                    <ol class="ticket-questions">
                        ${ticket.questions.map(q => `<li>${q}</li>`).join('')}
                    </ol>
                </div>
            `;
        }
        
        if (ticket.tasks && Array.isArray(ticket.tasks) && ticket.tasks.length > 0) {
            html += `
                <div class="ticket-section">
                    <h3 class="section-subtitle">Практические задачи:</h3>
                    <ol class="ticket-tasks">
                        ${ticket.tasks.map((t, idx) => `<li><strong>Задача ${idx + 1}:</strong> ${t}</li>`).join('')}
                    </ol>
                </div>
            `;
        }
        
        if (isFinal) {
            const ticketElement = document.createElement('div');
            ticketElement.className = 'ticket';
            ticketElement.innerHTML = html;
            return ticketElement;
        } else {
            return html;
        }
    }
    
    function displayCurrentTicket(ticket) {
        currentTicketContainer.innerHTML = displayTicket(ticket, false);
    }
    
    function displayFinalTicket(ticket) {
        const ticketElement = displayTicket(ticket, true);
        resultsContainer.appendChild(ticketElement);
    }
    
    // 12. Инициализация и восстановление настроек
    const savedTheme = localStorage.getItem('selectedTheme') || 'casino';
    if (themeSelect) {
        themeSelect.value = savedTheme;
        switchTheme(savedTheme);
    }
    
    const savedMode = localStorage.getItem('selectedMode') || 'theory';
    if (modeSelect) {
        modeSelect.value = savedMode;
        switchMode(savedMode);
    }
    
    // 13. Обработчики событий
    if (themeSelect) {
        themeSelect.addEventListener('change', function() {
            switchTheme(this.value);
        });
    }
    
    if (modeSelect) {
        modeSelect.addEventListener('change', function() {
            switchMode(this.value);
        });
    }
    
    if (generateTasksBtn) {
        generateTasksBtn.addEventListener('click', function() {
            const tasksCount = parseInt(tasksCountInput.value);
            
            if (tasksCount < 1) {
                showNotification('Введите количество задач больше 0!', 'error');
                return;
            }
            
            if (tasksCount > 100) {
                showNotification('Количество задач не должно превышать 100!', 'error');
                return;
            }
            
            tasksInputContainer.innerHTML = '';
            tasks = [];
            
            for (let i = 0; i < tasksCount; i++) {
                const taskGroup = document.createElement('div');
                taskGroup.className = 'task-input-group';
                
                taskGroup.innerHTML = `
                    <label for="task-${i}">Задача ${i + 1}:</label>
                    <textarea id="task-${i}" placeholder="Введите текст задачи ${i + 1}..." rows="2"></textarea>
                `;
                
                tasksInputContainer.appendChild(taskGroup);
            }
            
            tasksPerTicketInput.disabled = false;
            tasksPerTicketInput.max = tasksCount;
            tasksPerTicketInput.value = Math.min(1, tasksCount);
            
            showNotification(`Создано ${tasksCount} полей для ввода задач`, 'info');
        });
    }
    
    generateBtn.addEventListener('click', async function() {
        if (isGenerating) return;
        
        const questions = getQuestionsList();
        const studentsCount = parseInt(studentsCountInput.value);
        const questionsPerTicket = parseInt(questionsPerTicketInput.value);
        const mode = modeSelect.value;
        
        let tasks = [];
        let tasksPerTicket = 0;
        
        if (mode === 'theory_practice') {
            tasks = getTasksList();
            tasksPerTicket = parseInt(tasksPerTicketInput.value) || 0;
            
            if (tasksCountInput.value === '0' || tasks.length === 0) {
                showNotification('Сначала создайте и заполните задачи!', 'error');
                return;
            }
            
            if (tasksPerTicket < 1) {
                showNotification('Количество задач в билете должно быть больше 0!', 'error');
                return;
            }
            
            if (tasks.length < tasksPerTicket) {
                showNotification('В пуле задач меньше, чем требуется для одного билета!', 'error');
                return;
            }
        }
        
        // Общая валидация
        if (questions.length === 0) {
            showNotification('Добавьте хотя бы один вопрос!', 'error');
            hideCurrentTicketSection();
            return;
        }
        
        if (studentsCount < 1) {
            showNotification('Количество студентов должно быть больше 0!', 'error');
            hideCurrentTicketSection();
            return;
        }
        
        if (questionsPerTicket < 1) {
            showNotification('Количество вопросов в билете должно быть больше 0!', 'error');
            hideCurrentTicketSection();
            return;
        }
        
        if (questions.length < questionsPerTicket) {
            showNotification('В пуле вопросов меньше, чем требуется для одного билета!', 'error');
            hideCurrentTicketSection();
            return;
        }
        
        showCurrentTicketSection();
        
        isGenerating = true;
        generateBtn.disabled = true;
        exportBtn.disabled = true;
        resultsContainer.innerHTML = '';
        
        const totalSlots = mode === 'theory_practice' 
            ? questionsPerTicket + tasksPerTicket 
            : questionsPerTicket;
        
        createSlots(totalSlots);
        
        for (let i = 0; i < questionsPerTicket; i++) {
            fillSlotReel(i, questions);
        }
        
        if (mode === 'theory_practice' && tasksPerTicket > 0) {
            for (let i = 0; i < tasksPerTicket; i++) {
                fillSlotReel(questionsPerTicket + i, tasks.map((t, idx) => `Задача ${idx + 1}`));
            }
        }
        
        generatedTickets = generateTickets(questions, tasks, studentsCount, questionsPerTicket, tasksPerTicket);
        const usedQuestions = new Set();
        const usedTasks = new Set();
        
        totalTicketsSpan.textContent = studentsCount;
        progressFill.style.width = '0%';
        
        for (let i = 0; i < generatedTickets.length; i++) {
            currentTicketSpan.textContent = i + 1;
            progressFill.style.width = `${((i + 1) / generatedTickets.length) * 100}%`;
            
            displayCurrentTicket(generatedTickets[i]);
            
            generatedTickets[i].questions.forEach(q => usedQuestions.add(q));
            if (generatedTickets[i].tasks) {
                generatedTickets[i].tasks.forEach(t => usedTasks.add(t));
            }
            
            uniqueQuestionsSpan.textContent = usedQuestions.size + (usedTasks.size > 0 ? ` (+${usedTasks.size} задач)` : '');
            generatedTicketsSpan.textContent = i + 1;
            
            const questionIndices = generatedTickets[i].questions.map(q => questions.indexOf(q) + questions.length);
            const taskIndices = generatedTickets[i].tasks 
                ? generatedTickets[i].tasks.map(t => tasks.indexOf(t) + tasks.length) 
                : [];
            
            const allIndices = [...questionIndices, ...taskIndices];
            
            await new Promise(resolve => {
                spinAllSlots(allIndices, 2000, () => {
                    setTimeout(resolve, 1500);
                });
            });
            
            displayFinalTicket(generatedTickets[i]);
        }
        
        isGenerating = false;
        generateBtn.disabled = false;
        exportBtn.disabled = false;
        
        setTimeout(() => {
            hideCurrentTicketSection();
        }, 500);
        
        showNotification(`Успешно сгенерировано ${studentsCount} билетов!`);
    });
    
    exportBtn.addEventListener('click', function() {
        if (generatedTickets.length === 0) {
            showNotification('Сначала сгенерируйте билеты!', 'error');
            return;
        }
        
        try {
            const mode = modeSelect.value;
            const data = [];
            
            if (mode === 'theory') {
                data.push(['Билет', 'Теоретические вопросы']);
            } else {
                data.push(['Билет', 'Теоретические вопросы / Практические задачи']);
            }
            
            generatedTickets.forEach(ticket => {
                data.push([`Билет ${ticket.id}`, ticket.questions[0]]);
                
                for (let i = 1; i < ticket.questions.length; i++) {
                    data.push(['', ticket.questions[i]]);
                }
                
                if (ticket.tasks && ticket.tasks.length > 0) {
                    data.push(['', '--- Практические задачи ---']);
                    
                    ticket.tasks.forEach((task, idx) => {
                        data.push(['', `Задача ${idx + 1}: ${task}`]);
                    });
                }
                
                data.push(['', '']);
            });
            
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet(data);
            
            const colWidths = [
                { wch: 15 },
                { wch: 100 }
            ];
            ws['!cols'] = colWidths;
            
            const range = XLSX.utils.decode_range(ws['!ref']);
            for (let R = range.s.r; R <= range.e.r; ++R) {
                const cell_address = { c: 1, r: R };
                const cell_ref = XLSX.utils.encode_cell(cell_address);
                if (ws[cell_ref]) {
                    ws[cell_ref].s = { alignment: { wrapText: true, vertical: 'top' } };
                }
            }
            
            XLSX.utils.book_append_sheet(wb, ws, 'Билеты');
            
            const date = new Date();
            const dateStr = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth()+1).toString().padStart(2, '0')}.${date.getFullYear()}`;
            const modeStr = mode === 'theory' ? 'теория' : 'теория_практика';
            const fileName = `билеты_${modeStr}_${dateStr}.xlsx`;
            
            XLSX.writeFile(wb, fileName);
            
            showNotification(`Экспортировано ${generatedTickets.length} билетов в Excel!`);
        } catch (error) {
            console.error('Ошибка при экспорте в Excel:', error);
            showNotification('Ошибка при экспорте в Excel!', 'error');
        }
    });
    
    // Инициализация
    questionsTextarea.addEventListener('input', updateStats);
    updateStats();
    hideCurrentTicketSection();
});