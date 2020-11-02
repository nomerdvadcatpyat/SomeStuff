package streamTokenizerAndPrintWriter;

import java.io.*;
import java.util.*;

import javax.lang.model.element.VariableElement;

public class Program
{

    public static void main(String[] args) throws IOException
    {
        StreamTokenizer in;
        PrintWriter out = null;
        try
        {
		   /*
		    Токенайзер разделяет элементы необычно 881ssss272 здесь даст ответ
		    881 это число; ssss272 это строка.
		    Коды из ttype: -2 это число, -3 это строка, 10 это конец строки
		    Хуета какая-то если честно. Подойдет наверное если будут вводить только однотипные данные,
		    которые разделены пробелами.

		     */
            in = new StreamTokenizer(new BufferedReader(new InputStreamReader(System.in,"ISO-8859-1")));
            out = new PrintWriter(new OutputStreamWriter(System.out, "ISO-8859-1"));
            in.nextToken();
            int count = (int) in.nval;
            for(int i = 0; i < count; i++) {
                in.nextToken();
                if(in.ttype == -2) {
                    int number = (int) in.nval;
                    out.write(number + " is a number" + System.lineSeparator());
                }
                if(in.ttype == -3) {
                    String string = in.sval;
                    out.write(string + " is a string" + System.lineSeparator());
                }

                out.flush();
            }
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
        finally {
            if(out != null) {
                out.flush();
                out.close();
            }
        }
    }

}

