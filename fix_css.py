import sys

with open('src/css/style.css', 'r') as f:
    css = f.read()

# Find the start of the layout section
start_marker = "/*-----------------------------------*\\\n  #SIDEBAR"
if start_marker not in css:
    print("Marker not found")
    sys.exit(1)

# Keep everything before the marker
base_css = css.split(start_marker)[0]

# Add new layout
new_layout = """/*-----------------------------------*\\
  #LAYOUT REWRITE
\\*-----------------------------------*/

body {
  background-color: var(--background);
  color: var(--on-background);
  font-family: var(--ff-primary);
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.top-bar {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-inline: var(--spacing-4);
  border-bottom: 1px solid var(--outline);
  background-color: var(--surface);
  flex-shrink: 0;
}
.top-bar-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  min-width: 240px;
}
.top-bar .logo img { height: 28px; margin-left: var(--spacing-2); }
.top-bar-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
}
.greeting-wrapper { display: flex; flex-direction: column; }

.search-bar {
  flex-grow: 1;
  max-width: 720px;
  height: 48px;
  background-color: var(--surface-container-highest);
  border-radius: var(--radius-large);
  display: flex;
  align-items: center;
  padding-inline: var(--spacing-2);
  margin-inline: var(--spacing-6);
  transition: background-color var(--tr-duration-short) var(--tr-easing-linear);
}
.search-bar:focus-within {
  background-color: var(--surface);
  box-shadow: var(--shadow-1);
}
.search-bar input {
  flex-grow: 1;
  border: none;
  background: transparent;
  outline: none;
  color: var(--on-surface);
  font-size: 1.6rem;
}

.app-body {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
}

.sidebar {
  width: var(--sidebar-width);
  display: flex;
  flex-direction: column;
  padding-block: var(--spacing-4);
  transition: width var(--tr-duration-medium) var(--tr-easing-emphasized);
  overflow-x: hidden;
  overflow-y: auto;
  flex-shrink: 0;
  border-right: none;
}

body.sidebar-active .sidebar {
  width: 72px;
}

/* Hide text in mini sidebar */
body.sidebar-active .sidebar .text,
body.sidebar-active .sidebar .icon-btn[data-edit-btn],
body.sidebar-active .sidebar .icon-btn[data-delete-btn] {
  opacity: 0;
  pointer-events: none;
  display: none;
}

body.sidebar-active .sidebar .nav-item {
  border-radius: var(--radius-full);
  width: 48px;
  height: 48px;
  justify-content: center;
  padding-inline: 0;
  margin-inline: auto;
}
body.sidebar-active .sidebar .nav-item .icon {
  margin-inline-end: 0;
}

/* FAB adjustments */
.sidebar .fab {
  margin-inline: var(--spacing-3);
  margin-block-end: var(--spacing-6);
  width: max-content;
}
body.sidebar-active .sidebar .fab {
  width: 56px;
  padding-inline: 0;
  justify-content: center;
}

/* MAIN adjustments */
.main {
  flex-grow: 1;
  overflow-y: auto;
  padding-inline: var(--spacing-10);
  padding-block: var(--spacing-6);
}

.note-create-bar {
  width: 100%;
  max-width: 600px;
  margin: 0 auto var(--spacing-8) auto;
  background-color: var(--surface);
  border: none;
  border-radius: 8px;
  padding: var(--spacing-3) var(--spacing-5);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--on-surface-variant);
  box-shadow: 0 1px 2px 0 rgba(60,64,67,0.3), 0 2px 6px 2px rgba(60,64,67,0.15);
  cursor: text;
}
[data-theme='dark'] .note-create-bar {
  box-shadow: 0 1px 2px 0 rgba(0,0,0,0.6), 0 2px 6px 2px rgba(0,0,0,0.3);
}

.note-panel-header {
  max-width: 1200px;
  margin-inline: auto;
  margin-block-end: var(--spacing-6);
}
.note-panel-header .title {
  font-size: 2.2rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  color: var(--on-surface-variant);
  text-transform: capitalize;
}

.note-list {
  max-width: 1200px;
  margin-inline: auto;
  columns: 280px;
  column-gap: var(--spacing-4);
}

.note-list .card {
  break-inside: avoid;
  margin-block-end: var(--spacing-4);
}

.empty-notes {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: var(--spacing-4);
  color: var(--on-surface-variant);
  -webkit-user-select: none;
  user-select: none;
}

.empty-notes .material-symbols-rounded {
  font-size: 8rem;
  opacity: 0.15;
  margin-block-end: var(--spacing-4);
  margin-inline: auto;
}

/* Hide desktop toggle states since JS now just adds sidebar-active class */
body:not(.sidebar-active) .sidebar .menu-btn { display: grid; }
body.sidebar-active .sidebar .menu-btn { display: grid; }

.main .mobile-fab { display: none; }

/* Media Queries */
@media (max-width: 921px) {
  .sidebar {
    position: fixed;
    top: 64px;
    left: 0;
    bottom: 0;
    z-index: 4;
    background-color: var(--surface);
    transform: translateX(-100%);
    transition: transform var(--tr-duration-medium) var(--tr-easing-emphasized);
  }
  body.sidebar-active .sidebar {
    transform: translateX(0);
    width: var(--sidebar-width);
  }
  .main { padding-inline: var(--spacing-4); }
  .note-create-bar { margin-inline: auto; margin-block-start: var(--spacing-4); }
  .search-bar { display: none; }
  .top-bar-left { min-width: auto; }
  
  .sidebar .fab { display: none; }
  .main .mobile-fab {
    display: flex;
    position: fixed;
    bottom: var(--spacing-4);
    right: var(--spacing-4);
    z-index: 2;
  }
}
"""

with open('src/css/style.css', 'w') as f:
    f.write(base_css + new_layout)
