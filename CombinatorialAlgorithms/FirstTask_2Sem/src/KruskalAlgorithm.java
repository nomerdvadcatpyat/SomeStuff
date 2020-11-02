public class KruskalAlgorithm {

    public static Edge[] Kruskal (int n, Edge[] edges) {
        sortByWeight(edges, edges.length-1);
        Edge[] selectedEdgeSet = new Edge[n-1];
        int[] sets = initSet(n+1);
        int selectedEdgeSetPos = 0, edgesPos = 0;
        do {
            int node1Set = find(sets, edges[edgesPos].getFromNode());
            int node2Set = find(sets, edges[edgesPos].getToNode());
            if (node1Set != node2Set) {
                joinSets(sets, node1Set, node2Set);
                selectedEdgeSet[selectedEdgeSetPos] = edges[edgesPos];
                selectedEdgeSetPos++;
            }
            if(++edgesPos >= edges.length) return null;
        } while (selectedEdgeSetPos < n - 1);
        return selectedEdgeSet;
    }

    private static void sortByWeight(Edge[] edges, int n) {
        for (int k = n/2; k > 0; k--)
            descend(edges, k, n);
        Edge aux;
        for (int k = n; k > 0; k--) {
            descend(edges,0,k);
            aux = edges[0];
            edges[0] = edges[k];
            edges[k] = aux;
        }
    }

    private static void descend(Edge[] edges, int start, int end) {
        int father = start;
        Edge save = edges[father];
        int son = 2*father;
        while (son <= end) {
            if (son < end) {
                if(edges[son].getWeight() < edges[son+1].getWeight())
                    son++;
            }
            if (save.getWeight() >= edges[son].getWeight()) {
                edges[father] = save;
                return;
            } else {
                edges[father] = edges[son];
                father = son;
                son = 2*father;
            }
        }
        edges[father] = save;
    }

    private static int[] initSet(int n) {
        int[] sets = new int[n];
        for (int i = 0; i < n; i++)
            sets[i] = 0;
        return sets;
    }

    private static int find(int[] sets, int node) {
        int i = node;
        while (sets[i] > 0)
            i = sets[i];
        return i;
    }

    private static void joinSets(int[] sets, int node1Set, int node2Set) {
        if (sets[node1Set] == sets[node2Set]) {
            sets[node1Set] = sets[node1Set] - 1;
            sets[node2Set] = node1Set;
        } else {
            if (sets[node1Set] < sets[node2Set])
                sets[node2Set] = node1Set;
            else
                sets[node1Set] = node2Set;
        }
    }
}