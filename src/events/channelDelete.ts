import config from '../../config/config';

import { EmbedBuilder } from '@discordjs/builders';
import { AuditLogEvent, type GuildChannel, type TextChannel } from 'discord.js';

import { discord } from '../utils/standardize';

import type { Client } from '../typings/discord';

export default async (client: Client, channel: GuildChannel): Promise<void> => {
    const channelLog = (await channel.guild.fetchAuditLogs({
        type: AuditLogEvent.ChannelDelete,
        limit: 1
    }))?.entries.first();

    if (channelLog === undefined || channelLog.executor === null) return;

    const sEmbed = new EmbedBuilder()
        .setAuthor({ name: channelLog.executor.tag, iconURL: channelLog.executor.avatarURL() ?? channelLog.executor.defaultAvatarURL })
        .setDescription(`**Channel Deleted**\n\`${channel.name}\`\n\n**Responsible Moderator**\n<@${channelLog.executor.id}>${channelLog.reason !== null ? `\n\n**Reason**\`\`\`${discord(channelLog.reason)}\`\`\`` : ``}`)
        .setThumbnail(channelLog.executor.avatarURL() ?? channelLog.executor.defaultAvatarURL)
        .setTimestamp()
        .setFooter({ text: config.footer });

    const logChannel = await client.channels.fetch(config.logChannel) as TextChannel;
    await logChannel?.send({ embeds: [sEmbed] });
};
