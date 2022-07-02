class Duck:
    def fly(self):
        print("Duck flying")

class Sparrow:
    def fly(self):
        print("Sparrow flying")

class Whale:
    def swim(self):
        print("Whale swimming")

for animal in Duck(), Sparrow(), Whale():
    animal.fly()

"""Traceback (most recent call last):
  File "python-talentum/dia03_01/curso_09_solid_i.py", line 14, in <module>
    animal.fly()
AttributeError: 'Whale' object has no attribute 'fly'"""