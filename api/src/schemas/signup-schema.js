const { z } = require("zod")

const SignupSchema = z.object({
   name: z.string().min(2, {message: "Nome inválido"}).trim(),
   email: z.string().email({ message: "Email inválido "}),
   password: z.string().min(2, {message: "Senha muito curta"}),
   state: z.string().nonempty({message: "Estado não pode estar vazio!"})
})

module.exports = SignupSchema