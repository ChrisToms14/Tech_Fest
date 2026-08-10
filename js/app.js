const storageKeys = {
  users: 'techfestUsers',
  participants: 'techfestParticipants',
  tasks: 'techfestTasks',
  authSession: 'techfestAuthSession',
  visitorName: 'visitorName'
};

const eventLabels = {
  hackathon: 'Define 4.0',
  robowars: 'RoboWars',
  webdev: 'Web Dev Showdown'
};

const defaultAdmin = {
  id: 1,
  name: 'Administrator',
  username: 'admin',
  email: 'admin@techfest2026.edu',
  password: 'admin123',
  role: 'admin'
};

const pageName = window.location.pathname.split('/').pop() || 'index.html';

const getStoredUsers = () => {
  const stored = localStorage.getItem(storageKeys.users);
  return stored ? JSON.parse(stored) : [];
};

const saveUsers = (users) => {
  localStorage.setItem(storageKeys.users, JSON.stringify(users));
};

const ensureDefaultAdmin = () => {
  const users = getStoredUsers();
  if (!users.some((user) => user.username === 'admin')) {
    users.unshift(defaultAdmin);
    saveUsers(users);
  }
  return getStoredUsers();
};

const getCurrentUser = () => {
  const stored = localStorage.getItem(storageKeys.authSession);
  return stored ? JSON.parse(stored) : null;
};

const setCurrentUser = (user) => {
  localStorage.setItem(storageKeys.authSession, JSON.stringify(user));
};

const clearCurrentUser = () => {
  localStorage.removeItem(storageKeys.authSession);
  sessionStorage.removeItem(storageKeys.visitorName);
};

const getParticipants = () => {
  const stored = localStorage.getItem(storageKeys.participants);
  return stored ? JSON.parse(stored) : [];
};

const saveParticipants = (participants) => {
  localStorage.setItem(storageKeys.participants, JSON.stringify(participants));
};

const getTasks = () => {
  const stored = localStorage.getItem(storageKeys.tasks);
  return stored ? JSON.parse(stored) : [];
};

const saveTasks = (tasks) => {
  localStorage.setItem(storageKeys.tasks, JSON.stringify(tasks));
};

const setFeedback = (element, message, type = 'error') => {
  if (!element) return;
  element.textContent = message;
  element.className = `form-feedback ${type}`;
};

const saveParticipantAsync = async (participant) => {
  await new Promise((resolve) => setTimeout(resolve, 220));
  return participant;
};

const initAuthProtection = () => {
  ensureDefaultAdmin();

  const currentUser = getCurrentUser();
  const isAuthPage = ['login.html', 'signup.html'].includes(pageName);
  const isAdminPage = pageName === 'admin.html';

  if (!currentUser && !isAuthPage) {
    window.location.replace('login.html');
    return false;
  }

  if (currentUser && isAuthPage) {
    window.location.replace('index.html');
    return false;
  }

  if (isAdminPage && currentUser?.role !== 'admin') {
    window.location.replace('index.html');
    return false;
  }

  return true;
};

const initNavigation = (currentUser) => {
  const nav = document.querySelector('.nav-links');
  if (!nav) return;

  nav.querySelectorAll('.nav-auth-link').forEach((link) => link.remove());

  const authLink = currentUser
    ? '<a href="login.html" class="nav-auth-link" data-action="logout">Logout</a>'
    : '<a href="login.html" class="nav-auth-link">Login</a>';

  nav.insertAdjacentHTML('beforeend', authLink);

  if (currentUser?.role === 'admin') {
    nav.insertAdjacentHTML('beforeend', '<a href="admin.html" class="nav-auth-link">Admin</a>');
  }

  nav.addEventListener('click', (event) => {
    const logoutLink = event.target.closest('a[data-action="logout"]');
    if (!logoutLink) return;
    event.preventDefault();
    clearCurrentUser();
    window.location.href = 'login.html';
  });
};

const initAuthPages = () => {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    const feedback = document.getElementById('loginFeedback');
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const username = document.getElementById('loginUsername').value.trim();
      const password = document.getElementById('loginPassword').value.trim();

      const users = ensureDefaultAdmin();
      const matchedUser = users.find((user) => (user.username === username || user.email === username) && user.password === password);

      if (!matchedUser) {
        setFeedback(feedback, 'Invalid username or password.', 'error');
        return;
      }

      setCurrentUser(matchedUser);
      setFeedback(feedback, 'Signed in successfully.', 'success');
      window.location.href = matchedUser.role === 'admin' ? 'admin.html' : 'index.html';
    });
  }

  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    const feedback = document.getElementById('signupFeedback');
    signupForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = document.getElementById('signupName').value.trim();
      const username = document.getElementById('signupUsername').value.trim();
      const email = document.getElementById('signupEmail').value.trim();
      const password = document.getElementById('signupPassword').value.trim();
      const confirmPassword = document.getElementById('signupConfirmPassword').value.trim();

      if (!name || !username || !email || !password || !confirmPassword) {
        setFeedback(feedback, 'Please complete every field.', 'error');
        return;
      }

      if (password.length < 6) {
        setFeedback(feedback, 'Password must be at least 6 characters long.', 'error');
        return;
      }

      if (password !== confirmPassword) {
        setFeedback(feedback, 'Passwords do not match.', 'error');
        return;
      }

      const users = ensureDefaultAdmin();
      if (users.some((user) => user.username === username || user.email === email)) {
        setFeedback(feedback, 'That username or email is already taken.', 'error');
        return;
      }

      const newUser = {
        id: Date.now(),
        name,
        username,
        email,
        password,
        role: 'participant'
      };

      users.push(newUser);
      saveUsers(users);
      setCurrentUser(newUser);
      setFeedback(feedback, 'Account created successfully.', 'success');
      window.location.href = 'index.html';
    });
  }
};

const initWelcomeMessage = () => {
  const welcomeMessage = document.getElementById('welcomeMessage');
  const authSummary = document.getElementById('authSummary');
  if (!welcomeMessage) return;

  const currentUser = getCurrentUser();
  if (currentUser) {
    welcomeMessage.textContent = `Welcome, ${currentUser.name || currentUser.username}!`;
    if (authSummary) {
      authSummary.textContent = currentUser.role === 'admin'
        ? 'You can manage tasks and review registrations from the admin dashboard.'
        : 'You can explore the festival pages and register for experiences.';
    }
    return;
  }

  welcomeMessage.textContent = 'Welcome to TechFest 2026!';
  if (authSummary) {
    authSummary.textContent = 'Please log in to unlock the full experience.';
  }
};

const initTaskManager = () => {
  const taskInput = document.getElementById('taskInput');
  const addTaskButton = document.getElementById('addTask');
  const taskList = document.getElementById('taskList');

  if (!taskInput || !addTaskButton || !taskList) return;

  let tasks = getTasks();

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

  const addTask = () => {
    const text = taskInput.value.trim();
    if (!text) return;

    tasks = [...tasks, {
      id: Date.now(),
      text,
      completed: false
    }];
    taskInput.value = '';
    saveTasks(tasks);
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
      saveTasks(tasks);
      renderTasks();
    }

    if (button.classList.contains('task-delete')) {
      tasks = tasks.filter((task) => task.id !== id);
      saveTasks(tasks);
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

  const formFeedback = document.getElementById('formFeedback');
  const nameInput = document.getElementById('fullname');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const dobInput = document.getElementById('dob');
  const departmentInput = document.getElementById('dept');
  const messageInput = document.getElementById('comments');
  const submitButton = form.querySelector('button[type="submit"]');

  if (!nameInput || !emailInput || !phoneInput || !dobInput || !departmentInput || !messageInput || !submitButton) return;

  const textInputs = [nameInput, emailInput, phoneInput, dobInput, messageInput];
  textInputs.forEach((input) => {
    const error = document.createElement('div');
    error.className = 'field-error';
    error.setAttribute('aria-live', 'polite');
    input.closest('.input-content').appendChild(error);
  });

  let participants = getParticipants();
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
    sessionStorage.removeItem('editingParticipantId');
    if (submitButton) {
      submitButton.innerHTML = '<span>Submit Application</span><span class="sign-arrow">→</span>';
    }
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

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const isNameValid = validateField(nameInput, (value) => /^[A-Za-z][A-Za-z .'-]{2,49}$/.test(value), 'Name must start with a letter and be 3-50 characters long.');
    const isEmailValid = validateField(emailInput, (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value), 'Enter a valid email address.');
    const isPhoneValid = validateField(phoneInput, (value) => /^[6-9]\d{9}$/.test(value), 'Enter a valid 10-digit Indian mobile number.');

    if (!isNameValid || !isEmailValid || !isPhoneValid) {
      setFeedback(formFeedback, 'Please correct the invalid fields before submitting.', 'error');
      return;
    }

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
    saveParticipants(participants);
    setFeedback(formFeedback, editingId ? 'Participant updated successfully.' : 'Registration saved successfully. The admin can review it from the admin dashboard.', 'success');
    resetForm();
  });

  const editingParticipantId = sessionStorage.getItem('editingParticipantId');
  if (editingParticipantId) {
    const participant = participants.find((entry) => entry.id === Number(editingParticipantId));
    if (participant) {
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
    }
  }

  resetValidation();
};

const initAdminParticipants = () => {
  const participantSearch = document.getElementById('participantSearch');
  const participantList = document.getElementById('participantList');
  const participantCount = document.getElementById('participantCount');
  const participantSummary = document.getElementById('participantSummary');
  const clearParticipantsButton = document.getElementById('clearParticipants');

  if (!participantList || !participantCount || !participantSummary) return;

  let participants = getParticipants();

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
    participantSummary.textContent = `Total registrations: ${totalRegistrations}`;
  };

  participantSearch?.addEventListener('input', renderParticipants);

  clearParticipantsButton?.addEventListener('click', () => {
    participants = [];
    saveParticipants(participants);
    renderParticipants();
  });

  participantList.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;

    const id = Number(button.getAttribute('data-id'));
    if (button.getAttribute('data-action') === 'delete') {
      participants = participants.filter((participant) => participant.id !== id);
      saveParticipants(participants);
      renderParticipants();
      return;
    }

    sessionStorage.setItem('editingParticipantId', String(id));
    window.location.href = 'register.html';
  });

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
  if (!initAuthProtection()) return;

  const currentUser = getCurrentUser();
  initNavigation(currentUser);
  initAuthPages();
  initWelcomeMessage();
  initTaskManager();
  initEventsPage();
  initRegistration();
  initAdminParticipants();
  initGallery();
  initGlyphMatrixBackground();
});
