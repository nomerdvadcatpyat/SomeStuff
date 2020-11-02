package book.Ch10

object Ch10 extends App{
  // трейты. trait Logger {  def log(msg: String) // Абстрактный метод }. Не implements, а extends/with (подмешивание/примеси).
  // При переопределении абстрактного метода не требуется override.
  // Все интерфейсы жавы могут использоваться как трейты.
  // Трейт можно «подмешать» на этапе создания объекта: val acct = new SavingsAccount with ConsoleLogger
  // тут abstract class SavingsAccount extends Account with Logger; и trait ConsoleLogger extends Logger с определенным log

  // Многоуровневые трейты. В класс или в объект можно добавить несколько трейтов, которые будут вызывать друг друга, начиная с последнего.
  // В трейтах конструкция super.log имеет иной смысл, чем в классах. Конструкция super.log вызывает следующий трейт
  // в иерархии, поэтому фактически вызываемый метод зависит от порядка следования трейтов. В общем случае обработка трейтов начинается с конца.
  // val acct1 = new SavingsAccount with TimestampLogger with ShortLogger.
  // первым будет вызван метод log трейта ShortLogger, а он, в свою очередь, вызвовет super.log – метод log трейта TimestampLogger

  class Account {}

  trait Logger {
    def log(msg: String)
  }

  trait ConsoleLogger extends Logger {
    def log(msg: String) = {
      println(msg)
    }
  }

  trait ShortLogger extends ConsoleLogger {
    override def log(msg: String): Unit = {
      super.log { if(msg.length > 15) msg.substring(0,15) else msg }
    }
  }

  trait AddHelloLogger extends ConsoleLogger {
    override def log(msg: String): Unit = {
      super.log(s"Hello, World! $msg")
    }
  }

  val a = new Account with ShortLogger with AddHelloLogger
  a.log("aklsdjlasjdaks;dk;sdlal;sda") // вызывается сначала AddHelloLogger.log потом ShortLogger.log
  val b = new Account with AddHelloLogger with ShortLogger
  b.log("qsndkajsKJJKALSDNKJ DWPIOQJLKS") // сначала обрезается передаваемая строка шортлоггером, потом добавляется хэловорлд AddHelloLogger-ом

  // Переопределение абстрактных методов в трейтах - стр 153

  // В JVM класс может наследовать только один суперкласс, поэтому поля трейта не могут быть унаследованы тем же способом.
  // Поле из трейта просто добавляется в объект, реализующий этот трейт. (не как объект суперкласса)
  // Конкретные поля трейта можно считать «инструкциями по сборке» для класса, использующего этот трейт. Любые такие поля становятся полями класса.

  //Порядок конструирования трейтов
  // Как и классы, трейты могут иметь в своем теле конструкторы, выполняющие инициализацию полей и другие операции.
  // Эти инструкции выполняются на этапе конструирования объекта, подмешивающего трейт.
  // Конструкторы выполняются в следующем порядке:
  // 1. Первым вызывается конструктор суперкласса.
  // 2. Конструкторы трейта выполняются после конструктора суперкласса, но перед конструктором класса.
  // 3. Конструкторы нескольких трейтов вызываются в порядке слева направо.
  // 4. Внутри каждого трейта родительские трейты конструируются первыми.
  // 5. Если несколько трейтов имеет общего родителя, его конструирование второй раз не выполняется.
  // 6. После конструкторов всех трейтов вызывается конструктор подкласса.
  // пример стр 157

  // Трейты не могут иметь конструкторов с параметрами. Каждый трейт имеет единственный конструктор без параметров
  // val acct = new SavingsAccount with FileLogger("myapp.log") так нельзя
  // Допустим
  // trait FileLogger extends Logger {  val filename: String  val out = new PrintStream(filename)  def log(msg: String) { out.println(msg); out.flush() } }
  // val acct = new SavingsAccount with FileLogger {  val filename = "myapp.log" // Не работает } объясняю снизу
  // Проблема в порядке конструирования. Здесь создается анонимный подкласс SavingsAccount with FileLogger и его конструктор
  // инициализируется последним (то, что в фигурных скобках). До него будет вызван конструктор FileLogger, который выкинет ошибку,
  // тк filename не проинициализирован.
  // Решить это можно с помощью опережающего определения.
  // val acct = new { // Блок опережающего определения после new  val filename = "myapp.log" } with SavingsAccount with FileLogger
  // или в классе class SavingsAccount extends { // Опережающее определение после extends  val filename = "savings.log" } with Account with FileLogger {  ... // Реализация SavingsAccount }
  // Другой способ – использовать в конструкторе FileLogger ленивое значение out.

  // Трейты, наследующие классы
  // Трейты могут также наследовать классы. Такие классы становятся суперклассами для любых классов, куда подмешиваются подобные трейты.
  // Однако, если класс уже наследует совершенно посторонний класс, в него нельзя будет подмешать трейт.

  // Собственные типы. Когда трейт наследует класс, гарантируется, что этот класс будет суперклассом для любого класса,
  // подмешивающего трейт. Однако в Scala имеется альтернативный механизм, позволяющий обеспечить такую гарантию:
  // определение собственного типа (self types).
  // Когда трейт начинается с объявления " this: Type => " он сможет подмешиваться только в подклассы указанного типа Type.
  // Например, вместо trait LoggedException extends Exception with Logged {  def log() { log(getMessage()) } }
  // Написать так: trait LoggedException extends Logged {  this: Exception =>    def log() { log(getMessage()) } }
  //  трейт не наследует класса Exception. Он просто объявил собственный тип Exception.
  //  Это означает, что данный трейт может подмешиваться только в подклассы класса Exception.
  // В методах трейта можно вызывать любые методы собственного типа. Например, вызов getMessage() в методе log вполне допустим,
  // поскольку известно, что this имеет тип Exception.
  // Собственные типы можно использовать для обработки циклических зависимостей между трейтами. Такое может случиться, когда имеются два трейта, нуждающихся друг в друге.
  // Собственные типы могут также использоваться для определения
  // циклических структурных типов – типов, просто определяющих методы, которые должен иметь класс, без указания имени класса.
  // trait LoggedException extends Logged {  this: { def getMessage() : String } =>    def log() { log(getMessage()) } }
  // Этот трейт можно подмешивать в любые классы, имеющие метод getMessage
}
