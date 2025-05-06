import React from 'react'

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null

  return (
    <>
      <div style={styles.overlay}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h2 style={styles.title}>{title}</h2>
            <button style={styles.closeButton} onClick={onClose}>x</button>
          </div>
          <div style={styles.body}>
            {children}
          </div>
        </div>
      </div>
    </>
  )
}

// Estilos em objeto
const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    animation: 'fadeIn 0.3s ease',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
    overflow: 'hidden',
    animation: 'slideIn 0.3s ease',
  },
  header: {
    backgroundColor: '#f9f9f9',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #ddd',
  },
  title: {
    margin: 0,
    fontSize: '1.5rem',
    color: '#333',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.8rem',
    cursor: 'pointer',
    color: '#666',
  },
  body: {
    padding: '24px',
  }
}
