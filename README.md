Bot simple para crear reuniones en discord, genera roles con el nombre de la reunion para los usuarios que se unan al canal.
Necesita un .env con el siguiente contenido
DISCORD_TOKEN= token de app bot de discord
COMMAND_CHANNEL_ID= id del canal donde se escribirá el comando !reunion
ADMIN_ROLE_ID= id del rol de admin para que no se le agregue el rol de la reunion
Ejemplo:
!reunion Nombre de la Reunion
