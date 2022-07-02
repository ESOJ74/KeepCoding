import time
import threading


def countdown(number):
    while number > 0:
        time.sleep(0.1)
        number -= 1


if __name__ == '__main__':
    start = time.time()

    count = 10

    t1 = threading.Thread(target=countdown, args=(count,))
    t2 = threading.Thread(target=countdown, args=(count,))

    t1.start()
    t2.start()

    t1.join()
    t2.join()

    print(f'Tiempo transcurrido {time.time() - start}')
