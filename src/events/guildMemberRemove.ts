import config from '../../config/config';

import { EmbedBuilder } from '@discordjs/builders';
import { AuditLogEvent, type GuildMember, type TextChannel } from 'discord.js';

import { discord } from '../utils/standardize';

import type { Client } from '../typings/discord';

export default async (client: Client, member: GuildMember): Promise<void> => {
    const kickLog = (await member.guild.fetchAuditLogs({
        type: AuditLogEvent.MemberKick,
        limit: 1
    }))?.entries.first();

    if (kickLog === undefined || kickLog.executor === null || kickLog.targetId !== member.id || kickLog.executor.id === client.user?.id || (new Date().valueOf() - kickLog.createdAt.valueOf()) > 1e3) return;

    const sEmbed = new EmbedBuilder()
        .setAuthor({ name: member.user.tag, iconURL: member.user.avatarURL() ?? member.user.defaultAvatarURL })
        .setDescription(`**<@${member.user.id}> was kicked from the server.**\n\n**Responsible Moderator**\n<@${kickLog.executor.id}>\n\`\`\`${kickLog.executor.id}\`\`\`\n\n**ID**\`\`\`${member.user.id}\`\`\`\n**Reason**\`\`\`${discord(kickLog.reason ?? `No reason provided`)}\`\`\``)
        .setThumbnail(member.user.avatarURL() ?? member.user.defaultAvatarURL)
        .setTimestamp()
        .setFooter({ text: config.footer });

    const logChannel = await client.channels.fetch(config.channels.logs) as TextChannel | null;
    if (logChannel === null) return;

    await logChannel?.send({ embeds: [sEmbed] });
};
