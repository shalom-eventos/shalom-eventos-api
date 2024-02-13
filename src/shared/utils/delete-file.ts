import fs from 'fs';
import path from 'path';

export async function deleteFile(fileName: string) {
  const directoryPath = path.join(
    __dirname, // shalom-eventos-api\src\shared\utils
    '..', // shalom-eventos-api\src\shared\
    '..', // shalom-eventos-api\src\
    '..', // shalom-eventos-api\
    'tmp'
  );
  const filePath = path.join(directoryPath, fileName);
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Arquivo ${filePath} apagado com sucesso`);
    } else {
      console.log(`O arquivo ${filePath} não existe`);
    }
  } catch (err) {
    console.error(`Erro ao apagar o arquivo ${filePath}:`, err);
  }
}
