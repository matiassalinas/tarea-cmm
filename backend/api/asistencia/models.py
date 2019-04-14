from jsonfield import JSONField
from django.db import models


class Estudiante(models.Model):
    nombre  =   models.CharField(max_length=200)
    asistencia  =   models.CharField(max_length=5, default="00000") # 1: asistencia, 0: inasistencia

class Curso(models.Model):
    nombre  =   models.CharField(max_length=200)
    estudiantes =   models.ManyToManyField(Estudiante)