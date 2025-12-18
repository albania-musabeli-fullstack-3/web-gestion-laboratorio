# GestionLab

Proyecto desarrollado con Angular versión 20.3.9. y standalone components para la **gestión de laboratorios y resultados de análisis de laboratorios.**

## Funcionalidades del Sitio web

- Creación de cuenta de usuario
- Inicio y cierre de sesión
- Recuperar contraseña
- Ver y editar perfil
- Agregar, editar y eliminar laboratorio
- Agregar, editar y eliminar resultado de análisis

## Dependencias

- Angular Material
- Bootstrap 5
- Luxon
- Sweet Alert
- Jasmine
- Karma (coverage)


## Ejecutar el proyecto

``` bash
npm run start
```

## Revisión de test unitarios y cobertura

``` bash
npm run test --code-coverage
```
<img width="1913" height="969" alt="FS3_gestionlab_coverage" src="https://github.com/user-attachments/assets/2250b519-4ce6-4402-b8a8-ea5b7035a84c" />


## SonarQube

Se utilizó sonarqube para revisión de código estático utizando su versión web conectado con el repositorio de Github.

<img width="1910" height="969" alt="FS3_gestionlab_sonar" src="https://github.com/user-attachments/assets/8bed4bb9-658a-4e5f-a0ca-defd842c81a5" />


## Capturas de pantalla sitio web

<img width="1913" height="969" alt="FS3_gestionlab_crearcuenta" src="https://github.com/user-attachments/assets/fe0daee3-6b8c-44dc-9ef0-e30114b3b472" />

<img width="1913" height="969" alt="FS3_front_recuppass1" src="https://github.com/user-attachments/assets/24aae5da-1c36-4e30-98f2-10cdc1e54ad5" />
<img width="1913" height="969" alt="FS3_front_recuppass2" src="https://github.com/user-attachments/assets/549f5943-6398-497a-a64b-4ba31a4ff302" />
<img width="1913" height="969" alt="FS3_front_gestionlab1" src="https://github.com/user-attachments/assets/7d8f0e98-2c0b-42e4-b944-24a0eb42e5d5" />
<img width="1913" height="969" alt="FS3_front_gestionlab2" src="https://github.com/user-attachments/assets/64696cf3-6aa6-4491-bea7-a6bacfc13363" />
<img width="1913" height="969" alt="FS3_front_gestionlab3" src="https://github.com/user-attachments/assets/2597309a-5d10-4b7f-95e1-694c1236170f" />
<img width="1895" height="962" alt="FS3_front_agregarlab" src="https://github.com/user-attachments/assets/eae04a22-0eea-4bdb-98f4-735114093a5e" />
<img width="1913" height="969" alt="FS3_front_gestionlab4" src="https://github.com/user-attachments/assets/d660598d-f946-4222-9ded-b19ebc1d9816" />
<img width="1895" height="962" alt="FS3_front_agregarresult" src="https://github.com/user-attachments/assets/9ce98663-5b61-4ab6-962f-645c159b2c8b" />
<img width="1913" height="969" alt="FS3_front_gestionlab5" src="https://github.com/user-attachments/assets/1adbeb3f-4946-442a-8322-39c5068f7ec1" />

## Evidencias de ejecución de microservicios en contenedores Docker

### API Usuarios

<img width="1920" height="1041" alt="fs3_docker_compose_api_usuarios" src="https://github.com/user-attachments/assets/8201caf7-624e-4049-b10b-eecda73d2588" />

### API Laboratorio/Resultado de Análisis

<img width="1920" height="1041" alt="fs3_docker_compose_api_lab" src="https://github.com/user-attachments/assets/7d851b0e-60a9-4a93-8637-26cbb40b4427" />

### API Insumos

<img width="1917" height="1044" alt="FS3_api_insumos_docker" src="https://github.com/user-attachments/assets/c5247920-dacf-4822-ac79-e2e94b0ce3d8" />


### Servidor NGINX Gestión Laboratorio (puerto 80)

<img width="1920" height="1074" alt="fs3_docker_compose_front" src="https://github.com/user-attachments/assets/d55c798b-36eb-4a05-9ee1-710825dabf27" />

<img width="1920" height="1074" alt="fs3_app_angular_nginx" src="https://github.com/user-attachments/assets/5db817e9-636e-4d02-9129-7efaad1d38cb" />




