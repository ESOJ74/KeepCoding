# MAL

class VehicleB(object):
    def __init__(self, name):
        self._name = name
        self._persistence = MySQLdb.connect()
        self._engine = Engine()

    def get_name(self):
        return self._name()

    def getEngineRPM(self):
        return self._engine.getRPM()

    def getMaxSpeed(self):
        return self._speed

    def print(self):
        return print('Vehicle: {}, Max Speed: {}, RMP: {}'.format(self._name, self._speed, self._engine.getRPM()))


# BIEN

class Vehicle(object):
    def __init__(self, name, engine):
        self._name = name
        self._engine = engine

    def get_name(self):
        return self._name()

    def getEngineRPM(self):
        return self._engine.getRPM()

    def getMaxSpeed(self):
        return self._speed

    def guardar_configuracion(self, datos):
        data = requests.get("http://www.datos.coches/{}".format(datos["id_coche"]))
        print("guardar datos")


class VehicleRepository(object):
    def __init__(self, vehicle, db):
        self._persistence = db
        self._vehicle = vehicle


class VehiclePrinter(object):
    def __init__(self, vehicle, db):
        self._persistence = db
        self._vehicle = vehicle

    def print(self):
        return print('Vehicle: {}, Max Speed: {}, RMP: {}'.format(self._vehicle.getName(), self._vehicle.getMaxSpeed(),
                                                                  self._vehicle.getRPM()))
