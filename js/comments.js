// BeamMaster AI Article Comment System (localStorage-based)
(function() {
    // Get unique identifier for the current article
    const pathParts = window.location.pathname.split('/');
    const articleId = pathParts[pathParts.length - 1].replace('.html', '') || 'general';

    function initComments() {
        const authorCard = document.querySelector('.author-card');
        if (!authorCard) return; // Only load on article pages with an author card

        // Create Comments Section HTML
        const commentsSec = document.createElement('div');
        commentsSec.id = 'comments-section';
        commentsSec.className = 'comments-section';
        commentsSec.style.marginTop = '3rem';
        commentsSec.style.borderTop = '1px solid var(--border-color)';
        commentsSec.style.paddingTop = '2rem';

        commentsSec.innerHTML = `
            <h3 style="margin-bottom: 1.5rem; font-size: 1.5rem;">Discussion & Comments</h3>
            
            <!-- Comment Form -->
            <form id="comment-form" class="comment-form" style="margin-bottom: 2.5rem; display: flex; flex-direction: column; gap: 1rem;">
                <div style="display: grid; grid-template-columns: 1fr; gap: 1rem;">
                    <div class="form-group" style="margin-bottom: 0;">
                        <label for="comment-name" style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.4rem;">Your Name</label>
                        <input type="text" id="comment-name" placeholder="Enter your name" class="input-control" required style="width: 100%;">
                    </div>
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                    <label for="comment-text" style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.4rem;">Comment</label>
                    <textarea id="comment-text" rows="4" placeholder="Join the discussion... (HTML tags not allowed)" class="input-control" required style="width: 100%; resize: vertical;"></textarea>
                </div>
                <button type="submit" class="btn btn-primary" style="align-self: flex-start;">Post Comment</button>
            </form>

            <!-- Comments List -->
            <div id="comments-list" class="comments-list" style="display: flex; flex-direction: column; gap: 1.25rem;">
                <!-- Comments dynamically rendered here -->
            </div>
        `;

        // Insert immediately after author card
        authorCard.parentNode.insertBefore(commentsSec, authorCard.nextSibling);

        const commentForm = document.getElementById('comment-form');
        const commentsList = document.getElementById('comments-list');
        const commentName = document.getElementById('comment-name');
        const commentText = document.getElementById('comment-text');

        // Load comments from localStorage
        function loadComments() {
            const stored = localStorage.getItem(`beammaster_comments_${articleId}`);
            return stored ? JSON.parse(stored) : [];
        }

        // Save comments to localStorage
        function saveComments(comments) {
            localStorage.setItem(`beammaster_comments_${articleId}`, JSON.stringify(comments));
        }

        // Format Date
        function formatDate(timestamp) {
            const date = new Date(timestamp);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        // Render Comments List
        function renderComments() {
            const comments = loadComments();

            if (comments.length === 0) {
                commentsList.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 2rem 0; font-size: 0.95rem; background-color: var(--bg-secondary); border: 1px dashed var(--border-color); border-radius: var(--radius-md);">No comments yet. Be the first to start the discussion!</div>`;
                return;
            }

            commentsList.innerHTML = comments.map(comment => `
                <div class="comment-card" style="background-color: var(--bg-secondary); border: 1px solid var(--border-color); padding: 1.25rem; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); display: flex; flex-direction: column; gap: 0.5rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 700; color: var(--text-primary); font-size: 0.95rem;">${escapeHTML(comment.name)}</span>
                        <span style="font-size: 0.75rem; color: var(--text-muted);">${formatDate(comment.timestamp)}</span>
                    </div>
                    <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem; white-space: pre-wrap; line-height: 1.5;">${escapeHTML(comment.text)}</p>
                </div>
            `).join('');
        }

        // Helper to escape HTML and prevent XSS
        function escapeHTML(str) {
            return str
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

        // Form Submit Handler
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = commentName.value.trim();
            const text = commentText.value.trim();

            if (!name || !text) return;

            const comments = loadComments();
            comments.push({
                name: name,
                text: text,
                timestamp: Date.now()
            });

            saveComments(comments);
            commentName.value = '';
            commentText.value = '';
            
            renderComments();
        });

        // Initial render
        renderComments();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initComments);
    } else {
        initComments();
    }
})();
