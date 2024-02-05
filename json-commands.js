function convertSubcommand(subCommand) {
    const integerOptions = subCommand.options?.integers.map(opt => ({...opt, type: 4}))
    const attachmentOptions = subCommand.options?.attachments.map(opt => ({...opt, type: 11}))
    // const stringOptions = subCommand.options?.strings.map(opt => ({...opt, type: ?}))
    // const booleanOptions = subCommand.options?.booleans.map(opt => ({...opt, type: ?}))
    // const numberOptions = subCommand.options?.numbers.map(opt => ({...opt, type: ?}))
    return {
        ...subCommand,
        type: 1,
        options: [...integerOptions, ...attachmentOptions].sort((a,b) => Number(a.required) - Number(b.required))
    }
}

module.exports = {
    convertToDiscJson(command) {
        // const commObj = JSON.parse(command);
        const commObj = {
            ...command,
            options: [
                ...command.subCommands.map(convertSubcommand)
            ]
        };
        delete commObj.subCommands
        return commObj;
    }
}