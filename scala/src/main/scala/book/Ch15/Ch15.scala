package book.Ch15

import java.beans.BeanProperty

//import org.junit.Assert.assertTrue
//import org.junit.{Assert, Test}

object Ch15 extends App {
  // Модификаторы Java. @volatile var done = false // В JVM превратится в volatile-поле
  // @transient var recentLookups = new HashMap[String, String] // В JVM становится transient-полем
  // @strictfp def calculate(x: Double) = ... Результат вычисляется медленнее и получается менее точным, зато более переносимым.
  // @native def win32RegKeys(root: Int, path: String): Array[String]

  // Интерфейсы-маркеры
  // Вместо интерфейсов-маркеров (marker interfaces) Cloneable и java.rmi.Remote для обозначения клонируемых и удаленных объектов
  // в Scala используются аннотации @cloneable и @remote.

  // Контролируемые исключения. @throws(classOf[IOException]) def read(filename: String) == void read(String filename) throws IOException
  // Без аннотации @throws программный код на Java не сможет перехватывать исключений.

  // Списка аргументов переменной длинны: Если добавить @varargs: @varargs def process(args: String*), тогда будет
  // сгенерирован Java-метод void process(String... args) // Переходный Java-метод

  // JavaBeans.
  // @BeanProperty var name : String = _ будут сгенерированы методы getName() : String и setName(newValue : String) : Unit

  // Если вы полагаетесь на выполнение компилятором оптимизации хвостовой рекурсии, необходимо отметить метод аннотацией @tailrec.



}
