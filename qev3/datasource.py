from abc import ABC


class DataSource(ABC):
    pass


class Uart(DataSource):
    pass


class Udp(DataSource):
    pass
