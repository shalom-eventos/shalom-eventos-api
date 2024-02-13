import { FastifyRequest, FastifyReply } from 'fastify';
import { dayjs } from '@/shared/lib/dayjs';
import { z } from 'zod';
import * as XLSX from 'xlsx';

import { translatePaymentStatus } from '@/shared/utils/translate-payment-status';
import { ListRegistrationsByEventUseCase } from '../../use-cases/list-registrations-by-event-use-case';

export async function exportRegistrationsController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const querySchema = z
    .object({
      type: z.enum(['SERVO', 'PARTICIPANTE']).nullish(),
      eventId: z.string().uuid(),
    })
    .strict();

  const { eventId, type } = querySchema.parse(request.query);

  try {
    const listRegistrations = new ListRegistrationsByEventUseCase();
    const { registrations } = await listRegistrations.execute({
      eventId,
      type: type ? String(type) : undefined,
    });

    // Create a workbook and add a worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet([]);

    // Add headers to the worksheet
    const headers = [
      'DATA DE INSCRIÇÃO',
      'TIPO DE INSCRIÇÃO',
      'NOME COMPLETO',
      'NOME PARA CRACHÁ',
      'EMAIL',
      'WHATSAPP',
      'IDADE',
      'DOCUMENTO',
      'TIPO DE DOCUMENTO',
      'DATA DE NASCIMENTO',
      'CIDADE',
      'ENDEREÇO COMPLETO',
      'GRUPO DE ORAÇÃO',
      'PCD',
      'ALERGIA (MÉDICA OU ALIMENTAR)',
      "JÁ PARTICIPOU DE ALGUM ACAMP'S?",
      'FAZ USO DE ALGUMA MEDICAÇÃO?',
      'COMPROVANTE DE PAGAMENTO',
      'TRANSPORTE PRÓPRIO OU ÔNIBUS',
      'FORMA DE PAGAMENTO',
      'VALOR',
      'LOTE',
      'STATUS',
    ];
    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: 'A1' });

    // Add data to the worksheet
    registrations.forEach((registration) => {
      const participantData = registration?.participant;

      let addressData;
      let fullAddress;
      if (registration?.participant?.addresses?.length > 0) {
        addressData = registration?.participant?.addresses[0];
      } else if (
        registration?.participant?.user?.addresses &&
        registration?.participant?.user?.addresses?.length > 0
      ) {
        addressData = registration?.participant?.user?.addresses[0];
      }

      if (addressData) {
        fullAddress = `${addressData.street}, nº ${addressData.streetNumber}, ${
          addressData.complement ? addressData.complement + ', ' : ''
        }${addressData.district}, ${addressData.city} - ${
          addressData.state
        }, CEP: ${addressData.zipCode}`;
      }

      const rowData = [
        dayjs(registration.createdAt).utc().format('DD/MM/YYYY HH:mm'),
        registration.type,
        participantData.fullName,
        registration.credentialName,
        participantData.email,
        participantData.phoneNumber,
        participantData?.birthdate
          ? dayjs(new Date()).utc().diff(participantData?.birthdate, 'years')
          : '-',
        participantData.documentNumber,
        participantData.documentType,
        dayjs(participantData?.birthdate).utc().format('DD/MM/YYYY'),
        addressData?.city ?? '-',
        fullAddress,
        participantData.prayerGroup ?? '-',
        participantData.pcdDescription ?? 'Não',
        participantData.allergyDescription ?? 'Não',
        registration.hasParticipatedPreviously ? 'Sim' : 'Não',
        participantData.medicationUseDescription ?? 'Não',
        `https://api.shalomsobral.com.br/files/${registration.payment?.file}`,
        registration.transportationMode,
        registration.payment?.paymentMethod,
        registration.payment?.price,
        '1º Lote', //registration.payment?.eventTicketId,
        translatePaymentStatus(registration.payment?.status),
      ];

      XLSX.utils.sheet_add_aoa(ws, [rowData], { origin: -1 });
    });

    // Add worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');

    // Write the workbook to a buffer
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

    // Set the response headers for Excel download
    reply
      .header(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      )
      .header('Content-Disposition', 'attachment; filename=participants.xlsx')
      .send(buf);

    return reply;
  } catch (error) {
    reply.status(500).send(error);
  }
}
