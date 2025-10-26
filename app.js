// Игровое состояние
let gameState = {
  health: 50,
  mood: 50,
  hunger: 75,
  sanity: 50,
  incel_level: 30,
  god_complex: 0,
  fatigue: 0,
  money: 1000,
  vika_relationship: 0,
  days_survived: 0,
  hunger_zero_days: 0,
  low_mood_days: 0,
  days_since_rent: 0
};

// Данные действий
const actions = {
  home: [
    {
      name: "Помыться",
      cost: 0,
      effects: { sanity: 10, incel_level: -10, fatigue: 5 },
      description: "Принять душ и привести себя в порядок"
    },
    {
      name: "Побриться",
      cost: 0,
      effects: { sanity: 5, incel_level: -5, fatigue: 3 },
      description: "Побриться и выглядеть лучше"
    },
    {
      name: "Еда от родителей",
      cost: 0,
      effects: { hunger: 40, mood: 5, fatigue: 2 },
      description: "Поесть домашнюю еду"
    },
    {
      name: "Просить еду",
      cost: 0,
      effects: { hunger: 20, mood: -10, incel_level: 5 },
      description: "Унизительно попросить у родителей"
    },
    {
      name: "Оплатить ЖКХ",
      cost: 5000,
      effects: { money: -5000 },
      description: "Оплатить коммунальные услуги (5000₽)"
    }
  ],
  work: [
    {
      name: "Асфальт",
      money_range: [2200, 3800],
      effects: { health: -15, fatigue: 25, mood: -8, incel_level: 8, sanity: 3 },
      description: "Тяжелая работа (2200-3800₽)",
      events: [
        { name: "Скандал с коллегами", probability: 12, effects: { mood: -15, health: -5 } },
        { name: "Начальник похвалил", probability: 6, effects: { mood: 10, money: 500 } },
        { name: "Штраф за брак", probability: 8, effects: { money: -800, mood: -10 } }
      ]
    },
    {
      name: "Доставка",
      money_range: [800, 1500],
      effects: { health: -8, fatigue: 15, mood: -3, incel_level: 4, sanity: 6 },
      description: "Работа курьером (800-1500₽)",
      events: [
        { name: "Чаевые клиента", probability: 15, effects: { money: 300, mood: 5 } },
        { name: "Попал под дождь", probability: 6, effects: { health: -10, mood: -5 } },
        { name: "Наглая собака", probability: 7, effects: { health: -5, mood: -8 } }
      ]
    }
  ],
  outside: [
    {
      name: "Гулять",
      cost: 0,
      effects: { sanity: 8, incel_level: -8, fatigue: 10, mood: 5 },
      description: "Прогуляться на свежем воздухе",
      events: [
        { name: "Встретил гопников", probability: 25, effects: { health: -20, money: -500, god_complex: -10, mood: -15 } }
      ]
    },
    {
      name: "Звонить Вике",
      cost: 0,
      description: "Позвонить Вике (шанс 30%)",
      special: "vika_call"
    },
    {
      name: "Встреча с Викой",
      cost: 10000,
      effects: { mood: 30, vika_relationship: 20, sanity: 15, money: -10000 },
      description: "Встретиться с Викой (10000₽)",
      requirements: { vika_relationship: 50 }
    }
  ],
  entertainment: [
    {
      name: "Дрочка",
      cost: 0,
      effects: { health: 5, mood: 10, sanity: -5, incel_level: 10, fatigue: 8 },
      description: "Снять напряжение"
    },
    {
      name: "Мамба",
      cost: 8000,
      effects: { health: -5, mood: 15, money: -8000, incel_level: 5, fatigue: 5 },
      description: "Оплатить Мамбу (8000₽)"
    },
    {
      name: "Постинг",
      cost: 0,
      effects: { mood: 8, sanity: -8, incel_level: 12, fatigue: 10 },
      description: "Постить в соцсетях"
    },
    {
      name: "Фотка пениса",
      cost: 0,
      effects: { mood: 5, god_complex: 15, incel_level: 8, sanity: -10 },
      description: "Сделать интимное фото"
    }
  ],
  health: [
    {
      name: "Больница",
      cost: 2000,
      effects: { health: 30, sanity: 10, mood: -5, money: -2000, fatigue: 5 },
      description: "Обратиться к врачу (2000₽)"
    },
    {
      name: "Сон",
      cost: 0,
      effects: { fatigue: -50, health: 5 },
      description: "Выспаться и восстановить силы"
    },
    {
      name: "Помойка (еда)",
      cost: 0,
      effects: { hunger: 30, health: -10, sanity: -15, incel_level: 15, mood: -5 },
      description: "Найти еду в мусорных баках"
    }
  ]
};

const categoryTitles = {
  home: "🏠 Дом",
  work: "💼 Работа",
  outside: "🌆 Выход",
  entertainment: "🎮 Развлечения",
  health: "🏥 Здоровье"
};

// Инициализация при загрузке
function init() {
  updateUI();
  addEvent("Добро пожаловать в симулятор жизни MATVEY! Выберите действие.", "neutral");
}

// Обновление интерфейса
function updateUI() {
  // Обновление параметров
  document.getElementById('days').textContent = gameState.days_survived;
  document.getElementById('money').textContent = gameState.money;
  
  updateStat('health', gameState.health);
  updateStat('mood', gameState.mood);
  updateStat('hunger', gameState.hunger);
  updateStat('sanity', gameState.sanity);
  updateStat('incel', gameState.incel_level);
  updateStat('god', gameState.god_complex);
  updateStat('fatigue', gameState.fatigue);
  updateStat('vika', gameState.vika_relationship);
}

function updateStat(id, value) {
  const clampedValue = Math.max(0, Math.min(100, value));
  document.getElementById(id).textContent = clampedValue;
  document.getElementById(id + '-bar').style.width = clampedValue + '%';
}

// Добавление события в лог
function addEvent(message, type = 'neutral') {
  const eventsSection = document.getElementById('events');
  const eventDiv = document.createElement('div');
  eventDiv.className = `event-message ${type}`;
  eventDiv.textContent = message;
  eventsSection.insertBefore(eventDiv, eventsSection.firstChild);
  
  // Ограничиваем количество событий
  while (eventsSection.children.length > 5) {
    eventsSection.removeChild(eventsSection.lastChild);
  }
}

// Открытие модального окна категории
function openCategory(category) {
  const modal = document.getElementById('actionModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  
  modalTitle.textContent = categoryTitles[category];
  modalBody.innerHTML = '';
  
  const categoryActions = actions[category];
  categoryActions.forEach((action, index) => {
    const btn = document.createElement('button');
    btn.className = 'action-btn';
    
    const isBlocked = isActionBlocked(action);
    const canAfford = action.cost ? gameState.money >= action.cost : true;
    const meetsRequirements = checkRequirements(action);
    
    if (isBlocked || !canAfford || !meetsRequirements) {
      btn.disabled = true;
    }
    
    let details = action.description;
    if (isBlocked) {
      details += " [ЗАБЛОКИРОВАНО]";
    } else if (!canAfford) {
      details += " [Недостаточно денег]";
    } else if (!meetsRequirements) {
      details += " [Не выполнены условия]";
    }
    
    btn.innerHTML = `
      <div class="action-name">${action.name}</div>
      <div class="action-details">${details}</div>
    `;
    
    btn.onclick = () => performAction(category, index);
    modalBody.appendChild(btn);
  });
  
  modal.classList.add('active');
}

// Проверка блокировки действия
function isActionBlocked(action) {
  // Комплекс Бога >50 блокирует гигиену и выход
  if (gameState.god_complex > 50) {
    if (action.name === "Помыться" || action.name === "Побриться" || action.name === "Гулять") {
      return true;
    }
  }
  
  // Усталость >80 блокирует работу, прогулки, постинг
  if (gameState.fatigue > 80) {
    if (action.name === "Асфальт" || action.name === "Доставка" || action.name === "Гулять" || action.name === "Постинг") {
      return true;
    }
  }
  
  return false;
}

// Проверка требований
function checkRequirements(action) {
  if (!action.requirements) return true;
  
  for (let key in action.requirements) {
    if (gameState[key] < action.requirements[key]) {
      return false;
    }
  }
  return true;
}

// Выполнение действия
function performAction(category, actionIndex) {
  closeModal();
  
  const action = actions[category][actionIndex];
  let message = `Вы: ${action.name}.`;
  let messageType = 'neutral';
  
  // Специальные действия
  if (action.special === 'vika_call') {
    const success = Math.random() < 0.3;
    if (success) {
      applyEffects({ mood: 15, vika_relationship: 10, god_complex: 5 });
      message += " Вика ответила! Приятный разговор.";
      messageType = 'positive';
    } else {
      applyEffects({ mood: -20, vika_relationship: -15, god_complex: -5 });
      message += " Вика не взяла трубку... Обидно.";
      messageType = 'negative';
    }
  } else {
    // Применение эффектов
    if (action.effects) {
      applyEffects(action.effects);
    }
    
    // Работа с диапазоном денег
    if (action.money_range) {
      const earned = Math.floor(Math.random() * (action.money_range[1] - action.money_range[0] + 1)) + action.money_range[0];
      gameState.money += earned;
      message += ` Заработано: ${earned}₽.`;
      messageType = 'positive';
    }
    
    // Случайные события
    if (action.events) {
      action.events.forEach(event => {
        if (Math.random() * 100 < event.probability) {
          message += ` ${event.name}!`;
          applyEffects(event.effects);
          messageType = event.effects.mood && event.effects.mood < 0 ? 'negative' : 'positive';
        }
      });
    }
  }
  
  // Переход на следующий день
  nextDay();
  
  addEvent(message, messageType);
  showResult(message);
  updateUI();
  checkGameOver();
}

// Применение эффектов
function applyEffects(effects) {
  for (let key in effects) {
    if (gameState.hasOwnProperty(key)) {
      gameState[key] += effects[key];
      
      // Ограничения для параметров 0-100
      if (['health', 'mood', 'hunger', 'sanity', 'incel_level', 'god_complex', 'fatigue', 'vika_relationship'].includes(key)) {
        gameState[key] = Math.max(0, Math.min(100, gameState[key]));
      }
    }
  }
}

// Переход на следующий день
function nextDay() {
  gameState.days_survived++;
  gameState.days_since_rent++;
  
  // Ежедневные изменения
  gameState.hunger -= 25;
  gameState.hunger = Math.max(0, gameState.hunger);
  
  // Депрессия влияет на отношения с Викой
  if (gameState.mood < 20) {
    gameState.vika_relationship -= 10;
    gameState.vika_relationship = Math.max(0, gameState.vika_relationship);
    gameState.low_mood_days++;
  } else {
    gameState.low_mood_days = 0;
  }
  
  // Счетчик дней с нулевой сытостью
  if (gameState.hunger === 0) {
    gameState.hunger_zero_days++;
  } else {
    gameState.hunger_zero_days = 0;
  }
  
  // ЖКХ каждые 7 дней
  if (gameState.days_since_rent >= 7) {
    gameState.money -= 5000;
    gameState.days_since_rent = 0;
    addEvent("Списано 5000₽ за ЖКХ", "negative");
  }
}

// Проверка условий окончания игры
function checkGameOver() {
  let gameOverMessage = '';
  let isGameOver = false;
  
  // Смерть от здоровья
  if (gameState.health <= 0) {
    gameOverMessage = 'Вы умерли от болезней и травм...';
    isGameOver = true;
  }
  // Смерть от голода
  else if (gameState.hunger_zero_days >= 3) {
    gameOverMessage = 'Вы умерли от голода...';
    isGameOver = true;
  }
  // Суицид
  else if (gameState.low_mood_days >= 3) {
    gameOverMessage = 'Вы свели счеты с жизнью из-за депрессии...';
    isGameOver = true;
  }
  // Комплекс Бога
  else if (gameState.god_complex >= 100) {
    gameOverMessage = 'Ваш комплекс Бога достиг критической точки. Вы потеряли связь с реальностью...';
    isGameOver = true;
  }
  // Победа
  else if (gameState.vika_relationship >= 100) {
    gameOverMessage = `Поздравляем! Вика согласилась быть с вами! Вы прожили ${gameState.days_survived} дней.`;
    isGameOver = true;
  }
  
  if (isGameOver) {
    showGameOver(gameOverMessage);
  }
}

// Показать результат действия
function showResult(message) {
  const modal = document.getElementById('resultModal');
  const resultBody = document.getElementById('resultBody');
  resultBody.textContent = message;
  modal.classList.add('active');
}

function closeResultModal() {
  document.getElementById('resultModal').classList.remove('active');
}

// Показать Game Over
function showGameOver(message) {
  const modal = document.getElementById('gameOverModal');
  const gameOverBody = document.getElementById('gameOverBody');
  gameOverBody.innerHTML = `
    <p>${message}</p>
    <p><strong>Дней прожито: ${gameState.days_survived}</strong></p>
    <p><strong>Заработано денег: ${gameState.money}₽</strong></p>
  `;
  modal.classList.add('active');
}

// Перезапуск игры
function restartGame() {
  gameState = {
    health: 50,
    mood: 50,
    hunger: 75,
    sanity: 50,
    incel_level: 30,
    god_complex: 0,
    fatigue: 0,
    money: 1000,
    vika_relationship: 0,
    days_survived: 0,
    hunger_zero_days: 0,
    low_mood_days: 0,
    days_since_rent: 0
  };
  
  document.getElementById('gameOverModal').classList.remove('active');
  document.getElementById('events').innerHTML = '<div class="event-message neutral">Новая игра началась! Удачи!</div>';
  updateUI();
}

// Закрытие модального окна
function closeModal() {
  document.getElementById('actionModal').classList.remove('active');
}

// Запуск игры при загрузке
window.addEventListener('DOMContentLoaded', init);