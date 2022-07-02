class Target:
    def request(self) -> str:
        return "Target: The default target's behavior."


class Adaptee:
    def specific_request(self) -> str:
        return ".eetpadA eht fo roivaheb laicepS"


class Adapter(Target):
    def __init__(self, adaptee: Adaptee) -> None:
        self.adaptee = adaptee

    def request(self) -> str:
        return f"Adapter: (TRANSLATED) {self.adaptee.specific_request()[::-1]}"


if __name__ == "__main__":
    target = Target()

    adaptee = Adaptee()
    adapter = Adapter(adaptee)

    results = [target, adapter]
    for obj in results:
        print(obj.request())
