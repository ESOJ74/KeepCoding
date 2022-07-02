from datetime import datetime
from time import sleep


class SingletonMeta(type):
    _instance = None

    def __call__(cls):
        if cls._instance is None:
            cls._instance = super().__call__()
        return cls._instance


class Singleton(metaclass=SingletonMeta):
    def some_business_logic(self):
        pass


class TimeSingleton(metaclass=SingletonMeta):
    def __init__(self):
        self.now_cls = datetime.utcnow()

    def now_method(self):
        return datetime.utcnow()


if __name__ == "__main__":
    s1 = Singleton()
    s2 = Singleton()

    if id(s1) == id(s2) and s1 is s2:
        print("Son la misma instancia.")
    else:
        print("Algo aquí va mal...")

    print("\n\n")
    s3 = TimeSingleton()
    print(s3.now_cls)
    print(s3.now_method())

    print("Esperando 3 segundos... \n")
    sleep(3)

    s4 = TimeSingleton()
    print(s4.now_cls)
    print(s4.now_method())
