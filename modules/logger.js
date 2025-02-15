import chalk from 'chalk';
import moment from 'moment';

const colors = {
    blue: {
        fg: chalk.hex('#0008ff'),
        bg: chalk.bgBlueBright
    },
    green: {
        fg: chalk.hex('#62c073'),
        bg: chalk.bgHex('#62c073')
    },
    red: {
        fg: chalk.redBright,
        bg: chalk.bgRedBright
    },
    orange: {
        fg: chalk.hex('#FFA500'),
        bg: chalk.bgHex('#FFA500')
    },
    purple: {
        fg: chalk.hex('#3c00ff'),
        bg: chalk.bgHex('#8a2be2')
    },
    pink: {
        fg: chalk.hex('#ff0094'),
        bg: chalk.bgHex('#fc03cf')
    }
}

export default class Logger {
    static log(type, message, data = undefined, config = { parseNumber: false, processLine: false }) {
        let logColor = colors.blue

        switch (type) {
            case 'WARN':
                logColor = colors.orange
                break
            case 'ERR':
            case 'BAD':
                logColor = colors.red
                break
            case 'INF':
                logColor = colors.blue
                break
            case 'DONE':
                logColor = colors.purple
                break
            case 'SUCCESS':
                logColor = colors.green
                break
            case 'SLEEP':
                logColor = colors.purple
                break
            case 'SMS':
                logColor = colors.purple
                break
            case 'INSTAGRAM':
                logColor = colors.pink
                break
        }

        const timestamp = logColor.fg(moment().format('HH:mm:ss'));

        if (data) {
            data = Object.keys(data).map((x) => {
                if (typeof data[x] === 'object') data[x] = JSON.stringify(data[x])
                if (!data[x] && data[x] != 0) data[x] = 'No value found'
                return `${chalk.grey(x)} [${logColor.fg(data[x])}]`
            }).join(', ')

            data = `> ${data}`
        }

        const messageNumbers = message?.match(/\d+/g)

        if (messageNumbers && config.parseNumber) {
            message = message.replace(/\d+/g, (match) => {
                return Number(match).toLocaleString('en-US');
            });
        }

        if (data) {
            const dataNumbers = data.match(/\d+/g)

            if (dataNumbers && config.parseNumber) {
                data = data.replace(/\d+/g, (match) => {
                    return Number(match).toLocaleString('en-US');
                });
            }
        }

        let toLog = '';
        if (data) {
            toLog = chalk.bold(chalk.whiteBright(` [${timestamp}] ${this.id ? ' | ' : ''}[${logColor.fg(type)}] ${logColor.fg('>')} ${chalk.grey(message)} ${data}`))
        } else {
            toLog = chalk.bold(chalk.whiteBright(` [${timestamp}] ${this.id ? ' | ' : ''}[${logColor.fg(type)}] ${logColor.fg('>')} ${chalk.grey(message)}`))
        }

        if (type == 'PROMPT')
            return toLog

        config.processLine ? process.stdout.write(toLog + '\r') : console.log(toLog)
    }
}