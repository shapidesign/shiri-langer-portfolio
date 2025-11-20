// Base Portfolio Data
const basePortfolioData = [
    {
        id: 1,
        title: "Coffee Machine Design",
        description: "A modern, minimalist coffee machine design featuring natural wood materials and sleek functionality. This project showcases the perfect blend of form and function in kitchen appliance design.",
        image: "assets/images/coffee-torn.png",
        date: "2024",
        tags: ["Product Design", "Industrial Design", "Kitchen Appliances"],
        client: "Personal Project"
    },
    {
        id: 2,
        title: "KSENSE Brand Identity",
        description: "Complete brand identity design for KSENSE, including logo design, color palette, and visual guidelines. The design reflects innovation and technological advancement.",
        image: "assets/images/ksense.png",
        date: "2024",
        tags: ["Branding", "Logo Design", "Visual Identity"],
        client: "KSENSE"
    },
    {
        id: 3,
        title: "Alphabet Typography Series",
        description: "Experimental typography project exploring the relationship between form and meaning in letter design. Each letter tells its own story through innovative visual treatment.",
        image: "assets/images/alphabet2.png",
        date: "2023",
        tags: ["Typography", "Experimental Design", "Lettering"],
        client: "Personal Project"
    },
    {
        id: 4,
        title: "Digital Interface Design",
        description: "User interface design for a modern digital platform, focusing on usability and aesthetic appeal. Clean, intuitive design that enhances user experience.",
        image: "assets/images/coffee-torn.png",
        date: "2024",
        tags: ["UI/UX", "Digital Design", "Interface"],
        client: "Tech Startup"
    },
    {
        id: 5,
        title: "Packaging Design Collection",
        description: "Sustainable packaging design solutions that combine environmental responsibility with compelling visual appeal. Each design tells the product's story through thoughtful material choices.",
        image: "assets/images/ksense.png",
        date: "2023",
        tags: ["Packaging", "Sustainable Design", "Print"],
        client: "Eco Brand"
    },
    {
        id: 6,
        title: "Editorial Layout Design",
        description: "Magazine layout design that balances typography, imagery, and white space to create engaging reading experiences. Focus on readability and visual hierarchy.",
        image: "assets/images/alphabet2.png",
        date: "2023",
        tags: ["Editorial", "Layout Design", "Print"],
        client: "Design Magazine"
    },
    {
        id: 7,
        title: "Mobile App Interface",
        description: "Complete mobile application interface design with focus on user journey and interaction patterns. Clean, modern design that prioritizes functionality.",
        image: "assets/images/coffee-torn.png",
        date: "2024",
        tags: ["Mobile Design", "App Interface", "UX"],
        client: "Mobile Startup"
    },
    {
        id: 8,
        title: "Brand Campaign Visuals",
        description: "Comprehensive visual campaign for a lifestyle brand, including photography direction, color schemes, and marketing materials that resonate with target audience.",
        image: "assets/images/ksense.png",
        date: "2024",
        tags: ["Campaign", "Visual Identity", "Marketing"],
        client: "Lifestyle Brand"
    },
    {
        id: 9,
        title: "Website Design System",
        description: "Complete design system for a corporate website, including component library, style guide, and responsive layouts that ensure consistency across all touchpoints.",
        image: "assets/images/alphabet2.png",
        date: "2023",
        tags: ["Web Design", "Design System", "Responsive"],
        client: "Corporate Client"
    },
    {
        id: 10,
        title: "Art Direction Project",
        description: "Art direction for a creative campaign that pushes boundaries while maintaining brand integrity. Collaborative approach with photographers and copywriters.",
        image: "assets/images/coffee-torn.png",
        date: "2024",
        tags: ["Art Direction", "Creative Campaign", "Collaboration"],
        client: "Creative Agency"
    }
];

// Generate more portfolio data for infinite scroll
function generateMoreProjects() {
    const additionalProjects = [];
    const projectTemplates = [
        "Brand Identity Design",
        "Web Interface Design", 
        "Mobile App Design",
        "Packaging Design",
        "Editorial Layout",
        "Logo Design",
        "Poster Design",
        "Book Cover Design",
        "Social Media Graphics",
        "Infographic Design",
        "UI/UX Design",
        "Print Design",
        "Digital Art",
        "Typography Design",
        "Illustration Work",
        "Product Photography",
        "Web Design",
        "Motion Graphics",
        "Environmental Design",
        "Exhibition Design"
    ];
    
    const descriptions = [
        "A comprehensive design project that showcases innovative thinking and creative problem-solving.",
        "Modern design approach focusing on user experience and visual communication.",
        "Clean, minimalist design that emphasizes functionality and aesthetic appeal.",
        "Creative solution that balances form and function in contemporary design.",
        "Thoughtful design that tells a story through visual elements and typography.",
        "Strategic design approach that enhances brand recognition and user engagement.",
        "Innovative design solution that pushes creative boundaries while maintaining usability."
    ];
    
    const tags = [
        ["Branding", "Visual Identity"],
        ["UI/UX", "Digital Design"],
        ["Print", "Editorial"],
        ["Packaging", "Product Design"],
        ["Typography", "Layout"],
        ["Illustration", "Art Direction"],
        ["Web Design", "Interface"],
        ["Mobile", "App Design"],
        ["Photography", "Visual"],
        ["Motion", "Animation"]
    ];
    
    for (let i = 0; i < 50; i++) {
        const templateIndex = Math.floor(Math.random() * projectTemplates.length);
        const descIndex = Math.floor(Math.random() * descriptions.length);
        const tagIndex = Math.floor(Math.random() * tags.length);
        const imageIndex = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
        
        additionalProjects.push({
            id: basePortfolioData.length + i + 1,
            title: projectTemplates[templateIndex],
            description: descriptions[descIndex],
            image: `assets/images/${imageIndex === 1 ? 'coffee-torn.png' : imageIndex === 2 ? 'ksense.png' : 'alphabet2.png'}`,
            date: `202${Math.floor(Math.random() * 5)}`,
            tags: tags[tagIndex],
            client: `Client ${Math.floor(Math.random() * 20) + 1}`
        });
    }
    
    return additionalProjects;
}

// Initialize all projects
allProjects = [...basePortfolioData, ...generateMoreProjects()];

// DOM Elements
const portfolioGrid = document.getElementById('portfolioGrid');
const breadcrumbs = document.getElementById('breadcrumbs');
const modalOverlay = document.getElementById('modalOverlay');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalDate = document.getElementById('modalDate');
const modalTags = document.getElementById('modalTags');
const modalClose = document.getElementById('modalClose');
const contactBtn = document.getElementById('contactBtn');
const contactModal = document.getElementById('contactModal');
const contactClose = document.getElementById('contactClose');

// State
let currentProject = null;
let isModalOpen = false;
let allProjects = [];
let currentPage = 0;
let itemsPerPage = 10;
let isLoading = false;
let scrollOffset = { x: 0, y: 0 };

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializePortfolio();
    setupEventListeners();
    createBreadcrumbs();
    setupInfiniteScroll();
});

// Initialize portfolio grid
function initializePortfolio() {
    portfolioGrid.innerHTML = '';
    
    basePortfolioData.forEach((project, index) => {
        const gridItem = createPortfolioItem(project, index);
        portfolioGrid.appendChild(gridItem);
    });
}

// Create individual portfolio item
function createPortfolioItem(project, index) {
    const item = document.createElement('div');
    item.className = 'grid-item';
    item.dataset.projectId = project.id;
    
    // Use infinite grid positioning
    const positions = generateInfiniteGridPositions(index, 1);
    const position = positions[0];
    
    item.style.left = position.x + '%';
    item.style.top = position.y + '%';
    item.style.width = position.width + 'px';
    item.style.height = position.height + 'px';
    
    item.innerHTML = `
        <img src="${project.image}" alt="${project.title}" class="grid-item-img" loading="lazy">
        <div class="project-info-overlay">
            <div class="project-info-title">${project.title}</div>
            <div class="project-info-date">${project.date}</div>
        </div>
        <div class="item-nav">
            <button class="item-nav-info" onclick="showProjectInfo(${project.id})">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 16v-4"></path>
                    <path d="M12 8h.01"></path>
                </svg>
            </button>
            <button class="item-nav-download" onclick="viewFullSize(${project.id})">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7,10 12,15 17,10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
            </button>
        </div>
    `;
    
    return item;
}

// Generate positions for portfolio items with infinite scroll support
function generateInfiniteGridPositions(startIndex, count) {
    const positions = [];
    const padding = 30;
    const itemWidth = 400;
    const itemHeight = 450;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculate how many items can fit horizontally
    const itemsPerRow = Math.floor((viewportWidth - padding * 2) / (itemWidth + padding));
    
    for (let i = 0; i < count; i++) {
        const globalIndex = startIndex + i;
        const row = Math.floor(globalIndex / itemsPerRow);
        const col = globalIndex % itemsPerRow;
        
        // Calculate position with padding and scroll offset
        const x = padding + col * (itemWidth + padding) + scrollOffset.x;
        const y = padding + row * (itemHeight + padding) + scrollOffset.y;
        
        // Convert to percentage for responsive design
        const xPercent = (x / viewportWidth) * 100;
        const yPercent = (y / viewportHeight) * 100;
        
        positions.push({ 
            x: xPercent, 
            y: yPercent, 
            width: itemWidth, 
            height: itemHeight 
        });
    }
    
    return positions;
}


// Show project information
function showProjectInfo(projectId) {
    const project = allProjects.find(p => p.id === projectId);
    if (!project) return;
    
    currentProject = project;
    
    modalTitle.textContent = project.title;
    modalDescription.textContent = project.description;
    modalDate.textContent = project.date;
    
    // Clear and populate tags
    modalTags.innerHTML = '';
    project.tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'modal-tag';
        tagElement.textContent = tag;
        modalTags.appendChild(tagElement);
    });
    
    modalImage.src = project.image;
    modalImage.alt = project.title;
    
    openModal();
}

// View full size image
function viewFullSize(projectId) {
    const project = allProjects.find(p => p.id === projectId);
    if (!project) return;
    
    currentProject = project;
    modalImage.src = project.image;
    modalImage.alt = project.title;
    
    // Hide modal info for full-size view
    const modalInfo = document.querySelector('.modal-info');
    modalInfo.style.display = 'none';
    
    openModal();
}

// Open modal
function openModal() {
    isModalOpen = true;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    isModalOpen = false;
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    
    // Show modal info again
    const modalInfo = document.querySelector('.modal-info');
    modalInfo.style.display = 'block';
    
    currentProject = null;
}

// Open contact modal
function openContactModal() {
    contactModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close contact modal
function closeContactModal() {
    contactModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Create breadcrumb navigation
function createBreadcrumbs() {
    breadcrumbs.innerHTML = '';
    
    // Show first 6 projects as breadcrumbs
    const breadcrumbProjects = allProjects.slice(0, 6);
    
    breadcrumbProjects.forEach((project, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'breadcrumb-wrapper';
        
        const breadcrumb = document.createElement('div');
        breadcrumb.className = 'breadcrumb';
        breadcrumb.dataset.title = project.title;
        breadcrumb.onclick = () => showProjectInfo(project.id);
        
        const img = document.createElement('img');
        img.src = project.image;
        img.alt = project.title;
        img.className = 'breadcrumb-img';
        img.loading = 'lazy';
        
        breadcrumb.appendChild(img);
        wrapper.appendChild(breadcrumb);
        breadcrumbs.appendChild(wrapper);
    });
}

// Setup infinite scroll in all directions
function setupInfiniteScroll() {
    const scrollAreas = {
        top: document.getElementById('scrollTop'),
        right: document.getElementById('scrollRight'),
        bottom: document.getElementById('scrollBottom'),
        left: document.getElementById('scrollLeft')
    };
    
    // Add scroll event listeners to each area
    Object.keys(scrollAreas).forEach(direction => {
        const area = scrollAreas[direction];
        
        area.addEventListener('mouseenter', () => {
            startInfiniteScroll(direction);
        });
        
        area.addEventListener('mouseleave', () => {
            stopInfiniteScroll();
        });
    });
}

// Start infinite scroll in a specific direction
function startInfiniteScroll(direction) {
    const scrollSpeed = 2;
    const scrollInterval = setInterval(() => {
        switch(direction) {
            case 'top':
                scrollOffset.y -= scrollSpeed;
                break;
            case 'right':
                scrollOffset.x += scrollSpeed;
                break;
            case 'bottom':
                scrollOffset.y += scrollSpeed;
                break;
            case 'left':
                scrollOffset.x -= scrollSpeed;
                break;
        }
        
        // Update all existing items' positions
        updateAllItemPositions();
        
        // Load more items if needed
        loadMoreItemsIfNeeded();
        
    }, 16); // ~60fps
    
    // Store interval ID for cleanup
    window.currentScrollInterval = scrollInterval;
}

// Stop infinite scroll
function stopInfiniteScroll() {
    if (window.currentScrollInterval) {
        clearInterval(window.currentScrollInterval);
        window.currentScrollInterval = null;
    }
}

// Update positions of all existing items
function updateAllItemPositions() {
    const items = document.querySelectorAll('.grid-item');
    items.forEach((item, index) => {
        const positions = generateInfiniteGridPositions(index, 1);
        const position = positions[0];
        
        item.style.left = position.x + '%';
        item.style.top = position.y + '%';
    });
}

// Load more items if needed based on scroll position
function loadMoreItemsIfNeeded() {
    const items = document.querySelectorAll('.grid-item');
    const currentItemCount = items.length;
    
    if (currentItemCount < allProjects.length && currentItemCount < 100) {
        // Load more items
        const startIndex = currentItemCount;
        const itemsToLoad = Math.min(10, allProjects.length - currentItemCount);
        
        for (let i = 0; i < itemsToLoad; i++) {
            const project = allProjects[startIndex + i];
            const gridItem = createPortfolioItem(project, startIndex + i);
            portfolioGrid.appendChild(gridItem);
        }
    }
}


// Setup event listeners
function setupEventListeners() {
    // Modal close events
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    
    // Contact modal events
    contactBtn.addEventListener('click', openContactModal);
    contactClose.addEventListener('click', closeContactModal);
    contactModal.addEventListener('click', (e) => {
        if (e.target === contactModal) {
            closeContactModal();
        }
    });
    
    // Keyboard events
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (isModalOpen) {
                closeModal();
            } else if (contactModal.classList.contains('active')) {
                closeContactModal();
            }
        }
    });
    
    // Window resize event
    window.addEventListener('resize', debounce(() => {
        // Regenerate grid positions on resize
        initializePortfolio();
    }, 250));
    
}

// Smooth scroll to element
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}

// Utility function to debounce events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add loading animation
function addLoadingAnimation() {
    const loader = document.createElement('div');
    loader.className = 'loading-animation';
    loader.innerHTML = `
        <div class="loading-spinner"></div>
        <p>Loading portfolio...</p>
    `;
    document.body.appendChild(loader);
    
    // Remove loader after a short delay
    setTimeout(() => {
        loader.remove();
    }, 1000);
}

// Initialize loading animation
addLoadingAnimation();
