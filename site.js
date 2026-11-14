(() => {
  'use strict';
  const themeButton = document.querySelector('.theme-toggle');
  const deviceTheme = window.matchMedia('(prefers-color-scheme: dark)');
  let manualTheme = false;
  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    const target = theme === 'dark' ? 'light' : 'dark';
    themeButton.setAttribute('aria-label', `Switch to ${target} mode`);
    themeButton.title = `Switch to ${target} mode`;
    themeButton.querySelector('.theme-label').textContent = target === 'dark' ? 'Dark' : 'Light';
  }
  applyTheme(deviceTheme.matches ? 'dark' : 'light');
  themeButton.hidden = false;
  themeButton.addEventListener('click', () => {
    manualTheme = true;
    applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  });
  deviceTheme.addEventListener('change', event => {
    if (!manualTheme) applyTheme(event.matches ? 'dark' : 'light');
  });
  const projects = JSON.parse(document.getElementById('project-data').textContent);
  const defaults = JSON.parse(document.getElementById('profile-data').textContent);
  const state = { ...defaults };
  const projectDialog = document.getElementById('project-dialog');
  const profileDialog = document.getElementById('profile-dialog');
  const personalizeDialog = document.getElementById('personalize-dialog');
  let returnFocus = null;
  function openDialog(dialog) {
    // Retain the outer-page trigger when moving between nested dialog flows.
    if (!document.activeElement?.closest('dialog')) returnFocus = document.activeElement;
    document.querySelectorAll('dialog[open]').forEach(d => d.close());
    dialog.querySelectorAll('.copy-status').forEach(element => { element.textContent = ''; });
    dialog.showModal();
  }
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      const box = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
    });
    dialog.addEventListener('close', () => {
      if (!document.querySelector('dialog[open]') && returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
    });
  });
  document.querySelectorAll('[data-project]').forEach(button => {
    button.addEventListener('click', () => {
      const project = projects.find(item => item.Id === button.dataset.project);
      if (!project) return;
      for (const [id, value] of Object.entries({
        'project-dialog-title': project.Name,
        'project-description': project.Description,
        'project-challenge': project.Challenge,
        'project-approach': project.Approach,
        'project-learning': project.Learning,
        'project-note': project.Note
      })) document.getElementById(id).textContent = value;
      const tags = document.getElementById('project-tags');
      tags.replaceChildren(...project.Technologies.map(tag => {
        const element = document.createElement('span');
        element.textContent = tag;
        return element;
      }));
      document.getElementById('project-repository').href = project.RepositoryUrl;
      document.getElementById('repository-url').textContent = project.RepositoryUrl;
      openDialog(projectDialog);
    });
  });
  document.querySelectorAll('[data-filter]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-filter]').forEach(filter => {
        const active = filter === button;
        filter.classList.toggle('active', active);
        filter.setAttribute('aria-pressed', String(active));
      });
      let count = 0;
      document.querySelectorAll('.project-card').forEach(card => {
        const show = button.dataset.filter === 'all' || card.dataset.category === button.dataset.filter;
        card.hidden = !show;
        if (show) count++;
      });
      document.getElementById('project-count').textContent = `Showing ${count} project${count === 1 ? '' : 's'}`;
    });
  });
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  function closeMenu() {
    menuButton.setAttribute('aria-expanded', 'false');
    mobileNav.hidden = true;
    menuButton.querySelector('span').textContent = '＋';
  }
  menuButton.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(expanded));
    mobileNav.hidden = !expanded;
    menuButton.querySelector('span').textContent = expanded ? '−' : '＋';
  });
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !mobileNav.hidden) {
      closeMenu();
      menuButton.focus();
    }
  });
  document.querySelectorAll('[data-profile]').forEach(button => {
    button.addEventListener('click', () => {
      const kind = button.dataset.profile === 'contact' ? (state.linkedin ? 'linkedin' : 'github') : button.dataset.profile;
      const url = kind === 'github' ? state.github : state.linkedin;
      const label = kind === 'github' ? 'GitHub' : 'LinkedIn';
      document.getElementById('profile-dialog-title').textContent = url ? `Let’s connect on ${label}.` : `${label}, coming soon.`;
      document.getElementById('profile-message').textContent = url
        ? (kind === 'github' && url === defaults.github ? 'My projects, with the code behind them.' : 'A preview link. No account connected.')
        : (personalizeDialog ? `No ${label} link yet. Try one below.` : `My ${label} profile link will be added soon.`);
      document.getElementById('profile-destination').hidden = !url;
      const link = document.getElementById('profile-link');
      if (url) link.href = url; else link.removeAttribute('href');
      document.getElementById('profile-url').textContent = url;
      openDialog(profileDialog);
    });
  });
  document.querySelectorAll('[data-personalize]').forEach(button => {
    button.addEventListener('click', () => {
      document.getElementById('display-name').value = state.displayName;
      document.getElementById('github-name').value = state.github ? new URL(state.github).pathname.slice(1) : '';
      document.getElementById('linkedin-url').value = state.linkedin;
      document.getElementById('form-error').hidden = true;
      openDialog(personalizeDialog);
    });
  });
  document.getElementById('personalize-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const github = document.getElementById('github-name').value.trim();
    const linkedin = document.getElementById('linkedin-url').value.trim();
    const error = document.getElementById('form-error');
    const fail = message => { error.textContent = message; error.hidden = false; };
    if (github && !/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(github)) return fail('Enter a GitHub username, not a full URL. Use letters, numbers, and interior hyphens.');
    let linkedUrl = '';
    if (linkedin) {
      try {
        const url = new URL(linkedin);
        if (url.protocol !== 'https:' || !['linkedin.com', 'www.linkedin.com'].includes(url.hostname) || !/^\/in\/[^/]+\/?$/.test(url.pathname) || url.username || url.password || url.port) throw new Error('Invalid profile URL');
        linkedUrl = `https://www.linkedin.com${url.pathname}`;
      } catch {
        return fail('Use a personal LinkedIn URL like https://www.linkedin.com/in/your-profile.');
      }
    }
    state.displayName = document.getElementById('display-name').value.trim() || defaults.displayName;
    state.github = github ? `https://github.com/${github}` : '';
    state.linkedin = linkedUrl;
    document.querySelectorAll('[data-name]').forEach(element => { element.textContent = state.displayName; });
    document.querySelector('.demo-strip').replaceChildren();
    const label = document.createElement('span'); label.textContent = 'WORKING PREVIEW';
    document.querySelector('.demo-strip').append(label, 'Profile edits last until reload. Project stories remain unchanged; no accounts connected.');
    personalizeDialog.close();
  });
  document.querySelectorAll('[data-copy-target]').forEach(button => {
    button.addEventListener('click', async () => {
      const text = document.getElementById(button.dataset.copyTarget).textContent;
      const status = button.nextElementSibling;
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(text);
        status.textContent = 'Link copied.';
      } catch {
        status.textContent = 'Select the full URL above to copy it manually.';
      }
    });
  });
  // Progressive enhancement: without JavaScript both favorite lists are readable.
  const gamingTabs = [...document.querySelectorAll('[data-game-tab]')];
  const gamingTablist = document.querySelector('.gaming-tabs');
  const gamePanels = [...document.querySelectorAll('[data-game-panel]')];
  if (gamingTablist && gamingTabs.length) {
    gamingTablist.hidden = false;
    gamingTablist.setAttribute('role', 'tablist');
    function selectGameTab(button, focus = false) {
      gamingTabs.forEach(tab => {
        const active = tab === button;
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
      });
      gamePanels.forEach(panel => {
        const active = panel.dataset.gamePanel === button.dataset.gameTab;
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', `tab-${panel.dataset.gamePanel}`);
        panel.tabIndex = 0;
        panel.hidden = !active;
        panel.querySelector('.game-group-title').hidden = true;
      });
      if (focus) button.focus();
    }
    gamingTabs.forEach((tab, index) => {
      tab.addEventListener('click', () => selectGameTab(tab));
      tab.addEventListener('keydown', event => {
        let next = index;
        if (event.key === 'ArrowRight') next = (index + 1) % gamingTabs.length;
        else if (event.key === 'ArrowLeft') next = (index - 1 + gamingTabs.length) % gamingTabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = gamingTabs.length - 1;
        else return;
        event.preventDefault();
        selectGameTab(gamingTabs[next], true);
      });
    });
    selectGameTab(gamingTabs[0]);
  }
  const progress = document.querySelector('.reading-progress');
  let queued = false;
  window.addEventListener('scroll', () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      const range = document.documentElement.scrollHeight - innerHeight;
      progress.style.width = `${range > 0 ? scrollY / range * 100 : 0}%`;
      queued = false;
    });
  }, { passive: true });
})();
