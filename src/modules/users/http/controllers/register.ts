import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

import { UserAlreadyExistsError } from '@modules/users/use-cases/errors/user-already-exists-error';
import { RegisterUseCase } from '../../use-cases/register';

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z
    .object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(8),
      passwordConfirmation: z.string().min(8),
    })
    .strict()
    .refine((data) => data.password === data.passwordConfirmation, {
      message: "Passwords don't match",
      path: ['passwordConfirmation'],
    });

  const { name, email, password } = registerBodySchema.parse(request.body);

  try {
    const registerUseCase = new RegisterUseCase();
    await registerUseCase.execute({
      name,
      email,
      password,
    });
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      reply.status(409).send({ message: err.message });
    }
    throw err;
  }

  return reply.status(201).send();
}
