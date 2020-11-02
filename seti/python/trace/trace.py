import re
from urllib.request import urlopen
from urllib.error import HTTPError
import sys
import subprocess

if __name__ == '__main__':
    print('№\tIP\t\tAS\t\tCountry and provider')
    tracert = subprocess.Popen(["tracert", sys.argv[1]], stdout=subprocess.PIPE)
    while True:
        line = tracert.stdout.readline()
        if not line:
            break
        data = re.search(re.compile(r'\s(\d+?)\s .+?(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}) ', flags=re.X)
                         , line.decode('windows-1251'))

        if data is not None:
            addr = data.groups()[1]
            n = data.groups()[0]
            answer = f'{n}\t{addr}'

            if not addr.startswith(('10.', '127.', '169.254.', '172.16.', '192.168.')):
                try:
                    with urlopen('http://www.nic.ru/whois/?query=' + addr) as page:
                        data = page.read().decode('utf-8')
                except HTTPError:
                    None

                AS = re.search(re.compile(r'AS(\d+)'), data)
                if AS is not None:
                    AS = AS.group(1)
                else:
                    AS = "-"

                country = re.search(re.compile(r'country:\s*(.+?)\n'), data)
                if country is not None:
                    country = country.group(1)
                else:
                    country = "-"

                provider = re.search(re.compile(r'descr:\s*(.+?)\n'), data)
                if provider is not None:
                    provider = provider.group(1)
                else:
                    provider = "-"

                answer += f'\t{AS}\t\t{country} {provider}'
            else:
                answer += f'\t-'

            print(answer)

        if re.search(re.compile(r'(\d*)\s*(\*)\s*(\*)\s*(\*)'), line.decode('windows-1251')):
            print('***')
            break
