import time


def countdown(number):
    while number > 0:
        number -= 1


if __name__ == '__main__':
    start = time.time()

    count = 10000000
    countdown(count)

    print(f'Tiempo transcurrido {time.time() - start}')
