import ListItem from "../components/ListItem";
import appStyles from '../../css/App.module.css';

function ListingPage({pageTitle, items, onToggle, onRemove}) {
    return (
        <section>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                <h1>{pageTitle}</h1>
            </div>

            <div className={appStyles.listGrid}>
                {items.map(item => (
                    <ListItem
                        key={item.id}
                        id={item.id}
                        isDone={item.isDone}
                        doneNote={item.doneNote}
                        title={item.title}
                        description={item.description}
                        onToggle={onToggle}
                        onRemove={onRemove}
                    />
                ))}
            </div>
        </section>
    )
}

export default ListingPage;