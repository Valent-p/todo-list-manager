//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import { useState, useRef, useEffect } from 'react';
import styles from './css/App.module.css';
import { BrowserRouter, NavLink, Routes, Route } from 'react-router-dom';
import ListingPage from './ui/pages/ListingPage';
import { get_all, save_all, save } from './core/storage';


function App() {
  const [showAddModal, setShowAddModal] = useState(false);

  // in-memory items store with unique ids
  const [items, setItems] = useState(() => get_all());

  const done_items = Object.values(items).filter(item => item.isDone);
  const not_done_items = Object.values(items).filter(item => !item.isDone);

  // focus management for modal
  const lastFocused = useRef(null);
  const modalRef = useRef(null);

  function openModal() {
    lastFocused.current = document.activeElement;
    setShowAddModal(true);
  }

  function closeModal() {
    setShowAddModal(false);
    if (lastFocused.current && typeof lastFocused.current.focus === 'function') lastFocused.current.focus();
  }

  function addItem({ title, description }) {
    const newItem = { title, description, isDone: false, doneNote: '' };
    save(newItem);
    setItems(get_all());
  }

  function toggleItem(id) {
    items[id].isDone = !items[id].isDone;
    save_all(items);
    setItems(get_all());
  }

  function removeItem(id) {
    alert("To remove:" + items[id])
    delete items[id];
    setItems(items);
    save_all(items);
  }

  useEffect(() => {
    if (showAddModal) {
      const el = modalRef.current?.querySelector('input[name="title"]');
      if (el) el.focus();
      const onKey = (e) => {
        if (e.key === 'Escape') closeModal();
        if (e.key === 'Tab' && modalRef.current) {
          const focusable = modalRef.current.querySelectorAll('a[href], button:not([disabled]), textarea, input, select');
          if (focusable.length === 0) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }
  }, [showAddModal]);

  return (
    <BrowserRouter>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.logo}>🗒️</span>
          <div>
            <h1 style={{ margin: 0 }}>ToDo List Manager</h1>
            <small style={{ opacity: 0.85 }}>Simple tasks, beautifully managed</small>
          </div>
        </div>

        <nav>
          <ul className={styles.topNav}>
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
              >
                Home
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/all"
                end
                className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
              >
                All Items
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/done"
                end
                className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
              >
                Completed Items
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/not-done"
                end
                className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
              >
                Not Completed Items
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>

      <main className={styles.appContainer}>

        <Routes>
          <Route path="/" element={<p>Hello</p>} />
          <Route path="/all" element={<ListingPage pageTitle="All Items" items={items} onToggle={toggleItem} onRemove={removeItem} />} />
          <Route path="/done" element={<ListingPage pageTitle="Completed Items" items={done_items} onToggle={toggleItem} onRemove={removeItem} />} />
          <Route path="/not-done" element={<ListingPage pageTitle="Not Completed Items" items={not_done_items} onToggle={toggleItem} onRemove={removeItem} />} />
        </Routes>

        {/* Floating Action Button */}
        <button
          ref={lastFocused}
          className={styles.fab}
          aria-label="Add item"
          onClick={openModal}
        >
          +
        </button>

        {/* Bottom nav (mobile) */}
        <nav className={styles.bottomNav} role="navigation" aria-label="Primary">
          <NavLink to="/" className={({ isActive }) => `${styles.bottomNavItem} ${isActive ? styles.bottomActive : ''}`}>
            <i className={`${styles.bottomNavIcon} fa fa-home`} />
            <span>Home</span>
          </NavLink>
          <NavLink to="/all" className={({ isActive }) => `${styles.bottomNavItem} ${isActive ? styles.bottomActive : ''}`}>
            <i className={`${styles.bottomNavIcon} fa fa-list`} />
            <span>All</span>
          </NavLink>
          <NavLink to="/done" className={({ isActive }) => `${styles.bottomNavItem} ${isActive ? styles.bottomActive : ''}`}>
            <i className={`${styles.bottomNavIcon} fa fa-check`} />
            <span>Done</span>
          </NavLink>
          <NavLink to="/not-done" className={({ isActive }) => `${styles.bottomNavItem} ${isActive ? styles.bottomActive : ''}`}>
            <i className={`${styles.bottomNavIcon} fa fa-circle`} />
            <span>Not</span>
          </NavLink>
        </nav>

        {/* Modal stub for adding an item */}
        {showAddModal && (
          <div className={styles.modalOverlay} onClick={closeModal}>
            <div className={`${styles.modal} ${styles.opening}`} ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="add-item-title" onClick={(e) => e.stopPropagation()}>
              <h2 id="add-item-title">Add Item</h2>
              <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.target); const title = (fd.get('title') || '').toString().trim(); const description = (fd.get('description') || '').toString().trim(); if (title) { addItem({ title, description }); } closeModal(); }}>
                <input name="title" placeholder="Title" />
                <textarea name="description" placeholder="Description" rows={4} />
                <div className={styles.actions}>
                  <button type="button" className={`${styles.btn} ${styles.ghost}`} onClick={closeModal}>Cancel</button>
                  <button type="submit" className={`${styles.btn} ${styles.prim}`}>Add</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </BrowserRouter>
  )
}

export default App
