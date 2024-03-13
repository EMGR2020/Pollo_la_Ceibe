const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Configuración de la conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'AX7dTwrAGIoqgI0TpLS',
  database: 'sistemadeventas'
});

// Conexión a la base de datos MySQL
db.connect((err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos MySQL establecida');
});

// Middleware para analizar solicitudes de formulario
app.use(express.urlencoded({ extended: true }));

// Middleware para servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para servir el archivo index.html en la raíz del servidor
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para manejar el envío del formulario de inicio de sesión
app.post('/login', (req, res) => {
    const { usuario, contraseña } = req.body;
  
    // Consultar la base de datos para verificar el usuario y la contraseña
    const sql = 'SELECT * FROM usercontrol WHERE username = ? AND password = ?';
    db.query(sql, [usuario, contraseña], (err, results) => {
      if (err) {
        console.error('Error al consultar la base de datos:', err);
        // Mostrar una alerta de error utilizando SweetAlert2
        res.send('<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script><script>Swal.fire({ icon: "error", title: "Oops...", text: "Hubo un error al procesar su solicitud. Por favor, inténtelo de nuevo más tarde.", customClass: { confirmButton: "btn-sweetalert" } });</script>');
        return;
      }
  
      if (results.length > 0) {
        // Mostrar una alerta de éxito utilizando SweetAlert2
        res.send('<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script><script>Swal.fire({ icon: "success", title: "¡Inicio de sesión exitoso!", showConfirmButton: false, customClass: { confirmButton: "btn-sweetalert" } }); setTimeout(function(){ window.location="/home.html"; }, 3000);</script>');

        // Registrar evento de inicio de sesión exitoso en un archivo de texto
        const logMessage = `Inicio de sesión exitoso - Usuario '${usuario}' - ${new Date().toLocaleString()}\n`;
        fs.appendFile('log.txt', logMessage, (err) => {
          if (err) {
            console.error('Error al registrar el evento de inicio de sesión exitoso:', err);
          } else {
            console.log('Evento de inicio de sesión exitoso registrado con éxito');
          }
        });
      } else {
        // Mostrar una alerta de error utilizando SweetAlert2
        res.send('<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script><script>Swal.fire({ icon: "error", title: "Oops...", text: "Nombre de usuario o contraseña incorrectos. Por favor, inténtelo de nuevo.", customClass: { confirmButton: "btn-sweetalert" } });</script>');

        // Registrar evento de inicio de sesión fallido en un archivo de texto
        const logMessage = `Intento de inicio de sesión fallido - Usuario '${usuario}' - ${new Date().toLocaleString()}\n`;
        fs.appendFile('log.txt', logMessage, (err) => {
          if (err) {
            console.error('Error al registrar el evento de inicio de sesión fallido:', err);
          } else {
            console.log('Evento de inicio de sesión fallido registrado con éxito');
          }
        });
      }
    });
  });
  
// Ruta para manejar la entrada al inventario
app.post('/entrada-inventario', (req, res) => {
    // Registrar la entrada en el archivo de registro
    const logMessage = `Entrada al inventario - ${new Date().toLocaleString()}\n`;
    fs.appendFile('log.txt', logMessage, (err) => {
        if (err) {
            console.error('Error al registrar entrada al inventario:', err);
            res.status(500).send('Error al registrar entrada al inventario');
        } else {
            console.log('Entrada al inventario registrada con éxito');
            res.status(200).send('Entrada al inventario registrada con éxito');
        }
    });
});

// Manejador de errores para rutas no encontradas
app.use((req, res, next) => {
  res.status(404).send("Lo siento, no se encontró lo que estabas buscando.");
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
