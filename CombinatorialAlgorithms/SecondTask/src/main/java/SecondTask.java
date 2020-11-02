import java.io.*;
import java.lang.reflect.Array;
import java.util.*;

public class SecondTask {

    static int[][] adjacencyMatrix = new int[64][64];
    static boolean[] visitedVertex = new boolean[64];


    public static void main(String[] args) {
        try {
            BufferedReader in = new BufferedReader(new FileReader(new File("./in.txt")));
            String line1 = in.readLine();
            String line2 = in.readLine();
            /* разделяю входные значения на позиции на шахматной доске в виде массива из 2 элементов:
             * 1 элемент = код чара буквы позиции - 97 (чтобы 'a'=0 и тд); 2 элемент = цифра в позиции */
            int[] knightPos = new int[]{(int) line1.charAt(0) - 97, Character.getNumericValue(line1.charAt(1)) - 1};
            int[] pawnPos = new int[]{(int) line2.charAt(0) - 97, Character.getNumericValue(line2.charAt(1)) - 1};
            // строю матрицу смежности
            for (int i = 0; i < 64; i++) {
                /* 0 - 64 номера позиций от a1 до h8 соответственно.
                   Доска повернута (a2 соответствует числовому значению 0+2=2, h8 - 63.
                 */
                int[] currentPos = convertNumberToPos(i);
                for (int j = 0; j < 64; j++) {
                    int[] adjPos = convertNumberToPos(j);
                    adjacencyMatrix[i][j] = getAdjacencyPriority(currentPos, adjPos);
                    // Если встретилась пешка - рубить независимо от приоритетов
/*                    if(adjPos[0] == pawnPos[0] && adjPos[1] == pawnPos[1] && adjacencyMatrix[i][j] != 0)
                        adjacencyMatrix[i][j] = 9;*/
                }
            }
            dfs(knightPos, pawnPos);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // поиск в глубину
    static void dfs(int[] horsePos, int[] peshkaPos) throws IOException {
        int numberHorsePos = convertPosToNumber(horsePos);
        int numberPeshkaPos = convertPosToNumber(peshkaPos);
        BufferedWriter fw = new BufferedWriter(new FileWriter(new File("./out.txt")));
        Stack<Integer> stack = new Stack<>();
        visitedVertex[numberHorsePos] = true;
        // обрабатываю позиции, в которых пешка может срубить коня
        if (numberPeshkaPos % 8 != 0) {
            if (numberPeshkaPos <= 55)
                visitedVertex[numberPeshkaPos + 7] = true;
            if (numberPeshkaPos >= 9)
                visitedVertex[numberPeshkaPos - 9] = true;
        }
        fw.write(vertexToString(numberHorsePos));
        stack.push(numberHorsePos);

        while (!stack.isEmpty()) {
            int v = getAdjUnvisitedVertex1(stack.peek());
            if (v == -1) stack.pop();
            else {
                visitedVertex[v] = true;
                fw.write(vertexToString(v));
                if (v == numberPeshkaPos) break;
                stack.push(v);
            }
        }
        fw.close();
    }

    // получить непосещенную смежную вершину
    static int getAdjUnvisitedVertex1(int i) {
        List<Integer> list = new ArrayList<>();
        for (int j = 0; j < 64; j++)
            list.add(adjacencyMatrix[i][j]);
        int max = Collections.max(list);
        while(visitedVertex[list.indexOf(max)] && max != 0){
            list.set(list.indexOf(max),0);
            max = Collections.max(list);
        }
        if(max == 0) return -1;
        return list.indexOf(max);
    }


    // проверить смежность позиций и получить приоритет
    static int getAdjacencyPriority(int[] firstPos, int[] secondPos) {
        if ((firstPos[0] + 1 == secondPos[0]) && (firstPos[1] + 2 == secondPos[1])) return 8;
        if ((firstPos[0] - 1 == secondPos[0]) && (firstPos[1] + 2 == secondPos[1])) return 7;
        if ((firstPos[0] - 2 == secondPos[0]) && (firstPos[1] + 1 == secondPos[1])) return 6;
        if ((firstPos[0] - 2 == secondPos[0]) && (firstPos[1] - 1 == secondPos[1])) return 5;
        if ((firstPos[0] - 1 == secondPos[0]) && (firstPos[1] - 2 == secondPos[1])) return 4;
        if ((firstPos[0] + 1 == secondPos[0]) && (firstPos[1] - 2 == secondPos[1])) return 3;
        if ((firstPos[0] + 2 == secondPos[0]) && (firstPos[1] - 1 == secondPos[1])) return 2;
        if ((firstPos[0] + 2 == secondPos[0]) && (firstPos[1] + 1 == secondPos[1])) return 1;
        return 0;
    }

    static int[] convertNumberToPos(int num) {
        return new int[]{num / 8, (num % 8)};
    }

    static int convertPosToNumber(int[] pos) {
        return pos[0] * 8 + pos[1];
    }

    static String vertexToString(int num) {
        int[] pos = convertNumberToPos(num);
        return (char) (pos[0] + 97) + "" + (pos[1] + 1) + '\n';
    }
}
