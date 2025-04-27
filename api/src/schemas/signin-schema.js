const { z } = require("zod")

const SigninSchema = z.object({
   email: z.string().email({ message: "Email inválido "}),
   password: z.string().min(2, {message: "Senha muito curta"}),
})
 
  

module.exports = SigninSchema