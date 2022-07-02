# MAL!!!!!!!!!!
class Engine(object):
    def __init__(self):
        pass

    def accelerate(self):
        pass

    def getRPM(self):
        currentRPM = 0
        # ...
        return currentRPM


class Vehicle(object):
    def __init__(self):
        self._engine = Engine()

    def getEngineRPM(self):
        return self._engine.getRPM()



class BaseEngine():
    pass

class EngineA(BaseEngine):
    pass

class EngineB(BaseEngine):
    pass

class EngineB_1(EngineB):
    pass

# BIEN:
class Vehicle2(object):
    def __init__(self, engine: BaseEngine):
        self._engine = engine

    def getEngineRPM(self):
        return self._engine.getRPM()



engineb_1 = EngineB_1()
vehiculo = Vehicle2(engine=engineb_1)
