// ВСТАВИТЬ ОГРАНИЧЕНИЕ НА КОЛИЧЕСТВО ДНЕЙ

const layers = [ [2], [2,4], [1,2,4], [1,2,3], [1,3]]; // типо айди городов, удовлетворяющие на каждом дне условию
const MAX_DAYS = 2;

class Node {
    constructor(value, path, visited) {
        this.value = value;
        this.path = path ? path : [];
        this.visited = visited ? visited : []; // id городов, которые челы уже посетили (не считая этого)
    }
}

const nodes = [];
for(let i = 0; i < layers.length; i++) {
    nodes[i] = [];
}

for(let day of layers[0]) {
    nodes[0].push(new Node(day, [day]));
}

console.log(nodes)
// АЛГОРИТМ. Создали уже 1 слой вершин. Начиная со второго: просматриваем все родительские ноды (города, в которых челы были в предыдущие дни),
// если челы уже были в этом городе (и сейчас не там), то добавить на текущий слой новую ноду (город, который удовлетворяет условию и челы в нем в текущий день)
for(let i = 1; i < layers.length; i++) {
    for (let j = 0; j < layers[i].length; j++) {
        for(let parent_node of nodes[i - 1]) {
            const node = new Node(layers[i][j]);
            node.path = [...parent_node.path];
            node.visited = [...parent_node.visited];
            if(parent_node.path[parent_node.path.length - 1] !== node.value) // Если челы сменили город, то добавить его в список посещенных
                node.visited.push(parent_node.value);
            if(!parent_node.visited.includes(node.value)) { // если челы еще не посещали этот город (не уехали из него)
                const lastMaxDays = parent_node.path.slice(-MAX_DAYS);
                if(lastMaxDays.length < MAX_DAYS || lastMaxDays.length !== lastMaxDays.filter(n => n === node.value).length) {
                    // Если путешевствие длиться меньше, чем MAX_DAYS или последние <=MAX_DAYS дней челы были в городе node.value, то посетить город
                    node.path.push(node.value); 
                    nodes[i].push(node); // добавить город на текущий слой (день) 
                }
            }
        } 

    }
}

// for(let layer of nodes)
let c = 0;
for(let node of nodes[nodes.length - 1]) {
    console.log(`node ${node.value}, path ${node.path}, visited ${node.visited}`)
    console.log(++c);
}
