public class Edge {

    private int node1, node2, weight;

    public Edge(int from, int to, int weight) {
        this.node1 = from;
        this.node2 = to;
        this.weight = weight;
    }

    public int getFromNode() {
        return node1;
    }

    public int getToNode() {
        return node2;
    }

    public int getWeight() {
        return weight;
    }
}