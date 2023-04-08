import config from '../../config/config';

import { EmbedBuilder } from '@discordjs/builders';
import { ChannelType, type TextChannel, type Message } from 'discord.js';

import findUser from '../utils/findUser';
import { int } from '../utils/randomizer';

import { type Client } from '../typings/discord';
import { discord } from '../utils/standardize';

export default async (client: Client, message: Message): Promise<void> => {
    if (message.author.bot || message.guild === null || message.channel?.type !== ChannelType.GuildText) return;

    if (message.channel.id !== config.channels.welcome) {
        const dbUser = await findUser(client, message.author);
        if (!dbUser.banned && new Date().valueOf() - dbUser.cooldowns.xp > config.cooldowns.messages.xp) {
            dbUser.cooldowns.xp = new Date().valueOf();
            dbUser.xp += Math.floor(int(45, 100) / 4);

            await dbUser.save();
        }

        const xpNeeded = Math.floor((100 * Math.E * dbUser.level) / 2);
        if (dbUser.xp > xpNeeded) {
            dbUser.level++;
            dbUser.xp -= xpNeeded;

            const sEmbed = new EmbedBuilder()
                .setColor(config.colors.blue)
                .setAuthor({ name: `Level Up`, iconURL: message.author.avatarURL() ?? message.author.defaultAvatarURL })
                .setDescription(`**${discord(message.author.tag)}** just reached **Level ${dbUser.level}**!`)
                .setFooter({ text: config.footer });

            await dbUser.save();
            await (await client.channels.fetch(config.channels.levelUp) as TextChannel)?.send({ embeds: [sEmbed] });
        }
    }
};
