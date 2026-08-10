const storageKeys = {
  participants: 'techfestParticipants',
  tasks: 'techfestTasks'
};

const eventLabels = {
  hackathon: 'Define 4.0',
  robowars: 'RoboWars',
  webdev: 'Web Dev Showdown'
};

const saveParticipantAsync = async (participant) => {
  await new Promise((resolve) => setTimeout(resolve, 220));
  return participant;
};

const initWelcomeMessage = () => {
  const welcomeMessage = document.getElementById('welcomeMessage');
  if (!welcomeMessage) return;

  const savedName = sessionStorage.getItem('visitorName');
  if (savedName) {
    welcomeMessage.textContent = `Welcome back, ${savedName}!`;
    return;
  }

  const name = window.prompt('Welcome to TechFest 2026! What is your name?');
  if (name && name.trim()) {
    const cleanName = name.trim();
    sessionStorage.setItem('visitorName', cleanName);
    welcomeMessage.textContent = `Welcome, ${cleanName}!`;
  }
};

const initTaskManager = () => {
  const taskInput = document.getElementById('taskInput');
  const addTaskButton = document.getElementById('addTask');
  const taskList = document.getElementById('taskList');

  if (!taskInput || !addTaskButton || !taskList) return;

  let tasks = JSON.parse(localStorage.getItem(storageKeys.tasks) || '[]');

  const renderTasks = () => {
    taskList.innerHTML = '';

    if (!tasks.length) {
      const emptyState = document.createElement('li');
      emptyState.className = 'task-empty';
      emptyState.textContent = 'No organizer tasks yet.';
      taskList.appendChild(emptyState);
      return;
    }

    tasks.map((task) => {
      const item = document.createElement('li');
      item.className = `task-item${task.completed ? ' completed' : ''}`;
      item.innerHTML = `
        <button type="button" class="task-toggle" data-id="${task.id}" aria-label="Toggle task"></button>
        <span class="task-text">${task.text}</span>
        <button type="button" class="task-delete" data-id="${task.id}" aria-label="Delete task">×</button>
      `;
      taskList.appendChild(item);
      return item;
    });
  };

  const saveTasks = () => {
    localStorage.setItem(storageKeys.tasks, JSON.stringify(tasks));
  };

  const addTask = () => {
    const text = taskInput.value.trim();
    if (!text) return;

    tasks = [...tasks, {
      id: Date.now(),
      text,
      completed: false
    }];
    taskInput.value = '';
    saveTasks();
    renderTasks();
  };

  addTaskButton.addEventListener('click', addTask);
  taskInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTask();
    }
  });

  taskList.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;

    const id = Number(button.getAttribute('data-id'));
    if (button.classList.contains('task-toggle')) {
      tasks = tasks.map((task) => task.id === id ? { ...task, completed: !task.completed } : task);
      saveTasks();
      renderTasks();
    }

    if (button.classList.contains('task-delete')) {
      tasks = tasks.filter((task) => task.id !== id);
      saveTasks();
      renderTasks();
    }
  });

  renderTasks();
};

const initEventsPage = () => {
  const eventSearch = document.getElementById('eventSearch');
  const eventCards = document.getElementById('eventCards');

  if (!eventSearch || !eventCards) return;

  const eventData = [
    { id: 1, name: 'Define 4.0', category: 'Technical', fee: 100, seats: 50 },
    { id: 2, name: 'Bug Smash', category: 'Coding', fee: 50, seats: 40 },
    { id: 3, name: 'Pixel Perfect', category: 'UI/UX', fee: 80, seats: 35 },
    { id: 4, name: 'RoboWars', category: 'Hardware', fee: 120, seats: 25 }
  ];

  const renderEvents = () => {
    const searchTerm = eventSearch.value.trim().toLowerCase();
    const visibleEvents = eventData.filter(({ name, category }) => `${name} ${category}`.toLowerCase().includes(searchTerm));
    eventCards.innerHTML = '';

    visibleEvents.forEach((event) => {
      const card = document.createElement('article');
      card.className = 'dynamic-event-card';
      card.innerHTML = `
        <h3>${event.name}</h3>
        <p><strong>Category:</strong> ${event.category}</p>
        <p><strong>Fee:</strong> ₹${event.fee}</p>
        <p><strong>Seats:</strong> ${event.seats}</p>
      `;
      eventCards.appendChild(card);
    });
  };

  eventSearch.addEventListener('input', renderEvents);
  renderEvents();
};

const initRegistration = () => {
  const form = document.getElementById('registrationForm');
  if (!form) return;

  const nameInput = document.getElementById('fullname');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const dobInput = document.getElementById('dob');
  const departmentInput = document.getElementById('dept');
  const messageInput = document.getElementById('comments');
  const participantSearch = document.getElementById('participantSearch');
  const participantList = document.getElementById('participantList');
  const participantCount = document.getElementById('participantCount');
  const participantSummary = document.getElementById('participantSummary');
  const clearParticipantsButton = document.getElementById('clearParticipants');
  const submitButton = form.querySelector('button[type="submit"]');

  if (!nameInput || !emailInput || !phoneInput || !dobInput || !departmentInput || !messageInput || !participantList || !participantCount || !submitButton) return;

  const textInputs = [nameInput, emailInput, phoneInput, dobInput, messageInput];
  textInputs.forEach((input) => {
    const error = document.createElement('div');
    error.className = 'field-error';
    error.setAttribute('aria-live', 'polite');
    input.closest('.input-content').appendChild(error);
  });

  let participants = JSON.parse(localStorage.getItem(storageKeys.participants) || '[]');
  let editingId = null;

  const resetValidation = () => {
    [nameInput, emailInput, phoneInput, dobInput, departmentInput, messageInput].forEach((field) => {
      field.classList.remove('input-valid', 'input-invalid');
      if (field.closest('.input-content')) {
        const error = field.closest('.input-content').querySelector('.field-error');
        if (error) error.textContent = '';
      }
    });
    form.querySelectorAll('input[name="events"]').forEach((checkbox) => {
      checkbox.checked = false;
    });
  };

  const resetForm = () => {
    form.reset();
    resetValidation();
    editingId = null;
    submitButton.innerHTML = '<span>Submit Application</span><span class="sign-arrow">→</span>';
  };

  const validateField = (input, validator, message) => {
    const value = input.value.trim();
    const error = input.closest('.input-content').querySelector('.field-error');

    if (!validator(value)) {
      input.classList.remove('input-valid');
      input.classList.add('input-invalid');
      if (error) error.textContent = message;
      return false;
    }

    input.classList.remove('input-invalid');
    input.classList.add('input-valid');
    if (error) error.textContent = '';
    return true;
  };

  const renderParticipants = () => {
    const searchTerm = participantSearch ? participantSearch.value.trim().toLowerCase() : '';
    const visibleParticipants = participants.filter(({ name, email, phone, department }) => {
      const haystack = `${name} ${email} ${phone} ${department}`.toLowerCase();
      return haystack.includes(searchTerm);
    });

    participantList.innerHTML = '';

    if (!visibleParticipants.length) {
      const emptyState = document.createElement('p');
      emptyState.className = 'participant-empty';
      emptyState.textContent = 'No participants yet.';
      participantList.appendChild(emptyState);
    }

    visibleParticipants.forEach((participant) => {
      const { id, name, email, phone, department, events: registeredEvents } = participant;
      const item = document.createElement('article');
      item.className = 'participant-item';
      item.innerHTML = `
        <div class="participant-main">
          <h3>${name}</h3>
          <p>${email}</p>
          <p>${phone}</p>
          <p>${department}</p>
          <p class="participant-events">${registeredEvents.join(', ')}</p>
        </div>
        <div class="participant-actions">
          <button type="button" data-action="edit" data-id="${id}">Edit</button>
          <button type="button" data-action="delete" data-id="${id}">Delete</button>
        </div>
      `;
      participantList.appendChild(item);
    });

    participantCount.textContent = String(participants.length);
    const totalRegistrations = participants.reduce((total, participant) => total + participant.events.length, 0);
    if (participantSummary) participantSummary.textContent = `Total registrations: ${totalRegistrations}`;
  };

  const saveParticipants = () => {
    localStorage.setItem(storageKeys.participants, JSON.stringify(participants));
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const isNameValid = validateField(nameInput, (value) => /^[A-Za-z][A-Za-z .'-]{2,49}$/.test(value), 'Name must start with a letter and be 3-50 characters long.');
    const isEmailValid = validateField(emailInput, (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value), 'Enter a valid email address.');
    const isPhoneValid = validateField(phoneInput, (value) => /^[6-9]\d{9}$/.test(value), 'Enter a valid 10-digit Indian mobile number.');

    if (!isNameValid || !isEmailValid || !isPhoneValid) return;

    const selectedEvents = Array.from(form.querySelectorAll('input[name="events"]:checked')).map((checkbox) => eventLabels[checkbox.value] || checkbox.value);
    const participant = {
      id: editingId || Date.now(),
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      dob: dobInput.value,
      gender: form.querySelector('input[name="gender"]:checked')?.value || 'other',
      department: departmentInput.value,
      events: selectedEvents,
      message: messageInput.value.trim()
    };

    if (editingId) {
      participants = participants.map((item) => item.id === editingId ? participant : item);
    } else {
      participants = [...participants, participant];
    }

    await saveParticipantAsync(participant);
    saveParticipants();
    renderParticipants();
    resetForm();
  });

  if (participantSearch) {
    participantSearch.addEventListener('input', renderParticipants);
  }

  clearParticipantsButton?.addEventListener('click', () => {
    participants = [];
    saveParticipants();
    renderParticipants();
    resetForm();
  });

  participantList.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;

    const id = Number(button.getAttribute('data-id'));
    if (button.getAttribute('data-action') === 'delete') {
      participants = participants.filter((participant) => participant.id !== id);
      saveParticipants();
      renderParticipants();
      return;
    }

    const participant = participants.find((item) => item.id === id);
    if (!participant) return;

    editingId = participant.id;
    nameInput.value = participant.name;
    emailInput.value = participant.email;
    phoneInput.value = participant.phone;
    dobInput.value = participant.dob;
    departmentInput.value = participant.department;
    messageInput.value = participant.message;

    const genderInput = form.querySelector(`input[name="gender"][value="${participant.gender}"]`);
    if (genderInput) genderInput.checked = true;

    participant.events.forEach((eventName) => {
      const eventValue = Object.keys(eventLabels).find((key) => eventLabels[key] === eventName);
      if (eventValue) {
        const checkbox = form.querySelector(`input[name="events"][value="${eventValue}"]`);
        if (checkbox) checkbox.checked = true;
      }
    });

    submitButton.innerHTML = '<span>Update Participant</span><span class="sign-arrow">→</span>';
    nameInput.focus();
  });

  resetForm();
  renderParticipants();
};

const initGlyphMatrixBackground = () => {
  const existingCanvas = document.getElementById('glyphMatrixBackground');
  if (existingCanvas) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'glyphMatrixBackground';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);

  const context = canvas.getContext('2d');
  if (!context) return;

  const glyphs = '01·•+*/\\<>=';
  const cellSize = 16;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width = 0;
  let height = 0;
  let columns = 0;
  let drops = [];

  const reset = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    columns = Math.max(1, Math.floor(width / cellSize) + 1);
    drops = Array.from({ length: columns }, () => Math.floor(Math.random() * (height / cellSize)) + 1);
  };

  const draw = () => {
    context.clearRect(0, 0, width, height);
    context.fillStyle = 'rgba(20, 20, 15, 0.045)';
    context.fillRect(0, 0, width, height);
    context.font = `${cellSize}px monospace`;
    context.fillStyle = 'rgba(255, 59, 31, 0.12)';

    for (let index = 0; index < columns; index += 1) {
      const x = index * cellSize;
      const y = drops[index] * cellSize;
      const glyph = glyphs[Math.floor(Math.random() * glyphs.length)];
      context.fillText(glyph, x, y);

      if (y > height && Math.random() > 0.97) {
        drops[index] = 0;
      } else {
        drops[index] += 1;
      }
    }

    if (!reduceMotion) {
      window.requestAnimationFrame(draw);
    }
  };

  reset();
  draw();
  window.addEventListener('resize', reset);
};

const initGallery = () => {
  const galleryImages = document.querySelectorAll('.gallery-thumb');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeButton = document.getElementById('closeLightbox');
  const nextButton = document.getElementById('nextImage');
  const prevButton = document.getElementById('prevImage');
  const startSlideshowButton = document.getElementById('startSlideshow');
  const stopSlideshowButton = document.getElementById('stopSlideshow');

  if (!galleryImages.length || !lightbox || !lightboxImage || !lightboxCaption) return;

  const images = Array.from(galleryImages).map((image) => ({
    src: image.getAttribute('src'),
    alt: image.getAttribute('alt') || 'Gallery image',
    caption: image.getAttribute('data-caption') || 'TechFest image'
  }));

  let currentIndex = 0;
  let slideshowTimer = null;

  const updateLightbox = () => {
    const image = images[currentIndex];
    if (!image) return;
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = image.caption;
  };

  const openLightbox = (index) => {
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add('open');
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    if (slideshowTimer) {
      clearInterval(slideshowTimer);
      slideshowTimer = null;
    }
  };

  const nextImage = () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateLightbox();
  };

  const previousImage = () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateLightbox();
  };

  const startSlideshow = () => {
    if (slideshowTimer) return;
    slideshowTimer = setInterval(nextImage, 3000);
  };

  const stopSlideshow = () => {
    if (slideshowTimer) {
      clearInterval(slideshowTimer);
      slideshowTimer = null;
    }
  };

  galleryImages.forEach((image, index) => {
    image.addEventListener('click', () => openLightbox(index));
  });

  closeButton?.addEventListener('click', closeLightbox);
  nextButton?.addEventListener('click', nextImage);
  prevButton?.addEventListener('click', previousImage);
  startSlideshowButton?.addEventListener('click', startSlideshow);
  stopSlideshowButton?.addEventListener('click', stopSlideshow);

  document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('open')) return;

    if (event.key === 'ArrowRight') {
      nextImage();
    }

    if (event.key === 'ArrowLeft') {
      previousImage();
    }

    if (event.key === 'Escape') {
      closeLightbox();
    }
  });
};

document.addEventListener('DOMContentLoaded', () => {
  initGlyphMatrixBackground();
  initWelcomeMessage();
  initTaskManager();
  initEventsPage();
  initRegistration();
  initGallery();
});
