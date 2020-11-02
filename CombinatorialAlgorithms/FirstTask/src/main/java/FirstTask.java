import java.io.*;
import java.nio.file.Files;
import java.util.*;

public class FirstTask {

    static int n;
    static int[][] matrix;
    static boolean[] visited;
    static List<Integer> firstGroup = new ArrayList<>();
    static List<Integer> secondGroup = new ArrayList<>();

    public static void main(String[] args) {
        try {
            BufferedReader in = new BufferedReader(new FileReader(new File("./in.txt")));
            n = Integer.parseInt(in.readLine());
            matrix = new int[n][n];
            visited = new boolean[n];


            for (int i = 0; i < n; i++) {
                int[] line = Arrays.stream(in.readLine().split(" ")).mapToInt(Integer::parseInt).toArray();
                System.arraycopy(line, 0, matrix[i], 0, n);
            }
            bfs();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    static void bfs() throws IOException {
        Queue<Integer> queue = new LinkedList<>();
        visited[0] = true;
        queue.add(0);
        firstGroup.add(0);
        int v2;
        BufferedWriter fw = new BufferedWriter(new FileWriter(new File("./out.txt")));
        while (!queue.isEmpty()) {
            int v1 = queue.remove();

            while ((v2 = getAdjUnvisitedVertex(v1)) != -1) {
                if (secondGroup.contains(v1)) firstGroup.add(v2);
                else secondGroup.add(v2);

                for (int j = 0; j < n; j++)
                    if (matrix[v2][j] == 1 &&
                            ((secondGroup.contains(v2) && secondGroup.contains(j))
                                    || (firstGroup.contains(v2) && firstGroup.contains(j)))) {
                        fw.write("N");
                        fw.close();
                        return;
                    }
                visited[v2] = true;
                queue.add(v2);
            }
        }

        StringBuilder res = new StringBuilder();
        res.append("Y" + '\n');
        firstGroup.forEach(res::append);
        res.append("0" + '\n');
        secondGroup.forEach(res::append);
        res.append("0" + '\n');
        fw.write(res.toString());
        fw.close();
    }

    static int getAdjUnvisitedVertex(int v) {
        for (int j = 0; j < n; j++)
            if (matrix[v][j] == 1 && !visited[j])
                return j;
        return -1;
    }
}
