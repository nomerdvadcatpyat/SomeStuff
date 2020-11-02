import java.io.*;
import java.util.ArrayList;
import java.util.Arrays;

public class Main {

    public static void main(String[] args) {
        try {
            BufferedReader in = new BufferedReader(new FileReader(new File("./in.txt")));
            int nodes = Integer.parseInt(in.readLine());
            ArrayList<Edge> edges = new ArrayList<>();

            for (int i = 0; i < nodes; i++) {
                String line = in.readLine();
                String[] rawLine = line.substring(0, line.length() - 1).split(" ");
                for (int j = 0; j < rawLine.length; j += 2) {
                    int otherNode = Integer.parseInt(rawLine[j]);
                    if (otherNode > i + 1) edges.add(new Edge(i + 1, otherNode, Integer.parseInt(rawLine[j + 1])));
                }
            }
            in.close();

            Edge[] resEdges = KruskalAlgorithm.Kruskal(nodes, edges.toArray(new Edge[0]));

            ArrayList<Integer>[] res = new ArrayList[nodes];
            int resC = 0;

            for (int i = 0; i < res.length; i++) {
                res[i] = new ArrayList<>();
            }

            for (Edge edge : resEdges) {
                res[edge.getFromNode() - 1].add(edge.getToNode());
                res[edge.getToNode() - 1].add(edge.getFromNode());

                resC+= edge.getWeight();
            }

            for (int i = 0; i < res.length; i++) {
                res[i].sort(Integer::compareTo);
            }

            BufferedWriter out = new BufferedWriter(new FileWriter(new File("./out.txt")));

            for (int i = 0; i < res.length; i++) {
                String line = "";
                for (int j = 0; j < res[i].size(); j++) {
                    line += res[i].get(j) + " ";
                }
                line += "0\n";
                out.write(line);
            }

            out.write("" +
                    resC);
            out.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}