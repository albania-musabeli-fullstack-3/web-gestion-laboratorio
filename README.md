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

<img width="1930" height="970" alt="01_iniciar_sesion" src="https://github.com/user-attachments/assets/feab3873-8d07-4341-854e-86d97fdab221" />
<img width="1914" height="971" alt="02_crear_cuenta" src="https://github.com/user-attachments/assets/3b9b2838-a6a6-4865-892d-560a23306f86" />
<img width="1914" height="971" alt="03_recuperar_pass" src="https://github.com/user-attachments/assets/4de7baba-975e-45b0-9f18-bd2d4b033c8b" />
<img width="1914" height="971" alt="04_recuperar_pass" src="https://github.com/user-attachments/assets/ce1ef78e-23f6-49d1-b6b2-86701e1db3e5" />
<img width="1914" height="971" alt="05_home" src="https://github.com/user-attachments/assets/87b96d6e-7eba-4d95-94b4-f124d42f3589" />
<img width="1914" height="971" alt="06_listar_lab" src="https://github.com/user-attachments/assets/eab2701e-54c6-4f06-99a1-33ac51e3ea9a" />
<img width="1914" height="971" alt="07_agregar_lab" src="https://github.com/user-attachments/assets/27b8b247-f641-46ad-9bbd-89abd331acf2" />
<img width="1914" height="971" alt="08_editar_lab" src="https://github.com/user-attachments/assets/bc1f34d3-36cb-48a3-88e2-0919ea5bc800" />
<img width="1914" height="971" alt="09_listar_result" src="https://github.com/user-attachments/assets/ce99e68e-da92-4cf5-b65d-bb28af29f8ac" />
<img width="1914" height="971" alt="10_agregar_result" src="https://github.com/user-attachments/assets/f536d5b2-87b6-402f-84a5-32bd546a064f" />
<img width="1914" height="971" alt="11_editar_result" src="https://github.com/user-attachments/assets/941d0847-df91-4e5c-9cbd-fb89fc487d8b" />
<img width="1914" height="971" alt="12_listar_insumo" src="https://github.com/user-attachments/assets/d7349dbd-e8fd-42dc-9ed0-89cf878f2c09" />
<img width="1914" height="971" alt="13_agregar_insumo" src="https://github.com/user-attachments/assets/e7b230ab-d78f-4f5b-80f4-43332daedb57" />
<img width="1914" height="971" alt="14_editar_insumo" src="https://github.com/user-attachments/assets/1eb8b1fd-8cb5-450e-9bfb-01ccedbe97be" />
<img width="1914" height="971" alt="15_perfil_usuario" src="https://github.com/user-attachments/assets/bb08c709-24e9-435e-9c6a-875609d9bd88" />
<img width="1914" height="971" alt="16_cerrar_sesion" src="https://github.com/user-attachments/assets/5b37b193-e4f4-4309-b927-91c85fda8c4f" />
<img width="1914" height="971" alt="17_sesion_cerrada" src="https://github.com/user-attachments/assets/a5f4c53b-ddbc-483a-b0f6-11c53e9311fe" />


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




