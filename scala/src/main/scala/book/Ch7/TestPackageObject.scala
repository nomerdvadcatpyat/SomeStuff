package Ch7


package object test {
  def hello(name: String) = print(f"Hello, $name")
  val someConst = 1234
}


package test {

  class SomeClass {
    def someFunc(num: Int) = num + 1
    def printConst = print(someConst)


  }
}
