function findParentComment(comment) {
  let current = comment;
  let indent = parseInt(current.querySelector('.ind img').width);
  
  while (current = current.previousElementSibling) {
    if (!current.classList.contains('comtr')) continue;
    let parentIndent = parseInt(current.querySelector('.ind img').width);
    if (parentIndent < indent) return current;
  }
  return null;
}

function createPreview(comment) {
  const parent = findParentComment(comment);
  if (!parent) return;

  const grandparent = findParentComment(parent);
  
  const previewLinks = document.createElement('span');
  previewLinks.className = 'hn-preview-links';
  
  const parentLink = document.createElement('a');
  parentLink.className = 'hn-preview-link';
  parentLink.textContent = 'parent ↑';
  previewLinks.appendChild(parentLink);

  if (grandparent) {
    const grandparentLink = document.createElement('a');
    grandparentLink.className = 'hn-preview-link';
    grandparentLink.textContent = ' grandparent ↑↑';
    previewLinks.appendChild(grandparentLink);
  }

  function showPreview(ancestor, event) {
    // remove any existing preview
    removePreview();

    const preview = document.createElement('div');
    preview.className = 'hn-preview';

    const rect = event.target.getBoundingClientRect();
    preview.style.left = `${rect.left}px`;
    preview.style.top = `${rect.top + window.scrollY - 10}px`;

    const header = document.createElement('div');
    header.className = 'hn-preview-header';
    const author = ancestor.querySelector('.hnuser').textContent;
    const age = ancestor.querySelector('.age').textContent;
    header.textContent = `${author} | ${age}`;
    
    const content = ancestor.querySelector('.commtext').cloneNode(true);
    
    preview.appendChild(header);
    preview.appendChild(content);
    document.body.appendChild(preview);

    // adjust if preview goes off screen
    const previewRect = preview.getBoundingClientRect();
    if (previewRect.right > window.innerWidth) {
      preview.style.left = (window.innerWidth - previewRect.width - 10) + 'px';
    }
    if (previewRect.top < 0) {
      preview.style.top = (rect.bottom + 10) + 'px';
    }
  }

  function removePreview() {
    const preview = document.querySelector('.hn-preview');
    if (preview) preview.remove();
  }

  parentLink.addEventListener('mouseover', (e) => showPreview(parent, e));
  parentLink.addEventListener('mouseout', removePreview);

  if (grandparent) {
    const grandparentLink = previewLinks.lastChild;
    grandparentLink.addEventListener('mouseover', (e) => showPreview(grandparent, e));
    grandparentLink.addEventListener('mouseout', removePreview);
  }

  const replyDiv = comment.querySelector('.reply');
  if (replyDiv) {
    replyDiv.appendChild(previewLinks);
  }
}

// Create scroll to top button
function createScrollToTopButton() {
  const button = document.createElement('div');
  button.className = 'hn-scroll-top';
  button.textContent = 'Top';
  button.title = 'Scroll to top';
  button.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  document.body.appendChild(button);
}

// Get all top-level comments (those with indent 0)
function getTopLevelComments() {
  return Array.from(document.querySelectorAll('.comtr')).filter(
    comment => parseInt(comment.querySelector('.ind img').width) === 0
  );
}

// Create next top comment button
function createNextTopCommentButton() {
  const button = document.createElement('div');
  button.className = 'hn-next-comment';
  button.textContent = 'Next';
  button.title = 'Next top-level comment';
  
  button.addEventListener('click', () => {
    const topLevelComments = getTopLevelComments();
    if (topLevelComments.length === 0) return;
    
    // Find the first top-level comment below current scroll position
    const scrollY = window.scrollY;
    const headerHeight = 10; // Account for some padding
    
    for (const comment of topLevelComments) {
      const commentTop = comment.getBoundingClientRect().top + window.scrollY;
      if (commentTop > scrollY + headerHeight) {
        comment.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    
    // If we're at the last comment or below, loop back to the first one
    topLevelComments[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  
  document.body.appendChild(button);
}

// process all comments
document.querySelectorAll('.comtr').forEach(createPreview);

// Only add navigation buttons on comment pages
function isCommentsPage() {
  // Comments pages have URLs containing "item?id=" or are on the "threads" or "newcomments" pages
  return window.location.href.includes('item?id=') || 
         window.location.href.includes('/threads') ||
         window.location.href.includes('/newcomments');
}

// Add scroll buttons only on comments pages
if (isCommentsPage()) {
  createScrollToTopButton();
  createNextTopCommentButton();
}

// handle dynamically loaded comments
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.classList?.contains('comtr')) {
        createPreview(node);
      }
    });
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});