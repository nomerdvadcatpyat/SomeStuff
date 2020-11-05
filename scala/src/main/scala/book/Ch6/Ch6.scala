package Ch6

object Ch6 extends App {

  // Объекты = синглтоны. Конструктор вызывается при первом обращении.
  // Не может иметь конструктор с параметрами
  // Конструкция object в языке Scala используется в тех же случаях, что и объекты-одиночки (singleton object) в Java:
  //  1) в качестве централизованного хранилища вспомогательных функций и/или констант;
  //  2) когда эффективно можно использовать только один экземпляр;
  //  3) когда для координации некоторой службы должен существовать только один экземпляр («Singleton»).

  // Объекты-компаньоны классов - все статическое. Имя такое же как и у класса-компаньона. Должны быть в 1 файле с кодом.
  // Обращение к методам через имя оъекта (val id = Account.newUniqueNumber(), где Account - о-к). к-к и о-к могут
  // вызывать приватные методы друг друга

  // Метод apply - вызывается как Object(arg1...argN), обычно возвращает экземпляр класса-компаньона.

  // Объект - приложение. Вместо def main можно использовать object Obj extends App {...}. В чем прикол не понятно.

  // Перечисления. В отличие от джавы нет Enum-ов, здесь нужно создать объект, унаследовать от Enumeration и инициализировать
  // значения перечисления вызовом метода Value (можно так же передавать в Value строковое имя или числовое значение (id))
  object Color extends Enumeration {
    val Red, Green, Yellow = Value
    val Orange = Value(9, "sd")
  }


  // 1
  object Conversions {
    def inchesToCentimeters(inches: Int) = {
      inches * 2.54
    }

    def gallonsToLiters(gallons: Int) = {
      gallons * 3.78
    }

    def milesToKilometers(miles: Int) = {
      miles * 1.6
    }
  }

  // 2
  abstract class UnitConversion {
    def convert(value: Double): Double
  }

  object GallowsToLiters extends UnitConversion {
    override def convert(gallows: Double) = gallows * 3.78
  }

  object InchesToCentimeters extends UnitConversion {
    override def convert(inches: Double): Double = inches * 2.54
  }

  object MilesToKilometers extends UnitConversion {
    override def convert(miles: Double): Double = miles * 1.6
  }

  // 3
  object Origin extends java.awt.Point // не лучшая наверн потому что обжект это синглтон, а поинт должен быть классом

  // 4
  class Point private(x: Double, y: Double) {
    def print = println(x, y)
  }

  object Point {
    def apply(x: Double, y: Double): Point = new Point(x, y)
  }

  // 5 БЛЯТЬ НИХУЯ Я НЕ разобрался с этой сбт шелл и вообще как из консольки работать со скалой
  // оставлю вкладки потом посмотрю обязательно https://www.jetbrains.com/help/idea/sbt-support.html
  // https://habr.com/ru/post/231971/ https://www.yandex.ru/search/?clid=2186621&text=sbt%20shell&rdrnd=272084&lr=54&redircnt=1601122663.1
  // :)
  object Reverse extends App {
    if(args.length != 0)
      for (arg <- args.reverse) print(arg + " ")
  }

  // 6
  object Suits extends Enumeration {
    val club = Value("♣")
    val spade = Value("♠")
    val diamond = Value("♦")
    val heart = Value("♥")
  }

  // 7
  def isRedSuit(suit: Suits.Value) = {
    if (suit == Suits.diamond || suit == Suits.heart) true
    else false
  }

  // 8 влом

}
