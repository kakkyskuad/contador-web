document.addEventListener('DOMContentLoaded', () => {
    // --- Referencias a elementos HTML ---
    // Elementos de la pantalla de bienvenida
    const welcomeSection = document.getElementById('welcomeSection');
    const welcomeLoginButton = document.getElementById('welcomeLoginButton');
    const welcomeRegisterButton = document.getElementById('welcomeRegisterButton');

    // Elementos de las nuevas secciones de autenticación
    const registerSection = document.getElementById('registerSection');
    const registerForm = document.getElementById('registerForm');
    const registerUsernameInput = document.getElementById('registerUsername');
    const registerPasswordInput = document.getElementById('registerPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const goToLoginLink = document.getElementById('goToLogin');

    const loginSection = document.getElementById('loginSection');
    const loginForm = document.getElementById('loginForm');
    const loginUsernameInput = document.getElementById('loginUsername');
    const loginPasswordInput = document.getElementById('loginPassword');
    const goToRegisterLink = document.getElementById('goToRegister');

    // Elementos de la barra de navegación principal
    const mainHeader = document.querySelector('.main-header');
    const navButtons = document.querySelectorAll('.nav-button');
    const logoutButton = document.getElementById('logoutButton');

    // Elementos de las secciones de la aplicación
    const sueldoAppSection = document.getElementById('sueldoAppSection');
    const configSection = document.getElementById('configSection');
    const profileSection = document.getElementById('profileSection');
    const appSections = document.querySelectorAll('.app-section');

    // Elementos del Control de Sueldo (Dashboard)
    // ¡IMPORTANTE!: Asegúrate que estos IDs coincidan en tu index.html
    const jornalDiarioDisplay = document.getElementById('jornalDiarioDisplay');
    const gananciaPorHoraDisplay = document.getElementById('gananciaPorHoraDisplay');
    const pagoFeriadoFijoDisplay = document.getElementById('pagoFeriadoFijoDisplay');
    const pagoHoraFeriadoDisplay = document.getElementById('pagoHoraFeriadoDisplay');
    const monthlyGoalSpan = document.getElementById('monthlyGoal');
    const totalAcumuladoMesDisplaySpan = document.getElementById('totalAcumuladoMesDisplay');
    const bonificacionFamiliarDisplay = document.getElementById('bonificacionFamiliarDisplay');
    const totalGeneralDisplay = document.getElementById('totalGeneralDisplay');
    const ipsResultCard = document.getElementById('ipsResultCard');
    const sueldoNetoIPSDisplay = document.getElementById('sueldoNetoIPSDisplay');
    const prevMonthButton = document.getElementById('prevMonth');
    const nextMonthButton = document.getElementById('nextMonth');
    const currentMonthYearHeader = document.getElementById('currentMonthYear');
    const calendarDaysGrid = document.getElementById('calendarDays');
    const calculateIPSButton = document.getElementById('calculateIPSButton');
    const jornalHistoryList = document.getElementById('jornalHistory');
    const clearMonthDataButton = document.getElementById('clearMonthData');

    // Elementos de Configuración
    const configJornalDiarioInput = document.getElementById('configJornalDiario');
    const configGananciaPorHoraInput = document.getElementById('configGananciaPorHora');
    const configPagoFeriadoFijoInput = document.getElementById('configPagoFeriadoFijo');
    const configPagoHoraFeriadoInput = document.getElementById('configPagoHoraFeriado');
    const configMonthlyGoalInput = document.getElementById('configMonthlyGoal');
    const configNumChildrenInput = document.getElementById('configNumChildren');
    const saveConfigButton = document.getElementById('saveConfigButton');

    // Elementos de la sección de Perfil
    const profilePhoto = document.getElementById('profilePhoto');
    const profilePhotoInput = document.getElementById('profilePhotoInput');
    const profileForm = document.getElementById('profileForm');
    const profileUsernameDisplay = document.getElementById('profileUsernameDisplay');
    const fullNameInput = document.getElementById('fullName');
    const ageInput = document.getElementById('age');
    const cityInput = document.getElementById('city');
    const entryYearInput = document.getElementById('entryYear');


    // --- Constantes para los valores (se cargarán desde la configuración del usuario) ---
    // Valores por defecto si no hay configuración guardada para el usuario.
    let SALARIO_MINIMO_MENSUAL = 2798309;
    let JORNAL_DIARIO = 93234;
    let GANANCIA_POR_HORA = 11650;
    let PAGO_FERIADO_FIJO = 186000;
    let PAGO_HORA_FERIADO = 23000;

    const DIA_CIERRE_SUELDO = 20;

    // Bonificación familiar por cada hijo
    const BONIFICACION_POR_HIJO = 139915;

    // Feriados nacionales de Paraguay (año 2025 - con nombres para mostrar)
    const FERIADOS_NACIONALES_2025 = [
        { date: '2025-01-01', name: 'Año Nuevo' },
        { date: '2025-03-03', name: 'Día de los Héroes' }, // Trasladado del 1 de marzo
        { date: '2025-04-17', name: 'Jueves Santo' },
        { date: '2025-04-18', name: 'Viernes Santo' },
        { date: '2025-05-01', name: 'Día del Trabajador' },
        { date: '2025-05-14', name: 'Día de la Independencia' },
        { date: '2025-05-15', name: 'Día de la Independencia' },
        { date: '2025-06-16', name: 'Día de la Paz del Chaco' }, // Trasladado del 12 de junio
        { date: '2025-08-15', name: 'Día de la Fundación de Asunción' },
        { date: '2025-09-29', name: 'Victoria de Boquerón' },
        { date: '2025-12-08', name: 'Día de la Virgen de Caacupé' },
        { date: '2025-12-25', name: 'Navidad' }
    ];

    // --- Variables de estado de la aplicación ---
    let currentDisplayDate = new Date();
    currentDisplayDate.setDate(1);

    let monthlyData = {};
    let users = {};
    let currentUser = null;

    // --- Funciones de Inicialización y Carga ---
    const loadUsers = () => {
        const savedUsers = localStorage.getItem('appUsers');
        if (savedUsers) {
            users = JSON.parse(savedUsers);
        }
    };

    const saveUsers = () => {
        localStorage.setItem('appUsers', JSON.stringify(users));
    };

    const loadMonthlyData = () => {
        if (currentUser) {
            const savedData = localStorage.getItem(`monthlySalaryApp_${currentUser}`);
            if (savedData) {
                monthlyData = JSON.parse(savedData);
            } else {
                monthlyData = {};
            }
        } else {
            monthlyData = {};
        }
    };

    const saveMonthlyData = () => {
        if (currentUser) {
            localStorage.setItem(`monthlySalaryApp_${currentUser}`, JSON.stringify(monthlyData));
        }
    };

    const loadConfig = () => {
        if (currentUser && users[currentUser]) {
            const userConfig = users[currentUser];

            // Cargar Jornal Diario
            JORNAL_DIARIO = userConfig.jornalDiario !== undefined ? userConfig.jornalDiario : 93234;
            if (configJornalDiarioInput) configJornalDiarioInput.value = JORNAL_DIARIO;

            // Cargar Ganancia por Hora
            GANANCIA_POR_HORA = userConfig.gananciaPorHora !== undefined ? userConfig.gananciaPorHora : 11650;
            if (configGananciaPorHoraInput) configGananciaPorHoraInput.value = GANANCIA_POR_HORA;

            // Cargar Pago Feriado Fijo
            PAGO_FERIADO_FIJO = userConfig.pagoFeriadoFijo !== undefined ? userConfig.pagoFeriadoFijo : 186000;
            if (configPagoFeriadoFijoInput) configPagoFeriadoFijoInput.value = PAGO_FERIADO_FIJO;

            // Cargar Pago Hora Feriado
            PAGO_HORA_FERIADO = userConfig.pagoHoraFeriado !== undefined ? userConfig.pagoHoraFeriado : 23000;
            if (configPagoHoraFeriadoInput) configPagoHoraFeriadoInput.value = PAGO_HORA_FERIADO;

            // Cargar Meta Salarial
            SALARIO_MINIMO_MENSUAL = userConfig.monthlyGoal !== undefined ? userConfig.monthlyGoal : 2798309;
            if (configMonthlyGoalInput) configMonthlyGoalInput.value = SALARIO_MINIMO_MENSUAL;

            // Cargar Número de Hijos para bonificación
            if (configNumChildrenInput) {
                configNumChildrenInput.value = userConfig.numChildrenForBonus !== undefined ? userConfig.numChildrenForBonus : 0;
            }
        } else {
            // Si no hay usuario o configuración, usar valores por defecto en los inputs
            if (configJornalDiarioInput) configJornalDiarioInput.value = 93234;
            if (configGananciaPorHoraInput) configGananciaPorHoraInput.value = 11650;
            if (configPagoFeriadoFijoInput) configPagoFeriadoFijoInput.value = 186000;
            if (configPagoHoraFeriadoInput) configPagoHoraFeriadoInput.value = 23000;
            if (configMonthlyGoalInput) configMonthlyGoalInput.value = 2798309;
            if (configNumChildrenInput) configNumChildrenInput.value = 0;
        }
        // Actualizar displays en la sección principal con los valores cargados
        // Solo actualiza si los elementos existen (para evitar el TypeError)
        if (jornalDiarioDisplay) jornalDiarioDisplay.textContent = `₲ ${JORNAL_DIARIO.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        if (gananciaPorHoraDisplay) gananciaPorHoraDisplay.textContent = `₲ ${GANANCIA_POR_HORA.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        if (pagoFeriadoFijoDisplay) pagoFeriadoFijoDisplay.textContent = `₲ ${PAGO_FERIADO_FIJO.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        if (pagoHoraFeriadoDisplay) pagoHoraFeriadoDisplay.textContent = `₲ ${PAGO_HORA_FERIADO.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        if (monthlyGoalSpan) monthlyGoalSpan.textContent = `₲ ${SALARIO_MINIMO_MENSUAL.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const saveConfig = () => {
        if (currentUser) {
            const newJornal = parseFloat(configJornalDiarioInput.value);
            const newGananciaPorHora = parseFloat(configGananciaPorHoraInput.value);
            const newPagoFeriadoFijo = parseFloat(configPagoFeriadoFijoInput.value);
            const newPagoHoraFeriado = parseFloat(configPagoHoraFeriadoInput.value);
            const newMonthlyGoal = parseFloat(configMonthlyGoalInput.value);
            const newNumChildrenForBonus = parseInt(configNumChildrenInput.value);

            let changesMade = false;

            // Validar y guardar Jornal Diario
            if (!isNaN(newJornal) && newJornal > 0) {
                if (JORNAL_DIARIO !== newJornal) {
                    JORNAL_DIARIO = newJornal;
                    users[currentUser].jornalDiario = newJornal;
                    changesMade = true;
                }
            } else { alert('Por favor, ingresa un valor de Jornal Diario válido.'); return; }

            // Validar y guardar Ganancia por Hora
            if (!isNaN(newGananciaPorHora) && newGananciaPorHora > 0) {
                if (GANANCIA_POR_HORA !== newGananciaPorHora) {
                    GANANCIA_POR_HORA = newGananciaPorHora;
                    users[currentUser].gananciaPorHora = newGananciaPorHora;
                    changesMade = true;
                }
            } else { alert('Por favor, ingresa un valor de Ganancia por Hora válido.'); return; }

            // Validar y guardar Pago Feriado Fijo
            if (!isNaN(newPagoFeriadoFijo) && newPagoFeriadoFijo >= 0) {
                if (PAGO_FERIADO_FIJO !== newPagoFeriadoFijo) {
                    PAGO_FERIADO_FIJO = newPagoFeriadoFijo;
                    users[currentUser].pagoFeriadoFijo = newPagoFeriadoFijo;
                    changesMade = true;
                }
            } else { alert('Por favor, ingresa un valor de Pago Feriado Fijo válido.'); return; }

            // Validar y guardar Pago Hora Feriado
            if (!isNaN(newPagoHoraFeriado) && newPagoHoraFeriado >= 0) {
                if (PAGO_HORA_FERIADO !== newPagoHoraFeriado) {
                    PAGO_HORA_FERIADO = newPagoHoraFeriado;
                    users[currentUser].pagoHoraFeriado = newPagoHoraFeriado;
                    changesMade = true;
                }
            } else { alert('Por favor, ingresa un valor de Pago por Hora en Feriado válido.'); return; }


            // Validar y guardar Meta Salarial
            if (!isNaN(newMonthlyGoal) && newMonthlyGoal > 0) {
                if (SALARIO_MINIMO_MENSUAL !== newMonthlyGoal) {
                    SALARIO_MINIMO_MENSUAL = newMonthlyGoal;
                    users[currentUser].monthlyGoal = newMonthlyGoal;
                    changesMade = true;
                }
            } else { alert('Por favor, ingresa un valor de Meta Salarial válido.'); return; }

            // Validar y guardar Número de Hijos para bonificación
            if (!isNaN(newNumChildrenForBonus) && newNumChildrenForBonus >= 0) {
                   if (users[currentUser].numChildrenForBonus !== newNumChildrenForBonus) {
                       users[currentUser].numChildrenForBonus = newNumChildrenForBonus;
                       changesMade = true;
                   }
               } else { alert('Por favor, ingresa un número de hijos válido (0 o más).'); return; }

            if (changesMade) {
                saveUsers();
                alert('Configuración guardada correctamente.');
                loadConfig(); // Volver a cargar para actualizar los displays del dashboard
                updateMonthlySummary(); // Recalcular con los nuevos valores
                renderCalendar(); // Re-renderizar para reflejar posibles cambios en tipos de jornal
            } else {
                alert('No se detectaron cambios en la configuración.');
            }
        }
    };

    const loadUserProfile = () => {
        if (currentUser && users[currentUser] && users[currentUser].profile) {
            const profile = users[currentUser].profile;
            // Asegurarse de que el input de username en perfil se actualice.
            // Si profileUsernameDisplay es un <p> o <span>, usar textContent
            // Si es un <input>, usar .value
            if (profileUsernameDisplay) profileUsernameDisplay.value = currentUser; // o .textContent si no es input
            if (fullNameInput) fullNameInput.value = profile.fullName || '';
            if (ageInput) ageInput.value = profile.age || '';
            if (cityInput) cityInput.value = profile.city || '';
            if (entryYearInput) entryYearInput.value = profile.entryYear || '';
            if (profilePhoto) profilePhoto.src = profile.profilePhotoUrl || 'https://via.placeholder.com/150/EEEEEE/888888?text=Tu+Foto';
        } else {
            if (profileUsernameDisplay) profileUsernameDisplay.value = currentUser || ''; // o .textContent
            if (fullNameInput) fullNameInput.value = '';
            if (ageInput) ageInput.value = '';
            if (cityInput) cityInput.value = '';
            if (entryYearInput) entryYearInput.value = '';
            if (profilePhoto) profilePhoto.src = 'https://via.placeholder.com/150/EEEEEE/888888?text=Tu+Foto';
        }
    };

    const saveUserProfile = () => {
        if (currentUser) {
            // Asegurarse de que el objeto 'profile' exista para el usuario actual
            if (!users[currentUser].profile) {
                users[currentUser].profile = {};
            }

            // Añadir validaciones para que los inputs existan antes de intentar leer su valor
            if (fullNameInput) users[currentUser].profile.fullName = fullNameInput.value.trim();
            if (ageInput) users[currentUser].profile.age = ageInput.value.trim();
            if (cityInput) users[currentUser].profile.city = cityInput.value.trim();
            if (entryYearInput) users[currentUser].profile.entryYear = entryYearInput.value.trim();
            if (profilePhoto) users[currentUser].profile.profilePhotoUrl = profilePhoto.src; // Guardar la URL actual de la foto

            saveUsers();
            alert('Perfil guardado correctamente.');
        }
    };

    // --- Funciones de Utilidad de Fecha ---
    const getMonthKey = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth(); // 0-11
        const day = date.getDate();

        let payPeriodYear = year;
        let payPeriodMonth = month; // 0-11 (mes natural)

        if (day > DIA_CIERRE_SUELDO) {
            payPeriodMonth++;
            if (payPeriodMonth > 11) {
                payPeriodMonth = 0;
                payPeriodYear++;
            }
        }
        return `${payPeriodYear}-${(payPeriodMonth + 1).toString().padStart(2, '0')}`;
    };

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // Función para obtener el primer día de la semana (0=Lunes, 6=Domingo)
    const getFirstDayOfMonth = (year, month) => {
        const firstDay = new Date(year, month, 1).getDay();
        return (firstDay === 0) ? 6 : firstDay - 1; // Ajusta 0 (domingo) a 6, y los demás a -1 para que Lunes sea 0
    };

    // --- Funciones de Renderizado y Actualización ---
    const renderCalendar = () => {
        if (!calendarDaysGrid) return; // Asegura que el elemento exista antes de manipularlo
        calendarDaysGrid.innerHTML = '';
        if (ipsResultCard) ipsResultCard.style.display = 'none';

        const year = currentDisplayDate.getFullYear();
        const month = currentDisplayDate.getMonth();

        // Determinar el período de pago correcto para la visualización del calendario
        // Aunque el calendario muestra un mes natural, los cálculos se basan en el período de pago.
        // Aquí necesitamos las fechas de inicio y fin del período de PAGO actual.
        // Si el día actual es mayor al DIA_CIERRE_SUELDO, el período de pago es el mes siguiente.
        // Si el día actual es menor o igual al DIA_CIERRE_SUELDO, el período de pago es el mes actual.

        let periodEndDate;
        let periodStartDate;

        // Si el día del mes actual es mayor al día de cierre, el período de pago 'actual' es el del mes siguiente
        if (currentDisplayDate.getDate() > DIA_CIERRE_SUELDO) {
            periodEndDate = new Date(year, month + 1, DIA_CIERRE_SUELDO);
            periodStartDate = new Date(year, month, DIA_CIERRE_SUELDO + 1);
        } else { // Si el día del mes actual es menor o igual, el período de pago 'actual' es el del mes actual
            periodEndDate = new Date(year, month, DIA_CIERRE_SUELDO);
            periodStartDate = new Date(year, month - 1, DIA_CIERRE_SUELDO + 1);
        }

        // Ajustar el inicio y fin del período si cruzan el año
        if (periodStartDate.getFullYear() !== periodEndDate.getFullYear() && periodStartDate.getMonth() > periodEndDate.getMonth()) {
            periodStartDate.setFullYear(periodEndDate.getFullYear() - 1);
        }

        // Formatear las fechas para la cabecera
        const formattedStartDate = periodStartDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
        const formattedEndDate = periodEndDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });

        if (currentMonthYearHeader) currentMonthYearHeader.textContent = `Período: ${formattedStartDate} - ${formattedEndDate}`;

        const daysInMonth = getDaysInMonth(year, month);
        const firstDayOfMonth = getFirstDayOfMonth(year, month);

        const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
        dayNames.forEach(name => {
            const headerDay = document.createElement('div');
            headerDay.classList.add('day', 'day-name');
            headerDay.textContent = name;
            calendarDaysGrid.appendChild(headerDay);
        });

        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.classList.add('day', 'empty');
            calendarDaysGrid.appendChild(emptyDay);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('day', 'current-month');
            dayElement.dataset.day = day;

            const dayNumberSpan = document.createElement('span');
            dayNumberSpan.classList.add('day-number');
            dayNumberSpan.textContent = day;
            dayElement.appendChild(dayNumberSpan);

            const today = new Date();
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

            if (isToday) {
                dayElement.classList.add('today');
            }

            const dayOfWeek = new Date(year, month, day).getDay();
            if (dayOfWeek === 0) { // Domingo
                dayElement.classList.add('sunday');
            }

            const fullDateString = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            // Encuentra el objeto de feriado si existe para esta fecha
            const holidayInfo = FERIADOS_NACIONALES_2025.find(h => h.date === fullDateString);

            if (holidayInfo) {
                dayElement.classList.add('holiday');
                // Crear un elemento para el nombre del feriado
                const holidayNameSpan = document.createElement('span');
                holidayNameSpan.classList.add('holiday-name');
                holidayNameSpan.textContent = holidayInfo.name;
                dayElement.appendChild(holidayNameSpan); // Añadir el nombre del feriado al día
            }

            const dateForThisDay = new Date(year, month, day);
            const payPeriodKeyForThisSpecificDay = getMonthKey(dateForThisDay);
            const dayAmount = monthlyData[payPeriodKeyForThisSpecificDay]?.workedDays[day];

            const icon = document.createElement('span');
            icon.classList.add('status-icon');

            // Lógica para determinar el estado visual del día basado en el monto guardado
            if (dayAmount !== undefined) { // Si hay algún valor guardado para el día
                if (dayAmount === JORNAL_DIARIO) {
                    dayElement.classList.add('worked');
                    icon.classList.add('worked');
                    icon.innerHTML = '<i class="fas fa-check-circle"></i>'; // Icono de trabajado normal
                } else if (dayAmount === (JORNAL_DIARIO * 2)) {
                    dayElement.classList.add('special-worked'); // Clase para destacar
                    icon.classList.add('special-worked');
                    icon.innerHTML = '<i class="fas fa-money-bill-wave"></i>'; // Icono de doble jornal
                } else if (dayAmount === PAGO_FERIADO_FIJO) {
                    dayElement.classList.add('special-worked');
                    icon.classList.add('special-worked');
                    icon.innerHTML = '<i class="fas fa-calendar-check"></i>'; // Icono de feriado fijo
                } else if (dayAmount > 0 && dayAmount !== JORNAL_DIARIO && dayAmount !== (JORNAL_DIARIO * 2) && dayAmount !== PAGO_FERIADO_FIJO) {
                    // Esto cubre el caso de "Feriado/Domingo (Por Hora)" o cualquier otro monto personalizado
                    dayElement.classList.add('custom-worked'); // Nueva clase para montos personalizados
                    icon.classList.add('custom-worked');
                    icon.innerHTML = '<i class="fas fa-clock"></i>'; // Icono de horas extras o personalizado
                } else if (dayAmount === 0) {
                    dayElement.classList.add('not-worked');
                    icon.classList.add('not-worked');
                    icon.innerHTML = '<i class="fas fa-times-circle"></i>'; // Icono de no trabajado
                }
                dayElement.appendChild(icon);
            }

            calendarDaysGrid.appendChild(dayElement);
        }

        updateMonthlySummary();
    };

    const updateMonthlySummary = () => {
        const monthKey = getMonthKey(currentDisplayDate);

        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = {
                workedDays: {},
                total: 0,
                history: []
            };
        }

        let currentPeriodTotal = 0;
        const currentPeriodWorkedDays = monthlyData[monthKey].workedDays;

        for (const day in currentPeriodWorkedDays) {
            const amount = parseFloat(currentPeriodWorkedDays[day]);
            if (!isNaN(amount) && amount > 0) { // Sumar solo montos positivos
                currentPeriodTotal += amount;
            }
        }
        monthlyData[monthKey].total = currentPeriodTotal;

        let totalBonificacion = 0;
        if (currentUser && users[currentUser] && users[currentUser].numChildrenForBonus !== undefined) {
            const numHijos = users[currentUser].numChildrenForBonus;
            if (numHijos > 0) {
                totalBonificacion = numHijos * BONIFICACION_POR_HIJO;
            }
        }

        const totalGeneral = currentPeriodTotal + totalBonificacion;

        // Actualizar los displays de los valores de configuración en el dashboard
        if (jornalDiarioDisplay) jornalDiarioDisplay.textContent = `₲ ${JORNAL_DIARIO.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        if (gananciaPorHoraDisplay) gananciaPorHoraDisplay.textContent = `₲ ${GANANCIA_POR_HORA.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        if (pagoFeriadoFijoDisplay) pagoFeriadoFijoDisplay.textContent = `₲ ${PAGO_FERIADO_FIJO.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        if (pagoHoraFeriadoDisplay) pagoHoraFeriadoDisplay.textContent = `₲ ${PAGO_HORA_FERIADO.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        if (monthlyGoalSpan) monthlyGoalSpan.textContent = `₲ ${SALARIO_MINIMO_MENSUAL.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        if (totalAcumuladoMesDisplaySpan) totalAcumuladoMesDisplaySpan.textContent = `₲ ${currentPeriodTotal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        if (bonificacionFamiliarDisplay) bonificacionFamiliarDisplay.textContent = `₲ ${totalBonificacion.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        if (totalGeneralDisplay) totalGeneralDisplay.textContent = `₲ ${totalGeneral.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        updateHistoryDisplay();
        saveMonthlyData();
    };

    const updateHistoryDisplay = () => {
        if (!jornalHistoryList) return; // Asegura que el elemento exista
        jornalHistoryList.innerHTML = '';
        const monthKey = getMonthKey(currentDisplayDate);
        const historyItems = monthlyData[monthKey]?.history || [];

        // Ordenar el historial por fecha descendente (más reciente primero)
        historyItems.sort((a, b) => {
            const dateA = new Date(a.dateParts[2], a.dateParts[1] - 1, a.dateParts[0]);
            const dateB = new Date(b.dateParts[2], b.dateParts[1] - 1, b.dateParts[0]);
            return dateB - dateA;
        });

        if (historyItems.length === 0) {
            const noDataMessage = document.createElement('li');
            noDataMessage.textContent = 'No hay registros de jornal para este período.';
            noDataMessage.style.fontStyle = 'italic';
            noDataMessage.style.textAlign = 'center';
            jornalHistoryList.appendChild(noDataMessage);
            return;
        }

        historyItems.forEach(item => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span class="date">${item.displayDate}</span>
                <span>₲ ${item.amount.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            `;
            jornalHistoryList.appendChild(listItem);
        });
    };

    const calculateIPS = () => {
        const monthKey = getMonthKey(currentDisplayDate);
        const currentPeriodTotal = monthlyData[monthKey]?.total || 0;
        let totalBonificacion = 0;

        if (currentUser && users[currentUser] && users[currentUser].numChildrenForBonus !== undefined) {
            const numHijos = users[currentUser].numChildrenForBonus;
            if (numHijos > 0) {
                totalBonificacion = numHijos * BONIFICACION_POR_HIJO;
            }
        }

        const totalParaIPS = currentPeriodTotal + totalBonificacion;

        if (totalParaIPS <= 0) {
            alert('No hay monto acumulado (incluyendo bonificación) para calcular el descuento de IPS en este período.');
            if (ipsResultCard) ipsResultCard.style.display = 'none';
            return;
        }

        const IPS_PERCENTAGE = 0.09;
        const ipsDiscount = totalParaIPS * IPS_PERCENTAGE;
        const sueldoNeto = totalParaIPS - ipsDiscount;

        if (sueldoNetoIPSDisplay) sueldoNetoIPSDisplay.textContent = `₲ ${sueldoNeto.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        if (ipsResultCard) ipsResultCard.style.display = 'block';
    };

    // --- Manejadores de Eventos del Calendario ---
    if (calendarDaysGrid) { // Asegura que el elemento exista antes de añadir el event listener
        calendarDaysGrid.addEventListener('click', (event) => {
            const clickedDayElement = event.target.closest('.day.current-month');
            if (!clickedDayElement) return;

            const day = parseInt(clickedDayElement.dataset.day);
            const year = currentDisplayDate.getFullYear();
            const month = currentDisplayDate.getMonth();

            const clickedDate = new Date(year, month, day);
            const monthKey = getMonthKey(clickedDate);

            const fullDateString = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            // Se comprueba si es feriado usando .some() porque FERIADOS_NACIONALES_2025 ahora es un array de objetos
            const isHoliday = FERIADOS_NACIONALES_2025.some(h => h.date === fullDateString);
            const dayOfWeek = new Date(year, month, day).getDay(); // 0 es Domingo, 1 es Lunes
            const isSunday = dayOfWeek === 0;

            let currentDayAmount = monthlyData[monthKey]?.workedDays[day];

            let promptMessage = `Elige el estado para el día ${day}:\n\n`;

            // Opciones simplificadas
            promptMessage += `1. Trabajado Normal (₲ ${JORNAL_DIARIO.toLocaleString('es-ES')})\n`;
            promptMessage += `2. Trabajado Doble Jornal (₲ ${(JORNAL_DIARIO * 2).toLocaleString('es-ES')})\n`;
            promptMessage += `3. Feriado/Domingo (Pago Fijo) (₲ ${PAGO_FERIADO_FIJO.toLocaleString('es-ES')})\n`;
            promptMessage += `4. Feriado/Domingo (Por Hora) (Se te preguntará cuántas horas) (₲ ${PAGO_HORA_FERIADO.toLocaleString('es-ES')} por hora)\n`;
            promptMessage += `5. No trabajado (₲ 0)`;


            const choice = prompt(promptMessage);

            let newAmount = 0;
            if (choice) {
                const numChoice = parseInt(choice);
                switch (numChoice) {
                    case 1: // Trabajado Normal
                        newAmount = JORNAL_DIARIO;
                        break;
                    case 2: // Trabajado Doble Jornal
                        newAmount = JORNAL_DIARIO * 2;
                        break;
                    case 3: // Feriado/Domingo (Pago Fijo)
                        newAmount = PAGO_FERIADO_FIJO;
                        break;
                    case 4: // Feriado/Domingo (Por Hora)
                        let hoursWorked = prompt('¿Cuántas horas trabajaste en el feriado/domingo?');
                        hoursWorked = parseFloat(hoursWorked);
                        if (!isNaN(hoursWorked) && hoursWorked > 0) {
                            newAmount = Math.round(hoursWorked * PAGO_HORA_FERIADO); // Redondeo para evitar decimales por flotantes
                        } else {
                            alert('Horas inválidas, el día se marcará como no trabajado.');
                            newAmount = 0;
                        }
                        break;
                    case 5: // No trabajado
                        newAmount = 0;
                        break;
                    default:
                        alert('Opción no válida. El estado no se modificará.');
                        return;
                }
            } else {
                alert('Operación cancelada. El estado no se modificará.');
                return;
            }

            // Si el día no está aún en monthlyData para este período, inicializarlo
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = { workedDays: {}, total: 0, history: [] };
            }

            monthlyData[monthKey].workedDays[day] = newAmount;

            // Eliminar entradas anteriores para este día del historial
            monthlyData[monthKey].history = monthlyData[monthKey].history.filter(item => {
                const itemDate = new Date(item.dateParts[2], item.dateParts[1] - 1, item.dateParts[0]);
                return itemDate.getTime() !== clickedDate.getTime();
            });

            // Añadir nueva entrada al historial si el monto es positivo
            if (newAmount > 0) {
                const formattedDate = clickedDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
                monthlyData[monthKey].history.push({
                    displayDate: formattedDate,
                    dateParts: [day, month + 1, year],
                    amount: newAmount
                });
            }

            saveMonthlyData();
            updateMonthlySummary(); // Asegura que el total se actualice inmediatamente
            renderCalendar(); // Re-renderiza el calendario para que se vea el cambio
        });
    }


    if (prevMonthButton) {
        prevMonthButton.addEventListener('click', () => {
            currentDisplayDate.setMonth(currentDisplayDate.getMonth() - 1);
            currentDisplayDate.setDate(1); // Siempre ir al día 1 del nuevo mes
            renderCalendar();
        });
    }

    if (nextMonthButton) {
        nextMonthButton.addEventListener('click', () => {
            currentDisplayDate.setMonth(currentDisplayDate.getMonth() + 1);
            currentDisplayDate.setDate(1); // Siempre ir al día 1 del nuevo mes
            renderCalendar();
        });
    }

    if (clearMonthDataButton) {
        clearMonthDataButton.addEventListener('click', () => {
            if (confirm('¿Estás seguro de que quieres limpiar TODOS los datos del PERÍODO de pago actual? Esta acción no se puede deshacer.')) {
                const monthKey = getMonthKey(currentDisplayDate);
                monthlyData[monthKey] = {
                    workedDays: {},
                    total: 0,
                    history: []
                };
                saveMonthlyData();
                updateMonthlySummary();
                renderCalendar();
                alert('Datos del período de pago actual limpiados.');
            }
        });
    }

    // --- LÓGICA DE NAVEGACIÓN ENTRE SECCIONES ---
    const showSection = (sectionId) => {
        appSections.forEach(section => {
            section.classList.remove('active');
        });
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }


        if (sectionId === 'welcomeSection' || sectionId === 'loginSection' || sectionId === 'registerSection') {
            if (mainHeader) mainHeader.style.display = 'none'; // Oculta el encabezado (navbar) en pantallas de autenticación
        } else {
            if (mainHeader) mainHeader.style.display = 'flex'; // Muestra el encabezado en las pantallas de la aplicación
        }

        navButtons.forEach(button => {
            if (button.dataset.section === sectionId) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });

        // Lógica de carga de datos específica para cada sección
        if (sectionId === 'sueldoAppSection') {
            if (currentUser) {
                loadConfig(); // Asegurarse de que los valores de configuración se carguen antes de renderizar
                loadMonthlyData();
                renderCalendar(); // Renderiza el calendario al entrar a esta sección
            } else {
                alert('Debes iniciar sesión para acceder a la aplicación.');
                showSection('welcomeSection'); // Redirige si no está autenticado
            }
        } else if (sectionId === 'configSection') {
            if (currentUser) {
                loadConfig(); // Carga la configuración actual del usuario
            } else {
                alert('Debes iniciar sesión para acceder a la configuración.');
                showSection('welcomeSection');
            }
        } else if (sectionId === 'profileSection') {
            if (currentUser) {
                loadUserProfile(); // Carga los datos del perfil del usuario
            } else {
                alert('Debes iniciar sesión para acceder a tu perfil.');
                showSection('welcomeSection');
            }
        }
    };

    // --- Manejadores para los botones de la pantalla de bienvenida y navegación entre formularios ---
    if (welcomeLoginButton) welcomeLoginButton.addEventListener('click', () => showSection('loginSection'));
    if (welcomeRegisterButton) welcomeRegisterButton.addEventListener('click', () => showSection('registerSection'));
    if (goToLoginLink) goToLoginLink.addEventListener('click', (e) => { e.preventDefault(); showSection('loginSection'); });
    if (goToRegisterLink) goToRegisterLink.addEventListener('click', (e) => { e.preventDefault(); showSection('registerSection'); });

    // --- Manejadores de eventos de autenticación ---
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = registerUsernameInput.value.trim();
            const password = registerPasswordInput.value.trim();
            const confirmPassword = confirmPasswordInput.value.trim();

            if (username.length < 3) {
                alert('El nombre de usuario debe tener al menos 3 caracteres.');
                return;
            }
            if (password.length < 6) {
                alert('La contraseña debe tener al menos 6 caracteres.');
                return;
            }
            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden.');
                return;
            }
            if (users[username]) {
                alert('El nombre de usuario ya existe. Por favor, elige otro.');
                return;
            }

            users[username] = {
                password: password, // En una aplicación real, NUNCA guardar contraseñas en texto plano. Usar hash.
                profile: {},
                jornalDiario: 93234, // Valores por defecto para el nuevo usuario
                gananciaPorHora: 11650,
                pagoFeriadoFijo: 186000,
                pagoHoraFeriado: 23000,
                monthlyGoal: 2798309,
                numChildrenForBonus: 0
            };
            saveUsers();
            alert('Usuario registrado con éxito. Ahora puedes iniciar sesión.');
            showSection('loginSection');
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = loginUsernameInput.value.trim();
            const password = loginPasswordInput.value.trim();

            if (users[username] && users[username].password === password) {
                currentUser = username;
                alert(`¡Bienvenido, ${currentUser}!`);
                loadConfig(); // Carga la configuración del usuario logueado
                loadMonthlyData(); // Carga los datos mensuales del usuario logueado
                showSection('sueldoAppSection'); // Lleva al usuario a la aplicación principal
            } else {
                alert('Usuario o contraseña incorrectos.');
            }
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            currentUser = null;
            monthlyData = {}; // Limpiar datos mensuales en memoria
            // Opcional: restablecer los valores de configuración a los predeterminados en los inputs si se desea
            loadConfig(); // Esto reseteará los inputs a los valores por defecto si no hay currentUser
            alert('Sesión cerrada.');
            showSection('welcomeSection');
        });
    }

    // --- Manejadores para los botones de navegación principales ---
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sectionId = button.dataset.section;
            showSection(sectionId);
        });
    });

    // --- Manejadores de eventos de Configuración y Perfil ---
    if (saveConfigButton) saveConfigButton.addEventListener('click', saveConfig);
    if (profilePhotoInput) {
        profilePhotoInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    if (profilePhoto) profilePhoto.src = reader.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveUserProfile();
        });
    }

    if (calculateIPSButton) calculateIPSButton.addEventListener('click', calculateIPS);


    // --- Inicialización de la Aplicación ---
    loadUsers(); // Cargar todos los usuarios existentes al inicio
    // Siempre cargar la configuración inicial o por defecto para que los displays tengan valores
    loadConfig(); // Esto también actualiza los displays del dashboard

    // Comprobar si hay un usuario logueado previamente (ej. si se refrescó la página)
    // En una aplicación real, se usaría localStorage para recordar el currentUser,
    // pero aquí, para simplificar, siempre se vuelve a la bienvenida si no hay una sesión activa.
    // Podrías añadir: `currentUser = localStorage.getItem('lastLoggedInUser');` y luego comprobar.
    if (currentUser) {
        loadMonthlyData();
        showSection('sueldoAppSection'); // Si hay usuario activo, ir directo a la app
    } else {
        showSection('welcomeSection'); // Por defecto, mostrar la pantalla de bienvenida
    }
});