package book.Ch14

import java.io.File
import java.nio.file.Files

import scala.io.Source
import scala.util.matching.Regex

object Ch14 extends App {
  // pattern matching && case classes
  // case-классы – это классы, для которых компилятор автоматически создает методы, необходимые для выполнения сопоставления с образцом;
  //
  // obj match {
  // case 'smth' | 'smthElse' => ...
  // case '123' => ..
  // case _ => throw Error
  // }
  //
  // В Scala можно добавить в предложение-ограничитель (guard clause), например:
  // case _ if Character.isDigit(ch) => digit = Character.digit(ch, 10)
  // Предложение-ограничитель (guard clause) может быть любым логическим условием.
  // Если за ключевым словом case следует имя переменной, результат выражения сопоставления будет присвоен этой переменной.
  //     "asd123" foreach {
  //       case ch if Character.isDigit(ch) => println(s"$ch is digit");
  //       case ch => println(s"$ch is not digit") // можно использовать одинаковые имена в разных кейсах
  //    }
  // Универсальный образец case _ можно рассматривать как частный случай этой особенности, где роль имени переменной играет _.
  //
  // Если имя константы начинается с символа нижнего регистра, заключите его в обратные апострофы:
  // import java.io.File._
  // str match {
  // case `pathSeparator` => ... // Если str == pathSeparator ...
  // case pathSeparator => ...
  // // Внимание – объявляется новая переменная pathSeparator
  // }
  //
  // Сопоставление с типом: case _: Any => print("Hello")
  // Внимание. Сопоставление выполняется во время выполнения, когда все обобщенные (generic) типы стираются в виртуальной машине Java.
  // Поэтому нельзя выполнить сопоставления с определенным типом ассоциативного массива Map.
  // case m: Map[String, Int] => ... // Нельзя
  // Но можно выполнить сопоставление с обобщенным (generic) типом: case m: Map[_, _] => ... // OK
  // Однако типы массивов не стираются. Поэтому сопоставление с типом: Array[Int] допустимо.
  //
  // Сопоставление массивов с содержимым: arr match {
  // case Array(0) => "0"
  // case Array(x, y) => s"$x $y"
  // case Array(0, _*) => "0 ..."
  // case _ => "something else"
  // }
  // Первому образцу соответствует массив, содержащий 0. Второму – любой массив с двумя элементами,
  // значения которых будут присвоены переменным x и y. Третьему образцу соответствует любой массив, начинающийся с нуля.
  // Если понадобится связать переменную-аргумент match _* с переменной, используйте нотацию @:
  // case Array(x, rest @ _*) => rest.min
  //
  // Сопоставление с List: lst match {
  // case 0 :: Nil => "0"
  // case x :: y :: Nil => s"$x $y"
  // case 0 :: tail => "0 ..."
  // case _ => "something else"
  // }
  //
  // Сопостовление с кортежем: pair match {
  // case (0, _) => "0 ..."
  // case (y, 0) => s"$y 0"
  // case _ => "neither is 0"
  // }
  //
  // Если образец включает альтернативы, вместо имен переменных обязательно должны использоваться подчеркивания. Например:
  // pair match {
  // case (_, 0) | (0, _) => ... // OK, совпадет, если
  // // один из компонентов равен нулю
  // case (x, 0) | (0, x) => ... // Ошибка — нельзя связать с альтернативами
  // }
  //
  // Экстракторы стр 238
  //  val pattern = "([0-9]+) ([a-z]+)".r  // Когда регулярка имеет группы, с помощью экстрактора регулярки можно сделать так:
  //  "99 bottles" match {
  //    case pattern(num, item) => println(num, item)
  //    // num получит значение "99", а item – "bottles"
  //  }
  //
  // Образцы в объявлениях переменных:
  // val (x, y) = (1, 2)
  // val Array(first, second, rest @ _*) = arr // присвоит первый и второй элементы массива arr переменным first
  // и second, а остальные элементы – последовательности rest.
  // Стр240 хорошее примечание.
  // выражение val p(x1, ..., xn) = e; в точности соответствует
  // val $result = e match { p(x1, ..., xn) => (x1, ..., xn) }
  // val x1 = $result._1; ... ; val xn = $result._n
  //
  // Образцы в выражениях for:
  // Например, следующий цикл выведет ключи с пустыми значениями и пропустит все остальные:
  // for ((k, "") <- System.getProperties()) println(k)
  // эквивалентно for ((k, v) <- System.getProperties() if v == "") println(k)
  //
  //
  // CASE КЛАССЫ.
  // Case-классы – это классы особого рода, оптимизированные для использования в операциях сопоставления с образцом.
  // При объявлении case-класса автоматически выполняется следующее.
  //  1) Каждый параметр конструктора становится значением val, если явно не объявлен как var (что, впрочем, не рекомендуется).
  //  2) Создается объект-компаньон с методом apply, позволяющим конструировать объекты без оператора new, например: Dollar(29.95) или Currency(29.95, "EUR").
  //  3) Предоставляется метод unapply, необходимый для операции сопоставления с образцом
  //  4) Генерируются методы toString, equals, hashCode и copy, если они не были реализованы явно.
  //
  // abstract class Amount
  // case class Dollar(value: Double) extends Amount
  // case class Currency(value: Double, unit: String) extends Amount
  // case object Nothing extends Amount
  //
  // amt match {
  // case Dollar(v) => s"$$$v"
  // case Currency(_, u) => s"Oh noes, I got $u"
  // case Nothing => ""
  //}
  //
  // val price = amt.copy(value = 19.95) // Currency(19.95, "EUR")
  //
  // ИНФИКСНАЯ НОТАЦИЯ КЕЙС КЛАССОВ
  // Любой объект List может быть либо значением Nil, либо объектом case-класса ::,
  // объявленного как case class ::[E](head: B, tail: List[E]) extends List[E]
  // То есть можно записать lst match { case h :: t => ... }
  // То же, что и case ::(h, t), который вызовет ::.unapply(result)
  //
  // Если оператор заканчивается двоеточием, он является правоассоциативным. Например,
  // case first :: second :: rest означает case ::(first, ::(second, rest))
  //
  // Сопоставление с вложенными структурами стр245
  //
  //
  // Case-классы отлично подходят для работы со структурами, определение которых не изменяется.
  // Case-классы могут быть только листьями в дереве наследования.
  // Решение, когда все case классы наследуют запечатанный (sealed) класс или трейт, считается более предпочтительным.
  // Это так же позволяет компилятору проверить сопоставление с образцом на полноту.
  //
  // Иммитация перечислений
  // sealed abstract class TrafficLightColor
  // case object Red extends TrafficLightColor
  // case object Yellow extends TrafficLightColor
  // case object Green extends TrafficLightColor
  // color match {
  //  case Red => "stop"
  //  case Yellow => "hurry up"
  //  case Green => "go"
  // }
  // Или Enumeration
  //
  // Option. Создавая Option из значения, которое может быть null, можно использовать простую конструкцию Option(value).
  // В результате будет получено None, если значение равно null, и Some(value) в противном случае.
  //
  // Множество предложений case, заключенных в фигурные скобки, образует
  // частично определенную функцию (partial function) – функцию, которая может быть определена не для всех входных значений.
  // Такие функции являются экземплярами класса PartialFunction[A, B]. Этот класс имеет два метода: apply, вычисляющий
  // значение функции из сопоставления с образцом, и isDefinedAt, возвращающий true, если входное значение совпадает хотя
  // бы с одним образцом. val f: PartialFunction[Char, Int] = { case '+' => 1 ; case '-' => -1 }; f('+') // 1
  //
  // Метод lift преобразует PartialFunction[T, R] в обычную функцию, возвращающую значение типа Option[R].
  // Обратное преобразование функции, возвращающей Option[R], в частично определенную функцию можно произвести вызовом
  // Function1.unlift.
  //
  // Какой пиздец...


  // 1 чето не, 2 регулярка неправильная, мне лень
  val src = new File("C:\\Users\\k\\Desktop\\src_unzip");

  def readInSrc(dir: File): Unit = {
    for (file <- dir.listFiles()) file match {
      case d if d.isDirectory => {
        readInSrc(d)
      }
      case file => {
        val source = Source.fromFile(file)
        val lines = source.getLines()
        for (l <- lines) {
          if ("(case [^:]+:)".r.findFirstIn(l).isDefined || "^[/]{2}[ a-z]*[Ff]{1}alls thr".r.findFirstIn(l).isDefined)
            println(l)
        }
        source.close()
      }
    }
  }

  // 2
  def swap(tuple: (Int, Int)) = tuple match {
    case (x, y) => (y, x)
    case _ => throw new IllegalArgumentException()
  }

  // 3
  def swap2(arr: Array[Int]) = arr match {
    case Array(x, y, tail@_*) => Array(y, x) ++ tail
    case _ => arr
  }

  // 4
  abstract sealed class Item

  case class Article(description: String, price: Double) extends Item

  case class Bundle(description: String, discount: Double, items: Item*) extends Item

  case class Multiple(n: Int, item: Item) extends Item

  def price(it: Item): Double = it match {
    case Article(_, p) => p
    case Bundle(_, disc, its@_*) => its.map(price).sum - disc
    case Multiple(n, item) => n * price(item)
  }

  val ogurci = Article("Огурцы", 40)
  val yabloki = Article("Яблоки", 60)
  val bundle = Bundle("Яблоки и огурцы", 10, ogurci, yabloki)

  price(Multiple(10, Multiple(10, bundle)))


  // 5. Выводит сумму на каждом листе. Не нравятся инстансофы чета, мб можно нормально написать
  val tree = List(List(3, 8), 2, List(5))

  val leafSum: List[Any] => Int = {
    case h :: tail if h.isInstanceOf[Int] => h.asInstanceOf[Int] + leafSum(tail)
    case h :: tail if h.isInstanceOf[List[Int]] => h.asInstanceOf[List[Int]].sum + leafSum(tail)
    case Nil => 0
  }


  // 6.
  sealed abstract class BinaryTree
  case class Leaf(value: Int) extends BinaryTree
  case class Node(left: BinaryTree, right: BinaryTree) extends BinaryTree

  val leafSumBinary: BinaryTree => Int = {
    case Leaf(n) => n
    case Node(left, right) => leafSumBinary(left) + leafSumBinary(right)
  }

  leafSumBinary(Node(
    Node(Node(Leaf(3), Leaf(5)), Node(Leaf(2), Leaf(0))), Leaf(8)
    )
  )

  // 7.
  sealed abstract class Tree
  case class Leaf1(value: Int) extends Tree
  case class Node1(nodes: Tree*) extends Tree

  val leafSumTree: Tree => Int = {
    case Leaf1(n) => n
    case Node1(node, nodes @ _*) => leafSumTree(node) + sumTail(nodes.toList)
  }

  val sumTail: List[Tree] => Int = {
    case h :: tail => leafSumTree(h) + sumTail(tail)
    case Nil => 0
  }

  // println(leafSumTree(Node1(Node1(Leaf1(3), Leaf1(8)), Leaf1(2), Node1(Leaf1(5)))))


  // 9.
  val sum : List[Option[Int]] => Int = list => {
    var sum = 0;
    for (i <- list.indices) sum += list(i).getOrElse(0)
    sum
  }

  // println(sum(List(Some(12), None, Some(23), Some(0), None, None)))


  // 10.
  def compose(f: Double => Option[Double], g: Double => Option[Double]): Double => Option[Double] = {
    (x: Double) => g(x) match {
      case Some(y) => f(y)
      case None => None
    }
  }
}
