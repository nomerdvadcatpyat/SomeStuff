package timus.task1002;

import java.io.*;
import java.util.HashMap;
import java.util.Locale;
import java.util.Scanner;

public class Task {
    public static void main(String[] args) throws IOException {
        Scanner in = new Scanner(new BufferedReader(new InputStreamReader(System.in)));
        PrintWriter out = new PrintWriter(new OutputStreamWriter(System.out));

        while (true) {
            String number = in.next();
            if(number.equals("-1")) break;
            int wordCount = in.nextInt();
            String[] words = new String[wordCount];
            for(int i = 0; i < wordCount; i++){
                words[i] = in.next();
            }

            String minResult;
            String currentResult;
            for(char ch : number.toCharArray()){
                // я тупой))))))))))))))))))))
            }
        }
    }
}
