package Ch3

import scala.collection.mutable.ArrayBuffer
import scala.jdk.CollectionConverters._
import java.awt.datatransfer._

import scala.io.StdIn

object Ch3 {
  def main(args: Array[String]): Unit = {
//    sevenEx(Array(1,2,3,4,5,-4,443,-7473,-2,0,43,-573,0,1232,-43111))
//    eleventhEx()

    val str = StdIn.readLine

  }


  def summary = {
    val a = new Array[Int](10)
    a(0) = 124
    val a1 = Array(999, 5, 3, 2, -132, 123)
    var b = ArrayBuffer[Int]()
    b += 1
    b ++= a1

    //    for(e <- b) print(f"$e ")
    for (i <- b.indices.reverse if i % 2 == 0) b.remove(0)
    b.toArray

    // for-comprehension
    // цикл for-yield создает коллекцию того же типа, что и оригинал (создается новая коллекция)
    // if в for - guard
    val a2 = for (e <- a1 if e < 100) yield 2 * e
    // можно написать так же
    val a3 = a1.filter(_ < 100).map(2 * _)

    // sorted или sortWith() возвращает новый массив (или буффер)
    val a4 = a1.sortWith(_ > _)

    // Вот так можно отсортировать исходный массив (не буфер)
    scala.util.Sorting.quickSort(a1)

    // Получить строку из массива или буфера
    a1.mkString(", ")

    b = ArrayBuffer(1,32,35,52)
    // добавить 2 в конец и удалить элемент 1 (+= и -= возвращают this)
    b += 2 -= 1

    // многомерные массивы
    val matrix = Array.ofDim[Int](3,4) // матрица 3 строки 4 столбца; matrix(row)(column) = 42
    val matrix2 = new Array[Array[Int]](3)
    for(i <- matrix2.indices) matrix2(i) = new Array[Int](4)

    // import scala.jdk.CollectionConverters._ - преобразование скала классов в джаву (например буфферов в листы)
//    val command = ArrayBuffer("ls", "-al", "/home/cay")
//    val pb = new java.lang.ProcessBuilder(command.asJava) // Из Scala в Java

  }

  // Упражнения

  // 1
  def firstEx(a: Array[Int], n: Int) = {
    for(i <- 0 until n) a(i) = i
  }
  // 2
  def secondEx(a: Array[Int]) = {
    print(a.mkString(""," ","\n"))
    for(i <- 0 until (a.length - 1, 2)) {
      val temp = a(i)
      a(i) = a(i + 1)
      a(i + 1) = temp
    }
    print(a.mkString(""," ","\n"))
  }
  // 3
  def thirdEx(a: Array[Int]) = {
    val b = for(i <- a.indices) yield {
      if (i == a.length - 1) a(i)
      else if (i % 2 == 0) {
        val temp = a(i)
        a(i) = a(i + 1)
        a(i + 1) = temp
      }
      a(i)
    }
    print(b.mkString(", "))
  }
  // 4
  def fourEx(a: Array[Int]) = {
    var positive = ArrayBuffer[Int]()
    var nonPositive = ArrayBuffer[Int]()

    for(e <- a)
      if(e > 0) positive += e else nonPositive += e

    val res = (positive ++ nonPositive).toArray
    print(res.mkString(", "))
  }
  // 5
  def fiveEx(a: Array[Double]) = {
    // среднее арифмитическое
    val srAr = a.sum / a.length
    // среднее значение
    val srZn = a.sortWith(_ < _)(a.length/2)
  }
  // 6. Наверн по заданию надо делать это мануально или я хз
  def sixEx(a: Array[Int], b: ArrayBuffer[Int]) = {
    a.sortWith(_ > _)
    b.sortWith(_ > _)
  }
  // 7
  def sevenEx(a: Array[Int]) = {
    print(a.distinct.mkString(", "))
  }
  // 8
  def eightEx(a: ArrayBuffer[Int]) = {
    val negativeIndices = for(i <- a.indices if a(i) < 0) yield i
    for(i <- negativeIndices.drop(1).reverse) a.remove(i)
  }
  // 9 не понял что написано
  // 10
  def tenthEx() = {
    val a = java.util.TimeZone.getAvailableIDs().filter(_.contains("America")).map(_.drop(8)).sorted
  }
  // 11
  def eleventhEx() = {
    val flavors = SystemFlavorMap.getDefaultFlavorMap().asInstanceOf[SystemFlavorMap]
    var b = flavors.getNativesForFlavor(DataFlavor.imageFlavor)
    print(b)
  }
}
