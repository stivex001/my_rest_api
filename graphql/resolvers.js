const User = require("../models/userModel")
const bcrypt = require('bcryptjs')


module.exports = {
    createUser: async function({userInput}, req) {
        // const email = args.userInput.email
        const existinUser = await User.findOne({email: userInput.email})
        if (existinUser) {
            const error = new Error('oops!! User exixts already')
            throw error
        }
        const hashedPw = await bcrypt.hash(userInput.password, 10)
        const user = new User ({
            email: userInput.email,
            name: userInput.name,
            password: hashedPw
        })
        const createdUser = await user.save()
        return {...createdUser._doc, _id: createdUser._id.toString()}
    }
}