import datetime
import requests
import sys


def get_answer(id, token):
    try:
        json_data = requests.get(
            f'https://api.vk.com/method/users.get?user_ids={id}&fields=city, last_seen,'
            f' counters&access_token={token}&v=5.107').json()
    except requests.ConnectionError as e:
        print("Ошибка соединения.")
        sys.exit(1)

    res = "Имя и фамилия: " + json_data["response"][0]["first_name"] + " " + json_data["response"][0]["last_name"]+"\n"
    res += "Был в сети: " + str(datetime.datetime.fromtimestamp(json_data["response"][0]["last_seen"]["time"])
                                .strftime('%d-%m-%Y %H:%M:%S')) + "\n"
    if "city" in json_data["response"][0]:
        res += "Город: " + json_data["response"][0]["city"]["title"] + "\n"
    res += "Количество друзей: " + str(json_data["response"][0]["counters"]["friends"]) + "\n"
    res += "Количество подписчиков: " + str(json_data["response"][0]["counters"]["followers"]) + "\n"


    return res


if __name__ == '__main__':
    id = sys.argv[1]
    with open("token.txt", "r", encoding="utf-8") as file:
        token = file.read()
    print(get_answer(id, token))
