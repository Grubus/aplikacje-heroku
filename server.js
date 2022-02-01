const express = require("express")
const app = express()
const PORT = process.env.PORT || 3000;
const hbs = require('express-handlebars');
const path = require("path")

app.use(express.static('static'))
app.set('views', path.join(__dirname, 'layout/views'));
app.engine('hbs', hbs.engine({ defaultLayout: 'template.hbs' }));
app.set('view engine', 'hbs');
app.use(express.urlencoded({
    extended: true
}));
const USERS = [
    { id: 0, login: "admin", password: "admin", age: 18, student: false, gender: "M" },
]

let ADMIN = false

app.get("/", function(req, res) {
    res.render("main.hbs")
})

app.get("/register", function(req, res) {
    res.render("register.hbs")
})

app.get("/login", function(req, res) {
    res.render("login.hbs")
})

app.get("/admin", function(req, res) {
    if (ADMIN) {
        res.render("admin.hbs", { layout: "basic-template.hbs" })
    } else {
        res.render("admin-rejected.hbs", { layout: "basic-template.hbs" })
    }
})

app.get("/logout", function(req, res) {
    ADMIN = false
    res.redirect("/")
})

app.get("/gender", function(req, res) {
    let list = [
        [],
        []
    ]
    USERS.forEach(e => {
        if (e.gender == "M") {
            list[0].push(e)
        } else {
            list[1].push(e)
        }
    })
    console.log(list)
    res.render("gender.hbs", { layout: "basic-template.hbs", list })
})

app.get("/show", function(req, res) {
    let list = USERS
    res.render("show.hbs", { layout: "basic-template.hbs", list })
})

app.get("/sort", function(req, res) {
    let list = { sort: req.query.sort == "false" ? false : true, users: [...USERS] }
    console.log(list.sort)
    if (list.sort) {
        list.users.sort((a, b) => {
            return a.age - b.age
        })
    } else {
        list.users.sort((a, b) => {
            return b.age - a.age
        })
    }
    res.render("sort.hbs", { layout: "basic-template.hbs", list })
})

app.post("/register", function(req, res) {
    let { login, password, age, student, gender } = req.body
    USERS.push({ id: USERS.length, login, password, age, student, gender })
    res.send(`Użytkownik ${login} został poprawnie utworzony.`)
})

app.post("/login", function(req, res) {
    let { login, password } = req.body
    if (USERS.some(e => {
            return e.login === login && e.password === password
        })) {
        ADMIN = true
        res.redirect("/admin")
    } else {
        res.redirect("/login")
    }
})
app.listen(PORT, function() {
    console.log("start serwera na porcie " + PORT)
})