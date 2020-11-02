package serializator;

import java.io.*;
import java.util.Date;
import java.util.List;

public class Program {


    public static void main(String[] args) {
        File file1 = new File("./src/main/resources/test1");
        File file2 = new File("./src/main/resources/test2");
        File file3 = new File("./src/main/resources/test3");

        try {
            //SimpleSerializationDeserializationPersons(file1);
            SimpleSerializationDeserializationArrayOfPerson(file2);
        } catch (Exception e){
            e.printStackTrace();
        }

    }

    public static void SimpleSerializationDeserializationPersons(File file) throws IOException, ClassNotFoundException {
        // Простая сериализация и десериализация отдельных объектов
        Person p = new Person("Pasha",new Date(963273600L*1000));
        Person k = new Person("Joka",new Date(923273600L*1000));

        try (
                ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(file));
                ObjectInputStream ois = new ObjectInputStream(new FileInputStream(file))
        ) {

            oos.writeObject(p);
            oos.writeObject("asdad");
            oos.writeObject(k);

            Person p1 = (Person) ois.readObject();
            String s = (String) ois.readObject();
            Person k1 = (Person) ois.readObject();

            System.out.println(p1);
            System.out.println(s);
            System.out.println(k1);
        }
    }

    public static void SimpleSerializationDeserializationArrayOfPerson(File file) throws IOException,ClassNotFoundException{
        // Сериализация и десериализация массивов
        Person p = new Person("Pasha",new Date(963273600L*1000));
        Person k = new Person("Joka",new Date(923273600L*1000));
        Person l = new Person("Boka", new Date(9871283897L*1000));

        try (
                ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(file));
                ObjectInputStream ois = new ObjectInputStream(new FileInputStream(file))
        ) {
            Person[] people = {p,k,l};
            /* 1 способ - записать сначала длину массива, потом один за другим записывать объекты.
             *  При десериализации сначала считать длину массива = l, затем создать массив на l элементов и считать в него l элементов из ois. */
            oos.writeInt(people.length);
            for (Person person : people) {
                oos.writeObject(person);
            }

            int len = ois.readInt();
            Person[] people1 = new Person[len];
            for (int i = 0; i < len; i++) {
                people1[i] = (Person) ois.readObject();
            }
            System.out.println("1 способ: ");
            for (Person person : people1) {
                System.out.println(person);
            }

            /* 2 способ - тупа засовывать массив как объект в оос и доставать тоже как массив персонов */
            System.out.println("2 способ: ");
            oos.writeObject(people1);
            Person[] people2 = (Person[]) ois.readObject();
            for (Person person : people2) {
                System.out.println(person);
            }

        }
    }
}
