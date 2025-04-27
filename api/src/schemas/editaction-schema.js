const { z } = require("zod")


const editActionSchema = z.object({
   token: z.string({ message: "Token inválido"}),
   name: z.string().min(2, {message: "Nome inválido"}).trim().optional(),
   email: z.string().email({ message: "Email inválido "}).optional(),
   password: z.string().min(2, {message: "Senha muito curta"}).optional(),
   state: z.string().nonempty({message: "Estado não pode estar vazio!"}).optional()
})

module.exports = editActionSchema