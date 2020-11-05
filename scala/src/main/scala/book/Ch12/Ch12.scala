package book.Ch12

import scala.math.ceil


object Ch12 extends App {
  // Функции высшего порядка.
  //
  // import scala.math._
  val fun1 = x => ceil(x)
  // val fun2 = ceil _                    ЭКВИВАЛЕНТНЫ
  // val fun3: Double => Double = ceil

  // ceil – это метод объекта пакета scala.math package.
  // Для передачи таким способом методов классов следует использовать немного иной синтаксис:
  // val f = (_: String).charAt(_: Int)
  // или val f: (String, Int) => Char = _.charAt(_)
  // или val f = (x: Int, y: String) => y.charAt(x)

  // Что можно делать с функциями? Две операции:
  //1) вызывать их;
  //2) передавать в виде значений, сохраняя в переменных или передавая функциям в виде параметров.

  // Array(3.14, 1.42, 2.0).map(_ * 2)

  // Все, что определяется при помощи def (в REPL, в классе или в объекте), является методом, а не функцией

  // Функции с функциональными параметрами. def valueAtOneQuarter(f: (Double) => Double) = f(0.25)
  // valueAtOneQuarter(sqrt _) // 0.5
  // Тип valueAtOneQuarter: ((Double) => Double) => Double
  // Поскольку valueAtOneQuarter – это функция, принимающая другую функцию, она называется функцией высшего порядка (hight order function).
  // Функции высшего порядка могут также возвращать функции. Ниже приводится простой пример такой функции:
  // def mulBy(factor : Double) = (x : Double) => factor * x. Тип mulBy: (Double) => ((Double) => Double)

  // Скала хорошо выводит типы. Вот. valueAtOneQuarter(3 * _) или valueAtOneQuarter(x => 3 * x) скала поймет что там дабл.
  // val fun = 3 * _  тут ошибка, val fun = 3 * (_: Double) тут норм, тк указан тип

  // Передача типа _ помогает преобразовать методы в функции. Например, (_: String).length – это функция String => Int,
  // а (_: String).substring(_:Int, _: Int) – это функция (String, Int, Int) => String.

  // Замыкания. В теле функции имеется доступ ко всем переменным, присутствующим в охватывающей области видимости.
  // Пример на стр 193.
  // Замыкание состоит из программного кода и определений всех нелокальных переменных, используемых в этом программном коде.

  // Карринг - это процесс превращения функции с двумя аргументами в функцию с одним аргументом.
  // Такая функция возвращает функцию, которая использует второй аргумент.
  // val mulOneAtATime = (x: Int) => (y: Int) => x * y Каррированная функция
  // def mulOneAtATime(x: Int) = (y: Int) => x * y           <- Каррированные методы
  // def mulOneAtATime(x: Int)(y: Int) = x * y              <--|
  // Пример стр 196

  // Абстракция управляющих конструкций.
  // def runInThread(block: () => Unit) {} ; runInThread { () => println("Hi"); Thread.sleep(10000); println("Bye") }
  // Чтобы убрать () => из вызова, используйте нотацию вызова по имени: опустите скобки (), но оставьте => в объявлении параметра:
  // def runInThread(block: => Unit) {} ; runInThread { println("Hi"); Thread.sleep(10000); println("Bye") }
  def until(condition: => Boolean)(block: => Unit) {
    if (!condition) {
      block
      until(condition)(block)
    }
  }

  var x = 10
  until(x == 0) {
    x -= 1
    // println(x)
  }

  // Про кол бай нейм и бай велью нихуя не понял. Стр 198


  // Задачи
  // 1
  // Метод
  def values(fun: Int => Int, low: Int, high: Int): IndexedSeq[(Int, Int)] = {
    (low to high).map(x => (x, fun(x)))
  }

  // Функция
  val a = (f: Int => Int, low: Int, high: Int) => (low to high).map(x => (x, f(x)))

  // 2 не совсем уверен что ожидалось это, но ладно
  //print(Array(3, 2, 3, 4).reduceLeft((x, y) => if (x > y) x else y))

  // 3
  val fact = (x: Int) => (1 to x).reduceLeft(_*_)
  //print(fact(4))

  // 4
  val fact2 = (x: Int) => (1 to x).foldLeft(1){_*_}
  print(fact2(-2))

}
