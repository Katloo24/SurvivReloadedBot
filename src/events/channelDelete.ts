import config from '../../config/config';

import { EmbedBuilder } from '@discordjs/builders';
import { AuditLogEvent, ChannelType, type DMChannel, type GuildChannel, type TextChannel } from 'discord.js';

import { discord } from '../utils/standardize';

import type { Client } from '../typings/discord';

export default async (client: Client, channel: DMChannel | GuildChannel): Promise<void> => {
    if (channel.type === ChannelType.DM) return;

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

    const logChannel = await client.channels.fetch(config.channels.logs) as TextChannel | null;
    if (logChannel === null) return;

    await logChannel?.send({ embeds: [sEmbed] });
};
