package timus.task1001;

import java.io.*;
import java.util.ArrayList;
import java.util.Scanner;

public class Task {
    public static void main(String[] args) throws IOException {
        StreamTokenizer in = new StreamTokenizer(new BufferedReader(new InputStreamReader(System.in)));
        PrintWriter out = new PrintWriter(new OutputStreamWriter(System.out));

        ArrayList<String> arrayList = new ArrayList<>();
        double a;
        while( in.nextToken() == StreamTokenizer.TT_NUMBER ){
            a = in.nval;
            arrayList.add(String.format("%.4f",Math.sqrt(a)));
        }
        for(int i = arrayList.size() - 1; i > -1; i--){
            out.println(arrayList.get(i));
        }

        out.flush();
    }
}
