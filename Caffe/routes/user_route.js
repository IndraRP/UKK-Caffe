const express = require('express')
const app = express()
const control = require('../controllers/user_controller')
const auth  = require('../controllers/auth')
const {checkRole} = require('../controllers/middleware') 
app.use(express.json())

app.post("/login", control.Login) 
app.post("/logout", control.Logout) 
app.post("/search", auth.authVerify, checkRole(["admin"]), control.searchUser) 

app.post("/add", auth.authVerify, checkRole(["admin"]), control.addUser) 
app.get("/allUser", auth.authVerify, checkRole(["admin"]), control.getAllUser)
app.put("/update/:id", auth.authVerify, checkRole(["admin"]), control.updateUser) 
app.delete("/delete/:id", auth.authVerify, checkRole(["admin"]), control.deleteUser) 

// app.put("/resetpassword/:id", control.resetpassword) 

module.exports = app