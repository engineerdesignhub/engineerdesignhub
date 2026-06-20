// BeamMaster AI GDPR/AdSense Cookie Consent Banner
(function() {
    function initCookieConsent() {
        const consent = localStorage.getItem('beammaster_cookie_consent');
        if (consent === 'accepted' || consent === 'declined') {
            return; // Already responded
        }

        // Determine current depth for relative links
        const inSubdir = window.location.pathname.includes('/articles/');
        const privacyLink = inSubdir ? '../privacy.html' : 'privacy.html';

        // 1. Inject Styles
        const styles = document.createElement('style');
        styles.innerHTML = `
            .cookie-banner {
                position: fixed;
                bottom: -150px;
                left: 0;
                width: 100%;
                background-color: var(--bg-secondary);
                border-top: 1px solid var(--border-color);
                box-shadow: 0 -10px 25px -5px rgba(0, 0, 0, 0.15);
                z-index: 10000;
                padding: 1.25rem 2rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 2rem;
                transition: bottom 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                font-family: var(--font-sans);
            }
            .cookie-banner.active {
                bottom: 0;
            }
            .cookie-text {
                font-size: 0.88rem;
                color: var(--text-secondary);
                margin: 0;
                line-height: 1.5;
                flex: 1;
            }
            .cookie-text a {
                color: var(--primary);
                font-weight: 600;
                text-decoration: underline;
            }
            .cookie-text a:hover {
                color: var(--primary-hover);
            }
            .cookie-actions {
                display: flex;
                gap: 0.75rem;
                flex-shrink: 0;
            }
            @media (max-width: 768px) {
                .cookie-banner {
                    flex-direction: column;
                    align-items: stretch;
                    gap: 1.25rem;
                    padding: 1.5rem;
                }
                .cookie-actions {
                    justify-content: flex-end;
                }
            }
        `;
        document.head.appendChild(styles);

        // 2. Inject Banner Markup
        const banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.innerHTML = `
            <p class="cookie-text">
                BeamMaster AI uses cookies to analyze site traffic, personalize content, and serve relevant advertisements through Google AdSense. 
                By clicking "Accept All", you consent to our use of cookies. Read our <a href="${privacyLink}" target="_blank">Privacy Policy</a> to learn more.
            </p>
            <div class="cookie-actions">
                <button id="cookie-btn-decline" class="btn btn-secondary btn-sm">Decline</button>
                <button id="cookie-btn-accept" class="btn btn-primary btn-sm">Accept All</button>
            </div>
        `;
        document.body.appendChild(banner);

        // Trigger slide-up animation
        setTimeout(() => {
            banner.classList.add('active');
        }, 1000);

        // 3. Attach Events
        const btnAccept = document.getElementById('cookie-btn-accept');
        const btnDecline = document.getElementById('cookie-btn-decline');

        function dismissBanner(choice) {
            localStorage.setItem('beammaster_cookie_consent', choice);
            banner.classList.remove('active');
            setTimeout(() => {
                banner.remove();
            }, 600);
        }

        btnAccept.addEventListener('click', () => dismissBanner('accepted'));
        btnDecline.addEventListener('click', () => dismissBanner('declined'));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCookieConsent);
    } else {
        initCookieConsent();
    }
})();
