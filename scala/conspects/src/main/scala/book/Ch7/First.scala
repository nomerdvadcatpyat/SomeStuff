package com {
  package horstmann {

    class First {

    }

    package impatient {
      class First1 {
        val a = new First // можем создать объект, тк package написан не цепочкой и импортирует все по пути

      }
    }
  }
}



package com.horstmann.impatient {
  class First2 {
    val a = None // Не можем создать объект First из com.horstmann потому, что цепочка импортирует только из конечного пакета
  }
}

