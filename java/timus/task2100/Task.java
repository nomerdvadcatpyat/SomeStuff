package timus.task2100;

import java.io.*;

public class Task {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        PrintWriter out = new PrintWriter(new OutputStreamWriter(System.out));

        int count = Integer.parseInt(in.readLine());
        int result = 200;

        for(int i = 0; i < count; i++){
            String name = in.readLine();
            result+=100;
            if(name.contains("+")) result+=100;
        }

        if(result == 1300) result = 1400;

        out.println(result);
        out.flush();
    }
}
