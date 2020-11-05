package Ch7
import java.lang.System

object Ninth extends App {
  val name = System.getProperty("user.name")
  val pass = Console.in.readLine()
  if(pass.length < 6) Console.err.println("Слишком простой пароль") else Console.out.println(f"Здравствуйте, $name")
}
