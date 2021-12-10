SISTEMA DE INVENTARIO PARA EL LABORATORIO DE COMPUTO

1. Crear la estructura de carpetas
    1. carpeta raiz Inventario
    2. agregar las carpetas frontend y backend
    3. crear la carpeta src dentro de frontend
    4. crear el archivo index.html con encabezado inventario en src
    5. ejecutar npm init en la carpeta de frontend en una nueva terminal
    6. npm install -D live-server para ver en tiempo real los cambios
    7. agregar el comando start como live-server src --verbose
    8. ejecutar npm start

2. Diseñar la aplicacion web
    1. crear el style.css
    2. link stayle.css a index.html
    3. crear div.principal o inicio
    4. create header, main y el footer
    5. style html, body
    6. style grid-container, header, main y el footer

3. Crear pantalla de inicio estatica
    1. crear lista de altas pendientes ul.pendientes
    2. crear li
    3. crear div.pendiente
    4. agregar .pendiente-name
    5. style ul.pendientes y los divs internos
    6. duplicar 2 veces para mostrar 3 pendientes?

4. Render Dynamic Pantalla de inicio jefe encaegado
    1. crear data.js
    2. exportar un array con 6 pendientes
    3. crear la screens/PantallaInicio.js
    4. exportar la PantallaInicio como un objeto con el metodo render()
    5. implementar render()
    6. importar data.js
    7. retornar pendientes mapped to li dentro de un ul
    8. crear app.js
    9. link it to index.html como modulo
    10. dar un id al main para main_container
    11. crear la función router()
    12. dar main-container innerHTML a HomeScreen.render()
    13. dar evento load de ventana a la funcion router()

5. Construir Url Router
    1. crear rutas como route:screen objeto para pantalla inicio
    2. crear utils.js
    3. export parseRequestURL()
    4. dar url como hash address split by slash
    5. retornar resource, id and verb od url
    6. actualizar router()
    7. dar request como parseRequestURL()
    8. construir parseUrl y compara con routers
    9. si route eiste render it, else render Error404
    10. crear pantalla/Error404.js y render mensaje error

6. Crear Node.JS server
    1. run npm init in root SistemaInventarioLabComputo/Inventario folder
    2. npm install express
    3. create server.js
    4. add start command as node backend/server.js
    5. require express
    6. mode data.js from frontend to backend
    7. create route for /api/pendientes
    8. return pendientes in data.js
    9. run npm start

7. Cargar pendientes desde el backend
    1. Editar PatallaInicio.js
    2. hacer render async
    3. fetch pendientes from '/api/pendientes' in render()
    4. hacer router() asyn y llamar await PantallaInicio.render()
    5. usar cors en backend
    
//de aqui en adelante no aplicado
8. Add Webpack
    1. cd frontend
    2. npm install -D webpack webpack-cli webpack-dev-server
    3. npm uninstall live-server
    4. "start": "webpack-dev-server --mode development --watch-content-base --open"
    5. move index.html, style.css and imagenes to frontend folder
    6. renombrar app.js to index.js
    7. actualizar index.html
    8. agregar <script src="main.js"></script> before </body>
    9. npm start
    10. npm install axios
    11. change fetch to axios in PantallaInicio

9. Instalar Babel para ES6 Syntax
    1. npm install -D babel core, cli, node, present-env
    2. crear .babelrc y dar presets to @babel/preset-env
    3. npm install -D nodemon
    4. set start: nodemon --watch backend --exec babel-node backend/server.js
    5. convert require to import in server.js
    6. npm start

10. 

11. Instalar VSCode Extension
    1. JAvaScrip (ES6) code snippets
    2. ES7 React/Reduc/GraphQL/Reac-Native snippets
    3. Prettier - Code formatter
    4. HTML&LESS grammar injections
    5. CSS Peek

