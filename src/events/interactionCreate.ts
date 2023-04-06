import { ChannelType, type Interaction } from 'discord.js';

import log from '../utils/log';

import { type Client } from '../typings/discord';
import Queue from '../modules/Music/Queue';

export default async (client: Client, interaction: Interaction): Promise<void> => {
    if (interaction.isChatInputCommand() && interaction.guild !== null && interaction.channel?.type === ChannelType.GuildText) {
        // Grab the command from the handler.
        const cmd = client.commands?.get(interaction.commandName);

        // If the command doesn't exist, return.
        if (cmd == null) return;

        // Create queue if nonexistent for a guild.
        if (interaction.commandName === `play` ||
            interaction.commandName === `skip` ||
            interaction.commandName === `pause` ||
            interaction.commandName === `resume` ||
            interaction.commandName === `stop` ||
            interaction.commandName === `queue` ||
            interaction.commandName === `nowplaying`
        ) {
            if (client.queue === undefined) return;
            if (client.queue.get(interaction.guild.id) === undefined) client.queue.set(interaction.guild.id, new Queue(interaction.guild.id));
        }

        // Execute the command.
        log(`magenta`, `${interaction.user.tag} [${interaction.user.id}] ran command ${interaction.commandName} in ${interaction.guild.name}.`);
        cmd.run(client, interaction);
    }
};
