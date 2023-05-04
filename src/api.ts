import Koa from 'koa'
import Router from 'koa-router'
import fs from 'fs'
const app = new Koa()
const router = new Router()
router.get('/', (ctx, next) => {
    ctx.body = fs.readFileSync('index.html').toString()
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(8373)