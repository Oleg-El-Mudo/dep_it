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
    const themeSelect = document.getElementById('theme-select'); // ДОБАВЛЕНО
    const snowContainer = document.getElementById('snow-container'); // ДОБАВЛЕНО
    const newyearTheme = document.getElementById('newyear-theme'); // ДОБАВЛЕНО
    
    let slots = [];
    let isGenerating = false;
    let generatedTickets = [];

    // 2. Функция для создания снежинок
    function createSnowflakes() {
        if (!snowContainer) return; // Защита от ошибки если контейнера нет
        
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
                // Основная тема уже активна
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

    // 4. УНИВЕРСАЛЬНАЯ функция для показа уведомлений (ОДНА функция!)
    function showNotification(message, type = 'success') {
        if (!notification) return;
        
        notification.textContent = message;
        notification.className = 'notification';
        
        // Проверяем какая тема активна для правильных цветов
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

    // 5. Восстанавливаем сохраненную тему (ДОБАВЛЕНО В КОНЕЦ ИНИЦИАЛИЗАЦИИ)
    const savedTheme = localStorage.getItem('selectedTheme') || 'casino';
    if (themeSelect) {
        themeSelect.value = savedTheme;
        switchTheme(savedTheme);
    }

    // 6. Обработчик изменения темы
    if (themeSelect) {
        themeSelect.addEventListener('change', function() {
            const selectedTheme = this.value;
            switchTheme(selectedTheme);
        });
    }

    // 7. Остальные функции (существующий код) - УДАЛИТЬ ДУБЛИРУЮЩУЮСЯ showNotification отсюда!
    // Функции управления видимостью текущего билета
    function showCurrentTicketSection() {
        currentTicketSection.classList.remove('hidden');
    }
    
    function hideCurrentTicketSection() {
        currentTicketSection.classList.add('hidden');
    }
    
    // Обновляем статистику при изменении вопросов
    questionsTextarea.addEventListener('input', updateStats);
    
    function updateStats() {
        const questions = getQuestionsList();
        totalQuestionsSpan.textContent = questions.length;
    }
    
    function getQuestionsList() {
        return questionsTextarea.value
            .split('\n')
            .map(q => q.trim())
            .filter(q => q.length > 0);
    }
    
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
    
    function fillSlotReel(slotIndex, questions) {
        const reel = slots[slotIndex].element;
        reel.innerHTML = '';
        
        const extendedQuestions = [...questions, ...questions, ...questions];
        
        extendedQuestions.forEach((question, index) => {
            const item = document.createElement('div');
            item.className = 'slot-item';
            item.textContent = question;
            item.dataset.index = index % questions.length;
            reel.appendChild(item);
        });
        
        slots[slotIndex].position = questions.length * 140;
        reel.style.transform = `translateY(-${slots[slotIndex].position}px)`;
    }
    
    function spinSlot(slotIndex, targetQuestionIndex, duration, callback) {
        const slot = slots[slotIndex];
        const questions = getQuestionsList();
        const itemHeight = 140;
        
        const targetPosition = (questions.length + targetQuestionIndex-1) * itemHeight;
        
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
    
    function spinAllSlots(questionIndices, duration, callback) {
        let completed = 0;
        const total = slots.length;
        
        questionIndices.forEach((questionIndex, slotIndex) => {
            spinSlot(slotIndex, questionIndex, duration, () => {
                completed++;
                if (completed === total && callback) {
                    callback();
                }
            });
        });
    }
    
    generateBtn.addEventListener('click', async function() {
        if (isGenerating) return;
        
        const questions = getQuestionsList();
        const studentsCount = parseInt(studentsCountInput.value);
        const questionsPerTicket = parseInt(questionsPerTicketInput.value);
        
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
        
        createSlots(questionsPerTicket);
        
        for (let i = 0; i < questionsPerTicket; i++) {
            fillSlotReel(i, questions);
        }
        
        generatedTickets = generateTickets(questions, studentsCount, questionsPerTicket);
        const usedQuestions = new Set();
        
        totalTicketsSpan.textContent = studentsCount;
        progressFill.style.width = '0%';
        
        for (let i = 0; i < generatedTickets.length; i++) {
            currentTicketSpan.textContent = i + 1;
            progressFill.style.width = `${((i + 1) / generatedTickets.length) * 100}%`;
            
            displayCurrentTicket(generatedTickets[i]);
            
            generatedTickets[i].questions.forEach(q => usedQuestions.add(q));
            uniqueQuestionsSpan.textContent = usedQuestions.size;
            generatedTicketsSpan.textContent = i + 1;
            
            const questionIndices = generatedTickets[i].questions.map(q => questions.indexOf(q));
            
            await new Promise(resolve => {
                spinAllSlots(questionIndices, 2000, () => {
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
    
    function generateTickets(questions, studentsCount, questionsPerTicket) {
        const tickets = [];
        const totalQuestions = questions.length;
        
        const rangeSize = Math.ceil(totalQuestions / questionsPerTicket);
        
        for (let i = 0; i < studentsCount; i++) {
            const ticketQuestions = [];
            
            for (let j = 0; j < questionsPerTicket; j++) {
                const rangeStart = j * rangeSize;
                let rangeEnd = (j + 1) * rangeSize;
                
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
            
            const ticketKey = ticketQuestions.sort().join('|');
            const isUnique = !tickets.some(t => t.key === ticketKey);
            
            if (isUnique) {
                tickets.push({
                    id: i + 1,
                    questions: ticketQuestions,
                    key: ticketKey
                });
            } else {
                i--;
                
                if (i < -100) {
                    console.warn('Не удалось сгенерировать уникальные билеты. Возможно, слишком мало вопросов.');
                    break;
                }
            }
        }
        
        return tickets;
    }
    
    function displayCurrentTicket(ticket) {
        currentTicketContainer.innerHTML = `
            <div class="ticket-header">
                <span class="ticket-title">Билет №${ticket.id}</span>
            </div>
            <ol class="ticket-questions">
                ${ticket.questions.map(q => `<li>${q}</li>`).join('')}
            </ol>
        `;
    }
    
    function displayFinalTicket(ticket) {
        const ticketElement = document.createElement('div');
        ticketElement.className = 'ticket';
        
        ticketElement.innerHTML = `
            <div class="ticket-header">
                <span class="ticket-title">Билет №${ticket.id}</span>
            </div>
            <ol class="ticket-questions">
                ${ticket.questions.map(q => `<li>${q}</li>`).join('')}
            </ol>
        `;
        
        resultsContainer.appendChild(ticketElement);
    }
    
    // Функция для экспорта в Excel
    exportBtn.addEventListener('click', function() {
        if (generatedTickets.length === 0) {
            showNotification('Сначала сгенерируйте билеты!', 'error');
            return;
        }
        
        try {
            const data = [];
            data.push(['Билет', 'Вопросы']);
            
            generatedTickets.forEach(ticket => {
                data.push([`Билет ${ticket.id}`, ticket.questions[0]]);
                
                for (let i = 1; i < ticket.questions.length; i++) {
                    data.push(['', ticket.questions[i]]);
                }
                
                data.push(['', '']);
            });
            
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet(data);
            
            const colWidths = [
                { wch: 15 },
                { wch: 80 }
            ];
            ws['!cols'] = colWidths;
            
            XLSX.utils.book_append_sheet(wb, ws, 'Билеты');
            
            const date = new Date();
            const dateStr = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth()+1).toString().padStart(2, '0')}.${date.getFullYear()}`;
            const fileName = `билеты_${dateStr}.xlsx`;
            
            XLSX.writeFile(wb, fileName);
            
            showNotification(`Экспортировано ${generatedTickets.length} билетов в Excel!`);
        } catch (error) {
            console.error('Ошибка при экспорте в Excel:', error);
            showNotification('Ошибка при экспорте в Excel!', 'error');
        }
    });
    
    // Инициализация статистики
    updateStats();
    
    // Скрываем секцию текущего билета при загрузке страницы
    hideCurrentTicketSection();
});