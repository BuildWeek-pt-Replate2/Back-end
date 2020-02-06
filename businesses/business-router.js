
const bcrypt = require("bcryptjs")
const BusinessModel = require("../businesses/business-model")
const authenticate = require("../middleware/authenticate")
const {signToken} = require("../businesses/business-token")

const router = require("express").Router()

router.get("/", authenticate, async (req, res, next) => {
    try {
        const businesses = await BusinessModel.list()
        
        return res.status(201).json(businesses)

    } catch (err) {
        next(err)
    }

})

router.get("/:id", authenticate, async (req, res, next) => {
    try {
        const { id } = req.params
        const profile = await BusinessModel.findById(id)

        if (profile) {
            return res.status(200).json(profile) //always included status(200) for successes.
        } else {
            return res.status(404).json({ message: "Could not find profile with this Id." })
        }
    }
    catch (err) {
        next(err)
    }
})

router.put("/:id", authenticate, async (req, res, next) => {
    try {
        const { id } = req.params //returns an object
        const business = await BusinessModel.update(id, req.body)

        if (business) {
            res.json(business)
        } else {
            return res.status(404).json({
                message: "Could not find business with given ID",
            })
        }
    } catch (err) {
        next(err)
    }
})

router.post("/register", async (req, res, next) => {
    try {
        const businessUser = await BusinessModel.insert(req.body)
        const token = signToken(businessUser)

        return res.status(200).json({
            token,
            message: `Welcome ${businessUser.username}!`
        })

    } catch (err) {
        next(err)
    }
})

router.post("/login", async (req, res, next) => {
    try{
        const { username, password } = req.body
        
        const user = await BusinessModel.findBy({ username })
        .first()

        if (user && bcrypt.compare(password, user.password)) {
            const token = signToken(user)

            return res.status(200).json({
                token,
                message: `Welcome ${user.username}!`
            })
        } else {

            return res.status(401).json({ message: "Invalid credentials, please try again."})
        }
 
    } catch (err) {
        next (err)
    }
})

router.get("/protected", authenticate, async (req, res, next) => {
    try {

        return res.status(200).json({ message: "You are authorized.", })
    } catch (err) {
        next(err)
    }
})

router.delete("/:id", authenticate, async (req, res, next) => {
    try {
        const { id } = await db("business")
            .where({ id: req.params.id })
            .del()
        return res.status(200).json({ id: req.params.id })
    }
    catch (err) {
        next(err)
    }
})

function authorizeUser(role) {
    return function (req, res, next) {
        if (req.token && role === req.token.role) {
            next()
        } else {

            return res.status(403).json({ message: "You are not authorized." })
        }
    }
}

module.exports = router;