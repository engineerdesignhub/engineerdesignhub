// BeamMaster AI Client-Side Search Engine
(function() {
    // 1. Articles Dataset Metadata
    const ARTICLES = [
        {
            title: "Understanding Shear Force and Bending Moment Diagrams in Beam Analysis",
            desc: "A comprehensive guide to understanding Shear Force Diagrams (SFD) and Bending Moment Diagrams (BMD) in beam analysis. Learn sign conventions, relationships, and practical calculation methods.",
            url: "understanding-shear-force-bending-moment.html",
            category: "Structural Engineering",
            readTime: "12 min read",
            date: "June 5, 2026"
        },
        {
            title: "Concrete Mix Design Using IS 10262: A Complete Step-by-Step Guide",
            desc: "A comprehensive guide to concrete mix design proportioning based on the Indian Standard code IS 10262:2019. Includes target strength calculations, W/C ratio selection, aggregate estimation, and a step-by-step example.",
            url: "concrete-mix-design-is-10262.html",
            category: "Civil Engineering",
            readTime: "14 min read",
            date: "June 10, 2026"
        },
        {
            title: "Geopolymer Concrete: The Future of Sustainable Construction Materials",
            desc: "Explore the development of geopolymer concrete, its chemical binder mechanisms, environmental benefits, structural performance, and its role as a low-carbon alternative to traditional Portland cement.",
            url: "geopolymer-concrete-future.html",
            category: "Geopolymer Concrete",
            readTime: "11 min read",
            date: "June 12, 2026"
        },
        {
            title: "How Artificial Intelligence is Transforming Structural Analysis and Design",
            desc: "Explore how artificial intelligence and machine learning algorithms are revolutionizing structural engineering analysis, optimization of load-bearing structures, and predictive models.",
            url: "ai-structural-analysis.html",
            category: "AI in Engineering",
            readTime: "10 min read",
            date: "June 15, 2026"
        },
        {
            title: "Green Building Materials: Innovations Driving Sustainable Construction",
            desc: "Discover how green building materials like recycled concrete aggregates, bamboo composites, cross-laminated timber, and smart glass are reducing structural emissions and improving sustainability.",
            url: "green-building-materials.html",
            category: "Sustainable Construction",
            readTime: "10 min read",
            date: "June 18, 2026"
        },
        {
            title: "STAAD.Pro vs ETABS: Choosing the Right Structural Analysis Software",
            desc: "A comprehensive comparative guide comparing Bentley's STAAD.Pro and CSI's ETABS structural analysis software packages, highlighting their strengths in building design versus industrial structures.",
            url: "staad-pro-vs-etabs.html",
            category: "Engineering Software",
            readTime: "13 min read",
            date: "June 20, 2026"
        },
        {
            title: "RCC Beam Design by Limit State Method: IS 456 Guidelines",
            desc: "A comprehensive guide to designing reinforced concrete beams using the Limit State Method according to IS 456:2000. Learn about flexure design, shear design, and deflection control.",
            url: "rcc-beam-design-limit-state.html",
            category: "Structural Engineering",
            readTime: "15 min read",
            date: "June 22, 2026"
        },
        {
            title: "Fly Ash Based Geopolymer Concrete: Properties, Mix Design, and Applications",
            desc: "A comprehensive guide to fly ash geopolymer concrete including mix proportioning, curing methods, physical attributes, and sustainable applications.",
            url: "fly-ash-geopolymer-applications.html",
            category: "Geopolymer Concrete",
            readTime: "12 min read",
            date: "June 25, 2026"
        },
        {
            title: "Building Information Modeling (BIM) in Civil Engineering Projects",
            desc: "How BIM is revolutionizing project lifecycle management from design through construction, detailing dimensions, clash detection, and software packages.",
            url: "bim-civil-engineering.html",
            category: "Engineering Software",
            readTime: "11 min read",
            date: "June 28, 2026"
        },
        {
            title: "Earthquake Resistant Building Design: Principles and Indian Code Provisions",
            desc: "Understanding seismic design philosophy, base shear calculations per IS 1893, ductility detailing per IS 13920, and structural configurations.",
            url: "earthquake-resistant-design.html",
            category: "Structural Engineering",
            readTime: "14 min read",
            date: "June 30, 2026"
        },
        {
            title: "Reducing Carbon Footprint in Concrete Production: Methods and Technologies",
            desc: "Strategies for lowering CO₂ emissions in cement manufacturing, including alternative fuels, supplementary cementitious materials, carbon capture, and carbon curing.",
            url: "sustainable-concrete-carbon.html",
            category: "Sustainable Construction",
            readTime: "10 min read",
            date: "July 2, 2026"
        },
        {
            title: "Machine Learning Applications in Construction Material Science",
            desc: "How ML models predict concrete strength, optimize mix proportions, analyze sensor inputs, and accelerate discovery of new green binder materials.",
            url: "machine-learning-material-science.html",
            category: "AI in Engineering",
            readTime: "11 min read",
            date: "July 5, 2026"
        },
        {
            title: "Steel Fiber Reinforced Concrete: Properties, Advantages, and Applications",
            desc: "Exploring the enhanced toughness, impact resistance, and crack control offered by steel fiber reinforcement in industrial floors and shotcrete linings.",
            url: "steel-fiber-reinforced-concrete.html",
            category: "Civil Engineering",
            readTime: "10 min read",
            date: "July 8, 2026"
        },
        {
            title: "AutoCAD vs Revit for Structural Engineering: Feature Comparison",
            desc: "A practical comparison of 2D vector drafting versus parametric 3D building information modeling for structural engineering workflows.",
            url: "autocad-vs-revit-structural.html",
            category: "Engineering Software",
            readTime: "12 min read",
            date: "July 10, 2026"
        },
        {
            title: "Prestressed Concrete Design: Principles, Methods, and Modern Applications",
            desc: "Understanding pre-tensioning, post-tensioning, structural load balancing, and prestress loss calculations in long-span concrete bridges.",
            url: "prestressed-concrete-design.html",
            category: "Structural Engineering",
            readTime: "13 min read",
            date: "July 12, 2026"
        }
    ];

    // Determine current depth to fix relative URLs
    const inSubdir = window.location.pathname.includes('/articles/');

    // Get adjusted URL path based on current page location
    function getAdjustedUrl(targetUrl) {
        if (inSubdir) {
            return targetUrl;
        } else {
            return 'articles/' + targetUrl;
        }
    }

    // Initialize search elements once DOM is loaded
    function initSearch() {
        // 2. Inject Search Icon Button into Navbar
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle && !document.getElementById('search-toggle')) {
            const searchBtn = document.createElement('button');
            searchBtn.className = 'btn-icon';
            searchBtn.id = 'search-toggle';
            searchBtn.title = 'Search Articles';
            searchBtn.setAttribute('aria-label', 'Search Articles');
            searchBtn.style.marginRight = '0.5rem';
            searchBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:flex;"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`;
            themeToggle.parentNode.insertBefore(searchBtn, themeToggle);
        }

        // 3. Inject Search Modal Markup into Document Body
        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'search-modal-overlay';
        modalOverlay.className = 'search-modal-overlay';
        modalOverlay.innerHTML = `
            <div class="search-modal-container">
                <div class="search-modal-header">
                    <span class="search-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    </span>
                    <input type="text" id="modal-search-input" placeholder="Type to search articles..." autocomplete="off">
                    <button id="modal-search-close" class="modal-search-close" aria-label="Close search">&times;</button>
                </div>
                <div class="search-modal-results" id="modal-search-results">
                    <div class="search-no-results">Type query to start searching...</div>
                </div>
            </div>
        `;
        document.body.appendChild(modalOverlay);

        // Select elements
        const searchToggle = document.getElementById('search-toggle');
        const modalSearchInput = document.getElementById('modal-search-input');
        const modalSearchResults = document.getElementById('modal-search-results');
        const modalSearchClose = document.getElementById('modal-search-close');

        // Toggle visibility
        function openModal() {
            modalOverlay.classList.add('active');
            setTimeout(() => modalSearchInput.focus(), 150);
        }

        function closeModal() {
            modalOverlay.classList.remove('active');
            modalSearchInput.value = '';
            modalSearchResults.innerHTML = '<div class="search-no-results">Type query to start searching...</div>';
        }

        if (searchToggle) {
            searchToggle.addEventListener('click', openModal);
        }
        if (modalSearchClose) {
            modalSearchClose.addEventListener('click', closeModal);
        }

        // Close on clicking overlay background
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });

        // Keyboard navigation (Esc to close)
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
                closeModal();
            }
        });

        // Search algorithm
        modalSearchInput.addEventListener('input', function() {
            const query = modalSearchInput.value.toLowerCase().trim();
            if (!query) {
                modalSearchResults.innerHTML = '<div class="search-no-results">Type query to start searching...</div>';
                return;
            }

            const terms = query.split(/\s+/);
            const filtered = ARTICLES.map(article => {
                let score = 0;
                const titleLower = article.title.toLowerCase();
                const descLower = article.desc.toLowerCase();
                const catLower = article.category.toLowerCase();

                terms.forEach(term => {
                    if (titleLower.includes(term)) score += 10;
                    if (descLower.includes(term)) score += 3;
                    if (catLower.includes(term)) score += 5;
                    // Exact start match bonus
                    if (titleLower.startsWith(term)) score += 5;
                });

                return { ...article, score };
            }).filter(item => item.score > 0).sort((a, b) => b.score - a.score);

            if (filtered.length === 0) {
                modalSearchResults.innerHTML = `<div class="search-no-results">No articles found matching "${modalSearchInput.value}"</div>`;
            } else {
                modalSearchResults.innerHTML = filtered.map(item => `
                    <div class="search-result-item" data-url="${getAdjustedUrl(item.url)}">
                        <div class="search-result-meta">
                            <span class="search-result-category">${item.category}</span>
                            <span class="search-result-readtime">${item.readTime}</span>
                        </div>
                        <div class="search-result-title">${item.title}</div>
                        <div class="search-result-desc">${item.desc}</div>
                    </div>
                `).join('');

                // Attach click handlers to items
                modalSearchResults.querySelectorAll('.search-result-item').forEach(item => {
                    item.addEventListener('click', function() {
                        window.location.href = this.dataset.url;
                    });
                });
            }
        });

        // 4. Articles Index Page Static Input Integration
        const staticSearchInput = document.getElementById('search-input');
        if (staticSearchInput) {
            const cards = document.querySelectorAll('#articles-grid .card-item');
            const filterBtns = document.querySelectorAll('#filter-bar .filter-btn');

            function filterArticles() {
                const query = staticSearchInput.value.toLowerCase().trim();
                
                // Get active filter category
                let activeFilter = 'all';
                filterBtns.forEach(btn => {
                    if (btn.classList.contains('active')) {
                        activeFilter = btn.dataset.filter;
                    }
                });

                cards.forEach(card => {
                    const title = card.querySelector('h3').innerText.toLowerCase();
                    const desc = card.querySelector('p').innerText.toLowerCase();
                    const badge = card.querySelector('.card-badge').innerText.toLowerCase();
                    const category = card.dataset.category || '';

                    const matchesQuery = !query || title.includes(query) || desc.includes(query) || badge.includes(query);
                    const matchesCategory = activeFilter === 'all' || category === activeFilter;

                    if (matchesQuery && matchesCategory) {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                });

                // Display feedback if all cards hidden
                let visibleCount = 0;
                cards.forEach(card => {
                    if (card.style.display !== 'none') visibleCount++;
                });

                let feedbackEl = document.getElementById('search-feedback');
                if (visibleCount === 0) {
                    if (!feedbackEl) {
                        feedbackEl = document.createElement('div');
                        feedbackEl.id = 'search-feedback';
                        feedbackEl.className = 'search-no-results';
                        feedbackEl.style.width = '100%';
                        feedbackEl.style.gridColumn = '1 / -1';
                        document.getElementById('articles-grid').appendChild(feedbackEl);
                    }
                    feedbackEl.innerText = `No articles found matching "${staticSearchInput.value}"`;
                    feedbackEl.style.display = '';
                } else if (feedbackEl) {
                    feedbackEl.style.display = 'none';
                }
            }

            staticSearchInput.addEventListener('input', filterArticles);

            // Re-run filter on category button clicks
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    // Slight timeout to let class transitions complete if handled elsewhere
                    setTimeout(filterArticles, 10);
                });
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSearch);
    } else {
        initSearch();
    }
})();
