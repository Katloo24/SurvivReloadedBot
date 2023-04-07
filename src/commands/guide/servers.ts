import config from '../../../config/config';

import { SlashCommandBuilder } from '@discordjs/builders';
import {
    type ChatInputCommandInteraction,
    EmbedBuilder
} from 'discord.js';

import { type Client } from '../../typings/discord';

const cmd: SlashCommandBuilder = new SlashCommandBuilder()
    .setName(`servers`)
    .setDescription(`View servers hosting Surviv Reloaded.`);

const run = async (client: Client, interaction: ChatInputCommandInteraction): Promise<void> => {
    if (interaction.guild === null || interaction.guild.rulesChannel === null) return;

    const sEmbed = new EmbedBuilder()
        .setColor(config.colors.orange)
        .setAuthor({ name: `Resurviv.io Servers`, iconURL: interaction.guild?.iconURL() ?? undefined })
        .setDescription(`A list of servers hosting Surviv Reloaded.\nIf you are looking for the beta server, click [here](https://test.resurviv.io).`)
        .addFields([
            {
                name: `North America`,
                value: `[resurviv.io](https://resurviv.io)`
            },
            {
                name: `Europe`,
                value: `[eu.resurviv.io](https://eu.resurviv.io)`
            },
            {
                name: `Asia`,
                value: `[as.resurviv.io](https://as.resurviv.io)`
            }
        ])
        .setTimestamp()
        .setFooter({ text: config.footer });

    await interaction.reply({
        embeds: [sEmbed]
    });
};

export {
    cmd,
    run
};
