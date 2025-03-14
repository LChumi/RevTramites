import {Destinatario} from '@models/destinatario';

export interface Emails {
  id:            string;
  tipo:          number;
  descripcion:   string;
  destinatarios: Destinatario[];
}
