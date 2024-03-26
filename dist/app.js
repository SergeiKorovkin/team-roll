"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("config"));
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const auth_routes_1 = __importDefault(require("./src/routes/auth.routes"));
const user_routes_1 = __importDefault(require("./src/routes/user.routes"));
const bets_routes_1 = __importDefault(require("./src/routes/bets.routes"));
const path_1 = __importDefault(require("path"));
const mongoose = require('mongoose');
const app = (0, express_1.default)();
let http = false;
let httpsOptions = {};
try {
    httpsOptions = {
        key: fs_1.default.readFileSync('/etc/letsencrypt/live/lmru-returns.ru/privkey.pem'),
        cert: fs_1.default.readFileSync('/etc/letsencrypt/live/lmru-returns.ru/fullchain.pem'),
    };
}
catch (e) {
    http = true;
}
const isProd = process.env.NODE_ENV === 'production';
app.use(express_1.default.json({ limit: '3mb' }));
app.use('/api/user', user_routes_1.default);
app.use('/api/auth', auth_routes_1.default);
app.use('/api/bets', bets_routes_1.default);
// Настройте express для обслуживания файлов из .well-known/acme-challenge для https
app.use('/.well-known/acme-challenge', express_1.default.static(path_1.default.join(__dirname, '.well-known', 'acme-challenge')));
if (isProd) {
    app.use('/', express_1.default.static(path_1.default.join(__dirname, '..', 'client', 'build')));
    app.get('*', (req, res) => {
        res.sendFile(path_1.default.resolve(__dirname, '..', 'client', 'build', 'index.html'));
    });
}
const PORT = config_1.default.get('port') || 5005;
async function start() {
    try {
        await mongoose.connect(config_1.default.get('mongoURL'));
        if (isProd) {
            if (http) {
                app.listen(PORT, () => console.log(`App has been started on port  ${PORT}...`));
            }
            else {
                https_1.default.createServer(httpsOptions, app).listen(PORT, () => {
                    console.log(`HTTPS server started on port ${PORT}...`);
                });
            }
        }
        else {
            app.listen(PORT, () => console.log(`App has been started on port  ${PORT}...`));
        }
    }
    catch (e) {
        console.log('Server error: ', e.message);
        process.exit(1);
    }
}
start();
//# sourceMappingURL=app.js.map