def memoize_factorial(
    function_to_decorate, parametro1, parametro2, parametro3, parametro4
):
    """Mi función memoize hace X"""
    memory = {}

    def inner(num):
        if num not in memory:
            memory[num] = function_to_decorate(num)
        return memory[num]

    return inner


@memoize_factorial
def facto(num):
    print(f"calculando número {num}")
    if num == 1:
        return 1
    else:
        return num * facto(num - 1)


class Memoize:
    def __init__(self, fn):
        self.fn = fn
        self.memo = {}

    def __call__(self, *args):
        if args not in self.memo:
            self.memo[args] = self.fn(*args)
        return self.memo[args]


@Memoize
def facto2(num):
    print(f"calculando número {num}")
    if num == 1:
        return 1
    else:
        return num * facto(num - 1)


if __name__ == "__main__":
    print("Calculando factorial de 3")
    print(facto(3))  # -> 3 * 2 * 1
    print("Calculando factorial de 4")
    print(facto(4))  # -> 4 * 3 * 2 * 1
    print("Calculando factorial de 5")
    print(facto(5))  # -> 5 * 4 * 3 * 2 * 1
    print("Calculando factorial de 6")

    print(facto(6))  # -> 5 * 4 * 3 * 2 * 1
    print("Calculando factorial de 6")
    print(facto2(6))  # -> 5 * 4 * 3 * 2 * 1
    print("Calculando factorial de 6")
    print(facto2(6))  # -> 5 * 4 * 3 * 2 * 1
