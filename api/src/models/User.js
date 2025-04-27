
const mongoose = require("mongoose")
mongoose.Promise = global.Promise

const modelSchema = new mongoose.Schema({
   name: String,
   email: String,
   state: String,
   passwordHash: String,
   token: String
})

const modelName = "User"

// se já existe conexao
if(mongoose.connection && mongoose.connection.models[modelName]){
   module.exports = mongoose.connection.models[modelName]
// se nao existe , crie uma nova
} else {
   module.exports = mongoose.model(modelName, modelSchema)
}