const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required for creating an account."],
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address.'],
        unique: [true, "Email already exists."]
    },
    name: {
        type: String,
        required: [true, "Name is required for creating an account."],
        minlenght: 3
    },
    password: {
        type: String,
        required: [true, "Password is required for creating an account."],
        minlenght: [8, "Password should contain minimum of 8 characters"],
        select: false
    }
}, {
    timestamps: true,
    versionKey: false
});

userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) {
        return next();
    };

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

const User = mongoose.model("User", userSchema);

module.exports = User;