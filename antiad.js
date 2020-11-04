module.exports = (bot) => {
    const isInvite = async(guild, code) => {
        return await new Promise((resolve) => {
            guild.fetchInvites().then((invites) => {
                for (const invite of invites) {
                    if(code === invite[0]) {
                    resolve(true)
                    return
        }
       }

resolve(false)
    
        })     
    })
}        
        
    
    bot.on('message', async message => {
        const {guild, member, content} = message

        // discord.gg/XPazxaj

const code = content.split("discord.gg/")[1]

        if (content.includes('discord.gg/')) {
            const isOurInvite = await isInvite(guild, code)
            console.log(isOurInvite)
            if (!isOurInvite) {
                if(message.author.id === message.guild.ownerID) return
                message.delete({timeout: 500}).then(() => message.channel.send("Invite links arent allowed here lmao!   "))
            }
        }
    })
}