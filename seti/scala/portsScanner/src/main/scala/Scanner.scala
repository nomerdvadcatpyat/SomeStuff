import java.net.{DatagramPacket, DatagramSocket, InetSocketAddress, PortUnreachableException, Socket}

object Scanner {
  def main(args: Array[String]): Unit = {
    val start = args(0).toInt
    val end = args(1).toInt
    val host = if (args.length == 3) args(2) else "127.0.0.1"

    (start to end).par.foreach(port => {
      var isOpen = true
      try {
        val socket = new Socket
        socket.connect(new InetSocketAddress(host, port), 200)
        socket.close()
      } catch {
        case _: Throwable => {
          try {
            val bytes = new Array[Byte](128)
            val ds = new DatagramSocket
            var dp = new DatagramPacket(bytes, bytes.length)
            ds.setSoTimeout(100)
            ds.connect(new InetSocketAddress(host, port))
            ds.send(dp)
            ds.isConnected
            dp = new DatagramPacket(bytes, bytes.length)
            ds.receive(dp)
            ds.close()
          } catch {
            case _: PortUnreachableException =>
              isOpen = false
            case _: Throwable =>
          }
        }
      } finally {
        if (isOpen) println(port + " is open")
      }
    })
  }
}
