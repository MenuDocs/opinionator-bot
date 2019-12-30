const { Client } = require("discord.js")
const { stripIndents } = require("common-tags")
const client = new Client()

client.on("ready", () => {
    console.log(`Congratulations, ${client.user.username} is online!`)
    client.user.setActivity("$help", { type: "WATCHING" })
});

client.on("message", async ({ author, guild, content, channel, }) => {
    if(author.bot || !content.startsWith(prefix) || !guild) return;

    const prefix = "$"
    const args = content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    switch(cmd) {
        case "ops":
            const category = guild.channels.find(category => category.type === "category" && category.name === "ops");
            if(!category) return channel.send("Please create an `ops` category.");
            const regex = new RegExp("^(http|https)://", "i");
            if(!args[0] || !regex.test(args[0])) return channel.send("Please provide a valid url to a project you wish to obtain opinions on.");

            const role = guild.roles.find(role => role.name === "Designer");
            if(!role) return channel.send("Please create a Designer role.");

            const schannel = await guild.createChannel(`ops-${author.username}`, { type: "textchannel" }).catch(console.error);
            await schannel.setParent(category.id).catch(console.error);

            schannel.send(`[ ${role} ] Please share your opinions on this: ${args[0]}`);
        break;

        case "opsclose":
            if(!["ops"].some(category => channel.name.includes(category))) return channel.send("This isnt an ops channel.");
            channel.delete();
        break;

        case "help":
            channel.send(stripIndents`
            Commands:
            [ ops ] - Creates channel for opinions and pings the developer role.
            [ opsclose ] - Deletes channel the command is invoked in.

            ( Developed by Connor#4767 )
            `);
        break;
    }

});

client.login(process.env.TOKEN)