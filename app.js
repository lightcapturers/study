// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    buildNavigation();
    renderContent();
    setupEventListeners();
    
    // Load saved progress
    loadProgress();
    
    // Check theme preference
    checkThemePreference();
    
    // Initialize section progress bars
    updateSectionProgress();
});

// Function to build sidebar navigation
function buildNavigation() {
    const navList = document.getElementById('nav-list');
    
    studyData.sections.forEach(section => {
        const navItem = document.createElement('li');
        navItem.className = 'nav-item';
        
        const navLink = document.createElement('a');
        navLink.href = `#${section.id}`;
        navLink.className = 'nav-link';
        navLink.textContent = section.title;
        
        navItem.appendChild(navLink);
        
        if (section.subsections && section.subsections.length > 0) {
            const subnavList = document.createElement('ul');
            subnavList.className = 'subnav-list';
            
            section.subsections.forEach(subsection => {
                const subItem = document.createElement('li');
                subItem.className = 'nav-item';
                
                const subLink = document.createElement('a');
                subLink.href = `#${subsection.id}`;
                subLink.className = 'nav-link';
                subLink.textContent = subsection.title;
                
                // Add questions list for each subsection
                const questionsList = document.createElement('ul');
                questionsList.className = 'question-nav-list';
                
                subsection.questions.forEach(question => {
                    const questionItem = document.createElement('li');
                    questionItem.className = 'question-nav-item';
                    questionItem.dataset.id = question.id;
                    
                    const questionLink = document.createElement('a');
                    questionLink.href = `#question-${question.id}`;
                    questionLink.className = 'question-nav-link';
                    questionLink.textContent = question.question.substring(0, 60) + (question.question.length > 60 ? '...' : '');
                    
                    questionItem.appendChild(questionLink);
                    
                    // Add click event listener to scroll to question
                    questionLink.addEventListener('click', function(e) {
                        e.preventDefault();
                        const targetQuestion = document.getElementById(`question-${question.id}`);
                        if (targetQuestion) {
                            targetQuestion.scrollIntoView({ behavior: 'smooth' });
                            // Highlight the question briefly
                            targetQuestion.classList.add('highlight');
                            setTimeout(() => {
                                targetQuestion.classList.remove('highlight');
                            }, 2000);
                        }
                    });
                    
                    questionsList.appendChild(questionItem);
                });
                
                subItem.appendChild(questionsList);
                
                // Make subsection link toggle questions visibility
                subLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    subItem.classList.toggle('expanded');
                    const subsectionElement = document.getElementById(subsection.id);
                    if (subsectionElement) {
                        subsectionElement.scrollIntoView({ behavior: 'smooth' });
                    }
                });
                
                subnavList.appendChild(subItem);
            });
            
            navItem.appendChild(subnavList);
            
            // Make section link toggle subsection visibility
            navLink.addEventListener('click', function(e) {
                e.preventDefault();
                navItem.classList.toggle('expanded');
                const sectionElement = document.getElementById(section.id);
                if (sectionElement) {
                    sectionElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
        
        navList.appendChild(navItem);
    });
}

// Function to render content
function renderContent() {
    const contentElement = document.getElementById('content');
    
    studyData.sections.forEach(section => {
        const sectionElement = document.createElement('div');
        sectionElement.className = 'section';
        sectionElement.id = section.id;
        
        const sectionHeader = document.createElement('div');
        sectionHeader.className = 'section-header';
        
        const sectionTitle = document.createElement('h2');
        sectionTitle.className = 'section-title';
        sectionTitle.textContent = section.title;
        sectionTitle.setAttribute('role', 'button');
        sectionTitle.setAttribute('aria-expanded', 'true');
        sectionTitle.setAttribute('tabindex', '0');
        
        // Add toggle icon
        const toggleIcon = document.createElement('span');
        toggleIcon.className = 'toggle-icon';
        toggleIcon.innerHTML = '▼';
        sectionTitle.appendChild(toggleIcon);
        
        // Add progress bar to section
        const progressContainer = document.createElement('div');
        progressContainer.className = 'section-progress';
        
        const progressBar = document.createElement('div');
        progressBar.className = 'section-progress-bar';
        progressBar.style.width = '0%'; // Will be updated later
        
        progressContainer.appendChild(progressBar);
        sectionTitle.appendChild(progressContainer);
        
        sectionHeader.appendChild(sectionTitle);
        sectionElement.appendChild(sectionHeader);
        
        // Create content container for section (for toggling)
        const sectionContent = document.createElement('div');
        sectionContent.className = 'section-content';
        sectionElement.appendChild(sectionContent);
        
        section.subsections.forEach(subsection => {
            const subsectionElement = document.createElement('div');
            subsectionElement.className = 'subsection';
            subsectionElement.id = subsection.id;
            
            const subsectionHeader = document.createElement('div');
            subsectionHeader.className = 'subsection-header';
            
            const subsectionTitle = document.createElement('h3');
            subsectionTitle.className = 'subsection-title';
            subsectionTitle.textContent = subsection.title;
            subsectionTitle.setAttribute('role', 'button');
            subsectionTitle.setAttribute('aria-expanded', 'true');
            subsectionTitle.setAttribute('tabindex', '0');
            
            // Add toggle icon
            const toggleIcon = document.createElement('span');
            toggleIcon.className = 'toggle-icon';
            toggleIcon.innerHTML = '▼';
            subsectionTitle.appendChild(toggleIcon);
            
            subsectionHeader.appendChild(subsectionTitle);
            subsectionElement.appendChild(subsectionHeader);
            
            // Create content container for subsection (for toggling)
            const subsectionContent = document.createElement('div');
            subsectionContent.className = 'subsection-content';
            subsectionElement.appendChild(subsectionContent);
            
            subsection.questions.forEach(question => {
                const questionCard = document.createElement('div');
                questionCard.className = 'question-card';
                questionCard.dataset.id = question.id;
                questionCard.id = `question-${question.id}`;
                
                const questionElement = document.createElement('div');
                questionElement.className = 'question';
                questionElement.textContent = question.question;
                questionElement.setAttribute('tabindex', '0');
                questionElement.setAttribute('role', 'button');
                questionElement.setAttribute('aria-expanded', 'false');
                
                // Add bookmark button
                const bookmarkBtn = document.createElement('button');
                bookmarkBtn.className = 'bookmark-btn';
                bookmarkBtn.innerHTML = '&#9733;'; // Star symbol
                bookmarkBtn.setAttribute('aria-label', 'Bookmark this question');
                bookmarkBtn.setAttribute('title', 'Bookmark this question');
                
                const progressMarker = document.createElement('span');
                progressMarker.className = 'progress-marker';
                progressMarker.title = 'Mark as mastered';
                progressMarker.setAttribute('role', 'checkbox');
                progressMarker.setAttribute('aria-label', 'Mark as mastered');
                progressMarker.setAttribute('aria-checked', 'false');
                progressMarker.setAttribute('tabindex', '0');
                
                const answerElement = document.createElement('div');
                answerElement.className = 'answer';
                answerElement.id = `answer-${question.id}`;
                
                const answerLabel = document.createElement('span');
                answerLabel.className = 'answer-label';
                answerLabel.textContent = 'ANSWER:';
                
                answerElement.appendChild(answerLabel);
                answerElement.appendChild(document.createTextNode(' ' + question.answer));
                
                // Add confidence rating
                const confidenceRating = document.createElement('div');
                confidenceRating.className = 'confidence-rating';
                confidenceRating.innerHTML = `
                    <span>Confidence: </span>
                    <button class="confidence-btn" data-level="1">1</button>
                    <button class="confidence-btn" data-level="2">2</button>
                    <button class="confidence-btn" data-level="3">3</button>
                    <button class="confidence-btn" data-level="4">4</button>
                    <button class="confidence-btn" data-level="5">5</button>
                `;
                
                answerElement.appendChild(confidenceRating);
                
                questionCard.appendChild(bookmarkBtn);
                questionCard.appendChild(questionElement);
                questionCard.appendChild(progressMarker);
                questionCard.appendChild(answerElement);
                
                subsectionContent.appendChild(questionCard);
            });
            
            sectionContent.appendChild(subsectionElement);
        });
        
        contentElement.appendChild(sectionElement);
    });
}

// Set up event listeners
function setupEventListeners() {
    // Toggle sidebar on mobile
    document.getElementById('menu-toggle').addEventListener('click', function() {
        document.getElementById('sidebar').classList.toggle('active');
    });
    
    // Toggle dark/light mode
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    
    // Toggle answers
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('question')) {
            toggleAnswer(e.target);
        }
    });
    
    // Toggle sections
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('section-title') || 
            (e.target.parentElement && e.target.parentElement.classList.contains('section-title'))) {
            const sectionTitle = e.target.classList.contains('section-title') ? e.target : e.target.parentElement;
            const section = sectionTitle.closest('.section');
            const sectionContent = section.querySelector('.section-content');
            
            sectionTitle.classList.toggle('collapsed');
            sectionTitle.setAttribute('aria-expanded', !sectionTitle.classList.contains('collapsed'));
            
            // Toggle content display
            if (sectionTitle.classList.contains('collapsed')) {
                sectionContent.style.display = 'none';
            } else {
                sectionContent.style.display = 'block';
            }
        }
    });
    
    // Toggle subsections
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('subsection-title') || 
            (e.target.parentElement && e.target.parentElement.classList.contains('subsection-title'))) {
            const subsectionTitle = e.target.classList.contains('subsection-title') ? e.target : e.target.parentElement;
            const subsection = subsectionTitle.closest('.subsection');
            const subsectionContent = subsection.querySelector('.subsection-content');
            
            subsectionTitle.classList.toggle('collapsed');
            subsectionTitle.setAttribute('aria-expanded', !subsectionTitle.classList.contains('collapsed'));
            
            // Toggle content display
            if (subsectionTitle.classList.contains('collapsed')) {
                subsectionContent.style.display = 'none';
            } else {
                subsectionContent.style.display = 'block';
            }
        }
    });
    
    // Keyboard support for toggling answers
    document.addEventListener('keydown', function(e) {
        if (e.target.classList.contains('question') && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            toggleAnswer(e.target);
        }
        
        // Keyboard support for section/subsection toggling
        if ((e.target.classList.contains('section-title') || e.target.classList.contains('subsection-title')) && 
            (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            e.target.click();
        }
    });
    
    // Mark question as mastered
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('progress-marker')) {
            toggleMastered(e.target);
        }
    });
    
    // Keyboard support for mastering
    document.addEventListener('keydown', function(e) {
        if (e.target.classList.contains('progress-marker') && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            toggleMastered(e.target);
        }
    });
    
    // Bookmark questions
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('bookmark-btn')) {
            toggleBookmark(e.target);
        }
    });
    
    // Confidence rating
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('confidence-btn')) {
            setConfidence(e.target);
        }
    });
    
    // Show/hide all answers
    document.getElementById('toggle-all-answers').addEventListener('click', toggleAllAnswers);
    
    // Toggle showing only unmastered questions
    document.getElementById('toggle-mastered').addEventListener('click', toggleMasteredQuestions);
    
    // Reset progress
    document.getElementById('reset-progress').addEventListener('click', resetProgress);
    
    // Collapse all sections
    document.getElementById('collapse-all').addEventListener('click', collapseAll);
    
    // Start study session
    document.getElementById('start-session').addEventListener('click', startStudySession);
    
    // End study session
    document.getElementById('end-session').addEventListener('click', endStudySession);
    
    // Enter flashcard mode
    document.getElementById('flashcard-mode').addEventListener('click', enterFlashcardMode);
    
    // Flashcard controls
    document.getElementById('flashcard-flip').addEventListener('click', flipFlashcard);
    document.getElementById('flashcard-next').addEventListener('click', nextFlashcard);
    document.getElementById('flashcard-prev').addEventListener('click', prevFlashcard);
    document.getElementById('flashcard-close').addEventListener('click', exitFlashcardMode);
    
    // Flashcard progress marker
    document.getElementById('flashcard-mastered').addEventListener('click', function() {
        toggleFlashcardMastered(this);
    });
    
    // Flashcard confidence buttons
    document.querySelectorAll('#flashcard-confidence .confidence-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            setFlashcardConfidence(this);
        });
    });
    
    // Confidence filter
    document.getElementById('confidence-filter').addEventListener('change', filterByConfidence);
    
    // Search functionality
    document.getElementById('search').addEventListener('input', handleSearch);
    
    // Expand/collapse subsection navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        const link = item.querySelector('.nav-link');
        const subnavList = item.querySelector('.subnav-list');
        
        if (subnavList) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                item.classList.toggle('expanded');
            });
        }
    });
}

// Toggle answer visibility
function toggleAnswer(questionElement) {
    questionElement.classList.toggle('active');
    questionElement.setAttribute('aria-expanded', questionElement.classList.contains('active'));
    const answer = questionElement.nextElementSibling.nextElementSibling;
    answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
}

// Toggle mastered status
function toggleMastered(markerElement) {
    markerElement.classList.toggle('mastered');
    markerElement.setAttribute('aria-checked', markerElement.classList.contains('mastered'));
    
    const questionId = markerElement.closest('.question-card').dataset.id;
    updateQuestionData(questionId, 'mastered', markerElement.classList.contains('mastered'));
    
    saveProgress();
    updateSectionProgress();
    
    // Update spaced repetition data
    if (markerElement.classList.contains('mastered')) {
        updateSpacedRepetitionData(questionId, 'mastered', new Date().toISOString());
    }
}

// Toggle bookmark status
function toggleBookmark(bookmarkBtn) {
    bookmarkBtn.classList.toggle('active');
    const card = bookmarkBtn.closest('.question-card');
    card.classList.toggle('bookmarked');
    
    const questionId = card.dataset.id;
    updateQuestionData(questionId, 'bookmarked', bookmarkBtn.classList.contains('active'));
    
    saveProgress();
}

// Set confidence level
function setConfidence(confidenceBtn) {
    const container = confidenceBtn.closest('.confidence-rating');
    container.querySelectorAll('.confidence-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    confidenceBtn.classList.add('selected');
    const level = parseInt(confidenceBtn.dataset.level);
    const questionId = confidenceBtn.closest('.question-card').dataset.id;
    updateQuestionData(questionId, 'confidence', level);
    
    // Update spaced repetition data based on confidence level
    updateSpacedRepetitionData(questionId, 'confidence', level);
    
    saveProgress();
}

// Update question data in memory
function updateQuestionData(questionId, property, value) {
    if (!window.userQuestionData) {
        window.userQuestionData = {};
    }
    
    if (!window.userQuestionData[questionId]) {
        window.userQuestionData[questionId] = {};
    }
    
    window.userQuestionData[questionId][property] = value;
}

// Toggle theme
function toggleTheme() {
    document.documentElement.getAttribute('data-theme') === 'dark'
        ? document.documentElement.setAttribute('data-theme', 'light')
        : document.documentElement.setAttribute('data-theme', 'dark');
    
    localStorage.setItem('theme', document.documentElement.getAttribute('data-theme'));
}

// Check user theme preference
function checkThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
}

// Toggle all answers
function toggleAllAnswers() {
    const btn = document.getElementById('toggle-all-answers');
    const answers = document.querySelectorAll('.answer');
    const questions = document.querySelectorAll('.question');
    
    const isHidden = btn.textContent === 'Show All Answers';
    
    answers.forEach(answer => {
        answer.style.display = isHidden ? 'block' : 'none';
    });
    
    questions.forEach(question => {
        if (isHidden) {
            question.classList.add('active');
            question.setAttribute('aria-expanded', 'true');
        } else {
            question.classList.remove('active');
            question.setAttribute('aria-expanded', 'false');
        }
    });
    
    btn.textContent = isHidden ? 'Hide All Answers' : 'Show All Answers';
}

// Save progress
function saveProgress() {
    localStorage.setItem('pgaStudyProgress', JSON.stringify(window.userQuestionData || {}));
}

// Load progress
function loadProgress() {
    const savedProgress = localStorage.getItem('pgaStudyProgress');
    if (savedProgress) {
        window.userQuestionData = JSON.parse(savedProgress);
        
        // Apply saved state to UI
        for (const questionId in window.userQuestionData) {
            const data = window.userQuestionData[questionId];
            const card = document.querySelector(`.question-card[data-id="${questionId}"]`);
            
            if (card) {
                // Apply mastered status
                if (data.mastered) {
                    card.querySelector('.progress-marker').classList.add('mastered');
                    card.querySelector('.progress-marker').setAttribute('aria-checked', 'true');
                }
                
                // Apply bookmarked status
                if (data.bookmarked) {
                    card.querySelector('.bookmark-btn').classList.add('active');
                    card.classList.add('bookmarked');
                }
                
                // Apply confidence level
                if (data.confidence) {
                    const confidenceBtn = card.querySelector(`.confidence-btn[data-level="${data.confidence}"]`);
                    if (confidenceBtn) {
                        confidenceBtn.classList.add('selected');
                    }
                }
            }
            
            // Apply to navigation items
            const navItem = document.querySelector(`.question-nav-item[data-id="${questionId}"]`);
            if (navItem) {
                if (data.mastered) {
                    navItem.classList.add('mastered');
                }
                if (data.confidence) {
                    navItem.classList.add(`confidence-${data.confidence}`);
                }
            }
        }
    }
}

// Reset progress
function resetProgress() {
    if (confirm('Are you sure you want to reset your progress? This will clear all mastered status, bookmarks, and confidence ratings.')) {
        document.querySelectorAll('.progress-marker').forEach(marker => {
            marker.classList.remove('mastered');
            marker.setAttribute('aria-checked', 'false');
        });
        
        document.querySelectorAll('.bookmark-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelectorAll('.question-card').forEach(card => {
            card.classList.remove('bookmarked');
        });
        
        document.querySelectorAll('.confidence-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        window.userQuestionData = {};
        localStorage.removeItem('pgaStudyProgress');
        updateSectionProgress();
    }
}

// Toggle mastered questions
function toggleMasteredQuestions() {
    const btn = document.getElementById('toggle-mastered');
    const isHidingMastered = btn.textContent === 'Hide Mastered';
    
    document.querySelectorAll('.question-card').forEach(card => {
        const isMastered = card.querySelector('.progress-marker').classList.contains('mastered');
        card.style.display = isHidingMastered && isMastered ? 'none' : '';
    });
    
    btn.textContent = isHidingMastered ? 'Show Mastered' : 'Hide Mastered';
}

// Collapse all sections and subsections
function collapseAll() {
    // First, collapse all questions
    document.querySelectorAll('.question.active').forEach(question => {
        question.classList.remove('active');
        question.setAttribute('aria-expanded', 'false');
        question.nextElementSibling.nextElementSibling.style.display = 'none';
    });
    
    // Then collapse all subsections
    document.querySelectorAll('.subsection-title').forEach(title => {
        const subsection = title.closest('.subsection');
        const content = subsection.querySelector('.subsection-content');
        title.classList.add('collapsed');
        title.setAttribute('aria-expanded', 'false');
        content.style.display = 'none';
    });
    
    // Finally collapse all sections
    document.querySelectorAll('.section-title').forEach(title => {
        const section = title.closest('.section');
        const content = section.querySelector('.section-content');
        title.classList.add('collapsed');
        title.setAttribute('aria-expanded', 'false');
        content.style.display = 'none';
    });
}

// Handle search
function handleSearch() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    
    if (searchTerm.length < 2) {
        // Reset search if term is too short
        document.querySelectorAll('.question-card').forEach(card => {
            card.style.display = '';
            card.querySelector('.question').innerHTML = card.querySelector('.question').textContent;
        });
        return;
    }
    
    document.querySelectorAll('.question-card').forEach(card => {
        const questionText = card.querySelector('.question').textContent.toLowerCase();
        const answerText = card.querySelector('.answer').textContent.toLowerCase();
        
        const matches = questionText.includes(searchTerm) || answerText.includes(searchTerm);
        card.style.display = matches ? '' : 'none';
        
        // Highlight matches in the question text
        if (matches) {
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            const originalText = card.querySelector('.question').textContent;
            card.querySelector('.question').innerHTML = originalText.replace(regex, '<mark>$1</mark>');
        }
    });
}

// Update section progress bars
function updateSectionProgress() {
    studyData.sections.forEach(section => {
        let totalQuestions = 0;
        let masteredQuestions = 0;
        
        section.subsections.forEach(subsection => {
            subsection.questions.forEach(question => {
                totalQuestions++;
                
                const isQuestionMastered = window.userQuestionData && 
                                          window.userQuestionData[question.id] && 
                                          window.userQuestionData[question.id].mastered;
                
                if (isQuestionMastered) {
                    masteredQuestions++;
                }
            });
        });
        
        const progressPercentage = totalQuestions > 0 ? (masteredQuestions / totalQuestions) * 100 : 0;
        
        const progressBar = document.querySelector(`#${section.id} .section-progress-bar`);
        if (progressBar) {
            progressBar.style.width = `${progressPercentage}%`;
            progressBar.setAttribute('aria-valuenow', progressPercentage);
            progressBar.setAttribute('aria-valuemin', 0);
            progressBar.setAttribute('aria-valuemax', 100);
            progressBar.title = `${Math.round(progressPercentage)}% complete (${masteredQuestions}/${totalQuestions})`;
        }
    });
}

// Spaced repetition system
function updateSpacedRepetitionData(questionId, property, value) {
    if (!window.spacedRepetitionData) {
        window.spacedRepetitionData = {};
    }
    
    if (!window.spacedRepetitionData[questionId]) {
        window.spacedRepetitionData[questionId] = {
            interval: 1, // Days
            nextReviewDate: new Date().toISOString(),
            reviewHistory: []
        };
    }
    
    // Update the spaced repetition algorithm based on confidence or mastery
    const data = window.spacedRepetitionData[questionId];
    
    if (property === 'confidence') {
        // Calculate new interval based on confidence level (1-5)
        // Lower confidence = shorter intervals, higher = longer intervals
        const confidenceMultipliers = [0.5, 0.8, 1, 1.5, 2];
        const multiplier = confidenceMultipliers[value - 1];
        data.interval = Math.max(1, Math.round(data.interval * multiplier));
    }
    
    if (property === 'mastered') {
        // Marking as mastered increases the interval significantly
        data.interval = Math.max(1, Math.round(data.interval * 2.5));
    }
    
    // Set next review date
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + data.interval);
    data.nextReviewDate = nextReview.toISOString();
    
    // Add to review history
    data.reviewHistory.push({
        date: new Date().toISOString(),
        property: property,
        value: value,
        interval: data.interval
    });
    
    // Save to storage
    localStorage.setItem('pgaSpacedRepetition', JSON.stringify(window.spacedRepetitionData));
}

// Get questions due for review based on spaced repetition
function getQuestionsForReview() {
    if (!window.spacedRepetitionData) {
        return [];
    }
    
    const now = new Date();
    const dueQuestions = [];
    
    for (const questionId in window.spacedRepetitionData) {
        const data = window.spacedRepetitionData[questionId];
        const nextReviewDate = new Date(data.nextReviewDate);
        
        if (nextReviewDate <= now) {
            dueQuestions.push(questionId);
        }
    }
    
    return dueQuestions;
}

// Study Session Timer
let studySessionInterval;
let studySessionStartTime;

function startStudySession() {
    document.getElementById('start-session').style.display = 'none';
    document.getElementById('timer-container').style.display = 'flex';
    
    studySessionStartTime = new Date();
    
    studySessionInterval = setInterval(updateStudyTimer, 1000);
}

function updateStudyTimer() {
    const now = new Date();
    const timeDiff = now - studySessionStartTime;
    
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    const timeString = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    document.getElementById('timer').textContent = timeString;
}

function endStudySession() {
    clearInterval(studySessionInterval);
    document.getElementById('timer-container').style.display = 'none';
    document.getElementById('start-session').style.display = 'block';
    
    const endTime = new Date();
    const duration = Math.round((endTime - studySessionStartTime) / 1000 / 60); // In minutes
    
    alert(`Study session completed! You studied for ${duration} minutes.`);
    
    // Save study session statistics
    const sessionData = {
        date: new Date().toISOString(),
        duration: duration,
    };
    
    let studySessions = JSON.parse(localStorage.getItem('pgaStudySessions') || '[]');
    studySessions.push(sessionData);
    localStorage.setItem('pgaStudySessions', JSON.stringify(studySessions));
}

// Flashcard Mode
let currentFlashcardIndex = 0;
let flashcardQuestions = [];

function enterFlashcardMode() {
    // Get all questions or prioritize based on spaced repetition
    const dueQuestions = getQuestionsForReview();
    
    // If there are due questions, prioritize them, otherwise use all questions
    if (dueQuestions.length > 0) {
        flashcardQuestions = getQuestionsData(dueQuestions);
    } else {
        flashcardQuestions = getAllQuestionsData();
    }
    
    // Shuffle the questions
    shuffleArray(flashcardQuestions);
    
    // Reset index
    currentFlashcardIndex = 0;
    
    // Show flashcard container
    document.getElementById('flashcard-container').style.display = 'flex';
    
    // Load first flashcard
    loadCurrentFlashcard();
}

function exitFlashcardMode() {
    document.getElementById('flashcard-container').style.display = 'none';
    document.getElementById('flashcard').classList.remove('flipped');
}

function flipFlashcard() {
    document.getElementById('flashcard').classList.toggle('flipped');
}

function nextFlashcard() {
    document.getElementById('flashcard').classList.remove('flipped');
    currentFlashcardIndex = (currentFlashcardIndex + 1) % flashcardQuestions.length;
    setTimeout(loadCurrentFlashcard, 300);
}

function prevFlashcard() {
    document.getElementById('flashcard').classList.remove('flipped');
    currentFlashcardIndex = (currentFlashcardIndex - 1 + flashcardQuestions.length) % flashcardQuestions.length;
    setTimeout(loadCurrentFlashcard, 300);
}

function loadCurrentFlashcard() {
    const currentQuestion = flashcardQuestions[currentFlashcardIndex];
    document.getElementById('flashcard-question').textContent = currentQuestion.question;
    document.getElementById('flashcard-answer').textContent = currentQuestion.answer;
    
    // Reset confidence buttons
    document.querySelectorAll('#flashcard-confidence .confidence-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Set confidence if available
    if (window.userQuestionData && 
        window.userQuestionData[currentQuestion.id] && 
        window.userQuestionData[currentQuestion.id].confidence) {
        const level = window.userQuestionData[currentQuestion.id].confidence;
        document.querySelector(`#flashcard-confidence .confidence-btn[data-level="${level}"]`).classList.add('selected');
    }
    
    // Set mastered status
    const masteredBtn = document.getElementById('flashcard-mastered');
    masteredBtn.classList.remove('mastered');
    if (window.userQuestionData && 
        window.userQuestionData[currentQuestion.id] && 
        window.userQuestionData[currentQuestion.id].mastered) {
        masteredBtn.classList.add('mastered');
    }
}

// Helper functions
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getAllQuestionsData() {
    const allQuestions = [];
    
    studyData.sections.forEach(section => {
        section.subsections.forEach(subsection => {
            subsection.questions.forEach(question => {
                allQuestions.push(question);
            });
        });
    });
    
    return allQuestions;
}

function getQuestionsData(questionIds) {
    const questions = [];
    
    studyData.sections.forEach(section => {
        section.subsections.forEach(subsection => {
            subsection.questions.forEach(question => {
                if (questionIds.includes(question.id)) {
                    questions.push(question);
                }
            });
        });
    });
    
    return questions;
}

// Toggle flashcard mastered status
function toggleFlashcardMastered(btn) {
    btn.classList.toggle('mastered');
    const currentQuestion = flashcardQuestions[currentFlashcardIndex];
    updateQuestionData(currentQuestion.id, 'mastered', btn.classList.contains('mastered'));
    
    // Update navigation item
    const navItem = document.querySelector(`.question-nav-item[data-id="${currentQuestion.id}"]`);
    if (navItem) {
        if (btn.classList.contains('mastered')) {
            navItem.classList.add('mastered');
        } else {
            navItem.classList.remove('mastered');
        }
    }
    
    // Update section progress
    updateSectionProgress();
    saveProgress();
}

// Filter questions by confidence level
function filterByConfidence() {
    const confidenceLevel = document.getElementById('confidence-filter').value;
    const questions = document.querySelectorAll('.question-card');
    
    if (confidenceLevel === 'all') {
        questions.forEach(question => {
            question.style.display = '';
        });
        return;
    }
    
    questions.forEach(question => {
        const questionId = question.dataset.id;
        const hasData = window.userQuestionData && window.userQuestionData[questionId];
        
        if (confidenceLevel === '0') {
            // Show questions with no confidence rating
            if (!hasData || !window.userQuestionData[questionId].confidence) {
                question.style.display = '';
            } else {
                question.style.display = 'none';
            }
        } else {
            // Show questions with specific confidence rating
            if (hasData && window.userQuestionData[questionId].confidence === parseInt(confidenceLevel)) {
                question.style.display = '';
            } else {
                question.style.display = 'none';
            }
        }
    });
    
    // Also update navigation items
    updateNavigationDisplayByConfidence(confidenceLevel);
}

// Update navigation items display based on confidence
function updateNavigationDisplayByConfidence(confidenceLevel) {
    const navItems = document.querySelectorAll('.question-nav-item');
    
    if (confidenceLevel === 'all') {
        navItems.forEach(item => {
            item.style.display = '';
        });
        return;
    }
    
    navItems.forEach(item => {
        const questionId = item.dataset.id;
        const hasData = window.userQuestionData && window.userQuestionData[questionId];
        
        if (confidenceLevel === '0') {
            if (!hasData || !window.userQuestionData[questionId].confidence) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        } else {
            if (hasData && window.userQuestionData[questionId].confidence === parseInt(confidenceLevel)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        }
    });
}

// Set confidence level for a flashcard
function setFlashcardConfidence(confidenceBtn) {
    const container = confidenceBtn.closest('.confidence-rating');
    container.querySelectorAll('.confidence-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    confidenceBtn.classList.add('selected');
    const level = parseInt(confidenceBtn.dataset.level);
    const currentQuestion = flashcardQuestions[currentFlashcardIndex];
    
    updateQuestionData(currentQuestion.id, 'confidence', level);
    
    // Update navigation item
    const navItem = document.querySelector(`.question-nav-item[data-id="${currentQuestion.id}"]`);
    if (navItem) {
        navItem.classList.remove('confidence-1', 'confidence-2', 'confidence-3', 'confidence-4', 'confidence-5');
        navItem.classList.add(`confidence-${level}`);
    }
    
    // Update the question card in the main view
    const card = document.querySelector(`.question-card[data-id="${currentQuestion.id}"]`);
    if (card) {
        const confidenceBtns = card.querySelectorAll('.confidence-btn');
        confidenceBtns.forEach(btn => {
            btn.classList.remove('selected');
        });
        
        const btn = card.querySelector(`.confidence-btn[data-level="${level}"]`);
        if (btn) {
            btn.classList.add('selected');
        }
    }
    
    // Update spaced repetition data based on confidence level
    updateSpacedRepetitionData(currentQuestion.id, 'confidence', level);
    
    saveProgress();
}
