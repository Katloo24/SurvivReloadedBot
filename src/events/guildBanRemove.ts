import config from '../../config/config';

import { EmbedBuilder } from '@discordjs/builders';
import { AuditLogEvent, type GuildBan, type TextChannel } from 'discord.js';

import { discord } from '../utils/standardize';

import type { Client } from '../typings/discord';

export default async (client: Client, ban: GuildBan): Promise<void> => {
    const banLog = (await ban.guild.fetchAuditLogs({
        type: AuditLogEvent.MemberBanRemove,
        limit: 1
    }))?.entries.first();

    if (banLog === undefined || banLog.executor === null || banLog.targetId !== ban.user.id || banLog.executor.id === client.user?.id || (new Date().valueOf() - banLog.createdAt.valueOf()) > 5e3) return;

    const sEmbed = new EmbedBuilder()
        .setAuthor({ name: ban.user.tag, iconURL: ban.user.avatarURL() ?? ban.user.defaultAvatarURL })
        .setDescription(`**<@${ban.user.id}> was unbanned from the server.**\n\n**Responsible Moderator**\n<@${banLog.executor.id}>\n\`\`\`${banLog.executor.id}\`\`\`\n\n**ID**\`\`\`${ban.user.id}\`\`\`\n**Reason**\`\`\`${discord(ban.reason ?? `No reason provided`)}\`\`\``)
        .setThumbnail(ban.user.avatarURL() ?? ban.user.defaultAvatarURL)
        .setTimestamp()
        .setFooter({ text: config.footer });

    const logChannel = await client.channels.fetch(config.channels.logs) as TextChannel | null;
    if (logChannel === null) return;

    await logChannel?.send({ embeds: [sEmbed] });
};
