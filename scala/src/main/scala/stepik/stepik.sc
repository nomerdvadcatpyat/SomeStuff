val reg = "([a-z])+(_([a-z])+)*".r
val x = "" match {
  case reg() => print("asdasd")
}
