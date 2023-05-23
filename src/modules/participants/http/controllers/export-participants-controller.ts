import { FastifyRequest, FastifyReply } from "fastify";
import { makeListParticipantsWithUserUseCase } from "../../use-cases/factories/make-list-participants-with-user-use-case";
import * as csv from "fast-csv";

export async function exportParticipantsController(
  _request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const listParticipants = makeListParticipantsWithUserUseCase();

    const { participants } = await listParticipants.execute();

    // Create a CSV stream writer
    const csvStream = csv.format({ headers: true });

    // Write each user as a CSV row
    participants.forEach((participant) => {
      csvStream.write({
        NomeCompleto: participant.full_name,
        Telefone: participant.phone_number,
        Nascimento: participant.birthdate,
        NumDocumento: participant.document_number,
        TipoDocumento: participant.document_type,
        Responsavel: participant.guardian_name,
        ResponsavelTelefone: participant.guardian_phone_number,
        GrupoOracao: participant.prayer_group,
        TipoComunidade: participant.community_type,
        PCD: participant.pcd_description,
        Alergias: participant.allergy_description,
      });
    });

    // End the CSV stream
    csvStream.end();

    // Set the response headers for CSV download
    reply.header("Content-Type", "text/csv");
    reply.header(
      "Content-Disposition",
      "attachment; filename=participants.csv"
    );

    // Send the CSV data as the response
    reply.send(csvStream);

    return reply;
  } catch (error) {
    reply.status(500).send(error);
  }
}
