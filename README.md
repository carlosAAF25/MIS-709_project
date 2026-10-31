# Proyecto Final: Sistema de Gestión de Tareas (Node.js + PostgreSQL + Kubernetes)

Este proyecto implementa una API RESTful para la gestión de tareas con una interfaz web estática. La arquitectura está contenedorizada con Docker y orquestada localmente mediante Kubernetes, garantizando alta disponibilidad y persistencia de datos.

## Arquitectura y Tecnologías
- **Backend/Frontend:** Node.js con Express (sirve la API y los archivos estáticos HTML/JS/CSS).
- **Base de Datos:** PostgreSQL 15.
- **Contenedorización:** Docker (Dockerfile multi-etapa).
- **Orquestación:** Docker Compose (Fase de desarrollo) y Kubernetes (Fase de producción local).

## Requisitos Previos
- Docker Desktop instalado.
- Kubernetes habilitado en Docker Desktop.
- Git Bash o terminal compatible.

## Fase 1: Despliegue con Docker Compose
Este entorno utiliza una red interna puente y un volumen nombrado para la base de datos.

1. Construir e iniciar los servicios:
   docker-compose up -d --build
2. Acceder a la interfaz web: `http://localhost:3000`
3. **Prueba de persistencia (Actividad 3):**
   - Registrar tareas en la interfaz.
   - Destruir el entorno: `docker-compose down`
   - Recrear el entorno: `docker-compose up -d`
   - Verificar en el navegador que los datos permanecen intactos.

## Fase 2: Despliegue en Kubernetes
El despliegue en K8s utiliza un enfoque declarativo (manifiestos YAML) incluyendo ConfigMaps, Secrets, PVCs, Deployments y Services.
1. Construir la imagen localmente:
   docker build -t api-tareas-local:v1 .

2. Aplicar los manifiestos de infraestructura:
   kubectl apply -f k8s/

3. Verificar el estado de los Pods (esperar a estado `Running`):
   kubectl get pods

4. Exponer el servicio para acceso local:
   kubectl port-forward svc/api-service 3000:3000

##  Prueba de Tolerancia a Fallos (Actividad 5)
Para demostrar la capacidad de auto-recuperación de Kubernetes (Reconciliación):
1. Con la aplicación en ejecución y tareas registradas, simular la caída del nodo API:
   kubectl delete pod -l app=api-node

2. Observar la creación inmediata del nuevo Pod:
   kubectl get pods

3. Reconectar el puerto (`kubectl port-forward svc/api-service 3000:3000`) y recargar la interfaz para verificar que el servicio se restableció sin pérdida de datos gracias al `PersistentVolumeClaim`.