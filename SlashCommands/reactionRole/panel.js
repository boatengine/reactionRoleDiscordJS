const rrModel = require('../../models/reactionRole');
const { Client, CommandInteraction, Interaction, InviteGuild, MessageEmbed, Message, MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = {
    name: "panel",
    description: "reaction role panel",
    userPermissions: ["ADMINISTRATOR"],

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    run: async(client, interaction) => {
        const guildData = await rrModel.findOne({
            guildId: interaction.guildId
        });
        if (!guildData?.roles)
            return interaction.followUp(
                "There is no roles inside of this server!"
            );

        const options = guildData.roles.map(x => {
            const role = interaction.guild.roles.cache.get(x.roleId);

            return {
                label: role.name,
                value: role.id,
                description: x.roleDescription || "No description",
                emoji: x.roleEmoji,
            }
        });

        const panelEmbed = new MessageEmbed()
            .setTitle('ระบบเลือกเพศ')
            .setColor('AQUA')

        const components  = [
            new MessageActionRow().addComponents(
                new MessageSelectMenu()
                    .setCustomId('reaction-roles')
                    .setPlaceholder('เลือกเพศของคุณ')
                    .setMaxValues(1)
                    .addOptions(options)
            )
        ];
        interaction.followUp({ embeds: [ panelEmbed ], components  });


    }

};