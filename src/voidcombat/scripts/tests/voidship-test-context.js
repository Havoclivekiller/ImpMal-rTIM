import { VoidshipOpposedTestMessageModel } from "./voidship-opposed-test-message-model.js";

export class VoidshipTestContext extends TestContext
{
    static _opposedQueue = new Map();

    static fromData(data) 
    {
        log(`${this.prototype.constructor.name} - Retrieving Context Data`, {args : data});
        let context = foundry.utils.mergeObject(super.fromData(data), {
            characteristic : data.characteristic,
            skill : data.skill, 
            skillItemId : data.skillItemId,
            weaponId : data.weaponId, 
            itemId : data.itemId, 
        });
        log(`${this.prototype.constructor.name} - Context Data Retrieved`, {args : context});
        return context;
    }

    get actorSkill()
    {
        return this.actor.items.get(this.skillItemId) || this.actor.system.skills[this.skill];
    }

    get weapon() 
    {
        return this.actor.items.get(this.weaponId ?? this.itemId);
    }

    get item()
    {
        return this.actor.items.get(this.itemId ?? this.weaponId);
    }


    async handleOpposed(message, fromUpdate=false)
    {
        const queueKey = message?.id || this.opposed || this.actor?.id || foundry.utils.randomID();
        const prior = VoidshipTestContext._opposedQueue.get(queueKey) ?? Promise.resolve();
        const next = prior
            .catch(() => {})
            .then(() => this.#handleOpposedOrdered(message, fromUpdate));
        VoidshipTestContext._opposedQueue.set(queueKey, next);
        return next.finally(() => {
            if (VoidshipTestContext._opposedQueue.get(queueKey) === next) {
                VoidshipTestContext._opposedQueue.delete(queueKey);
            }
        });
    }

    async #handleOpposedOrdered(message, fromUpdate=false)
    {
        if (game.user.isPrimaryGM)
        {
            let opposedMessage = this.findOpposedMessage();
            if (opposedMessage) // If defending
            {
                // Save attacking message for easy retrieval
                if (!this.opposed)
                {
                    this.opposed = opposedMessage.id;
                    this.actor.setFlag("impmal", "opposed", null);
                    this.saveContext(message);
                }

                opposedMessage.system.registerResponse(message);

                // let attackingTest = opposedMessage.attackerMessage.system.test;
                // attackingTest.context.addOpposedResponse(message.id);
                // attackingTest.sendToChat();
            }
            else if (this.targetSpeakers.length) // If attacking
            {
                // If a failed ranged roll auto-marked targets unopposed, allow a successful reroll to recreate opposed tests.
                if (this.opposedFlagsAdded) {
                    if (message?.system?.test?.item?.system?.attackType == "ranged" &&
                        message?.system?.test?.result?.outcome == "success") {
                        this.responses = {};
                        this.opposedFlagsAdded = false;
                    }
                }

                if (Object.keys(this.responses).length != this.targetSpeakers.length)
                {
                    if (!fromUpdate)
                    {
                        await game.dice3d?.waitFor3DAnimationByMessageID(message.id);
                    }
                    // Add Opposing flags to each actor
                    for(let t of this.targets)
                    {
                        if (!this.responses[t.id])
                        {
                            let opposed = await VoidshipOpposedTestMessageModel.createOpposed(message, t.token);
                            t.actor?.setFlag("impmal", "opposed", opposed.id);
                            this.registerOpposed(opposed.id, t.id);
                        }
                    }
                    await this.saveContext();
                }
                else 
                {
                    for(let id of Object.values(this.responses))
                    {
                        let opposed = game.messages.get(id);
                        if (opposed && (opposed.system.unopposed || opposed.system.defenderMessageId))
                        {
                            game.messages.get(id).system.renderContent();
                        }
                    }
                }
                // else 
                // {
                //     // Update each defending test
                //     this.targets.forEach(t => 
                //     {
                //         t.test?.sendToChat({updateOpposed: false});
                //     });
                // }
            }
        }
    }

    findOpposedMessage()
    {
        // If this test is already rolled, the opposed ID is saved, so just retrieve it
        if (this.opposed)
        {
            return game.messages.get(this.opposed);
        }
        else // If new roll, take the opposed flag from the actor to find the message
        {
            let message = game.messages.get(this.actor.getFlag("impmal", "opposed"));
            return message;
        }
    }

    _findOpposedMessage()
    {
        return game.messages.get(this.getFlag("impmal", "opposed"));
    }
}
