🤖 Bot de Reuniones para Discord

Este bot simple permite crear reuniones en Discord de manera automática:

Crea una categoría y canales (texto y voz) por reunión.

Genera un rol con el nombre de la reunión para los usuarios que se unan al canal de voz.

Los administradores no reciben automáticamente el rol.

⚙️ Configuración

Crea un archivo .env en la raíz del proyecto con el siguiente contenido:

DISCORD_TOKEN=tu_token_del_bot          # Token del bot de Discord
COMMAND_CHANNEL_ID=ID_DEL_CANAL_DE_COMANDOS  # Canal donde se escribirá el comando !reunion
ADMIN_ROLE_ID=ID_DEL_ROL_ADMIN          # Rol de admin para que no se agregue automáticamente


🚀 Uso

En el canal de texto configurado (COMMAND_CHANNEL_ID), escribe el comando:

!reunion Nombre de la Reunion


Ejemplo:

!reunion Reunión Cliente Perez


El bot realizará automáticamente:

Crear la categoría Nombre de la Reunion.

Crear un canal de texto y un canal de voz dentro de la categoría.

Crear (si no existe) un rol llamado Nombre de la Reunion.

Asignar automáticamente el rol a todos los usuarios que entren al canal de voz, excepto los administradores.
