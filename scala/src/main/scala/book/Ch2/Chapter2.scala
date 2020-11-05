package Ch2

import java.time.LocalDate

import scala.math.{abs, sqrt}

object Chapter2 {
  def main(args: Array[String]): Unit = {
  }

  def distance(x0: Double, x1: Double, y0: Double, y1: Double): Double = {
    val dx = abs(x1 - x0);
    val dy = abs(y1 - y0);
    sqrt(dx * dx + dy * dy)
  }

  def recursiveSum(args: Int*): Int = {
    if (args.isEmpty) 0
    else args.head + recursiveSum(args.tail: _*)
  }

  // Упражнения. Глава 2
  // 1
  def signum(x: Double): Int = if (x > 0) 1 else if (x < 0) -1 else 0

  // 2 - (), Unit, выводит void, скорее всего связано с джавой да)
  // 3 - Когда х - юнит
  // 4
  def fourEx() = {
    for (i <- 10 to(0, -1)) println(i)
    // или
    var i = 10
    while (i >= 0) {
      println(i)
      i -= 1
    }

  }

  // 5
  def countdown(n: Int): Unit = {
    for (i <- n to(0, -1)) println(i)
  }

  // 6
  def multiplyUnicode(str: String): Long = {
    if (str.isEmpty) 1
    // str.head это чар, умножается преобразовываясь в инт юникода
    // умножение для строк на число кстати работает как конкатенация этой строки несколько раз
    else str.head * multiplyUnicode(str.tail)
  }

  // 7.
  def multiplyUnicode2(str: String): Long = {
    // str.reduce((a, b) => a*b)
    str.product // В стрингопс я этого не нашел, айдия сама предложила и я нашел что это из Array и там принимается имплицитный нум
    // в данном случае чары неявно преобразуются в числа
  }

  // 8. 9. Сделано в 6.
  // 10.
  def recursivePow(x: Double, n: Double): Double = {
    if (n == 0) 1
    else if (n > 0)
      if (n % 2 == 0) {
        val temp = recursivePow(x, n / 2)
        temp * temp
      }
      else x * recursivePow(x, n - 1)
    else 1 / (recursivePow(x, -n))
  }
  // 11 не

}
