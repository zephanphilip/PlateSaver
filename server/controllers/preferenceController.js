const Preferences = require('../models/preferencesModel')
const mongoose = require('mongoose');

//set a preferences
const setPreferences = async (req, res) =>{    
    //add doc to db
    try{
        const preferences = req.body;
        console.log("Received Preferences:", preferences);
        const newPreferences = new Preferences(preferences)
        const saveRecord =await newPreferences.save()
        res.status(200).json(saveRecord)
    }catch(error){
        res.status(400).json(error)
    }
}


module.exports = {setPreferences}
