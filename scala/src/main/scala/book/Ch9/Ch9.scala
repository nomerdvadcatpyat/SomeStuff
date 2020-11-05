package book.Ch9

object Ch9 {
  // Файлы и регулярные выражения
  // Прочитать все строки из файла можно с помощью метода getLines объекта scala.io.Source
  // Читать посимвольно - просто по объекту source
  // После использования не забыть close.
  // Разбитие на лексемы val tokens = source.mkString.split("\\s+")
  // для обработки файлов, содержащих смесь из текста и чисел, всегда можно использовать класс java.util.Scanner.
  // Source ак же может читать из url, string, stdin
  // Чтение байт с помощью жавы val file = new File(filename) val in = new FileInputStream(file) val bytes = new Array[Byte](file.length.toInt) in.read(bytes) in.close()
  // Запись в файлы java.io.PrintWriter: val out = new PrintWriter("numbers.txt") for (i <- 1 to 100) out.println(i) out.close()
  // Обход каталогов Простейшее решение заключается в использовании методов Files. list и Files.walk из пакета java.nio.file package.
  // Метод list выполняет обход только файлов в каталоге, а метод walk – всех файлов во всех подкаталогах.

  // РЕГУЛЯРКИ.
  // Создать объект Regex можно с помощью метода r класса String: val numPattern = "[0-9]+".r
  // Если регулярное выражение содержит обратные слеши или кавычки, можно воспользоваться синтаксисом неинтерпретируемых
  // строк, """...""". Например: val wsnumwsPattern = """\s+[0-9]+\s+""".r
  // Читается проще, чем "\\s+[0-9]+\\s+".r
  //
  // Метод findAllIn возвращает итератор, выполняющий обход всех совпадений. Его можно использовать в цикле for:
  // for (matchString <- numPattern.findAllIn("99 bottles, 98 bottles")) println(matchString)
  //
  // val numPattern = "[0-9]+".r
  // numPattern.replaceFirstIn("99 bottles, 98 bottles", "XX") // "XX bottles, 98 bottles"
  // numPattern.replaceAllIn("99 bottles, 98 bottles", "XX") // "XX bottles, XX bottles"
  // numPattern.replaceSomeIn("99 bottles, 98 bottles",
  // m => if (m.matched.toInt % 2 == 0) Some("XX") else None)
  // "99 bottles, XX bottles"
  //
  // Группы регулярок. val numitemPattern = "([0-9]+) ([a-z]+)".r
  // m.matched вернет полную строку совпадения, а m.group(i) – i-ю группу. Начальный и конечный индексы найденных
  // подстрок в оригинальной строке можно определить как m.start, m.end, m.start(i) и m.end(i).
  // for (m <- numitemPattern.findAllMatchIn("99 bottles, 98 bottles"))
  // println(m.group(1)) // 99 98
  // Имена групп: "([0-9]+) ([a-z]+)".r("num", "item")

  // Управление процессами:
  // scala. sys.process
  // Пакет scala.sys.process содержит неявное преобразование строк в объекты ProcessBuilder.
  // Оператор ! выполняет объект ProcessBuilder. Результатом вызова метода ! является код завершения программы:
  // 0 – если программа завершилась благополучно; ненулевое значение – в случае ошибки.
  // Если вместо ! использовать !!, будет возвращен вывод программы в виде строки
  // С помощью оператора #| можно перенаправить вывод одной программы на ввод другой (pipe): ("ls -al /" #| "grep u").!
  // #> #< #>>; Можно также реализовать ввод из URL: ("grep Scala" #< new URL("http://horstmann.com/index.html")).!
  // Объединять процессы можно с помощью p #&& q (выполнить q, если p выполнился успешно)
  // и p #|| q (выполнить q, если p завершился неудачей).
  // Если потребуется воспользоваться библиотекой process в другом каталоге или с другими значениями переменных окружения,
  // создайте объект ProcessBuilder с помощью метода apply объекта Process. Укажите команду, начальный каталог и последовательность (имя, значение) пар переменных окружения:
  //  val p = Process(cmd, new File(dirName), ("LANG", "en_US"))
  //  Затем вызовите метод !:
  //    ("echo 42" #| p).!

  
}
