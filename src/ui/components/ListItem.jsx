import styles from '../../css/ListItem.module.css';

function ListItem({id, title, isDone, doneNote, description, onToggle, onRemove}) {
    return (
        <article className={styles.card} aria-labelledby={`title-${id}`}>
            <div className={styles.cardHeader}>
                <div className={styles.iconWrap} aria-hidden>
                    <i className={isDone ? 'fa fa-check' : 'far fa-circle'}></i>
                </div>
                <h3 id={`title-${id}`} className={styles.title}>{title}</h3>

                <div style={{marginLeft:'auto', display:'flex', gap:8}}>
                    <button aria-label={isDone? 'Mark as not done' : 'Mark as done'} className={styles.iconBtn} onClick={() => onToggle && onToggle(id)}>
                        <i className={`fa ${isDone ? 'fa-undo' : 'fa-check'}`}></i>
                    </button>
                    <button aria-label="Remove item" className={styles.iconBtnDanger} onClick={() => onRemove && onRemove(id)}>
                        <i className="fa fa-trash"></i>
                    </button>
                </div>
            </div>

            <p className={styles.description}>{description}</p>

            {isDone ? <p className={styles.doneNote}>{doneNote}</p> : null}
        </article>
    )
}

export default ListItem;