from socket import *
import time
import pickle

record_cache = {}


class CachedRecord:
    def __init__(self, t, content, ttl):
        self._content = content
        self._content_length = len(content) // 2
        self.ttl = int(ttl, base=16)
        self._t = t
        self.start_time = int(round(time.time()))

    def get_data(self):
        return "c000" + self._t + "0000" + \
               (hex(self.start_time + self.ttl - int(round(time.time())))[2:]).rjust(8, '0') + \
               (hex(self._content_length)[2:]).rjust(4, '0') + self._content, \
               self.ttl


def update_cache():
    cur_seconds = int(round(time.time()))
    for key, value in record_cache.items():
        for r in value:
            if cur_seconds + r.ttl <= cur_seconds:
                del r
        if len(value) == 0:
            del record_cache[key]

    with open("record_cache", "wb") as file:
        pickle.dump(record_cache, file)


def get_answer(query):
    header = query[0:24]
    question = query[24:]

    name, _ = parse_name(query, 24)
    type = question[-8: -4]

    if (name, type) in record_cache:

        data = ''
        record_count = 0
        for record in record_cache[(name, type)]:
            record_data, ttl = record.get_data()

            cur_seconds = int(round(time.time()))
            if record.start_time + ttl > cur_seconds:
                record_count = record_count + 1
                data += record_data

        if record_count != 0:
            return header[0:12] + (hex(record_count)[2:]).rjust(4, '0') + header[16:20] \
                   + header[20:24] + question + data

    s = socket(AF_INET, SOCK_DGRAM)
    try:
        s.sendto(bytes.fromhex(query.replace("\n", "").replace(" ", "")), ("195.19.220.238", 53))
        answer, _ = s.recvfrom(512)

    except:
        return None
    finally:
        s.close()

    return parse_answer(answer.hex())


def parse_answer(response):
    header = response[0:24]
    question = response[24:]
    name, shift = parse_name(response, 24)
    type = question[shift - 8: shift - 4]

    quest_length = (len(name) - name.count(".")) * 2 + (name.count(".") + 2) * 2
    ans = response[24 + quest_length + 8:]

    remains = ans
    for c in [int(header[12:16], base=16),  # answers count
              int(header[16:20], base=16),  # ns count
              int(header[20:24], base=16)]:  # ar count
        res = []
        last_name = name
        new_name = name

        for i in range(c):
            index = response.index(remains)
            new_name, _ = parse_name(response, int(str(bin(int(response[index:index + 4], base=16)))[4:], base=2) * 2)

            ttl = remains[12:20]
            type = remains[4:8]
            content_length = int(remains[20:24], base=16) * 2
            content = remains[24:24 + content_length]

            ref = str(bin(int(content[-4:], 16)))
            if ref[2:4] == "11" and content[-2:] != "00" and type == "0002":
                ref = int(ref[4:], 2) * 2
                _, shift = parse_name(response[ref:], 0)
                content = content[:-4] + response[ref:ref + shift] + "00"

            ans = CachedRecord(type, content, ttl)
            remains = remains[24 + content_length:]

            if new_name == last_name:
                res.append(ans)
            else:
                record_cache[(new_name, type)] = [ans]
                res = []

            last_name = new_name

        if len(res) != 0:
            record_cache[(new_name, type)] = res

    with open("record_cache", "wb") as file:
        pickle.dump(record_cache, file)

    return response


def parse_name(request, start_idx):
    shift = 0
    res = []

    while True:
        idx = start_idx + shift
        two_bytes = bin(int(request[idx:idx + 4], base=16))[2:]

        if len(two_bytes) == 16 and two_bytes[:2] == '11':
            remains, shift = parse_name(request, int(two_bytes[2:], base=2) * 2)
            res.append(remains + ".")
            break

        if two_bytes[0:len(two_bytes) - 8] != '':
            length = int(two_bytes[0:len(two_bytes) - 8], base=2)
        else:
            break

        i = 2
        while i <= 2 * length:
            res.append(chr(int(request[idx + i:idx + i + 2], base=16)))
            i += 2

        shift += length * 2 + 2
        res.append(".")

    res = "".join(res[:-1])
    return res, shift


if __name__ == '__main__':
    address = ('127.0.0.1', 53)
    sock = socket(AF_INET, SOCK_DGRAM)
    sock.bind(address)

    try:
        with open("record_cache", "rb") as file:
            record_cache = pickle.load(file)
    except:
        print("Нет файла с кэшем.")

    while True:
        update_cache()
        data, address = sock.recvfrom(512)
        data = data.hex()
        answer = get_answer(data)

        if answer is not None:
            sock.sendto(bytes.fromhex(answer), address)
