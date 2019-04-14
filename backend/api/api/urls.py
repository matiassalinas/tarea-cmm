
"""api URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from django.conf.urls import url, include
from django.contrib.auth.models import User
from django.http import HttpResponse
from rest_framework import routers, serializers, viewsets, status
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt
import json

from asistencia.models import *


class EstudianteSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Estudiante
        fields = ('id', 'nombre', 'asistencia',)

class CursoSerializer(serializers.HyperlinkedModelSerializer):
    estudiantes = EstudianteSerializer(read_only = True, many=True)
    class Meta:
        model = Curso
        fields = ('id', 'nombre', 'estudiantes',)

class CursoViewSet(viewsets.ModelViewSet):
    queryset = Curso.objects.all()
    serializer_class = CursoSerializer

@csrf_exempt
def ActualizarCurso(request):
    if request.method == "POST":
        id_estudiante = request.POST.get('id_estudiante', None)
        asistencia = request.POST.get('asistencia', None)
        estudiante = Estudiante.objects.get(id=id_estudiante)
        estudiante.asistencia = asistencia
        estudiante.save()
    return HttpResponse('')

@csrf_exempt
def CrearCurso(request):
    if request.method == "POST":
        nombre_curso = request.POST.get('nombre_curso', None)
        estudiantes = request.POST.get('estudiantes', None)
        estudiantes = estudiantes.split("\n")
        curso = Curso(nombre=nombre_curso)
        curso.save()
        for e in estudiantes:
            if e != "":
                nuevo_estudiante = Estudiante(nombre=e)
                nuevo_estudiante.save()
                curso.estudiantes.add(nuevo_estudiante)
    return HttpResponse('')


router = routers.DefaultRouter()
router.register(r'cursos', CursoViewSet)

urlpatterns = [
    path('asistencia/', include('asistencia.urls')),
    path('admin/', admin.site.urls),
    url(r'^', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url('actualizar', ActualizarCurso),
    url('crear', CrearCurso),
]
