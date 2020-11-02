package graph;

import java.util.Stack;

public class Graph {
    private final int MAX_VERTS = 20;
    private Vertex vertexList[]; // Массив смежности
    private int adjMat[][]; // Матрица смежности
    private int nVerts; // Текущее кол-во вершин

    public Graph()
    {
        nVerts = 0;
        vertexList = new Vertex[MAX_VERTS];

        adjMat = new int[MAX_VERTS][MAX_VERTS];
        for(int j=0; j<MAX_VERTS; j++)
            for(int k=0; k<MAX_VERTS; k++)
                adjMat[j][k] = 0;
    }

    public void addVertex(char lab) {
        vertexList[nVerts++] = new Vertex(lab);
    }

    public void addEdge(int start, int end) {
        adjMat[start][end] = 1;
        adjMat[end][start] = 1;
    }

    public void displayVertex(int v) {
        System.out.print(vertexList[v].label);
    }

    public int getAdjUnvisitedVertex(int v) {
        for(int j=0; j<nVerts; j++)
            if(adjMat[v][j]==1 && !vertexList[j].wasVisited)
                return j;
            return -1;
    }

    // в глубину
    public void dfs() {
        Stack<Integer> theStack = new Stack<>();
        vertexList[0].wasVisited = true;
        displayVertex(0);
        theStack.push(0);
        while( !theStack.isEmpty() ) {
            int v = getAdjUnvisitedVertex( theStack.peek() );
            if(v == -1)
                theStack.pop();
            else
                {
                    vertexList[v].wasVisited = true;
                    displayVertex(v);
                    theStack.push(v);
                }
        }
        for(int j=0; j<nVerts; j++)
            vertexList[j].wasVisited = false;
    }
}

