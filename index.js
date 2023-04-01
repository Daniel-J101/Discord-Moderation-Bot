const express = require("express")
const app = express()
const ms = require('ms')
const prettyMilliseconds = require("pretty-ms")
const fs = require('fs')
const { MessageEmbed } = require('discord.js');

app.get("/", (req, res) => {
  res.send("hello hello!")
})

app.listen(3000, () => {
  console.log("Project is ready!")
})

let Discord = require("discord.js")
let client = new Discord.Client()

const prefix = "!"
var massMentionOn = true;
var logImages = true;
var massJoin = false;
var filter = true;
var admin = true;
var server = true;
const warns = {}
var authorCheck = null;
var joined = [];
let warning = false;
let ran = false;
var count = 0;
var myMessage;
var theString;
var channel;
var activeDeaf = false;
var myStringArray = ["й","ц","у","к","е","н","г","ш","щ","з","х","ъ","э","ж","д","о","л","р","п","а","в","ы","ф","я","ч","с","м","и","т","ь","б","ю","@everyone","@here"];
var bannedWords = ["dumb"];

fs.readFile('words.txt', 'utf8' , (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  for(var wrd of data.split(", ")) {
    if(wrd!='') {
      bannedWords.push(wrd);
    }
  }  
})


client.on("ready", () => {
  client.user.setPresence({ status: "dnd" })
      setInterval(() => {
        client.user.setActivity(`Uptime: ${prettyMilliseconds(client.uptime)}`, { type: 'WATCHING' });
    }, 10000); // Runs this every 10 seconds.
    client.setMaxListeners(300);
})

client.on('guildMemberAdd', (member) => {
  if(massJoin == false) return;
  if(member.guild.id != process.env['server']) return;
  var dupe = false;
  
  for(let i = 0; i < joined.length; i++) {
    if(joined[i].user.id == member.user.id) {
      dupe = true;
    }
  }
  if(dupe == false) {
  joined.push(member)
  if(joined.length >= 15) {
    warning = true;
    for(let i = 0; i < joined.length; i++) {
      warn(joined[i], "You were flagged for massmention. If you are not a bot rejoin the server in 3 minutes. ")
      joined[i].kick("flagged for massjoin")
      member.guild.fetchInvites().then(invites => invites.each(invite => {
      invite.delete();
      }))
      // message.guild.roles.fetch(process.env['user'])
      // .then(role => role.setPermissions(['SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'ADD_REACTIONS', 'USE_EXTERNAL_EMOJIS', 'READ_MESSAGE_HISTORY', 'CONNECT', 'SPEAK', 'STREAM', 'USE_VAD']))
    }
      // message.guild.roles.fetch('875404517628313646')
      // .then(role => role.setPermissions(['SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'ADD_REACTIONS', 'USE_EXTERNAL_EMOJIS', 'READ_MESSAGE_HISTORY', 'CONNECT', 'SPEAK', 'STREAM', 'USE_VAD']))       
  }
  if(warning == true && ran == false) {
      log("massjoin flag")
      ran = true;       
  }
  }
  setInterval(() => {
    if(joined.length != 0) {
    joined = [];
    console.log("cleared")
    }
    warning = false;
    ran = false;
  }, 180000); // Runs this every 3 minutes.
})


client.on("guildMemberRemove", member => {
  if(member.guild.id != process.env['server']) return;
  const channelLog = member.guild.channels.cache.find(
    channel => channel.name === "join-log"
  );
  channelLog.send(`${member.user.username} ${member} left`);
});

client.on("message", message => {
  if(message.author.bot) return;
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();  
  if(message.channel.type === 'dm') {
    if(message.author.id != "731989728458440764") {
      if(message.content.startsWith(prefix) && command != "order" && command != "orders" && command != "jvm") {
      message.channel.send("Insufficient permissions")
      return;
      }
      return;
    }
  } else {
  if((!message.content.startsWith(prefix) || !message.member.permissions.has("ADMINISTRATOR"))) { return; }
  }

  const info = args.shift();
  if(command === "kickbots") {
    let k = 0;
    let j = 0;
    console.log("working...")
    message.channel.send("working...")
    message.guild.members.fetch().then(members => members.each(member => {
      k++;
      if(member.roles.cache.size == 1 && !member.permissions.has("ADMINISTRATOR") && !member.roles.cache.some(role => role.name === 'customer')) {
        // member.kick("no roles \(raid\)")
        member.kick("not verified")
        
        j++;
      }
      }))
      setTimeout(function () {
        console.log(j + " bots of " + k + " members found")
        message.channel.send("Kicked " + j + " members")
      }, ms("15s"))      
  }
//server & admin locked commands
if(message.channel.type === 'dm') {
  if(message.author.id != "731989728458440764") {
    return;
  }
} else {
  if(serverCheck(message) == false) return;
}
  if(command === "massmention") {
      if(massMentionOn == false) {
        massMentionOn = true;
        message.channel.send("Enabled")
      } else {
        massMentionOn = false;
        message.channel.send("Disabled")
      }
  }
  if(command === "log") {
    if(logImages == false) {
      logImages = true;
      message.channel.send("Enabled")
    } else {
      logImages = false;
      message.channel.send("Disabled")
    }
  }
  if(command === "filter") {
    if(filter == false) {
      filter = true;
      message.channel.send("Enabled")
    } else {
      filter = false;
      message.channel.send("Disabled")
    }
  }  
  if(command === "massjoin") {
    if(massJoin == false) {
      massJoin = true;
      message.channel.send("Enabled")
    } else {
      massJoin = false;
      message.channel.send("Disabled")
    }
  }
  if(command === "admin") {
    if(admin == false) {
      admin = true;
      message.channel.send("Enabled")
    } else {
      admin = false;
      message.channel.send("Disabled")
    }    
  }
  if(command === "server") {
    if(server == false) {
      server = true;
      message.channel.send("Enabled")
    } else {
      server = false;
      message.channel.send("Disabled")
    }
  }
  if(command === "add") {
    var confirm = true;
    if(message.content.slice(message.content.indexOf("d") + 3).length == 0) {
        message.channel.send("You need a second argument for what you want to add to the filter")
        return;
    }
    let word = message.content.substring(message.content.indexOf("d") + 3, message.content.length);
    for(based of bannedWords) {
      if(word == based) {
        message.channel.send("This word is already in the filter!")
        confirm = false;
      }
    }
    if(confirm == false) return;
    bannedWords.push(word); 
    message.channel.send("Added \`" + word + "\` to the filter");
    var goodText = word + ", "
    fs.appendFile('words.txt', goodText, function (err) {
      if (err) {
      message.channel.send("Failed saving word to file")
      } else {
      
      }
      })
  }
  if(command === "check") {
    var oMessage = message.content
    let word = message.content.substring(message.content.indexOf("k") + 2, message.content.length);
    var checkedMessage = checkMsg(word.toLowerCase());    
    message.channel.send(oMessage + " translated to \`" + checkedMessage + "\`")    
  }
  if(command === "rep") {
    var oMessage = message.content
    let word = message.content.substring(message.content.indexOf("p") + 2, message.content.length);

    message.channel.send(word);    
  }
  if(command === "lock") {
    var everyone = message.guild.roles.everyone;

    message.channel.updateOverwrite(everyone, {
      SEND_MESSAGES: false
    }, 'channel locked by ' + message.author.tag
    )    .catch(console.error);
    message.channel.send("#"+message.channel.name + " locked");
    log(message.channel.name + " locked by " + message.author.tag);
  }
  if(command === "unlock") {
    var everyone = message.guild.roles.everyone;
    
    message.channel.updateOverwrite(everyone, {
      SEND_MESSAGES: null
    }, 'channel unlocked by ' + message.author.tag
    )    .catch(console.error); 
    message.channel.send("#"+message.channel.name + " unlocked")
    log(message.channel.name + " unlocked by " + message.author.tag);   
  }
  if(command === "masskick") {
    let b = 0;
    let c = 0;
    if(message.content.slice(message.content.indexOf("k") + 5).length == 0) {
        message.channel.send("You need a second argument for what you want to look for in member names")
        message.channel.send("Make sure the argument isn't too vague to where it will ban users! ")
        return;
    }
    let person = message.content.substring(message.content.indexOf("k") + 5, message.content.length);
    console.log("Banning members with " + person + " in their name");
    message.channel.send("Banning members with " + person + " in their name")
    console.log("working...")
    message.channel.send("working...")
    message.guild.members.fetch().then(members => members.each(member => {
      b++;
        if(member.user.bot || member.permissions.has("ADMINISTRATOR")) {
          console.log(member.user.username + " is a bot or admin")
        } else {
          if(member.user.username.includes(person)) {
          c++;
          member.ban({   reason: "masskick for members with " + person + " in their name by " + message.author.username    })
          }
        }
      }))
    setTimeout(function () {
        console.log(c + " members of " + b + " members found")
        message.channel.send("Banned " + c + " members of " + b + " found")
      }, ms("15s"))     
  }
  if(command === "namecheck") {
    let b = 0;
    let c = 0;
    if(message.content.slice(message.content.indexOf("k") + 2).length == 0) {
        message.channel.send("You need a second argument for what you want to look for in member names...")
        message.channel.send("Make sure the argument isn't too vague to where it will ban users. ")
        return;
    }        
    let person = message.content.substring(message.content.indexOf("k") + 2, message.content.length);
    console.log("working...")
    message.channel.send("working...")
    message.guild.members.fetch().then(members => members.each(member => {
      b++;
        if(member.user.bot || member.permissions.has("ADMINISTRATOR")) {
          console.log(member.user.username + " is a bot or admin")
        } else {
          if(member.user.username.includes(person)) {
          c++;
          }
        }
      }))
        setTimeout(function () {
        console.log(c + " members of " + b + " members found")
        message.channel.send("Found " + c + " members of " + b)
        }, ms("15s"))     
  }
  if(command === "botcheck") {
    let j = 0;
    let k = 0;
    console.log("working...")
    var msg = message.channel.send("working...")
    message.guild.members.fetch().then(members => members.each(member => {
      k++;
      if(member.roles.cache.size == 1 && !member.permissions.has("ADMINISTRATOR") && !member.roles.cache.some(role => role.name === 'user')) {
        j++;
      }
      }))
      setTimeout(function () {
        console.log(j + " bots of " + k + " members found")
        message.channel.send(j + " bots of " + k + " members found")
      }, ms("15s"))
  }
  if(command === "listwarn") {
    var target = message.mentions.users.first();
    if(target) {
      reply(message, target.tag + " has " + listWarnings(target) + " warning\(s\)");
    } else {
      message.channel.send("Can't find that member, make sure you mention them.")
    }
  }
  if(command === "clearwarn") {
    var target = message.mentions.users.first();
    if(target) {
      resetWarnings(target)
      reply(message, "Cleared warnings for " + target.tag)
    } else {
      message.channel.send("Cant find that member, make sure you mention them.")
    }
  }
  if(command === "jvm") {
    if(message.mentions.users.first() != undefined) {
    var target = message.mentions.users.first();
  if(message.channel.type != 'dm') {
    message.delete({ timeout: 1000 })
  }
    target.send("JVM args:")
    target.send("\`-XX:+DisableAttachMechanism -Xmx4G -XX:+UnlockExperimentalVMOptions -XX:+UseG1GC -XX:G1NewSizePercent=20 -XX:G1ReservePercent=20 -XX:MaxGCPauseMillis=50 -XX:G1HeapRegionSize=32M\`")
    message.channel.send("JVM successfully sent.")
    }
  }
  if(command === "dm") {
    if(message.mentions.users.first() != undefined) { 
    if(message.content.slice(message.content.indexOf(">") + 2).length == 0) {
        return;
    }
      var target = message.mentions.users.first();
      let msg = message.content.substring(message.content.indexOf(">") + 2, message.content.length);
      target.send(msg)
      message.channel.send("DM successfully sent.")    
    }
  }

  if(command === "help") {
    message.channel.send("\`\`\`!kickbots - kicks everyone without roles\`\`\`\`\`\`!botcheck - information about kickbots command\`\`\`\`\`\`!massmention - enables mass mention punishments\`\`\`\`\`\`!massjoin - enables mass join checks\`\`\`\`\`\`!masskick - kicks everyone with a specificed string in their name. If the argument is too vague it will ban actual users.\`\`\`\`\`\`!namecheck - checks how many people would be banned if you ran !masscheck. \(admin/bot\) not included\`\`\`\`\`\`!log - enables attachment logging\`\`\`\`\`\`!ping - status\`\`\`\`\`\`!add - adds and saves a word to the filter\`\`\`\`\`\`!lock - stops chatting in the channel msg was sent\`\`\`\`\`\`!listwarn <@user> - lists how many warnings a member has\`\`\`\`\`\`!clearwarn <@user> - clears a member's warnings\`\`\`\`\`\`!nuke - nukes a channel\`\`\`\`\`\`!jvm (user command) - sends member the jvm args\`\`\`\`\`\`!jvm <@user> (admin command) - sends jvm to user\`\`\`\`\`\`!help - list of commands\`\`\`")
  }
  if(command === "nuke") {
      message.channel.clone().then(channel => {
        channel.setPosition(message.channel.position)
        log(channel.name + " was nuked by " + message.author.tag)
      })
        setTimeout(function () {
          message.channel.delete();
        }, ms("0.25s"))
  }
  if(command === "uptime") {
    message.channel.send(`Uptime: \`${prettyMilliseconds(client.uptime, {compact: true})}\``)
  }
  if(command === "deafen") {
    var counti = 0;
    if(message.member.voice.channel == null) {
      message.channel.send("Member not in vc... Active deafen enabled upon vc join");
      activeDeaf = true;
      channel = message;
      return;
    } else {
      channel = message;
      activeDeaf = true;
    }
    for (const [memberID, member] of channel.member.voice.channel.members) {
      if(!member.permissions.has("ADMINISTRATOR")) {
        member.voice.setDeaf(true, `${message.member.user.tag}`)
        counti++;
      }
    }
    message.channel.send("Deafened " + counti + " people");    
  }
  if(command === "undeafen") {
    activeDeaf = false;
    const goodChannel = message.member.voice.channel;
    var counte = 0;
    if(goodChannel == null) {
      message.channel.send("You aren't in a vc!");
      return;
    }    
    for (const [memberID, member] of goodChannel.members) {
      if(member.voice.serverDeaf) {
        member.voice.setDeaf(false, `${message.member.user.tag}`)
        counte++;
      }
    }    
    message.channel.send("Undeafened " + counte + " people");

  }     
  if(command === "clearinv") {
    message.guild.fetchInvites().then(invites => {
      if(invites.size === 0) {
        message.channel.send(`There were no invites to delete`)
      } else {
        message.channel.send(`Deleted ${invites.size} invites`)
      }
    console.log(`Fetched ${invites.size} invites`)            
    })
    message.guild.fetchInvites().then(invites => invites.each(invite => {
    invite.delete();
    }))  
  }
})

client.on("message", message => {
    //image logs
  if(message.author.bot) return;
  if(logImages) {
  if(message.channel.type === 'dm') return;
  if(serverCheck(message) == false) return;
  if(message.author.bot) return; 
      try {
  if (message.attachments.array()[0] != undefined) {
    var attachment = new Discord.MessageAttachment(message.attachments.array()[0].url)
    let channel = client.channels.cache.array().find(ch => ch.isText() && ch.name === "bot-log")
    if(message.member.permissions.has("ADMINISTRATOR")) {
    channel.send("logged from " + message.author.tag + " \(" + message.author.id + "\)", attachment) 
    } else {
    channel.send("logged from <@" + message.author + "> \(" + message.author.id + "\)", attachment) 
    }
        }
    } catch (e) {
      
    }
  }
//turn on
if(message.author.bot) return;
if(massMentionOn) {
    if(message.channel.type === 'dm') return;
    if(serverCheck(message) == false) return;
      if(message.author.bot || message.member.permissions.has("ADMINISTRATOR")) return;
      if(message.mentions.members.array().length >= 4) {
      let amount = warns[message.author]  
      if(amount === undefined || amount === null) {
          amount = 1
          warns[message.author] = amount 
           warn(message.author, "You\'ve received a warning in \`" + message.guild.name + "\` for mass mentioning \n \n**The next violation will result in a mute**")
          log("<@" + message.author + "> \(" + message.author + "\) was warned for mass mentioning. They have " + warns[message.author] + " warning\(s\)." )
        } else {
          amount += 1
          warns[message.author] = amount
          let muteRole = message.guild.roles.cache.find(role => role.name === 'muted')
          let memberTarget = message.guild.members.cache.get(message.author.id);
          memberTarget.roles.add(muteRole.id);
          message.channel.send("\`" + message.author.username + "\` was muted for 12 hours.").then(msg => {msg.delete({ timeout: 6000 })})
          setTimeout(function () {
            memberTarget.roles.remove(muteRole.id);
            log(message.author.username + "> \(" + message.author + "\)" + " was unmuted after 12 hours.");
          }, ms("12h"))
          warn(message.author, "\n\nYou were muted in \`" + message.guild.name + "\` for 12 hours")
          log("<@" + message.author + "> \(" + message.author + "\) was muted for mass mentioning. They have " + warns[message.author] + " warning\(s\).")
          resetWarnings(message.author)
          }
          setTimeout(function () {
            resetWarnings(message.author);
            log(message.author.username + "\'s violations were reset after 12 hours.")
          }, ms("12h"))
     }
}
})
client.on("message", message => {
  //support commands
  if(message.author.bot) return;
  if(message.channel.type != 'dm') {return;}  
  const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();
  if(command === "orders" || command === "order") {
      let randomChannel = client.channels.cache.array().find(ch => ch.isText() && ch.name === "configs-list" && ch.id === "899661278778372188");
    randomChannel.messages.fetch({ limit: 1}).then(messages => {
      let time = messages.first().createdAt;
      let order = messages.first().content;
      let bigTime = time.getMonth()+1 + '/' + time.getDate() + '/' + time.getFullYear();
      message.author.send(order + " was last updated on " + bigTime + "\nif it needs to be updated dm an administrator")
      log("config was sent to " + '\`' + message.author.username + '\`');
      
    })
  }
})
client.on("message", message => {
  //filter
  if(filter == false) return;
  if(message.author.bot) return;
  if(message.channel.type == 'dm') {return;} else {
    if(server && serverCheck(message) == false) return;
    }  
  if(admin == true) {
      if(message.member.permissions.has("ADMINISTRATOR") || message.member.roles.cache.some(role => role.name === 'robot')) return;  
  }

  var oMessage = message.content
  var found = false;
  var checkedMessage = checkMsg(message.content.toLowerCase());
  for(var word of bannedWords) {
    if(found == true) return;
    if(oMessage.includes(word)) {
      var embed = new MessageEmbed()
      .setColor('#fcd612')
      .setDescription(message.author.username + ": " + oMessage + " Was flagged for \`" + word + "\`");
      message.delete().catch(err => console.log("Failed to delete msg."));
      log(embed)
      found = true;      
    } else if(checkedMessage.includes(word)) {
      var embed = new MessageEmbed()
      .setColor('#fcd612')
      .setDescription(message.author.username + ": " + oMessage + " translated to \`" + checkedMessage + "\`. Was flagged for \`" + word + "\`");
      message.delete().catch(err => console.log("Failed to delete msg."));
      log(embed)
      found = true;
    }
  }

})
client.on("messageUpdate", (oldMessage, newMessage) => {
  //edit filter
  if(filter == false) return;
  if(newMessage.author.bot) return;
  if(newMessage.channel.type == 'dm') {return;} else {
    if(server && serverCheck(newMessage) == false) return;
    }  
  if(admin == true) {
      if(newMessage.member.permissions.has("ADMINISTRATOR") || newMessage.member.roles.cache.some(role => role.name === 'robot')) return;  
  }

  var oMessage = newMessage.content
  var found = false;
  var checkedMessage = checkMsg(newMessage.content.toLowerCase());
  for(var word of bannedWords) {
    if(found == true) return;
    if(checkedMessage.includes(word)) {
      var embed = new MessageEmbed()
      .setColor('#fcd612')
      .setDescription(newMessage.author.username + ": " + oMessage + " translated to \`" + checkedMessage + "\`. Was flagged for \`" + word + "\`");
      newMessage.delete().catch(err => console.log("Failed to delete msg."));
      log(embed)
      found = true;
    }
  }
})
client.on('voiceStateUpdate', (oldMember, newMember) => {
  let newUserChannel = newMember.channelID;
  let oldUserChannel = oldMember.channelID; 
  //if a user isn't joining the active voice channel or the active deafen is inactive leave the method 
  if(newUserChannel == oldUserChannel || newUserChannel == null || !activeDeaf || newMember.id == "839217342944772127") return;
  if(newUserChannel == channel.member.voice.channel.id) 
  { 
    if(!newMember.member.permissions.has("ADMINISTRATOR")) {
      newMember.setDeaf(true, `${channel.member.user.tag}\'s Active !deafen`)
    }
    // User joined the active voice channel
  }
})
client.on('voiceStateUpdate', (oldMember, newMember) => {
  if(activeDeaf && newMember.id == "839217342944772127") {
    const channels = newMember.guild.channels.cache.filter(c => c.id == newMember.channelID && c.type === 'voice');

    for (const [channelID, eChannel] of channels) {
      for (const [memberID, member] of eChannel.members) {
        if(!member.voice.serverDeaf && !member.permissions.has("ADMINISTRATOR"))
        member.voice.setDeaf(true, `${channel.member.user.tag}\'s Active !deafen`)
          .then(() => console.log(`Deafened ${member.user.tag}.`))
          .catch(console.error);
      }
    }    
  }
})


client.login(process.env['token'])
function log(text) {
  //have to do server check every instance
  let channel = client.channels.cache.array().find(ch => ch.isText() && ch.name === "bot-log")
   channel.send(text)
}
function warn(person, message) {
  person.send(message)
}
function resetWarnings(user) {
  delete warns[user]
}
function listWarnings(user) {
  if(warns[user] != undefined) {
    return warns[user];
  } else {
    return 0;
  }
}
function sendDM(user, text) {
  user.send(text);
}
function serverCheck(message) {
  if(message.guild.id == process.env['server']) {
    return true;
  } else {
    return false;
  }

}
function reply(message, text) {
  client.api.channels[message.channel.id].messages.post({
    data: {
    content: text,
    allowed_mentions: {
      parse: []
    },
    message_reference: {
    message_id: message.id,
    channel_id: message.channel.id,
    guild_id: message.guild.id
    }
    }
    })
}

function deleteMessages(amount) {
	return new Promise(resolve => {
		if (amount > 10) throw new Error('You can\'t delete more than 10 Messages at a time.');
		setTimeout(() => resolve('Deleted 10 messages.'), 2000);
	});
}

function checkMsg(text) {
  var arr = text.split('')
  var checkedMsg = "";
  for(var lett of arr) {
    switch(lett) {
        case '1':
        case '!':  
        case 'ì':
        case 'í': 
        case 'î':
        case 'ï':
        case 'ī':
        case 'į':
        case 'ı':
        case '¡':
        case 'і':
        checkedMsg += "i";
        break;

        case 'В':
        checkedMsg += "b";
        break;

        case 'ė': 
        case 'ę':
        case 'ě':
        case 'ĕ': 
        case 'ə': 
        case 'è':
        case 'é': 
        case 'ê': 
        case 'ë': 
        case 'ē': 
        case '£': 
        case '€':
        case '3':
        case 'е':  
        case 'е':
        checkedMsg += "e";
        break;   

        case 'ü':
        case 'û':
        case 'ú':
        case 'ù':
        case 'ū':
        case 'ů':
        case 'ű':
        case 'ų':
        checkedMsg += "u";
        break;

        case 'ò':
        case 'ó':
        case 'ô':
        case 'õ':
        case 'ö': 
        case 'ø':
        case 'ő':
        case 'œ':
        case 'о':  
        case '0':
        checkedMsg += "o";
        break;  

        case 'å':
        case 'à':
        case 'á':
        case 'æ':
        case 'â':
        case 'ā':
        case 'ã':
        case 'ă': 
        case 'ä':
        case 'ą':
        case 'а':
        case '@':  
        case '4':
        checkedMsg += "a";
        break;
        
        case 'ß':
        case '§':
        case 'ś':
        case 'š':
        case 'ş':
        case 'ѕ':
        checkedMsg += "s";
        break;
        
        case 'ď':
        case 'đ':
        case 'д':  
        checkedMsg += "d";
        break;
        
        case 'ģ':
        case 'ğ':
        case 'г':   
        checkedMsg += "g";
        break;  

        case 'ķ':
        case 'к':
        checkedMsg += "k";
        break;
        
        case 'ŕ':
        case 'ř':
        checkedMsg += "r";
        break;
        
        case 'ĺ':
        case 'ļ':
        case 'ľ':
        case 'ł':
        case 'л':  
        checkedMsg += "l";
        break;

        case 'ź':
        case 'ż':
        case 'ž':
        checkedMsg += "z";
        break;
        
        case 'ç':
        case 'ć':
        case 'č':
        case 'с':
        checkedMsg += "c";
        break;    

        case 'ñ':
        case 'ń':
        case 'ņ':
        case 'ň':
        case 'и':  
        case 'н':
        checkedMsg += "n";
        break;
        
        case '¥':
        case 'у':
        case 'ÿ':
        checkedMsg += "y";
        break;
      
        case "м":
        checkedMsg += "m";
        break;

        case 'р':
        checkedMsg += "p"
        break; 

        case 'a':
        case 'b':
        case 'c':
        case 'd':
        case 'e':
        case 'f':
        case 'g':
        case 'h':
        case 'i':
        case 'j':
        case 'k':
        case 'l':
        case 'm':
        case 'n':
        case 'o':
        case 'p':
        case 'q':
        case 'r':
        case 's':
        case 't':
        case 'u':
        case 'v':
        case 'w':
        case 'x':
        case 'y':
        case 'z':
        checkedMsg += lett;
        break; 

        case ' ':
        case '_':
        case '*':
        case '|':
        case '.':  
        break; 

        default:
        // checkedMsg+=lett;       
    }
  }
  return checkedMsg;
}