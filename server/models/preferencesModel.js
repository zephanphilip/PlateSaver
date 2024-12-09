const mongoose = require('mongoose')


const Schema = mongoose.Schema


const preferencesSchema = new Schema({
    username: String,
    dietary: String,
    cuisine: String,
    spiceLevel: String,
    cookingTime: String,
    culinarySkills: String,
    allergies: String,})

module.exports = mongoose.model('Preferences', preferencesSchema)