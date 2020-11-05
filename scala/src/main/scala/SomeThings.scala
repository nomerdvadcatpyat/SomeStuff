import scala.annotation.tailrec

object SomeThings extends App{

  // Индекс первого нуля в листе
  def gerIndexOfZero(list: List[Int]): Int = {
    @tailrec
     def iter(list: List[Int], i: Int):Int = {
      list match {
        case Nil => -1;
        case 0 :: _ | 0 :: Nil => i;
        case _ :: tail => iter(tail, i + 1);
      }
    }
    iter(list, 0)
  }

  
}
