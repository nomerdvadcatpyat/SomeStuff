package Ch5

import scala.beans.BeanProperty
import scala.collection.mutable.ArrayBuffer

object Ch5 {
  def main(args: Array[String]): Unit = {
    // Внутренние классы: В Scala каждый экземпляр получит собственный класс Member, точно так же,
    // как каждый экземпляр получит собственное поле members. То есть chatter.Member и myFace.Member – это разные классы.
    //     val chatter = new Network
    //     val myFace = new Network
    //     val c = new chatter.Member("Chatter")
    //     val mF = new myFace.Member("MyFace")
    //     c.hello(mF) ошибка, ожидался chatter.Member пришел myFace.Member
    // Если это не устраивает, то можно 1) объявить Member в объекте-компаньоне
    // 2) Использовать проекцию типов (type projection) Network#Member,
    // которая означает: «член (Member) любой группы (Network)» (val contacts = new ArrayBuffer[Network#Member])
  }

  def summary = {
    // При вызове методов без параметров (как данный) скобки можно опустить:
    // myCounter.current // OK
    // myCounter.current() // Тоже OK
    // Какую форму использовать?
    // Хорошим стилем считается исполь-зовать () при вызове методов-мутаторов (mutator, изменяющих состояние объекта)
    // и опускать их при вызове методов-акцессоров(accessor, не изменяющих состояния объекта).

    // Итак, на выбор имеются четыре варианта реализации свойств:
    // 1) var foo: Scala синтезирует методы чтения и записи;
    // 2) val foo: Scala синтезирует только метод чтения;
    // 3) вы определяете методы foo и foo_=;
    // 4) вы определяете метод foo

    // @BeanProperty var name: String = _ // создаст свойство с 4 методами (name name_= и getName setName для взаимодействия
    // с компонентами JavaBeans)

    // Класс имеет главный конструктор (primary) и любое кол-во дополнительных (auxiliary)
    // Дополнительные конструкторы: 1) называются this (def this(name: String)); 2) ДОЛЖЕН начинаться вызовом доп конструктора,
    // объявленного выше или главного конструктора
    // Главный конструктор: 1) вплетается в имя класса (class Person((private var/val) name: String, age: Int)),
    // аргументы => поля; 2) Главный конструктор выполняет все инструкции в определении класса.
    // Можно избавиться от дополнительных конструкторов, определяя аргументы по умолчанию в главном конструкторе
    // Главный приватный конструктор: class Person private(val id: Int) { ... }

  }
}

class Counter {
  private var value = 0

  def increment() = {
    value += 1
  }

  def current = value

  def isLess(other: Counter) = value < other.value

  // имеет доступ к приватному полю другого объекта

  // Scala позволяет еще больше ограничивать доступ с помощью квалификатора private[this]:
  // private[this] var value = 0
  // Обращение someObject.value недопустимо
  // Теперь методы класса Counter смогут обращаться только к полю value текущего объекта, но не других объектов типа Counter.
  // Для приватных полей объекта методы доступа не генерируются вообще.
  // Scala позволяет определять права доступа к отдельным классам.
  // Квалификатор private[ClassName] определяет, что только методы этого класса имеют право доступа к данному полю.
  // Здесь ClassName должно быть именем определяемого или внешнего класса.
}

class Person {
  // Scala сгенерирует класс для JVM с приватным полем age и методами доступа (чтения и записи)
  // var age = 0
  // В Scala методы чтения и записи получат имена age и age_=
  // println(fred.age) // Вызовет метод fred.age()
  // fred.age = 21 // Вызовет метод fred.age_=(21)
  // Переопределить методы чтения и записи можно в любой момент.
  private var private_age = 0

  def age = private_age

  def age_=(value: Int) = {
    if (private_age < value)
      private_age = value
  }
}

class Network {

  class Member(val name: String) {
    val contacts = new ArrayBuffer[Member]

    def hello(oth: Member): Unit = {
      println(f"hello, ${oth.name}")
    }
  }

  private val members = new ArrayBuffer[Member]

  def join(name: String) = {
    val m = new Member(name)
    members += m
    m
  }
}


// 1
class CounterEx1 {
  private var value = 0

  def increment() = {
    if (value != Int.MaxValue) value += 1
  }

  def current = value

  def isLess(other: CounterEx1) = value < other.value
}

// 2
class BankAccount() {
  private var _balance = 0

  def balance = _balance

  def deposit(money: Int) = {
    _balance += money
  }

  def withdraw(money: Int) = {
    _balance -= money
  }
}

// 3
class Time(hrs: Short, min: Short) {
  private val (_hrs, _min) = if (hrs > 0 && hrs < 24 && min > 0 && min < 60) (hrs, min) else throw new IllegalArgumentException

  def before(other: Time) = {
    if (this._hrs < other._hrs || (this._hrs == other._hrs && this._min < other._min)) true
    else false
  }
}

// 4
class Time1(hrs: Short, min: Short) {
  val _minutes = hrs * 60 + min

  def before(other: Time1) = {
    if (this._minutes < other._minutes) true
    else false
  }
}

// 5
class Student(@BeanProperty var name: String, @BeanProperty var id: Long) {

}

// 6
class Person1(age: Int) {
  private var _age = 0
  if (age < 0) _age = 0

  def age_=(value: Int): Unit = {
    if (_age < value)
      _age = value
  }

  def age() = _age
}

// 7
class Person2(firstLastName: String) {
  val firstName = firstLastName.split(' ')(0)
  val lastName = firstLastName.split(' ')(1)
  // Если параметр без val или var используется внутри хотя бы одного метода, он становится полем. (приват и неизм)
  // В противном случае параметр не преобразуется в поле. Он интерпретируется как обычный параметр, доступный только в теле главного конструктора.
}

// 8
class Car(val manufacturer: String, val model: String, val year: Int, var regNum: String) {
  private var something = ""

  def this(manufacturer: String, model: String) {
    this(manufacturer, model, -1, "")
  }

  def this(manufacturer: String, model: String, year: Int) {
    this(manufacturer, model, year, "")
  }

  def this(manufacturer: String, model: String, regNum: String) {
    this(manufacturer, model, -1, regNum)
  }

  def this(manufacturer: String, model: String, year: Int, regNum: String, smth: String) {
    this(manufacturer, model, year, regNum)
    something = smth
  }
}

// 10
class Employee() {
  val name: String = "John Q. Public"
  var salary: Double = 0.0
}