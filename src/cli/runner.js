import Vorpal from 'vorpal'

let configureVorpal = () => {
    let vorpal = new Vorpal();
    vorpal
        .default('publish', 'Publishes registered scripts')
        .alias('pub', 'p')
        .option('--profile [profile]', 'Authentication profile name, `default` if not set')
        .action(function(command, args) { this.log('Not implemented yet :O') });
    vorpal
        .command('authenticate')
        .alias('auth', 'a')
        .option('--account-id [account-id]', 'VoxImplant account id')
        .option('--account-name [account-name]', 'VoxImplant account name')
        .option('--account-email [account-email]', 'VoxImplant account email')
        .option('--admin-id [admin-id]', 'Admin account id')
        .option('--admin-name [admin-name]', 'Admin account name (login)')
        .option('--api-key [api-key]', 'Account API key')
        .option('--password [password]', 'Account password')
        .option('--session-id [session-id]', 'Existing VoxImplant session ID')
        .option('--profile [profile]', 'Authentication profile name, `default` if not set')
        .action(function(command, args) { this.log('Not implemented yet :O') });
    return vorpal;
};


/**
 * @class
 * @constructor
 */
class Runner {

    static run(argv) {
        return configureVorpal().parse(argv)
    }
}

export default Runner;