import express from 'express'
import db from './database/connections'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { password } from '../config'

interface Token {
    id: string,
    name: string,
    secundaryName: string,
    avatar: string,
    remember: boolean
}

const routes = express.Router()
const serverPass = password

routes.post('/register', async (request, response) => {
    const {name, secundaryName, email} = request.body

    if (!name || !secundaryName || !email || !request.body.pass) {return response.status(400).json({error: "Deficient request"})}

    const emailCheck = await db.raw("SELECT id FROM users WHERE email = '" + email +"' LIMIT 1;") as []
    if (emailCheck.length !== 0) { return response.status(401).json({error: "E-mail already registered"})}

    const pass = request.body.pass

    await bcrypt.hash(pass, 10, (err, pass) => {
        if (err) {
            return response.status(500).json({error: "Unexpected error while encrypting the password"})
        }

        db("users").insert({name, secundaryName, email, pass})
        .then(() => {
            return response.status(201).json({message: "Successfully registered"})
        })
        .catch((err) => {
            return response.status(500).json({error: "Unexpected error while register database"})
        });
    })
})

routes.post("/login", async (request, response) => {
    const {email, pass: key, remember} = request.body

    if (!email || !key || (typeof remember) === 'undefined') {return response.status(400).json({error: 'Deficient request'})}

    const pass = key

    const results = await db.raw("SELECT id, pass, avatar, name, secundaryName FROM users WHERE email = '" + email + "' LIMIT 1;")

    if (results.length !== 0) {

        await bcrypt.compare(pass, results[0].pass, (err, res) => {
            if (err) {
                return response.status(500).json({error: "Unexpected error in password comparison"})
            }
            if (res) {
                db.raw("UPDATE users SET lasted_login = CURRENT_TIMESTAMP WHERE email = '" + email + "';")
                let token = ''
                if (remember) {
                    token = jwt.sign({
                        id: results[0].id,
                        name: results[0].name,
                        secundaryName: results[0].secundaryName,
                        avatar: results[0].avatar,
                        remember
                    }, serverPass)
                } else {
                    token = jwt.sign({
                        id: results[0].id,
                        name: results[0].name,
                        secundaryName: results[0].secundaryName,
                        avatar: results[0].avatar,
                        remember
                    }, serverPass, {expiresIn: "1day"})
                }
                return response.status(201).json({message: "Successfully authenticated!", token})
            } else {
                return response.status(401).json({error: "Incorrect password", reason: 'pass'})
            }
            
        })
    } else {
        return response.status(401).json({error: "E-mail not registered", reason: 'email'})
    }
})

routes.get("/user", (request, response) => {
    if (!request.header('Authorization')) {return response.status(401).json({error: "Authorization not found"})}

    const token = (request.header('Authorization') as string).split(' ')[1]

    jwt.verify(token, serverPass, async (err) => {
        if (err) {
            return response.status(401).json({error: 'Invalid token'})
        } else {
            const id = (jwt.decode(token) as Token).id
            const query = Object.keys(request.query)
            const avaibleData = ['name', 'secundaryName', 'email', 'bio', 'whatsapp', 'avatar']

            const error = []
            query.map(key => {
                if (avaibleData.findIndex((e) => key === e) === -1) {
                    error[error.length] = key
                }
            })
            if (error.length !== 0) {return response.status(203).json({error: 'This data cannot be accessed'})}

            await db.raw("SELECT " + query.toString() + " FROM users WHERE id = '" + id + "' LIMIT 1;").then((data) => {
                return response.status(200).json(data[0]) 
            }).catch(() => {
                return response.status(500).json({error: 'Unexpecting error'})
            })
        }
    })
})

routes.post("/user", (request, response) => {
    if (!request.header('Authorization')) {return response.status(401).json({error: "Authorization not found"})}

    const token = (request.header('Authorization') as string).split(' ')[1]

    jwt.verify(token, serverPass, async (err) => {
        if (err) {
            return response.status(401).json({error: 'Invalid token'})
        } else {
            const {id, remember} = (jwt.decode(token) as Token)
            const query = Object.keys(request.body)
            const avaibleData = ['name', 'secundaryName', 'email', 'bio', 'whatsapp', 'avatar']

            const error = []
            query.map(key => {
                if (avaibleData.findIndex((e) => key === e) === -1) {
                    error[error.length] = key
                }
            })

            if (error.length !== 0) {return response.status(406).json({error: 'This data cannot be updated'})}
            if (query.length === 0) {return response.status(400).json({error: 'Deficient request'})}

            let SQL = "UPDATE users SET "
            query.map((key) => {
                if (request.body[key] && request.body[key] !== '') {
                    SQL = SQL + key + " = '" + request.body[key] + "',"
                }
            })

            SQL = SQL.replace(/,$/, ' ')
            SQL = SQL + " WHERE id = '" + id + "';"

            await db.raw(SQL).then(() => {}).catch((err) => {
                if (err) {
                    return response.status(500).json({error: 'Unexpeted error'})
                }

                return response.status(400).json({error: 'Deficient request'})
            })

            if (request.header('newToken')) {
                await db.raw("SELECT id, name, secundaryName, avatar FROM users WHERE id = '" + id + "';").then((data) => {
                    var newToken = undefined
                    if (remember) {
                        newToken = jwt.sign({...data[0], remember}, serverPass)
                    } else {
                        newToken = jwt.sign({...data[0], remember}, serverPass, {expiresIn: '1day'})
                    }
                    return response.status(200).json({message: 'Updated successfully', token: newToken})
                }).catch((err) => {
                    return response.status(201).json({message: 'Update complete, but unable to sign in'})
                })
            } else {
                return response.status(200).json({message: 'Updated successfully'})
            }
        }
    })
})

routes.post("/class", (request, response) => {
    if (!request.header('Authorization')) {return response.status(401).json({error: "Authorization not found"})}

    const token = (request.header('Authorization') as string).split(' ')[1]

    jwt.verify(token, serverPass, async (err) => {
        if (err) {
            return response.status(401).json({error: 'Invalid token'})
        } else {
            const user_id = (jwt.decode(token) as Token).id
            const subject = request.body.subject
            const hours = JSON.stringify(request.body.hours)
            const cost = parseInt(request.body.cost)

            if (!subject || !cost || !hours || cost === NaN) { return response.status(400).json({error: "Deficient request"})}

            const SQL = "INSERT INTO classes(subject, cost, hours, user_id) VALUES ('" + subject + "','" + cost + "','" + hours + "','" + user_id + "') " +
            "ON CONFLICT(user_id) DO UPDATE SET subject = '" + subject + "', cost = '" + cost + "', hours = '" + hours +"';"

            await db.raw(SQL).then(() => {
                return response.status(200).json({massage: 'Class updated successfully'})
            }).catch(() => {
                return response.status(500).json({error: 'Unexpecting error'})
            })
        }
    })
})

routes.get("/class", (request, response) => {
    if (!request.header('Authorization')) {return response.status(401).json({error: "Authorization not found"})}

    const token = (request.header('Authorization') as string).split(' ')[1]

    jwt.verify(token, serverPass, async (err) => {
        if (err) {
            return response.status(401).json({error: 'Invalid token'})
        } else {
            const user_id = (jwt.decode(token) as Token).id
            const query = Object.keys(request.query)
            const avaibleData = ['subject', 'cost', 'hours']

            const error = []
            query.map(key => {
                if (avaibleData.findIndex((e) => key === e) === -1) {
                    error[error.length] = key
                }
            })
            if (error.length !== 0) {return response.status(203).json({error: 'This data cannot be accessed'})}

            await db.raw("SELECT " + query.toString() + " FROM classes WHERE user_id = '" + user_id + "' LIMIT 1;").then((data) => {
                const {hours, ...rest } = data[0]
                const result = {...rest, hours: JSON.parse(hours).hours}
                return response.status(200).json(result)
            }).catch(() => {
                return response.status(500).json({error: 'Unexpecting error'})
            })
        }
    })
})

routes.post("/connections", (request, response) => {
    if (!request.header('Authorization')) {return response.status(401).json({error: "Authorization not found"})}

    const token = (request.header('Authorization') as string).split(' ')[1]

    jwt.verify(token, serverPass, async (err) => {
        if (err) {
            return response.status(401).json({error: 'Invalid token'})
        } else {
            const user_id = (jwt.decode(token) as Token).id
            const class_id = parseInt(request.body.class_id)
            
            if (!user_id || !class_id || class_id === NaN) {return response.status(400).json({error: "Deficient request"})}

            await db('connections').insert({user_id, class_id}).then(() => {
                return response.status(201).json({message: "Connection successful"})
            }).catch((err) => {
                if (err) {return response.status(500).json({error: "Unexpected error while creating the connection"})}

                return response.status(500).json({error: "Unexpected error while creating the connection"})
            })
        }
    })
})

routes.get("/connections", (request, response) => {
    if (!request.header('Authorization')) {return response.status(401).json({error: "Authorization not found"})}

    const token = (request.header('Authorization') as string).split(' ')[1]

    jwt.verify(token, serverPass, async (err) => {
        if (err) {
            return response.status(401).json({error: 'Invalid token'})
        } else {
            await db.raw("SELECT COUNT('id') FROM connections").then((result) => {
                return response.status(200).json({connections: result[0]["COUNT('id')"]})
            }).catch(() => {
                return response.status(500).json({error: "Unexpected error"})
            })
        }
    })
})

routes.get("/learn", (request, response) => {
    if (!request.header('Authorization')) {return response.status(401).json({error: "Authorization not found"})}

    const token = (request.header('Authorization') as string).split(' ')[1]

    jwt.verify(token, serverPass, async (err) => {
        if (err) {
            return response.status(401).json({error: 'Invalid token'})
        } else {
            if (request.header('limit') && 0 < parseInt(request.header('limit') as string) && parseInt(request.header('limit') as string) < 50) {
                let result = {user: [], class: []}
        
                if (!request.header('filters')) {
                    let userSQL = "SELECT id, name, secundaryName, bio, avatar, whatsapp FROM users LIMIT " + request.header('limit') + ";"
                    await db.raw(userSQL).then((data) => {
                        result.user = data
                    }).catch( () => {
                        return response.status(500).json({error: 'Unexpeted error'})
                    })
        
                    let classSQL = "SELECT user_id, subject, cost, hours FROM classes WHERE"
                    result.user.map(({id}) => {
                        classSQL = classSQL + " user_id = '" + id + "' OR"
                    })
                    classSQL = classSQL.replace(/OR$/g, " ORDER BY user_id LIMIT " + request.header('limit') + ";")
                    
                    await db.raw(classSQL).then((data) => {
                        result.class = data
                    }).catch( () => {
                        return response.status(500).json({error: 'Unexpeted error'})
                    })
                } else {
        
                    try {
        
                        const {subject, weekDay} = JSON.parse(request.header('filters') as string)
        
                        let classSQL = "SELECT id, user_id, subject, cost, hours FROM classes WHERE"
                        if (subject && weekDay) {
                            classSQL = classSQL + " (hours LIKE '%\"weekDay\":\""+ weekDay +"\"%') AND (subject='"+ subject + "')"
                        } else if (subject && !weekDay) {
                            classSQL = classSQL + " subject='"+ subject + "'"
                        } else if (weekDay && !subject) {
                            classSQL = classSQL + " hours LIKE '%\"weekDay\":\""+ weekDay +"\"%'"
                        } else {
                            return response.status(400).json({error: 'Deficient request'})
                        }
                        classSQL = classSQL + " ORDER BY user_id LIMIT " + request.header('limit') + ";"
        
                        await db.raw(classSQL).then((data) => {
                            result.class = data
                        })
                        
                        let userSQL = "SELECT name, secundaryName, bio, avatar, whatsapp FROM users WHERE "
                        result.class.map(({user_id}) => {
                            userSQL = userSQL + " id = '" + user_id + "' OR"
                        })
                        userSQL = userSQL.replace(/OR$/g, " LIMIT " + request.header('limit') + ";")                
        
                        await db.raw(userSQL).then((data) => {
                            result.user = data
                        })
                    } catch (err) {
                        return response.status(500).json({error: 'Unexpeted error'})
                    }
                    
                }
        
                let classes = [{user_id: undefined, hours: '' || {}}]
                for (let i = 0; i < result.user.length; i++) {
                    classes[i] = Object.assign(result.user[i], result.class[i])
                    classes[i].user_id = undefined
                    classes[i].hours = JSON.parse(classes[i].hours as string).hours
                }
        
                let teachers = 0
                await db.raw("SELECT COUNT('id') FROM classes").then((data) => {
                    teachers = data[0]["COUNT('id')"]
                })
        
                return response.status(200).json({message: 'Connection successful', classes, teachers})
            } else {
                return response.status(400).json({error: 'Deficient request'})
            }
        }
    })
})

export default routes
