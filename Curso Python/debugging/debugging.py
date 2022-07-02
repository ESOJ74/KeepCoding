import logging

logging.basicConfig()

logger = logging.getLogger()

logger.setLevel(logging.DEBUG)

def suma(a, b):
    return a + b


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
    #import ipdb; ipdb.set_trace()
    while num > 0:
        for _ in range(num // val[i]):
            logger.debug("num vale {}".format(num))
            roman_num += syb[i]
            num -= val[i]
        i += 1

    logger.info("num vale {}".format(num))
    return roman_num


print(int_to_roman(4000))
