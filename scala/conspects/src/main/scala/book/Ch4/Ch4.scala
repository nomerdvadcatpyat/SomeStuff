import java.util
import java.awt.font.TextAttribute._
import java.io.File

import scala.io.StdIn
import scala.jdk.CollectionConverters._
import java.util.{Calendar, Scanner}

object Ch4 {
  def main(args: Array[String]): Unit = {

  }

  def summary = {
    val a = Map("asd" -> 12, "oahsdojds" -> 32)
    var b = scala.collection.mutable.TreeMap[String, Int]()
    b("ASDASDAS") = 4312
    b ++= a
    b -= "asd"
    val c = for ((k, v) <- b) yield (v, k)

    val scores: scala.collection.mutable.Map[String, Int] = new util.TreeMap[String, Int]().asScala
    val props: scala.collection.Map[String, String] = System.getProperties().asScala
    val attrs = Map(FAMILY -> "Serif", SIZE -> 12) // ассоциативный массив Scala
    val font = new java.awt.Font(attrs.asJava) // принимает ассоциативный массив Java

    // туплы
    val t = (1, 2.14, "bread")
    val bread = t._3 // с 1 нумерация бляы
    val (first, second, third) = t // сопоставление с образцом, first = 1, second = 2.14, third = bread
    val (qwe, asd, _) = t // если не нужно значение из тупла, то _ вместо него
    val (upperCharsStr, lowerCharsStr) = "New York".partition(_.isUpper)

    val symbols = Array("<", "-", ">")
    val counts = Array(2, 10, 2)
    val pairs = symbols.zip(counts) // Array(("<", 2), ("-", 10), (">", 2))
    // пример использования: keys.zip(values).toMap

  }

  def firstEx() = {
    val defaultPrices = Map("чипсы" -> 100, "сосиски" -> 120)
    val discountPrices = for ((k, v) <- defaultPrices) yield (k, v * 0.9)

  }

  def secondEx() = {
    val sc = new Scanner(new File("./resources/file.txt"))
    val map = scala.collection.mutable.Map[String, Int]()

    while (sc.hasNext()) {
      val value = sc.next()
      map(value) = map.getOrElse(value, 0) + 1
    }

    print(map)
  }

  def thirdEx() = {
    val sc = new Scanner(new File("./resources/file.txt"))
    var map = Map[String, Int]()

    while (sc.hasNext()) {
      val value = sc.next()
      val newMap = map + (value -> (map.getOrElse(value, 0) + 1))
      map = newMap
    }

    print(map)
  }

  def fourthEx() = {
    val sc = new Scanner(new File("./resources/file.txt"))
    val map = scala.collection.mutable.TreeMap[String, Int]()

    while (sc.hasNext()) {
      val value = sc.next()
      map(value) = map.getOrElse(value, 0) + 1
    }

    print(map)
  }

  def fifthEx() = {
    val sc = new Scanner(new File("./resources/file.txt"))
    val map = new java.util.TreeMap[String, Int]().asScala

    while (sc.hasNext()) {
      val value = sc.next()
      map(value) = map.getOrElse(value, 0) + 1
    }

    print(map)
  }

  def sixthEx() = {
    val days = scala.collection.mutable.LinkedHashMap[String, Int](
      "Monday" -> Calendar.MONDAY,
      "Tuesday" -> Calendar.TUESDAY,
      "Saturday" -> Calendar.SATURDAY
    )
  }

  // 7 лень читать

  // 8
  def minmax(values: Array[Int]) = {
    (values.min, values.max)
  }

  // 9
  def lteqgt(values: Array[Int], v: Int) = {
    var lt = 0
    var eq = 0
    var gt = 0
    for (e <- values) if (e > v) gt += 1 else if (e < v) lt += 1 else eq += 1
    (lt, eq, gt)
  }

  def tenthEx() = {
    println("Hello".zip("World"))
  }

}
