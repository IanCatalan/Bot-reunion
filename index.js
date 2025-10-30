import { Client, GatewayIntentBits, PermissionsBitField } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once("ready", () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
});

// --- EVENTO: cuando un nuevo usuario se une al servidor ---
client.on("guildMemberAdd", async (member) => {
  try {
    // Ignorar bots
    if (member.user.bot) return;

    const guild = member.guild;
    
    // Buscar el rol "Cliente"
    let rolCliente = guild.roles.cache.find((r) => r.name === "Cliente");
    
    if (rolCliente) {
      // Asignar el rol al nuevo miembro
      await member.roles.add(rolCliente);
      console.log(`✅ Rol "Cliente" asignado a ${member.user.tag}`);
    } else {
      console.log(`⚠️ No se encontró el rol "Cliente" en el servidor`);
    }
  } catch (error) {
    console.error("❌ Error al asignar rol de Cliente:", error);
  }
});

// --- COMANDO: !reunion NombreCliente ---
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.channel.id !== process.env.COMMAND_CHANNEL_ID) return;

  if (message.content.startsWith("!reunion")) {
    const args = message.content.split(" ").slice(1);
    const nombre = args.join(" ").trim();
    const guild = message.guild;

    if (!nombre) {
      return message.reply("❌ Debes indicar un nombre, por ejemplo: `!reunion ClienteXYZ`");
    }

    try {
      // Crear rol si no existe
      let rol = guild.roles.cache.find((r) => r.name === nombre);
      if (!rol) {
        rol = await guild.roles.create({
          name: nombre,
          color: "Blue",
          reason: `Rol para cliente ${nombre}`,
        });
      }

      // Crear categoría privada
      const categoria = await guild.channels.create({
        name: nombre,
        type: 4, // categoría
        permissionOverwrites: [
          {
            id: guild.id, // todos
            deny: [PermissionsBitField.Flags.ViewChannel],
          },
          {
            id: rol.id,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.Connect,
              PermissionsBitField.Flags.Speak,
            ],
          },
          {
            id: process.env.ADMIN_ROLE_ID,
            allow: [PermissionsBitField.Flags.ViewChannel],
          },
        ],
      });

      // Crear canales dentro de la categoría
      const canalTexto = await guild.channels.create({
        name: `chat-${nombre.toLowerCase().replace(/\s+/g, "-")}`,
        type: 0, // texto
        parent: categoria.id,
      });

      const canalVoz = await guild.channels.create({
        name: `Reunión ${nombre}`,
        type: 2, // voz
        parent: categoria.id,
      });

      message.reply(`✅ Reunión creada para **${nombre}**.`);
    } catch (error) {
      console.error(error);
      message.reply("⚠️ Error al crear la reunión. Verifica permisos del bot.");
    }
  }
});

// --- EVENTO: cuando alguien entra a un canal de voz ---
client.on("voiceStateUpdate", async (oldState, newState) => {
  const member = newState.member;
  const guild = newState.guild;

  // Ignorar bots
  if (!member || member.user.bot) return;

  // Ignorar admins
  if (member.roles.cache.has(process.env.ADMIN_ROLE_ID)) return;

  // Si la persona se unió a un canal de voz
  if (newState.channel && newState.channel.parent) {
    const categoria = newState.channel.parent;
    const rol = guild.roles.cache.find((r) => r.name === categoria.name);

    if (rol && !member.roles.cache.has(rol.id)) {
      try {
        await member.roles.add(rol);
        console.log(`✅ Rol "${rol.name}" asignado a ${member.user.tag}`);
      } catch (err) {
        console.error("❌ Error asignando rol:", err);
      }
    }
  }
});

client.login(process.env.DISCORD_TOKEN);