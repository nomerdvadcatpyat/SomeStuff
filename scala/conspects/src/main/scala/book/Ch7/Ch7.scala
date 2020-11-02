package Ch7

import scala.jdk.CollectionConverters.MapHasAsScala

object Ch7 extends App {
  // Пакеты - нужны для управления именами в больших программах.
  // package a { package b { package c { ... } } }
  // Пакет может быть определен в нескольких файлах. Несколько пакетов могут быть определены в 1 файле.
  // Между каталогом местонахождения файла и именем пакета не обязательно должна быть прямая связь.
  // Все, что определено в родительском пакете, находится в области видимости дочернего пакета,
  // поэтому нет необходимости использовать полное квалифицированное имя. _root_ - корневой пакет.
  // Если объявление package содержит цепочку, например package com.horstmann.impatient, то такое объявление ограничивает
  // круг доступных членов пакетов (Члены пакетов com и com.horstmann здесь недоступны).
  // package в начале файла - на весь файл.
  // Пакет может содержать классы, объекты и трейты, но не определения функций или переменных.
  // Было бы лучше, если бы имелась возможность добавлять в пакеты вспомогательные функции или константы непосредственно
  // в пакет, а не в какой-то объект Utils. Объекты пакетов позволяют снять это ограничение.
  // Каждый пакет может иметь один объект пакета. Он объявляется в родительском пакете с тем же именем, что и дочерний пакет.
  // package-private как в джаве с помощью private[packageName] def ...

  // Импорт - позволяет определить короткие имена взамен длинных. Все члены пакета импортируются как packageName._ (или ClassName._)
  // Импортирование возможно в любом месте, область видимости - до конца блока.
  // Если нужно импортировать несколько имен из пакета: import java.awt.{Color, Font}
  // Синтаксис селекторов позволяет переименовывать импортируемые члены пакета: import java.util.{HashMap => JavaHashMap}
  // import java.util.{HashMap => _, _} Скорет HashMap, импортирует все остальное


  // 1 - в файле First
  // 2 - не понял
  // 6 и 7
  import java.util.{HashMap => JavaHash}
  def copyHash[K, V](javaHash: JavaHash[K, V]) = {
    import scala.collection.mutable.{HashMap => ScalaHash}
    val res = new ScalaHash[K, V]()
    for ((k, v) <- javaHash.asScala) res(k) = v
    res
  }
  // 9 в Ninth
  
}

// 3
package object random {
  private var int_next = 1
  private var double_next = 1.0

  def setSeed(seed: Int) = {
    int_next = seed; double_next = seed
  }

  def nextInt() = {
    int_next = scala.math.floorMod(int_next * 1664525 + 1013904223, math.pow(2, 32).toInt)
    int_next
  }

  // не нашел мод для даблов, похуй
}

