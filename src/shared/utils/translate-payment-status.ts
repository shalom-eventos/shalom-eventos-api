const translateStatus = {
  waiting: 'Aguardando pagamento',
  sent: 'Enviado',
  approved: 'Aprovado',
  refused: 'Recusado',
};

type StatusType = keyof typeof translateStatus;

export function translatePaymentStatus(originalStatus: string = 'waiting') {
  return translateStatus[originalStatus as StatusType];
}
