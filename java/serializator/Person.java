package serializator;

import java.io.Serializable;
import java.util.Date;

public class Person implements Serializable {
    /* В некоторых средах разработки для сериализации объектов класса требуется serialVersionUID
    * serialVersionUID нужен для того, чтобы помечать состояние класса, типо если описание класса изменится,
    * то изменится и serialVersionUID если его удалить и заново добавить.
    * Когда записываем в файл, туда тоже записывается это поле. И если изменить что-то в классе и в программе потом
    * попробовать достать старый объект из файла в новый объект, то вылетит ошибка типо разные serialVersionUID.
    * В айдии для включения этого поля - File -> Settings -> Editor -> Inspections -> Java -> Serialization Issues ->
    * -> dont serialize class without serialVersionUID */
    private static final long serialVersionUID = -7840363941655246249L;
    private String name;
    private Date dob;
    /* Ключевое слово transient используется для тех полей, которые не нужно сериализовывать */
    private transient String smth = "Something transient";

    public String getSmth() {
        return smth;
    }

    public Person(String name, Date date_of_birth){
        dob = date_of_birth;
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public Date getDob() {
        return dob;
    }

    @Override
    public String toString() {
        return String.format("Name: %s, Date of Birth: %tD", name, dob);
    }
}
