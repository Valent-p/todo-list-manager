

const data = JSON.parse(localStorage.getItem('todo-list-manager-data')) || {
    items: {
        0: {id: 0, title: "Hello", isDone: false, description:"What", doneNote: "not done"},
        1: {id: 1, title: "Hi", isDone: true, description:"Yessssss", doneNote: "Just done"}
    },
    next_id: 2
};

export function get_all() {
    return data.items;
}

export function save(item){
    item.id = data.next_id++;
    data.items[item.id] = item;

    localStorage.setItem('todo-list-manager-data', JSON.stringify(data));
}

export function save_all(items) {
    data.items = items;
    localStorage.setItem('todo-list-manager-data', JSON.stringify(data));
}
