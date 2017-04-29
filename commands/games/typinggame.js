const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const sentences = require('./sentences');

module.exports = class TypingGameCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'typinggame',
            group: 'games',
            memberName: 'typinggame',
            description: 'See how fast you can type a sentence in a given time limit.',
            args: [{
                key: 'difficulty',
                prompt: 'What should the difficulty of the typing game be? `Easy`, `Medium`, `Hard`, `Extreme`, or `Impossible`?',
                type: 'string',
                validate: difficulty => {
                    if (['easy', 'medium', 'hard', 'extreme', 'impossible'].includes(difficulty.toLowerCase()))
                        return true;
                    return 'Please set the difficulty to either `easy`, `medium`, `hard`, `extreme`, or `impossible`.';
                },
                parse: difficulty => difficulty.toLowerCase()
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm')
            if (!message.channel.permissionsFor(this.client.user).has('EMBED_LINKS'))
                return message.say('This Command requires the `Embed Links` Permission.');
        const { difficulty } = args;
        const sentence = sentences[Math.floor(Math.random() * sentences.length)];
        let time;
        switch (difficulty) {
            case 'easy':
                time = 25000;
                break;
            case 'medium':
                time = 20000;
                break;
            case 'hard':
                time = 15000;
                break;
            case 'extreme':
                time = 10000;
                break;
            case 'impossible':
                time = 5000;
                break;
        }
        const embed = new RichEmbed()
            .setTitle(`You have **${time / 1000}** seconds to type:`)
            .setDescription(sentence);
        await message.embed(embed);
        try {
            const collected = await message.channel.awaitMessages(response => response.author.id === message.author.id, {
                max: 1,
                time: time,
                errors: ['time']
            });
            if (collected.first().content !== sentence)
                return message.say('Nope, your sentence does not match the original. Try again next time!');
            return message.say(`Good Job! You won!`);
        } catch (err) {
            return message.say('Aw... Too bad, try again next time!');
        }
    }
};
