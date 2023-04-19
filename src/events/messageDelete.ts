import config from '../../config/config';

import { EmbedBuilder } from '@discordjs/builders';
import { ChannelType, type Message, type TextChannel } from 'discord.js';

import { type Client } from '../typings/discord';

export default async (client: Client, message: Message): Promise<void> => {
    if (message.partial) message = await message.fetch(true);

    if (message.author.bot || message.guild === null || message.channel?.type !== ChannelType.GuildText) return;
    if (message.channel.id === config.channels.admin) return;

    const sEmbed = new EmbedBuilder()
        .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() ?? message.author.defaultAvatarURL })
        .setDescription(`**Message sent by <@${message.author.id}> deleted in <#${message.channel.id}>.**\n\n**Content**\n\`\`\`${message.content}\`\`\``)
        .setTimestamp()
        .setFooter({ text: config.footer });

    const logChannel = await client.channels.fetch(config.channels.logs) as TextChannel | null;
    if (logChannel === null) return;

    await logChannel?.send({ embeds: [sEmbed] });
};
