def int_to_roman(num):
    val = [
        1000, 900, 500, 400,
        100, 90, 50, 40,
        10, 9, 5, 4,
        1
    ]
    syb = [
        "M", "CM", "D", "CD",
        "C", "XC", "L", "XL",
        "X", "IX", "V", "IV",
        "I"
    ]
    roman_num = ''
    i = 0
    while num > 0:
        for _ in range(num // val[i]):
            roman_num += syb[i]
            num -= val[i]
        i += 1
    return roman_num


def test_int_to_roman_num3():
    assert int_to_roman(3) == "III"


def test_int_to_roman_num4():
    assert int_to_roman(4) == "IV"


def test_int_to_roman_num5():
    assert int_to_roman(5) == "V"


if __name__ == "__main__":
    test_int_to_roman_num3()
    test_int_to_roman_num4()
    test_int_to_roman_num5()
