package book.Ch13

import java.util.TimeZone

import scala.:+
import scala.collection.BitSet
import scala.collection.immutable.SortedSet
import scala.collection.mutable.{ArrayBuffer, ListBuffer}
import scala.collection.parallel.CollectionConverters.ImmutableIterableIsParallelizable

object Ch13 extends App{
  // В начале на стр 202 краткий ликбез классный
  // Табличка с методами добавления и удаления элементов стр 210-211
  //
  //+ добавляет элемент в неупорядоченную коллекцию; +: и :+ добавляет элемент в начало или в конец последовательности;
  // 2 +: Seq(1,32,2) :+ 3
  // ++ объединяет две коллекции; - и -- удаляют элементы;

  // Иерархия напоминает аналогичную в языке Java, с парой улучшений:
  //  1. Ассоциативные массивы не образуют отдельной иерархии, а являются частью общей иерархии.
  //  2. IndexedSeq является супертипом массивов, но не списков, что свидетельствует об их непохожести.
  //
  // Обобщенный метод to[C] для преобразования коллекций из одного типа в другой.
  // метод sameElements для поэлементного сравнения разных коллекций (1, 3, 2) и (1, 2, 3) false

  // Тип Vector – неизменяемый аналог ArrayBuffer: индексируемая последовательность с быстрым произвольным доступом к элементам.

  // Списки. В Scala список может быть либо значением Nil (то есть быть пустым),
  // либо объектом с элементом head и элементом tail, который сам является списком.
  // Оператор :: создает новый список из заданных значений головы и хвоста списка. :: - правоассоциативный.
  // val a = List(1,2) :: List(3,4) // будет List(List(1, 2), 3, 4)

  //  def sum(list: List[Int]): Int = list match {
  //    case h :: t => h + sum(t) // здесь лист разбивается на голову и хвост
  //    case Nil => 0
  //  }

  // В Scala имеется много разных операторов для добавления и удаления элементов. Ниже приводится краткая сводка по ним:
  //1. Добавление в конец (:+) или в начало (+:) последовательности.
  //2. Добавление (+) в неупорядоченную коллекцию.
  //3. Удаление с помощью -.
  //4. Используйте ++ и -- для добавления и удаления групп элементов.
  //5. При работе со списками предпочтительнее использовать :: и :::.
  //6. Изменяющие операторы += ++= -= --=.
  //7. При работе со множествами я предпочитаю ++ и --.
  //8. Я стараюсь избегать ++: +=: ++=:.

  // val a = for (i <- 1 to 10; j <- 1 to i) yield i * j
  // (1 to 10).flatMap(i => (1 to i).map(j => i * j))
  // res.flatMap(x => x) то же что и res.flatten

  // Метод transform действует подобно map, но выполняет преобразование на месте.
  // Он применяется к изменяемым коллекциям и замещает каждый элемент результатом функции.

  // Метод collect работает с частично определенными функциями (partial functions) – функциями, которые могут быть определены
  // не для всех входных значений. Он возвращает коллекцию всех значений аргументов функции, для которых она определена.
  // Например: "-3+4".collect { case '+' => 1 ; case '-' => -1 } // Vector(-1, 1)

  // Метод groupBy возвращает ассоциативный массив, ключами которого являются значения функции,
  // а значениями – коллекции элементов, для которых функция вернула данный ключ.
  // Например, val map = words.groupBy(_.substring(0, 1).toUpper) создаст ассоциативный массив, в котором ключу "A" соответствуют
  // все слова, начинающиеся с A, и т. д

  // foldLeft. List(1, 7, 2, 9).foldLeft(0)(_ - _) выполнит последовательность операций 0 - 1 - 7 - 2 - 9 = -19
  // Начальное значение и оператор – это отдельные «каррированные» параметры, что позволяет Scala использовать тип начального
  // значения для определения типа оператора. Например, в List(1, 7, 2,9).foldLeft("")(_ + _)
  // начальное значение является строкой, поэтому оператор должен быть функцией (String, Int) => String.
  // Операцию foldLeft можно также записать с помощью оператора /:, например: (0 /: List(1, 7, 2, 9))(_ - _)
  // print(Vector(1,2,4).foldRight(0)(_ - _)) // 0 - (4 - (2 - 1)) = 3
  // "Mississippi".foldLeft(Map[Char, Int]()) { (m, c) => m + (c -> (m.getOrElse(c, 0) + 1)) }
  //
  // List(1, 3, 8).foldLeft(100)(_ - _) == ((100 - 1) - 3) - 8 == 88
  // List(1, 3, 8).foldRight(100)(_ - _) == 1 - (3 - (8 - 100)) == -94
  // Фолд лефт = сначала переданное значение op 1 элемент, потом все это op 2 элемент и тд СЛЕВА НАПРАВО
  // Фолд райт = сначала последний элемент op переданное значение, потом все это op предпоследний элемент и тд СПРАВА НАЛЕВО

  // методы scanLeft и scanRight объединяют свертку и ассоциативный массив. В результате вы получаете коллекцию промежуточных результатов.
  // Например, (1 to 10).scanLeft(0)(_ + _) вернет все промежуточные суммы: Vector(0, 1, 3, 6, 10, 15, 21, 28, 36, 45, 55)

  // Итераторы – вещь достаточно хрупкая. Каждый вызов next изменяет итератор. Потоки предлагают неизменяемую альтернативу.
  // Поток – это неизменяемый список, хвост которого вычисляется по требованию, то есть только когда вы попросите об этом.
  // def numsFrom(n: BigInt): Stream[BigInt] = n #:: numsFrom(n + 1)
  // Оператор #:: похож на оператор :: для списков, но создает потоки.
  //
  // val tenOrMore = numsFrom(10) возвращается объект потока, который отображается как Stream(10, ?)
  // Хвост потока не вычисляется. Если вызвать метод tenOrMore.tail.tail.tail возвращается Stream(13, ?)
  //
  // Методы потоков вычисляются «лениво». Например, val squares = numsFrom(1).map(x => x * x) вернет Stream(1, ?)
  // Чтобы получить следующий элемент, вам придется вызвать метод squares.tail.
  //
  // Связка методов take и force обеспечивает принудительное получение всех значний.
  // Поток кэширует полученные ранее строки, благодаря чему к ним можно обращаться снова:
  // val words = Source.fromFile("/usr/share/dict/words").getLines.toStream
  // words // Stream(A, ?)
  // words(5) // Aachen
  // words // Stream(A, A's, AOL, AOL's, Aachen, ?)

  // Ленивые представления (view). Этот метод возвращает коллекцию, методы которой реализуют отложенные вычисления.
  // val palindromicSquares = (1 to 1000000).view.map(x => x * x).filter(x => x.toString == x.toString.reverse)
  // вернет коллекцию, не имеющую элементов. (В отличие от потока, она не имеет даже первого элемента.)
  //
  // palindromicSq uares.take(10).mkString(",")
  // произведет много квадратов, пока не найдет десять палиндромов, после чего вычисления остановятся.
  // В отличие от потоков, представления не кэшируют полученных значений.
  // Если вызвать palindromicSquares.take(10).mkString(",") еще раз, вычисления будут выполнены с самого начала.
  // Как и потоки, для принудительного получения нескольких элементов из представления необходимо использовать метод force.
  // При получении представления для изменяемой коллекции любые изменения применяются к оригинальной коллекции.

  // Взаимодействие с коллекциями Java
  // import scala.jdk.CollectionConverters._
  // Map((1,"1"),(2,"2"),(3,"3")).asJava  // вот так вот скалу в джаву
  // val a = System.getProperties().asScala  // scala.collection.mutable.Map[String,String]

  // Параллельные коллекции. ДЕПРЕКЕЙТЕД
  // Если предположить, что coll – это большая коллекция, тогда coll.par.sum вычислит сумму в нескольких потоках.
  // Метод par воспроизводит параллельную реализацию коллекции.
  // Эта реализация распределяет выполнение методов коллекции по нескольким потокам, если это возможно.
  //
  // Можно распределить выполнение цикла for между несколькими потоками, применив .par к коллекции,
  // по элементам которой выполняются итерации: for (i <- (0 until 100000).par) print(s" $i")
  //for (i <- (0 until 100000)) print(s" $i")

  // Параллельные коллекции щас.
  // в build.sbt:
  // libraryDependencies += "org.scala-lang.modules" %% "scala-parallel-collections" % "0.2.0"
  // В коде: import scala.collection.parallel.CollectionConverters._
  // Использование: for(i <- (1 to 1000).par) println(s"$i")


  // tasks
  // 1
  def indexes(string: String): Map[Char, SortedSet[Int]] = {
    var map : collection.immutable.Map[Char, SortedSet[Int]] = Map()
    for (i <- string.indices) {
      val c = string(i)
      map += (c -> (map.getOrElse(c, SortedSet[Int]()) + i))
    }
    map
  }

  // 2
  def indexes2(string: String): Map[Char, List[Int]] = {
    var map : collection.immutable.Map[Char, List[Int]] = Map()
    for (i <- string.indices) {
      val c = string(i)
      map += (c -> (map.getOrElse(c, List[Int]()) :+ i))
    }
    map
  }

  // 3
  def removeEven1(list: ListBuffer[Int]) = {
    val start = System.currentTimeMillis()
    for(i <- list.indices.reverse; if i % 2 != 0) list.remove(i)
    val end = System.currentTimeMillis()
    println(list)
    println(s"1 case: ${end - start} ms")
  }

  def removeEven2(list: ListBuffer[Int]) = {
    val start = System.currentTimeMillis()
    val res = ArrayBuffer[Int]()
    for(i <- list.indices; if i % 2 != 0) res += list(i)
    val end = System.currentTimeMillis()
    println(res)
    println(s"2 case: ${end - start} ms")
  }

  // 4
  def fourthTask(strs: Array[String], map: Map[String,Int]) = {
    var res = Array[Option[Int]]()
    strs.foreach(s => if (map.contains(s)) res = res :+ map.get(s))
    res.flatten
  }

  // 5
  def myMkString(col: Array[String], sep: String) = {
    col.reduceLeft(_ + sep + _)
  }

  // 6
  // println((1 to 10).foldRight(List[Int]())((el, list) => list :+ el))  // 1
  // println((1 to 10).foldLeft(List[Int]())((list, el) => el :: list))  // 2

  // 7
  val prices = List(5.0, 20.0, 9.95)
  val quantities = List(10, 2, 1)
  // println( (prices zip quantities) map { p => p._1 * p._2 } )
  // println( (prices zip quantities) map { Function.tupled(_ * _) })

  // 8
  // toTwoDimensions(Array(1, 2, 3, 4, 5, 6), 3).foreach(line => println(line.mkString("[ ", ", ", "]")))
  def toTwoDimensions(array: Array[Double], columns: Int) = {
    array.grouped(columns).toArray
  }

  // 10
  TimeZone.getAvailableIDs.groupBy(_.split('/')(0)).maxBy(_._2.length)._2.length // чето бред

  // 11
  val str = "some str that needs to be processed in parallel".toSeq
  val frequencies = new scala.collection.mutable.HashMap[Char, Int]
  str.par.aggregate(frequencies) (
    (map, c) => { map(c) = map.getOrElse(c, 0) + 1; map },
    _ ++ _
  )
}
