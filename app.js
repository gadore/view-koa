const isProduction = process.env.NODE_ENV === 'production';
const bodyParser = require('koa-bodyparser');
const Koa = require('koa');
const controller = require('./controller');
const templating = require('./templating');

const app = new Koa();

app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    var
        start = new Date().getTime(),
        execTime;
    await next();
    execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}ms`);
});



if (! isProduction) {
    let staticFiles = require('./static-files');
    app.use(staticFiles('/static/', __dirname + '/static'));
}

app.use(bodyParser());

app.use(templating('view', {
    noCache: !isProduction,
    watch: isProduction
}));

app.use(controller());

app.listen(3000);
console.log('App started at localhost:3000...');




