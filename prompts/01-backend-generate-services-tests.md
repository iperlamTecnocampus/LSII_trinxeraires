# <Short title>

**Approved on:** YYYY-MM-DD
**Approved by:** <team members / PR link>
**Used for:** Create Test to UserService and Video Service classes

## Prompt
Quiero que generes tests unitarios para las clases UserService y VideoService de mi proyecto Spring Boot.

Utiliza JUnit 5 y Mockito para probar los métodos de ambas clases, comprobando tanto los casos en los que funcionan correctamente como los posibles errores.

Asegúrate de:

Comprobar los resultados y las interacciones con los repositorios.
Probar qué ocurre cuando los usuarios o vídeos no existen.
Utilizar mocks para simular las dependencias.
Seguir buenas prácticas de testing y el patrón Arrange-Act-Assert.
Organizar los tests en las clases UserServiceTest y VideoServiceTest.
Proporcionar el código completo con los imports necesarios.
Identificar posibles errores en el código de los servicios que deban corregirse para que los tests funcionen correctamente.
Si necesitas ver otras clases del proyecto para generar tests correctos, indícame cuáles.

files:
model:
- User.java
- Video.java
services:
- UserService.java
- VideoService.java


## Notes

<optional: known limitations, follow-up edits usually needed, related PRs>
