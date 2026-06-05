import {EMPRESA_MOCK} from '@mocks/embarque';

export function getEmpresaNombre(code: string | number): string {
  const numCode = Number(code);
  const empresa = EMPRESA_MOCK.find(e => e.code === numCode);
  return empresa ? empresa.name : 'Desconocida';
}
